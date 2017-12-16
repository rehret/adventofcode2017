#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { DanceParser } = require('./dance-parser');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

const arr = DanceParser.GetPositionsAfterFullDance(input);

console.log(arr.join(''));