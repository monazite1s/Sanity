/**
 * 设线性表 L = (a1, a2, a3, ..., an-2, an-1, an) 采用带头结点的单链表存储，
 * 链表结点的结构为：
 * typedef struct node {
 *     int data;
 *     struct node *next;
 * } NODE;
 * 
 * 设计算法将 L 中的结点重新排列得到新的线性表：
 * L' = (a1, an, a2, an-1, a3, an-2, ...)
 * 
 * 要求：
 * 1. 算法的空间复杂度为 O(1)
 * 2. 算法的时间复杂度尽可能高效
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reorderList = function (head) {
    // TODO: 请在此处实现你的算法
    if (!head || !head.next) return head;
    let slow = head.next, fast = head.next, prev = null;
    while (fast && fast.next) {
        prev = slow;
        slow = slow.next;
        fast = fast.next.next;
    }
    prev.next = null; // 切断前半部分链表

    let head2 = reverseList(slow);
    let cur = head;

    // 交叉合并两个链表
    while (head2) {
        let next1 = cur.next;
        let next2 = head2.next;
        cur.next = head2;
        head2.next = next1;
        cur = next1;
        head2 = next2;
    }

    return head;
};

function reverseList(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        const nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}

// 辅助函数：创建链表（用于测试）
function createList(arr) {
    if (arr.length === 0) return null;
    let head = new ListNode(arr[0]);
    let curr = head;
    for (let i = 1; i < arr.length; i++) {
        curr.next = new ListNode(arr[i]);
        curr = curr.next;
    }
    return head;
}

// 辅助函数：链表转数组（用于测试）
function listToArray(head) {
    let arr = [];
    let curr = head;
    while (curr) {
        arr.push(curr.val);
        curr = curr.next;
    }
    return arr;
}

// 链表节点构造函数
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
}

// 测试用例（取消注释以运行测试）
// let head = createList([1, 2, 3, 4, 5]);
// reorderList(head);
// console.log(listToArray(head)); // 期望输出：[1, 5, 2, 4, 3]
//
// let head2 = createList([1, 2, 3, 4]);
// reorderList(head2);
// console.log(listToArray(head2)); // 期望输出：[1, 4, 2, 3]