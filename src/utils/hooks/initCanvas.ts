import { useEffect, useState } from 'react'
import * as fabric from 'fabric';
import UndoRedoManager from '@/utils/undo-redo-manager';

interface InitCanvasOptions {
    width?: number;
    height?: number;
    backgroundColor?: string;
}

const useFabricCanvas = (canvasId: string, options: InitCanvasOptions) => {
    // const canvasRef = useRef(null);
    const [canvasInstance, setCanvasInstance] = useState<fabric.Canvas | null>(null);
    const [undoRedoManager, setUndoRedoManager] = useState<UndoRedoManager | null>(null);
    const {
        width,
        height,
        backgroundColor,
        // onInitialized = () => {}, // 初始化完成后的回调
    } = options;
    useEffect(() => {
        const canvasElement = document.getElementById(canvasId);
        console.log('canvasElement', canvasElement)
        if (!width || !height || width <= 0 || height <= 0) {
            console.log('width 或 height 未设置或无效，等待设置...');
            return;
        }
        if (!canvasElement) {
            console.error(`未找到 id 为 ${canvasId} 的 canvas 元素`);
            return;
        }
        const fabricCanvas = new fabric.Canvas(canvasElement as HTMLCanvasElement, {
            width,
            height,
            selection: true, // 显式开启选择功能（关键）
            backgroundColor
        });
        setCanvasInstance(fabricCanvas);
        
        // 初始化撤销/重做管理器
        const manager = new UndoRedoManager(fabricCanvas);
        setUndoRedoManager(manager);
        
        fabricCanvas.renderAll();
        return () => {
            if (fabricCanvas) {
                fabricCanvas.dispose(); // 销毁画布实例
            }
        };
    },[width, height])
    return {
        canvas: canvasInstance,
        undoRedoManager
    }
}

export default useFabricCanvas;