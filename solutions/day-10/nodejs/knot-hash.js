'use strict';

module.exports.KnotHash = class KnotHash {
    /**
     * @param {number[] | object} arr
     * @param {number[]?} twistLengths
     * @param {function?} callback
     * @param {object?} state
     */
    static Hash(arr, twistLengths = null, callback = null, state = null) {
        if (!Array.isArray(arr)) {
            const options = arr;
            arr = options.arr;
            twistLengths = options.twistLengths;
            callback = options.callback;
            state = options.state;
        }

        state = state || {};

        state.position = state.position || 0;
        state.skipSize = state.skipSize || 0;

        for (let i = 0; i < twistLengths.length; i++) {
            arrayShift(arr, -state.position);
            arr = arr.splice(0, twistLengths[i]).reverse().concat(arr.splice(0));
            arrayShift(arr, state.position);
            state.position = (state.position + twistLengths[i] + state.skipSize++) % arr.length;
        }

        if (typeof callback === 'function') {
            callback(state);
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