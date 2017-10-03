'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./util/callbackPromise')(Promise);
var Socket = require('./Socket');
var Status = require('./Status');
var debug = require('debug')('obs-websocket-js:Core');
var API = require('./API');

var requestCounter = 0;

function generateMessageId() {
  return String(requestCounter++);
}

var OBSWebSocket = function (_Socket) {
  _inherits(OBSWebSocket, _Socket);

  function OBSWebSocket() {
    _classCallCheck(this, OBSWebSocket);

    var _this = _possibleConstructorReturn(this, (OBSWebSocket.__proto__ || Object.getPrototypeOf(OBSWebSocket)).call(this));

    _this.availableRequests = [];
    _this.availableEvents = [];

    _this.registerRequest(API.availableMethods);
    _this.registerEvent(API.availableEvents);

    _this.registerEvent(['ConnectionOpened', 'ConnectionClosed', 'AuthenticationSuccess', 'AuthenticationFailure']);
    return _this;
  }

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


  _createClass(OBSWebSocket, [{
    key: 'send',
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

    /**
     * Add a new recognized request.
     * Enables usage with the following syntaxes.
     * `obs.requestName({args}, callback(err, data)) returns Promise`
     * `obs.RequestName({args}, callback(err, data)) returns Promise`
     *
     * @param  {Array}  [requestNames=[]] String or Array of String request names as defined by the obs-websocket plugin.
     */

  }, {
    key: 'registerRequest',
    value: function registerRequest() {
      var _this3 = this;

      var requestNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (!Array.isArray(requestNames)) {
        requestNames = [requestNames];
      }

      requestNames.forEach(function (requestName) {
        _this3.availableRequests.push(requestName);
        var handler = function handler(args, callback) {
          return this.send(requestName, args, callback);
        };

        _this3[requestName] = handler;
        _this3[requestName.charAt(0).toLowerCase() + requestName.slice(1)] = handler;
      });
    }

    /**
     * Add a new recognized event.
     * Enables usage with the following syntax.
     * `obs.onEventName(callback(data))`
     *
     * @param  {Array}  [eventNames=[]] String or Array of String event names as defined by the obs-websocket plugin.
     */

  }, {
    key: 'registerEvent',
    value: function registerEvent() {
      var _this4 = this;

      var eventNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (!Array.isArray(eventNames)) {
        eventNames = [eventNames];
      }

      eventNames.forEach(function (eventName) {
        _this4.availableEvents.push(eventName);
        _this4[`on${eventName}`] = function (callback) {
          if (typeof callback !== 'function') {
            return;
          }

          this.on(eventName, function (data) {
            callback(data);
          });
        };
      });
    }
  }]);

  return OBSWebSocket;
}(Socket);

module.exports = OBSWebSocket;