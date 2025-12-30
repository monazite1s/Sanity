Object.is = function (x, y) {
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y
    } else {
        return x !== x && y !== y
    }
}

console.log(Object.is(NaN, NaN))
console.log(Object.is(-0, 0))

let a = 1, b = 1, c = '1'

console.log(Object.is(a, b))
console.log(Object.is(a, c))