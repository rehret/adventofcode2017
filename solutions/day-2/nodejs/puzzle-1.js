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
        return values[0] - values[values.length - 1];
    },
    callback: val => console.log(val)
});
