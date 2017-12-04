module.exports.Passphrase = class Passphrase {
    static verify(input) {
        let validPassphrases = input.split(/\n/).filter(p => {
            return p.split(/\s+/).every((searchWord, searchIndex, array) => {
                return array.every((matchWord, matchIndex) => {
                    return searchWord !== matchWord || searchIndex === matchIndex;
                });
            });
        });

        return validPassphrases.length;
    }
};