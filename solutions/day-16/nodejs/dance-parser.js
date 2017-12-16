'use strict';

module.exports.DanceParser = class DanceParser {
    /**
     * @param {string} input
     * @returns {string[]}
     */
    static GetPositionsAfterOneSet(input) {
        const moves = parse(input);
        const arr = generateStartingArray();

        processDanceMovesOnArray(moves, arr);

        return arr;
    }

    /**
     * @param {string} input
     * @returns {string[]}
     */
    static GetPositionsAfterFullDance(input) {
        const arr = generateStartingArray();
        const moves = parse(input);

        for (let i = 0; i < 1000000000; i++) {
            processDanceMovesOnArray(moves, arr);
        }

        return arr;
    }
};

/**
 * @param {Move[]} moves
 * @param {string[]} arr
 */
function processDanceMovesOnArray(moves, arr) {
    for(let move of moves) {
        if (move.type === 'spin') {
            arr.unshift(...arr.splice(arr.length - parseInt(move.param1)));
        } else if (move.type === 'swap') {
            swap(arr, parseInt(move.param1), parseInt(move.param2));
        } else if (move.type === 'partner') {
            swap(arr, arr.indexOf(move.param1), arr.indexOf(move.param2));
        }
    }
}

class Move {
    /**
     * @param {('spin' | 'swap' | 'partner')} type
     * @param {string} param1
     * @param {string?} param2
     */
    constructor(type, param1, param2 = null) {
        this.type = type;
        this.param1 = param1;
        this.param2 = param2;
    }
}

/**
 * @param {string} input
 * @returns {Move[]}
 */
function parse(input) {
    /** @type {Move[]} */
    const moves = [];
    const inputArr = input.split(/,/);

    const spinRegex = /s(\d+)+/;
    const swapRegex = /x(\d+)\/(\d+)/;
    const partnerRegex = /p(\w+)\/(\w+)/;

    for (let line of inputArr) {
        if (spinRegex.test(line)) {
            const matches = line.match(spinRegex);
            moves.push(new Move('spin', matches[1]));
        } else if (swapRegex.test(line)) {
            const matches = line.match(swapRegex);
            moves.push(new Move('swap', matches[1], matches[2]));
        } else if (partnerRegex.test(line)) {
            const matches = line.match(partnerRegex);
            moves.push(new Move('partner', matches[1], matches[2]));
        } else {
            throw new Error('Unrecognized move');
        }
    }

    return moves;
}

/**
 * @returns {string[]}
 */
function generateStartingArray() {
    let arr = [];
    for (let i = 0; i < 16; i++) {
        arr.push(getCharacterFromIndex(i));
    }
    return arr;
}

/**
 * @param {any[]} arr
 * @param {number} index1
 * @param {number} index2
 */
function swap(arr, index1, index2) {
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
}

/**
 * @param {number} index
 * @returns {string}
 */
function getCharacterFromIndex(index) {
    return String.fromCharCode(index + 97);
}
