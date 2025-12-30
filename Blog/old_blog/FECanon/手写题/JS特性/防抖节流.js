// 防抖函数 
// 把触发非常频繁的事件合并成一次执行，在指定时间内只执行一次回调函数
// 如果在指定时间内又触发了时间，回调函数的执行时间重新开始计算
// 也就是说，防抖是将多次执行 变为 只执行最后一次
function debounce(func, wait) {
    // 创建定时器标签
    let timer;
    // 使用闭包， ...args为函数参数
    return function (...args) {
        // 有定时器说明时间间隔没有到就触发了事件，重新定时
        if (timer) {
            clearTimeout(timer);
        }
        // 定时
        timer = setTimeout(() => {
            func.apply(this, args)
        }, wait)
    }
}

const newDebounceFunc = debounce(() => { console.log(123); }, 1000)
newDebounceFunc()
newDebounceFunc()
newDebounceFunc()
// setInterval(newDebounceFunc, 2000)


// 节流 触发事件的时间间隔大于等于指定时间才会执行回调函数
// 也就是说，节流是按照一段时间的间隔来进行触发

// 节流的定时器实现，第一次不执行，delay一段时间后执行，最后一次触发会丢失
function throttle(func, wait) {
    let timer

    return function (...args) {
        // 有 timer 说明时间间隔还没到
        if (timer) return

        timer = setTimeout(() => {
            func.apply(this, args)

            // 由于是基于计时器的实现，所以每次执行回调后需要将计时器回收
            timer = null
        }, wait)
    }
}

// 节流的时间戳实现， 首次直接执行，wait时间间隔内的后续调用会被忽略
function throttle2(func, wait) {
    let lastTime = 0

    return function (...args) {
        const now = Date.now()
        if (now - lastTime >= wait) {
            func.apply(this, args)
            lastTime = now
        }
    }
}

function runTest() {
    console.log("🚀 测试开始", new Date().toLocaleTimeString());

    let throttleIndex = 1;  // 计数器
    let throttle2Index = 1; // 计数器

    function logThrottle() {
        console.log(`📌 throttle 第 ${throttleIndex++} 次执行，时间:`, new Date().toLocaleTimeString());
    }

    function logThrottle2() {
        console.log(`📌 throttle2 第 ${throttle2Index++} 次执行，时间:`, new Date().toLocaleTimeString());
    }

    // 定时器实现
    const throttleFunc = throttle(logThrottle, 2000);
    // 时间戳实现
    const throttleFunc2 = throttle2(logThrottle2, 2000);

    console.log("\n🎯 测试基于定时器的节流 throttle：");
    setTimeout(throttleFunc, 0);   // 0ms 调用
    setTimeout(throttleFunc, 500); // 500ms 调用（会被忽略）
    setTimeout(throttleFunc, 1000); // 1000ms 调用（会被忽略）
    setTimeout(throttleFunc, 2500); // 2500ms 调用（会执行）
    setTimeout(throttleFunc, 3000); // 3000ms 调用（会被忽略）
    setTimeout(throttleFunc, 5000); // 5000ms 调用（会执行）

    console.log("\n🎯 测试基于时间戳的节流 throttle2：");
    setTimeout(throttleFunc2, 0);   // 0ms 调用（会立即执行）
    setTimeout(throttleFunc2, 500); // 500ms 调用（会被忽略）
    setTimeout(throttleFunc2, 1000); // 1000ms 调用（会被忽略）
    setTimeout(throttleFunc2, 2500); // 2500ms 调用（会执行）
    setTimeout(throttleFunc2, 3000); // 3000ms 调用（会被忽略）
    setTimeout(throttleFunc2, 5000); // 5000ms 调用（会执行）
}

runTest();
