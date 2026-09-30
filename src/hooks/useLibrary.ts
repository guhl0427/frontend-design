import { useCallback, useEffect, useState } from 'react';

/** 收藏列表的 localStorage 键 */
const FAVORITES_KEY = 'style-gallery:favorites';
/** 最近浏览列表的 localStorage 键 */
const RECENT_KEY = 'style-gallery:recent';
/** 最近浏览最多保留条数 */
const RECENT_LIMIT = 8;

export interface UseLibraryResult {
  /** 已收藏的风格 id，最近收藏在前 */
  favorites: string[];
  /** 最近查看的风格 id，最多 8 条，最近在前，已去重 */
  recent: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  pushRecent: (id: string) => void;
  clearRecent: () => void;
}

/** 安全读取 localStorage 中的字符串数组：隐私模式 / 非法 JSON 一律降级为空数组 */
function readIds(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is string => typeof value === 'string');
  } catch {
    return [];
  }
}

/** 安全写入 localStorage：隐私模式 / 存储配额不足时静默失败 */
function writeIds(key: string, ids: string[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // 忽略写入失败（无痕模式 / 配额不足）
  }
}

/**
 * 收藏与最近使用（F3）：localStorage 持久化 + 跨标签页同步。
 * 首屏数据在 useState 初始化函数中同步读取，避免先渲染空列表再回填造成闪烁。
 */
export function useLibrary(): UseLibraryResult {
  const [favorites, setFavorites] = useState<string[]>(() => readIds(FAVORITES_KEY));
  const [recent, setRecent] = useState<string[]>(() => readIds(RECENT_KEY).slice(0, RECENT_LIMIT));

  // 状态变化后回写 localStorage（首帧写入与初值相同，不会触发 storage 事件）
  useEffect(() => {
    writeIds(FAVORITES_KEY, favorites);
  }, [favorites]);
  useEffect(() => {
    writeIds(RECENT_KEY, recent);
  }, [recent]);

  // 同步其他标签页的写入：storage 事件只在「其他」标签页触发，天然不会自激循环
  useEffect(() => {
    const onStorage = (event: StorageEvent): void => {
      if (event.key === null || event.key === FAVORITES_KEY) {
        setFavorites(readIds(FAVORITES_KEY));
      }
      if (event.key === null || event.key === RECENT_KEY) {
        setRecent(readIds(RECENT_KEY).slice(0, RECENT_LIMIT));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isFavorite = useCallback((id: string): boolean => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback((id: string): void => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((entry) => entry !== id) : [id, ...prev]));
  }, []);

  const pushRecent = useCallback((id: string): void => {
    setRecent((prev) => [id, ...prev.filter((entry) => entry !== id)].slice(0, RECENT_LIMIT));
  }, []);

  const clearRecent = useCallback((): void => {
    setRecent([]);
  }, []);

  return { favorites, recent, isFavorite, toggleFavorite, pushRecent, clearRecent };
}
