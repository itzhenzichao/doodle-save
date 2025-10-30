/**
 * 通过类名获取元素的宽高信息
 * @param {string} className - 目标元素的类名（不含 '.' 前缀）
 * @returns {Object|null} 包含宽高信息的对象，不存在则返回 null
 * 返回格式: {
 *   offsetWidth: 元素宽（含边框和内边距）,
 *   offsetHeight: 元素高（含边框和内边距）,
 *   clientWidth: 元素宽（不含边框，含内边距）,
 *   clientHeight: 元素高（不含边框，含内边距）,
 *   boundingWidth: 元素宽（含内容、内边距、边框，不含滚动条）,
 *   boundingHeight: 元素高（含内容、内边距、边框，不含滚动条）
 * }
 */
export const getElementSizeByClass = (className: string) => {
  // 校验类名参数
  if (typeof className !== 'string' || className.trim() === '') {
    console.error('类名参数必须是有效的字符串');
    return null;
  }

  // 通过类名获取元素（取第一个匹配的元素）
  const elements = document.getElementsByClassName(className);
  if (elements.length === 0) {
    console.warn(`未找到类名为 "${className}" 的元素`);
    return null;
  }
  const targetElement = elements[0]; // 若有多个元素，默认取第一个

  // 获取各种尺寸信息
  const { offsetWidth, offsetHeight } = targetElement as HTMLElement;
  const { clientWidth, clientHeight } = targetElement;
  const boundingRect = targetElement.getBoundingClientRect();

  return {
    offsetWidth,
    offsetHeight,
    clientWidth,
    clientHeight,
    boundingWidth: boundingRect.width,
    boundingHeight: boundingRect.height,
  };
};