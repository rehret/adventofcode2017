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
            arrayShift(arr, -position);
            arr = arr.splice(0, twistLengths[i]).reverse().concat(arr.splice(0));
            arrayShift(arr, position);
            position = (position + twistLengths[i] + skipSize++) % length;
        }

        return arr;
    }
};

/**
 * @param {any[]} arr
 * @param {number} distance
 */
function arrayShift(arr, distance) {
    for (let i = 0; i < Math.abs(distance); i++) {
        if (distance > 0) {
            arr.unshift(arr.pop());
        } else {
            arr.push(arr.shift());
        }
    }
}