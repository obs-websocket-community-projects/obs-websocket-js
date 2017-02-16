var WebSocket = require('ws');
var API = require('./API');
var DEFAULT_PORT = 4444;

var Socket = function(OBSWebSocket) {

  /**
   * Initialize and authenticate the WebSocket connection.
   *
   * @function
   * @category request
   * @param address=localhost {string} - IP Adddress to connect to, with or without port.
   * @param password='' {string=} - Defaults to empty.
   */
  OBSWebSocket.prototype.connect = function(address = 'localhost', password = '') {
    address += address.indexOf(':') > 0 ? '' : ':' + DEFAULT_PORT;

    if (this._connected) {
      this._socket.close();
      this._connected = false;
    }

    this._socket = new WebSocket('ws://' + address);

    var self = this;

    this._socket.onopen = function() {
      self._connected = true;
      self.api = API.version[API.latestVersion];

      self.getVersion(function(err, data) {
        if (err)
          self.log.error('Error retrieving version:', err);
        else
          self.setAPIVersion(data[API.version[API.latestVersion].getVersion.response.obsWebsocketVersion]);
      });

      self.getAuthenticationRequired(function(err, data) {
        if (err)
          self.log.error('Error determining authentication requirements:', err);
        else {
          if (data.authRequired) {
            self._auth.salt = data.salt;
            self._auth.challenge = data.challenge;
            self.authenticate(password);
          }
        }
      });
    };

    this._socket.onclose = function() {
      if (self._connected) {
        self.emit('onConnectionClosed');
      }
      self.connected = false;
    };

    this._socket.onerror = function(evt) {
      self.emit('onConnectionFailed', evt);
      self._connected = false;
    };

    this._socket.onmessage = function(msg) {
      self.handleIncomingMessage(msg);
    };
  };

  /**
   * Close and disconnect the WebSocket connection.
   *
   * @function
   * @category request
   */
  OBSWebSocket.prototype.disconnect = function() {
    this._socket.close();
  };
};

module.exports = exports = Socket;
