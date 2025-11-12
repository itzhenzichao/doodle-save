import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, 'src') // @ 指向 src 目录
    }
  }
})
