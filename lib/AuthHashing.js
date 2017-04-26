const SHA256 = require('sha.js/sha256');

class AuthHashing {
  constructor(salt, challenge) {
    this.salt = salt || '';
    this.challenge = challenge || '';

    this.hash = function (msg) {
      const hash = new SHA256()
        .update(msg)
        .update(this.salt)
        .digest('base64');

      const resp = new SHA256()
        .update(hash)
        .update(challenge)
        .digest('base64');

      return resp;
    };
  }
}

module.exports = AuthHashing;
