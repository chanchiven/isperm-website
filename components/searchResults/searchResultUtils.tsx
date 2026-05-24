import {Package, FileText, Image as ImageIcon, Globe} from 'lucide-react';
import {SearchResult} from '@/lib/search/types';

export type ResultGroupKey = 'products' | 'articles' | 'images' | 'pages';

const TYPE_TO_GROUP: Record<SearchResult['type'], ResultGroupKey> = {
  product: 'products',
  article: 'articles',
  image: 'images',
  page: 'pages'
};

export function groupSearchResults(results: SearchResult[]) {
  const grouped = {
    products: [] as SearchResult[],
    articles: [] as SearchResult[],
    images: [] as SearchResult[],
    pages: [] as SearchResult[]
  };

  for (const result of results) {
    grouped[TYPE_TO_GROUP[result.type]].push(result);
  }

  return grouped;
}

export function getTypeIcon(type: string) {
  switch (type) {
    case 'product':
      return <Package size={16} />;
    case 'article':
      return <FileText size={16} />;
    case 'image':
      return <ImageIcon size={16} />;
    case 'page':
      return <Globe size={16} />;
    default:
      return null;
  }
}

export function getTypeLabel(
  type: string,
  t: (key: string) => string
) {
  switch (type) {
    case 'product':
      return t('types.product') || 'Product';
    case 'article':
      return t('types.article') || 'Article';
    case 'image':
      return t('types.image') || 'Image';
    case 'page':
      return t('types.page') || 'Page';
    default:
      return '';
  }
}

export function highlightText(text: string, query: string) {
  if (!query || !text) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={index}
        style={{
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          padding: '0 2px'
        }}
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}
