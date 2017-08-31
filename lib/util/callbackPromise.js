'use strict';

let nextTick;

if (typeof setImmediate === 'function') {
  nextTick = setImmediate;
} else if (typeof process === 'object' && process && process.nextTick) {
  nextTick = process.nextTick;
} else {
  nextTick = function (callback) {
    setTimeout(callback, 0);
  };
}

module.exports = function (promise) {
  promise.prototype.callback = function (cb) {
    if (typeof cb !== 'function') {
      return this;
    }

    return this
      .then(res => {
        nextTick(() => cb(null, res));
      })
      .catch(err => {
        nextTick(() => cb(err));
      });
  };
};
