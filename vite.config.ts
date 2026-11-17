import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Tailwind v4 走 Vite 插件（内建 Lightning CSS 前缀处理），不再需要 PostCSS 与 autoprefixer
  plugins: [react(), tailwindcss()],
  base: './',
  resolve: {
    // 与 tsconfig.app.json 的 paths 一一对应，改一处必须同步另一处
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
