var API = require('./API');

var requestCounter = 0;
var responseCallbacks = {};

function generateMessageId() {
  return requestCounter++ + '';
}

function camelCaseKeys(obj) {
  obj = obj || {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var camelCasedKey = key.replace( /-([a-z])/gi, function ( $0, $1 ) { return $1.toUpperCase(); } );
      obj[camelCasedKey] = obj[key];
    }
  }

  return obj;
}

var Core = function(OBSWebSocket) {
  OBSWebSocket.prototype.setAPIVersion = function(version) {
    this.api = API.version[version];

    if (!this.api) {
      this.log.warn('API Version was not recognized. Defaulting to latest (' + API.latestVersion + ').');
      this.apiVersion = API.latestVersion;
      this.api = API.version[API.latestVersion];
    }

    this.log.debug('API Version set to ' + this.api.name + '.');
  };

  OBSWebSocket.prototype.emit = function(args) {
    this.log.info('[Emit]', args);
  };

  OBSWebSocket.prototype.sendRequest = function(requestType, args, callback) {
    args = args || {};
    callback = callback || function() {};

    if (!this._connected) {
      this.log.error('Not connected.');
    }

    var messageId = args[this.api.core.params.messageId || 'message-id'] = generateMessageId();
    var req = args[this.api.core.params.requestType || 'request-type'] = requestType;

    responseCallbacks[messageId] = {
      'requestType': req,
      'api': this.api.name,
      'callbackFunction': callback,
      'timestamp': Date.now()
    };

    this.log.debug('[Request]', args);
    this._socket.send(JSON.stringify(args));
  };

  OBSWebSocket.prototype.apiLookup = function(requestType, params, callback) {
    params = params || {};
    callback = callback || function() {};

    if (!this._connected) {
      this.log.error('Not connected.');
      return;
    }

    var func = this.api[requestType];
    if (!func) {
      var err = {
        'error': 'Unsupported',
        'message': 'API Version ' + this.api.name + ' does not support function: ' + requestType + '.',
        'api': this.api.name,
        'requestType': requestType
      };

      this.log.error(err.message);

      callback(err, null);
      return;
    }

    var args = {};
    for (var key in func.params) {
      if (func.params.hasOwnProperty(key)) {
        args[key] = params[key];
      }
    }

    this.sendRequest(func.name, args, callback);
  };

  OBSWebSocket.prototype.handleIncomingMessage = function(msg) {
    // var self = OBSWebSocket;
    var message = JSON.parse(msg.data);
    var err = null;

    if (!message)
      return;

    this.log.debug('[Message]', message);

    var updateType = message[this.api.core.response.updateType];
    var messageId = message[this.api.core.response.messageId];

    if (message.status === 'error') {
      this.log.error(message.error);
      err = message.error;
      message = null;
    }

    if (message) {
      message = camelCaseKeys(message);
    }

    if (updateType) {
      if (message) {
        buildEventCallback(updateType, message);
      }
    } else {
      var callback = responseCallbacks[messageId].callbackFunction;

      if (callback) {
        callback(err, message);
      }

      delete responseCallbacks[messageId];
    }
  };
};

module.exports = exports = Core;
