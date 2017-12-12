#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { Instructions } = require('./instructions');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt')).toString().split(/\n/).map(val => parseInt(val));

const moves = Instructions.Process({
    input: input,
    offsetModifier: (index, val) => {
        if (val >= 3) {
            return -1;
        }
        return 1;
    }
});

console.log(moves);