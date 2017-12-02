const { Readable, Transform, Writable } = require('stream');

class StringStream extends Readable {
    constructor(options) {
        super(options);
        this._input = options.input;
    }

    _read() {
        this.push(this._input);
        this.push(null);
    }
}

class LineSplitterTransformStream extends Transform {
    constructor(options) {
        super(options);
    }

    _transform(chunk, encoding, callback) {
        if (Buffer.isBuffer(chunk)) {
            chunk = chunk.toString();
        }

        chunk.split('\n').forEach(line => this.push(line));
        callback();
    }
}

class LineMinMaxDifferenceStream extends Transform {
    constructor(options) {
        super(options);
    }

    _transform(chunk, encoding, callback) {
        if (Buffer.isBuffer(chunk)) {
            chunk = chunk.toString();
        }
        const values = chunk.split(/\s+/).map(val => parseInt(val));
        const max = values.reduce((max, val) => val > max ? val : max);
        const min = values.reduce((min, val) => val < min ? val : min);
        this.push((max - min).toString());
        callback();
    }
}

class ChecksumWritableStream extends Writable {
    constructor(options) {
        super(options);
        this.sum = 0;
    }

    _write(chunk, encoding, callback) {
        if (Buffer.isBuffer(chunk)) {
            chunk = chunk.toString();
        }
        const val = parseInt(chunk);
        this.sum += val;
        callback();
    }

    _final(callback) {
        this.emit('data', this.sum);
        callback();
    }
}

module.exports.Checksum = class Checksum {
    static parse(input, callback = null) {
        if (typeof input === 'object') {
            const options = input;
            input = options.input;
            callback = options.callback;
        }

        new StringStream({ input: input })
        .pipe(new LineSplitterTransformStream())
        .pipe(new LineMinMaxDifferenceStream())
        .pipe(new ChecksumWritableStream())
        .on('data', data => callback(data));
    }
};

