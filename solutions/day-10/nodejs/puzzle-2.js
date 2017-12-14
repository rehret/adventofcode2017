#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { KnotHash } = require('./knot-hash');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

console.log(KnotHash.Hash(input));