'use strict';

const { EventEmitter } = require('events');

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
     * @param {ProgramState} state
     */
    constructor(input, instructionMapping, state = null) {
        this.state = state || new ProgramState();
        this.state.instructions = parse(input, instructionMapping);

        if (state !== null) {
            this.state = state;
        }

        this.state.events.on('terminate', () => {
            this.state.executing = false;
        });
    }

    Execute() {
        while (this.state.executing) {
            this.Step();
        }
    }

    Step() {
        if (this.state.executing && this.state.instructionPointer < this.state.instructions.length && this.state.instructionPointer >= 0) {
            this.state.instructions[this.state.instructionPointer].Operation(this.state);
        } else {
            this.state.executing = false;
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
        this.executing = true;

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
    ProgramState,
    Register,
    Instruction,
    SetInstruction,
    AddInstruction,
    MultiplyInstruction,
    ModulusInstruction,
    JumpGreaterThanZeroInstruction
}