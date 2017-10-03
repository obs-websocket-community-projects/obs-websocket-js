require('./util/callbackPromise')(Promise);
const Socket = require('./Socket');
const Status = require('./Status');
const debug = require('debug')('obs-websocket-js:Core');
const API = require('./API');

let requestCounter = 0;

function generateMessageId() {
  return String(requestCounter++);
}

class OBSWebSocket extends Socket {
  constructor() {
    super();

    this.availableRequests = [];
    this.availableEvents = [];

    this.registerRequest(API.availableMethods);
    this.registerEvent(API.availableEvents);

    this.registerEvent(['ConnectionOpened', 'ConnectionClosed', 'AuthenticationSuccess', 'AuthenticationFailure']);
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
  send(requestType, args = {}, callback) {
    args = args || {};

    return new Promise((resolve, reject) => {
      const messageId = generateMessageId();
      let rejectReason;

      if (!requestType) {
        rejectReason = Status.REQUEST_TYPE_NOT_SPECIFIED;
      }

      if (!this._connected) {
        rejectReason = Status.NOT_CONNECTED;
      }

      // Assign a temporary event listener for this particular messageId to uniquely identify the response.
      this.once(`obs:internal:message:id-${messageId}`, (err, data) => {
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
          this._socket.send(JSON.stringify(args));
        } catch (e) {
          // TODO: Consider inspecting the exception thrown to gleam some relevant info and pass that on.
          rejectReason = Status.SOCKET_EXCEPTION;
        }
      }

      // If the socket call was unsuccessful or bypassed, simulate its resolution.
      if (rejectReason) {
        this.emit(`obs:internal:message:id-${messageId}`, rejectReason);
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
  registerRequest(requestNames = []) {
    if (!Array.isArray(requestNames)) {
      requestNames = [requestNames];
    }

    requestNames.forEach(requestName => {
      this.availableRequests.push(requestName);
      const handler = function (args, callback) {
        return this.send(requestName, args, callback);
      };

      this[requestName] = handler;
      this[requestName.charAt(0).toLowerCase() + requestName.slice(1)] = handler;
    });
  }

  /**
   * Add a new recognized event.
   * Enables usage with the following syntax.
   * `obs.onEventName(callback(data))`
   *
   * @param  {Array}  [eventNames=[]] String or Array of String event names as defined by the obs-websocket plugin.
   */
  registerEvent(eventNames = []) {
    if (!Array.isArray(eventNames)) {
      eventNames = [eventNames];
    }

    eventNames.forEach(eventName => {
      this.availableEvents.push(eventName);
      this[`on${eventName}`] = function (callback) {
        if (typeof callback !== 'function') {
          return;
        }

        this.on(eventName, data => {
          callback(data);
        });
      };
    });
  }
}

module.exports = OBSWebSocket;
