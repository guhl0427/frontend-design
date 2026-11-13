/**
 * 视图状态 ↔ URL 查询参数双向同步（F1 深链分享）。
 * 约定：?cat=<英文分类 slug>&q=<关键词>&style=<风格id>
 * 画廊内的筛选变化用 replaceState（避免每次输入都往历史栈塞记录）；
 * 只有「进入 / 离开详情页」这类真正的页面跳转才用 pushState，
 * 这样浏览器后退键的语义是「回画廊」，而不是逐字回退搜索词。
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

/** 把视图状态序列化为「路径 + 查询串 + hash」（省略默认值，保持链接干净；分类写英文 slug） */
export function buildViewHref(state: ViewState): string {
  const params = new URLSearchParams();
  const slug = categoryToSlug(state.category);
  if (slug !== null) params.set('cat', slug);
  if (state.keyword.trim() !== '') params.set('q', state.keyword.trim());
  if (state.styleId !== null) params.set('style', state.styleId);

  const query = params.toString();
  const pathname = typeof window === 'undefined' ? '/' : window.location.pathname;
  const hash = typeof window === 'undefined' ? '' : window.location.hash;
  return `${pathname}${query === '' ? '' : `?${query}`}${hash}`;
}

/** 把视图状态写回 URL（覆盖当前历史记录） */
export function writeViewState(state: ViewState): void {
  if (typeof window === 'undefined') return;
  // 保留 history.state：详情页会在 state 上打标记，供「返回」判断是否需要走浏览器后退
  window.history.replaceState(window.history.state, '', buildViewHref(state));
}

/**
 * 压入一条新的历史记录（进入 / 离开详情页时使用）。
 * `detail: true` 标记本页是风格详情页，关闭时优先走 history.back()，
 * 让浏览器的后退键与站内的「返回画廊」是同一件事。
 */
export function pushViewState(state: ViewState, detail = false): void {
  if (typeof window === 'undefined') return;
  window.history.pushState(detail ? { sgDetail: true } : null, '', buildViewHref(state));
}

/** 当前历史记录是否是我们压入的详情页记录 */
export function isDetailHistoryEntry(): boolean {
  if (typeof window === 'undefined') return false;
  return (window.history.state as { sgDetail?: boolean } | null)?.sgDetail === true;
}

/** 生成某个风格的分享链接（绝对地址） */
export function buildShareLink(styleId: string): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('style', styleId);
  return url.toString();
}
