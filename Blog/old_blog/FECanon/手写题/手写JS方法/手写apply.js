/**
 * 改变this指向，一共有call/bind/apply三个方法
 * 其中，bind返回一个函数，call/apply直接进行方法调用
 * call和bind接受一个obj和n个参数，apply接收一个obj和包含所有参数的数组
 */

/*
    apply 方法的步骤：
    1. 将第一个参数（obj）作为 this 的指向。
    2. 第二个参数是一个数组，包含调用目标函数时传递的所有参数。
    3. 将目标函数的 this 绑定为传入的对象（第一个参数）。
    4. 执行目标函数，并返回其结果。
*/

Function.prototype.myApply = function (context, args) {
    context = context || global

    const fnSymbol = Symbol()
    context[fnSymbol] = this

    let result = context[fnSymbol](...args)

    delete context[fnSymbol]

    return result
}

// 使用
function f(a, b) {
    console.log(a, b)
    console.log(this.name)
}
let obj = {
    name: '张三'
}
f.myApply(obj, [1, 2])
