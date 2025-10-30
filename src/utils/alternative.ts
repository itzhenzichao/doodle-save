//   const zoomIn = () => {
//     if (!canvasInstanceRef.current) return;
//     canvasInstanceRef.current.setZoom(canvasInstanceRef.current.getZoom() + 0.1);
//     canvasInstanceRef.current.renderAll();
//   };

//   // 缩小（每次减少 0.1 倍，最小缩放到 0.1 倍）
//   const zoomOut = () => {
//     if (!canvasInstanceRef.current) return;
//     const currentZoom = canvasInstanceRef.current.getZoom();
//     if (currentZoom > 0.1) {
//       canvasInstanceRef.current.setZoom(currentZoom - 0.1);
//       canvasInstanceRef.current.renderAll();
//     }
//   };

//   // 重置视图（恢复原大小和位置）
//   const resetView = () => {
//     if (!canvasInstanceRef.current) return;
//     // 重置缩放为1
//     canvasInstanceRef.current.setZoom(1);
//     // 重置平移为原点
//     canvasInstanceRef.current.viewportTransform = [1, 0, 0, 1, 0, 0];
//     // 重新渲染画布
//     canvasInstanceRef.current.renderAll();
//     // 提示用户视图已重置
//     console.log('视图已重置到初始状态');
//   };
  
//   // 增强版重置视图（完全重置所有变换）
//   const resetView2 = () => {
//     if (!canvasInstanceRef.current) return;
//     // 完全重置视口变换矩阵
//     canvasInstanceRef.current.viewportTransform = [1, 0, 0, 1, 0, 0];
//     // 重置缩放为1（不使用setZoom，因为它可能会保留部分变换）
//     canvasInstanceRef.current.zoomToPoint(new fabric.Point(0, 0), 1);
//     // 清除所有缓存的变换
//     canvasInstanceRef.current.absolutePan(new fabric.Point(0, 0));
//     // 重新渲染画布
//     canvasInstanceRef.current.renderAll();
//     console.log('视图已完全重置（增强版）');
//   };
  // 以指定点为中心缩放
// 以指定点为中心缩放
// const zoomAtPoint = (x: number, y: number, delta: number) => {
//   if (!canvasInstanceRef.current) return;
  
//   // 获取当前缩放和视口变换
//   const currentZoom = canvasInstanceRef.current.getZoom();
//   const newZoom = Math.max(0.1, currentZoom + delta);
  
//   // 获取当前视口变换
//   const vpt = [...(canvasInstanceRef.current.viewportTransform || [1, 0, 0, 1, 0, 0])];
  
//   // 计算点击点在原始坐标系中的位置
//   const pointX = x / currentZoom - vpt[4] / currentZoom;
//   const pointY = y / currentZoom - vpt[5] / currentZoom;
  
//   // 计算新的视口变换
//   vpt[0] = newZoom;
//   vpt[3] = newZoom;
//   vpt[4] = -pointX * newZoom + x;
//   vpt[5] = -pointY * newZoom + y;
  
//   // 更新画布
//   canvasInstanceRef.current.setViewportTransform(vpt);
//   canvasInstanceRef.current.renderAll();
// };


//               <Button type="primary" onClick={handleIncrease}>放大 (+)</Button>
//               <Button type="primary" onClick={handleDecrease}>缩小 (-)</Button>
//                 // 增加scale值
//   const handleIncrease = () => {
//     setScale(prev => Math.min(prev + 0.1, 2)); // 限制最大为2
//   };
//   // 减少scale值
//   const handleDecrease = () => {
//     setScale(prev => Math.max(prev - 0.1, 0.5)); // 限制最小为0.5
//   };

  // 绑定所有交互事件
//   const bindEvents = () => {
//     if (!canvasInstanceRef.current) return;

//     // 点击缩放事件
//     canvasInstanceRef.current.on('mouse:down', (e) => {
//       if (!canvasInstanceRef.current) return;
//       if (canvasInstanceRef.current.isDrawingMode) return;

//       const event = e.e as PointerEvent;
//       // 获取鼠标在画布上的实际位置
//       const pointer = canvasInstanceRef.current.getPointer(event); 

//       // Mac系统: Command + 左键 → 放大
//       // Windows系统: Ctrl + 左键 → 放大
//       if ((event.metaKey || event.ctrlKey) && event.button === 0) {
//         zoomAtPoint(pointer.x, pointer.y, 0.5);
//         event.preventDefault();
//       }

//       // Shift + 左键 → 缩小
//       if (event.shiftKey && event.button === 0) {
//         zoomAtPoint(pointer.x, pointer.y, -0.5);
//         event.preventDefault();
//       }

//       // 普通左键 → 开始平移
//       if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0) {
//         setIsPanning(true);
//         setLastPos({ x: pointer.x, y: pointer.y });
//       }
//     });

//     // 鼠标移动平移事件
//     canvasInstanceRef.current.on('mouse:move', (e) => {
//       if (!canvasInstanceRef.current || !isPanning || canvasInstanceRef.current.isDrawingMode) return;

//       const event = e.e as PointerEvent;
//       // 获取鼠标在画布上的实际位置
//       const pointer = canvasInstanceRef.current.getPointer(event); 
//       const deltaX = pointer.x - lastPos.x;
//       const deltaY = pointer.y - lastPos.y;

//       const transform = canvasInstanceRef.current.viewportTransform;
//       if (transform) {
//         transform[4] += deltaX;
//         transform[5] += deltaY;
//         canvasInstanceRef.current.setViewportTransform(transform);
//       }

//       setLastPos({ x: pointer.x, y: pointer.y });
//       canvasInstanceRef.current.renderAll();
//     });

//     // 结束平移
//     const endPan = () => setIsPanning(false);
//     canvasInstanceRef.current.on('mouse:up', endPan);
//     canvasInstanceRef.current.on('mouse:out', endPan);
//   };

    // 记录平移状态
// s