import type { StyleItem } from '../types';
import { useCopy } from '../hooks/useCopy';
import Preview from './Preview';

interface StyleCardProps {
  item: StyleItem;
  /** 打开详情弹窗 */
  onOpen: (item: StyleItem) => void;
  /** 打开定制抽屉 */
  onCustomize: (item: StyleItem) => void;
}

/** 单张风格卡片：预览区 + 元信息 + 操作按钮 */
export default function StyleCard({ item, onOpen, onCustomize }: StyleCardProps): JSX.Element {
  const { copied, copy } = useCopy();

  return (
    <article className="group overflow-hidden rounded-xl border border-white/5 bg-surface-raised transition-colors duration-200 hover:border-brand/40">
      {/* 实时预览区（点击打开详情） */}
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="block w-full cursor-pointer text-left"
        aria-label={`查看「${item.nameZh}」提示词详情`}
        title="点击查看完整提示词"
      >
        <Preview item={item} />
      </button>

      {/* 元信息 */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-ink">{item.nameZh}</h3>
            <p className="mt-0.5 font-mono text-xs text-ink-faint">{item.nameEn}</p>
          </div>
          <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-xs text-brand">{item.category}</span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink-muted">{item.summary}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded bg-white/5 px-2 py-0.5 text-xs text-ink-faint">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onOpen(item)}
            className="cursor-pointer rounded-lg border border-white/10 px-2 py-2 text-[13px] whitespace-nowrap text-ink transition-colors hover:border-brand/50 hover:text-brand"
          >
            查看提示词
          </button>
          <button
            type="button"
            onClick={() => onCustomize(item)}
            className="cursor-pointer rounded-lg border border-brand/40 px-2 py-2 text-[13px] whitespace-nowrap text-brand transition-colors hover:bg-brand-soft"
          >
            定制
          </button>
          <button
            type="button"
            onClick={() => void copy(item.prompt)}
            className={`cursor-pointer rounded-lg px-2 py-2 text-[13px] font-medium whitespace-nowrap transition-colors ${
              copied ? 'bg-brand text-surface' : 'bg-brand/90 text-surface hover:bg-brand'
            }`}
          >
            {copied ? '已复制 ✓' : '复制提示词'}
          </button>
        </div>

        {/* 读屏反馈：按钮文字变化对读屏不友好，另用 aria-live 区域播报 */}
        <span className="sr-only" role="status" aria-live="polite">
          {copied ? `「${item.nameZh}」提示词已复制到剪贴板` : ''}
        </span>
      </div>
    </article>
  );
}
