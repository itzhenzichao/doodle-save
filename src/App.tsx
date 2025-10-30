import { useEffect, useRef, useState } from 'react'
import { Layout } from 'antd';
const { Header, Sider, Content } = Layout;
import { layoutStyle } from './Layout.style';
import './App.scss'
import * as fabric from 'fabric';
import { getElementSizeByClass } from './utils/dom-info';
import Toolbar from './views/toolbar/index';
import DoodleHeader from './views/header/index';


function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null);

  // 定义scale状态，初始值为1
  const [scale, setScale] = useState(1);
  const [size, setSize] = useState({
    width: 300,
    height: 300
  });
  const [doodleContentSize, setDoodleContentSize] = useState({
    width: 0,
    height: 0
  });
  
  const scaleOptions = [
    { value: 4, label: '400%' },
    { value: 3, label: '300%' },
    { value: 2, label: '200%' },
    { value: 1, label: '100%' },
    { value: 0.5, label: '50%' },
    { value: 0.25, label: '25%' },
  ];
  useEffect(() => {
    if (!canvasRef.current) return;
    initCanvas();
    return () => {
      if (canvasInstanceRef.current) {
        canvasInstanceRef.current.dispose(); // 销毁画布实例
        canvasInstanceRef.current = null;
      }
    };
  }, [])
  // 初始化画布
  const initCanvas = () => {
    canvasInstanceRef.current = new fabric.Canvas(canvasRef.current!, {
      width: 300,   // 画布宽度
      height: 300,  // 画布高度
      selection: true, // 显式开启选择功能（关键）
      backgroundColor: '#ffffff'
    });
    canvasInstanceRef.current.renderAll();
    changeEditorScrollDomSize();
  }
  const changeEditorScrollDomSize = () => {
    const editorScrollDom = getElementSizeByClass('doodle-content');
    if (!editorScrollDom) return;
    setDoodleContentSize({
      width: editorScrollDom.clientWidth - 40,
      height: editorScrollDom.clientHeight - 40
    })
  }
  // 配置画笔样式（修复 brush 未初始化问题）
  const configureBrush = () => {
    if (!canvasInstanceRef.current) return;

    // 关键：如果 freeDrawingBrush 未初始化，手动创建 PencilBrush 实例
    if (!canvasInstanceRef.current.freeDrawingBrush) {
      canvasInstanceRef.current.freeDrawingBrush = new fabric.PencilBrush(canvasInstanceRef.current);
    }

    // 此时 brush 一定存在，可安全设置属性
    const brush = canvasInstanceRef.current.freeDrawingBrush;
    brush.color = 'red'; // 线条颜色
    brush.width = 5; // 线条宽度
    brush.lineCap = 'round'; // 线条端点样式（圆润）
    brush.lineJoin = 'round'; // 线条连接处样式（圆润）
    brush.globalAlpha = 1; // 不透明度
  };
  // 画笔
  const addPen = () => {
    if (!canvasInstanceRef.current) return;
    configureBrush();
    canvasInstanceRef.current.isDrawingMode = true;
  }
  // 关闭画笔
  const closePen = () => {
    if (!canvasInstanceRef.current) return;
    canvasInstanceRef.current.isDrawingMode = false;
  }
  // 清除画布
  const clearCanvas = () => {
    if (!canvasInstanceRef.current) return;
    canvasInstanceRef.current.clear();
    canvasInstanceRef.current.backgroundColor = '#f0f0f0'; // 重新设置背景色
    canvasInstanceRef.current.renderAll(); // 重新渲染画布，使背景色生效
  }
const addText = () => {
    if (!canvasInstanceRef.current) return;
    // 关闭画笔模式（避免冲突）
    canvasInstanceRef.current.isDrawingMode = false;

    // 创建文字对象
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

    // 添加到画布并渲染
    canvasInstanceRef.current.add(text);
    canvasInstanceRef.current.setActiveObject(text); // 选中新增的文字
    canvasInstanceRef.current.renderAll();
    
  };
  const handleScaleChange = (value: number) => {
    setScale(value);
  };
  return (
    <>
      <Layout style={layoutStyle}>
        <Header className="header-content">
          <DoodleHeader></DoodleHeader>
        </Header>
        <Layout className="site-layout">
          <Sider className="sider-content" width="71px">
            <Toolbar />
          </Sider>
          <Content className="doodle-content">
            <div className='editor-containerScroll' style={{
                    width: `${Math.max(scale* size.width, doodleContentSize.width)}px`,
                    height: `${Math.max(scale* size.height, doodleContentSize.height)}px`,
                  }}>
              <div className='editor-container' style={{
                    width: `${scale* size.width}px`,
                    height: `${scale* size.height}px`,
                  }}>
                  <div className='canvas-self-container'  style={{
                    transform: `translate3d(-50%, -50%, 0px) scale(${scale})`,
                  }}>
                    <canvas id="canvas" ref={canvasRef} />
                  </div>
                </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default App
