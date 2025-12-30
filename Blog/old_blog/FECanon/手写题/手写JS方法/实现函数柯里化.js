function curry(func) {

    return function curriedFunc(...args) {
        if (args.length >= func.length) {
            return func.apply(this, args)
        } else {
            return function (...args2) {
                return curriedFunc.apply(this, args.concat(args2))
            }
        }
    }

}

function multiFn(a, b, c) {
    return a * b * c;
}

var multi = curry(multiFn);

console.log(multi(2)(3)(4));
console.log(multi(2, 3, 4, 5));
console.log(multi(2)(3, 4));
console.log(multi(2, 3)(4));
