var WebSocket = require('ws');
var EventEmitter = require('events');
var Logger = require('./Logger');

var DEFAULT_PORT = 4444;
var _socket;
var log = new Logger('[OBS-Socket]');

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

class Socket extends EventEmitter {
  constructor(address = 'localhost', password = '') {
    super();
    this._connected = false;
    this._address = '';

    this.connect(address, password)
      .then(function() {
        log.info('Connection successful.');
      });
  }

  connect(address) {
    address += address.indexOf(':') > 0 ? '' : ':' + DEFAULT_PORT;

    if (this._connected) {
      _socket.close();
      this._connected = false;
    }

    return new Promise((resolve, reject) => {
      log.info('Attempting to connect to:', address);
      _socket = new WebSocket('ws://' + address);

      var self = this;

      _socket.onopen = function() {
        self._connected = true;
        self._address = address;

        // self.api = API.version[API.latestVersion];
        //
        // self.getVersion(function(err, data) {
        //   if (err)
        //     log.error('Error retrieving version:', err);
        //   else
        //     self.setAPIVersion(data[API.version[API.latestVersion].getVersion.response.obsWebsocketVersion]);
        // });
        //
        // self.getAuthenticationRequired(function(err, data) {
        //   if (err)
        //     log.error('Error determining authentication requirements:', err);
        //   else {
        //     if (data.authRequired) {
        //       self._auth.salt = data.salt;
        //       self._auth.challenge = data.challenge;
        //       self.authenticate(password);
        //     }
        //   }
        // });
        resolve();
      };

      _socket.onclose = function() {
        log.info('Connection closed:', address);
        self._connected = false;
        self._address = false;
      };

      _socket.onerror = function(evt) {
        log.error('Connected failed.', evt);
        self._connected = false;
        self._address = false;
        reject(evt);
      };

      _socket.onmessage = function(msg) {
        var data = JSON.parse(msg.data);
        data = camelCaseKeys(data);
        log.debug('[Message]', data);

        // Emit the message with ID if available, otherwise default to a non-messageId driven event.
        if (data.messageId) {
          log.debug('[Socket]', 'EMIT:', 'obs:internal:message:id-' + data.messageId, data);
          self.emit('obs:internal:message:id-' + data.messageId, data);
        } else {
          log.debug('[Socket]', 'EMIT:', 'obs:internal:event', data);
          self.emit('obs:internal:event', data);
        }
      };
    });
  }

  /**
   * Close and disconnect the WebSocket connection.
   *
   * @function
   * @category request
   */
  disconnect() {
    log.debug('Disconnect requested.');
    _socket.close();
  }

  send(messageId, args) {
    log.debug('[Request]', 'Args:', args);
    _socket.send(JSON.stringify(args));
  }
}

module.exports = Socket;
