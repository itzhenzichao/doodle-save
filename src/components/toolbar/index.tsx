import Icon, {
  EditOutlined,
  HighlightOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import './index.scss'
// import { useSelector, useDispatch } from 'react-redux';
// import type { RootState, AppDispatch } from '@/store';
import { useContext, useEffect, useState } from 'react';
import { CanvasContext } from '@/utils/contexts';
import { configureBrush } from '@/utils/hooks/toolbar';
import * as fabric from 'fabric';

const Toolbar = () => {
  const toolbarItems = [
    { icon: HighlightOutlined, label: '画笔', action: 'brush' },
    { icon: EditOutlined, label: '添加文字', action: 'text' },
    { icon: UndoOutlined, label: '清除画布', action: 'clear' },
  ];
  const [brush, setBrush] = useState<fabric.PencilBrush>();
  console.log('brush', brush)
  const [toolbarType, setToolbarType] = useState('');
  const { canvas } = useContext(CanvasContext);
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
    } else if (item.action === 'clear') {
      canvas.clear();
      canvas.backgroundColor = '#fff'; // 重新设置背景色
      canvas.renderAll(); // 重新渲染画布，使背景色生效
    }
  }

  return (
    <div className='toolbar-container'>
      {
        toolbarItems.map((item) => (
          <div className={`toolbar-icon-container ${toolbarType === item.action ? 'active' : ''}` } 
          onClick={() => handleClick(item.action)}  key={item.label}>
            <Icon className='toolbar-icon' component={item.icon} />
            <div className='toolbar-icon-label'>{item.label}</div>
          </div>
        ))
      }
    </div>
  );
};

// 3. 导出组件
export default Toolbar;