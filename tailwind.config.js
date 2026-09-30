/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'hsl(240 10% 5% / <alpha-value>)',
          raised: 'hsl(240 8% 8% / <alpha-value>)',
          hover: 'hsl(240 8% 12% / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'hsl(0 0% 93% / <alpha-value>)',
          muted: 'hsl(240 5% 65% / <alpha-value>)',
          faint: 'hsl(240 5% 55% / <alpha-value>)',
        },
        brand: {
          DEFAULT: 'hsl(160 84% 45% / <alpha-value>)',
          soft: 'hsl(160 60% 45% / 0.15)',
        },
      },
      fontFamily: {
        sans: ['"Inter Tight"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
