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
    args = args || {};

    return new Promise((resolve, reject) => {
      if (!requestType) {
        debug('[send] %s', Status.REQUEST_TYPE_NOT_SPECIFIED.description);
        this._doCallback(callback, Status.wrap(Status.REQUEST_TYPE_NOT_SPECIFIED), null);
        reject(Status.wrap(Status.REQUEST_TYPE_NOT_SPECIFIED));
        return;
      }

      // Assign the core message details.
      args['request-type'] = requestType;
      const messageId = args['message-id'] = generateMessageId(); // eslint-disable-line no-multi-assign

      // Submit the request to the websocket.
      this._socket.send(JSON.stringify(args));
      debug('[send] %s %s %o', messageId, requestType, args);

      // Assign a temporary event listener for this particular messageId to uniquely identify the response.
      this.once('obs:internal:message:id-' + messageId, message => {
        // TODO: Do additional stuff with the msg to determine errors, marshaling, etc.
        // message = API.marshalResponse(requestType, message);

        if (message.status === 'error') {
          debug('[send:Response:reject] %o', message);
          this._doCallback(callback, message, null);
          reject(message);
        } else {
          debug('[send:Response:resolve] %o', message);
          this._doCallback(callback, null, message);
          resolve(message);
        }
      });
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
