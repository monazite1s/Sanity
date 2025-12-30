class RandomizedSet {
    hash
    nums

    constructor() {
        this.hash = new Map()
        this.nums = []
    }

    insert(val) {
        console.log(this.hash)
        console.log(this.hash.get('2'));          // 输出 0
        console.log([...this.hash.entries()]);  // 输出 [[2, 0]]
        if (!this.hash.has(val)) {
            this.nums.push(val)
            this.hash.set(val, this.nums.length - 1)
            return true
        }
        return false
    }

    remove(val) {
        if (!this.hash.has(val)) {
            return false
        }
        let id = this.hash.get(val)
        this.hash.set(this.nums[this.nums.length - 1], id)
        // [this.nums[id], this.nums[this.nums.length - 1]] = [this.nums[this.nums.length - 1], this.nums[id]]
        this.nums[id] = this.nums[this.nums.length - 1]
        this.nums.pop()
        this.hash.delete(val)
        return true
    }

    getRandom() {
        const randomIndex = Math.floor(Math.random() * this.nums.length);
        return this.nums[randomIndex];
    }
}

/**
 * Your RandomizedSet object will be instantiated and called as such:
 * var obj = new RandomizedSet()
 * var param_1 = obj.insert(val)
 * var param_2 = obj.remove(val)
 * var param_3 = obj.getRandom()
 */

// 测试用例
const operations = ["RandomizedSet", "insert", "remove", "insert", "getRandom", "remove", "insert", "getRandom"];
const params = [[], [1], [2], [2], [], [1], [2], []];

let obj = null;
const results = [];

for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const arg = params[i];

    switch (op) {
        case "RandomizedSet":
            obj = new RandomizedSet();
            break;
        case "insert":
            const insertRes = obj.insert(arg[0]);
            break;
        case "remove":
            const removeRes = obj.remove(arg[0]);
            break;
        case "getRandom":
            const randomRes = obj.getRandom();
            break;
        default:
            break;
    }
}
