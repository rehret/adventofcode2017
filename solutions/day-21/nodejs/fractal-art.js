'use strict';

class FractalArt {
    /**
     * @param {string} startingGrid
     * @param {string} rules
     * @param {number} iterations
     */
    static GenerateArt(startingGrid, rules, iterations) {

    }
}

class FractalArtGrid {
    /**
     * @param {string | FractalArtGrid} input
     */
    constructor(input) {
        /** @type {boolean[][]} */
        this.grid = [];
        if (typeof input === 'string') {
            input.split(/\//).forEach(row => {
                this.grid.push(row.split('').map(char => char === '#' ? true : false));
            });
        } else {
            this.grid = [];
            input.grid.forEach(row => {
                const bitRow = [];
                row.forEach(bit => {
                    bitRow.push(bit);
                })
                this.grid.push(bitRow);
            });
        }
    }

    /**
     * @param {FractalArtGrid} fractalGrid
     */
    equal(fractalGrid) {
        fractalGrid.grid.every((row, rowIndex) => {
            return row.every((bit, colIndex) => {
                return this.grid[rowIndex][colIndex] === bit;
            });
        });
    }

    rotate() {
        const rotatedGrid = new FractalArtGrid(this);
        this.grid.forEach((row, rowIndex) => {
            row.forEach((bit, colIndex) => {
                rotatedGrid.grid[this.grid.length - colIndex - 1][rowIndex] = bit;
            });
        });
        this.grid = rotatedGrid.grid;
        return this;
    }

    flipHorizontal() {
        const flippedGrid = new FractalArtGrid(this);
        this.grid.forEach((row, rowIndex) => {
            row.forEach((bit, colIndex) => {
                flippedGrid.grid[rowIndex][this.grid.length - colIndex - 1] = bit;
            });
        });
        this.grid = flippedGrid.grid;
        return this;
    }

    flipVertical() {
        const flippedGrid = new FractalArtGrid(this);
        this.grid.forEach((row, rowIndex) => {
            row.forEach((bit, colIndex) => {
                flippedGrid.grid[this.grid.length - rowIndex - 1][colIndex] = bit;
            });
        });
        this.grid = flippedGrid.grid;
        return this;
    }

    /**
     * @param {boolean} inline
     */
    toString(inline = false) {
        let str = '';
        this.grid.forEach(row => {
            row.forEach(bit => {
                str += bit ? '#' : '.';
            });
            str += inline ? '/' : '\n';
        });
        return str;
    }

    /**
     * @param {FractalArtGrid} fractalGrid
     * @returns {FractalArtGrid[][]}
     */
    static split(fractalGrid) {
        const grid = [];
        if (fractalGrid.grid.length % 2 === 0) {

        } else if (fractalGrid.grid.length % 3 === 0) {

        }
    }
}

module.exports = {
    FractalArtGrid
}