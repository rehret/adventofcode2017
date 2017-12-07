#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { TreeBuilder } = require('./tree-builder');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt')).toString();

function getSubTreeWeight(node) {
    return node.weight + node.children.reduce((sum, child) => sum + getSubTreeWeight(child), 0);
}

function getWeightChange(node, parentOddWeight = null, parentCommonWeight = null) {
    const childWeights = node.children.map(c => getSubTreeWeight(c));

    if (childWeights.length === 0 || childWeights.every(w => w === childWeights[0])) {
        return node.weight + (parentCommonWeight - parentOddWeight);
    } else {
        let oddWeightIndex;
        if (parentOddWeight !== null && parentCommonWeight !== null) {
            oddWeightIndex = childWeights.reduce((oddWeightIndex, weight, index, arr) => {
                if (arr[oddWeightIndex] - weight === parentOddWeight - parentCommonWeight) {
                    return oddWeightIndex;
                }
                return index;
            }, 0);
        } else {
            oddWeightIndex = childWeights.reduce((oddIndex, weight, index, arr) => {
                if (arr.some((w, i) => w === weight && index !== i)) {
                    return oddIndex;
                }
                return index;
            }, 0);
        }
        const commonWeight = childWeights.filter((w, index) => index !== oddWeightIndex)[0];
        return getWeightChange(node.children[oddWeightIndex], childWeights[oddWeightIndex], commonWeight);
    }
}

const rootNode = TreeBuilder.GetRootTreeNode(input);
console.log(getWeightChange(rootNode));