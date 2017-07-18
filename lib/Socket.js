const WebSocket = require('ws');
const EventEmitter = require('events');
const hash = require('./util/authenticationHashing');
const Status = require('./Status');
const debug = require('debug')('obs-websocket-js:Socket');
const logAmbiguousError = require('./util/logAmbiguousError');
const camelCaseKeys = require('./util/camelCaseKeys');

const NOP = function () {};

class Socket extends EventEmitter {
  constructor() {
    super();
    this._connected = false;
    this._socket = undefined;

    const originalEmit = this.emit;
    this.emit = function () {
      // Log every emit to debug. Could be a bit noisy.
      debug('[emit] %s err: %o data: %o', arguments[0], arguments[1], arguments[2]);
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
      const address = args.address || 'localhost:4444';

      if (this._connected) {
        this._socket.close();
        this._connected = false;
      }

      await this._connect(address);
      this._connected = true;

      // This handler must be present before we can call _authenticate.
      this._socket.onmessage = msg => {
        // eslint-disable-next-line capitalized-comments
        debug('[OnMessage]: %o', msg);
        const message = camelCaseKeys(JSON.parse(msg.data));
        let err;
        let data;

        if (message.status === 'error') {
          err = message;
        } else {
          data = message;
        }

        // Emit the message with ID if available, otherwise try to find a non-messageId driven event.
        if (message.messageId) {
          this.emit('obs:internal:message:id-' + message.messageId, err, data);
        } else if (message.updateType) {
          this.emit(message.updateType, data);
        } else {
          logAmbiguousError(debug, 'Unrecognized Socket Message:', message);
        }
      };

      await this._authenticate(args.password);

      // Looks like this should be bound. We don't technically cancel the connection when the authentication fails.
      // This whole method really needs a rewrite.
      this._socket.onclose = () => {
        this._connected = false;
        debug('Connection closed: %s', address);
        this.emit('ConnectionClosed');
      };

      debug('Connection opened: %s', address);
      this.emit('ConnectionOpened');
      this._doCallback(callback);
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
   *
   * @param {String} address
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
   *
   * @param {String} [password='']
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
          debug('Authentication not Required');
          this.emit('AuthenticationSuccess');

          return Promise.resolve(Status.AUTH_NOT_REQUIRED);
        }

        return this.send('Authenticate', {
          auth: hash(data.salt, data.challenge, password)
        }).then(() => {
          debug('Authentication Success.');
          this.emit('AuthenticationSuccess');
        });
      })
      .catch(err => {
        debug('Authentication Failure. %o', err);
        this.emit('AuthenticationFailure', err);

        throw err;
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
