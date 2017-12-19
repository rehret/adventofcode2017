#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const {
    Interpretter,
    ProgramState,
    Instruction,
    SetInstruction,
    AddInstruction,
    MultiplyInstruction,
    ModulusInstruction,
    JumpGreaterThanZeroInstruction
} = require('./interpretter');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

class SoundInstruction extends Instruction {
    /**
     * @param {string[]} params
     */
    constructor(params) {
        super(params);
    }

    /**
     * @param {ProgramState} state
     */
    Operation(state) {
        state.events.emit(soundEventName, state.GetValueOrRegisterValue(this.params[0]));
        state.instructionPointer++;
    }
}

class RecoverInstruction extends Instruction {
    /**
     * @param {string[]} params
     */
    constructor(params) {
        super(params);
    }

    /**
     * @param {ProgramState} state
     */
    Operation(state) {
        const checkValue = state.GetValueOrRegisterValue(this.params[0]);

        if (checkValue !== 0) {
            state.events.emit(recoverEventName);
        }

        state.instructionPointer++;
    }
}

const mapping = {
    snd: SoundInstruction,
    set: SetInstruction,
    add: AddInstruction,
    mul: MultiplyInstruction,
    mod: ModulusInstruction,
    rcv: RecoverInstruction,
    jgz: JumpGreaterThanZeroInstruction
};

const soundEventName = 'sound';
const recoverEventName = 'recover';
const interpretter = new Interpretter(input, mapping);

/** @type {number} */
let lastSound;

interpretter.state.events.on(soundEventName, sound => lastSound = sound);
interpretter.state.events.on(recoverEventName, () => {
    console.log(lastSound);
    interpretter.state.events.emit('terminate');
});

interpretter.Execute();
