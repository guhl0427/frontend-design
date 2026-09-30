/**
 * 视图状态 ↔ URL 查询参数双向同步（F1 深链分享）。
 * 约定：?cat=<分类>&q=<关键词>&style=<风格id>
 * 使用 replaceState，避免每次筛选都往历史栈塞记录导致后退键难以使用。
 */

export interface ViewState {
  category: string;
  keyword: string;
  styleId: string | null;
}

export const DEFAULT_VIEW: ViewState = { category: '全部', keyword: '', styleId: null };

/** 从当前 URL 读取视图状态（用于首屏初始化） */
export function readViewState(): ViewState {
  if (typeof window === 'undefined') return DEFAULT_VIEW;
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get('cat') ?? DEFAULT_VIEW.category,
    keyword: params.get('q') ?? DEFAULT_VIEW.keyword,
    styleId: params.get('style'),
  };
}

/** 把视图状态写回 URL（省略默认值，保持链接干净） */
export function writeViewState(state: ViewState): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams();
  if (state.category !== DEFAULT_VIEW.category) params.set('cat', state.category);
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
