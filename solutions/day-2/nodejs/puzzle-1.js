const fs = require('fs');
const path = require('path');
const { Checksum } = require('./checksum');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

Checksum.parse(input, val => console.log(val));
