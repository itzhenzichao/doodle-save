import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'; // 导入 Provider
import { store } from './store'; // 导入创建的 store
import { BrowserRouter as Router } from 'react-router-dom';
import Msg from './utils/message';

// 挂载到 window 上（全局可用）
declare global {
  interface Window {
    msg: typeof Msg;
  }
}
window.msg = Msg;
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> {/* 关键：注入 store */}
      <Router>
        <App />
      </Router>
    </Provider>
  </StrictMode>
)
