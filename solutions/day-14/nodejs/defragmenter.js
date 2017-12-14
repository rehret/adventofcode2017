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
            const memoryLine = KnotHash.Hash(`${memoryKey}-${i}`)
                .split('')
                .map(val => parseInt(val, 16))
                .map(int => {
                    let binary = int.toString(2);
                    while (binary.length < 4) {
                        binary = '0' + binary;
                    }
                    return binary;
                })
                .join('')
                .split('');
            const arr = [];
            for (let bit of memoryLine) {
                arr.push(bit === '1');
            }
            memory.push(arr);
        }

        return memory;
    }

    /**
     * @param {string} memoryKey
     */
    static GetBlocks(memoryKey) {
        const memory = Defragmenter.GetMemoryState(memoryKey);
        const cells = memory.map((row, y) => row.map((bit, x) => new MemoryCell(x, y, bit))).reduce((arr, row) => arr.concat(row), []);
        const blocks = [];

        cells.forEach((cell, index, arr) => {
            const block = getBlockContainingCell(cell, arr);
            if (block !== null) {
                blocks.push(block);
            }
        });

        return blocks;
    }
};
/**
 * @param {MemoryCell} cell
 * @param {MemoryCell[]} memory
 */
function getBlockContainingCell(cell, memory) {
    if (cell.visited) {
        return null;
    }

    cell.visited = true;

    if (!cell.bit) {
        return null;
    }

    let blocks = [cell];

    memory
        .filter(c => {
            return (
                (c.x === cell.x - 1 || c.x === cell.x + 1) ||
                (c.y === cell.y - 1 || c.y === cell.y + 1)
            ) && (c.x === cell.x || c.y === cell.y) &&
            !c.visited;
        })
        .map(neighbor => {
            return getBlockContainingCell(neighbor, memory);
        })
        .forEach(returnedBlocks => {
            if (returnedBlocks !== null) {
                blocks = blocks.concat(returnedBlocks);
            }
        });

    return blocks;
}

class MemoryCell {
    /**
     * @param {number} x
     * @param {number} y
     * @param {boolean} bit
     */
    constructor(x, y, bit) {
        this.x = x;
        this.y = y;
        this.bit = bit;
        this.visited = false;
    }
}