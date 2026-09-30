import { useEffect, useMemo, useState } from 'react';
import type { StyleItem } from './types';
import { CATEGORIES, STYLES } from './data/styles';
import StyleCard from './components/StyleCard';
import PromptDetail from './components/PromptDetail';
import Customizer from './components/Customizer';
import { useCopy } from './hooks/useCopy';
import { bundleFilename, buildBundleMarkdown, downloadText } from './utils/export';
import { DEFAULT_VIEW, readViewState, writeViewState } from './utils/viewState';

/** 全部分类（含「全部」） */
const CATEGORY_FILTERS: string[] = ['全部', ...CATEGORIES];

/** 按分类 + 关键词过滤风格列表 */
function filterStyles(styles: StyleItem[], category: string, keyword: string): StyleItem[] {
  const kw = keyword.trim().toLowerCase();
  return styles.filter((item) => {
    const matchCategory = category === '全部' || item.category === category;
    if (!matchCategory) return false;
    if (kw === '') return true;
    const haystack = [item.nameZh, item.nameEn, item.category, item.summary, ...item.tags]
      .join(' ')
      .toLowerCase();
    return haystack.includes(kw);
  });
}

export default function App(): JSX.Element {
  // 首屏从 URL 恢复视图（F1 深链分享）：?cat=<分类>&q=<关键词>&style=<风格id>
  const initial = useMemo(() => readViewState(), []);
  const [activeCategory, setActiveCategory] = useState<string>(() =>
    CATEGORY_FILTERS.includes(initial.category) ? initial.category : DEFAULT_VIEW.category,
  );
  const [keyword, setKeyword] = useState<string>(initial.keyword);
  const [selected, setSelected] = useState<StyleItem | null>(
    () => STYLES.find((item) => item.id === initial.styleId) ?? null,
  );
  const [customizing, setCustomizing] = useState<StyleItem | null>(null);
  const { copied: linkCopied, copy: copyLink } = useCopy();

  const visibleStyles = useMemo(
    () => filterStyles(STYLES, activeCategory, keyword),
    [activeCategory, keyword],
  );

  // 视图状态回写 URL（replaceState，避免污染后退栈）
  useEffect(() => {
    writeViewState({ category: activeCategory, keyword, styleId: selected?.id ?? null });
  }, [activeCategory, keyword, selected]);

  const handleExportBundle = (): void => {
    if (visibleStyles.length === 0) return;
    downloadText(bundleFilename(), buildBundleMarkdown(visibleStyles));
  };

  /** 打开定制抽屉：关闭详情弹窗，避免两层模态叠加 */
  const handleCustomize = (item: StyleItem): void => {
    setSelected(null);
    setCustomizing(item);
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
                支持深链分享、Markdown 导出与三档参数定制。
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
            {CATEGORY_FILTERS.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
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
          </div>
        </div>
      </div>

      {/* 卡片网格（flex-1 + min-h-screen：保证任意视口下 maxScrollY ≥ 317px > header 偏移 181px，sticky 筛选栏恒钉顶） */}
      <main className="mx-auto min-h-screen w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {visibleStyles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 py-24 text-center">
            <p className="text-ink-muted">没有匹配的风格，试试其他关键词或切换分类。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleStyles.map((item) => (
              <StyleCard key={item.id} item={item} onOpen={setSelected} onCustomize={handleCustomize} />
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
        />
      )}

      {/* 定制抽屉 */}
      {customizing !== null && (
        <Customizer item={customizing} onClose={() => setCustomizing(null)} />
      )}
    </div>
  );
}
