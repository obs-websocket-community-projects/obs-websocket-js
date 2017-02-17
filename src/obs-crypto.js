OBSWebSocket.prototype._webCryptoHash = function(pass, callback) {
  var self = this;

  var utf8Pass = _encodeStringAsUTF8(pass);
  var utf8Salt = _encodeStringAsUTF8(this._auth.salt);
  var ab1 = _stringToArrayBuffer(utf8Pass + utf8Salt);

  crypto.subtle.digest('SHA-256', ab1)
    .then(function(authHash) {
      var utf8AuthHash = _encodeStringAsUTF8(_arrayBufferToBase64(authHash));
      var utf8Challenge = _encodeStringAsUTF8(self._auth.challenge);
      var ab2 = _stringToArrayBuffer(utf8AuthHash + utf8Challenge);

      crypto.subtle.digest('SHA-256', ab2)
        .then(function(authResp) {
          var authRespB64 = _arrayBufferToBase64(authResp);
          callback(authRespB64);
        });
    });
};

OBSWebSocket.prototype._cryptoJSHash = function(pass, callback) {
  var utf8Pass = _encodeStringAsUTF8(pass);
  var utf8Salt = _encodeStringAsUTF8(this._auth.salt);

  var authHash = CryptoJS.SHA256(utf8Pass + utf8Salt).toString(CryptoJS.enc.Base64);

  var utf8AuthHash = _encodeStringAsUTF8(authHash);
  var utf8Challenge = _encodeStringAsUTF8(this._auth.challenge);

  var authResp = CryptoJS.SHA256(utf8AuthHash + utf8Challenge).toString(CryptoJS.enc.Base64);
  callback(authResp);
};

OBSWebSocket.prototype._nodeCryptoHash = function(pass, callback) {
  var authHasher = crypto.createHash('sha256');

  var utf8Pass = _encodeStringAsUTF8(pass);
  var utf8Salt = _encodeStringAsUTF8(this._auth.salt);

  authHasher.update(utf8Pass + utf8Salt);
  var authHash = authHasher.digest('base64');

  var respHasher = crypto.createHash('sha256');

  var utf8AuthHash = _encodeStringAsUTF8(authHash);
  var utf8Challenge = _encodeStringAsUTF8(this._auth.challenge);

  respHasher.update(utf8AuthHash + utf8Challenge);
  var respHash = respHasher.digest('base64');

  callback(respHash);
};

function _encodeStringAsUTF8(string) {
  return unescape(encodeURIComponent(string));
}

function _stringToArrayBuffer(string) {
  var ret = new Uint8Array(string.length);
  for (var i = 0; i < string.length; i++) {
    ret[i] = string.charCodeAt(i);
  }

  return ret.buffer;
}

function _arrayBufferToBase64(arrayBuffer) {
  var binary = '';
  var bytes = new Uint8Array(arrayBuffer);

  var length = bytes.byteLength;
  for (var i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

var crypto = {};

if (isModule()) {
  crypto = require('crypto');
  OBSWebSocket.prototype._authHash = OBSWebSocket.prototype._nodeCryptoHash;
} else {
  crypto = window.crypto || window.msCrypto || {};
  OBSWebSocket.prototype._authHash = OBSWebSocket.prototype._webCryptoHash;

  if (typeof crypto.subtle === 'undefined') {
    if (typeof crypto.webkitSubtle === 'undefined') {
      if (typeof CryptoJS === 'undefined') {
        throw new Error('OBS WebSocket requires CryptoJS when native crypto is unavailable.');
      }
      OBSWebSocket.prototype._authHash = OBSWebSocket.prototype._cryptoJSHash;
    } else {
      crypto.subtle = crypto.webkitSubtle;
    }
  }
}
