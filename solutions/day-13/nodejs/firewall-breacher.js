'use strict';

module.exports.FirewallBreacher = class FirewallBreacher {
    /**
     * @param {string} input
     * @returns {number}
     */
    static GetBreachSeverity(input) {
        const layers = parse(input);

        return layers.reduce((severity, layer) => {
            if (layer.depth % (layer.range * 2 - 2) === 0) {
                return severity + (layer.range * layer.depth);
            }
            return severity;
        }, 0);
    }
};

/**
 * @param {string} input
 * @returns {FirewallLayer[]}
 */
function parse(input) {
    /** @type {FirewallLayer[]} */
    const layers = [];
    input.split(/\n/).forEach(line => {
        const matches = line.match(/(\d+):\s(\d+)/);
        layers.push(new FirewallLayer(parseInt(matches[1]), parseInt(matches[2])));
    });
    return layers;
}

class FirewallLayer {
    /**
     * @param {number} depth
     * @param {number} range
     */
    constructor(depth, range) {
        this.depth = depth;
        this.range = range;
    }
}