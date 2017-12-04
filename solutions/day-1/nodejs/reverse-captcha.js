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
                cluster.fork({ workerId: ++numWorkers });
            }

            let sum = 0;
            let index = 0;

            cluster.on('message', (worker, message, handle) => {
                if (message.match) {
                    sum += message.match;
                } else if (message.ready) {
                    if (index < charArray.length) {
                        worker.send({ index: index });
                        index++;
                    } else {
                        worker.send({ index: -1 });
                    }
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
            process.on('message', (message) => {
                if (message.hasOwnProperty('index')) {
                    message.index = parseInt(message.index);
                    if (message.index === -1) {
                        process.exit();
                    }

                    const num1 = charArray[message.index];
                    const num2 = charArray[intervalFn(message.index, charArray) % charArray.length];
                    if (num1 === num2) {
                        process.send({ match: parseInt(num1) });
                    }

                    process.send({ ready: true });
                }
            });
            process.send({ ready: true });
        }
    }
};