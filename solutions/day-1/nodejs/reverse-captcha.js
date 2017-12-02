const cluster = require('cluster');
const { Readable, Transform, Writable } = require('stream');
const { EventEmitter } = require('events');

const MatchEvent = 'match';
const DoneMatchingEvent = 'done';

class TupleReadStream extends Readable {
    constructor(options) {
        super(options);
        this._source = options.input;
        this._index = options.index;
        this._intervalFn = options.intervalFn;
    }

    _read() {
        const tupleTarget = this._intervalFn(this._index, JSON.parse(JSON.stringify(this._source))) % this._source.length;
        this.push(JSON.stringify([parseInt(this._source[this._index]), parseInt(this._source[tupleTarget])]));
        this.push(null);
    }
}

class MatchWriteStream extends Writable {
    constructor(options) {
        super(options);
        this.events = new EventEmitter();
    }

    _write(chunk, encoding, callback) {
        if (Buffer.isBuffer(chunk)) {
            chunk = chunk.toString();
        }

        const tuple = JSON.parse(chunk);
        if (tuple[0] === tuple[1]) {
            this.events.emit(MatchEvent, tuple[0]);
        }
        callback();
    }

    _final(callback) {
        this.events.emit(DoneMatchingEvent);
        callback();
    }
}

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
                cluster.fork({ workerId: numWorkers++ });
            }

            let sum = 0;
            let index = 0;

            cluster.on('message', (worker, message, handle) => {
                if (message.match) {
                    sum += message.match;
                } else if (message.ready) {
                    if (++index < inputStr.length) {
                        worker.send({ index: index });
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
                if (message.index) {
                    message.index = parseInt(message.index);
                    if (message.index === -1) {
                        process.exit();
                    }

                    const readStream = new TupleReadStream({
                        input: charArray,
                        index: message.index,
                        intervalFn: intervalFn
                    });
                    const matchStream = new MatchWriteStream();

                    readStream.pipe(matchStream);

                    matchStream.events.on(MatchEvent, match => {
                        process.send({ match: match });
                    });
                    matchStream.events.on(DoneMatchingEvent, () => {
                        process.send({ ready: true });
                    });
                }
            });
            process.send({ ready: true });
        }
    }
};