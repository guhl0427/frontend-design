/**
 * 增量校验：新增风格数据完整性 + 可访问性对比度 + 字体引用真实性
 * 运行：node scripts/verify-styles.mjs
 */
import { build } from 'esbuild';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const tmp = path.join(root, '.tmp-styles.mjs');

await build({
  entryPoints: [path.join(root, 'src/data/styles.ts')],
  bundle: true,
  format: 'esm',
  outfile: tmp,
  logLevel: 'silent',
});

const { STYLES, CATEGORIES } = await import(pathToFileURL(tmp).href);

const errors = [];
const warns = [];
const PALETTE_KEYS = [
  'bg', 'surface', 'text', 'textMuted', 'accent', 'accentText', 'border', 'shadowColor',
];
const PREVIEW_KEYS = [
  'palette', 'headingFont', 'bodyFont', 'radius', 'borderWidth', 'shadow',
  'titleWeight', 'titleLetterSpacing', 'uppercaseTitle', 'buttonVariant', 'cardVariant',
];
const BUTTON_VARIANTS = ['solid', 'outline', 'hard', 'glass', 'gradient', 'terminal', 'pixel'];
const CARD_VARIANTS = ['flat', 'hard', 'glass', 'inset', 'outline', 'pixel', 'sketch', 'acrylic'];
const SECTIONS = ['# 角色定位', '## 设计理念', '## 字体方案', '## HSL 色板', '## 间距与圆角', '## 组件规则', '## 反模式禁令'];

// ---------- 1. 数据完整性 ----------
const ids = new Set();
for (const s of STYLES) {
  const tag = `${s.id || '?'}`;
  if (!s.id) errors.push(`${tag}: 缺 id`);
  if (ids.has(s.id)) errors.push(`${tag}: id 重复`);
  ids.add(s.id);
  for (const key of ['nameZh', 'nameEn', 'category', 'summary', 'prompt']) {
    if (!s[key] || String(s[key]).trim() === '') errors.push(`${tag}: ${key} 为空`);
  }
  if (!CATEGORIES.includes(s.category)) errors.push(`${tag}: category「${s.category}」不在 CATEGORIES 中`);
  if (!Array.isArray(s.tags) || s.tags.length === 0) errors.push(`${tag}: tags 为空`);
  for (const key of PREVIEW_KEYS) {
    if (s.preview[key] === undefined || s.preview[key] === '') errors.push(`${tag}: preview.${key} 缺失`);
  }
  for (const key of PALETTE_KEYS) {
    if (!s.preview.palette[key]) errors.push(`${tag}: palette.${key} 缺失`);
  }
  if (!BUTTON_VARIANTS.includes(s.preview.buttonVariant)) errors.push(`${tag}: 未知 buttonVariant ${s.preview.buttonVariant}`);
  if (!CARD_VARIANTS.includes(s.preview.cardVariant)) errors.push(`${tag}: 未知 cardVariant ${s.preview.cardVariant}`);
  // 提示词结构与体量
  for (const sec of SECTIONS) {
    if (!s.prompt.includes(sec)) errors.push(`${tag}: 提示词缺章节「${sec}」`);
  }
  const len = s.prompt.replace(/\s/g, '').length;
  if (len < 300) warns.push(`${tag}: 提示词偏短（${len} 字符）`);
  if (len > 900) warns.push(`${tag}: 提示词偏长（${len} 字符）`);
  if (/TODO|占位|待补充/.test(s.prompt)) errors.push(`${tag}: 提示词含占位符`);
}

// ---------- 2. 字体真实性（必须出现在 index.html 的 Google Fonts 链接中）----------
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const fontFamilies = html
  .match(/family=[^&"]+/g)
  ?.map((f) => decodeURIComponent(f.replace('family=', '').split(':')[0]).replace(/\+/g, ' ')) ?? [];
const referenced = new Set();
for (const s of STYLES) {
  for (const f of [s.preview.headingFont, s.preview.bodyFont]) {
    for (const part of f.split(',')) {
      const name = part.trim().replace(/^["']|["']$/g, '');
      if (name === 'sans-serif' || name === 'serif' || name === 'monospace' || name === 'cursive') continue;
      referenced.add(name);
    }
  }
}
for (const name of referenced) {
  const ok = fontFamilies.some((f) => f.toLowerCase() === name.toLowerCase());
  if (!ok) errors.push(`字体「${name}」未在 index.html 的 Google Fonts 中引入`);
}

// ---------- 3. 可访问性对比度（text / textMuted 对 bg 与 surface）----------
function parseColor(c) {
  let m = c.match(/^hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)$/);
  if (m) return { h: +m[1], s: +m[2] / 100, l: +m[3] / 100, a: 1 };
  m = c.match(/^hsla\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\/\s*([\d.]+)\s*\)$/);
  if (m) return { h: +m[1], s: +m[2] / 100, l: +m[3] / 100, a: +m[4] };
  m = c.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)$/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4], direct: true };
  return null;
}
function hslToRgb({ h, s, l }) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const t = hp < 1 ? [c, x, 0] : hp < 2 ? [x, c, 0] : hp < 3 ? [0, c, x]
    : hp < 4 ? [0, x, c] : hp < 5 ? [x, 0, c] : [c, 0, x];
  const m = l - c / 2;
  return t.map((v) => Math.round((v + m) * 255));
}
function toRgb(c) {
  const p = parseColor(c);
  if (!p) return null;
  if (p.direct) return [p.r, p.g, p.b];
  return hslToRgb(p);
}
/** 前景（可能半透明）叠加在背景上的实际颜色 */
function composite(fg, bg, alpha) {
  if (alpha >= 1) return fg;
  return fg.map((v, i) => Math.round(v * alpha + bg[i] * (1 - alpha)));
}
function alphaOf(c) {
  const p = parseColor(c);
  return p ? p.a : 1;
}
function luminance([r, g, b]) {
  const f = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(fgRgb, bgRgb) {
  const l1 = luminance(fgRgb);
  const l2 = luminance(bgRgb);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

const contrastRows = [];
for (const s of STYLES) {
  const p = s.preview.palette;
  const bgRgb = toRgb(p.bg);
  const surfaceRgb = toRgb(p.surface) ? composite(toRgb(p.surface), bgRgb, alphaOf(p.surface)) : bgRgb;
  for (const [label, color] of [['text', p.text], ['textMuted', p.textMuted]]) {
    const base = toRgb(color);
    if (!base) { warns.push(`${s.id}: ${label} 颜色无法解析（${color}）`); continue; }
    const eff = composite(base, surfaceRgb, alphaOf(color));
    const c1 = contrast(eff, surfaceRgb);
    const c2 = contrast(eff, bgRgb);
    const worst = Math.min(c1, c2);
    contrastRows.push({ id: s.id, label, onSurface: +c1.toFixed(2), onBg: +c2.toFixed(2) });
    if (worst < 4.5) {
      warns.push(`${s.id}: ${label} 最低对比度 ${worst.toFixed(2)}:1 < 4.5:1（onSurface ${c1.toFixed(2)} / onBg ${c2.toFixed(2)}）`);
    }
  }
}

// ---------- 4. 分类分布 ----------
const dist = {};
for (const s of STYLES) dist[s.category] = (dist[s.category] || 0) + 1;

fs.rmSync(tmp, { force: true });

console.log('=== 校验结果 ===');
console.log(`风格总数: ${STYLES.length}`);
console.log(`分类: ${CATEGORIES.join(' / ')}`);
console.log('分类分布:', JSON.stringify(dist, null, 0));
console.log(`引用字体族: ${[...referenced].length} 个，全部已在 index.html 引入: ${!errors.some((e) => e.includes('未在 index.html'))}`);
console.log('\n--- 对比度明细（onSurface / onBg）---');
for (const r of contrastRows) {
  const flag = Math.min(r.onSurface, r.onBg) >= 4.5 ? 'OK  ' : 'WARN';
  console.log(`${flag} ${r.id.padEnd(20)} ${r.label.padEnd(10)} ${String(r.onSurface).padStart(6)} / ${String(r.onBg).padStart(6)}`);
}
console.log('\n--- 错误 ---');
console.log(errors.length === 0 ? '无' : errors.join('\n'));
console.log('\n--- 警告 ---');
console.log(warns.length === 0 ? '无' : warns.join('\n'));

process.exit(errors.length > 0 ? 1 : 0);
