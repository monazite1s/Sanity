// 浅拷贝
function shallowCopy(obj) {
    return { ...obj }
}

// 深拷贝
// 1. JSON API 实现，无法实现对函数、正则等特殊对象克隆，无法解决循环引用，
const newObj = JSON.parse(JSON.stringify({}))

// 2. 递归深拷贝
function deepClone(obj) {
    if (typeof obj !== 'object' || obj === null) return obj

    const copy = obj instanceof Array ? [] : {}

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepClone(obj[key])
        }
    }
    return copy
}

// 3. 处理函数、Date、正则对象
function deepCopyWithSpecialTypes(obj) {
    if (obj === null || typeof obj !== 'object') return obj;

    if (obj instanceof Date) {
        return new Date(obj);  // 对 Date 类型进行单独处理
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj);  // 对 RegExp 类型进行单独处理
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepCopyWithSpecialTypes(item));  // 数组深拷贝
    }

    const newObj = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = deepCopyWithSpecialTypes(obj[key]);  // 对每个属性进行深拷贝
        }
    }
    return newObj;
}

// 4. 处理循环引用
function deepCopyWithCycleCheck(obj, map = new WeakMap()) {
    // 如果是基本类型，直接返回
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // 如果 obj 是一个已经拷贝过的对象，直接返回
    if (map.has(obj)) {
        return map.get(obj);  // 返回已拷贝的对象（防止循环引用）
    }

    // 如果是数组，创建一个新数组
    if (Array.isArray(obj)) {
        const copyArr = [];
        map.set(obj, copyArr);  // 将当前数组标记为已拷贝
        obj.forEach((item, index) => {
            copyArr[index] = deepCopyWithCycleCheck(item, map);
        });
        return copyArr;
    }

    // 如果是对象（排除函数和其他特殊类型），创建一个新对象
    const copyObj = {};
    map.set(obj, copyObj);  // 将当前对象标记为已拷贝
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            copyObj[key] = deepCopyWithCycleCheck(obj[key], map);
        }
    }

    return copyObj;
}

const objA = { a: 1 };
const objB = { b: objA };
objA.c = objB;  // objA 和 objB 形成了循环引用

const copy = deepCopyWithCycleCheck(objA);

console.log(copy);
// 输出： { a: 1, c: { b: [Circular] } }
// 或者在浏览器中，你可以看到 Circular 形式表示

// 验证原始对象和拷贝对象是不同的引用
console.log(copy !== objA);  // true
console.log(copy.c !== objA.c);  // true
