import { useCallback, useEffect, useMemo, useRef, useState, type JSX } from 'react';
import type { StyleItem } from './types';
import { CATEGORIES, STYLES } from './data/styles';
import StyleCard from './components/StyleCard';
import StyleDetailPage from './components/StyleDetailPage';
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
import {
  DEFAULT_VIEW,
  isDetailHistoryEntry,
  pushViewState,
  readViewState,
  writeViewState,
} from './utils/viewState';

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
  // 首屏从 URL 恢复视图（F1 深链分享）：?cat=<英文分类 slug>&q=<关键词>&style=<风格id>
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

  // 进入详情页前的画廊滚动位置与触发卡片：返回时回到原位、把焦点交还给那一次点击
  const galleryScrollRef = useRef(0);
  const pendingFocusRef = useRef<string | null>(null);

  const visibleStyles = useMemo(
    () => filterStyles(STYLES, activeFilter, keyword, favorites, recent),
    [activeFilter, keyword, favorites, recent],
  );

  const compareItems = useMemo(() => resolveById(compareIds), [compareIds]);

  /**
   * 可分享的分类值：收藏 / 最近是本地筛选，写进 URL 会让接收者看到空列表，
   * 因此对外一律回落为默认分类。URL 回写与进入详情页共用这一处判断，避免两处分叉。
   */
  const shareableCategory =
    activeFilter === FAVORITES_FILTER || activeFilter === RECENT_FILTER ? DEFAULT_VIEW.category : activeFilter;

  /** 详情页需要的编号与相邻风格：全部按数据源顺序推导，筛选状态不影响 */
  const detailNav = useMemo(() => {
    if (selected === null) return { index: 0, prev: null, next: null };
    const position = STYLES.indexOf(selected);
    return {
      index: position + 1,
      prev: position > 0 ? { item: STYLES[position - 1], index: position } : null,
      next: position >= 0 && position < STYLES.length - 1 ? { item: STYLES[position + 1], index: position + 2 } : null,
    };
  }, [selected]);

  // 视图状态回写 URL（replaceState，避免污染后退栈）。
  // 收藏 / 最近属于本地数据，绝不能写入 ?cat=，否则分享出去别人看到空列表。
  useEffect(() => {
    writeViewState({ category: shareableCategory, keyword, styleId: selected?.id ?? null });
  }, [shareableCategory, keyword, selected]);

  // 浏览器前进 / 后退：以 URL 上的 ?style= 作为「是否在详情页」的唯一真相
  useEffect(() => {
    const onPopState = (): void => {
      const view = readViewState();
      setSelected(STYLES.find((item) => item.id === view.styleId) ?? null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // 回到画廊后：恢复滚动位置，并把焦点交还给进入详情页的那张卡片封面
  useEffect(() => {
    if (selected !== null) return;
    const id = pendingFocusRef.current;
    if (id === null) return;
    pendingFocusRef.current = null;
    window.scrollTo({ top: galleryScrollRef.current });
    const cover = document.querySelector<HTMLElement>(`[data-cover-id="${id}"]`);
    cover?.focus({ preventScroll: true });
  }, [selected]);

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

  /**
   * 进入详情页：压一条历史记录（浏览器后退键 = 返回画廊），记入「最近浏览」，
   * 并记下当前滚动位置与触发卡片，供返回时还原。
   */
  const handleOpen = (item: StyleItem): void => {
    galleryScrollRef.current = window.scrollY;
    pendingFocusRef.current = item.id;
    setSelected(item);
    pushRecent(item.id);
    pushViewState({ category: shareableCategory, keyword, styleId: item.id }, true);
  };

  /** 详情页内的上一款 / 下一款：同级替换，不额外堆叠历史记录 */
  const handleNavigate = (item: StyleItem): void => {
    setSelected(item);
    pushRecent(item.id);
  };

  /**
   * 返回画廊。
   * 从卡片点进来的详情页在历史里带标记，走 history.back() 让「后退键」与「返回」是同一件事；
   * 深链直达（?style=xxx 首次打开）没有可退的本站记录，直接切回画廊，不把用户带离站点。
   */
  const handleBack = useCallback((): void => {
    if (isDetailHistoryEntry()) {
      window.history.back();
      return;
    }
    setSelected(null);
  }, []);

  /** 打开定制抽屉；详情页是页面而非模态，抽屉可以叠在它上面并保留上下文 */
  const handleCustomize = (item: StyleItem): void => {
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

  /** 打开对比视图：详情页会保留在下面，关闭对比后仍在原页 */
  const handleStartCompare = (): void => {
    if (compareIds.length === 0) return;
    setComparing(true);
  };

  /** 分类 tab：选中态只加一条 1px 琥珀下划线，不用色块填充 */
  const tabClass = (isActive: boolean): string =>
    `shrink-0 cursor-pointer border-b-2 px-3 pt-3.5 pb-2.5 text-[13px] whitespace-nowrap transition-colors ${
      isActive ? 'border-brand text-ink' : 'border-transparent text-ink-muted hover:text-ink'
    }`;

  /** 工具行按钮：无边框、无底色，靠文字明度区分层级 */
  const ghostBtnClass =
    'cursor-pointer py-1 text-[13px] text-ink-faint transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40';

  /**
   * 画廊与详情页共用的附加层。
   * 抽屉 / 对比条 / 对比视图 / 轻提示在两种视图下行为一致，
   * 因此只写一次、两处引用，避免「详情页少了一个能力」这类不一致。
   */
  const overlays = (
    <>
      {customizing !== null && <Customizer item={customizing} onClose={() => setCustomizing(null)} />}

      {/* 底部对比条（对比集为空时整条不渲染） */}
      <CompareTray
        items={compareItems}
        onRemove={handleRemoveCompare}
        onClear={() => setCompareIds([])}
        onStart={handleStartCompare}
      />

      {comparing && <CompareDialog items={compareItems} onClose={() => setComparing(false)} />}

      {notice !== null && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 border border-line-strong bg-surface-raised px-3.5 py-2 text-[12.5px] text-ink"
        >
          {notice}
        </div>
      )}
    </>
  );

  // 详情页是独立页面：不渲染画廊的页头、筛选栏与网格，避免「弹窗式」的双层信息
  if (selected !== null) {
    return (
      <div className="flex min-h-screen flex-col">
        <StyleDetailPage
          item={selected}
          index={detailNav.index}
          onBack={handleBack}
          onCustomize={handleCustomize}
          isFavorite={isFavorite(selected.id)}
          onToggleFavorite={toggleFavorite}
          inCompare={compareIds.includes(selected.id)}
          onToggleCompare={handleToggleCompare}
          prev={detailNav.prev}
          next={detailNav.next}
          onNavigate={handleNavigate}
          hasCompare={compareItems.length > 0}
        />
        {overlays}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/*
        页头：压到两行以内，让第一排卡片完整落在首屏。
        原先四行的产品功能说明段已下沉到页脚——它解释的是「这个页面是做什么的」，
        属于首屏不需要的内容；画廊首屏该让作品先出现。
      */}
      <header className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-4 pt-9 pb-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
            <h1 className="text-[22px] font-semibold tracking-[-0.015em] text-ink">前端风格提示词画廊</h1>
            <p className="font-mono text-[11px] tracking-[0.14em] text-ink-faint">
              {STYLES.length} 种风格 · 各含 7 段提示词 · 纯 CSS 渲染
            </p>
          </div>
        </div>
      </header>

      {/* 筛选与搜索 */}
      <div className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-sm">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {/* 小屏上分类放不下时会横向滚动，右边缘渐隐提示「后面还有」 */}
          <div className="no-scrollbar -ml-3 -mb-px flex gap-x-0.5 overflow-x-auto max-sm:[mask-image:linear-gradient(to_right,#000_0%,#000_82%,transparent_100%)]">
            {/* 收藏 / 最近：本地数据筛选，与分类筛选互斥（同一时刻只有一个筛选生效） */}
            <button
              type="button"
              onClick={() => setActiveFilter(FAVORITES_FILTER)}
              aria-pressed={activeFilter === FAVORITES_FILTER}
              aria-current={activeFilter === FAVORITES_FILTER ? 'true' : undefined}
              aria-label="筛选已收藏的风格"
              className={tabClass(activeFilter === FAVORITES_FILTER)}
            >
              ★ 收藏
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter(RECENT_FILTER)}
              aria-pressed={activeFilter === RECENT_FILTER}
              aria-current={activeFilter === RECENT_FILTER ? 'true' : undefined}
              aria-label="筛选最近浏览的风格"
              className={tabClass(activeFilter === RECENT_FILTER)}
            >
              ◷ 最近
            </button>

            {/* 本地数据与分类之间用一条细竖线分组 */}
            <span aria-hidden="true" className="mx-2 my-auto h-3 w-px shrink-0 bg-line-strong" />

            {CATEGORY_FILTERS.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveFilter(category)}
                aria-current={activeFilter === category ? 'true' : undefined}
                className={tabClass(activeFilter === category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line py-2.5">
            <div className="relative min-w-0 flex-1 sm:max-w-[20rem]">
              <span className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 font-mono text-[13px] leading-none text-ink-faint">
                /
              </span>
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜索风格名称或关键词"
                className="w-full border-b border-line-strong bg-transparent py-1 pr-2 pl-4 text-[13px] text-ink placeholder:text-ink-faint focus:border-brand focus:outline-hidden"
              />
            </div>
            <span className="font-mono text-[11px] tracking-[0.08em] whitespace-nowrap text-ink-faint">
              {visibleStyles.length} / {STYLES.length}
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:ml-auto">
              {activeFilter === RECENT_FILTER && recent.length > 0 && (
                <button type="button" onClick={clearRecent} className={ghostBtnClass}>
                  清空浏览记录
                </button>
              )}
              <button type="button" onClick={() => void copyLink(window.location.href)} className={ghostBtnClass}>
                {linkCopied ? '链接已复制 ✓' : '分享本页'}
              </button>
              <button
                type="button"
                onClick={handleExportBundle}
                disabled={visibleStyles.length === 0}
                className={ghostBtnClass}
              >
                导出 {visibleStyles.length} 条 .md
              </button>
              <button
                type="button"
                onClick={handleExportDesignBundle}
                disabled={visibleStyles.length === 0}
                className={ghostBtnClass}
              >
                导出 DESIGN.md 合集
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 卡片网格（flex-1 + min-h-screen：保证任意视口下 maxScrollY ≥ 317px > header 偏移 181px，sticky 筛选栏恒钉顶） */}
      <main
        className={`mx-auto min-h-screen w-full max-w-[1400px] flex-1 px-4 pt-8 sm:px-6 lg:px-8 ${
          compareItems.length > 0 ? 'pb-32' : 'pb-8'
        }`}
      >
        {visibleStyles.length === 0 ? (
          <div className="border border-dashed border-line py-24 text-center">
            <p className="text-[13px] text-ink-muted">{emptyMessageFor(activeFilter, favorites, recent)}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleStyles.map((item) => (
              <StyleCard
                key={item.id}
                item={item}
                /* 编号取自数据源位置而非列表位置，筛选/收藏排序后仍然稳定 */
                index={STYLES.indexOf(item) + 1}
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

      {/* 页脚：承接从页头移出的产品说明，行宽限制在 64ch 以内 */}
      <footer className="border-t border-line">
        <div className="mx-auto max-w-[1400px] px-4 py-7 sm:px-6 lg:px-8">
          <p className="max-w-[64ch] text-[13px] leading-[1.75] text-ink-faint">
            每张卡片的封面由该风格自身的规则实时渲染，纯 CSS 画成，不含截图与位图；
            点击封面进入该风格的详情页，页内是同一套规则渲染的整页样张与完整提示词。
            提示词正文可直接粘贴至 Claude / Cursor / v0 / bolt 等工具；字体来自 Google Fonts。
          </p>
          <p className="mt-2 max-w-[64ch] text-[13px] leading-[1.75] text-ink-faint">
            支持深链分享、Markdown 与 DESIGN.md 导出、三档参数定制、多风格对比。链接参数
            <code className="mx-1 font-mono text-ink-muted">?cat=modern &amp; style=bauhaus</code>
            可直接分享（分类使用英文 slug）。
          </p>
        </div>
      </footer>

      {/* 详情页 / 定制抽屉 / 对比条 / 对比视图 / 轻提示：两种视图共用的附加层 */}
      {overlays}
    </div>
  );
}
