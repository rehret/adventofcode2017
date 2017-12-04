#!/usr/bin/env node
"use strict";

const fs = require('fs');
const path = require('path');

const input = parseInt(fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8'));

let ringSizes = [0];
let i = 0;
let maxValueFound = 0;

// find number of items in the each ring (ring sizes increase by 8 each time)
// sum of all ring sizes + 1 (because of the starting value) is the max value in that ring
while (maxValueFound < input) {
    ringSizes.push(ringSizes[i++] + 8);
    maxValueFound = 1 + ringSizes.reduce((sum, val) => sum + val);
}

// ring number is number of iterations taken above to find the ring containing input
const ringNumber = i;

// sideLength is from a corner (non-inclusive) to the next corner (inclusive)
// 5 4 3
// 6 1 2
// 7 8 9
// has sideLength of 2
const sideLength = ringSizes[ringNumber] / 4;

// Find the first value in the ring
const minRingNumber = maxValueFound - ringSizes[ringNumber] + 1;

// finding the offset of input from a corner
let sidePosition = (input - minRingNumber + 1) / sideLength;
while(sidePosition > 1) {
    sidePosition--;
}
sidePosition = parseInt(sidePosition * sideLength);

// One coordinate is always === abs(ringNumber) and the other is between 0 and abs(ringNumber)
// Each "side" of the ring is just a rotated version of the other sides, so they all have the same Manhattan Distance
// We just use a simplified side by always assigning ringNumber to x and the offset to y
const x = ringNumber;
const y = i - sidePosition;

console.log(x + Math.abs(y));
