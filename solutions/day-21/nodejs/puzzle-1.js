#!/usr/bin/env node
'use strict';

const { FractalArtGrid } = require('./fractal-art');

const startingInput = '.#./..#/###';

const grid = new FractalArtGrid(startingInput);