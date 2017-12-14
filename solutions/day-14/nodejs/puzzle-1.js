#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { Defragmenter } = require('./defragmenter');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

const memory = Defragmenter.GetMemoryState(input);

console.log(memory.reduce((sum, row) => sum + row.reduce((rowSum, val) => val ? rowSum + 1 : rowSum, 0), 0));