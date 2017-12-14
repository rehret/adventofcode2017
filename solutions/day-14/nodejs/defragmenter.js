'use strict';

const { KnotHash } = require('../../day-10/nodejs/knot-hash');

module.exports.Defragmenter = class Defragmenter {
    /**
     * @param {string} memoryKey
     * @returns {boolean[][]}
     */
    static GetMemoryState(memoryKey) {
        /** @type {boolean[][]} */
        const memory = [];

        for (let i = 0; i < 128; i++) {
            const memoryLine = KnotHash.Hash(`${memoryKey}-${i}`).split('').map(val => parseInt(val, 16)).map(int => int.toString(2)).join('').split('');
            const arr = [];
            for (let bit of memoryLine) {
                arr.push(bit === '1');
            }
            memory.push(arr);
        }

        return memory;
    }
};