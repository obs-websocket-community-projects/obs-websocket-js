function isModule() {
  return typeof module !== 'undefined' && typeof module.exports !== 'undefined';
}

/**
 * @class OBSWebSocket
 * @example
 * var ws = new OBSWebSocket();
 * ws.connect('url', 'password');
 */
(function() {
  var OBSSource = {};
  var OBSScene = {};

  if (isModule()) {
    OBSSource = module.exports.OBSSource;
    OBSScene = module.exports.OBSScene;
  } else {
    OBSSource = window.OBSSource;
    OBSScene = window.OBSScene;
  }

  function OBSWebSocket() {
    OBSWebSocket.DEFAULT_PORT = 4444;
    OBSWebSocket.CONSOLE_NAME = '[OBSWebSocket]';

    this._connected = false;
    this._socket = undefined;
    this._requestCounter = 0;
    this._responseCallbacks = {};
    this._auth = { salt: '', challenge: '' };
  }

  var WebSocket = {};

  if (isModule()) {
    WebSocket = require('ws');
  } else {
    WebSocket = window.WebSocket;
  }

  OBSWebSocket.prototype._generateMessageId = function() {
    this._requestCounter++;
    return this._requestCounter + '';
  };

  OBSWebSocket.prototype._sendRequest = function(requestType, args, callback) {
    if (this._connected) {
      args = args || {};
      callback = callback || function() {};
      args['message-id'] = this._generateMessageId();
      args['request-type'] = requestType;

      this._responseCallbacks[args['message-id']] = callback;

      this._socket.send(JSON.stringify(args));
    }
  };

  OBSWebSocket.prototype._onMessage = function(msg) {
    var message = JSON.parse(msg.data);
    if (!message)
      return;

    var self = this;

    var updateType = message['update-type'];
    if (updateType) {
      switch(updateType) {
        case 'SwitchScenes':
          this.onSceneSwitch(message['scene-name']);
          return;
        case 'ScenesChanged':
          this.onSceneListChanged();
          return;
        case 'StreamStarting':
          this.onStreamStarting();
          return;
        case 'StreamStarted':
          this.onStreamStarted();
          return;
        case 'StreamStopping':
          this.onStreamStopping();
          return;
        case 'StreamStopped':
          this.onStreamStopped();
          return;
        case 'RecordingStarting':
          this.onRecordingStarting();
          return;
        case 'RecordingStarted':
          this.onRecordingStarted();
          return;
        case 'RecordingStopping':
          this.onRecordingStopping();
          return;
        case 'RecordingStopped':
          this.onRecordingStopped();
          return;
        case 'StreamStatus':
          this.onStreamStatus(
              message['streaming'],
              message['recording'],
              message['bytes-per-sec'],
              message['strain'],
              message['total-stream-time'],
              message['num-total-frames'],
              message['num-dropped-frames'],
              message['fps']);
            return;
          case 'Exiting':
            this.onExit();
            return;
        default:
          console.warn(OBSWebSocket.CONSOLE_NAME, 'Unknown UpdateType:', updateType, message);
      }
    } else {
      var messageId = message['message-id'];
      if (message.status === 'error') {
        console.error(OBSWebSocket.CONSOLE_NAME, 'Error:', message.error);
      }

      var callback = this._responseCallbacks[messageId];
      callback(message);
      delete this._responseCallbacks[messageId];
    }
  };

  if (isModule()) {
    module.exports.OBSWebSocket = OBSWebSocket;
  } else {
    window.OBSWebSocket = OBSWebSocket;
  }
})();
