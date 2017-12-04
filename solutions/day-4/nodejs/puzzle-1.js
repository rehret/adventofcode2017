#!/usr/bin/env node
"use strict";

const fs = require('fs');
const path = require('path');
const { Passphrase } = require('./passphrase');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

const validPassphrases = Passphrase.getValidPassphrases({
    input: input,
    comparator: (searchWord, matchWord, searchIndex, matchIndex, array) => {
        return searchWord !== matchWord || searchIndex === matchIndex;
    }
});

console.log(validPassphrases.length);