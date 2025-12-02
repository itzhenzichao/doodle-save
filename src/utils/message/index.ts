// 导入 Ant Design 的 message 组件和类型
import { message } from 'antd';
import type { ArgsProps, ConfigOptions } from 'antd/es/message/interface';

// 全局配置：统一设置所有消息的默认行为（可选，根据需求调整）
const messageConfig: ConfigOptions = {
  top: 10, // 消息距离顶部的距离（px）
  duration: 3, // 默认显示时长（秒），0 表示不自动关闭
  maxCount: 3, // 最多同时显示 3 条消息
  // 可添加其他全局配置，如 prefixCls（自定义类名）等
};

// 初始化 message 配置（应用全局配置）
message.config(messageConfig);

// 定义消息类型的快捷方法（支持 success/error/info/warning/loading）
const Msg = {
  /** 成功消息 */
  success: (content: string, options?: Omit<ArgsProps, 'content'>) => {
    return message.success({ content, ...options });
  },
  /** 错误消息 */
  error: (content: string, options?: Omit<ArgsProps, 'content'>) => {
    return message.error({ content, ...options });
  },
  /** 信息提示 */
  info: (content: string, options?: Omit<ArgsProps, 'content'>) => {
    return message.info({ content, ...options });
  },
  /** 警告消息 */
  warning: (content: string, options?: Omit<ArgsProps, 'content'>) => {
    return message.warning({ content, ...options });
  },
  /** 加载中消息（需手动关闭） */
  loading: (content: string, options?: Omit<ArgsProps, 'content'>) => {
    return message.loading({ content, duration: 0, ...options }); // 加载中默认不自动关闭
  },
  /** 手动关闭所有消息（可选） */
  destroy: () => {
    message.destroy();
  },
};

export default Msg;