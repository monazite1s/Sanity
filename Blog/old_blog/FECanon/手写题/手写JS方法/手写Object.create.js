// Object.create 的作用是创建一个新对象，并将其原型设置为指定的对象。

function myObjectCreate(proto) {
    if (typeof proto !== 'object' && typeof proto !== 'function') {
        throw new TypeError('Object prototype may only be an Object or null');
    }

    function F() { }  // 创建一个空的构造函数
    F.prototype = proto;  // 让 F 的原型指向传入的 proto
    return new F();  // 返回 F 的实例，该实例的原型即 proto
}

const obj = { name: "test" };
const newObj = myObjectCreate(obj);

console.log(newObj.name); // test
console.log(Object.getPrototypeOf(newObj) === obj); // true
