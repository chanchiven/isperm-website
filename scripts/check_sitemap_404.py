#!/usr/bin/env python3
"""
解析 sitemap.xml 中的所有 URL，并批量检查它们是否返回 404。
"""

import argparse
import sys
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urljoin

try:
    import requests
except ImportError:
    print("请先安装 requests: pip install requests")
    sys.exit(1)

# Sitemap XML 命名空间
SITEMAP_NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
DEFAULT_SITEMAP_URL = "https://www.isperm.com/sitemap.xml"


def fetch_sitemap(url: str) -> str:
    """获取 sitemap 内容"""
    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        return resp.text
    except requests.RequestException as e:
        raise SystemExit(f"获取 sitemap 失败: {e}")


def parse_urls_from_sitemap(xml_content: str, base_url: str) -> list[str]:
    """
    从 sitemap XML 中解析出所有 URL。
    支持 sitemap index（包含多个 sitemap）和普通 sitemap。
    """
    urls = []
    root = ET.fromstring(xml_content)

    # 尝试带命名空间解析
    for elem in root.iter():
        tag = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag
        if tag == "loc" and elem.text:
            url = elem.text.strip()
            if url and not url.endswith(".xml"):
                urls.append(url)
            elif url and url.endswith(".xml"):
                # 这是 sitemap index 中的子 sitemap，递归获取
                try:
                    sub_content = fetch_sitemap(url)
                    urls.extend(parse_urls_from_sitemap(sub_content, base_url))
                except Exception as e:
                    print(f"  警告: 无法获取子 sitemap {url}: {e}", file=sys.stderr)

    return list(dict.fromkeys(urls))  # 去重


def check_url(url: str, timeout: int = 10) -> tuple[str, int | None, str | None]:
    """
    检查单个 URL 的 HTTP 状态码。
    返回 (url, status_code, error_message)
    先尝试 HEAD，若返回 405 则回退到 GET（部分服务器不支持 HEAD）
    """
    try:
        resp = requests.head(url, timeout=timeout, allow_redirects=True)
        if resp.status_code == 405:
            resp = requests.get(url, timeout=timeout, allow_redirects=True, stream=True)
        return (url, resp.status_code, None)
    except requests.RequestException as e:
        return (url, None, str(e))


def main():
    parser = argparse.ArgumentParser(description="检查 sitemap 中的 URL 是否返回 404")
    parser.add_argument(
        "--sitemap",
        default=DEFAULT_SITEMAP_URL,
        help=f"sitemap URL (默认: {DEFAULT_SITEMAP_URL})",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=10,
        help="并发检查的线程数 (默认: 10)",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=10,
        help="每个请求的超时秒数 (默认: 10)",
    )
    args = parser.parse_args()

    print(f"正在获取 sitemap: {args.sitemap}")
    xml_content = fetch_sitemap(args.sitemap)

    print("正在解析 URL...")
    urls = parse_urls_from_sitemap(xml_content, args.sitemap)
    print(f"共找到 {len(urls)} 个 URL\n")

    if not urls:
        print("未找到任何 URL")
        return

    not_found = []
    errors = []
    ok_count = 0

    print("正在批量检查...")
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {executor.submit(check_url, url, args.timeout): url for url in urls}
        for i, future in enumerate(as_completed(futures), 1):
            url, status, err = future.result()
            if err:
                errors.append((url, err))
                print(f"  [{i}/{len(urls)}] 错误: {url} - {err}")
            elif status == 404:
                not_found.append(url)
                print(f"  [{i}/{len(urls)}] 404: {url}")
            else:
                ok_count += 1
                if (i % 5 == 0) or i == len(urls):
                    print(f"  [{i}/{len(urls)}] 已检查...")

    # 汇总
    print("\n" + "=" * 50)
    print("检查结果汇总")
    print("=" * 50)
    print(f"总计: {len(urls)} 个 URL")
    print(f"正常: {ok_count} 个")
    print(f"404:  {len(not_found)} 个")
    print(f"错误: {len(errors)} 个")

    if not_found:
        print("\n返回 404 的 URL:")
        for u in not_found:
            print(f"  - {u}")

    if errors:
        print("\n请求失败的 URL:")
        for u, e in errors:
            print(f"  - {u}: {e}")

    sys.exit(1 if (not_found or errors) else 0)


if __name__ == "__main__":
    main()
