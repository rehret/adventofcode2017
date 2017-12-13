#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { FirewallBreacher } = require('./firewall-breacher');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

console.log(FirewallBreacher.GetSmallestDelayForBreach(input));