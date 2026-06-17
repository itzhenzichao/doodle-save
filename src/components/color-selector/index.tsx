import { ColorPicker } from 'antd';

const ColorSelector = ()=>{

    return (
        <div className="toolbar-icon-container" style={{textAlign: 'center'}}>
            <ColorPicker defaultValue="#f0a314" />
            <div className='toolbar-icon-label'>颜色选择</div>
        </div>
    )
}
export default ColorSelector;