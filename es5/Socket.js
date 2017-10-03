'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./util/callbackPromise')(Promise);
var WebSocket = require('ws');
var EventEmitter = require('events');
var hash = require('./util/authenticationHashing');
var Status = require('./Status');
var debug = require('debug')('obs-websocket-js:Socket');
var logAmbiguousError = require('./util/logAmbiguousError');
var camelCaseKeys = require('./util/camelCaseKeys');

var Socket = function (_EventEmitter) {
  _inherits(Socket, _EventEmitter);

  function Socket() {
    _classCallCheck(this, Socket);

    var _this = _possibleConstructorReturn(this, (Socket.__proto__ || Object.getPrototypeOf(Socket)).call(this));

    _this._connected = false;
    _this._socket = undefined;

    var originalEmit = _this.emit;
    _this.emit = function () {
      // Log every emit to debug. Could be a bit noisy.
      debug('[emit] %s err: %o data: %o', arguments[0], arguments[1], arguments[2]);
      originalEmit.apply(this, arguments);
    };
    return _this;
  }

  _createClass(Socket, [{
    key: 'connect',
    value: function () {
      var _ref = _asyncToGenerator(function* () {
        var _this2 = this;

        var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = arguments[1];

        args = args || {};
        var address = args.address || 'localhost:4444';

        if (this._connected) {
          this._socket.close();
        }

        return new Promise(function () {
          var _ref2 = _asyncToGenerator(function* (resolve, reject) {
            try {
              yield _this2._connect(address);
              yield _this2._authenticate(args.password);
              resolve();
            } catch (err) {
              _this2._socket.close();
              _this2._connected = false;
              logAmbiguousError(debug, 'Connection failed:', err);
              reject(err);
            }
          });

          return function (_x2, _x3) {
            return _ref2.apply(this, arguments);
          };
        }()).callback(callback);
      });

      function connect() {
        return _ref.apply(this, arguments);
      }

      return connect;
    }()

    /**
     * Opens a WebSocket connection to an obs-websocket server, but does not attempt any authentication.
     *
     * @param {String} address
     * @returns {Promise}
     * @private
     */

  }, {
    key: '_connect',
    value: function () {
      var _ref3 = _asyncToGenerator(function* (address) {
        var _this3 = this;

        return new Promise(function (resolve, reject) {
          var settled = false;

          debug('Attempting to connect to: %s', address);
          _this3._socket = new WebSocket('ws://' + address);

          // We only handle the initial connection error.
          // Beyond that, the consumer is responsible for adding their own generic `error` event listener.
          _this3._socket.onerror = function (error) {
            if (settled) {
              logAmbiguousError(debug, 'Unknown Socket Error', error);
              _this3.emit('error', error);
              return;
            }

            settled = true;
            reject(error);
          };

          _this3._socket.onopen = function () {
            if (settled) {
              return;
            }

            _this3._connected = true;
            settled = true;

            debug('Connection opened: %s', address);
            _this3.emit('ConnectionOpened');
            resolve();
          };

          // Looks like this should be bound. We don't technically cancel the connection when the authentication fails.
          _this3._socket.onclose = function () {
            _this3._connected = false;
            debug('Connection closed: %s', address);
            _this3.emit('ConnectionClosed');
          };

          // This handler must be present before we can call _authenticate.
          _this3._socket.onmessage = function (msg) {
            // eslint-disable-next-line capitalized-comments
            debug('[OnMessage]: %o', msg);
            var message = camelCaseKeys(JSON.parse(msg.data));
            var err = void 0;
            var data = void 0;

            if (message.status === 'error') {
              err = message;
            } else {
              data = message;
            }

            // Emit the message with ID if available, otherwise try to find a non-messageId driven event.
            if (message.messageId) {
              _this3.emit(`obs:internal:message:id-${message.messageId}`, err, data);
            } else if (message.updateType) {
              _this3.emit(message.updateType, data);
            } else {
              logAmbiguousError(debug, 'Unrecognized Socket Message:', message);
              _this3.emit('error', message);
            }
          };
        });
      });

      function _connect(_x4) {
        return _ref3.apply(this, arguments);
      }

      return _connect;
    }()

    /**
     * Authenticates to an obs-websocket server. Must already have an active connection before calling this method.
     *
     * @param {String} [password='']
     * @returns {Promise}
     * @private
     */

  }, {
    key: '_authenticate',
    value: function () {
      var _ref4 = _asyncToGenerator(function* () {
        var password = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        if (!this._connected) {
          throw Status.NOT_CONNECTED;
        }

        var auth = yield this.getAuthRequired();

        if (!auth.authRequired) {
          debug('Authentication not Required');
          this.emit('AuthenticationSuccess');
          return Status.AUTH_NOT_REQUIRED;
        }

        try {
          yield this.send('Authenticate', {
            auth: hash(auth.salt, auth.challenge, password)
          });
        } catch (e) {
          debug('Authentication Failure %o', e);
          this.emit('AuthenticationFailure');
          throw e;
        }

        debug('Authentication Success');
        this.emit('AuthenticationSuccess');
      });

      function _authenticate() {
        return _ref4.apply(this, arguments);
      }

      return _authenticate;
    }()

    /**
     * Close and disconnect the WebSocket connection.
     *
     * @function
     * @category request
     */

  }, {
    key: 'disconnect',
    value: function disconnect() {
      debug('Disconnect requested.');
      if (this._socket) {
        this._socket.close();
      }
    }
  }]);

  return Socket;
}(EventEmitter);

module.exports = Socket;