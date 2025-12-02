import { createContext } from 'react';
import * as fabric from 'fabric';
import UndoRedoManager from '@/utils/undo-redo-manager';

interface CanvasContextProps {
    canvas: fabric.Canvas | null;
    width: number;
    height: number;
    undoRedoManager: UndoRedoManager | null;
}

export const CanvasContext = createContext<CanvasContextProps>({
    canvas: null,
    width: 0,
    height: 0,
    undoRedoManager: null,
});
