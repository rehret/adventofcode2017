'use strict';

module.exports.RegisterProcessor = class InstructionProcessor {
    /**
     * @param {string} input
     * @returns {Register[]}
     */
    static GetRegistersAfterInstructions(input) {
        const registers = [];
        const instructions = parse(input);

        instructions.forEach(instr => {
            if (!registers.some(r => r.name === instr.targetRegister)) {
                registers.push(new Register(instr.targetRegister));
            }

            let condition = instr.condition;
            const registerToCheck = condition.match(/(\w+).+/)[1];
            if (!registers.some(r => r.name === registerToCheck)) {
                registers.push(new Register(registerToCheck));
            }
            const registerValue = registers.reduce((target, r) => r.name === registerToCheck ? r : target).value;
            condition = condition.replace(registerToCheck, registerValue);

            if (eval(condition)) {
                registers.reduce((target, r) => r.name === instr.targetRegister ? r : target).value += instr.incrementAmount;
            }
        });

        return registers;
    }
};

/**
 * @param {string} input
 * @returns {Instruction[]}
 */
function parse(input) {
    const instructions = [];
    input.split(/\n/).forEach(line => {
        const matches = line.match(/(\w+)\s(inc|dec)\s(-?\d+)\sif\s(.+)/);
        const register = matches[1];
        const incrementAmount = matches[2] === 'inc' ? parseInt(matches[3]) : parseInt(matches[3]) * -1;
        const condition = matches[4];
        instructions.push(new Instruction(register, incrementAmount, condition));
    });

    return instructions;
}

class Instruction {
    /**
     * @param {string} targetRegister
     * @param {number} incrementAmount
     * @param {string} condition
     */
    constructor(targetRegister, incrementAmount, condition) {
        this.targetRegister = targetRegister;
        this.incrementAmount = incrementAmount;
        this.condition = condition;
    }
}

class Register {
    constructor(name) {
        this.name = name;
        this.value = 0;
    }
}