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
      if (message.status === 'error') {
        console.error(OBSWebSocket.CONSOLE_NAME, 'Error:', message.error);
      }

      var messageId = message['message-id'];
      var requestType = this._responseCallbacks[messageId].requestType;
      var callback = this._responseCallbacks[messageId].callbackFunction;

      var parsedMessage = this._parseMessage(requestType, message);

      callback(parsedMessage);
      delete this._responseCallbacks[messageId];
    }
  };

  OBSWebSocket.prototype._parseMessage = function(requestType, message) {
    switch(requestType) {
      case 'GetVersion':
        break;
      case 'GetAuthRequired':
        break;
      case 'Authenticate':
        break;
      case 'GetCurrentScene':
        message = marshalOBSScene(message);
        break;
      case 'SetCurrentScene':
        break;
      case 'GetSceneList':
        message['currentScene'] = message['current-scene'];
        message['scenes'] = Object.keys(message['scenes']).map(function(key) { return marshalOBSScene(message['scenes'][key]); });
        break;
      case 'SetSourceVisibility':
        break;
      case 'StartStopStreaming':
        break;
      case 'StartStopRecording':
        break;
      case 'GetStreamingStatus':
        message['previewOnly'] = message['preview-only'];
        message['bytesPerSec'] = message['bytes-per-sec'];
        message['totalStreamTime'] = message['total-stream-time'];
        message['numTotalFrames'] = message['num-total-frames'];
        message['numDroppedFrames'] = message['num-dropped-frames'];
        break;
      case 'GetTransitionList':
        message['currentTransition'] = message['current-transition'];
        break;
      case 'GetCurrentTransition':
        break;
      case 'SetCurrentTransition':
        break;
      default:
        console.warn(OBSWebSocket.CONSOLE_NAME, 'Unknown RequestType:', requestType, message);
    }

    console.log('parsedMessage', message);
    return message;
  };

  if (isModule()) {
    module.exports.OBSWebSocket = OBSWebSocket;
  } else {
    window.OBSWebSocket = OBSWebSocket;
  }
})();
