'use strict';

module.exports.FirewallBreacher = class FirewallBreacher {
    /**
     * @param {FirewallLayer[]} input
     * @param {number?} delay
     * @returns {number}
     */
    static GetBreachSeverity(input, delay = 0) {
        return input.reduce((severity, layer) => {
            if ((layer.depth + delay) % (layer.range * 2 - 2) === 0) {
                return severity + (layer.range * layer.depth);
            }
            return severity;
        }, 0);
    }

    /**
     * @param {FirewallLayer[]} input
     * @param {number?} delay
     * @returns {boolean}
     */
    static PacketIsCaughtWithDelay(input, delay = 0) {
        return input.reduce((caught, layer) => {
            if ((layer.depth + delay) % (layer.range * 2 - 2) === 0 || caught) {
                return true;
            }
            return false;
        }, false);
    }

    /**
     * @param {FirewallLayer[]} input
     * @returns {number}
     */
    static GetSmallestDelayForBreach(input) {
        let delay = 0;

        while (FirewallBreacher.PacketIsCaughtWithDelay(input, delay)) {
            delay++;
        }

        return delay;
    }

    /**
     * @param {string} input
     * @returns {FirewallLayer[]}
     */
    static ParseInput(input) {
        /** @type {FirewallLayer[]} */
        const layers = [];
        input.split(/\n/).forEach(line => {
            const matches = line.match(/(\d+):\s(\d+)/);
            layers.push(new FirewallLayer(parseInt(matches[1]), parseInt(matches[2])));
        });
        return layers;
    }
};

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