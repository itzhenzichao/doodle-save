import { ColorPicker } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setColor as setReduxColor } from '@/store/slices/canvas';
import { useColorHex } from '@/utils/hooks/useColorHex';
import type { ColorPickerProps, GetProp } from 'antd';
type Color = GetProp<ColorPickerProps, 'value'>;

interface ColorSelectorProps {
    handleColorSelect: (open: boolean) => void
}

const ColorSelector = (props: ColorSelectorProps)=>{
    const { handleColorSelect } = props;
    const [color, setLocalColor] = useState<Color>('#ffc116');
    const dispatch = useDispatch();
    const hexString = useColorHex(color, '#ffc116');

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