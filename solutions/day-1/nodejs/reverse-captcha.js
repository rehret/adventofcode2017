const cluster = require('cluster');
const { Readable, Transform, Writable } = require('stream');
const { EventEmitter } = require('events');

const SumEvent = 'sum';

class TupleReadStream extends Readable {
    constructor(options) {
        super(options);
        this._source = options.input;
        this._indices = options.indices;
        this._index = 0;
        this._intervalFn = options.intervalFn;
    }

    _read() {
        const tupleTarget = this._intervalFn(this._indices[this._index], JSON.parse(JSON.stringify(this._source))) % this._source.length;
        this.push(JSON.stringify([this._source[this._indices[this._index]], this._source[tupleTarget]]));

        this._index++;

        if (this._index === this._indices.length) {
            this.push(null);
        }
    }
}

class TupleMatchStream extends Transform {
    constructor(options) {
        super(options);
    }

    _transform(chunk, encoding, callback) {
        if (Buffer.isBuffer(chunk)) {
            chunk = chunk.toString();
        }

        const tuple = JSON.parse(chunk);
        this.push(tuple[0] === tuple[1] ? tuple[0] : '0');
        callback();
    }
}

class SumWriteStream extends Writable {
    constructor(options) {
        super(options);
        this._sum = 0;
        this.events = new EventEmitter();
    }

    _write(chunk, encoding, callback) {
        if (Buffer.isBuffer(chunk)) {
            chunk = chunk.toString();
        }

        this._sum += parseInt(chunk);
        callback();
    }

    _final(callback) {
        this.events.emit(SumEvent, this._sum);
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

        if (cluster.isMaster) {
            let numWorkers = 0;
            while (numWorkers < numCpus) {
                let workerIndices = [];
                for (let i = numWorkers; i < inputStr.length; i += numCpus) {
                    workerIndices.push(i);
                }

                let worker = cluster.fork({ workerId: numWorkers, indices: JSON.stringify(workerIndices) });
                numWorkers++;
            }

            let sum = 0;

            function messageHandler(msg) {
                sum += msg;
            }

            for (const id in cluster.workers) {
                const worker = cluster.workers[id];
                worker.on('message', messageHandler);
            }

            cluster.on('exit', () => {
                numWorkers--;
                if (numWorkers === 0) {
                    callback(sum);
                    cluster.disconnect();
                }
            });
        } else {
            const readStream = new TupleReadStream({
                input: inputStr.split(''),
                indices: JSON.parse(process.env.indices),
                intervalFn: intervalFn
            });
            const matchStream = new TupleMatchStream();
            const sumStream = new SumWriteStream();

            readStream.pipe(matchStream).pipe(sumStream);
            sumStream.events.on(SumEvent, sum => {
                process.send(sum);
                process.disconnect();
            });
        }
    }
};