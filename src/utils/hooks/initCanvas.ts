import { useEffect, useState } from 'react'
import * as fabric from 'fabric';

interface InitCanvasOptions {
    width?: number;
    height?: number;
    backgroundColor?: string;
}

const useFabricCanvas = (canvasId: string, options: InitCanvasOptions) => {
    // const canvasRef = useRef(null);
    const [canvasInstance, setCanvasInstance] = useState<fabric.Canvas | null>(null);
    const {
        width,
        height,
        backgroundColor,
        // onInitialized = () => {}, // 初始化完成后的回调
    } = options;
    useEffect(() => {
        const canvasElement = document.getElementById(canvasId);
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
        fabricCanvas.renderAll();
        return () => {
            if (fabricCanvas) {
                fabricCanvas.dispose(); // 销毁画布实例
            }
        };
    },[])
    return {
        canvas: canvasInstance
    }
}

export default useFabricCanvas;