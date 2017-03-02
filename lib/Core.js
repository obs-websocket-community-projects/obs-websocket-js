var EventEmitter = require('events');
var Logger = require('./Logger');
var Socket = require('./Socket');
var _API = require('./API');
var API = new _API();
var log = new Logger('[OBS-Core]');

var NOP = function() {};

var requestCounter = 0;

function generateMessageId() {
  return requestCounter++ + '';
}

class Core extends EventEmitter {
  constructor(address, password) {
    super();

    // Set up a link to the Socket
    // Bind all event emissions from the socket such that they are marshaled an re-emit at the base OBSWebSocket scope.
    this._socket = new Socket(address, password);
    this._socket.on('obs:internal:event', (message) => {
      var marshal = API.marshalEvent(message);
      this._emitEvent(marshal.eventType, marshal.data);
      // this.emit('obs:event:' + marshal.eventType, marshal.data);
    });

    // Make classes available for consumption (TODO: eventually).
    this.OBSScene = require('./OBSScene');
    this.OBSSource = require('./OBSSource');
  }

  // Override the API version.
  setVersion(version) {
    API.setVersion(version);
  }

  // Disconnect from the socket.
  disconnect() {
    this._socket.disconnect();
  }

  // Internal generic Socket request method. Returns a promise, handles callbacks.
  // Generates a messageId internally and will override any passed in the args.
  // Note that the requestType here is pre-marshaling.
  _sendRequest(requestType, args, callback) {
    args = args || {};
    callback = callback || NOP;

    return new Promise((resolve, reject) => {
      if (!requestType) { log.error('Request Type not specified.'); reject(); }

      var messageId = args['messageId'] = generateMessageId();

      args = API.marshalRequest(requestType, args);

      this._socket.send(messageId, args);

      this._socket.once('obs:internal:message:id-' + messageId, function(msg) {
        // TODO: Do stuff with the msg to determine errors, marshaling, etc.
        msg = API.marshalResponse(requestType, msg);

        if (msg.status === 'error') {
          log.error(msg.error);
          callback(msg, null);
          reject(msg);
        } else {
          callback(null, msg);
          resolve(msg);
        }
      });
    });
  }

  _emitEvent(eventType, data) {
    this.emit('obs:event:' + eventType, data);
  }
}

module.exports = exports = Core;
