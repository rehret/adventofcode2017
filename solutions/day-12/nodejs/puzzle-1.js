#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { DigitalPlumber } = require('./digital-plumber');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8').split(/\n/);

console.log(DigitalPlumber.GetProgramsInGroupWith(0, input).length);