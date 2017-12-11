#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { KnotHash } = require('./knot-hash');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8').split(',').map(val => parseInt(val));

const arr = [];
for (let i = 0; i < 256; i++) {
    arr.push(i);
}

const result = KnotHash.Hash(arr, input);

console.log(result[0] * result[1]);