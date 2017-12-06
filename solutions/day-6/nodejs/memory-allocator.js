"use strict";

module.exports.MemoryAllocator = class MemoryAllocator {
    static CatchInfiniteLoop(input) {
        if (typeof input === 'object' && !Array.isArray(input)) {
            const options = input;
            input = options.input;
        }

        const memoryBankSnapshots = [];
        let cycles = 0;

        while (!configurationSeenBefore(input, memoryBankSnapshots)) {
            memoryBankSnapshots.push(JSON.parse(JSON.stringify(input)));

            const maxIndex = input.reduce((maxIndex, val, index, arr) => val > arr[maxIndex] ? index : maxIndex, 0);
            const incrementForAll = (input[maxIndex] / input.length) | 0;
            const incrementRemainder = input[maxIndex] % input.length;

            input[maxIndex] = 0;
            input = input.map(val => val + incrementForAll);
            for (let i = 0; i < incrementRemainder; i++) {
                input[(maxIndex + i + 1) % input.length]++;
            }
        }

        return memoryBankSnapshots.length;
    }
}

function configurationSeenBefore(currentConfig, pastConfigs) {
    return pastConfigs.some(pastConfig => {
        return pastConfig.every((val, index) => {
            return val === currentConfig[index];
        });
    });
}