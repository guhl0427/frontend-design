import { useEffect, useMemo } from 'react';
import type { StyleItem } from '../types';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { splitPrompt } from '../utils/promptSections';
import Preview from './Preview';

interface CompareDialogProps {
  /** 参与对比的风格（按加入顺序，第一列为对其基准） */
  items: StyleItem[];
  onClose: () => void;
}

/** 对比视图列模板：首列为段落标题，其余每款风格一列 */
function gridTemplate(count: number): string {
  return `minmax(120px, 160px) repeat(${count}, minmax(0, 1fr))`;
}

/**
 * 全屏模态对比视图：顶部名称 + 中部并排实时预览 + 下部段落横向对照。
 * 段落顺序以第一款风格为准，某款缺少该段时该列显示「—」。
 */
export default function CompareDialog({ items, onClose }: CompareDialogProps): JSX.Element {
  const panelRef = useFocusTrap<HTMLDivElement>();

  // Esc 关闭 + 锁定背景滚动（与 PromptDetail 的模态实现保持一致）
  useEffect(() => {
    const onKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeydown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeydown);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  // 逐款风格的段落缓存，避免渲染时重复切分
  const sectionLists = useMemo(() => items.map((item) => splitPrompt(item.prompt)), [items]);
  const baseSections = sectionLists[0] ?? [];
  const columns = gridTemplate(items.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="风格对比"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-[1400px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-raised outline-none"
      >
        {/* 头部 */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 p-5">
          <div>
            <h2 className="text-xl font-bold text-ink">风格对比</h2>
            <p className="mt-1 text-sm text-ink-muted">
              共 {items.length} 款 · 段落按第一款风格的顺序对齐
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭对比视图"
            className="shrink-0 cursor-pointer rounded-lg border border-white/10 px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            ✕
          </button>
        </div>

        {/* 滚动内容 */}
        <div className="overflow-y-auto p-5">
          {/* 名称 + 分类 */}
          <div className="grid gap-4" style={{ gridTemplateColumns: columns }}>
            <div className="text-xs font-semibold tracking-[0.18em] text-ink-faint uppercase">风格</div>
            {items.map((item) => (
              <div key={item.id}>
                <h3 className="text-base font-semibold text-ink">{item.nameZh}</h3>
                <span className="mt-1 inline-block rounded-full bg-brand-soft px-2.5 py-1 text-xs text-brand">
                  {item.category}
                </span>
              </div>
            ))}
          </div>

          {/* 实时预览并排（复用既有 Preview 组件） */}
          <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: columns }}>
            <div className="text-xs font-semibold tracking-[0.18em] text-ink-faint uppercase">预览</div>
            {items.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg border border-white/10">
                <Preview item={item} />
              </div>
            ))}
          </div>

          {/* 段落横向对照 */}
          <div className="mt-6 overflow-hidden rounded-xl border border-white/5">
            {baseSections.map((section, rowIndex) => (
              <div
                key={section.title}
                className={`grid gap-4 p-4 ${rowIndex === 0 ? '' : 'border-t border-white/5'}`}
                style={{ gridTemplateColumns: columns }}
              >
                <div className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">{section.title}</div>
                {items.map((item, columnIndex) => {
                  const body =
                    sectionLists[columnIndex].find((entry) => entry.title === section.title)?.body ?? '';
                  return (
                    <div key={item.id} className="text-[13px] leading-6 whitespace-pre-wrap text-ink-muted">
                      {body === '' ? '—' : body}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
