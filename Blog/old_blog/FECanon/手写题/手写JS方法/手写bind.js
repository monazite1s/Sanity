/**
 * 改变this指向，一共有call/bind/apply三个方法
 * 其中，bind返回一个函数，call/apply直接进行方法调用
 * call和bind接受一个 context 和 n 个参数，apply 接收一个 context 和包含所有参数的数组
 */

/*
    bind 方法的步骤：
    1. 返回一个新的函数。
    2. 新函数在调用时，绑定 `this` 指向传入的对象（第一个参数）。
    3. 后续传入的参数与被绑定函数的参数合并，在新函数执行时传入。
    4. 新函数执行时的 `this` 会始终指向绑定的对象。
*/

// bind 一旦绑定了 this，就再也无法修改。
// 多次 bind 只会生效第一次。
// 后续的 bind、call、apply 都无法改变 this。
// 可以用多次 bind 来 逐步绑定参数，但 this 不变。

Function.prototype.myBind = function (context, ...args) {
    if (typeof this !== "function") {
        throw new TypeError("myBind must be called on a function");
    }

    const self = this; // 保存原函数
    function boundFunction(...innerArgs) {
        return self.apply(
            this instanceof boundFunction ? this : context,
            [...args, ...innerArgs]
        );
    }

    // 维护原型链，确保 new 绑定后的函数仍然可以继承原函数的原型
    boundFunction.prototype = Object.create(self.prototype);

    return boundFunction;
};

function sayHello(age, hobby) {
    console.log(`Hello, my name is ${this.name}, I'm ${age} years old and I like ${hobby}.`);
}

console.log(Object.prototype.toString.call([])); // [object Function]

// 测试普通绑定
// const person = { name: "Alice" };
// const boundFn = sayHello.myBind(person, 25);
// boundFn("coding"); 