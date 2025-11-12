import { createContext } from 'react';
import * as fabric from 'fabric';

interface CanvasContextProps {
    canvas: fabric.Canvas | null;
    width: number;
    height: number;
}

export const CanvasContext = createContext<CanvasContextProps>({
    canvas: null,
    width: 0,
    height: 0,
});
