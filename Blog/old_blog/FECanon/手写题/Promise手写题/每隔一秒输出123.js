const arr = [1, 2, 3]
arr.reduce((pre, cur) => {
    return pre.then(() => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(cur);
                resolve()
            }, 1000)
        })
    })
}, Promise.resolve())