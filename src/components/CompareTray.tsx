import type { JSX } from 'react';
import type { StyleItem } from '../types';

interface CompareTrayProps {
  /** 已加入对比集的风格（按加入顺序） */
  items: StyleItem[];
  /** 从对比集移除某款风格 */
  onRemove: (id: string) => void;
  /** 清空对比集 */
  onClear: () => void;
  /** 打开对比视图 */
  onStart: () => void;
}

/** 底部悬浮对比条：展示已选风格 chip，提供开始对比 / 清空 / 单项移除 */
export default function CompareTray({ items, onRemove, onClear, onStart }: CompareTrayProps): JSX.Element {
  // 对比集为空时整条不渲染（返回空片段，DOM 中不产生任何节点）
  if (items.length === 0) return <></>;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line-strong bg-surface-raised/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <span className="font-mono text-[10.5px] tracking-[0.16em] text-ink-faint">对比集</span>

        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item.id}
              className="flex items-center gap-1.5 border border-line bg-white/[0.03] py-1 pr-1.5 pl-2.5 text-[12.5px] text-ink"
            >
              {item.nameZh}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={`从对比集移除「${item.nameZh}」`}
                className="cursor-pointer px-1 leading-none text-ink-faint transition-colors hover:text-ink"
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onStart}
          className="cursor-pointer bg-ink px-4 py-1.5 text-[13px] font-medium text-surface transition-colors hover:bg-brand"
        >
          开始对比（{items.length}）
        </button>
        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer px-2 py-1.5 text-[13px] text-ink-faint transition-colors hover:text-ink"
        >
          清空
        </button>
      </div>
    </div>
  );
}
