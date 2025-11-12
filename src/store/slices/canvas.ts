import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; // 新增这行
import * as fabric from 'fabric';

// 定义状态类型
interface CanvasState {
  instance: fabric.Canvas | null;
}

// 初始状态
const initialState: CanvasState = { instance: null };

// 创建 slice（自动生成 action 和 reducer）
const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    init: (state, action: PayloadAction<fabric.Canvas | null>) => {
      console.log('init', action.payload);
      state.instance = action.payload as any;
    },
  },
});

// 导出 action（自动推断类型）
export const { init } = canvasSlice.actions;

// 导出 reducer
export default canvasSlice.reducer;
