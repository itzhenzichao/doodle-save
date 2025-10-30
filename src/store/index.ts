// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import canvasReducer from './canvas';

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
  },
});

// 导出类型（供组件使用）
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;