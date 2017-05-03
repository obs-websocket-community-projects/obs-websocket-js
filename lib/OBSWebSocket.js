const Socket = require('./Socket');
const Status = require('./Status');
const debug = require('debug')('obs-websocket-js:Core');

let requestCounter = 0;

function generateMessageId() {
  return String(requestCounter++);
}

class OBSWebSocket extends Socket {
  constructor() {
    super();

    // Bind all event emissions from the socket such that they are marshaled an re-emit at the base OBSWebSocket scope.
    this.on('obs:internal:event', this._handleEvent);
  }

  // Internal generic Socket request method. Returns a promise, handles callbacks.
  // Generates a messageId internally and will override any passed in the args.
  // Note that the requestType here is pre-marshaling and currently must match exactly what the websocket plugin is expecting.
  send(requestType, args = {}, callback) {
    // TODO: Improve this to ensure args is an object, not a function or primitive or something.
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
      this.once('obs:internal:message:id-' + messageId, (err, data) => {
        this._doCallback(callback, err, data);

        if (err) {
          debug('[send:reject] %o', err);
          reject(err);
        } else {
          debug('[send:resolve] %o', data);
          resolve(data);
        }
      });

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

      if (rejectReason) {
        this.emit('obs:internal:message:id-' + messageId, rejectReason);
      }
    });
  }

  // TODO: Marshal to use the API defined eventType rather than the obs-websocket defined one.
  // Perform some logic them re-emit the event to the public name.
  _handleEvent(message) {
    this.emit(message.updateType, message);
  }
}

require('./methodBinding')(OBSWebSocket);

module.exports = OBSWebSocket;
