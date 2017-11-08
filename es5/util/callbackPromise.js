'use strict';

var nextTick = void 0;

if (typeof setImmediate === 'function') {
  nextTick = setImmediate;
} else if (typeof process === 'object' && process && process.nextTick) {
  nextTick = process.nextTick;
} else {
  nextTick = function nextTick(callback) {
    setTimeout(callback, 0);
  };
}

/**
 * Adds a `.callback` method to Promise to handle errbacks.
 * Will be ignored if the passed Object is not a function.
 *
 * @param {Object} promise The currently active Promise object.
 */
module.exports = function (promise) {
  promise.prototype.callback = function (cb) {
    if (typeof cb !== 'function') {
      return this;
    }

    return this.then(function (res) {
      nextTick(function () {
        return cb(null, res);
      });
    }).catch(function (err) {
      nextTick(function () {
        return cb(err);
      });
    });
  };
};