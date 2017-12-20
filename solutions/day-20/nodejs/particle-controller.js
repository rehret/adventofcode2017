'use strict';

class ParticleController {
    /**
     * @param {string} input
     * @returns {Particle[]}
     */
    static Parse(input) {
        /** @type {Particle[]} */
        const particles = [];
        input.split(/\n/).forEach((line, index) => {
            const lineRegex = /^p=(\<-?\d+,-?\d+,-?\d+\>), v=(\<-?\d+,-?\d+,-?\d+\>), a=(\<-?\d+,-?\d+,-?\d+\>)$/;
            const coordinateRegex = /\<(-?\d+),(-?\d+),(-?\d+)\>/;
            const matches = line.match(lineRegex);
            const particle = new Particle(index);

            // position
            const positionGroup = matches[1];
            const positionMatches = positionGroup.match(coordinateRegex);
            particle.setPosition(parseInt(positionMatches[1]), parseInt(positionMatches[2]), parseInt(positionMatches[3]));

            // velocity
            const velocityGroup = matches[2];
            const velocityMatches = velocityGroup.match(coordinateRegex);
            particle.setVelocity(parseInt(velocityMatches[1]), parseInt(velocityMatches[2]), parseInt(velocityMatches[3]));

            // acceleration
            const accelerationGroup = matches[3];
            const accelerationMatches = accelerationGroup.match(coordinateRegex);
            particle.setAcceleration(parseInt(accelerationMatches[1]), parseInt(accelerationMatches[2]), parseInt(accelerationMatches[3]));

            particles.push(particle);
        });

        return particles;
    }
}

class Particle {
    /**
     * @param {number} id
     */
    constructor(id) {
        this.id = id;
        this.position = new Coordinate();
        this.velocity = new Coordinate();
        this.acceleration = new Coordinate();
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    setPosition(x, y, z) {
        this.position.set(x, y, z);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    setVelocity(x, y, z) {
        this.velocity.set(x, y, z);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    setAcceleration(x, y, z) {
        this.acceleration.set(x, y, z);
    }

    tick() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
    }
}

class Coordinate {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * @param {Coordinate | number} x
     * @param {number} y
     * @param {number} z
     */
    add(x, y = null, z = null) {
        if (x instanceof Coordinate) {
            this.x += x.x;
            this.y += x.y;
            this.z += x.z;
        } else {
            this.x += x;
            this.y += y;
            this.z += z;
        }
    }
}

module.exports = {
    ParticleController,
    Particle,
    Coordinate
}