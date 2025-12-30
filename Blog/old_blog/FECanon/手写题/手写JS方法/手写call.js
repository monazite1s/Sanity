/**
 * 改变this指向，一共有call/bind/apply三个方法
 * 其中，bind返回一个函数，call/apply 直接进行方法调用
 * call和bind接受一个 context 和 n 个参数，apply 接收一个 context 和包含所有参数的数组
 */

/*
    call 方法的步骤：
    1. 将第一个参数（context）作为 this 的指向。
    2. 将后续的所有参数作为调用函数的参数传递给目标函数。
    3. 如果目标函数是一个对象方法（即有 `this`），将 `this` 绑定为第一个参数。
    4. 执行目标函数，并返回其结果。
*/

Function.prototype.myCall = function (context, ...args) {
    // 1. 确认上下文
    context = context || global

    // 2. 使用 symbol 保证不会覆盖原有属性方法
    const fnSymbol = Symbol()
    // 3. this为当前调用call的函数，在指定上下文中定义这个函数
    context[fnSymbol] = this
    // 4. 调用
    let result = context[fnSymbol](args)
    // 5. 调用完了就清理掉
    delete context[fnSymbol]

    return result
}

console.log(Object.prototype.toString.myCall([]));