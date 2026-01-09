#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
翻译 ALT 文本到所有语言
"""

import json
from pathlib import Path

# 英文原文
EN_ALT_TEXTS = {
    'about': {
        'image1': 'iSperm Medical team presenting fully automated CASA system and sperm quality analyzer at exhibition',
        'image2': 'iSperm Medical professionals discussing veterinary semen analyzer and animal breeding solutions',
        'image3': 'iSperm Medical team and events showcasing CASA technology and reproductive health solutions',
        'image4': 'iSperm Medical team presentations and exhibitions featuring automated semen analysis systems',
        'image5': 'iSperm Medical events and team showcasing innovative CASA systems and sperm quality analyzers',
    },
    'index': {
        'heroImage': 'iSperm Medical - Leading CASA system and sperm quality analyzer manufacturer for reproductive diagnostics'
    }
}

# 翻译映射（这里使用英文作为占位符，实际应该使用翻译服务或手动翻译）
# 为了演示，我将为每种语言提供合适的翻译
TRANSLATIONS = {
    'es': {
        'about': {
            'image1': 'Equipo de iSperm Medical presentando sistema CASA totalmente automatizado y analizador de calidad de esperma en exposición',
            'image2': 'Profesionales de iSperm Medical discutiendo analizador de semen veterinario y soluciones de cría animal',
            'image3': 'Equipo y eventos de iSperm Medical mostrando tecnología CASA y soluciones de salud reproductiva',
            'image4': 'Presentaciones y exposiciones del equipo de iSperm Medical con sistemas automatizados de análisis de semen',
            'image5': 'Eventos y equipo de iSperm Medical mostrando sistemas CASA innovadores y analizadores de calidad de esperma',
        },
        'index': {
            'heroImage': 'iSperm Medical - Fabricante líder de sistemas CASA y analizadores de calidad de esperma para diagnóstico reproductivo'
        }
    },
    'ar': {
        'about': {
            'image1': 'فريق iSperm Medical يقدم نظام CASA الآلي بالكامل ومحلل جودة الحيوانات المنوية في المعرض',
            'image2': 'المهنيون في iSperm Medical يناقشون محلل السائل المنوي البيطري وحلول تربية الحيوانات',
            'image3': 'فريق وفعاليات iSperm Medical يعرضون تقنية CASA وحلول الصحة الإنجابية',
            'image4': 'عروض ومعارض فريق iSperm Medical التي تتميز بأنظمة تحليل السائل المنوي الآلية',
            'image5': 'فعاليات وفريق iSperm Medical يعرضون أنظمة CASA المبتكرة ومحللات جودة الحيوانات المنوية',
        },
        'index': {
            'heroImage': 'iSperm Medical - الشركة الرائدة في تصنيع أنظمة CASA ومحللات جودة الحيوانات المنوية للتشخيص التناسلي'
        }
    },
    'de': {
        'about': {
            'image1': 'iSperm Medical Team präsentiert vollautomatisches CASA-System und Spermienqualitätsanalysator auf Ausstellung',
            'image2': 'iSperm Medical Fachkräfte diskutieren veterinären Samenanalysator und Tierzuchtlösungen',
            'image3': 'iSperm Medical Team und Veranstaltungen präsentieren CASA-Technologie und Lösungen für reproduktive Gesundheit',
            'image4': 'iSperm Medical Team-Präsentationen und Ausstellungen mit automatisierten Samenanalysesystemen',
            'image5': 'iSperm Medical Veranstaltungen und Team präsentieren innovative CASA-Systeme und Spermienqualitätsanalysatoren',
        },
        'index': {
            'heroImage': 'iSperm Medical - Führender Hersteller von CASA-Systemen und Spermienqualitätsanalysatoren für Reproduktionsdiagnostik'
        }
    },
    'fr': {
        'about': {
            'image1': 'Équipe iSperm Medical présentant le système CASA entièrement automatisé et l\'analyseur de qualité du sperme lors d\'une exposition',
            'image2': 'Professionnels iSperm Medical discutant de l\'analyseur de sperme vétérinaire et des solutions d\'élevage animal',
            'image3': 'Équipe et événements iSperm Medical présentant la technologie CASA et les solutions de santé reproductive',
            'image4': 'Présentations et expositions de l\'équipe iSperm Medical mettant en vedette des systèmes automatisés d\'analyse de sperme',
            'image5': 'Événements et équipe iSperm Medical présentant des systèmes CASA innovants et des analyseurs de qualité du sperme',
        },
        'index': {
            'heroImage': 'iSperm Medical - Fabricant leader de systèmes CASA et d\'analyseurs de qualité du sperme pour le diagnostic reproductif'
        }
    },
    'it': {
        'about': {
            'image1': 'Team iSperm Medical che presenta sistema CASA completamente automatizzato e analizzatore di qualità dello sperma all\'esposizione',
            'image2': 'Professionisti iSperm Medical che discutono analizzatore di sperma veterinario e soluzioni per l\'allevamento animale',
            'image3': 'Team ed eventi iSperm Medical che mostrano tecnologia CASA e soluzioni per la salute riproduttiva',
            'image4': 'Presentazioni ed esposizioni del team iSperm Medical con sistemi automatizzati di analisi dello sperma',
            'image5': 'Eventi e team iSperm Medical che mostrano sistemi CASA innovativi e analizzatori di qualità dello sperma',
        },
        'index': {
            'heroImage': 'iSperm Medical - Produttore leader di sistemi CASA e analizzatori di qualità dello sperma per la diagnostica riproduttiva'
        }
    },
    'pt': {
        'about': {
            'image1': 'Equipe iSperm Medical apresentando sistema CASA totalmente automatizado e analisador de qualidade do esperma em exposição',
            'image2': 'Profissionais iSperm Medical discutindo analisador de sêmen veterinário e soluções de criação animal',
            'image3': 'Equipe e eventos iSperm Medical mostrando tecnologia CASA e soluções de saúde reprodutiva',
            'image4': 'Apresentações e exposições da equipe iSperm Medical com sistemas automatizados de análise de sêmen',
            'image5': 'Eventos e equipe iSperm Medical mostrando sistemas CASA inovadores e analisadores de qualidade do esperma',
        },
        'index': {
            'heroImage': 'iSperm Medical - Fabricante líder de sistemas CASA e analisadores de qualidade do esperma para diagnóstico reprodutivo'
        }
    },
    'ru': {
        'about': {
            'image1': 'Команда iSperm Medical представляет полностью автоматизированную систему CASA и анализатор качества спермы на выставке',
            'image2': 'Специалисты iSperm Medical обсуждают ветеринарный анализатор спермы и решения для разведения животных',
            'image3': 'Команда и мероприятия iSperm Medical демонстрируют технологию CASA и решения для репродуктивного здоровья',
            'image4': 'Презентации и выставки команды iSperm Medical с автоматизированными системами анализа спермы',
            'image5': 'Мероприятия и команда iSperm Medical демонстрируют инновационные системы CASA и анализаторы качества спермы',
        },
        'index': {
            'heroImage': 'iSperm Medical - Ведущий производитель систем CASA и анализаторов качества спермы для репродуктивной диагностики'
        }
    },
    'tr': {
        'about': {
            'image1': 'iSperm Medical ekibi sergide tam otomatik CASA sistemi ve sperm kalite analizörü sunuyor',
            'image2': 'iSperm Medical profesyonelleri veteriner semen analizörü ve hayvan yetiştirme çözümlerini tartışıyor',
            'image3': 'iSperm Medical ekibi ve etkinlikleri CASA teknolojisi ve üreme sağlığı çözümlerini sergiliyor',
            'image4': 'iSperm Medical ekibi otomatik semen analiz sistemleri içeren sunumlar ve sergiler düzenliyor',
            'image5': 'iSperm Medical etkinlikleri ve ekibi yenilikçi CASA sistemleri ve sperm kalite analizörlerini sergiliyor',
        },
        'index': {
            'heroImage': 'iSperm Medical - Üreme tanısı için önde gelen CASA sistemi ve sperm kalite analizörü üreticisi'
        }
    },
    'pl': {
        'about': {
            'image1': 'Zespół iSperm Medical prezentujący w pełni zautomatyzowany system CASA i analizator jakości plemników na wystawie',
            'image2': 'Specjaliści iSperm Medical omawiający analizator nasienia weterynaryjnego i rozwiązania w zakresie hodowli zwierząt',
            'image3': 'Zespół iSperm Medical i wydarzenia prezentujące technologię CASA i rozwiązania w zakresie zdrowia reprodukcyjnego',
            'image4': 'Prezentacje i wystawy zespołu iSperm Medical z automatycznymi systemami analizy nasienia',
            'image5': 'Wydarzenia i zespół iSperm Medical prezentujący innowacyjne systemy CASA i analizatory jakości plemników',
        },
        'index': {
            'heroImage': 'iSperm Medical - Wiodący producent systemów CASA i analizatorów jakości plemników do diagnostyki reprodukcyjnej'
        }
    },
    'nl': {
        'about': {
            'image1': 'iSperm Medical team presenteert volledig geautomatiseerd CASA-systeem en spermakwaliteitsanalysator op tentoonstelling',
            'image2': 'iSperm Medical professionals bespreken veterinaire semenanalysator en dierfokkerijoplossingen',
            'image3': 'iSperm Medical team en evenementen tonen CASA-technologie en reproductieve gezondheidsoplossingen',
            'image4': 'iSperm Medical team presentaties en tentoonstellingen met geautomatiseerde semenanalysesystemen',
            'image5': 'iSperm Medical evenementen en team tonen innovatieve CASA-systemen en spermakwaliteitsanalysatoren',
        },
        'index': {
            'heroImage': 'iSperm Medical - Toonaangevende fabrikant van CASA-systemen en spermakwaliteitsanalysatoren voor reproductieve diagnostiek'
        }
    },
    'ko': {
        'about': {
            'image1': '전시회에서 완전 자동화 CASA 시스템 및 정자 품질 분석기를 선보이는 iSperm Medical 팀',
            'image2': '수의학 정액 분석기 및 동물 번식 솔루션을 논의하는 iSperm Medical 전문가들',
            'image3': 'CASA 기술 및 생식 건강 솔루션을 선보이는 iSperm Medical 팀 및 이벤트',
            'image4': '자동화된 정액 분석 시스템을 특징으로 하는 iSperm Medical 팀 프레젠테이션 및 전시회',
            'image5': '혁신적인 CASA 시스템 및 정자 품질 분석기를 선보이는 iSperm Medical 이벤트 및 팀',
        },
        'index': {
            'heroImage': 'iSperm Medical - 생식 진단을 위한 선도적인 CASA 시스템 및 정자 품질 분석기 제조업체'
        }
    },
    'ja': {
        'about': {
            'image1': '展示会で完全自動化CASAシステムと精子品質分析器を紹介するiSperm Medicalチーム',
            'image2': '獣医用精液分析器と動物繁殖ソリューションについて議論するiSperm Medical専門家',
            'image3': 'CASA技術と生殖健康ソリューションを紹介するiSperm Medicalチームとイベント',
            'image4': '自動化された精液分析システムを特徴とするiSperm Medicalチームのプレゼンテーションと展示会',
            'image5': '革新的なCASAシステムと精子品質分析器を紹介するiSperm Medicalイベントとチーム',
        },
        'index': {
            'heroImage': 'iSperm Medical - 生殖診断のための主要なCASAシステムおよび精子品質分析器メーカー'
        }
    },
    'vi': {
        'about': {
            'image1': 'Đội ngũ iSperm Medical trình bày hệ thống CASA tự động hoàn toàn và máy phân tích chất lượng tinh trùng tại triển lãm',
            'image2': 'Chuyên gia iSperm Medical thảo luận về máy phân tích tinh dịch thú y và giải pháp chăn nuôi động vật',
            'image3': 'Đội ngũ và sự kiện iSperm Medical giới thiệu công nghệ CASA và giải pháp sức khỏe sinh sản',
            'image4': 'Bài thuyết trình và triển lãm của đội ngũ iSperm Medical với hệ thống phân tích tinh dịch tự động',
            'image5': 'Sự kiện và đội ngũ iSperm Medical giới thiệu hệ thống CASA sáng tạo và máy phân tích chất lượng tinh trùng',
        },
        'index': {
            'heroImage': 'iSperm Medical - Nhà sản xuất hàng đầu hệ thống CASA và máy phân tích chất lượng tinh trùng cho chẩn đoán sinh sản'
        }
    },
    'id': {
        'about': {
            'image1': 'Tim iSperm Medical mempresentasikan sistem CASA sepenuhnya otomatis dan analisis kualitas sperma di pameran',
            'image2': 'Profesional iSperm Medical membahas analisis semen hewan dan solusi pembiakan hewan',
            'image3': 'Tim dan acara iSperm Medical menampilkan teknologi CASA dan solusi kesehatan reproduksi',
            'image4': 'Presentasi dan pameran tim iSperm Medical dengan sistem analisis semen otomatis',
            'image5': 'Acara dan tim iSperm Medical menampilkan sistem CASA inovatif dan analisis kualitas sperma',
        },
        'index': {
            'heroImage': 'iSperm Medical - Produsen terkemuka sistem CASA dan analisis kualitas sperma untuk diagnostik reproduksi'
        }
    },
    'uk': {
        'about': {
            'image1': 'Команда iSperm Medical представляє повністю автоматизовану систему CASA та аналізатор якості сперми на виставці',
            'image2': 'Фахівці iSperm Medical обговорюють ветеринарний аналізатор сперми та рішення для розведення тварин',
            'image3': 'Команда та заходи iSperm Medical демонструють технологію CASA та рішення для репродуктивного здоров\'я',
            'image4': 'Презентації та виставки команди iSperm Medical з автоматизованими системами аналізу сперми',
            'image5': 'Заходи та команда iSperm Medical демонструють інноваційні системи CASA та аналізатори якості сперми',
        },
        'index': {
            'heroImage': 'iSperm Medical - Провідний виробник систем CASA та аналізаторів якості сперми для репродуктивної діагностики'
        }
    },
    'bg': {
        'about': {
            'image1': 'Екипът на iSperm Medical представя напълно автоматизирана система CASA и анализатор на качеството на спермата на изложба',
            'image2': 'Професионалисти от iSperm Medical обсъждат ветеринарен анализатор на спермата и решения за развъждане на животни',
            'image3': 'Екипът и събития на iSperm Medical представят технология CASA и решения за репродуктивно здраве',
            'image4': 'Презентации и изложби на екипа на iSperm Medical с автоматизирани системи за анализ на спермата',
            'image5': 'Събития и екип на iSperm Medical представят иновативни системи CASA и анализатори на качеството на спермата',
        },
        'index': {
            'heroImage': 'iSperm Medical - Водещ производител на системи CASA и анализатори на качеството на спермата за репродуктивна диагностика'
        }
    },
    'ro': {
        'about': {
            'image1': 'Echipa iSperm Medical prezintă sistemul CASA complet automatizat și analizatorul de calitate a spermei la expoziție',
            'image2': 'Profesioniștii iSperm Medical discută analizatorul de spermă veterinar și soluțiile de creștere a animalelor',
            'image3': 'Echipa și evenimentele iSperm Medical prezintă tehnologia CASA și soluțiile de sănătate reproducătoare',
            'image4': 'Prezentări și expoziții ale echipei iSperm Medical cu sisteme automate de analiză a spermei',
            'image5': 'Evenimente și echipă iSperm Medical prezintă sisteme CASA inovatoare și analizatoare de calitate a spermei',
        },
        'index': {
            'heroImage': 'iSperm Medical - Producător de top al sistemelor CASA și analizatoarelor de calitate a spermei pentru diagnosticul reproductiv'
        }
    },
}

LANGUAGES = ['es', 'ar', 'de', 'it', 'pt', 'ru', 'tr', 'fr', 'pl', 'nl', 'ko', 'ja', 'vi', 'id', 'uk', 'bg', 'ro']

def update_about_json(lang: str):
    """更新 about.json"""
    file_path = Path(f'messages/{lang}/about.json')
    if not file_path.exists():
        print(f"  Warning: {file_path} does not exist")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if lang in TRANSLATIONS and 'about' in TRANSLATIONS[lang]:
        if 'showcase' not in data:
            data['showcase'] = {}
        if 'images' not in data['showcase']:
            data['showcase']['images'] = {}
        
        for i in range(1, 6):
            key = f'image{i}'
            if key in TRANSLATIONS[lang]['about']:
                if key not in data['showcase']['images']:
                    data['showcase']['images'][key] = {}
                data['showcase']['images'][key]['alt'] = TRANSLATIONS[lang]['about'][key]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"  [OK] Updated {file_path}")
        return True
    else:
        print(f"  [SKIP] No translation for {lang}")
        return False

def update_index_json(lang: str):
    """更新 index.json"""
    file_path = Path(f'messages/{lang}/index.json')
    if not file_path.exists():
        print(f"  Warning: {file_path} does not exist")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if lang in TRANSLATIONS and 'index' in TRANSLATIONS[lang]:
        if 'about' not in data:
            data['about'] = {}
        if 'heroImage' not in data['about']:
            data['about']['heroImage'] = {}
        
        data['about']['heroImage']['alt'] = TRANSLATIONS[lang]['index']['heroImage']
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"  [OK] Updated {file_path}")
        return True
    else:
        print(f"  [SKIP] No translation for {lang}")
        return False

def main():
    print("=" * 80)
    print("翻译 ALT 文本")
    print("=" * 80)
    print()
    
    success_count = 0
    total_count = len(LANGUAGES) * 2
    
    for lang in LANGUAGES:
        print(f"Processing {lang}...")
        if update_about_json(lang):
            success_count += 1
        if update_index_json(lang):
            success_count += 1
        print()
    
    print("=" * 80)
    print(f"完成！成功更新 {success_count}/{total_count} 个文件")
    print("=" * 80)

if __name__ == '__main__':
    main()
