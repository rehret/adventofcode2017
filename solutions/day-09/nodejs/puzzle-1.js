#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { StreamParser } = require('./stream-parser');

function getDepth(node, depth = 1) {
    return depth + node.children.reduce((sum, child) => sum + getDepth(child, depth + 1), 0);
}

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt')).toString();

const rootNode = StreamParser.parse(input);

console.log(getDepth(rootNode));