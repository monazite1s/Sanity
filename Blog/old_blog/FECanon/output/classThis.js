let a = 123
class Class {
    a = 666
    constructor(params) {
        console.log(a);
        console.log(this.a);
    }
}

const cls = new Class()