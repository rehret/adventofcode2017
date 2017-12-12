#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { MemoryAllocator } = require('./memory-allocator');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt')).toString().split(/\s+/).map(val => parseInt(val));

MemoryAllocator.CatchInfiniteLoop({
    input: input,
    callback: (memory, memoryBankSnapshots) => {
        const previousOccuranceIndex = memoryBankSnapshots.reduce((occuranceIndex, val, index) => {
            if (val.every((val, index) => val === memory[index])) {
                return index;
            }
            return occuranceIndex;
        }, 0);

        console.log(memoryBankSnapshots.length - previousOccuranceIndex);
    }
});