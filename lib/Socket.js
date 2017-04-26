const WebSocket = require('ws');
const EventEmitter = require('events');
const AuthHashing = require('./AuthHashing');
const Status = require('./Status');
const url = require('url');
const debug = require('debug')('obs-websocket-js:Socket');
const logAmbiguousError = require('./util/logAmbiguousError');

const NOP = function () {};

const DEFAULT_PORT = 4444;

let AUTH = {
  required: true,
  salt: undefined,
  challenge: undefined
};

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
  constructor(address = 'localhost', password = '') {
    super();
    this._connected = false;
    this._socket = undefined;

    const originalEmit = this.emit;
    this.emit = function () {
      debug('[emit] %s %o', arguments[0], arguments[1]);
      originalEmit.apply(this, arguments);
    };

    this.connect({address})
      .then(() => {
        this.authenticate({password});
      }, err => {
        // This will only be called if the consumer has not attached their own .catch handler
        debug('Connection or Authentication failed:', err);
      });
  }

  _doCallback(callback, err, data) {
    callback = callback || NOP;

    try {
      callback(err, data);
    } catch (e) {
      logAmbiguousError(debug, 'Unable to resolve callback:', e);
    }
  }

  // TODO: Break this up a bit.
  // TODO: Clean up callbacks.
  connect(args = {}, callback) {
    args = args || {};
    let address = args.address || 'localhost';

    if (!url.parse(address).port) {
      address += ':' + DEFAULT_PORT;
    }

    if (this._connected) {
      this._socket.close();
      this._connected = false;
    }

    return new Promise((resolve, reject) => {
      debug('Attempting to connect to: %s', address);
      this._socket = new WebSocket('ws://' + address);

      this._socket.onopen = () => {
        this._connected = true;
        debug('Connection opened: %s', address);
        this.emit('obs:internal:event', {updateType: 'ConnectionOpened'});
        this._doCallback(callback, null, true);
        resolve();
      };

      this._socket.onclose = () => {
        this._connected = false;
        debug('Connection closed: %s', address);
        this.emit('obs:internal:event', {updateType: 'ConnectionClosed'});
      };

      this._socket.onerror = evt => {
        this._connected = false;
        debug('Connected failed: %s', evt.code);
        this._doCallback(callback, true, null);
        reject(evt);
      };

      this._socket.onmessage = msg => {
        debug('[OnMessage]: %o', msg.data);

        const data = camelCaseKeys(JSON.parse(msg.data));

        // Emit the message with ID if available, otherwise default to a non-messageId driven event.
        if (data.messageId) {
          this.emit('obs:internal:message:id-' + data.messageId, data);
        } else {
          this.emit('obs:internal:event', data);
        }
      };
    });
  }

  authenticate(args = {}, callback) {
    args = args || {};
    args.password = args.password || '';

    if (!this._connected) {
      this._doCallback(callback, Status.wrap(Status.NOT_CONNECTED), null);
      return Promise.reject(Status.wrap(Status.NOT_CONNECTED));
    }

    return this.getAuthRequired()
      .then(data => {
        AUTH = {
          required: data.authRequired,
          salt: data.salt,
          challenge: data.challenge
        };

        // Return early if authentication is not necessary.
        if (!AUTH.required) {
          this.emit('obs:internal:event', {updateType: 'AuthenticationSuccess'});
          this._doCallback(callback, null, Status.wrap(Status.AUTH_NOT_REQUIRED));
          return Promise.resolve(Status.wrap(Status.AUTH_NOT_REQUIRED));
        }

        const params = {
          auth: new AuthHashing(AUTH.salt, AUTH.challenge).hash(args.password)
        };

        return this.send('Authenticate', params, callback)
          .then(() => {
            debug('Authentification Success.');
            this.emit('obs:internal:event', {updateType: 'AuthenticationSuccess'});
          })
          .catch(() => {
            debug('Authentication Failure.');
            this.emit('obs:internal:event', {updateType: 'AuthenticationFailure'});
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
    this._socket.close();
  }
}

module.exports = Socket;
