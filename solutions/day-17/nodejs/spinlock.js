'use strict';

module.exports.Spinlock = class Spinlock {
    /**
     * @param {number} stepSize
     * @param {number} iterations
     * @param {(lastNodeInserted: Node, zeroNode: Node) => void} callback
     * @returns {Node}
     */
    static GetCircularBuffer(stepSize, iterations, callback = null) {
        const zeroNode = new Node(0);
        let currentNode = zeroNode;
        let tempNode = null;
        for (let iteration = 1; iteration <= iterations; iteration++) {
            for (let step = 0; step < stepSize; step++) {
                currentNode = currentNode.next;
            }
            tempNode = new Node(iteration);
            tempNode.next = currentNode.next;
            currentNode.next = tempNode;
            currentNode = tempNode;
        }

        if (typeof callback === 'function') {
            callback(currentNode, zeroNode);
        }

        return zeroNode;
    }
};

class Node {
    /**
     * @param {number} value
     */
    constructor(value) {
        this.value = value;
        this.next = this;
    }
}