#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { KnotHash } = require('./knot-hash');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8').split('').map(val => val.charCodeAt(0)).concat([17, 31, 73, 47, 23]);

let arr = [];
for (let i = 0; i < 256; i++) {
    arr.push(i);
}

let state = {};

for (let i = 0; i < 64; i++) {
    arr = KnotHash.Hash({
        arr: arr,
        twistLengths: input,
        callback: previousState => {
            state = previousState;
        },
        state: state
    });
}

const groups = [];
for (let i = 0; i < 16; i++) {
    const group = [];
    for (let j = i; j < arr.length; j += 16) {
        group.push(arr[j]);
    }
    groups.push(group);
}

const values = groups.map(g => g.reduce((xor, val) => xor ^ val, 0));

const hash = values.reduce((str, val) => str + (val.toString(16).length === 1 ? '0' + val.toString(16) : val.toString(16)));

console.log(hash);