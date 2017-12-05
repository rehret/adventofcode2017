#!/usr/bin/env node
"use strict";

const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt')).toString().split(/\n/).map(val => parseInt(val));

let index = 0;
let moves = 0;

while (index >= 0 && index < input.length) {
    const oldIndex = index;
    index += input[index];
    input[oldIndex] = input[oldIndex] + 1;
    moves++;
}

console.log(moves);