#!/usr/bin/env node
"use strict";

const fs = require('fs');
const path = require('path');

const input = parseInt(fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8'));

// sideLength is from a corner (non-inclusive) to the next corner (inclusive)
// 5 4 3
// 6 1 2
// 7 8 9
// has sideLength of 2
// top and right sides get sideLength - 1 from this:
let sideLength = Math.ceil(Math.sqrt(input)) - 1;
// add one if sideLength was odd
sideLength += sideLength % 2;
const ringNumber = sideLength / 2;

// finding the offset of input from a corner
// sideKey = (input - minimumRingValue + 1) / sideLength
// minimumRingValue is found by getting the largest value in the ring and subtracting the number of items in the ring
// sideKey is between 0 (non-inclusive) and 4. 1,2,3,4 are the corners top-right, top-left, bottom-left, bottom-right respectively.
// each "side" of the ring is just a rotated version of the other sides, so they all have the same Manhattan Distance
// since each side is the same, sideKey modulo 1 gives results in terms of the right-side of the ring
// once we have our "unit-position", multiply by the side length to get the integer index of the number relative to the start of that side
const sidePosition = parseInt((((input - (Math.pow(sideLength + 1, 2) - (sideLength * 4 - 1)) + 1) / sideLength) % 1) * sideLength);
console.log(ringNumber + Math.abs(ringNumber - sidePosition));
