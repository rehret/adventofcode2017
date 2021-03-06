#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { Spinlock } = require('./spinlock');

const input = parseInt(fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8'));

Spinlock.GetCircularBuffer(input, 2017, (lastNodeInserted) => {
    console.log(lastNodeInserted.next.value);
});