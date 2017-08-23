'use strict';

var SHA256 = require('sha.js/sha256');

/**
 * SHA256 Hashing.
 *
 * @param  {String} [salt='']
 * @param  {String} [challenge='']
 * @param  {String} msg Message to encode.
 * @return {String}
 */
module.exports = function () {
  var salt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var challenge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var msg = arguments[2];

  var hash = new SHA256().update(msg).update(salt).digest('base64');

  var resp = new SHA256().update(hash).update(challenge).digest('base64');

  return resp;
};