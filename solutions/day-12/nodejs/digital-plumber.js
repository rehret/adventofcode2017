'use strict';

module.exports.DigitalPlumber = class DigitalPlumber {
    /**
     * @param {number} programId
     * @param {string[]} input
     * @returns {number[]}
     */
    static GetProgramsInGroupWith(programId, input) {
        /** @type {Program[]} */
        const programs = [];

        for (let line of input) {
            programs.push(parseLine(line));
        }

        const targetProgram = getProgramWithId(programId, programs);
        return getConnectedPrograms(targetProgram, programs);
    }
};

class Program {
    /**
     * @param {number} id
     */
    constructor(id) {
        this.id = id;

        /** @type {number[]} */
        this.links = [];
    }
}

/**
 * @param {string} line
 * @returns {Program}
 */
function parseLine(line) {
    const matches = line.match(/(\d+)\s<->\s((\d+(,\s)?)+)/);
    const program = new Program(parseInt(matches[1]));
    matches[2].split(',').forEach(link => program.links.push(parseInt(link.trim())));
    return program;
}

/**
 * @param {number} id
 * @param {Program[]} programs
 * @returns {Program}
 */
function getProgramWithId(id, programs) {
    return programs.reduce((target, p) => p.id === id ? p : target, programs[0]);
}

/**
 * @param {Program} program
 * @param {Program[]} allPrograms
 * @param {number[]?} visited
 * @returns {Number[]}
 */
function getConnectedPrograms(program, allPrograms, visited = []) {
    visited.push(program.id);
    for (let id of program.links) {
        if (!visited.includes(id)) {
            visited = visited.concat(getConnectedPrograms(getProgramWithId(id, allPrograms), allPrograms, visited));
            visited = visited.filter((id, index, arr) => arr.indexOf(id) === index);
        }
    }
    return visited;
}