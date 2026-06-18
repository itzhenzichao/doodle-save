import { ColorPicker } from 'antd';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setColor as setReduxColor } from '@/store/slices/canvas';
import type { ColorPickerProps, GetProp } from 'antd';
type Color = GetProp<ColorPickerProps, 'value'>;

interface ColorSelectorProps {
    handleColorSelect: Function
}

const ColorSelector = (props: ColorSelectorProps)=>{
    const { handleColorSelect } = props;
    const [color, setLocalColor] = useState<Color>('#ffc116');
    const dispatch = useDispatch();
    const hexString = useMemo<string>(
        () => (typeof color === 'string' ? color : color?.toHexString()),
        [color],
    );

    useEffect(()=>{
        dispatch(setReduxColor((hexString)));
    }, [color, dispatch]);

    return (
        <div className="toolbar-icon-container" style={{textAlign: 'center'}}>
            <ColorPicker
            placement="rightTop"
            onOpenChange={handleColorSelect}
            format="hex"
            value={color} onChangeComplete={setLocalColor} />
            <div className='toolbar-icon-label'>颜色选择</div>
        </div>
    )
}
export default ColorSelector;