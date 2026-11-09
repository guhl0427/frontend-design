/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      /*
        校样台令牌：底色刻意去蓝（饱和压到 4%），让深色台面像石墨而不是发蓝的屏幕灰；
        文字色略偏暖（40°）。强调色换成琥珀，全站面积预算 < 2%，只出现在
        当前分类下划线、卡片编号与复制成功三处；其余状态用白/灰层级表达。
      */
      colors: {
        surface: {
          DEFAULT: 'hsl(240 4% 5% / <alpha-value>)',
          raised: 'hsl(240 4% 8% / <alpha-value>)',
          hover: 'hsl(240 4% 12% / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'hsl(40 12% 94% / <alpha-value>)',
          muted: 'hsl(40 6% 68% / <alpha-value>)',
          /* 52% 是这套底色下 4.5:1 的下限；再暗一级的编号/分类文字会读不清 */
          faint: 'hsl(40 5% 52% / <alpha-value>)',
        },
        brand: {
          DEFAULT: 'hsl(38 76% 62% / <alpha-value>)',
          soft: 'hsl(38 60% 62% / 0.13)',
        },
        line: {
          DEFAULT: 'hsl(40 6% 18% / <alpha-value>)',
          strong: 'hsl(40 7% 30% / <alpha-value>)',
        },
      },
      /*
        IBM Plex 家族让外壳统一在工程规格书的体质上。
        Inter Tight 仍保留在 Google Fonts 清单里——数据中有风格条目用它作预览字体，
        Preview 内部渲染不受本次改动影响。
      */
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      /* 直角语法：全站一个 2px，rounded-full 仍留给圆形符号 */
      borderRadius: {
        sm: '2px',
        DEFAULT: '2px',
        md: '2px',
        lg: '2px',
        xl: '3px',
        '2xl': '3px',
        '3xl': '4px',
      },
    },
  },
  plugins: [],
};
