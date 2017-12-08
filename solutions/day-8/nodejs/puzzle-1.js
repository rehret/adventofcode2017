#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { RegisterProcessor } = require('./register-processor');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt')).toString();

const registers = RegisterProcessor.GetRegistersAfterInstructions(input);

const largestRegister = registers.reduce((max, r) => r.value > max.value ? r : max, registers[0]);

console.log(largestRegister.value);