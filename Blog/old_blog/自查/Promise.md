**event loop它的执行顺序：**

- 一开始整个脚本作为一个宏任务执行
- 执行过程中同步代码直接执行，宏任务进入宏任务队列，微任务进入微任务队列
- 当前宏任务执行完出队，检查微任务列表，有则依次执行，直到全部执行完
- 执行浏览器UI线程的渲染工作
- 检查是否有Web Worker任务，有则执行
- 执行完本轮的宏任务，回到2，依此循环，直到宏任务和微任务队列都为空

**微任务包括**：`MutationObserver`、`Promise.then()`或`reject()`、`Promise`为基础开发的其它技术，比如`fetch API`、`V8`的垃圾回收过程、`Node`独有的`process.nextTick`。

**宏任务包括**：`script、script` 、`setTimeout`、`setInterval` 、`setImmediate` 、`I/O` 、`UI rendering`





### 1.2 + 1.3 Promise与resolve

#### 1.2

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve('success')
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);
```

- 从上至下，先遇到new Promise，执行其中的同步代码1
- 再遇到resolve('success')， 将promise的状态改为了resolved并且将值保存下来
- 继续执行同步代码2
- 跳出promise，往下执行，碰到promise.then这个微任务，将其加入微任务队列
- 执行同步代码4
- 本轮宏任务全部执行完毕，检查微任务队列，发现promise.then这个微任务且状态为resolved，执行它。

```text
1 2 4 3
```

#### 1.3

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);
```

- 和题目二相似，只不过在`promise`中并没有`resolve`或者`reject`
- 因此`promise.then`并不会执行，它只有在被改变了状态之后才会执行。

```js
1 2 4
```