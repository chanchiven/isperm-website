#!/usr/bin/env python3
"""Generate article translations from messages/articles/en.json into messages/articles/{locale}.json"""

from __future__ import annotations

import json
import re
import time
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EN_PATH = ROOT / "messages" / "articles" / "en.json"
OUT_DIR = ROOT / "messages" / "articles"

LOCALES = {
    "es": "es",
    "ar": "ar",
    "de": "de",
    "it": "it",
    "pt": "pt",
    "ru": "ru",
    "tr": "tr",
    "fr": "fr",
    "pl": "pl",
    "nl": "nl",
    "ko": "ko",
    "ja": "ja",
    "vi": "vi",
    "id": "id",
    "uk": "uk",
    "bg": "bg",
    "ro": "ro",
}

SECTION_TITLES = {
    "es": "Artículo",
    "ar": "مقال",
    "de": "Artikel",
    "it": "Articolo",
    "pt": "Artigo",
    "ru": "Статья",
    "tr": "Makale",
    "fr": "Article",
    "pl": "Artykuł",
    "nl": "Artikel",
    "ko": "기사",
    "ja": "記事",
    "vi": "Bài viết",
    "id": "Artikel",
    "uk": "Стаття",
    "bg": "Статия",
    "ro": "Articol",
}

PUBLISHED = {
    "es": "Mayo de 2026",
    "ar": "مايو 2026",
    "de": "Mai 2026",
    "it": "Maggio 2026",
    "pt": "Maio de 2026",
    "ru": "Май 2026",
    "tr": "Mayıs 2026",
    "fr": "Mai 2026",
    "pl": "Maj 2026",
    "nl": "Mei 2026",
    "ko": "2026년 5월",
    "ja": "2026年5月",
    "vi": "Tháng 5 năm 2026",
    "id": "Mei 2026",
    "uk": "Травень 2026",
    "bg": "Май 2026",
    "ro": "Mai 2026",
}

AUTHOR = {
    "es": "Equipo médico y editorial de isperm.com",
    "ar": "فريق isperm.com الطبي والتحريري",
    "de": "Medizinisches & Redaktionsteam von isperm.com",
    "it": "Team medico e editoriale di isperm.com",
    "pt": "Equipe médica e editorial da isperm.com",
    "ru": "Медицинская и редакционная команда isperm.com",
    "tr": "isperm.com Tıbbi ve Editöryal Ekibi",
    "fr": "Équipe médicale et éditoriale d'isperm.com",
    "pl": "Zespół medyczny i redakcyjny isperm.com",
    "nl": "Medisch en redactieteam van isperm.com",
    "ko": "isperm.com 의학 및 편집팀",
    "ja": "isperm.com 医療・編集チーム",
    "vi": "Nhóm Y khoa & Biên tập isperm.com",
    "id": "Tim Medis & Editorial isperm.com",
    "uk": "Медична та редакційна команда isperm.com",
    "bg": "Медицински и редакционен екип на isperm.com",
    "ro": "Echipa medicală și editorială isperm.com",
}

SKIP_KEYS = {"image", "link", "type"}
PRESERVE_PATTERNS = [
    re.compile(r"\[Insert Link: isperm\.com / Your Product Page\]"),
    re.compile(r"isperm\.com"),
    re.compile(r"Spermmaxxing"),
    re.compile(r"Fertilitymaxxing"),
    re.compile(r"CoQ10"),
    re.compile(r"Looksmaxxing"),
]

PLACEHOLDER_TOKEN = "⟦PH{0}⟧"


def protect(text: str) -> tuple[str, list[str]]:
    preserved: list[str] = []

    def repl(m: re.Match) -> str:
        preserved.append(m.group(0))
        return PLACEHOLDER_TOKEN.format(len(preserved) - 1)

    out = text
    for pat in PRESERVE_PATTERNS:
        out = pat.sub(repl, out)
    return out, preserved


def restore(text: str, preserved: list[str]) -> str:
    out = text
    for i, val in enumerate(preserved):
        out = out.replace(PLACEHOLDER_TOKEN.format(i), val)
    return out


def chunk_text(text: str, max_len: int = 4500) -> list[str]:
    if len(text) <= max_len:
        return [text]
    parts: list[str] = []
    current = ""
    for segment in re.split(r"(<[^>]+>)", text):
        if len(current) + len(segment) > max_len and current:
            parts.append(current)
            current = segment
        else:
            current += segment
    if current:
        parts.append(current)
    return parts


def translate_text(text: str, translator) -> str:
    if not text or not text.strip():
        return text
    if text.startswith("/") or text.startswith("http"):
        return text

    protected, tokens = protect(text)
    chunks = chunk_text(protected)
    translated_chunks: list[str] = []
    for chunk in chunks:
        if not chunk.strip() or re.fullmatch(r"(<[^>]+>|\s|⟦PH\d+⟧)+", chunk):
            translated_chunks.append(chunk)
            continue
        try:
            translated_chunks.append(translator.translate(chunk))
        except Exception as exc:  # noqa: BLE001
            print(f"  warn: translate chunk failed: {exc}")
            translated_chunks.append(chunk)
        time.sleep(0.15)
    return restore("".join(translated_chunks), tokens)


def walk(node, translator, locale: str, path: str = ""):
    if isinstance(node, dict):
        result = {}
        for key, value in node.items():
            if key in SKIP_KEYS:
                result[key] = value
                continue
            if key == "author":
                result[key] = AUTHOR.get(locale, value)
                continue
            if key == "published":
                result[key] = PUBLISHED.get(locale, value)
                continue
            result[key] = walk(value, translator, locale, f"{path}.{key}")
        return result
    if isinstance(node, list):
        return [walk(item, translator, locale, path) for item in node]
    if isinstance(node, str):
        if path.endswith(".intro") or "Author:" in node:
            intro = node
            intro = intro.replace("isperm.com Medical &amp; Editorial Team", AUTHOR[locale])
            intro = intro.replace("isperm.com Medical & Editorial Team", AUTHOR[locale])
            intro = intro.replace("<strong>Author:</strong>", f"<strong>{translate_text('Author:', translator)}</strong>")
            intro = intro.replace("<strong>Published:</strong>", f"<strong>{translate_text('Published:', translator)}</strong>")
            intro = intro.replace("May 2026", PUBLISHED[locale])
            return translate_text(intro, translator)
        return translate_text(node, translator)
    return node


def main():
    try:
        from deep_translator import GoogleTranslator
    except ImportError:
        print("Installing deep-translator...")
        import subprocess

        subprocess.check_call(["pip", "install", "deep-translator", "-q"])
        from deep_translator import GoogleTranslator

    en = json.loads(EN_PATH.read_text(encoding="utf-8"))

    for locale, target in LOCALES.items():
        out_path = OUT_DIR / f"{locale}.json"
        if out_path.exists() and out_path.stat().st_size > 10000:
            print(f"skip {locale} (already exists)")
            continue

        print(f"translating {locale} -> {target}...")
        translator = GoogleTranslator(source="en", target=target)
        data = deepcopy(en)
        data["sections"]["article"]["title"] = SECTION_TITLES[locale]
        data["articles"] = walk(data["articles"], translator, locale, "articles")

        out_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"  wrote {out_path}")

    print("done")


if __name__ == "__main__":
    main()
