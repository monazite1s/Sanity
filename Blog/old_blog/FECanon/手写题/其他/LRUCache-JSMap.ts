class LRUCache_JSMap {
    capacity: number
    hashMap: Map<number, number>
    constructor(capacity: number) {
        this.capacity = capacity
        this.hashMap = new Map()
    }

    get(key: number): number {
        if (!this.hashMap.has(key)) return -1;
        const val = this.hashMap.get(key)
        this.put(key, val!)
        return val!;
    }

    put(key: number, value: number): void {
        if (this.hashMap.has(key)) {
            this.hashMap.delete(key)
        }
        this.hashMap.set(key, value)
        if (this.hashMap.size > this.capacity) {
            const iterator = this.hashMap[Symbol.iterator]();
            this.hashMap.delete(iterator.next().value[0])
        }
    }
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */