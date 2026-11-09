import { useEffect, useMemo, useState } from 'react';
import type { CustomizeOptions, StyleItem } from '../types';
import { FONT_OPTIONS } from '../data/fonts';
import { useCopy } from '../hooks/useCopy';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { DEFAULT_CUSTOMIZE, composePrompt, derivePreview } from '../utils/promptComposer';
import { downloadText, singleFilename } from '../utils/export';
import Preview from './Preview';

interface CustomizerProps {
  item: StyleItem;
  onClose: () => void;
}

/** 三档参数的展示元信息 */
const TUNING_META = [
  {
    key: 'variance' as const,
    label: '布局实验度',
    low: '对称保守',
    high: '艺术不对称',
  },
  {
    key: 'motion' as const,
    label: '动效强度',
    low: '静态',
    high: '电影级',
  },
  {
    key: 'density' as const,
    label: '信息密度',
    low: '画廊留白',
    high: '仪表盘',
  },
];

/** 段落开关的展示元信息 */
const SECTION_META = [
  { key: 'palette' as const, label: 'HSL 色板', hint: '关闭后不输出具体色值' },
  { key: 'components' as const, label: '组件规则', hint: '按钮 / 卡片 / 徽章样式' },
  { key: 'bans' as const, label: '反模式禁令', hint: 'AI 最容易犯错的负面清单' },
];

/** 抽屉参数面板：调三档参数 + 填品牌占位符，实时预览并生成定制提示词 */
export default function Customizer({ item, onClose }: CustomizerProps): JSX.Element {
  const [options, setOptions] = useState<CustomizeOptions>(DEFAULT_CUSTOMIZE);
  const [entered, setEntered] = useState(false);
  const panelRef = useFocusTrap<HTMLDivElement>();
  const { copied, copy } = useCopy();

  // 入场动画（避免首帧就带着终态渲染）
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Esc 关闭 + 锁定背景滚动
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

  const derived = useMemo(() => derivePreview(item, options), [item, options]);
  const prompt = useMemo(() => composePrompt(item, options), [item, options]);
  const isDefault = useMemo(
    () => JSON.stringify(options) === JSON.stringify(DEFAULT_CUSTOMIZE),
    [options],
  );

  const setTuning = (key: 'variance' | 'motion' | 'density', value: number): void => {
    setOptions((prev) => ({ ...prev, tuning: { ...prev.tuning, [key]: value } }));
  };
  const setBrand = (key: keyof CustomizeOptions['brand'], value: string): void => {
    setOptions((prev) => ({ ...prev, brand: { ...prev.brand, [key]: value } }));
  };
  const toggleSection = (key: keyof CustomizeOptions['sections']): void => {
    setOptions((prev) => ({ ...prev, sections: { ...prev.sections, [key]: !prev.sections[key] } }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`定制「${item.nameZh}」提示词`}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="flex h-full w-full max-w-[460px] flex-col border-l border-line-strong bg-surface-raised outline-none"
        style={{
          transform: entered ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 280ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* 头部 */}
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">定制提示词</h2>
            <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
              {item.nameZh} · {item.nameEn}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭定制面板"
            className="shrink-0 cursor-pointer px-1.5 py-1 text-[13px] leading-none text-ink-faint transition-colors hover:text-ink"
          >
            ✕
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* 实时预览 */}
          <section className="mb-6">
            <h3 className="mb-3 font-mono text-[10.5px] tracking-[0.16em] text-ink-faint">
              实时预览
            </h3>
            <div className="overflow-hidden border border-line">
              <Preview
                item={item}
                preview={derived.config}
                padding={derived.padding}
                asymmetric={derived.asymmetric}
              />
            </div>
            <p className="mt-2 text-[13px] leading-[1.7] text-ink-faint">
              预览真实反映强调色、圆角、密度与布局错位；动效强度只写入提示词文本（静态预览无法体现）。
            </p>
          </section>

          {/* 三档参数 */}
          <section className="mb-6">
            <h3 className="mb-3 font-mono text-[10.5px] tracking-[0.16em] text-ink-faint">
              三档参数
            </h3>
            <div className="space-y-4">
              {TUNING_META.map((meta) => (
                <div key={meta.key}>
                  <div className="flex items-center justify-between text-[13px]">
                    <label htmlFor={`tuning-${meta.key}`} className="text-ink">
                      {meta.label}
                    </label>
                    <span className="font-mono text-[11px] text-brand tabular-nums">{options.tuning[meta.key]}/10</span>
                  </div>
                  <input
                    id={`tuning-${meta.key}`}
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={options.tuning[meta.key]}
                    onChange={(event) => setTuning(meta.key, Number(event.target.value))}
                    className="mt-2 w-full cursor-pointer"
                    style={{ accentColor: 'hsl(38 76% 62%)' }}
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-ink-faint">
                    <span>{meta.low}</span>
                    <span>{meta.high}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 品牌占位符 */}
          <section className="mb-6">
            <h3 className="mb-3 font-mono text-[10.5px] tracking-[0.16em] text-ink-faint">
              品牌占位符
            </h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="brand-name" className="text-[13px] text-ink">
                  产品 / 品牌名
                </label>
                <input
                  id="brand-name"
                  type="text"
                  value={options.brand.productName}
                  onChange={(event) => setBrand('productName', event.target.value)}
                  placeholder="留空则沿用风格示例文案"
                  className="mt-1.5 w-full border border-line bg-surface px-3 py-2 text-[13px] text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="brand-accent" className="text-[13px] text-ink">
                  品牌主色
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    id="brand-accent"
                    type="color"
                    value={/^#[0-9a-fA-F]{6}$/.test(options.brand.accentColor) ? options.brand.accentColor : '#22c55e'}
                    onChange={(event) => setBrand('accentColor', event.target.value)}
                    className="h-9 w-12 cursor-pointer border border-line bg-surface"
                    aria-label="选择品牌主色"
                  />
                  <input
                    type="text"
                    value={options.brand.accentColor}
                    onChange={(event) => setBrand('accentColor', event.target.value)}
                    placeholder="#22c55e（留空沿用风格色）"
                    className="w-full border border-line bg-surface px-3 py-2 font-mono text-[13px] text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="brand-heading-font" className="text-[13px] text-ink">
                    标题字体
                  </label>
                  <select
                    id="brand-heading-font"
                    value={options.brand.headingFont}
                    onChange={(event) => setBrand('headingFont', event.target.value)}
                    className="mt-1.5 w-full cursor-pointer border border-line bg-surface px-3 py-2 text-[13px] text-ink focus:border-brand focus:outline-none"
                  >
                    <option value="">沿用风格</option>
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="brand-body-font" className="text-[13px] text-ink">
                    正文字体
                  </label>
                  <select
                    id="brand-body-font"
                    value={options.brand.bodyFont}
                    onChange={(event) => setBrand('bodyFont', event.target.value)}
                    className="mt-1.5 w-full cursor-pointer border border-line bg-surface px-3 py-2 text-[13px] text-ink focus:border-brand focus:outline-none"
                  >
                    <option value="">沿用风格</option>
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* 段落开关 */}
          <section className="mb-6">
            <h3 className="mb-3 font-mono text-[10.5px] tracking-[0.16em] text-ink-faint">
              段落开关
            </h3>
            <div className="space-y-2">
              {SECTION_META.map((meta) => (
                <label
                  key={meta.key}
                  className="flex cursor-pointer items-center gap-3 border border-line bg-surface px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={options.sections[meta.key]}
                    onChange={() => toggleSection(meta.key)}
                    className="h-4 w-4 cursor-pointer"
                    style={{ accentColor: 'hsl(38 76% 62%)' }}
                  />
                  <span className="text-[13px] text-ink">{meta.label}</span>
                  <span className="ml-auto text-[11.5px] text-ink-faint">{meta.hint}</span>
                </label>
              ))}
            </div>
          </section>

          {/* 生成结果 */}
          <section>
            <h3 className="mb-3 flex items-center justify-between font-mono text-[10.5px] tracking-[0.16em] text-ink-faint">
              <span>生成的提示词</span>
              <span className="font-mono text-[10.5px] tracking-normal">{prompt.length} 字符</span>
            </h3>
            <pre className="max-h-72 overflow-auto border border-line bg-surface p-4 font-mono text-[11.5px] leading-[1.8] whitespace-pre-wrap text-ink-muted">
              {prompt}
            </pre>
          </section>
        </div>

        {/* 底部操作 */}
        <div className="flex gap-2 border-t border-line px-5 py-3.5">
          <button
            type="button"
            onClick={() => void copy(prompt)}
            className={`flex-1 cursor-pointer px-3 py-2 text-[13px] font-medium transition-colors ${
              copied ? 'bg-brand text-surface' : 'bg-ink text-surface hover:bg-brand'
            }`}
          >
            {copied ? '已复制 ✓' : '复制定制提示词'}
          </button>
          <button
            type="button"
            onClick={() => downloadText(singleFilename(item).replace('.md', '-custom.md'), prompt)}
            className="cursor-pointer border border-line px-3 py-2 text-[13px] text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            下载 .md
          </button>
          <button
            type="button"
            onClick={() => setOptions(DEFAULT_CUSTOMIZE)}
            disabled={isDefault}
            className="cursor-pointer px-2 py-2 text-[13px] text-ink-faint transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            重置
          </button>
        </div>
      </div>
    </div>
  );
}
