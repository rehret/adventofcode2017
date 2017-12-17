#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { Spinlock } = require('./spinlock');

const input = parseInt(fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8'));

const zeroNode = Spinlock.GetCircularBuffer(input, 50000000);

console.log(zeroNode.next.value);