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

      this._responseCallbacks[args['message-id']] = {
        'requestType': requestType,
        'callbackFunction': callback
      };

      this._socket.send(JSON.stringify(args));
    } else {
      console.warn(OBSWebSocket.CONSOLE_NAME, "Not connected.");
    }
  };

  OBSWebSocket.prototype._onMessage = function(msg) {
    var message = JSON.parse(msg.data);
    if (!message)
      return;

    if (message.status === 'error') {
      console.error(OBSWebSocket.CONSOLE_NAME, 'Error:', message.error);
    }

    var updateType = message['update-type'];

    if (updateType) {
      this._buildEventCallback(updateType, message);
    } else {
      var messageId = message['message-id'];
      var callback = this._responseCallbacks[messageId].callbackFunction;

      callback(message);
      delete this._responseCallbacks[messageId];
    }
  };

  OBSWebSocket.prototype._buildEventCallback = function(updateType, message) {
    var self = this;

    switch(updateType) {
      case 'SwitchScenes':
        this.onSceneSwitch(message['scene-name']);
        return;
      case 'ScenesChanged':
        this.getSceneList(function(sceneList) {
          console.log('debug', sceneList);
          self.onSceneListChanged(sceneList);
        });
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
        message['bytesPerSecond'] = message['bytes-per-sec'];
        message['totalStreamTime'] = message['total-stream-time'];
        message['numberOfFrames'] = message['num-total-frames'];
        message['numberOfDroppedFrames'] = message['num-dropped-frames'];
        this.onStreamStatus(message);
        return;
      case 'Exiting':
        this.onExit();
        return;
      default:
        console.warn(OBSWebSocket.CONSOLE_NAME, 'Unknown UpdateType:', updateType, message);
    }
  };

  if (isModule()) {
    module.exports.OBSWebSocket = OBSWebSocket;
  } else {
    window.OBSWebSocket = OBSWebSocket;
  }
})();
