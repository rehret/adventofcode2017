'use strict';

module.exports.Instructions = class Instructions {
    static Process(input, offsetModifier = null) {
        if (typeof input === 'object') {
            const options = input;
            input = options.input;
            offsetModifier = options.offsetModifier;
        }

        let index = 0;
        let moves = 0;

        while (index >= 0 && index < input.length) {
            const oldIndex = index;
            const oldValue = input[index];
            index += input[index];
            input[oldIndex] = input[oldIndex] + offsetModifier(oldIndex, oldValue, input);
            moves++;
        }

        return moves;
    }
};