#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const {
    Interpretter,
    ProgramState,
    Register,
    Instruction,
    SetInstruction,
    AddInstruction,
    MultiplyInstruction,
    ModulusInstruction,
    JumpGreaterThanZeroInstruction
} = require('./interpretter');

const input = fs.readFileSync(path.resolve(__dirname, '../input.txt'), 'utf-8');

const messageEventName = 'message';

class SendInstruction extends Instruction {
    /**
     * @param {string[]} params
     */
    constructor(params) {
        super(params);
    }

    /**
     * @param {ExtendedProgramState} state
     */
    Operation(state) {
        state.events.emit(messageEventName, state.GetValueOrRegisterValue(this.params[0]));
        state.instructionPointer++;
    }
}

class ReceiveInstruction extends Instruction {
    /**
     * @param {string[]} params
     */
    constructor(params) {
        super(params);
    }

    /**
     * @param {ExtendedProgramState} state
     */
    Operation(state) {
        if (state.messageQueue.length > 0) {
            const register = state.GetRegister(this.params[0]);
            register.value = state.messageQueue.shift();
            state.instructionPointer++;
        } else {
            state.blocked = true;
        }
    }
}

class ExtendedProgramState extends ProgramState {
    constructor() {
        super();
        this.blocked = false;

        /** @type {number[]} */
        this.messageQueue = [];
    }
}

const mapping = {
    snd: SendInstruction,
    set: SetInstruction,
    add: AddInstruction,
    mul: MultiplyInstruction,
    mod: ModulusInstruction,
    rcv: ReceiveInstruction,
    jgz: JumpGreaterThanZeroInstruction
};

const state0 = new ExtendedProgramState();
const state1 = new ExtendedProgramState();

state0.registers.push(new Register('p', 0));
state1.registers.push(new Register('p', 1));

const interpretter0 = new Interpretter(input, mapping, state0);
const interpretter1 = new Interpretter(input, mapping, state1);

let program1SendCount = 0;

interpretter0.state.events.on(messageEventName, value => {
    /** @type {ExtendedProgramState} */ (interpretter1.state).messageQueue.push(value);
    /** @type {ExtendedProgramState} */ (interpretter1.state).blocked = false;
});
interpretter1.state.events.on(messageEventName, value => {
    program1SendCount++;
    /** @type {ExtendedProgramState} */ (interpretter0.state).messageQueue.push(value);
    /** @type {ExtendedProgramState} */ (interpretter0.state).blocked = false;
});

/**
 * @param {Interpretter} interpretter
 */
function interpretterIsActive(interpretter) {
    return interpretter.state.executing &&
        !(/** @type {ExtendedProgramState} */ (interpretter.state).blocked);
}

while (interpretterIsActive(interpretter0) || interpretterIsActive(interpretter1)) {
    if (interpretterIsActive(interpretter0)) {
        interpretter0.Step();
    } else {
        interpretter1.Step();
    }
}

console.log(program1SendCount);