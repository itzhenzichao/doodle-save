import * as fabric from 'fabric';

export interface ExportPNGOptions {
  quality?: number; // 0~1，仅对 JPEG 有效（PNG忽略），预留扩展
  multiplier?: number; // 导出缩放倍数
  backgroundColor?: string | null; // 导出背景色，null 表示透明
  name?: string; // 文件名（不含扩展名）
}

export const exportPNG = (canvas: fabric.Canvas, opts: ExportPNGOptions = {}) => {
  if (!canvas) return;
  const {
    quality = 1,
    multiplier = 1,
    backgroundColor = canvas.backgroundColor as string | null,
    name = `doodle_${Date.now()}`,
  } = opts;

  // 暂存并根据导出参数调整背景色（避免使用不存在的 setBackgroundColor 类型方法）
  const originalBg = canvas.backgroundColor as string | undefined;
  if (backgroundColor === null) {
    // 透明背景：导出前临时去掉背景
    (canvas as any).backgroundColor = undefined;
  } else if (typeof backgroundColor === 'string') {
    (canvas as any).backgroundColor = backgroundColor;
  }
  canvas.renderAll();

  const dataURL = canvas.toDataURL({ format: 'png', multiplier, quality });

  // 还原背景
  (canvas as any).backgroundColor = originalBg as string | undefined;
  canvas.renderAll();

  triggerDownload(dataURL, `${name}.png`);
};

export const exportSVG = (canvas: fabric.Canvas, name = `doodle_${Date.now()}`) => {
  if (!canvas) return;
  const svgString = canvas.toSVG();
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${name}.svg`);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
};

const triggerDownload = (url: string, filename: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};