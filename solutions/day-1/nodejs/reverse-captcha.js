const { Readable } = require('stream');
const { EventEmitter } = require('events');

module.exports.ReverseCaptcha = class ReverseCaptcha {
    constructor(inputStr, intervalFn) {
        let sum = 0;
        const internalEvents = new EventEmitter();
        const publicEvents = new EventEmitter();

        class TupleStream extends Readable {
            constructor(options) {
                super(options);
                this._source = options.input;
                this._index = 0;
            }

            _read() {
                const nextIndex = intervalFn(new Number(this._index), JSON.parse(JSON.stringify(this._source))) % this._source.length;
                this.push(JSON.stringify([this._source[this._index], this._source[nextIndex]]));

                this._index++;

                if (this._index === this._source.length) {
                    this.push(null);
                }
            }
        }

        const stream = new TupleStream({ input: inputStr.split('') });

        internalEvents.on('match', val => {
            sum += val;
        });

        internalEvents.on('done', () => {
            publicEvents.emit('sum', sum);
        });

        stream.on('data', tupleStr => {
            const tuple = JSON.parse(tupleStr);
            if (tuple[0] === tuple[1]) {
                internalEvents.emit('match', parseInt(tuple[0]));
            }
        });

        stream.on('end', () => {
            internalEvents.emit('done');
        });

        this.on = (...args) => {
            return publicEvents.on(...args);
        }
    }
}