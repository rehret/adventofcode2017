#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
    Interpretter,
    SoundInstruction,
    SetInstruction,
    AddInstruction,
    MultiplyInstruction,
    ModulusInstruction,
    RecoverInstruction,
    JumpGreaterThanZeroInstruction
} = require('./interpretter');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

Interpretter.Execute(
    input,
    {
        snd: SoundInstruction,
        set: SetInstruction,
        add: AddInstruction,
        mul: MultiplyInstruction,
        mod: ModulusInstruction,
        rcv: RecoverInstruction,
        jgz: JumpGreaterThanZeroInstruction
    },
    sound => {
        console.log(sound);
    }
);