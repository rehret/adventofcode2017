#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { MemoryAllocator } = require('./memory-allocator');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt')).toString().split(/\s+/).map(val => parseInt(val));

console.log(MemoryAllocator.CatchInfiniteLoop(input));