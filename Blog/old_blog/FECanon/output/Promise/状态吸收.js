console.log('start');
Promise.resolve()
    .then(() => {
        console.log(0);
        return Promise.resolve(4)
    })
    .then((res) => {
        console.log(res);
    });

Promise.resolve()
    .then(() => {
        console.log(1);
    })
    .then((res) => {
        console.log(2);
    })
    .then(() => {
        console.log(3);
    })
    .then(() => {
        console.log(5);
    })
    .then(() => {
        console.log(6);
    });



/*
首先同步执行代码后，微任务队列中会有两个任务，[() => {
    console.log(0);
    p4 = new Promise.resolve(4);
    return p4;
}, () => {
    console.log(1);
}]
取出第一个执行后，由于p0需要获取到p4的结果作为p0的结果，所以会将p0的resolve函数放入p4的回调中，由于p4本身已经resolve了，所以立刻追加到微任务队列末，此时微任务队列如下，[() => {
    console.log(1);
}, (p4.then(p0Resolve, p0Reject))]
继续执行微任务队列，p1的then方法会返回一个新的Promise，此时微任务队列如下，[(p4.then(p0Resolve, p0Reject)), () => {
    console.log(2);
}]
接着执行微任务队列，p4是resolve的所以将p0Resolve加入了微任务队列，此时微任务队列如下，[() => {
    console.log(2);
}, p0Resolve]
接着执行p2的回调，将p3的回调加入微任务队列，此时微任务队列如下，[p0Resolve, () => {
    console.log(3);
}]
继续执行微任务队列，p0Resolve会将p0的状态改为resolve, 此时才将回调p放入微任务队列，此时微任务队列如下，[() => {
    console.log(3);
}, (res) => {
    console.log(res)
}]
后面就不用说了
*/