/**
 * 生成搜索翻译文件的脚本
 * 为所有语言创建 search.json 文件（基于英文版本）
 */

const fs = require('fs');
const path = require('path');

const LOCALES = ['es', 'ar', 'de', 'it', 'pt', 'ru', 'tr', 'fr', 'pl', 'nl', 'ko', 'ja', 'vi', 'id', 'uk', 'bg', 'ro'];

// 翻译映射（主要语言）
const translations = {
  es: {
    placeholder: "Buscar productos, artículos, imágenes...",
    startTyping: "Comience a escribir para buscar...",
    noResults: "No se encontraron resultados",
    tryDifferentQuery: "Pruebe con una consulta de búsqueda diferente",
    searching: "Buscando...",
    error: "Ocurrió un error al buscar. Por favor, intente de nuevo más tarde.",
    shortcutHint: "Presione ESC para cerrar",
    resultsCount: "Se encontraron {count} resultados",
    pageTitle: "Resultados de Búsqueda",
    searchingFor: "Buscando",
    enterQuery: "Ingrese una consulta de búsqueda para encontrar productos, artículos y más",
    foundResults: "Se encontraron {count} resultados para \"{query}\"",
    recentSearches: "Búsquedas Recientes",
    clearHistory: "Limpiar historial de búsqueda",
    clear: "Limpiar",
    results: "resultados",
    removeFromHistory: "Eliminar del historial",
    suggestions: "Sugerencias",
    popularSearches: "Búsquedas Populares",
    types: {
      product: "Producto",
      article: "Artículo",
      image: "Imagen",
      page: "Página"
    },
    filters: {
      title: "Filtros",
      type: "Tipo",
      category: "Categoría",
      sortBy: "Ordenar por",
      relevance: "Relevancia",
      titleSort: "Título",
      allTypes: "Todos los tipos",
      allCategories: "Todas las categorías",
      human: "Andrología humana",
      veterinary: "Cría de animales",
      clearFilters: "Limpiar filtros"
    },
    footer: {
      company: "iSperm Medical",
      description: "iSperm Medical Ltd. está comprometida a ofrecer soluciones tecnológicas de vanguardia en análisis de semen.",
      quickLinks: "Enlaces Rápidos",
      contact: "Contacto",
      email: "Correo electrónico:",
      rights: "© 2024 iSperm Medical Ltd. Todos los derechos reservados."
    }
  },
  de: {
    placeholder: "Produkte, Artikel, Bilder suchen...",
    startTyping: "Beginnen Sie zu tippen, um zu suchen...",
    noResults: "Keine Ergebnisse gefunden",
    tryDifferentQuery: "Versuchen Sie eine andere Suchanfrage",
    searching: "Suche...",
    error: "Beim Suchen ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
    shortcutHint: "Drücken Sie ESC zum Schließen",
    resultsCount: "{count} Ergebnisse gefunden",
    pageTitle: "Suchergebnisse",
    searchingFor: "Suche nach",
    enterQuery: "Geben Sie eine Suchanfrage ein, um Produkte, Artikel und mehr zu finden",
    foundResults: "{count} Ergebnisse für \"{query}\" gefunden",
    recentSearches: "Letzte Suchen",
    clearHistory: "Suchverlauf löschen",
    clear: "Löschen",
    results: "Ergebnisse",
    removeFromHistory: "Aus Verlauf entfernen",
    suggestions: "Vorschläge",
    popularSearches: "Beliebte Suchen",
    types: {
      product: "Produkt",
      article: "Artikel",
      image: "Bild",
      page: "Seite"
    },
    footer: {
      company: "iSperm Medical",
      description: "iSperm Medical Ltd. ist verpflichtet, wegweisende Technologielösungen in der Samenanalyse anzubieten.",
      quickLinks: "Schnelllinks",
      contact: "Kontakt",
      email: "E-Mail:",
      rights: "© 2024 iSperm Medical Ltd. Alle Rechte vorbehalten."
    }
  },
  fr: {
    placeholder: "Rechercher des produits, articles, images...",
    startTyping: "Commencez à taper pour rechercher...",
    noResults: "Aucun résultat trouvé",
    tryDifferentQuery: "Essayez une autre requête de recherche",
    searching: "Recherche...",
    error: "Une erreur s'est produite lors de la recherche. Veuillez réessayer plus tard.",
    shortcutHint: "Appuyez sur ESC pour fermer",
    resultsCount: "{count} résultats trouvés",
    pageTitle: "Résultats de recherche",
    searchingFor: "Recherche de",
    enterQuery: "Entrez une requête de recherche pour trouver des produits, articles et plus",
    foundResults: "{count} résultats trouvés pour \"{query}\"",
    recentSearches: "Recherches récentes",
    clearHistory: "Effacer l'historique de recherche",
    clear: "Effacer",
    results: "résultats",
    removeFromHistory: "Retirer de l'historique",
    suggestions: "Suggestions",
    popularSearches: "Recherches populaires",
    types: {
      product: "Produit",
      article: "Article",
      image: "Image",
      page: "Page"
    },
    footer: {
      company: "iSperm Medical",
      description: "iSperm Medical Ltd. s'engage à offrir des solutions technologiques de pointe en analyse de sperme.",
      quickLinks: "Liens rapides",
      contact: "Contact",
      email: "E-mail:",
      rights: "© 2024 iSperm Medical Ltd. Tous droits réservés."
    }
  },
  ja: {
    placeholder: "製品、記事、画像を検索...",
    startTyping: "検索を開始するには入力してください...",
    noResults: "結果が見つかりませんでした",
    tryDifferentQuery: "別の検索クエリをお試しください",
    searching: "検索中...",
    error: "検索中にエラーが発生しました。後でもう一度お試しください。",
    shortcutHint: "ESCキーを押して閉じる",
    resultsCount: "{count}件の結果が見つかりました",
    pageTitle: "検索結果",
    searchingFor: "検索中",
    enterQuery: "検索クエリを入力して、製品、記事などを検索",
    foundResults: "\"{query}\"の検索結果 {count}件",
    recentSearches: "最近の検索",
    clearHistory: "検索履歴をクリア",
    clear: "クリア",
    results: "件",
    removeFromHistory: "履歴から削除",
    suggestions: "提案",
    popularSearches: "人気の検索",
    types: {
      product: "製品",
      article: "記事",
      image: "画像",
      page: "ページ"
    },
    footer: {
      company: "iSperm Medical",
      description: "iSperm Medical Ltd.は、精液分析における最先端の技術ソリューションの提供に取り組んでいます。",
      quickLinks: "クイックリンク",
      contact: "お問い合わせ",
      email: "メール:",
      rights: "© 2024 iSperm Medical Ltd. 全著作権所有。"
    }
  },
  ko: {
    placeholder: "제품, 기사, 이미지 검색...",
    startTyping: "검색을 시작하려면 입력하세요...",
    noResults: "결과를 찾을 수 없습니다",
    tryDifferentQuery: "다른 검색 쿼리를 시도해보세요",
    searching: "검색 중...",
    error: "검색 중 오류가 발생했습니다. 나중에 다시 시도해주세요.",
    shortcutHint: "ESC를 눌러 닫기",
    resultsCount: "{count}개의 결과를 찾았습니다",
    pageTitle: "검색 결과",
    searchingFor: "검색 중",
    enterQuery: "검색 쿼리를 입력하여 제품, 기사 등을 찾으세요",
    foundResults: "\"{query}\"에 대한 {count}개의 결과를 찾았습니다",
    recentSearches: "최근 검색",
    clearHistory: "검색 기록 지우기",
    clear: "지우기",
    results: "개",
    removeFromHistory: "기록에서 제거",
    suggestions: "제안",
    popularSearches: "인기 검색",
    types: {
      product: "제품",
      article: "기사",
      image: "이미지",
      page: "페이지"
    },
    footer: {
      company: "iSperm Medical",
      description: "iSperm Medical Ltd.는 정액 분석 분야의 최첨단 기술 솔루션을 제공하는 데 전념하고 있습니다.",
      quickLinks: "빠른 링크",
      contact: "연락처",
      email: "이메일:",
      rights: "© 2024 iSperm Medical Ltd. 모든 권리 보유."
    }
  },
  ar: {
    placeholder: "البحث عن المنتجات والمقالات والصور...",
    startTyping: "ابدأ الكتابة للبحث...",
    noResults: "لم يتم العثور على نتائج",
    tryDifferentQuery: "جرب استعلام بحث مختلف",
    searching: "جاري البحث...",
    error: "حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى لاحقًا.",
    shortcutHint: "اضغط ESC للإغلاق",
    resultsCount: "تم العثور على {count} نتيجة",
    pageTitle: "نتائج البحث",
    searchingFor: "البحث عن",
    enterQuery: "أدخل استعلام بحث للعثور على المنتجات والمقالات والمزيد",
    foundResults: "تم العثور على {count} نتيجة لـ \"{query}\"",
    recentSearches: "عمليات البحث الأخيرة",
    clearHistory: "مسح سجل البحث",
    clear: "مسح",
    results: "نتائج",
    removeFromHistory: "إزالة من السجل",
    suggestions: "اقتراحات",
    popularSearches: "عمليات البحث الشائعة",
    types: {
      product: "منتج",
      article: "مقال",
      image: "صورة",
      page: "صفحة"
    },
    footer: {
      company: "iSperm Medical",
      description: "تلتزم iSperm Medical Ltd. بتقديم حلول تكنولوجية متطورة في تحليل السائل المنوي.",
      quickLinks: "روابط سريعة",
      contact: "اتصل",
      email: "البريد الإلكتروني:",
      rights: "© 2024 iSperm Medical Ltd. جميع الحقوق محفوظة."
    }
  },
  it: {
    placeholder: "Cerca prodotti, articoli, immagini...",
    startTyping: "Inizia a digitare per cercare...",
    noResults: "Nessun risultato trovato",
    tryDifferentQuery: "Prova con una query di ricerca diversa",
    searching: "Ricerca in corso...",
    error: "Si è verificato un errore durante la ricerca. Riprova più tardi.",
    shortcutHint: "Premi ESC per chiudere",
    resultsCount: "Trovati {count} risultati",
    pageTitle: "Risultati di ricerca",
    searchingFor: "Ricerca di",
    enterQuery: "Inserisci una query di ricerca per trovare prodotti, articoli e altro",
    foundResults: "Trovati {count} risultati per \"{query}\"",
    recentSearches: "Ricerche recenti",
    clearHistory: "Cancella cronologia di ricerca",
    clear: "Cancella",
    results: "risultati",
    removeFromHistory: "Rimuovi dalla cronologia",
    suggestions: "Suggerimenti",
    popularSearches: "Ricerche popolari",
    types: {
      product: "Prodotto",
      article: "Articolo",
      image: "Immagine",
      page: "Pagina"
    },
    footer: {
      company: "iSperm Medical",
      description: "iSperm Medical Ltd. si impegna a fornire soluzioni tecnologiche all'avanguardia nell'analisi dello sperma.",
      quickLinks: "Link rapidi",
      contact: "Contatto",
      email: "Email:",
      rights: "© 2024 iSperm Medical Ltd. Tutti i diritti riservati."
    }
  },
  pt: {
    placeholder: "Pesquisar produtos, artigos, imagens...",
    startTyping: "Comece a digitar para pesquisar...",
    noResults: "Nenhum resultado encontrado",
    tryDifferentQuery: "Tente uma consulta de pesquisa diferente",
    searching: "Pesquisando...",
    error: "Ocorreu um erro ao pesquisar. Tente novamente mais tarde.",
    shortcutHint: "Pressione ESC para fechar",
    resultsCount: "Encontrados {count} resultados",
    pageTitle: "Resultados da pesquisa",
    searchingFor: "Pesquisando por",
    enterQuery: "Digite uma consulta de pesquisa para encontrar produtos, artigos e mais",
    foundResults: "Encontrados {count} resultados para \"{query}\"",
    recentSearches: "Pesquisas recentes",
    clearHistory: "Limpar histórico de pesquisa",
    clear: "Limpar",
    results: "resultados",
    removeFromHistory: "Remover do histórico",
    suggestions: "Sugestões",
    popularSearches: "Pesquisas populares",
    types: {
      product: "Produto",
      article: "Artigo",
      image: "Imagem",
      page: "Página"
    },
    footer: {
      company: "iSperm Medical",
      description: "iSperm Medical Ltd. está comprometida em fornecer soluções tecnológicas de ponta em análise de sêmen.",
      quickLinks: "Links rápidos",
      contact: "Contato",
      email: "E-mail:",
      rights: "© 2024 iSperm Medical Ltd. Todos os direitos reservados."
    }
  },
  ru: {
    placeholder: "Поиск продуктов, статей, изображений...",
    startTyping: "Начните вводить для поиска...",
    noResults: "Результаты не найдены",
    tryDifferentQuery: "Попробуйте другой поисковый запрос",
    searching: "Поиск...",
    error: "Произошла ошибка при поиске. Пожалуйста, попробуйте позже.",
    shortcutHint: "Нажмите ESC для закрытия",
    resultsCount: "Найдено {count} результатов",
    pageTitle: "Результаты поиска",
    searchingFor: "Поиск",
    enterQuery: "Введите поисковый запрос, чтобы найти продукты, статьи и многое другое",
    foundResults: "Найдено {count} результатов для \"{query}\"",
    recentSearches: "Недавние поиски",
    clearHistory: "Очистить историю поиска",
    clear: "Очистить",
    results: "результатов",
    removeFromHistory: "Удалить из истории",
    suggestions: "Предложения",
    popularSearches: "Популярные поиски",
    types: {
      product: "Продукт",
      article: "Статья",
      image: "Изображение",
      page: "Страница"
    },
    footer: {
      company: "iSperm Medical",
      description: "iSperm Medical Ltd. стремится предоставлять передовые технологические решения в области анализа спермы.",
      quickLinks: "Быстрые ссылки",
      contact: "Контакты",
      email: "Электронная почта:",
      rights: "© 2024 iSperm Medical Ltd. Все права защищены."
    }
  },
  tr: {
    placeholder: "Ürünler, makaleler, görseller ara...",
    startTyping: "Aramaya başlamak için yazın...",
    noResults: "Sonuç bulunamadı",
    tryDifferentQuery: "Farklı bir arama sorgusu deneyin",
    searching: "Aranıyor...",
    error: "Arama sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
    shortcutHint: "Kapatmak için ESC'ye basın",
    resultsCount: "{count} sonuç bulundu",
    pageTitle: "Arama Sonuçları",
    searchingFor: "Aranıyor",
    enterQuery: "Ürünler, makaleler ve daha fazlasını bulmak için bir arama sorgusu girin",
    foundResults: "\"{query}\" için {count} sonuç bulundu",
    recentSearches: "Son Aramalar",
    clearHistory: "Arama geçmişini temizle",
    clear: "Temizle",
    results: "sonuç",
    removeFromHistory: "Geçmişten kaldır",
    suggestions: "Öneriler",
    popularSearches: "Popüler Aramalar",
    types: {
      product: "Ürün",
      article: "Makale",
      image: "Görsel",
      page: "Sayfa"
    },
    footer: {
      company: "iSperm Medical",
      description: "iSperm Medical Ltd., semen analizinde çığır açan teknoloji çözümleri sunmaya kararlıdır.",
      quickLinks: "Hızlı Bağlantılar",
      contact: "İletişim",
      email: "E-posta:",
      rights: "© 2024 iSperm Medical Ltd. Tüm hakları saklıdır."
    }
  },
  pl: {
    placeholder: "Szukaj produktów, artykułów, obrazów...",
    startTyping: "Zacznij pisać, aby wyszukać...",
    noResults: "Nie znaleziono wyników",
    tryDifferentQuery: "Spróbuj innego zapytania wyszukiwania",
    searching: "Wyszukiwanie...",
    error: "Wystąpił błąd podczas wyszukiwania. Spróbuj ponownie później.",
    shortcutHint: "Naciśnij ESC, aby zamknąć",
    resultsCount: "Znaleziono {count} wyników",
    pageTitle: "Wyniki wyszukiwania",
    searchingFor: "Wyszukiwanie",
    enterQuery: "Wprowadź zapytanie wyszukiwania, aby znaleźć produkty, artykuły i więcej",
    foundResults: "Znaleziono {count} wyników dla \"{query}\"",
    recentSearches: "Ostatnie wyszukiwania",
    clearHistory: "Wyczyść historię wyszukiwania",
    clear: "Wyczyść",
    results: "wyników",
    removeFromHistory: "Usuń z historii",
    suggestions: "Sugestie",
    popularSearches: "Popularne wyszukiwania",
    types: {
      product: "Produkt",
      article: "Artykuł",
      image: "Obraz",
      page: "Strona"
    },
    footer: {
      company: "iSperm Medical",
      description: "iSperm Medical Ltd. zobowiązuje się dostarczać zaawansowane rozwiązania technologiczne w analizie nasienia.",
      quickLinks: "Szybkie linki",
      contact: "Kontakt",
      email: "E-mail:",
      rights: "© 2024 iSperm Medical Ltd. Wszelkie prawa zastrzeżone."
    }
  },
  nl: {
    placeholder: "Zoek producten, artikelen, afbeeldingen...",
    startTyping: "Begin met typen om te zoeken...",
    noResults: "Geen resultaten gevonden",
    tryDifferentQuery: "Probeer een andere zoekopdracht",
    searching: "Zoeken...",
    error: "Er is een fout opgetreden bij het zoeken. Probeer het later opnieuw.",
    shortcutHint: "Druk op ESC om te sluiten",
    resultsCount: "{count} resultaten gevonden",
    pageTitle: "Zoekresultaten",
    searchingFor: "Zoeken naar",
    enterQuery: "Voer een zoekopdracht in om producten, artikelen en meer te vinden",
    foundResults: "{count} resultaten gevonden voor \"{query}\"",
    recentSearches: "Recente zoekopdrachten",
    clearHistory: "Zoekgeschiedenis wissen",
    clear: "Wissen",
    results: "resultaten",
    removeFromHistory: "Verwijderen uit geschiedenis",
    suggestions: "Suggesties",
    popularSearches: "Populaire zoekopdrachten",
    types: {
      product: "Product",
      article: "Artikel",
      image: "Afbeelding",
      page: "Pagina"
    },
    footer: {
      company: "iSperm Medical",
      description: "iSperm Medical Ltd. is toegewijd aan het leveren van geavanceerde technologische oplossingen in sperma-analyse.",
      quickLinks: "Snelle links",
      contact: "Contact",
      email: "E-mail:",
      rights: "© 2024 iSperm Medical Ltd. Alle rechten voorbehouden."
    }
  },
  vi: {
    placeholder: "Tìm kiếm sản phẩm, bài viết, hình ảnh...",
    startTyping: "Bắt đầu nhập để tìm kiếm...",
    noResults: "Không tìm thấy kết quả",
    tryDifferentQuery: "Thử một truy vấn tìm kiếm khác",
    searching: "Đang tìm kiếm...",
    error: "Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.",
    shortcutHint: "Nhấn ESC để đóng",
    resultsCount: "Tìm thấy {count} kết quả",
    pageTitle: "Kết quả tìm kiếm",
    searchingFor: "Đang tìm kiếm",
    enterQuery: "Nhập truy vấn tìm kiếm để tìm sản phẩm, bài viết và nhiều hơn nữa",
    foundResults: "Tìm thấy {count} kết quả cho \"{query}\"",
    recentSearches: "Tìm kiếm gần đây",
    clearHistory: "Xóa lịch sử tìm kiếm",
    clear: "Xóa",
    results: "kết quả",
    removeFromHistory: "Xóa khỏi lịch sử",
    suggestions: "Gợi ý",
    popularSearches: "Tìm kiếm phổ biến",
    types: {
      product: "Sản phẩm",
      article: "Bài viết",
      image: "Hình ảnh",
      page: "Trang"
    },
    footer: {
      company: "iSperm Medical",
      description: "iSperm Medical Ltd. cam kết cung cấp các giải pháp công nghệ tiên tiến trong phân tích tinh dịch.",
      quickLinks: "Liên kết nhanh",
      contact: "Liên hệ",
      email: "Email:",
      rights: "© 2024 iSperm Medical Ltd. Bảo lưu mọi quyền."
    }
  },
  id: {
    placeholder: "Cari produk, artikel, gambar...",
    startTyping: "Mulai mengetik untuk mencari...",
    noResults: "Tidak ada hasil ditemukan",
    tryDifferentQuery: "Coba kueri pencarian yang berbeda",
    searching: "Mencari...",
    error: "Terjadi kesalahan saat mencari. Silakan coba lagi nanti.",
    shortcutHint: "Tekan ESC untuk menutup",
    resultsCount: "Ditemukan {count} hasil",
    pageTitle: "Hasil Pencarian",
    searchingFor: "Mencari",
    enterQuery: "Masukkan kueri pencarian untuk menemukan produk, artikel, dan lainnya",
    foundResults: "Ditemukan {count} hasil untuk \"{query}\"",
    recentSearches: "Pencarian Terbaru",
    clearHistory: "Hapus riwayat pencarian",
    clear: "Hapus",
    results: "hasil",
    removeFromHistory: "Hapus dari riwayat",
    suggestions: "Saran",
    popularSearches: "Pencarian Populer",
    types: {
      product: "Produk",
      article: "Artikel",
      image: "Gambar",
      page: "Halaman"
    },
    footer: {
      company: "iSperm Medical",
      description: "iSperm Medical Ltd. berkomitmen untuk menyediakan solusi teknologi canggih dalam analisis semen.",
      quickLinks: "Tautan Cepat",
      contact: "Kontak",
      email: "Email:",
      rights: "© 2024 iSperm Medical Ltd. Hak cipta dilindungi."
    }
  },
  uk: {
    placeholder: "Пошук продуктів, статей, зображень...",
    startTyping: "Почніть вводити для пошуку...",
    noResults: "Результатів не знайдено",
    tryDifferentQuery: "Спробуйте інший пошуковий запит",
    searching: "Пошук...",
    error: "Під час пошуку сталася помилка. Будь ласка, спробуйте пізніше.",
    shortcutHint: "Натисніть ESC, щоб закрити",
    resultsCount: "Знайдено {count} результатів",
    pageTitle: "Результати пошуку",
    searchingFor: "Пошук",
    enterQuery: "Введіть пошуковий запит, щоб знайти продукти, статті та інше",
    foundResults: "Знайдено {count} результатів для \"{query}\"",
    recentSearches: "Останні пошуки",
    clearHistory: "Очистити історію пошуку",
    clear: "Очистити",
    results: "результатів",
    removeFromHistory: "Видалити з історії",
    suggestions: "Пропозиції",
    popularSearches: "Популярні пошуки",
    types: {
      product: "Продукт",
      article: "Стаття",
      image: "Зображення",
      page: "Сторінка"
    },
    footer: {
      company: "iSperm Medical",
      description: "iSperm Medical Ltd. прагне надавати передові технологічні рішення в галузі аналізу сперми.",
      quickLinks: "Швидкі посилання",
      contact: "Контакти",
      email: "Електронна пошта:",
      rights: "© 2024 iSperm Medical Ltd. Всі права захищені."
    }
  },
  bg: {
    placeholder: "Търсене на продукти, статии, изображения...",
    startTyping: "Започнете да пишете за търсене...",
    noResults: "Не са намерени резултати",
    tryDifferentQuery: "Опитайте различна заявка за търсене",
    searching: "Търсене...",
    error: "Възникна грешка при търсенето. Моля, опитайте отново по-късно.",
    shortcutHint: "Натиснете ESC, за да затворите",
    resultsCount: "Намерени {count} резултата",
    pageTitle: "Резултати от търсенето",
    searchingFor: "Търсене на",
    enterQuery: "Въведете заявка за търсене, за да намерите продукти, статии и други",
    foundResults: "Намерени {count} резултата за \"{query}\"",
    recentSearches: "Последни търсения",
    clearHistory: "Изчисти история на търсенето",
    clear: "Изчисти",
    results: "резултата",
    removeFromHistory: "Премахни от историята",
    suggestions: "Предложения",
    popularSearches: "Популярни търсения",
    types: {
      product: "Продукт",
      article: "Статия",
      image: "Изображение",
      page: "Страница"
    },
    footer: {
      company: "iSperm Medical",
      description: "iSperm Medical Ltd. се ангажира да предоставя иновативни технологични решения в анализа на сперма.",
      quickLinks: "Бързи връзки",
      contact: "Контакт",
      email: "Имейл:",
      rights: "© 2024 iSperm Medical Ltd. Всички права запазени."
    }
  },
  ro: {
    placeholder: "Căutați produse, articole, imagini...",
    startTyping: "Începeți să tastați pentru a căuta...",
    noResults: "Nu au fost găsite rezultate",
    tryDifferentQuery: "Încercați o altă interogare de căutare",
    searching: "Căutare...",
    error: "A apărut o eroare la căutare. Vă rugăm să încercați din nou mai târziu.",
    shortcutHint: "Apăsați ESC pentru a închide",
    resultsCount: "Au fost găsite {count} rezultate",
    pageTitle: "Rezultate căutare",
    searchingFor: "Căutare",
    enterQuery: "Introduceți o interogare de căutare pentru a găsi produse, articole și altele",
    foundResults: "Au fost găsite {count} rezultate pentru \"{query}\"",
    recentSearches: "Căutări recente",
    clearHistory: "Șterge istoricul căutării",
    clear: "Șterge",
    results: "rezultate",
    removeFromHistory: "Elimină din istoric",
    suggestions: "Sugestii",
    popularSearches: "Căutări populare",
    types: {
      product: "Produs",
      article: "Articol",
      image: "Imagine",
      page: "Pagină"
    },
    footer: {
      company: "iSperm Medical",
      description: "iSperm Medical Ltd. se angajează să ofere soluții tehnologice de vârf în analiza spermei.",
      quickLinks: "Link-uri rapide",
      contact: "Contact",
      email: "E-mail:",
      rights: "© 2024 iSperm Medical Ltd. Toate drepturile rezervate."
    }
  }
};

// 读取英文模板
const enTemplatePath = path.join(__dirname, '..', 'messages', 'en', 'search.json');
const enTemplate = JSON.parse(fs.readFileSync(enTemplatePath, 'utf-8'));

// 为每种语言生成文件
LOCALES.forEach(locale => {
  const localeDir = path.join(__dirname, '..', 'messages', locale);
  const outputPath = path.join(localeDir, 'search.json');
  
  // 如果目录不存在，创建它
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true });
  }
  
  // 使用翻译或回退到英文
  let content;
  if (translations[locale]) {
    content = translations[locale];
    // 确保 filters 部分存在（从英文模板合并）
    if (!content.filters && enTemplate.filters) {
      content.filters = enTemplate.filters;
    }
  } else {
    // 对于没有翻译的语言，使用英文版本（后续可以手动翻译）
    console.log(`⚠️  ${locale}: 使用英文模板（需要翻译）`);
    content = enTemplate;
  }
  
  // 写入文件
  fs.writeFileSync(outputPath, JSON.stringify(content, null, 2), 'utf-8');
  console.log(`✓ 生成 ${locale}/search.json`);
});

console.log('\n✅ 所有搜索翻译文件已生成！');
console.log('⚠️  注意：部分语言使用了英文模板，需要后续翻译。');
