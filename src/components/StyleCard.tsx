import type { JSX } from 'react';
import type { StyleItem } from '@/types';
import { useCopy } from '@/hooks/useCopy';
import Preview from './Preview';

interface StyleCardProps {
  item: StyleItem;
  /** 数据源中的稳定序号（1 起），渲染为卡片上的等宽编号 */
  index: number;
  /** 进入该风格的详情页 */
  onOpen: (item: StyleItem) => void;
  /** 打开定制抽屉 */
  onCustomize: (item: StyleItem) => void;
  /** 是否已收藏 */
  isFavorite: boolean;
  /** 切换收藏态 */
  onToggleFavorite: (id: string) => void;
  /** 是否已在对比集 */
  inCompare: boolean;
  /** 加入 / 移出对比集 */
  onToggleCompare: (item: StyleItem) => void;
}

/**
 * 单张风格卡片。
 *
 * 结构上仍是「预览样张 + 元信息 + 操作行」，但外壳不再抢作品的戏：
 * 预览嵌在深色卡纸里留一圈边距，卡片本身只用 1px 细线勾边、直角、没有阴影；
 * 彩色只由预览自己贡献，卡片下半部只有石墨文字和一条实心复制按钮。
 */
export default function StyleCard({
  item,
  index,
  onOpen,
  onCustomize,
  isFavorite,
  onToggleFavorite,
  inCompare,
  onToggleCompare,
}: StyleCardProps): JSX.Element {
  const { copied, copy } = useCopy();

  return (
    <article className="group relative flex flex-col border border-line bg-surface-raised transition-colors duration-200 hover:border-line-strong">
      {/*
        样张：预览是唯一主角，四周留一圈卡纸边距把它托起来。
        外壳的标记（星标、编号）一律不叠在样张上——叠上去就变成贴纸，
        而且几十种样张底色下没有任何一种叠色能同时成立。
      */}
      <div className="p-2.5">
        {/*
          封面即入口：点击样张进入该风格的详情页。
          卡片上没有「查看详情」按钮，可发现性由 hover 兜住——样张外框转琥珀、编号转琥珀，
          琥珀是全站唯一的「被指向」信号。环在样张之外，不压在样张上看不清。
          data-cover-id 让详情页返回时能精确把焦点交还给这张卡片的封面。
        */}
        <button
          type="button"
          data-cover-id={item.id}
          onClick={() => onOpen(item)}
          className="block w-full cursor-pointer border border-line/70 text-left transition-colors hover:border-brand"
          aria-label={`查看「${item.nameZh}」详情页`}
        >
          <Preview item={item} />
        </button>
      </div>

      {/* 元信息：编号用等宽数字打头，为卡片建立可检索的刻度 */}
      <div className="flex flex-1 flex-col px-3.5 pt-1 pb-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex min-w-0 items-baseline gap-2">
            {/* 编号在 hover 时转为琥珀：全站少数的「点色」，也是卡片被指向的信号 */}
            <span className="shrink-0 font-mono text-[10.5px] tracking-[0.06em] text-ink-faint tabular-nums transition-colors group-hover:text-brand">
              {String(index).padStart(2, '0')}
            </span>
            <h3 className="truncate text-[15px] font-semibold tracking-[-0.005em] text-ink">
              {/*
                标题也是入口：卡片上没有「查看详情」按钮之后，需要一个不靠解释文字的「可点」信号。
                hover 出琥珀下划线是链接的通用语言，比在样张上叠角标干净，也不破坏文字选择。
              */}
              <button
                type="button"
                onClick={() => onOpen(item)}
                className="cursor-pointer text-left underline-offset-4 hover:underline hover:decoration-brand/70"
              >
                {item.nameZh}
              </button>
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onToggleFavorite(item.id)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `取消收藏「${item.nameZh}」` : `收藏「${item.nameZh}」`}
            title={isFavorite ? '取消收藏' : '收藏'}
            className={`shrink-0 cursor-pointer px-0.5 text-[15px] leading-none transition-colors ${
              isFavorite ? 'text-brand' : 'text-ink-faint hover:text-ink'
            }`}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
        <div className="mt-0.5 flex items-baseline justify-between gap-2 pl-[21px]">
          <p className="truncate font-mono text-[11px] text-ink-faint">{item.nameEn}</p>
          <span className="shrink-0 font-mono text-[10.5px] tracking-[0.12em] text-ink-faint">{item.category}</span>
        </div>

        <p className="mt-2.5 line-clamp-2 text-[12.5px] leading-[1.7] text-ink-muted">{item.summary}</p>

        {/*
          操作行：不再放「查看详情」——封面本身就是入口，重复一个占半行宽度的按钮只是噪声。
          「复制提示词」是全页唯一的实心块，定制与对比降为纯文字按钮，靠明度分主次。
          文字按钮仍保留 34px 高的点击区，否则手机上只有字形本身可点。
        */}
        <div className="mt-auto flex items-stretch gap-1.5 pt-4">
          <button
            type="button"
            onClick={() => void copy(item.prompt)}
            className={`flex-1 cursor-pointer px-2 py-2 text-[12.5px] font-medium whitespace-nowrap transition-colors ${
              copied ? 'bg-brand text-surface' : 'bg-ink text-surface hover:bg-brand'
            }`}
          >
            {copied ? '已复制 ✓' : '复制提示词'}
          </button>
          <button
            type="button"
            onClick={() => onCustomize(item)}
            className="min-h-[34px] shrink-0 cursor-pointer px-2.5 py-2 text-[12.5px] whitespace-nowrap text-ink-faint transition-colors hover:bg-surface-hover hover:text-ink"
          >
            定制
          </button>
          <button
            type="button"
            onClick={() => onToggleCompare(item)}
            aria-pressed={inCompare}
            aria-label={inCompare ? `将「${item.nameZh}」移出对比集` : `将「${item.nameZh}」加入对比集`}
            className={`min-h-[34px] shrink-0 cursor-pointer px-2.5 py-2 text-[12.5px] whitespace-nowrap transition-colors hover:bg-surface-hover ${
              inCompare ? 'text-brand' : 'text-ink-faint hover:text-ink'
            }`}
          >
            {inCompare ? '已加入' : '对比'}
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
