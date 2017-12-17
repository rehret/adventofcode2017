'use strict';

module.exports.Spinlock = class Spinlock {
    /**
     * @param {number} stepSize
     * @param {(circularBuffer: number[], index: number) => void} callback
     */
    static GetCircularBuffer(stepSize, callback = null) {
        /** @type {number[]} */
        const circularBuffer = [0];
        let currentIndex = 0;
        for (let iterations = 1; iterations <= 2017; iterations++) {
            currentIndex = (currentIndex + stepSize + 1) % circularBuffer.length;
            circularBuffer.splice(currentIndex, 0, iterations);
        }

        if (typeof callback === 'function') {
            callback(circularBuffer, currentIndex);
        }

        return circularBuffer;
    }
};