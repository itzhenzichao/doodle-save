import {
  EditOutlined,
  HighlightOutlined,
  UndoOutlined,
  RedoOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import ShapeSelector from '../shape-selector';
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
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{x: number, y: number} | null>(null);
  const [currentShape, setCurrentShape] = useState<fabric.Object | null>(null);
  const {canvas, undoRedoManager} = useContext(CanvasContext);
  useEffect(() => {
    if (!canvas) return;
    const brushInstance = configureBrush(canvas);
    setBrush(brushInstance as fabric.PencilBrush);

    // 添加鼠标事件监听器
    const handleMouseDown = (e: any) => {
      if (!canvas || !e.pointer || (toolbarType !== 'circle' && toolbarType !== 'rectangle' && toolbarType !== 'triangle')) {
        return;
      }
      
      setIsDrawing(true);
      const pointer = e.pointer;
      setStartPoint({ x: pointer.x, y: pointer.y });
      
      // 创建初始形状
      let shape: fabric.Object | null = null;
      
      if (toolbarType === 'circle') {
        shape = new fabric.Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 1,
          fill: 'transparent',
          stroke: 'red',
          strokeWidth: 2,
          selectable: false,
          evented: false,
        });
      } else if (toolbarType === 'rectangle') {
        shape = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 1,
          height: 1,
          fill: 'transparent',
          stroke: 'green',
          strokeWidth: 2,
          selectable: false,
          evented: false,
        });
      } else if (toolbarType === 'triangle') {
        shape = new fabric.Triangle({
          left: pointer.x,
          top: pointer.y,
          width: 1,
          height: 1,
          fill: 'transparent',
          stroke: 'blue',
          strokeWidth: 2,
          selectable: false,
          evented: false,
        });
      }
      
      if (shape) {
        setCurrentShape(shape);
        canvas.add(shape);
        canvas.renderAll();
      }
    };

    const handleMouseMove = (e: any) => {
      if (!isDrawing || !startPoint || !currentShape || !canvas || !e.pointer) {
        return;
      }
      
      const currentX = e.pointer.x;
      const currentY = e.pointer.y;
      
      if (toolbarType === 'circle' && currentShape instanceof fabric.Circle) {
        // 计算半径（基于起点到当前点的距离）
        const radius = Math.sqrt(
          Math.pow(currentX - startPoint.x, 2) + Math.pow(currentY - startPoint.y, 2)
        ) / 2;
        
        // 更新圆形位置和半径
        currentShape.set({
          left: startPoint.x - radius,
          top: startPoint.y - radius,
          radius: Math.max(radius, 1),
        });
      } else if (toolbarType === 'rectangle' && currentShape instanceof fabric.Rect) {
        // 计算矩形边界
        const width = Math.abs(currentX - startPoint.x);
        const height = Math.abs(currentY - startPoint.y);
        const left = Math.min(startPoint.x, currentX);
        const top = Math.min(startPoint.y, currentY);
        
        currentShape.set({
          left: left,
          top: top,
          width: Math.max(width, 1),
          height: Math.max(height, 1),
        });
      } else if (toolbarType === 'triangle' && currentShape instanceof fabric.Triangle) {
        // 计算三角形边界
        const width = Math.abs(currentX - startPoint.x);
        const height = Math.abs(currentY - startPoint.y);
        const left = Math.min(startPoint.x, currentX);
        const top = Math.min(startPoint.y, currentY);
        
        currentShape.set({
          left: left,
          top: top,
          width: Math.max(width, 1),
          height: Math.max(height, 1),
        });
      }
      
      canvas.renderAll();
    };

    const handleMouseUp = () => {
      if (!isDrawing || !currentShape || !canvas) {
        return;
      }
      
      // 完成绘制，启用选择功能
      currentShape.set({
        selectable: true,
        evented: true,
      });
      
      canvas.setActiveObject(currentShape);
      canvas.renderAll();
      
      // 重置绘制状态并退出绘制模式
      setIsDrawing(false);
      setStartPoint(null);
      setCurrentShape(null);
      setToolbarType(''); // 重置工具类型到默认状态
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, toolbarType, isDrawing, startPoint, currentShape])

  const handleClick = (action: string) => {
    if (!canvas) return;
    const item = toolbarItems.find((item) => item.action === action);
    if (!item) return;
    
    if (item.action === 'brush') {
      const isopen = toolbarType === 'brush';
      if (isopen) {
        canvas.isDrawingMode = false;
        setToolbarType('');
      } else {
        canvas.isDrawingMode = true;
        setToolbarType('brush');
      }
    } else if (item.action === 'text') {
      canvas.isDrawingMode = false;
      setToolbarType('');
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

  const handleShapeSelect = (shape: 'circle' | 'rectangle' | 'triangle') => {
    if (!canvas) return;
    
    // 切换形状绘制模式
    canvas.isDrawingMode = false;
    const isopen = toolbarType === shape;
    if (isopen) {
      setToolbarType('');
    } else {
      setToolbarType(shape);
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
      
      {/* 添加图形选择器 */}
      <ShapeSelector 
        onSelect={handleShapeSelect}
        isActive={toolbarType === 'circle' || toolbarType === 'rectangle' || toolbarType === 'triangle'}
      />
    </div>
  );
};

// 3. 导出组件
export default Toolbar;
