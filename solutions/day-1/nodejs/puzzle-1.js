#!/usr/bin/env node
"use strict";

const fs = require('fs');
const path = require('path');
const { ReverseCaptcha } = require('./reverse-captcha');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');
ReverseCaptcha.Process({
    input: input,
    intervalFn: (index) => index + 1,
    callback: (sum) => console.log(sum)
});