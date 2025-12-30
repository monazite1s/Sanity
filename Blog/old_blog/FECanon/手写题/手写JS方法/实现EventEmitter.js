/**
 * EventEmitter 事件发射器类
 * 实现观察者模式，用于管理事件监听和触发
 */
class EventEmitter {
    /**
     * 构造函数
     * 初始化事件存储对象
     */
    constructor() {
        // 存储所有事件及其对应的处理器数组
        this.events = {}
    }

    /**
     * 添加事件监听器
     * @param {string} event - 事件名称
     * @param {Function} handler - 事件处理器函数
     */
    on(event, handler) {
        // 检查事件是否已存在
        if (this.events[event]) {
            // 如果存在，将新的处理器添加到数组中
            this.events[event].push(handler)
        } else {
            // 如果不存在，创建新的事件数组
            this.events[event] = [handler]
        }
    }

    /**
     * 触发事件
     * @param {string} event - 要触发的事件名称
     * @param {...any} args - 传递给事件处理器的参数
     */
    emit(event, ...args) {
        // 获取该事件的所有处理器
        const handlers = this.events[event]

        // 如果存在处理器且数组不为空
        if (handlers && handlers.length > 0) {
            // 遍历所有处理器并执行，传递参数
            handlers.forEach(handler => handler(...args))
        }
    }

    /**
     * 移除事件监听器
     * @param {string} event - 事件名称
     * @param {Function} handler - 要移除的处理器函数
     */
    off(event, handler) {
        // 获取该事件的所有处理器
        const handlers = this.events[event]

        // 如果事件不存在或没有处理器，直接返回
        if (!handlers || handlers.length === 0) {
            return
        }

        // 过滤掉要移除的处理器
        this.events[event] = handlers.filter(h => h !== handler)
    }
}

// 导出EventEmitter类
module.exports = EventEmitter