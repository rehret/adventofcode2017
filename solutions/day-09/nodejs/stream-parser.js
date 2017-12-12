'use strict';

module.exports.StreamParser = class StreamParser {
    /**
     * @param {string | object} input
     * @param {function?} garbageCallback
     * @returns {StreamNode}
     */
    static parse(input, garbageCallback = null) {
        if (typeof input === 'object') {
            const options = input;
            input = options.input;
            garbageCallback = options.garbageCallback;
        }

        const chars = input.split('');
        let parsingGarbage = false;
        const garbage = [];
        let currentNode = null;

        for (let i = 0; i < chars.length; i++) {
            if (!parsingGarbage) {
                switch (chars[i]) {
                case '{':
                    const child = new StreamNode();
                    child.parent = currentNode;
                    if (currentNode) {
                        currentNode.children.push(child);
                    }
                    currentNode = child;
                    break;
                case '}':
                    currentNode = currentNode && currentNode.parent ? currentNode.parent : currentNode;
                    break;
                case '<':
                    parsingGarbage = true;
                    break;
                }
            } else {
                switch (chars[i]) {
                case '!':
                    i++;
                    break;
                case '>':
                    parsingGarbage = false;
                    break;
                default:
                    garbage.push(chars[i]);
                    break;
                }
            }
        }

        if (typeof garbageCallback === 'function') {
            garbageCallback(garbage);
        }

        return currentNode;
    }
};

class StreamNode {
    constructor() {
        this.parent = null;
        this.children = [];
    }
}