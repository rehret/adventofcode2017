#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { HexNavigator } = require('./hex-navigator');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8').split(',');

const coords = HexNavigator.FindCoordinatesFromPath(input);
const pathToCoords = HexNavigator.GetPathToCoordinates(coords);

console.log(pathToCoords.length);
