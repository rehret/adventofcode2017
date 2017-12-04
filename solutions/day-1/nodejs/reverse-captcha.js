"use strict";

const cluster = require('cluster');
const numCpus = require('os').cpus().length;

module.exports.ReverseCaptcha = class ReverseCaptcha {
    static Process(inputStr, intervalFn = null, callback = null) {
        if (typeof inputStr === 'object') {
            const options = inputStr;
            inputStr = options.input;
            intervalFn = options.intervalFn;
            callback = options.callback;
        }

        const charArray = inputStr.split('');

        if (cluster.isMaster) {
            let numWorkers = 0;
            while (numWorkers < numCpus) {
                cluster.fork({ workerId: numWorkers++, increment: numCpus });
            }

            let sum = 0;

            cluster.on('message', (worker, message, handle) => {
                if (message.hasOwnProperty('sum')) {
                    sum += message.sum;
                }
            });

            cluster.on('exit', () => {
                numWorkers--;
                if (numWorkers === 0) {
                    callback(sum);
                    cluster.disconnect();
                }
            });
        } else {
            const increment = parseInt(process.env.increment);
            let sum = 0;

            for (let index = parseInt(process.env.workerId); index < charArray.length; index += increment) {
                const num1 = charArray[index];
                const num2 = charArray[intervalFn(index, charArray) % charArray.length];
                if (num1 === num2) {
                    sum += parseInt(num1);
                }
            }

            process.send({ sum: sum });
            process.exit();
        }
    }
};