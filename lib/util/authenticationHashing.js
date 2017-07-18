const SHA256 = require('sha.js/sha256');

/**
 * SHA256 Hashing.
 *
 * @param  {String} [salt='']
 * @param  {String} [challenge='']
 * @param  {String} msg Message to encode.
 * @return {String}
 */
module.exports = function (salt = '', challenge = '', msg) {
  const hash = new SHA256()
    .update(msg)
    .update(salt)
    .digest('base64');

  const resp = new SHA256()
    .update(hash)
    .update(challenge)
    .digest('base64');

  return resp;
};
