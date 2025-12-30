class DeListNode {
    key: number;
    val: number;
    prev: DeListNode | null;
    next: DeListNode | null;

    constructor(key: number, val: number) {
        this.key = key;
        this.val = val;
        this.prev = null;
        this.next = null;
    }
}

class Dequeue {
    head: DeListNode;
    tail: DeListNode;

    constructor() {
        this.head = new DeListNode(0, 0); // 哨兵
        this.tail = new DeListNode(0, 0);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    put(node: DeListNode) {
        // 插入尾部
        node.prev = this.tail.prev;
        node.next = this.tail;
        this.tail.prev!.next = node;
        this.tail.prev = node;
    }

    delete(node: DeListNode) {
        node.prev!.next = node.next;
        node.next!.prev = node.prev;
    }

    moveToTail(node: DeListNode) {
        // 移动节点到尾部
        this.delete(node);
        this.put(node);
    }

    popFront(): DeListNode | null {
        if (this.head.next === this.tail) return null;
        const node = this.head.next!;
        this.delete(node);
        return node;
    }
}

class LRUCache {
    capacity: number;
    hashMap: Map<number, DeListNode>;
    deQue: Dequeue;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.hashMap = new Map();
        this.deQue = new Dequeue();
        this.capacity = capacity;
    }

    get(key: number): number {
        const node = this.hashMap.get(key);
        if (!node) return -1;
        this.deQue.moveToTail(node); // 直接移动到尾部
        return node.val;
    }

    put(key: number, value: number): void {
        let node = this.hashMap.get(key);
        if (node) {
            node.val = value;
            this.deQue.moveToTail(node);
        } else {
            node = new DeListNode(key, value);
            this.hashMap.set(key, node);
            this.deQue.put(node);

            if (this.hashMap.size > this.capacity) {
                const oldest = this.deQue.popFront();
                if (oldest) this.hashMap.delete(oldest.key);
            }
        }
    }
}
