var EventEmitter = require('events');
var Socket = require('./Socket');
var _API = require('./API');
var API = new _API();
var log = require('loglevel');

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
    this.connect(address, password);
    this._socket.on('obs:internal:event', (message) => {
      var marshal = API.marshalEvent(message);
      this._emitEvent(marshal.eventType, marshal.data);
    });

    // Make classes available for consumption (TODO: eventually).
    this.OBSScene = require('./OBSScene');
    this.OBSSource = require('./OBSSource');

    this.logger = log;
  }

  // Override the API version.
  setVersion(version) {
    API.setVersion(version);
  }

  // Instantiate a new Socket.
  connect(address, password) {
    if (this._socket && this._socket._connected) {
      this.disconnect();
    }

    this._socket = new Socket(address, password);
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

      this._socket.once('obs:internal:message:id-' + messageId, (msg) => {
        // TODO: Do additional stuff with the msg to determine errors, marshaling, etc.
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

  // TODO: Marshal to use the API defined eventType rather than the obs-websocket defined one.
  _emitEvent(eventType, data) {
    log.debug('Core: _emitEvent: ', eventType, data);
    //this.emit('obs:event:' + eventType, data);
    this.emit(eventType, data);
  }
}

module.exports = exports = Core;
