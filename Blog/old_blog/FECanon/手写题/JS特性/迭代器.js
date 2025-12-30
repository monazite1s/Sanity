a = [1, 2, 3, 4, 5]

let iter = a[Symbol.iterator]()
for (let i of iter) {
    console.log(i);
    if (i > 2) {
        break
    }
}

for (let i of iter) {
    console.log(i);
}