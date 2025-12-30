var name = "window";

var person = {
    name: "person",
    sayName: function () {
        console.log(this.name);
    }
};

// 1. 直接调用 sayName
person.sayName(); // 输出: "person"

// 2. 赋值给变量后调用
var b = person.sayName;
b(); // 输出: "window"，因为此时 `this` 指向全局对象（在浏览器环境下是 `window`，在 Node.js 是 `undefined`）

// 3. 使用括号调用
(person.sayName)(); // 输出: "person"，因为 `person.sayName` 仍然作为 `person` 的方法调用

// 4. 赋值表达式调用
(b = person.sayName)(); // 输出: "window"，因为 `b` 只是一个普通函数调用，`this` 指向 `window`
