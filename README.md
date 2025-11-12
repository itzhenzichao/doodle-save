
# Doodle Save 涂鸦

一个基于 React 和 Fabric.js 的交互式绘画应用，结合 Redux Toolkit 实现状态管理，使用 Vite 构建以获得快速开发体验。


## 📋 项目介绍

本项目是一个轻量级在线绘画工具，支持基础图形绘制（线条、矩形、圆形等）、颜色调整、画布操作等功能。通过 React 组件化开发和 Redux 状态管理，确保绘图状态的一致性和可维护性，Vite 则提供了极速的热更新和构建性能。


## ✨ 核心功能

- 支持多种绘图工具：铅笔、直线、矩形、圆形、文本等
- 自定义画笔颜色、线条粗细、填充色
- 画布缩放、平移、清空操作
- 绘图历史记录（撤销/重做）
- 响应式设计，适配不同设备尺寸


## 🛠️ 技术栈

- **前端框架**：React 19
- **状态管理**：@reduxjs/toolkit + react-redux
- **绘图核心**：fabric.js（Canvas 绘图库）
- **构建工具**：Vite（快速开发与打包）
- **包管理**：Yarn
- **语言**：JavaScript（可扩展为 TypeScript）


## 🚀 快速开始

### 前提条件

- 安装 Node.js（v22.21.0+ 推荐）
- 安装 Yarn：`npm install -g yarn`


### 本地开发

1. 克隆仓库到本地
   ```bash
   git clone https://github.com/itzhenzichao/doodle-save.git
   cd doodle-save
   ```

2. 安装依赖
   ```bash
   yarn install
   ```

3. 启动开发服务器（默认端口：5173，支持热更新）
   ```bash
   yarn run dev
   ```

4. 打开浏览器访问 `http://localhost:5173` 即可看到应用


### 构建生产版本

```bash
# 打包项目（输出到 dist 目录）
yarn run build

# 预览生产版本
yarn run preview
```


## 📁 项目结构

```
src/
├── assets/           # 静态资源（图片、样式等）
├── components/       # React 组件
│   ├── Canvas/       # 画布核心组件（集成 fabric.js）
│   ├── Toolbar/      # 工具栏组件（选择工具、调整属性）
│   └── ...
├── store/            # Redux 状态管理
│   ├── slices/       # Redux Toolkit 切片（如 canvasSlice.js）
│   └── index.js      # 配置 store
├── utils/            # 工具函数（如绘图辅助管理）
├── App.jsx           # 根组件
└── main.jsx          # 入口文件
```


<!-- ## 📝 使用说明

1. **工具栏操作**：
   - 选择左侧工具按钮切换绘图工具（铅笔/矩形/圆形等）
   - 右侧面板调整颜色、线条粗细等属性

2. **画布操作**：
   - 鼠标拖动：移动画布
   - 滚轮缩放：放大/缩小画布
   - 点击「清空」按钮重置画布
   - 使用「撤销」「重做」按钮管理绘图历史
 -->

<!-- ## 🔧 常见问题

1. **依赖安装失败**：
   - 检查 Node.js 和 Yarn 版本是否符合要求
   - 尝试删除 `node_modules` 和 `yarn.lock` 后重新安装：
     ```bash
     rm -rf node_modules yarn.lock
     yarn install
     ```

2. **热更新后画布状态丢失**：
   - 这是 Vite 热更新的正常现象，可通过 `useEffect` 监听组件更新事件，手动恢复画布状态

3. **fabric.js 相关报错**：
   - 确保已正确安装 fabric：`yarn add fabric`
   - 若打包后报错，可在 `vite.config.js` 中添加优化配置：
     ```javascript
     // vite.config.js
     export default defineConfig({
       optimizeDeps: {
         include: ['fabric']
       }
     })
     ``` -->
<!-- import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { init } from '@/store/slices/canvas';
    const dispatch = useDispatch<AppDispatch>();
    dispatch(init(null)); -->
<!-- 
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';




