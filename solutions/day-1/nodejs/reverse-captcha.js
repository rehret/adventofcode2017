const { Readable, Transform, Writable } = require('stream');
const { EventEmitter } = require('events');

const SumEvent = 'sum';

class TupleReadStream extends Readable {
    constructor(options) {
        super(options);
        this._source = options.input.split('');
        this._index = 0;
        this._intervalFn = options.intervalFn;
    }

    _read() {
        const tupleTarget = this._intervalFn(new Number(this._index), JSON.parse(JSON.stringify(this._source))) % this._source.length;
        this.push(JSON.stringify([this._source[this._index], this._source[tupleTarget]]));

        this._index++;

        if (this._index === this._source.length) {
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

module.exports.ReverseCaptcha = class ReverseCaptcha {
    static Process(inputStr, intervalFn = null, callback = null) {
        if (typeof inputStr === 'object') {
            const options = inputStr;
            inputStr = options.input;
            intervalFn = options.intervalFn;
            callback = options.callback;
        }
        const readStream = new TupleReadStream({
            input: inputStr,
            intervalFn: intervalFn
        });
        const matchStream = new TupleMatchStream();
        const sumStream = new SumWriteStream();

        readStream.pipe(matchStream).pipe(sumStream);
        sumStream.events.on(SumEvent, callback);
    }
};