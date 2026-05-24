import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const MESSAGES = path.join(ROOT, 'messages');

/** SEO meta for /search — keyed by locale (en/de may already exist; script idempotent). */
const SEARCH_META = {
  en: {
    title: 'Search CASA Systems & Semen Analyzers | iSperm Medical',
    description:
      'Search iSperm Medical products, CASA systems, semen analyzers, and knowledge hub articles. Find Nexus DX1, MSQA-100, SQA-6100vet and more.',
  },
  de: {
    title: 'CASA-Systeme & Samenanalysatoren suchen | iSperm Medical',
    description:
      'Durchsuchen Sie iSperm Medical Produkte, CASA-Systeme, Samenanalysatoren und Wissensdatenbank-Artikel. Finden Sie Nexus DX1, MSQA-100, SQA-6100vet und mehr.',
  },
  es: {
    title: 'Buscar sistemas CASA y analizadores de semen | iSperm Medical',
    description:
      'Busque productos iSperm Medical, sistemas CASA, analizadores de semen y artículos del centro de conocimiento. Encuentre Nexus DX1, MSQA-100, SQA-6100vet y más.',
  },
  ar: {
    title: 'البحث عن أنظمة CASA ومحللات السائل المنوي | iSperm Medical',
    description:
      'ابحث في منتجات iSperm Medical وأنظمة CASA ومحللات السائل المنوي ومقالات مركز المعرفة. اعثر على Nexus DX1 وMSQA-100 وSQA-6100vet والمزيد.',
  },
  it: {
    title: 'Cerca sistemi CASA e analizzatori di seme | iSperm Medical',
    description:
      'Cerca prodotti iSperm Medical, sistemi CASA, analizzatori di seme e articoli del knowledge hub. Trova Nexus DX1, MSQA-100, SQA-6100vet e altro.',
  },
  pt: {
    title: 'Pesquisar sistemas CASA e analisadores de sêmen | iSperm Medical',
    description:
      'Pesquise produtos iSperm Medical, sistemas CASA, analisadores de sêmen e artigos do centro de conhecimento. Encontre Nexus DX1, MSQA-100, SQA-6100vet e mais.',
  },
  ru: {
    title: 'Поиск систем CASA и анализаторов спермы | iSperm Medical',
    description:
      'Ищите продукты iSperm Medical, системы CASA, анализаторы спермы и статьи базы знаний. Nexus DX1, MSQA-100, SQA-6100vet и другое.',
  },
  tr: {
    title: 'CASA Sistemleri ve Semen Analizörleri Ara | iSperm Medical',
    description:
      'iSperm Medical ürünlerini, CASA sistemlerini, semen analizörlerini ve bilgi merkezi makalelerini arayın. Nexus DX1, MSQA-100, SQA-6100vet ve daha fazlasını bulun.',
  },
  fr: {
    title: 'Rechercher systèmes CASA et analyseurs de sperme | iSperm Medical',
    description:
      'Recherchez les produits iSperm Medical, les systèmes CASA, les analyseurs de sperme et les articles du centre de connaissances. Nexus DX1, MSQA-100, SQA-6100vet et plus.',
  },
  pl: {
    title: 'Szukaj systemów CASA i analizatorów nasienia | iSperm Medical',
    description:
      'Przeszukuj produkty iSperm Medical, systemy CASA, analizatory nasienia i artykuły centrum wiedzy. Znajdź Nexus DX1, MSQA-100, SQA-6100vet i więcej.',
  },
  nl: {
    title: 'Zoek CASA-systemen en sperma-analysatoren | iSperm Medical',
    description:
      'Doorzoek iSperm Medical-producten, CASA-systemen, sperma-analysatoren en kenniscentrum-artikelen. Vind Nexus DX1, MSQA-100, SQA-6100vet en meer.',
  },
  ko: {
    title: 'CASA 시스템 및 정액 분석기 검색 | iSperm Medical',
    description:
      'iSperm Medical 제품, CASA 시스템, 정액 분석기 및 지식 허브 기사를 검색하세요. Nexus DX1, MSQA-100, SQA-6100vet 등을 찾아보세요.',
  },
  ja: {
    title: 'CASAシステム・精液分析装置を検索 | iSperm Medical',
    description:
      'iSperm Medicalの製品、CASAシステム、精液分析装置、ナレッジハブの記事を検索。Nexus DX1、MSQA-100、SQA-6100vetなど。',
  },
  vi: {
    title: 'Tìm hệ thống CASA và máy phân tích tinh dịch | iSperm Medical',
    description:
      'Tìm sản phẩm iSperm Medical, hệ thống CASA, máy phân tích tinh dịch và bài viết trung tâm kiến thức. Nexus DX1, MSQA-100, SQA-6100vet và hơn thế nữa.',
  },
  id: {
    title: 'Cari Sistem CASA & Analisis Semen | iSperm Medical',
    description:
      'Cari produk iSperm Medical, sistem CASA, analisator semen, dan artikel pusat pengetahuan. Temukan Nexus DX1, MSQA-100, SQA-6100vet, dan lainnya.',
  },
  uk: {
    title: 'Пошук систем CASA та аналізаторів сперми | iSperm Medical',
    description:
      'Шукайте продукти iSperm Medical, системи CASA, аналізатори сперми та статті бази знань. Nexus DX1, MSQA-100, SQA-6100vet та інше.',
  },
  bg: {
    title: 'Търсене на CASA системи и анализатори на сперма | iSperm Medical',
    description:
      'Търсете продукти iSperm Medical, CASA системи, анализатори на сперма и статии от центъра за знания. Nexus DX1, MSQA-100, SQA-6100vet и др.',
  },
  ro: {
    title: 'Căutați sisteme CASA și analizoare de spermă | iSperm Medical',
    description:
      'Căutați produse iSperm Medical, sisteme CASA, analizoare de spermă și articole din centrul de cunoștințe. Nexus DX1, MSQA-100, SQA-6100vet și altele.',
  },
};

let updated = 0;
for (const [locale, meta] of Object.entries(SEARCH_META)) {
  const filePath = path.join(MESSAGES, locale, 'search.json');
  if (!fs.existsSync(filePath)) {
    console.warn(`skip ${locale}: no search.json`);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (
    data.meta?.title === meta.title &&
    data.meta?.description === meta.description
  ) {
    console.log(`${locale}: already ok`);
    continue;
  }
  const {meta: _removed, ...rest} = data;
  const next = {meta, ...rest};
  fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`${locale}: added meta`);
  updated++;
}

console.log(`\nDone. Updated ${updated} file(s).`);
