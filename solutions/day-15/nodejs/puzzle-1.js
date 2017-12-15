#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { Generator } = require('./generator');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8').split(/\n/);

const lineRegex = /Generator \w starts with (\d+)/;

const generatorA = new Generator(parseInt(input[0].match(lineRegex)[1]), 16807);
const generatorB = new Generator(parseInt(input[1].match(lineRegex)[1]), 48271);

let matches = 0;

for (let i = 0; i < 40000000; i++) {
    generatorA.Generate();
    generatorB.Generate();

    if (generatorA.Compare(generatorB)) {
        matches++;
    }
}

console.log(matches);