'use strict';

module.exports.KnotHash = class KnotHash {
    /**
     * @param {number[] | object} arr
     * @param {number[]?} twistLengths
     * @param {function?} callback
     * @param {object?} state
     */
    static Twist(arr, twistLengths = null, callback = null, state = null) {
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

    /**
     * @param {string} hashKey
     */
    static Hash(hashKey) {
        let arr = [];
        for (let i = 0; i < 256; i++) {
            arr.push(i);
        }

        const twistLengths = hashKey.split('').map(val => val.charCodeAt(0)).concat([17, 31, 73, 47, 23]);

        let state = {};

        for (let i = 0; i < 64; i++) {
            arr = KnotHash.Twist({
                arr: arr,
                twistLengths: twistLengths,
                callback: previousState => {
                    state = previousState;
                },
                state: state
            });
        }

        const groups = [];
        for (let i = 0; i < 16; i++) {
            groups.push(arr.splice(0, 16));
        }

        const values = groups.map(g => g.reduce((xor, val) => xor ^ val, 0));
        return values.reduce((str, val) => str + (val.toString(16).length === 1 ? '0' + val.toString(16) : val.toString(16)), '');
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