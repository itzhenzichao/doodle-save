import {
  EditOutlined,
  HighlightOutlined,
  UndoOutlined,
  RedoOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import './index.scss'
// import { useSelector, useDispatch } from 'react-redux';
// import type { RootState, AppDispatch } from '@/store';
import { useContext, useEffect, useState } from 'react';
import { CanvasContext } from '@/utils/contexts';
import { configureBrush } from '@/utils/hooks/toolbar';
import * as fabric from 'fabric';
import { exportPNG, exportSVG } from '@/utils/services/export';

const Toolbar = () => {
  const toolbarItems = [
    { icon: HighlightOutlined, label: '画笔', action: 'brush' },
    { icon: EditOutlined, label: '添加文字', action: 'text' },
    { icon: UndoOutlined, label: '撤销', action: 'undo' },
    { icon: RedoOutlined, label: '重做', action: 'redo' },
    { icon: DeleteOutlined, label: '清除画布', action: 'clear' },
    { icon: DownloadOutlined, label: '导出', action: 'export' },
  ];
  const [brush, setBrush] = useState<fabric.PencilBrush>();
  const [toolbarType, setToolbarType] = useState('');
  const {canvas, undoRedoManager} = useContext(CanvasContext);
  useEffect(() => {
    if (!canvas) return;
    const brushInstance = configureBrush(canvas);
    setBrush(brushInstance as fabric.PencilBrush);
  }, [canvas])

  const handleClick = (action: string) => {
    if (!canvas) return;
    const item = toolbarItems.find((item) => item.action === action);
    if (!item) return;
    if (item.action === 'brush') {
      const isopen = toolbarType === 'brush';
      if (isopen) {
        canvas.isDrawingMode = false;
      } else {
        canvas.isDrawingMode = true;
      }
      setToolbarType(isopen ? '' : 'brush');
    } else if (item.action === 'text') {
      // const isopen = toolbarType === 'text';
      canvas.isDrawingMode = false;
      const text = new fabric.IText('双击编辑文字', {
        left: 100, // 初始x坐标
        top: 100,  // 初始y坐标
        fontSize: 24, // 字体大小
        fill: 'blue', // 文字颜色
        fontWeight: 'normal', // 字体粗细（normal/bold）
        fontFamily: 'Arial, sans-serif', // 字体
        editable: true, // 允许编辑
        selectable: true, // 允许选中
      });
      canvas.add(text);
      canvas.setActiveObject(text); // 选中新增的文字
      canvas.renderAll();
    } else if (item.action === 'undo') {
      if (undoRedoManager) {
        undoRedoManager.performUndo();
      }
    } else if (item.action === 'redo') {
      if (undoRedoManager) {
        undoRedoManager.performRedo();
      }
    } else if (item.action === 'clear') {
      if (undoRedoManager) {
        undoRedoManager.clearCanvas();
      } else {
        // 如果撤销/重做管理器尚未初始化，使用原始方法
        canvas.clear();
        canvas.backgroundColor = '#fff'; // 重新设置背景色
        canvas.renderAll(); // 重新渲染画布，使背景色生效
      }
    } else if (item.action === 'export') {
      // 默认导出 PNG；长按或后续可扩展为弹窗选择格式
      try {
        exportPNG(canvas, { multiplier: 1, backgroundColor: canvas.backgroundColor as string });
        // 也可提供 SVG 导出示例：
        // exportSVG(canvas);
      } catch (e) {
        console.error('导出失败', e);
      }
    }
  }

  return (
    <div className='toolbar-container'>
      {
        toolbarItems.map((item) => (
          <div className={`toolbar-icon-container ${toolbarType === item.action ? 'active' : ''}` } 
          onClick={() => handleClick(item.action)}  key={item.label}>
            { /* 直接使用 antd 内置图标组件，避免通过 Icon.component 造成类型不匹配 */ }
            <item.icon className='toolbar-icon' />
            <div className='toolbar-icon-label'>{item.label}</div>
          </div>
        ))
      }
    </div>
  );
};

// 3. 导出组件
export default Toolbar;