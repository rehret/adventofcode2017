#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { Passphrase } = require('./passphrase');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

function isAnagram(word1, word2) {
    const word1Letters = word1.split('').sort((a, b) => a.localeCompare(b));
    const word2Letters = word2.split('').sort((a, b) => a.localeCompare(b));

    return word1Letters.join('') === word2Letters.join('');
}

const validPassphrases = Passphrase.getValidPassphrases({
    input: input,
    comparator: (searchWord, matchWord, searchIndex, matchIndex) => {
        return !isAnagram(searchWord, matchWord) || searchIndex === matchIndex;
    }
});

console.log(validPassphrases.length);