#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { StreamParser } = require('./stream-parser');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt')).toString();

StreamParser.parse({
    input: input,
    garbageCallback: garbage => {
        console.log(garbage.length);
    }
});
