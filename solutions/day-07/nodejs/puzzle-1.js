#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { TreeBuilder } = require('./tree-builder');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt')).toString();

const rootNode = TreeBuilder.GetRootTreeNode(input);
console.log(rootNode.name);