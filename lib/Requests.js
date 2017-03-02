var AuthHashing = require('./AuthHashing');
var Logger = require('./Logger');
var _API = require('./API');
var API = new _API();
var log = new Logger('[OBS-Requests]');

var AUTH = {
  salt: undefined,
  chellenge: undefined
};

var NOP = function() {};

var Requests = function(OBSWebSocket) {
  API.availableMethods.forEach(method => {
    OBSWebSocket.prototype[method] = function(args, callback) {
      return this._sendRequest(method, args, callback);
    };
  });

  API.availableEvents.forEach(event => {
    OBSWebSocket.prototype[event] = function(callback) {
      this.on('obs:event:' + event, (msg) => {
        if (msg.status === 'error') {
          log.error(msg.error);
          callback(msg, null);
        } else {
          callback(null, msg);
        }
      });
    };
  });

  OBSWebSocket.prototype.StreamStatus = function(callback) {
    this.on('obs:event:StreamStatus', (msg) => {
      if (msg.status === 'error') {
        log.error(msg.error);
        callback(msg, null);
      } else {
        callback(null, msg);
      }
    });
  }

  OBSWebSocket.prototype.getVersion = function(args, callback) {
    return this._sendRequest('getVersion', args, callback)
      .then((data) => {
        this.setVersion(data.websocketVersion);
        return data;
      });
  };

  OBSWebSocket.prototype.getAuthenticationRequired = function(args, callback) {
    return this._sendRequest('getAuthenticationRequired', args, callback)
      .then((data) => {
        AUTH.salt = data.salt;
        AUTH.challenge = data.challenge;
        return data;
      });
  };

  OBSWebSocket.prototype.authenticate = function(args, callback) {
    args = args || {};
    args.password = args.password || '';
    callback = callback || NOP;

    var params = {
      'auth': new AuthHashing(AUTH.salt, AUTH.challenge).hash(args.password)
    };

    return new Promise((resolve, reject) => {
      this._sendRequest('authenticate', params, callback)
        .then(() => {
          log.info('Authentication Success.');
          callback(null, true);
          this._emitEvent('onAuthenticationSuccess', {});
          resolve();
        }, () => {
          log.error('Authentication Failure.');
          callback(true, null);
          this._emitEvent('onAuthenticationFailure', {});
          reject();
        });
    });
  };
};

module.exports = exports = Requests;
