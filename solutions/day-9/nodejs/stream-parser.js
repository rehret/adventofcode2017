'use strict';

module.exports.StreamParser = class StreamParser {
    /**
     * @param {string} input
     * @returns {StreamNode}
     */
    static parse(input) {
        const chars = input.split('');
        let parsingGarbage = false;
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
                }
            }
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