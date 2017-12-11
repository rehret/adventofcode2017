'use strict';

module.exports.KnotHash = class KnotHash {
    /**
     * @param {number} length
     * @param {number[]} twistLengths
     */
    static Hash(length, twistLengths) {
        /** @type {number[]} */
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(i);
        }

        let position = 0;
        let skipSize = 0;

        for (let i = 0; i < twistLengths.length; i++) {
            for (let shiftCount = 0; shiftCount < position; shiftCount++) {
                arr.push(arr.shift());
            }

            const reverseSection = arr.splice(0, twistLengths[i]).reverse();
            const ignoreSection = arr.splice(0);

            arr = reverseSection.concat(ignoreSection);

            for (let shiftCount = 0; shiftCount < position; shiftCount++) {
                arr.unshift(arr.pop());
            }

            position = (position + twistLengths[i] + skipSize) % length;
            skipSize++;
        }

        return arr;
    }
};