#!/usr/bin/env node
"use strict";

const fs = require('fs');
const path = require('path');
const { Checksum } = require('./checksum');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

Checksum.parse({
    input: input,
    lineValueFn: (values) => {
        values = values.sort((a, b) => b - a);
        for (let i = 0; i < values.length - 1; i++) {
            for (let j = values.length - 1; j > i; j--) {
                if (values[i] % values[j] === 0) {
                    return values[i] / values[j];
                }
            }
        }
    },
    callback: val => console.log(val)
});
