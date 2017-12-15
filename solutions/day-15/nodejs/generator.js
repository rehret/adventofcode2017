'use strict';

module.exports.Generator = class Generator {
    /**
     * @param {number} value
     * @param {number} factor
     */
    constructor(value, factor) {
        this.value = value;
        this.factor = factor;
    }

    /**
     * @returns number
     */
    Generate() {
        this.value = (this.value * this.factor) % divisor;
        return this.value;
    }

    /**
     * @param {Generator} generator
     * @returns {boolean}
     */
    Compare(generator) {
        return Generator.Compare(this, generator);
    }

    /**
     * @param {Generator} generatorA
     * @param {Generator} generatorB
     * @returns {boolean}
     */
    static Compare(generatorA, generatorB) {
        const genABinary = generatorA.value.toString(2);
        const genBBinary = generatorB.value.toString(2);
        const genAComparisonValue = genABinary.substr(genABinary.length - 16);
        const genBComparisonValue = genBBinary.substr(genBBinary.length - 16);
        return genAComparisonValue === genBComparisonValue;
    }
};

const divisor = 2147483647;