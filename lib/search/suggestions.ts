/**
 * 搜索建议和热门搜索
 * 从搜索索引中提取热门关键词和建议
 */

import { SearchIndex } from './types';

/**
 * 从索引中提取热门搜索建议
 */
export async function getSearchSuggestions(
  query: string,
  locale: string,
  limit: number = 5
): Promise<string[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    // 加载搜索索引
    const indexUrl = `/search-index/${locale}.json`;
    const response = await fetch(indexUrl);
    if (!response.ok) {
      return [];
    }
    const index: SearchIndex = await response.json();

    const suggestions: string[] = [];
    const queryLower = query.toLowerCase().trim();

    // 从产品名称中提取建议
    for (const product of index.products) {
      if (product.name.toLowerCase().includes(queryLower)) {
        suggestions.push(product.name);
      }
      // 从描述中提取关键词
      const words = product.description.split(/\s+/);
      for (const word of words) {
        if (word.length > 3 && word.toLowerCase().startsWith(queryLower)) {
          suggestions.push(word);
        }
      }
    }

    // 从文章标题中提取建议
    for (const article of index.articles) {
      if (article.title.toLowerCase().includes(queryLower)) {
        suggestions.push(article.title);
      }
      // 从副标题中提取关键词
      const words = article.subtitle.split(/\s+/);
      for (const word of words) {
        if (word.length > 3 && word.toLowerCase().startsWith(queryLower)) {
          suggestions.push(word);
        }
      }
    }

    // 去重并限制数量
    const uniqueSuggestions = Array.from(new Set(suggestions))
      .filter(s => s.toLowerCase() !== queryLower)
      .slice(0, limit);

    return uniqueSuggestions;
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return [];
  }
}

/**
 * 获取热门搜索关键词
 */
export async function getPopularSearches(locale: string, limit: number = 8): Promise<string[]> {
  try {
    // 加载搜索索引
    const indexUrl = `/search-index/${locale}.json`;
    const response = await fetch(indexUrl);
    if (!response.ok) {
      return getDefaultPopularSearches(locale);
    }
    const index: SearchIndex = await response.json();

    const popular: string[] = [];

    // 产品名称（最热门）
    for (const product of index.products) {
      popular.push(product.name);
    }

    // 热门文章标题
    const popularArticles = index.articles
      .filter(a => a.category === 'human') // 人类和rology文章更热门
      .slice(0, 3)
      .map(a => a.title);

    popular.push(...popularArticles);

    // 添加一些通用关键词
    const commonKeywords = getDefaultPopularSearches(locale);
    popular.push(...commonKeywords);

    // 去重并限制数量
    return Array.from(new Set(popular)).slice(0, limit);
  } catch (error) {
    console.error('Error getting popular searches:', error);
    return getDefaultPopularSearches(locale);
  }
}

/**
 * 默认热门搜索（当无法加载索引时使用）
 */
function getDefaultPopularSearches(locale: string): string[] {
  // 根据语言返回不同的默认热门搜索
  const defaults: Record<string, string[]> = {
    en: [
      'Nexus Dx1',
      'CASA system',
      'WHO 6th Edition',
      'Semen analysis',
      'Sperm morphology',
      'MSQA-100',
      'SQA-6100Vet',
      'Human andrology'
    ],
    es: [
      'Nexus Dx1',
      'Sistema CASA',
      'OMS 6ª Edición',
      'Análisis de semen',
      'Morfología espermática',
      'MSQA-100',
      'SQA-6100Vet',
      'Andrología humana'
    ],
    de: [
      'Nexus Dx1',
      'CASA-System',
      'WHO 6. Auflage',
      'Spermaanalyse',
      'Spermienmorphologie',
      'MSQA-100',
      'SQA-6100Vet',
      'Humane Andrologie'
    ],
    fr: [
      'Nexus Dx1',
      'Système CASA',
      'OMS 6ème édition',
      'Analyse du sperme',
      'Morphologie des spermatozoïdes',
      'MSQA-100',
      'SQA-6100Vet',
      'Andrologie humaine'
    ],
    ja: [
      'Nexus Dx1',
      'CASAシステム',
      'WHO第6版',
      '精液分析',
      '精子形態',
      'MSQA-100',
      'SQA-6100Vet',
      'ヒト男性学'
    ],
    ko: [
      'Nexus Dx1',
      'CASA 시스템',
      'WHO 6판',
      '정액 분석',
      '정자 형태',
      'MSQA-100',
      'SQA-6100Vet',
      '인간 남성학'
    ]
  };

  return defaults[locale] || defaults.en;
}
