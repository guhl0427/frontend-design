import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Tailwind v4 走 Vite 插件（内建 Lightning CSS 前缀处理），不再需要 PostCSS 与 autoprefixer
  plugins: [react(), tailwindcss()],
  base: './',
});
