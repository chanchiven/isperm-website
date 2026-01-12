/**
 * 搜索历史管理
 * 使用 localStorage 保存和读取搜索历史
 */

const STORAGE_KEY = 'isperm_search_history';
const MAX_HISTORY = 20; // 最多保存 20 条历史记录

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultCount?: number;
}

/**
 * 获取搜索历史
 */
export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const history = JSON.parse(stored) as SearchHistoryItem[];
    // 按时间戳倒序排列（最新的在前）
    return history.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error reading search history:', error);
    return [];
  }
}

/**
 * 保存搜索历史
 */
export function saveSearchHistory(query: string, resultCount?: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const history = getSearchHistory();
    
    // 移除相同的查询（如果存在）
    const filteredHistory = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
    
    // 添加新记录到开头
    const newItem: SearchHistoryItem = {
      query,
      timestamp: Date.now(),
      resultCount
    };
    
    const newHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY);
    // 按时间戳排序（最新的在前）
    const sortedHistory = newHistory.sort((a, b) => b.timestamp - a.timestamp);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedHistory));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
}

/**
 * 清除搜索历史
 */
export function clearSearchHistory(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
}

/**
 * 删除单条搜索历史
 */
export function removeSearchHistoryItem(query: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const history = getSearchHistory();
    const filteredHistory = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Error removing search history item:', error);
  }
}
