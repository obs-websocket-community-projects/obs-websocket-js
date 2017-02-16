 var sha = require('sha.js/sha256');

var AuthHashing = function(salt = '', challenge = '') {
  this.salt = salt;
  this.challenge = challenge;

  this.hash = function(msg) {

    var hash = new sha('sha256')
      .update(msg)
      .update(this.salt)
      .digest('base64');

    var resp = new sha('sha256')
      .update(hash)
      .update(challenge)
      .digest('base64');

    return resp;
  };
};

module.exports = exports = AuthHashing;
