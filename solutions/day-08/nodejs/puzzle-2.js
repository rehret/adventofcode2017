#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { RegisterProcessor } = require('./register-processor');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt')).toString();
let largestValue = -Infinity;
RegisterProcessor.GetRegistersAfterInstructions({
    input: input,
    postInstrCallback: registers => {
        const largestRegister = registers.reduce((max, r) => r.value > max.value ? r : max, registers[0]);
        if (largestRegister.value > largestValue) {
            largestValue = largestRegister.value;
        }
    }
});
console.log(largestValue);
