import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'; // 导入 Provider
import { store } from './store'; // 导入创建的 store

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> {/* 关键：注入 store */}
    <App />
    </Provider>
  </StrictMode>,
)
