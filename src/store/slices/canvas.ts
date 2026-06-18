import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; // 新增这行
import * as fabric from 'fabric';

// 定义状态类型
interface CanvasState {
  instance: fabric.Canvas | null;
  color: string;
}

// 初始状态
const initialState: CanvasState = { instance: null, color: '' };

// 创建 slice（自动生成 action 和 reducer）
const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    init: (state, action: PayloadAction<fabric.Canvas | null>) => {
      console.log('init', action.payload);
      state.instance = action.payload as any;
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    }
  },
});

// 导出 action（自动推断类型）
export const { init, setColor } = canvasSlice.actions;

// 导出 reducer
export default canvasSlice.reducer;
