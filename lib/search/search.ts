/**
 * 搜索核心逻辑
 * 客户端搜索实现（适用于静态导出）
 * 使用 Fuse.js 实现模糊搜索和高级筛选
 */

import Fuse from 'fuse.js';
import { SearchIndex, SearchResult, SearchResponse, SearchFilters } from './types';

/**
 * 执行搜索（使用 Fuse.js 进行模糊匹配）
 */
export async function search(
  query: string,
  locale: string,
  filters?: SearchFilters
): Promise<SearchResponse> {
  if (!query || query.trim().length === 0) {
    return {
      query,
      results: [],
      total: 0,
      locale,
      filters
    };
  }

  // 加载搜索索引
  let index: SearchIndex;
  try {
    const indexUrl = `/search-index/${locale}.json`;
    const response = await fetch(indexUrl);
    if (!response.ok) {
      throw new Error(`Failed to load search index: ${response.statusText}`);
    }
    index = await response.json();
  } catch (error) {
    console.error('Error loading search index:', error);
    return {
      query,
      results: [],
      total: 0,
      locale,
      filters
    };
  }

  const queryTrimmed = query.trim();
  const allResults: SearchResult[] = [];

  // 准备搜索数据
  const searchData: Array<{
    type: 'product' | 'article' | 'image' | 'page';
    id: string;
    title: string;
    description?: string;
    content?: string;
    alt?: string;
    url: string;
    image?: string;
    category?: 'human' | 'veterinary';
    relevance?: number;
  }> = [];

  // 添加产品到搜索数据
  if (!filters?.types || filters.types.includes('product')) {
    for (const product of index.products) {
      searchData.push({
        type: 'product',
        id: product.id,
        title: product.name,
        description: product.description,
        content: product.subtitle,
        url: `/products/${product.slug}`,
        image: product.images[0],
        relevance: 0
      });
    }
  }

  // 添加文章到搜索数据
  if (!filters?.types || filters.types.includes('article')) {
    for (const article of index.articles) {
      // 应用分类筛选
      if (filters?.categories && !filters.categories.includes(article.category)) {
        continue;
      }
      searchData.push({
        type: 'article',
        id: article.id,
        title: article.title,
        description: article.subtitle,
        content: article.content,
        url: `/faq/${article.slug}`,
        image: article.image,
        category: article.category,
        relevance: 0
      });
    }
  }

  // 添加图片到搜索数据
  if (!filters?.types || filters.types.includes('image')) {
    for (const image of index.images) {
      searchData.push({
        type: 'image',
        id: image.id,
        title: image.associatedContent.title,
        description: image.alt,
        alt: image.alt,
        url: image.associatedContent.url,
        image: image.src,
        relevance: 0
      });
    }
  }

  // 添加页面到搜索数据
  if (!filters?.types || filters.types.includes('page')) {
    for (const page of index.pages) {
      searchData.push({
        type: 'page',
        id: page.id,
        title: page.title,
        description: page.description,
        url: page.path,
        relevance: 0
      });
    }
  }

  // 配置 Fuse.js 选项
  // 使用类型推断，避免命名空间类型错误
  const fuseOptions = {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'content', weight: 0.2 },
      { name: 'alt', weight: 0.1 }
    ],
    threshold: 0.3, // 模糊匹配阈值（0-1，越小越严格）
    ignoreLocation: true, // 忽略匹配位置
    includeScore: true, // 包含相关性分数
    minMatchCharLength: 1 // 最小匹配字符长度
  };

  // 创建 Fuse 实例并执行搜索
  const fuse = new Fuse(searchData, fuseOptions);
  const fuseResults = fuse.search(queryTrimmed);

  // 转换 Fuse 结果为 SearchResult
  for (const result of fuseResults) {
    const item = result.item;
    // Fuse.js 的 score 是距离分数（越小越好），我们需要转换为相关性分数（越大越好）
    const relevance = 1 - Math.min(result.score || 0, 1);
    
    allResults.push({
      type: item.type,
      id: item.id,
      title: item.title,
      description: item.description,
      url: item.url,
      image: item.image,
      alt: item.alt,
      relevance
    });
  }

  // 如果没有使用 Fuse.js 找到结果，回退到简单匹配（用于短查询）
  if (allResults.length === 0 && queryTrimmed.length >= 2) {
    // 简单的文本匹配作为后备
    for (const item of searchData) {
      const searchText = `${item.title} ${item.description || ''} ${item.content || ''} ${item.alt || ''}`.toLowerCase();
      const queryLower = queryTrimmed.toLowerCase();
      
      if (searchText.includes(queryLower)) {
        let relevance = 0.5;
        if (item.title.toLowerCase().includes(queryLower)) {
          relevance = 0.8;
        } else if (item.title.toLowerCase().startsWith(queryLower)) {
          relevance = 0.9;
        }
        
        allResults.push({
          type: item.type,
          id: item.id,
          title: item.title,
          description: item.description,
          url: item.url,
          image: item.image,
          alt: item.alt,
          relevance
        });
      }
    }
  }

  // 排序
  if (filters?.sortBy === 'title') {
    allResults.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // 默认按相关性排序
    allResults.sort((a, b) => b.relevance - a.relevance);
  }

  // 限制结果数量
  const maxResults = 50;
  const limitedResults = allResults.slice(0, maxResults);

  return {
    query: queryTrimmed,
    results: limitedResults,
    total: allResults.length,
    locale,
    filters
  };
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
