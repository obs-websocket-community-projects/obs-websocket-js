'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./util/callbackPromise')(Promise);
var Socket = require('./Socket');
var Status = require('./Status');
var debug = require('debug')('obs-websocket-js:Core');

var requestCounter = 0;

function generateMessageId() {
  return String(requestCounter++);
}

var OBSWebSocket = function (_Socket) {
  _inherits(OBSWebSocket, _Socket);

  function OBSWebSocket() {
    _classCallCheck(this, OBSWebSocket);

    return _possibleConstructorReturn(this, (OBSWebSocket.__proto__ || Object.getPrototypeOf(OBSWebSocket)).apply(this, arguments));
  }

  _createClass(OBSWebSocket, [{
    key: 'send',

    /**
     * Internal generic Socket request method. Returns a promise, handles callbacks.
     * Generates a messageId internally and will override any passed in the args.
     * Note that the requestType here is pre-marshaling and currently must match exactly what the websocket plugin is expecting.
     *
     * @param  {String}   requestType obs-websocket plugin expected request type.
     * @param  {Object}   [args={}]   request arguments.
     * @param  {Function} callback    Optional. callback(err, data)
     * @return {Promise}              Promise, passes the plugin response object.
     */
    value: function send(requestType) {
      var _this2 = this;

      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var callback = arguments[2];

      args = args || {};

      return new Promise(function (resolve, reject) {
        var messageId = generateMessageId();
        var rejectReason = void 0;

        if (!requestType) {
          rejectReason = Status.REQUEST_TYPE_NOT_SPECIFIED;
        }

        if (!_this2._connected) {
          rejectReason = Status.NOT_CONNECTED;
        }

        // Assign a temporary event listener for this particular messageId to uniquely identify the response.
        _this2.once(`obs:internal:message:id-${messageId}`, function (err, data) {
          if (err) {
            debug('[send:reject] %o', err);
            reject(err);
          } else {
            debug('[send:resolve] %o', data);
            resolve(data);
          }
        });

        // If we don't have a reason to fail fast, send the request to the socket.
        if (!rejectReason) {
          args['request-type'] = requestType;
          args['message-id'] = messageId;

          // Submit the request to the websocket.
          debug('[send] %s %s %o', messageId, requestType, args);
          try {
            _this2._socket.send(JSON.stringify(args));
          } catch (e) {
            // TODO: Consider inspecting the exception thrown to gleam some relevant info and pass that on.
            rejectReason = Status.SOCKET_EXCEPTION;
          }
        }

        // If the socket call was unsuccessful or bypassed, simulate its resolution.
        if (rejectReason) {
          _this2.emit(`obs:internal:message:id-${messageId}`, rejectReason);
        }
      }).callback(callback);
    }
  }]);

  return OBSWebSocket;
}(Socket);

module.exports = OBSWebSocket;