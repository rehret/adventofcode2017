'use strict';

module.exports.HexNavigator = class HexNavigator {
    /**
     * @param {string[]} stepsTaken
     * @returns {[number, number]}
     */
    static FindCoordinatesFromPath(stepsTaken) {
        let x = 0;
        let y = 0;

        for (let step of stepsTaken) {
            switch (step) {
            case 'n':
                y++;
                break;
            case 'ne':
                x++;
                y++;
                break;
            case 'se':
                x++;
                break;
            case 's':
                y--;
                break;
            case 'sw':
                x--;
                y--;
                break;
            case 'nw':
                x--;
                break;
            }
        }

        return [x, y];
    }

    /**
     * @param {[number, number]} coords
     * @returns {string[]}
     */
    static GetPathToCoordinates(coords) {
        let x = 0;
        let y = 0;

        /** @type {string[]} */
        let steps = [];

        while (x !== coords[0] || y !== coords[1]) {
            if (x < coords[0] && y < coords[1]) {
                steps.push('ne');
                x++;
                y++;
            } else if (x > coords[0] && y > coords[1]) {
                steps.push('sw');
                x--;
                y--;
            } else if (x < coords[0]) {
                steps.push('se');
                x++;
            } else if (x > coords[0]) {
                steps.push('nw');
                x--;
            } else if (y < coords[1]) {
                steps.push('n');
                y++;
            } else if (y > coords[1]) {
                steps.push('s');
                y--;
            }
        }

        return steps;
    }

    /**
     * @param {string[]} stepsTaken
     * @returns {number}
     */
    static GetFarthestFromOriginOnPath(stepsTaken) {
        return stepsTaken.reduce((maxSteps, step, index, arr) => {
            const steps = arr.slice(0, index);
            const coords = HexNavigator.FindCoordinatesFromPath(steps);
            const distance = HexNavigator.GetPathToCoordinates(coords).length;

            if (distance > maxSteps) {
                return distance;
            }
            return maxSteps;
        }, 0);
    }
};