#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { Interpretter } = require('./interpretter');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

Interpretter.Execute(input, sound => {
    console.log(sound);
});