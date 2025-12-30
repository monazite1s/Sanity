class Scheduler {
    constructor() {
        this.queue = []
        this.maxCount = 2
        this.runningCount = 0
    }
    add(promiseCreator) {
        this.queue.push(promiseCreator)
    }
    startTask() {
        for (let i = 0; i < this.maxCount; i++) {
            this.request()
        }
    }
    request() {
        if (this.queue.length === 0 || this.runningCount >= this.maxCount) {
            return
        }
        this.runningCount++
        const curPromise = this.queue.shift()
        curPromise().then(() => {
            this.runningCount--
            this.request()
        })

    }
}

const timeout = time => new Promise(resolve => {
    setTimeout(resolve, time);
})

const scheduler = new Scheduler();

const addTask = (time, order) => {
    scheduler.add(() => timeout(time).then(() => console.log(order)))
}

addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');

scheduler.startTask()
// output: 2 3 1 4
