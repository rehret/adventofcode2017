#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { PathWalker } = require('./path-walker');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

PathWalker.GetLettersFoundOnPath(input, steps => {
    console.log(steps.length);
});