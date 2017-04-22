var WebSocket = require('ws');
var EventEmitter = require('events');
var AuthHashing = require('./AuthHashing');
var log = require('loglevel');
var url = require('url');

var NOP = function() {};

var DEFAULT_PORT = 4444;

var AUTH = {
  required: true,
  salt: undefined,
  challenge: undefined
};

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
    this._socket = undefined;

    this.connect(address)
      .catch(() => {
        log.error('Connection failed.');
        return Promise.reject;
      })

      .then(this.authenticate({ 'password': password }))

      .catch(log.error('Authentication failed.'));
  }

  connect(address) {
    if (!url.parse(address).port) {
      address += ':' + DEFAULT_PORT;
    }

    if (this._connected) {
      this._socket.close();
      this._connected = false;
    }

    return new Promise((resolve, reject) => {
      log.info('Attempting to connect to:', address);
      this._socket = new WebSocket('ws://' + address);

      this._socket.onopen = () => {
        log.info('Connection opened:', address);
        this.emit('obs:internal:event', { updateType: 'ConnectionOpened' });
        this._connected = true;
        resolve();
      };

      this._socket.onclose = () => {
        log.info('Connection closed:', address);
        this.emit('obs:internal:event', { updateType: 'ConnectionClosed' })
        this._connected = false;
      };

      this._socket.onerror = (evt) => {
        log.error('Connected failed.', evt.code);
        this._connected = false;
        reject(evt);
      };

      this._socket.onmessage = (msg) => {
        log.debug('[Socket:OnMessage]', msg);

        var data = camelCaseKeys(JSON.parse(msg.data));

        // Emit the message with ID if available, otherwise default to a non-messageId driven event.
        if (data.messageId) {
          log.debug('[Socket:Emit]', 'obs:internal:message:id-' + data.messageId, data);
          this.emit('obs:internal:message:id-' + data.messageId, data);
        } else {
          log.debug('[Socket:Emit]', 'obs:internal:event', data);
          this.emit('obs:internal:event', data);
        }
      };
    });
  }

  authenticate(args, callback) {
    args = args || {};
    args.password = args.password || '';
    callback = callback || NOP;

    return this.GetAuthRequired()
      .then((data) => {
        AUTH = {
          required: data.authRequired,
          salt: data.salt,
          challenge: data.challenge
        };

        // Return early if authentication is not necessary.
        if (!AUTH.required) {
          log.debug('Authentication Not Required.');
          this.emit('obs:internal:event', { updateType: 'AuthenticationSuccess' });
          try { callback(null, true); } catch (e) { }
          return true;
        }

        var params = {
          'auth': new AuthHashing(AUTH.salt, AUTH.challenge).hash(args.password)
        };

        return this.send('Authenticate', params, callback)
          .then(() => {
            log.debug('Authentication Success.');
            this.emit('obs:internal:event', { updateType: 'AuthenticationSuccess' });
            try { callback(null, true); } catch (e) { }
            return Promise.resolve();
          })
          .catch(() => {
            log.error('Authentication Failure.');
            this.emit('obs:internal:event', { updateType: 'AuthenticationFailure' });
            try { callback(true, null); } catch (e) { }
            return Promise.reject();
          });
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
    this._socket.close();
  }
}

module.exports = Socket;
