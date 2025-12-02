import * as fabric from 'fabric';

// 定义命令接口
interface Command {
  execute(): void;
  undo(): void;
}

// 添加对象命令
class AddObjectCommand implements Command {
  private canvas: fabric.Canvas;
  private object: fabric.Object;

  constructor(canvas: fabric.Canvas, object: fabric.Object) {
    this.canvas = canvas;
    this.object = object;
  }

  execute(): void {
    this.canvas.add(this.object);
    this.canvas.renderAll();
  }

  undo(): void {
    this.canvas.remove(this.object);
    this.canvas.renderAll();
  }
}

// 移除对象命令
class RemoveObjectCommand implements Command {
  private canvas: fabric.Canvas;
  private object: fabric.Object;

  constructor(canvas: fabric.Canvas, object: fabric.Object) {
    this.canvas = canvas;
    this.object = object;
  }

  execute(): void {
    this.canvas.remove(this.object);
    this.canvas.renderAll();
  }

  undo(): void {
    this.canvas.add(this.object);
    this.canvas.renderAll();
  }
}

// 修改对象属性命令
class ModifyObjectCommand implements Command {
  private canvas: fabric.Canvas;
  private object: fabric.Object;
  private previousState: any;
  private newState: any;

  constructor(canvas: fabric.Canvas, object: fabric.Object, newState: any) {
    this.canvas = canvas;
    this.object = object;
    this.previousState = this._captureState(object);
    this.newState = newState;
  }

  execute(): void {
    this._applyState(this.object, this.newState);
    this.canvas.renderAll();
  }

  undo(): void {
    this._applyState(this.object, this.previousState);
    this.canvas.renderAll();
  }

  private _captureState(object: fabric.Object): any {
    return {
      left: object.left,
      top: object.top,
      scaleX: object.scaleX,
      scaleY: object.scaleY,
      angle: object.angle,
      fill: object.fill,
      stroke: object.stroke,
      strokeWidth: object.strokeWidth,
      // 可以根据需要添加更多属性
    };
  }

  private _applyState(object: fabric.Object, state: any): void {
    Object.keys(state).forEach(key => {
      if (state[key] !== undefined) {
        object.set(key as any, state[key]);
      }
    });
  }
}

// 清除画布命令
class ClearCanvasCommand implements Command {
  private canvas: fabric.Canvas;
  private previousObjects: fabric.Object[];
  private previousBackgroundColor: string | undefined;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this.previousObjects = [...canvas.getObjects()];
    this.previousBackgroundColor = canvas.backgroundColor as string;
  }

  execute(): void {
    this.canvas.clear();
    this.canvas.backgroundColor = '#ffffff';
    this.canvas.renderAll();
  }

  undo(): void {
    this.canvas.backgroundColor = this.previousBackgroundColor || '#ffffff';
    
    // 直接添加对象到画布，按照原始顺序
    // 这样确保撤销时能按照正确的顺序恢复
    this.previousObjects.forEach(obj => {
      this.canvas.add(obj);
    });
    
    this.canvas.renderAll();
  }
}

// 撤销/重做管理器
class UndoRedoManager {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  private canvas: fabric.Canvas | null = null;
  private maxHistorySize: number = 50; // 最大历史记录数量

  constructor(canvas: fabric.Canvas, maxHistorySize: number = 50) {
    this.canvas = canvas;
    this.maxHistorySize = maxHistorySize;
    this._setupCanvasListeners();
  }

  // 执行命令
  executeCommand(command: Command): void {
    command.execute();
    this.undoStack.push(command);
    
    // 限制历史记录大小
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift();
    }
    
    // 执行新命令时清空重做栈
    this.redoStack = [];
  }

  // 撤销
  undo(): boolean {
    if (this.undoStack.length === 0) return false;
    
    const command = this.undoStack.pop()!;
    command.undo();
    this.redoStack.push(command);
    
    return true;
  }

  // 重做
  redo(): boolean {
    if (this.redoStack.length === 0) return false;
    
    const command = this.redoStack.pop()!;
    command.execute();
    this.undoStack.push(command);
    
    return true;
  }

  // 检查是否可以撤销
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  // 检查是否可以重做
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  // 清空历史记录
  clearHistory(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  // 直接添加命令到撤销栈（用于ClearCanvasCommand）
  addCommandToUndoStack(command: Command): void {
    this.undoStack.push(command);
    
    // 限制历史记录大小
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift();
    }
  }

  // 清空重做栈（用于ClearCanvasCommand）
  clearRedoStack(): void {
    this.redoStack = [];
  }

  // 设置画布监听器
  private _setupCanvasListeners(): void {
    if (!this.canvas) return;

    // 监听对象添加
    this.canvas.on('object:added', (e) => {
      // 避免在撤销/重做操作时重复记录
      if (e.target && !this._isUndoRedoOperation) {
        const command = new AddObjectCommand(this.canvas!, e.target);
        this.undoStack.push(command);
        
        // 限制历史记录大小
        if (this.undoStack.length > this.maxHistorySize) {
          this.undoStack.shift();
        }
        
        // 执行新命令时清空重做栈
        this.redoStack = [];
      }
    });

    // 监听对象移除
    this.canvas.on('object:removed', (e) => {
      // 避免在撤销/重做操作时重复记录
      if (e.target && !this._isUndoRedoOperation) {
        const command = new RemoveObjectCommand(this.canvas!, e.target);
        this.undoStack.push(command);
        
        // 限制历史记录大小
        if (this.undoStack.length > this.maxHistorySize) {
          this.undoStack.shift();
        }
        
        // 执行新命令时清空重做栈
        this.redoStack = [];
      }
    });

    // 监听对象修改
    this.canvas.on('object:modified', (e) => {
      // 避免在撤销/重做操作时重复记录
      if (e.target && !this._isUndoRedoOperation) {
        const command = new ModifyObjectCommand(this.canvas!, e.target, {});
        this.undoStack.push(command);
        
        // 限制历史记录大小
        if (this.undoStack.length > this.maxHistorySize) {
          this.undoStack.shift();
        }
        
        // 执行新命令时清空重做栈
        this.redoStack = [];
      }
    });
  }

  // 标记是否为撤销/重做操作
  private _isUndoRedoOperation: boolean = false;

  // 执行撤销操作
  performUndo(): boolean {
    if (!this.canUndo()) return false;
    
    this._isUndoRedoOperation = true;
    const result = this.undo();
    this._isUndoRedoOperation = false;
    
    return result;
  }

  // 执行重做操作
  performRedo(): boolean {
    if (!this.canRedo()) return false;
    
    this._isUndoRedoOperation = true;
    const result = this.redo();
    this._isUndoRedoOperation = false;
    
    return result;
  }

  // 清除画布
  clearCanvas(): void {
    if (!this.canvas) return;
    
    const command = new ClearCanvasCommand(this.canvas);
    this.executeCommand(command);
  }
}

export default UndoRedoManager;
export {
  UndoRedoManager,
  AddObjectCommand,
  RemoveObjectCommand,
  ModifyObjectCommand,
  ClearCanvasCommand
};