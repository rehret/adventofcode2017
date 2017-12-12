#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const input = parseInt(fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8'));

class SequenceValue {
    constructor(x, y, val) {
        this.x = x;
        this.y = y;
        this.val = val;
    }

    static getValueAtCoord(x, y, sequence) {
        return sequence.filter(s => {
            return s.x >= x - 1 &&
                s.x <= x + 1 &&
                s.y >= y - 1 &&
                s.y <= y + 1;
        }).reduce((sum, seq) => sum + seq.val, 0);
    }
}

const sequence = [];
sequence.push(new SequenceValue(0, 0, 1));
let ringCount = 8;
let ringPosition = 0;
let x = 1;
let y = 0;
while(sequence[sequence.length - 1].val <= input) {
    sequence.push(new SequenceValue(x, y, SequenceValue.getValueAtCoord(x, y, sequence)));

    // get next coordinate
    ringPosition++;
    const sideLength = Math.floor(ringCount / 4);
    const sideKey = (ringPosition + 1) / sideLength;
    if (sideKey > 0 && sideKey <= 1) {
        y++;
    } else if (sideKey > 1 && sideKey <= 2) {
        x--;
    } else if (sideKey > 2 && sideKey <= 3) {
        y--;
    } else {
        x++;
    }

    if (ringPosition === ringCount) {
        ringCount += 8;
        ringPosition = 0;
    }

}
console.log(sequence[sequence.length - 1].val);