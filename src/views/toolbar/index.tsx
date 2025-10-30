import Icon, {
  EditOutlined,
  HighlightOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import './index.scss'
import { Layout, Button, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { increment } from '../../store/canvas';

const Toolbar = () => {
  const toolbarItems = [
    { icon: HighlightOutlined, label: '画笔' },
    // { icon: CloseOutlined, label: '关闭画笔' },
    { icon: EditOutlined, label: '添加文字' },
    { icon: UndoOutlined, label: '清除画布' },
  ];
  // 类型自动推断
  const count = useSelector((state: RootState) => state.canvas.value);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className='toolbar-container'>
      <button onClick={() => dispatch(increment())}>{count}</button>
      {
        toolbarItems.map((item) => (
          <div className='toolbar-icon-container' key={item.label}>
            <Icon className='toolbar-icon' component={item.icon} />
            <div className='toolbar-icon-label'>{item.label}</div>
          </div>
        ))
      }
            {/* <Button type="primary" onClick={addPen}>画笔</Button>
            <Button type="primary" onClick={closePen}>关闭画笔</Button>
            <Button type="primary" onClick={clearCanvas}>清除画布</Button>
            <Button type="primary" onClick={addText}>添加文字</Button>
            <Select
              defaultValue={1} // 初始选中100%（对应scale=1）
              style={{ width: 120, marginBottom: '20px' }}
              onChange={handleScaleChange}
              options={scaleOptions}
            >

            </Select> */}
    </div>
  );
};

// 3. 导出组件
export default Toolbar;