const fs = require('fs');
const path = require('path');
const { Checksum } = require('./checksum');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

Checksum.parse({
    input: input,
    lineValueFn: (values) => {
        const max = values.reduce((max, val) => val > max ? val : max);
        const min = values.reduce((min, val) => val < min ? val : min);
        return max - min;
    },
    callback: val => console.log(val)
});
