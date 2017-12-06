'use strict';

module.exports.Passphrase = class Passphrase {
    static getValidPassphrases(input, comparator = null) {
        if (typeof input === 'object') {
            const options = input;
            input = options.input;
            comparator = options.comparator;
        }

        return input.split(/\n/).filter(p => {
            return p.split(/\s+/).every((searchWord, searchIndex, array) => {
                return array.every((matchWord, matchIndex) => {
                    return comparator(searchWord, matchWord, searchIndex, matchIndex, array);
                });
            });
        });
    }
};