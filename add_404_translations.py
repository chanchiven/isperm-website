#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
为所有语言添加 404 页面翻译
"""

import json
import sys
from pathlib import Path

# 设置输出编码为 UTF-8
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

LANGUAGES = ['es', 'ar', 'de', 'it', 'pt', 'ru', 'tr', 'fr', 'pl', 'nl', 'ko', 'ja', 'vi', 'id', 'uk', 'bg', 'ro']

# 翻译文本
TRANSLATIONS = {
    'es': {
        'title': 'Página no encontrada',
        'description': 'La página que buscas no existe o ha sido movida.',
        'backToHome': 'Volver al inicio',
        'statusCode': '404'
    },
    'ar': {
        'title': 'الصفحة غير موجودة',
        'description': 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
        'backToHome': 'العودة إلى الصفحة الرئيسية',
        'statusCode': '404'
    },
    'de': {
        'title': 'Seite nicht gefunden',
        'description': 'Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.',
        'backToHome': 'Zur Startseite',
        'statusCode': '404'
    },
    'it': {
        'title': 'Pagina non trovata',
        'description': 'La pagina che stai cercando non esiste o è stata spostata.',
        'backToHome': 'Torna alla home',
        'statusCode': '404'
    },
    'pt': {
        'title': 'Página não encontrada',
        'description': 'A página que você está procurando não existe ou foi movida.',
        'backToHome': 'Voltar ao início',
        'statusCode': '404'
    },
    'ru': {
        'title': 'Страница не найдена',
        'description': 'Страница, которую вы ищете, не существует или была перемещена.',
        'backToHome': 'Вернуться на главную',
        'statusCode': '404'
    },
    'tr': {
        'title': 'Sayfa bulunamadı',
        'description': 'Aradığınız sayfa mevcut değil veya taşınmış.',
        'backToHome': 'Ana sayfaya dön',
        'statusCode': '404'
    },
    'fr': {
        'title': 'Page non trouvée',
        'description': 'La page que vous recherchez n\'existe pas ou a été déplacée.',
        'backToHome': 'Retour à l\'accueil',
        'statusCode': '404'
    },
    'pl': {
        'title': 'Strona nie znaleziona',
        'description': 'Strona, której szukasz, nie istnieje lub została przeniesiona.',
        'backToHome': 'Powrót do strony głównej',
        'statusCode': '404'
    },
    'nl': {
        'title': 'Pagina niet gevonden',
        'description': 'De pagina die u zoekt bestaat niet of is verplaatst.',
        'backToHome': 'Terug naar home',
        'statusCode': '404'
    },
    'ko': {
        'title': '페이지를 찾을 수 없습니다',
        'description': '찾고 계신 페이지가 존재하지 않거나 이동되었습니다.',
        'backToHome': '홈으로 돌아가기',
        'statusCode': '404'
    },
    'ja': {
        'title': 'ページが見つかりません',
        'description': 'お探しのページは存在しないか、移動された可能性があります。',
        'backToHome': 'ホームに戻る',
        'statusCode': '404'
    },
    'vi': {
        'title': 'Không tìm thấy trang',
        'description': 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.',
        'backToHome': 'Về trang chủ',
        'statusCode': '404'
    },
    'id': {
        'title': 'Halaman tidak ditemukan',
        'description': 'Halaman yang Anda cari tidak ada atau telah dipindahkan.',
        'backToHome': 'Kembali ke beranda',
        'statusCode': '404'
    },
    'uk': {
        'title': 'Сторінку не знайдено',
        'description': 'Сторінка, яку ви шукаєте, не існує або була переміщена.',
        'backToHome': 'Повернутися на головну',
        'statusCode': '404'
    },
    'bg': {
        'title': 'Страницата не е намерена',
        'description': 'Страницата, която търсите, не съществува или е преместена.',
        'backToHome': 'Върни се в началото',
        'statusCode': '404'
    },
    'ro': {
        'title': 'Pagina nu a fost găsită',
        'description': 'Pagina pe care o căutați nu există sau a fost mutată.',
        'backToHome': 'Înapoi la pagina principală',
        'statusCode': '404'
    },
}

def update_index_json(lang: str):
    """更新 index.json"""
    file_path = Path(f'messages/{lang}/index.json')
    if not file_path.exists():
        print(f"  Warning: {file_path} does not exist")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if lang in TRANSLATIONS:
        data['notFound'] = TRANSLATIONS[lang]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"  [OK] Updated {file_path}")
        return True
    else:
        print(f"  [SKIP] No translation for {lang}")
        return False

def main():
    print("=" * 80)
    print("为所有语言添加 404 页面翻译")
    print("=" * 80)
    print()
    
    success_count = 0
    
    for lang in LANGUAGES:
        print(f"Processing {lang}...")
        if update_index_json(lang):
            success_count += 1
        print()
    
    print("=" * 80)
    print(f"完成！成功更新 {success_count}/{len(LANGUAGES)} 个文件")
    print("=" * 80)

if __name__ == '__main__':
    main()
