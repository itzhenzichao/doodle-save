import * as fabric from 'fabric';

export const configureBrush = (canvasInstance: fabric.Canvas) => {
    if (!canvasInstance) return;

  // 关键：如果 freeDrawingBrush 未初始化，手动创建 PencilBrush 实例
  if (!canvasInstance.freeDrawingBrush) {
    canvasInstance.freeDrawingBrush = new fabric.PencilBrush(canvasInstance);
  }

  // 此时 brush 一定存在，可安全设置属性
  const brush = canvasInstance.freeDrawingBrush;
  brush.color = 'red'; // 线条颜色
  brush.width = 5; // 线条宽度
  // brush.lineCap = 'round'; // 线条端点样式（圆润）
  return brush;
};