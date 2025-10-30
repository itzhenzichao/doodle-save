import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; // 新增这行
// 定义状态类型
interface CanvasState {
  value: number;
}

// 初始状态
const initialState: CanvasState = { value: 0 };

// 创建 slice（自动生成 action 和 reducer）
const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1; // RTK 内部使用 Immer，支持"直接修改"状态
    },
    addAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// 导出 action（自动推断类型）
export const { increment, addAmount } = canvasSlice.actions;

// 导出 reducer
export default canvasSlice.reducer;
