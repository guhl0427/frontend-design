import { useEffect, useMemo, useState } from 'react';
import type { StyleItem } from './types';
import { CATEGORIES, STYLES } from './data/styles';
import StyleCard from './components/StyleCard';
import PromptDetail from './components/PromptDetail';
import Customizer from './components/Customizer';
import CompareTray from './components/CompareTray';
import CompareDialog from './components/CompareDialog';
import { useCopy } from './hooks/useCopy';
import { useLibrary } from './hooks/useLibrary';
import {
  buildBundleMarkdown,
  buildDesignMdBundle,
  bundleFilename,
  designMdBundleFilename,
  downloadText,
} from './utils/export';
import { DEFAULT_VIEW, readViewState, writeViewState } from './utils/viewState';

/** 全部分类（含「全部」） */
const CATEGORY_FILTERS: string[] = ['全部', ...CATEGORIES];

/** 「收藏」筛选哨兵：本地数据，仅内存态，绝不写入 URL */
const FAVORITES_FILTER = '__favorites__';
/** 「最近」筛选哨兵：本地数据，仅内存态，绝不写入 URL */
const RECENT_FILTER = '__recent__';
/** 同时对比的风格上限 */
const COMPARE_LIMIT = 3;

/** 把 id 列表映射为风格对象列表（保持传入顺序，过滤掉已不存在的 id） */
function resolveById(ids: string[]): StyleItem[] {
  return ids
    .map((id) => STYLES.find((item) => item.id === id))
    .filter((item): item is StyleItem => item !== undefined);
}

/** 按「筛选模式 + 关键词」过滤风格列表；收藏 / 最近按本地数组顺序输出 */
function filterStyles(
  styles: StyleItem[],
  filter: string,
  keyword: string,
  favorites: string[],
  recent: string[],
): StyleItem[] {
  const kw = keyword.trim().toLowerCase();

  let base: StyleItem[];
  if (filter === FAVORITES_FILTER) {
    base = resolveById(favorites);
  } else if (filter === RECENT_FILTER) {
    base = resolveById(recent);
  } else {
    base = styles.filter((item) => filter === '全部' || item.category === filter);
  }

  if (kw === '') return base;
  return base.filter((item) =>
    [item.nameZh, item.nameEn, item.category, item.summary, ...item.tags]
      .join(' ')
      .toLowerCase()
      .includes(kw),
  );
}

/** 空结果文案：区分「本地数据为空」与「关键词无匹配」 */
function emptyMessageFor(filter: string, favorites: string[], recent: string[]): string {
  if (filter === FAVORITES_FILTER && favorites.length === 0) {
    return '还没有收藏任何风格，点击卡片右上角的 ☆ 收藏';
  }
  if (filter === RECENT_FILTER && recent.length === 0) {
    return '还没有浏览记录';
  }
  return '没有匹配的风格，试试其他关键词或切换分类。';
}

export default function App(): JSX.Element {
  // 首屏从 URL 恢复视图（F1 深链分享）：?cat=<分类>&q=<关键词>&style=<风格id>
  const initial = useMemo(() => readViewState(), []);
  const [activeFilter, setActiveFilter] = useState<string>(() =>
    CATEGORY_FILTERS.includes(initial.category) ? initial.category : DEFAULT_VIEW.category,
  );
  const [keyword, setKeyword] = useState<string>(initial.keyword);
  const [selected, setSelected] = useState<StyleItem | null>(
    () => STYLES.find((item) => item.id === initial.styleId) ?? null,
  );
  const [customizing, setCustomizing] = useState<StyleItem | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const { copied: linkCopied, copy: copyLink } = useCopy();
  const { favorites, recent, isFavorite, toggleFavorite, pushRecent, clearRecent } = useLibrary();

  const visibleStyles = useMemo(
    () => filterStyles(STYLES, activeFilter, keyword, favorites, recent),
    [activeFilter, keyword, favorites, recent],
  );

  const compareItems = useMemo(() => resolveById(compareIds), [compareIds]);

  // 视图状态回写 URL（replaceState，避免污染后退栈）。
  // 收藏 / 最近属于本地数据，绝不能写入 ?cat=，否则分享出去别人看到空列表。
  useEffect(() => {
    const isLocalFilter = activeFilter === FAVORITES_FILTER || activeFilter === RECENT_FILTER;
    writeViewState({
      category: isLocalFilter ? DEFAULT_VIEW.category : activeFilter,
      keyword,
      styleId: selected?.id ?? null,
    });
  }, [activeFilter, keyword, selected]);

  // 轻提示自动消失
  useEffect(() => {
    if (notice === null) return;
    const timer = window.setTimeout(() => setNotice(null), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const handleExportBundle = (): void => {
    if (visibleStyles.length === 0) return;
    downloadText(bundleFilename(), buildBundleMarkdown(visibleStyles));
  };

  const handleExportDesignBundle = (): void => {
    if (visibleStyles.length === 0) return;
    downloadText(designMdBundleFilename(), buildDesignMdBundle(visibleStyles));
  };

  /** 打开详情弹窗，同时记入「最近浏览」 */
  const handleOpen = (item: StyleItem): void => {
    setSelected(item);
    pushRecent(item.id);
  };

  /** 打开定制抽屉：关闭详情弹窗，避免两层模态叠加 */
  const handleCustomize = (item: StyleItem): void => {
    setSelected(null);
    setCustomizing(item);
  };

  /** 加入 / 移出对比集；已达上限时给出可见提示而非静默忽略 */
  const handleToggleCompare = (item: StyleItem): void => {
    if (compareIds.includes(item.id)) {
      setCompareIds(compareIds.filter((id) => id !== item.id));
      return;
    }
    if (compareIds.length >= COMPARE_LIMIT) {
      setNotice(`最多同时对比 ${COMPARE_LIMIT} 款风格，请先移出一款`);
      return;
    }
    setCompareIds([...compareIds, item.id]);
  };

  const handleRemoveCompare = (id: string): void => {
    setCompareIds((prev) => prev.filter((entry) => entry !== id));
  };

  /** 打开对比视图：先关闭详情弹窗，保证同一时刻只有一个模态层 */
  const handleStartCompare = (): void => {
    if (compareIds.length === 0) return;
    setSelected(null);
    setComparing(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* 页头 */}
      <header className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                前端风格提示词画廊
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
                {STYLES.length} 种结构化前端风格提示词：设计理念 · 字体方案 · HSL 色板 · 间距圆角 · 组件规则 ·
                反模式禁令。每张卡片用该风格自身规则实时渲染，点击查看完整提示词，一键复制即可投喂给你的 AI 编程助手。
                支持深链分享、Markdown / DESIGN.md 导出、三档参数定制与多风格对比。
              </p>
            </div>
            <div className="rounded-lg border border-white/5 bg-surface-raised px-4 py-2 text-sm text-ink-muted">
              纯 CSS 预览 · 无截图 · 无版权负担
            </div>
          </div>
        </div>
      </header>

      {/* 筛选与搜索 */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {/* 收藏 / 最近：本地数据筛选，与分类筛选互斥（同一时刻只有一个筛选生效） */}
            <button
              type="button"
              onClick={() => setActiveFilter(FAVORITES_FILTER)}
              aria-pressed={activeFilter === FAVORITES_FILTER}
              aria-label="筛选已收藏的风格"
              className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                activeFilter === FAVORITES_FILTER
                  ? 'border-brand bg-brand text-surface'
                  : 'border-white/10 text-ink-muted hover:border-brand/40 hover:text-ink'
              }`}
            >
              ★ 收藏
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter(RECENT_FILTER)}
              aria-pressed={activeFilter === RECENT_FILTER}
              aria-label="筛选最近浏览的风格"
              className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                activeFilter === RECENT_FILTER
                  ? 'border-brand bg-brand text-surface'
                  : 'border-white/10 text-ink-muted hover:border-brand/40 hover:text-ink'
              }`}
            >
              ◷ 最近
            </button>

            {CATEGORY_FILTERS.map((category) => {
              const isActive = activeFilter === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveFilter(category)}
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                    isActive
                      ? 'border-brand bg-brand text-surface'
                      : 'border-white/10 text-ink-muted hover:border-brand/40 hover:text-ink'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-faint">⌕</span>
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜索风格名称 / 关键词…"
                className="w-full rounded-full border border-white/10 bg-surface-raised py-2 pr-4 pl-8 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none"
              />
            </div>
            <span className="text-xs whitespace-nowrap text-ink-faint">
              {visibleStyles.length} / {STYLES.length}
            </span>
            {activeFilter === RECENT_FILTER && recent.length > 0 && (
              <button
                type="button"
                onClick={clearRecent}
                className="cursor-pointer rounded-full border border-white/10 px-3.5 py-2 text-sm text-ink-muted transition-colors hover:border-brand/40 hover:text-ink"
              >
                清空浏览记录
              </button>
            )}
            <button
              type="button"
              onClick={() => void copyLink(window.location.href)}
              className="cursor-pointer rounded-full border border-white/10 px-3.5 py-2 text-sm text-ink-muted transition-colors hover:border-brand/40 hover:text-ink"
            >
              {linkCopied ? '链接已复制 ✓' : '分享本页'}
            </button>
            <button
              type="button"
              onClick={handleExportBundle}
              disabled={visibleStyles.length === 0}
              className="cursor-pointer rounded-full border border-white/10 px-3.5 py-2 text-sm text-ink-muted transition-colors hover:border-brand/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              导出 {visibleStyles.length} 条 .md
            </button>
            <button
              type="button"
              onClick={handleExportDesignBundle}
              disabled={visibleStyles.length === 0}
              className="cursor-pointer rounded-full border border-white/10 px-3.5 py-2 text-sm text-ink-muted transition-colors hover:border-brand/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              导出 DESIGN.md 合集
            </button>
          </div>
        </div>
      </div>

      {/* 卡片网格（flex-1 + min-h-screen：保证任意视口下 maxScrollY ≥ 317px > header 偏移 181px，sticky 筛选栏恒钉顶） */}
      <main
        className={`mx-auto min-h-screen w-full max-w-7xl flex-1 px-4 pt-8 sm:px-6 lg:px-8 ${
          compareItems.length > 0 ? 'pb-32' : 'pb-8'
        }`}
      >
        {visibleStyles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 py-24 text-center">
            <p className="text-ink-muted">{emptyMessageFor(activeFilter, favorites, recent)}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleStyles.map((item) => (
              <StyleCard
                key={item.id}
                item={item}
                onOpen={handleOpen}
                onCustomize={handleCustomize}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={toggleFavorite}
                inCompare={compareIds.includes(item.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))}
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-ink-faint sm:px-6 lg:px-8">
          提示词正文可直接粘贴至 Claude / Cursor / v0 / bolt 等工具 · 字体来自 Google Fonts ·
          链接参数 <code className="font-mono">?cat= 分类 &amp; q= 关键词 &amp; style= 风格</code> 可直接分享
        </div>
      </footer>

      {/* 详情弹窗 */}
      {selected !== null && (
        <PromptDetail
          item={selected}
          onClose={() => setSelected(null)}
          onCustomize={handleCustomize}
          isFavorite={isFavorite(selected.id)}
          onToggleFavorite={toggleFavorite}
          inCompare={compareIds.includes(selected.id)}
          onToggleCompare={handleToggleCompare}
        />
      )}

      {/* 定制抽屉 */}
      {customizing !== null && (
        <Customizer item={customizing} onClose={() => setCustomizing(null)} />
      )}

      {/* 底部对比条（对比集为空时整条不渲染） */}
      <CompareTray
        items={compareItems}
        onRemove={handleRemoveCompare}
        onClear={() => setCompareIds([])}
        onStart={handleStartCompare}
      />

      {/* 对比视图 */}
      {comparing && <CompareDialog items={compareItems} onClose={() => setComparing(false)} />}

      {/* 轻提示（对比集上限等） */}
      {notice !== null && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-surface-raised px-4 py-2 text-sm text-ink"
        >
          {notice}
        </div>
      )}
    </div>
  );
}
