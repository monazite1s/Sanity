// instanceof 判断一个对象是否属于某个类的实例
// 本质上是判断对象的原型链上是否有类的 prototype。

function myInstanceOf(left, right) {
    if (typeof left !== 'object' || left === null) return false
    // 获取右边参数的原型链
    const prototype = right.prototype

    // 找到Object的基类null，找到顶了，退出
    while (left !== null) {
        // 在left的原型链上找到了
        if (Object.getPrototypeOf(left) === prototype) {
            return true
        }
        left = Object.getPrototypeOf(left)
    }
    return false
}

console.log(myInstanceOf([], Array));
console.log(myInstanceOf({}, Object));
console.log(myInstanceOf('', Array));
console.log(myInstanceOf(null, Object));

function Person() { }
const person = new Person();

console.log(myInstanceOf(person, Person));  // true
console.log(myInstanceOf(person, Object));  // true
console.log(myInstanceOf(person, Array));   // false
