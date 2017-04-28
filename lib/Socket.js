const WebSocket = require('ws');
const EventEmitter = require('events');
const AuthHashing = require('./AuthHashing');
const Status = require('./Status');
const debug = require('debug')('obs-websocket-js:Socket');
const logAmbiguousError = require('./util/logAmbiguousError');

const NOP = function () {};

const DEFAULT_PORT = 4444;

function camelCaseKeys(obj) {
  obj = obj || {};
  for (const key in obj) {
    if (!{}.hasOwnProperty.call(obj, key)) {
      continue;
    }

    const camelCasedKey = key.replace(/-([a-z])/gi, ($0, $1) => {
      return $1.toUpperCase();
    });
    obj[camelCasedKey] = obj[key];
  }

  return obj;
}

class Socket extends EventEmitter {
  constructor() {
    super();
    this._connected = false;
    this._socket = undefined;

    const originalEmit = this.emit;
    this.emit = function () {
      // Log every emit to debug. Could be a bit noisy.
      debug('[emit] %s %o', arguments[0], arguments[1]);
      originalEmit.apply(this, arguments);
    };
  }

  _doCallback(callback, err, data) {
    callback = callback || NOP;

    try {
      callback(err, data);
    } catch (e) {
      logAmbiguousError(debug, 'Unable to resolve callback:', e);
      this.emit('error', e); // Forward the error so that we're not completely swallowing it.
    }
  }

  async connect(args = {}, callback) {
    try {
      args = args || {};
      let address = args.address || 'localhost';

      // If no port was provided, add the default port.
      if (!/(?::\d{2,4})/.test(address)) {
        address += ':' + DEFAULT_PORT;
      }

      if (this._connected) {
        this._socket.close();
        this._connected = false;
      }

      await this._connect(address);
      this._connected = true;

      // This handler must be present before we can call _authenticate.
      this._socket.onmessage = msg => {
        // eslint-disable-next-line capitalized-comments
        // debug('[OnMessage]: %o', msg);
        const data = camelCaseKeys(JSON.parse(msg.data));

        // Emit the message with ID if available, otherwise default to a non-messageId driven event.
        if (data.messageId) {
          this.emit('obs:internal:message:id-' + data.messageId, data);
        } else {
          this.emit('obs:internal:event', data);
        }
      };

      await this._authenticate(args.password);

      this._socket.onclose = () => {
        this._connected = false;
        debug('Connection closed: %s', address);
        this.emit('obs:internal:event', {updateType: 'ConnectionClosed'});
      };

      debug('Connection opened: %s', address);
      this.emit('obs:internal:event', {updateType: 'ConnectionOpened'});
      this._doCallback(callback, null);
    } catch (err) {
      this._connected = false;
      logAmbiguousError(debug, 'Connection failed:', err);
      this._socket.close();
      this._doCallback(callback, err);
      return Promise.reject(err);
    }
  }

  /**
   * Opens a WebSocket connection to an obs-websocket server, but does not attempt any authentication.
   * @param address {String}
   * @returns {Promise}
   * @private
   */
  _connect(address) {
    return new Promise((resolve, reject) => {
      let settled = false;

      debug('Attempting to connect to: %s', address);
      this._socket = new WebSocket('ws://' + address);

      // We only handle initial connection errors.
      // Beyond that, the consumer is responsible for adding their own `error` event listener.
      this._socket.onerror = error => {
        if (settled) {
          return;
        }

        settled = true;
        reject(error);
      };

      this._socket.onopen = () => {
        if (settled) {
          return;
        }

        settled = true;
        resolve();
      };
    });
  }

  /**
   * Authenticates to an obs-websocket server. Must already have an active connection before calling this method.
   * @param [password=''] {String}
   * @returns {Promise}
   * @private
   */
  _authenticate(password = '') {
    if (!this._connected) {
      return Promise.reject(Status.NOT_CONNECTED);
    }

    return this.getAuthRequired()
      .then(data => {
        // Return early if authentication is not necessary.
        if (!data.authRequired) {
          this.emit('obs:internal:event', {updateType: 'AuthenticationSuccess'});
          return Promise.resolve(Status.AUTH_NOT_REQUIRED);
        }

        return this.send('Authenticate', {
          auth: new AuthHashing(data.salt, data.challenge).hash(password)
        }).then(() => {
          debug('Authentication Success.');
          this.emit('obs:internal:event', {updateType: 'AuthenticationSuccess'});
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
    debug('Disconnect requested.');
    if (this._socket) {
      this._socket.close();
    }
  }
}

module.exports = Socket;
