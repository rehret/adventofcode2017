const fs = require('fs');
const path = require('path');
const { Checksum } = require('./checksum');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

Checksum.parse({
    input: input,
    lineValueFn: (values) => {
        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < values.length; j++) {
                if (i !== j) {
                    const larger = values[i] > values[j] ? values[i] : values[j];
                    const smaller = values[i] < values[j] ? values[i] : values[j];
                    if (larger % smaller === 0) {
                        return larger / smaller;
                    }
                }
            }
        }
    },
    callback: val => console.log(val)
});
