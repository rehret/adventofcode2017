#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { Defragmenter } = require('./defragmenter');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

const blocks = Defragmenter.GetBlocks(input);

console.log(blocks.length);