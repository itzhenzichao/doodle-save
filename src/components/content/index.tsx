import { useEffect, useRef, useState, useContext } from 'react'
// import { useDispatch } from 'react-redux';
// import type { AppDispatch } from '@/store';
import { getElementSizeByClass } from '@/utils/dom-info';
import { Select } from 'antd';
import { CanvasContext } from '@/utils/contexts';

import './index.scss'

 const DoodleContent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const dispatch = useDispatch<AppDispatch>();
  const { width, height } = useContext(CanvasContext);

  const [scale, setScale] = useState(1);
  const [doodleContentSize, setDoodleContentSize] = useState({
    width: 0,
    height: 0
  });
  useEffect(() => {
    changeEditorScrollDomSize();
  }, []);
  const changeEditorScrollDomSize = () => {
    const editorScrollDom = getElementSizeByClass('doodle-content');
    if (!editorScrollDom) return;
    setDoodleContentSize({
      width: editorScrollDom.clientWidth - 40,
      height: editorScrollDom.clientHeight - 62
    })
  }
  const handleScaleChange = (value: number) => {
    setScale(value);
  };
  const scaleOptions = [
    { value: 4, label: '400%' },
    { value: 3, label: '300%' },
    { value: 2, label: '200%' },
    { value: 1, label: '100%' },
    { value: 0.5, label: '50%' },
    { value: 0.25, label: '25%' },
  ];
  return (
      <>
    <div className="scale-select">
      <Select
        defaultValue={1} // 初始选中100%（对应scale=1）
        style={{ width: 90 }}
        onChange={handleScaleChange}
        options={scaleOptions}
      >
      </Select>
    </div>
    {/* 去除内边距，实际渲染窗口 */}
    <div className={`editor-containerScroll`} style={{
        width: `${doodleContentSize.width}px`,
        height: `${doodleContentSize.height}px`,
        }}>
          {/* 因为translate3d不受 overflow: scroll 控制， 包一层实现滚动 */}
        <div className={`${( (scale * width > doodleContentSize.width) || (scale * height > doodleContentSize.height)) ? 'editor-container' : 'editor-container-margin'}`} style={{
            width: `${scale* width}px`,
            height: `${scale* height}px`,
            }}>
            <div className='canvas-self-container'  style={{
            transform: `translate3d(-50%, -50%, 0px) scale(${scale})`,
            }}>
            <canvas id="canvas" ref={canvasRef} />
            </div>
        </div>
    </div>
      </>
  );
};

export default DoodleContent;