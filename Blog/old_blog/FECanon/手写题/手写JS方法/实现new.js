/* 
    new 四大步骤
    1. 创建一个新的空对象
    2. 将空对象的隐式原型指向构造函数的显式原型
    3. 将构造函数的 this 指向新的空对象，执行语句
    4. 如果 return 一个非原始值，采用 return ，否则返回空对象
*/

function myNew(constructor, ...args) {
    // 1. 创建一个新的空对象
    // 2. 由于Object.create会返回一个继承自参数对象的新对象，所以原型链也是对的
    const newObj = Object.create(constructor.prototype)

    // 3. this指向 + 构造函数
    let res = constructor.apply(newObj, args)

    // 4. 如果构造函数返回非原始值（对象），则返回构造函数返回的值；否则返回 newObj
    return typeof res === 'object' ? res : newObj
}

function Person(name, age) {
    this.name = name;
    this.age = age;
}

const p1 = myNew(Person, 'Alice', 25);
console.log(p1 instanceof Person); // true
console.log(p1.name); // Alice
console.log(p1.age); // 25

// 返回对象的构造函数
function Animal(name) {
    this.name = name;
    return { name: 'Cat' };
}

const animal1 = myNew(Animal, 'Dog');
console.log(animal1.name); // Cat (constructor returned an object)

// 返回原始类型的构造函数
function Simple(name) {
    this.name = name;
    return 'Hello'; // 返回原始类型
}

const simple1 = myNew(Simple, 'Test');
console.log(simple1.name); // Test (constructor returned a primitive type)
console.log(simple1 instanceof Simple); // true

// 没有返回值的构造函数
function NoReturn(name) {
    this.name = name;
}

const noReturn1 = myNew(NoReturn, 'NoReturn');
console.log(noReturn1.name); // NoReturn
console.log(noReturn1 instanceof NoReturn); // true
