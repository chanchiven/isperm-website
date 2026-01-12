/**
 * 搜索索引类型定义
 */

export interface ImageIndex {
  id: string;
  src: string;
  alt: string;
  filename: string;
  type: 'product' | 'article' | 'about' | 'banner';
  associatedContent: {
    type: 'product' | 'article' | 'page';
    id: string;
    title: string;
    url: string;
  };
  locale: string;
}

export interface ProductIndex {
  id: string;
  slug: string;
  name: string;
  description: string;
  subtitle?: string;
  images: string[];
  features: string[];
  locale: string;
}

export interface ArticleIndex {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string; // 简化版内容（用于搜索）
  image: string;
  alt: string;
  category: 'human' | 'veterinary';
  locale: string;
}

export interface PageIndex {
  id: string;
  path: string;
  title: string;
  description: string;
  locale: string;
}

export interface SearchIndex {
  images: ImageIndex[];
  products: ProductIndex[];
  articles: ArticleIndex[];
  pages: PageIndex[];
  locale: string;
}

export interface SearchResult {
  type: 'product' | 'article' | 'image' | 'page';
  id: string;
  title: string;
  description?: string;
  url: string;
  image?: string;
  alt?: string;
  relevance: number; // 相关性分数 0-1
}

export interface SearchFilters {
  types?: ('product' | 'article' | 'image' | 'page')[];
  categories?: ('human' | 'veterinary')[];
  sortBy?: 'relevance' | 'title';
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
  locale: string;
  filters?: SearchFilters;
}
