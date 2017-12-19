'use strict';

const { EventEmitter } = require('events');

const soundEventName = 'sound';
const recoverEventName = 'recover';

/**
 * @typedef {Object.<string, typeof Instruction>} InstructionMapping
 * @property {typeof Instruction} snd
 * @property {typeof Instruction} set
 * @property {typeof Instruction} add
 * @property {typeof Instruction} mul
 * @property {typeof Instruction} mod
 * @property {typeof Instruction} rcv
 * @property {typeof Instruction} jgz
 */

class Interpretter {
    /**
     * @param {string} input
     * @param {InstructionMapping} instructionMapping
     * @param {(sound: number) => void} recoverCallback
     */
    static Execute(input, instructionMapping, recoverCallback) {
        const state = new ProgramState();
        state.instructions = parse(input, instructionMapping);

        let lastSound = null;
        let soundRecovered = false;

        state.events.on(soundEventName, sound => {
            lastSound = sound;
        });

        state.events.on(recoverEventName, () => {
            soundRecovered = true;
            if (typeof recoverCallback === 'function') {
                recoverCallback(lastSound);
            }
        });

        while (!soundRecovered && state.instructionPointer < state.instructions.length && state.instructionPointer >= 0) {
            state.instructions[state.instructionPointer].Operation(state);
        }
    }
};

class Register {
    /**
     * @param {string} name
     * @param {number} value
     */
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

class ProgramState {
    constructor() {
        /** @type {Register[]} */
        this.registers = [];

        /** @type {Instruction[]} */
        this.instructions = [];

        this.instructionPointer = 0;

        this.events = new EventEmitter();
    }

    /**
     * @param {string} name
     * @returns {Register}
     */
    GetRegister(name) {
        if (this.registers.filter(r => r.name === name).length > 0) {
            return this.registers.find(r => r.name === name);
        } else {
            const r = new Register(name, 0);
            this.registers.push(r);
            return r;
        }
    }

    /**
     * @param {string} value
     * @returns {number}
     */
    GetValueOrRegisterValue(value) {
        if (isNaN(parseInt(value))) {
            return this.GetRegister(value).value;
        } else {
            return parseInt(value);
        }
    }
}

class Instruction {
    /**
     * @param {string[]} params
     */
    constructor(params) {
        this.params = params;
    }

    /**
     * @param {ProgramState} state
     */
    Operation(state) {}
}

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

class SetInstruction extends Instruction {
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
        const register = state.GetRegister(this.params[0]);
        register.value = state.GetValueOrRegisterValue(this.params[1]);
        state.instructionPointer++;
    }
}

class AddInstruction extends Instruction {
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
        const register = state.GetRegister(this.params[0]);
        register.value += state.GetValueOrRegisterValue(this.params[1]);
        state.instructionPointer++;
    }
}

class MultiplyInstruction extends Instruction {
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
        const register = state.GetRegister(this.params[0]);
        register.value *= state.GetValueOrRegisterValue(this.params[1]);
        state.instructionPointer++;
    }
}

class ModulusInstruction extends Instruction {
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
        const register = state.GetRegister(this.params[0]);
        register.value %= state.GetValueOrRegisterValue(this.params[1]);
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

class JumpGreaterThanZeroInstruction extends Instruction {
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
        const offset = state.GetValueOrRegisterValue(this.params[1]);

        if (checkValue > 0) {
            state.instructionPointer += offset;
        } else {
            state.instructionPointer++;
        }
    }
}

/**
 * @param {string} input
 * @param {InstructionMapping} instructionMapping
 * @returns {Instruction[]}
 */
function parse(input, instructionMapping) {
    /** @type {Instruction[]} */
    const instructions = [];
    input.split(/\n/).forEach(line => {
        const matches = line.match(/(\w{3})\s(-?\d+|\w)(\s(-?\d+|\w))?/);
        instructions.push(new instructionMapping[matches[1]]([matches[2], matches[4]]));
    });

    return instructions;
}

module.exports = {
    Interpretter,
    Instruction,
    SoundInstruction,
    SetInstruction,
    AddInstruction,
    MultiplyInstruction,
    ModulusInstruction,
    RecoverInstruction,
    JumpGreaterThanZeroInstruction
}