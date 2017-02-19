var SHA256 = require('sha.js/sha256');

var AuthHashing = function(salt, challenge) {
  this.salt = salt || '';
  this.challenge = challenge || '';

  this.hash = function(msg) {

    var hash = new SHA256()
      .update(msg)
      .update(this.salt)
      .digest('base64');

    var resp = new SHA256()
      .update(hash)
      .update(challenge)
      .digest('base64');

    return resp;
  };
};

module.exports = exports = AuthHashing;
