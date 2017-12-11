#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { KnotHash } = require('./knot-hash');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt')).toString().split(',').map(val => parseInt(val));

const result = KnotHash.Hash(256, input);

console.log(result[0] * result[1]);