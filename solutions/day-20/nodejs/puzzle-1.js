#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { ParticleController, Coordinate } = require('./particle-controller');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

const particles = ParticleController.Parse(input);

/**
 * @param {Coordinate} coordinate
 */
function manhattanSum(coordinate) {
    return Math.abs(coordinate.x) + Math.abs(coordinate.y) + Math.abs(coordinate.z);
}

const nearestParticle = particles.reduce((near, p) => {
    const pPosition = manhattanSum(p.position);
    const pVelocity = manhattanSum(p.velocity);
    const pAccel = manhattanSum(p.acceleration);
    const nearPosition = manhattanSum(near.position);
    const nearVelocity = manhattanSum(near.velocity);
    const nearAccel = manhattanSum(near.acceleration);

    if (pAccel === nearAccel && pVelocity === nearVelocity) {
        return pPosition < nearPosition ? p : near;
    } else if (pAccel === nearAccel) {
        return pVelocity < nearVelocity ? p : near;
    } else {
        return pAccel < nearAccel ? p : near
    }
}, particles[0]);

console.log(nearestParticle.id);