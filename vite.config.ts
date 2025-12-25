import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import viteImagemin from 'vite-plugin-imagemin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      // JPEG 压缩配置
      mozjpeg: {
        quality: 80, // JPEG 质量 (0-100)
        progressive: true, // 渐进式 JPEG
      },
      // PNG 压缩配置
      pngquant: {
        quality: [0.65, 0.8], // PNG 质量范围
        speed: 4, // 压缩速度 (1-11)
      },
      // SVG 压缩配置
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      },
      // GIF 压缩配置
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      }
    })
  ],
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, 'src') // @ 指向 src 目录
    }
  },
  build: {
    // 生产环境构建配置
    minify: 'terser',
    terserOptions: {
      compress: {
        // 移除 console
        drop_console: true,
        // 移除 debugger
        drop_debugger: true,
        // 移除无用的代码
        pure_funcs: ['console.log', 'console.warn', 'console.error', 'console.info', 'console.debug']
      }
    } as any,
    // 资源内联阈值 (4KB)
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // 手动 chunk 分割策略
        manualChunks: {
          // 将 React 相关库打包到一个 chunk
          'react-vendor': ['react', 'react-dom'],
          // 将 Redux 相关库打包到一个 chunk
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          // 将 Antd 相关库打包到一个 chunk
          'antd-vendor': ['antd', '@ant-design/icons'],
          // 将 fabric 相关库打包到一个 chunk
          'fabric-vendor': ['fabric']
        }
      }
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 构建报告
    reportCompressedSize: true
  }
})
