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
  private undoRedoManager: UndoRedoManager;

  constructor(canvas: fabric.Canvas, object: fabric.Object, undoRedoManager?: UndoRedoManager) {
    this.canvas = canvas;
    this.object = object;
    this.undoRedoManager = undoRedoManager!;
  }

  execute(): void {
    this.canvas.add(this.object);
    this.canvas.renderAll();
  }

  undo(): void {
    // 标记为撤销操作，避免触发事件监听器
    if (this.undoRedoManager) {
      this.undoRedoManager._markAsUndoRedoOperation();
    }
    
    this.canvas.remove(this.object);
    this.canvas.renderAll();
    
    // 取消标记
    if (this.undoRedoManager) {
      this.undoRedoManager._unmarkAsUndoRedoOperation();
    }
  }
}

// 移除对象命令
class RemoveObjectCommand implements Command {
  private canvas: fabric.Canvas;
  private object: fabric.Object;
  private undoRedoManager: UndoRedoManager;

  constructor(canvas: fabric.Canvas, object: fabric.Object, undoRedoManager?: UndoRedoManager) {
    this.canvas = canvas;
    this.object = object;
    this.undoRedoManager = undoRedoManager!;
  }

  execute(): void {
    this.canvas.remove(this.object);
    this.canvas.renderAll();
  }

  undo(): void {
    // 标记为撤销操作，避免触发事件监听器
    if (this.undoRedoManager) {
      this.undoRedoManager._markAsUndoRedoOperation();
    }
    
    this.canvas.add(this.object);
    this.canvas.renderAll();
    
    // 取消标记
    if (this.undoRedoManager) {
      this.undoRedoManager._unmarkAsUndoRedoOperation();
    }
  }
}

// 修改对象属性命令
class ModifyObjectCommand implements Command {
  private canvas: fabric.Canvas;
  private object: fabric.Object;
  private previousState: any;
  private newState: any;

  constructor(canvas: fabric.Canvas, object: fabric.Object, previousState: any, newState: any) {
    this.canvas = canvas;
    this.object = object;
    this.previousState = previousState;
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

  // private _captureState(object: fabric.Object): any {
  //   const state: any = {
  //     left: object.left,
  //     top: object.top,
  //     scaleX: object.scaleX,
  //     scaleY: object.scaleY,
  //     angle: object.angle,
  //     fill: object.fill,
  //     stroke: object.stroke,
  //     strokeWidth: object.strokeWidth,
  //   };
    
  //   // 对于文字对象，额外保存文字相关属性
  //   if (object.type === 'i-text' || object.type === 'text') {
  //     const textObject = object as any;
  //     state.text = textObject.text;
  //     state.fontSize = textObject.fontSize;
  //     state.fontFamily = textObject.fontFamily;
  //     state.fontWeight = textObject.fontWeight;
  //     state.fontStyle = textObject.fontStyle;
  //     state.textAlign = textObject.textAlign;
  //     state.textBackgroundColor = textObject.textBackgroundColor;
  //     state.charSpacing = textObject.charSpacing;
  //     state.lineHeight = textObject.lineHeight;
  //   }
    
  //   return state;
  // }

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
  private undoRedoManager: UndoRedoManager;
  private previousUndoStack: Command[];
  private previousRedoStack: Command[];

  constructor(canvas: fabric.Canvas, undoRedoManager: UndoRedoManager) {
    this.canvas = canvas;
    this.undoRedoManager = undoRedoManager;
    this.previousObjects = [...canvas.getObjects()];
    this.previousBackgroundColor = canvas.backgroundColor as string;
    
    // 保存当前的历史栈状态
    this.previousUndoStack = [...undoRedoManager['undoStack']];
    this.previousRedoStack = [...undoRedoManager['redoStack']];
  }

  execute(): void {
    this.canvas.clear();
    this.canvas.backgroundColor = '#ffffff';
    this.canvas.renderAll();
  }

  undo(): void {
    // 标记为撤销操作，避免触发事件监听器
    this.undoRedoManager._markAsUndoRedoOperation();
    
    this.canvas.backgroundColor = this.previousBackgroundColor || '#ffffff';
    
    // 直接添加对象到画布，按照原始顺序
    // 这样确保撤销时能按照正确的顺序恢复
    this.previousObjects.forEach(obj => {
      this.canvas.add(obj);
    });
    
    this.canvas.renderAll();
    
    // 恢复之前的历史栈状态
    this.undoRedoManager['undoStack'] = this.previousUndoStack;
    this.undoRedoManager['redoStack'] = this.previousRedoStack;
    
    // 取消标记
    this.undoRedoManager._unmarkAsUndoRedoOperation();
  }
}

// 撤销/重做管理器
class UndoRedoManager {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  private canvas: fabric.Canvas | null = null;
  private maxHistorySize: number = 50; // 最大历史记录数量
  private objectStates: Map<fabric.Object, any> = new Map(); // 缓存对象状态

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
        const command = new AddObjectCommand(this.canvas!, e.target, this);
        this.undoStack.push(command);
        
        // 限制历史记录大小
        if (this.undoStack.length > this.maxHistorySize) {
          this.undoStack.shift();
        }
        
        // 只在非撤销/重做操作时清空重做栈
        this.redoStack = [];
      }
    });

    // 监听对象移除
    this.canvas.on('object:removed', (e) => {
      // 避免在撤销/重做操作时重复记录
      if (e.target && !this._isUndoRedoOperation) {
        const command = new RemoveObjectCommand(this.canvas!, e.target, this);
        this.undoStack.push(command);
        
        // 限制历史记录大小
        if (this.undoStack.length > this.maxHistorySize) {
          this.undoStack.shift();
        }
        
        // 只在非撤销/重做操作时清空重做栈
        this.redoStack = [];
      }
    });

    // 监听对象修改前事件（鼠标按下时）
    this.canvas.on('mouse:down', (e) => {
      if (e.target && !this._isUndoRedoOperation) {
        // 保存操作前的状态
        const previousState = this._captureCurrentState(e.target);
        this.objectStates.set(e.target, previousState);
      }
    });

    // 监听文字编辑开始事件
    this.canvas.on('text:editing:entered', (e) => {
      if (e.target && !this._isUndoRedoOperation) {
        // 保存编辑前的状态
        const previousState = this._captureCurrentState(e.target);
        this.objectStates.set(e.target, previousState);
      }
    });

    // 监听对象修改
    this.canvas.on('object:modified', (e) => {
      // 避免在撤销/重做操作时重复记录
      if (e.target && !this._isUndoRedoOperation) {
        const previousState = this.objectStates.get(e.target);
        const currentState = this._captureCurrentState(e.target);
        
        // 如果没有保存的前置状态，说明不是通过鼠标操作触发的修改，跳过
        if (!previousState) {
          return;
        }
        
        const command = new ModifyObjectCommand(this.canvas!, e.target, previousState, currentState);
        this.undoStack.push(command);
        
        // 清除缓存的状态
        this.objectStates.delete(e.target);
        
        // 限制历史记录大小
        if (this.undoStack.length > this.maxHistorySize) {
          this.undoStack.shift();
        }
        
        // 只在非撤销/重做操作时清空重做栈
        this.redoStack = [];
      }
    });
  }

  // 标记是否为撤销/重做操作
  private _isUndoRedoOperation: boolean = false;

  // 标记为撤销/重做操作的公共方法
  _markAsUndoRedoOperation(): void {
    this._isUndoRedoOperation = true;
  }

  // 取消撤销/重做操作标记的公共方法
  _unmarkAsUndoRedoOperation(): void {
    this._isUndoRedoOperation = false;
  }

  // 捕获当前对象状态（公共方法）
  private _captureCurrentState(object: fabric.Object): any {
    const state: any = {
      left: object.left,
      top: object.top,
      scaleX: object.scaleX,
      scaleY: object.scaleY,
      angle: object.angle,
      fill: object.fill,
      stroke: object.stroke,
      strokeWidth: object.strokeWidth,
    };
    
    // 对于文字对象，额外保存文字相关属性
    if (object.type === 'i-text' || object.type === 'text') {
      const textObject = object as any;
      state.text = textObject.text;
      state.fontSize = textObject.fontSize;
      state.fontFamily = textObject.fontFamily;
      state.fontWeight = textObject.fontWeight;
      state.fontStyle = textObject.fontStyle;
      state.textAlign = textObject.textAlign;
      state.textBackgroundColor = textObject.textBackgroundColor;
      state.charSpacing = textObject.charSpacing;
      state.lineHeight = textObject.lineHeight;
    }
    
    return state;
  }

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
    
    const command = new ClearCanvasCommand(this.canvas, this);
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
