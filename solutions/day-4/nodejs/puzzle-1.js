const fs = require('fs');
const path = require('path');

const { Passphrase } = require('./passphrase');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

const validPassphraseCount = Passphrase.verify(input);

console.log(validPassphraseCount);