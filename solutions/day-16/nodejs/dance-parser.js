'use strict';

module.exports.DanceParser = class DanceParser {
    /**
     * @param {string} input
     */
    static GetPositionsAfterDance(input) {
        /** @type {string[]} */
        let arr = [];
        for (let i = 0; i < 16; i++) {
            arr.push(String.fromCharCode(i + 97));
        }

        const moves = input.split(/,/);

        const spinRegex = /s(\d+)+/;
        const swapRegex = /x(\d+)\/(\d+)/;
        const partnerRegex = /p(\w+)\/(\w+)/;

        for(let move of moves) {
            if (spinRegex.test(move)) {
                const matches = move.match(spinRegex);
                arr = arr.splice(arr.length - parseInt(matches[1])).concat(arr);
            } else if (swapRegex.test(move)) {
                const matches = move.match(swapRegex);
                const index1 = parseInt(matches[1]);
                const index2 = parseInt(matches[2]);
                swap(arr, index1, index2);
            } else if (partnerRegex.test(move)) {
                const matches = move.match(partnerRegex);
                const index1 = arr.indexOf(matches[1]);
                const index2 = arr.indexOf(matches[2]);
                swap(arr, index1, index2);
            } else {
                throw new Error('Unrecognized move');
            }
        }

        return arr;
    }
};

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