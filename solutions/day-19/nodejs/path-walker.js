'use strict';

module.exports.PathWalker = class PathWalker {
    /**
     * @param {string} input
     * @param {(steps: string[]) => void} stepsCallback
     * @returns {string[]}
     */
    static GetLettersFoundOnPath(input, stepsCallback = null) {
        const grid = parse(input);
        const location = getStartingCoordinate(grid);
        const heading = new Pair(0, 1);

        /** @type {string[]} */
        const nodesFound = [];

        /** @type {string[]} */
        const steps = [];

        while (heading.x !== 0 || heading.y !== 0) {
            steps.push(grid[location.y][location.x]);
            if (/[-|]/.test(grid[location.y][location.x])) {
                location.x += heading.x;
                location.y += heading.y;
            } else if (/\+/.test(grid[location.y][location.x])) {
                if (heading.x !== 0) {
                    heading.x = 0;
                    if (/\S/.test(grid[location.y - 1][location.x])) {
                        heading.y = -1;
                    } else {
                        heading.y = 1;
                    }
                } else {
                    heading.y = 0;
                    if (/\S/.test(grid[location.y][location.x - 1])) {
                        heading.x = -1;
                    } else {
                        heading.x = 1;
                    }
                }
                location.x += heading.x;
                location.y += heading.y;
            } else if (/[a-zA-Z]/.test(grid[location.y][location.x])) {
                nodesFound.push(grid[location.y][location.x]);
                location.x += heading.x;
                location.y += heading.y;
            } else if (/\s/.test(grid[location.y][location.x])) {
                location.x += -heading.x;
                location.y += -heading.y;
                heading.x = 0;
                heading.y = 0;
            }
        }

        if (typeof stepsCallback === 'function') {
            // strip off the empty space that was added to the end of the list
            steps.splice(steps.length - 1);
            stepsCallback(steps);
        }

        return nodesFound;
    }
};

class Pair {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * @param {string} input
 * @returns {string[][]}
 */
function parse(input) {
    /** @type {string[][]} */
    const grid = [];

    input.split(/\n/).forEach(line => {
        grid.push(line.split(''));
    });

    const maxWidth = grid.reduce((max, row) => row.length > max ? row.length : max, 0);

    for (let y in grid) {
        for (let x = 0; x < maxWidth; x++) {
            if (grid[y][x] === undefined) {
                grid[y][x] = ' ';
            }
        }
    }

    return grid;
}

/**
 * @param {string[][]} grid
 * @returns {Pair}
 */
function getStartingCoordinate(grid) {
    const y = 0;
    const topRow = grid[y];
    const x = topRow.join('').match(/\S/).index;
    return new Pair(x, y);
}