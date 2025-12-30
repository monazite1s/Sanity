function isPromise(val) {
    return typeof val.then === 'function'; // (123).then => undefined
}

Promise.allSettled = function (promises) {
    return new Promise((resolve, reject) => {
        let arr = [];
        let times = 0;
        const setData = (index, data) => {
            arr[index] = data;
            if (++times === promises.length) {
                resolve(arr);
            }
            console.log('times', times)
        }

        for (let i = 0; i < promises.length; i++) {
            let current = promises[i];
            if (isPromise(current)) {
                current.then((data) => {
                    setData(i, { status: 'fulfilled', value: data });
                }, err => {
                    setData(i, { status: 'rejected', value: err })
                })
            } else {
                setData(i, { status: 'fulfilled', value: current })
            }
        }
    })
}
