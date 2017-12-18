'use strict';

const { EventEmitter } = require('events');

const events = new EventEmitter();
const soundEventName = 'sound';
const recoverEventName = 'recover';

module.exports.Interpretter = class Interpretter {
    /**
     * @param {string} input
     * @param {(sound: number) => void} recoverCallback
     */
    static Execute(input, recoverCallback) {
        /** @type {Register[]} */
        const registers = [];
        const instructions = parse(input);
        let lastSound = null;
        let instructionPointer = 0;
        let soundRecovered = false;

        events.on(soundEventName, sound => {
            lastSound = sound;
        });

        events.on(recoverEventName, () => {
            soundRecovered = true;
            if (typeof recoverCallback === 'function') {
                recoverCallback(lastSound);
            }
        });

        while (!soundRecovered && instructionPointer < instructions.length && instructionPointer >= 0) {
            instructionPointer = instructions[instructionPointer].operation(registers, instructionPointer);
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

class Instruction {
    /**
     * @param {(registers: Register[], instructionPointer: number) => number} operation
     */
    constructor(operation) {
        /**
         * @property {(registers: Register[], instructionPointer: number) => number} operation
         * @readonly
         * */
        this.operation = operation;
    }
}

/**
 * @param {string} input
 * @returns {Instruction[]}
 */
function parse(input) {
    /** @type {Instruction[]} */
    const instructions = [];
    input.split(/\n/).forEach(line => {
        const matches = line.match(/(\w{3})\s(-?\d+|\w)(\s(-?\d+|\w))?/);
        const instr = matches[1];

        if (instr === 'snd') {
            instructions.push(new Instruction((registers, instructionPointer) => {
                events.emit(soundEventName, getValueOrRegisterValue(matches[2], registers))
                return instructionPointer + 1;
            }));
        } else if (instr === 'set') {
            instructions.push(new Instruction((registers, instructionPointer) => {
                const register = getRegister(matches[2], registers);
                register.value = getValueOrRegisterValue(matches[4], registers);
                return instructionPointer + 1;
            }));
        } else if (instr === 'add') {
            instructions.push(new Instruction((registers, instructionPointer) => {
                const register = getRegister(matches[2], registers);
                register.value += getValueOrRegisterValue(matches[4], registers);
                return instructionPointer + 1;
            }));
        } else if (instr === 'mul') {
            instructions.push(new Instruction((registers, instructionPointer) => {
                const register = getRegister(matches[2], registers);
                register.value *= getValueOrRegisterValue(matches[4], registers);
                return instructionPointer + 1;
            }));
        } else if (instr === 'mod') {
            instructions.push(new Instruction((registers, instructionPointer) => {
                const register = getRegister(matches[2], registers);
                register.value %= getValueOrRegisterValue(matches[4], registers);
                return instructionPointer + 1;
            }));
        } else if (instr === 'rcv') {
            instructions.push(new Instruction((registers, instructionPointer) => {
                const checkValue = getValueOrRegisterValue(matches[2], registers);

                if (checkValue !== 0) {
                    events.emit(recoverEventName);
                }

                return instructionPointer + 1;
            }));
        } else if (instr === 'jgz') {
            instructions.push(new Instruction((registers, instructionPointer) => {
                const checkValue = getValueOrRegisterValue(matches[2], registers);
                const offset = getValueOrRegisterValue(matches[4], registers);

                if (checkValue > 0) {
                    return instructionPointer + offset;
                } else {
                    return instructionPointer + 1;
                }
            }));
        }
    });

    return instructions;
}

/**
 * @param {string} value
 * @param {Register[]} registers
 * @returns {number}
 */
function getValueOrRegisterValue(value, registers) {
    if (isNaN(parseInt(value))) {
        return getRegister(value, registers).value;
    } else {
        return parseInt(value);
    }
}

/**
 * @param {string} name
 * @param {Register[]} registers
 * @returns {Register}
 */
function getRegister(name, registers) {
    if (registers.filter(r => r.name === name).length > 0) {
        return registers.find(r => r.name === name);
    } else {
        const r = new Register(name, 0);
        registers.push(r);
        return r;
    }
}