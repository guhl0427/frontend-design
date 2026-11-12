/**
 * 视图状态 ↔ URL 查询参数双向同步（F1 深链分享）。
 * 约定：?cat=<英文分类 slug>&q=<关键词>&style=<风格id>
 * 使用 replaceState，避免每次筛选都往历史栈塞记录导致后退键难以使用。
 */

import type { StyleCategory } from '../types';

export interface ViewState {
  category: string;
  keyword: string;
  styleId: string | null;
}

export const DEFAULT_VIEW: ViewState = { category: '全部', keyword: '', styleId: null };

/**
 * 分类 ↔ URL slug 映射。
 * URL 一律使用 ASCII 英文：中文分类名会被浏览器编码成 %E7%8E%B0%E4%BB%A3，
 * 分享到 IM / 邮件后既不可读，也容易被客户端二次转义或截断。
 */
const CATEGORY_SLUGS: Record<StyleCategory, string> = {
  现代: 'modern',
  极简: 'minimal',
  复古: 'retro',
  工业: 'industrial',
  柔和: 'soft',
  未来: 'future',
  艺术: 'art',
  国风: 'chinese',
  企业: 'corporate',
};

const SLUG_CATEGORIES: ReadonlyMap<string, StyleCategory> = new Map(
  (Object.entries(CATEGORY_SLUGS) as [StyleCategory, string][]).map(([category, slug]) => [slug, category]),
);

/** 分类名 → URL slug；「全部」与本地筛选哨兵返回 null（不入 URL） */
export function categoryToSlug(category: string): string | null {
  return (CATEGORY_SLUGS as Record<string, string>)[category] ?? null;
}

/**
 * URL 参数 → 分类名。
 * 兼容两种历史/手写形态：英文 slug（cat=art）与中文分类名（cat=艺术）。
 */
export function slugToCategory(raw: string | null): StyleCategory | null {
  if (raw === null || raw.trim() === '') return null;
  const bySlug = SLUG_CATEGORIES.get(raw.trim().toLowerCase());
  if (bySlug !== undefined) return bySlug;
  const byName = (Object.keys(CATEGORY_SLUGS) as StyleCategory[]).find((name) => name === raw.trim());
  return byName ?? null;
}

/** 从当前 URL 读取视图状态（用于首屏初始化） */
export function readViewState(): ViewState {
  if (typeof window === 'undefined') return DEFAULT_VIEW;
  const params = new URLSearchParams(window.location.search);
  return {
    category: slugToCategory(params.get('cat')) ?? DEFAULT_VIEW.category,
    keyword: params.get('q') ?? DEFAULT_VIEW.keyword,
    styleId: params.get('style'),
  };
}

/** 把视图状态写回 URL（省略默认值，保持链接干净；分类写英文 slug） */
export function writeViewState(state: ViewState): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams();
  const slug = categoryToSlug(state.category);
  if (slug !== null) params.set('cat', slug);
  if (state.keyword.trim() !== '') params.set('q', state.keyword.trim());
  if (state.styleId !== null) params.set('style', state.styleId);

  const query = params.toString();
  const next = `${window.location.pathname}${query === '' ? '' : `?${query}`}${window.location.hash}`;
  window.history.replaceState(null, '', next);
}

/** 生成某个风格的分享链接（绝对地址） */
export function buildShareLink(styleId: string): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('style', styleId);
  return url.toString();
}
