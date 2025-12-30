function foo() {
    console.log(this.a);
}

const obj = {
    a: 2
}

function bar() {
    foo.call(obj)
}

bar()
foo.call(globalThis)
foo.call(obj)
bar.call(globalThis)