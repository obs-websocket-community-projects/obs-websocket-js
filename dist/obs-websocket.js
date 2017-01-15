(function(){
/*
 * OBS WebSocket Javascript API (obs-websocket-js) v0.2.0
 * Author: Brendan Hagan (haganbmj)
 * Repo: git+https://github.com/haganbmj/obs-websocket-js.git
 */

'use strict';

/**
 * @class OBSSource
 * @param name {string} - Source name.
 * @param type {string} - Type.
 * @param x {double} - X position.
 * @param y {double} - Y position.
 * @param boundsX {double} - BoundsX.
 * @param boundsY {double} - BoundsY.
 * @param volume {double} - Source Volume.
 * @param visible {bool} - Scene visibility.
 */
(function() {
  function OBSSource(name, type, x, y, boundsX, boundsY, volume, visible) {
    this.name = (typeof name === 'undefined') ? '' : name;
    this.type = (typeof type === 'undefined') ? '' : type;
    this.x = x || 0;
    this.y = y || 0;
    this.boundsX = boundsX || 0;
    this.boundsY = boundsY || 0;
    this.volume = volume || 0;
    this.visible = visible || false;
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports.OBSSource = OBSSource;
  } else {
    window.OBSSource = OBSSource;
  }
})();

function marshalOBSSource(source) { // jshint ignore:line
  return new OBSSource(source.name, source.type, source.x, source.y, source.cx, source.cy, source.volume, source.render);
}

/**
 * @class OBSScene
 * @param name {string} - Source name.
 * @param sources {Array.<OBSSource>} - Array of {@link OBSSource}s.
 */
(function() {
  function OBSScene(name, sources) {
    this.name = (typeof name === 'undefined') ? '' : name;
    sources = (typeof sources === 'undefined') ? [] : sources;

    this.sources = sources;
    var self = this;

    if (sources.length > 0 && !(sources[0] instanceof OBSSource)) {
      this.sources = [];
      sources.forEach(function(source) {
        self.sources.push(marshalOBSSource(source));
      });
    }
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports.OBSScene = OBSScene;
  } else {
    window.OBSScene = OBSScene;
  }
})();

function marshalOBSScene(scene) { // jshint ignore:line
  return new OBSScene(scene.name, scene.sources);
}

function isModule() {
  return typeof module !== 'undefined' && typeof module.exports !== 'undefined';
}

var OBSSource = {};
var OBSScene = {};

if (isModule()) {
  OBSSource = module.exports.OBSSource;
  OBSScene = module.exports.OBSScene;
} else {
  OBSSource = window.OBSSource;
  OBSScene = window.OBSScene;
}

/**
 * @class OBSWebSocket
 * @example
 * var ws = new OBSWebSocket();
 * ws.connect('url', 'password');
 */
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
  var err = null;

  if (!message)
    return;

  var updateType = message['update-type'];
  var messageId = message['message-id'];

  if (message.status === 'error') {
    console.error(OBSWebSocket.CONSOLE_NAME, 'Error:', message.error);
    err = message.error;
    message = null;
  }

  if (updateType) {
    if (message) {
      this._buildEventCallback(updateType, message);
    }
  } else {
    var callback = this._responseCallbacks[messageId].callbackFunction;

    if (callback) {
      callback(err, message);
    }

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

OBSWebSocket.prototype._webCryptoHash = function(pass, callback) {
  var self = this;

  var utf8Pass = _encodeStringAsUTF8(pass);
  var utf8Salt = _encodeStringAsUTF8(this._auth.salt);
  var ab1 = _stringToArrayBuffer(utf8Pass + utf8Salt);

  crypto.subtle.digest('SHA-256', ab1)
    .then(function(authHash) {
      var utf8AuthHash = _encodeStringAsUTF8(_arrayBufferToBase64(authHash));
      var utf8Challenge = _encodeStringAsUTF8(self._auth.challenge);
      var ab2 = _stringToArrayBuffer(utf8AuthHash + utf8Challenge);

      crypto.subtle.digest('SHA-256', ab2)
        .then(function(authResp) {
          var authRespB64 = _arrayBufferToBase64(authResp);
          callback(authRespB64);
        });
    });
};

OBSWebSocket.prototype._cryptoJSHash = function(pass, callback) {
  var utf8Pass = _encodeStringAsUTF8(pass);
  var utf8Salt = _encodeStringAsUTF8(this._auth.salt);

  var authHash = CryptoJS.SHA256(utf8Pass + utf8Salt).toString(CryptoJS.enc.Base64);

  var utf8AuthHash = _encodeStringAsUTF8(authHash);
  var utf8Challenge = _encodeStringAsUTF8(this._auth.challenge);

  var authResp = CryptoJS.SHA256(utf8AuthHash + utf8Challenge).toString(CryptoJS.enc.Base64);
  callback(authResp);
};

OBSWebSocket.prototype._nodeCryptoHash = function(pass, callback) {
  var authHasher = crypto.createHash('sha256');

  var utf8Pass = _encodeStringAsUTF8(pass);
  var utf8Salt = _encodeStringAsUTF8(this._auth.salt);

  authHasher.update(utf8Pass + utf8Salt);
  var authHash = authHasher.digest('base64');

  var respHasher = crypto.createHash('sha256');

  var utf8AuthHash = _encodeStringAsUTF8(authHash);
  var utf8Challenge = _encodeStringAsUTF8(this._auth.challenge);

  respHasher.update(utf8AuthHash + utf8Challenge);
  var respHash = respHasher.digest('base64');

  callback(respHash);
};

function _encodeStringAsUTF8(string) {
  return unescape(encodeURIComponent(string));
}

function _stringToArrayBuffer(string) {
  var ret = new Uint8Array(string.length);
  for (var i = 0; i < string.length; i++) {
    ret[i] = string.charCodeAt(i);
  }

  return ret.buffer;
}

function _arrayBufferToBase64(arrayBuffer) {
  var binary = '';
  var bytes = new Uint8Array(arrayBuffer);

  var length = bytes.byteLength;
  for (var i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

var crypto = {};

if (isModule()) {
  crypto = require('crypto');
  OBSWebSocket.prototype._authHash = OBSWebSocket.prototype._nodeCryptoHash;
} else {
  crypto = window.crypto || window.msCrypto || {};
  OBSWebSocket.prototype._authHash = OBSWebSocket.prototype._webCryptoHash;

  if (typeof crypto.subtle === 'undefined') {
    if (typeof crypto.webkitSubtle === 'undefined') {
      if (typeof CryptoJS === 'undefined') {
        throw new Error('OBS WebSocket requires CryptoJS when native crypto is unavailable.');
      }
      OBSWebSocket.prototype._authHash = OBSWebSocket.prototype._cryptoJSHash;
    } else {
      crypto.subtle = crypto.webkitSubtle;
    }
  }
}

/**
 * Triggered on socket open.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onConnectionOpened = function() {};

/**
 * Triggered on socket close.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onConnectionClosed = function() {};

/**
 * Triggered on socket failure.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onConnectionFailed = function() {};

/**
 * Triggered on {@link OBSWebSocket.authenticate} success.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onAuthenticationSuccess = function() {};

/**
 * Triggered on {@link OBSWebSocket.authenticate} failure.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onAuthenticationFailure = function() {};

/**
 * Triggered on Scene Change.
 *
 * @function
 * @category listener
 * @param sceneName {string}
 */
OBSWebSocket.prototype.onSceneSwitch = function(sceneName) {}; // jshint ignore:line

/**
 * Triggered when the scene list is modified (a scene has been created, removed, or renamed).
 * @function
 * @category listener
 * @param response {object}
 * @param response.currentScene {string} - Name of the currently active scene.
 * @param response.scenes {Array.<OBSScene>}
 */
OBSWebSocket.prototype.onSceneListChanged = function(response) {}; // jshint ignore:line

/**
 * Triggered when a request to start streaming has been issued.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onStreamStarting = function() {};

/**
 * Triggered when the stream has successfully started.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onStreamStarted = function() {};

/**
 * Triggered when a request to stop streaming has been issued.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onStreamStopping = function() {};

/**
 * Triggered when the stream has successfully stopped.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onStreamStopped = function() {};

/**
 * Triggered when a request to start recording has been issued.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onRecordingStarting = function() {};

/**
 * Triggered when the recording has successfully started.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onRecordingStarted = function() {};

/**
 * Triggered when a request to stop streaming has been issued.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onRecordingStopping = function() {};

/**
 * Triggered when the recording has successfully stopped.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onRecordingStopped = function() {};

/**
 * Triggered once per second while streaming. Emits details about the stream status.
 *
 * @function
 * @category listener
 * @param response {object}
 * @param response.streaming {bool}
 * @param response.recording {bool}
 * @param response.bytesPerSecond {int}
 * @param response.strain {int}
 * @param response.totalStreamTime {int}
 * @param response.numberOfFrames {int}
 * @param response.numberOfDroppedFrames {int}
 * @param response.fps {double}
 */
OBSWebSocket.prototype.onStreamStatus = function(response) {}; // jshint ignore:line

/**
 * Triggered when OBS has been closed.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onExit = function() {};

/**
 * Callback for GetVersion.
 * @callback getVersionCb
 * @param err {object}
 * @param data {object}
 * @param data.obsVersion {string}
 */
/**
 * Retrieve OBSWebSocket version information.
 *
 * @function
 * @category request
 * @param callback {getVersionCb}
 */
OBSWebSocket.prototype.getVersion = function(callback) {
  function nestedCallback(err, data) {
    if (data) {
      data['obsStudioVersion'] = data['obs-studio-version'];
      data['obsWebSocketVersion'] = data['obs-websocket-version'];
    }
    callback(err, data);
  }
  this._sendRequest('GetVersion', {}, nestedCallback);
};

/**
 * Callback for getAuthRequired.
 * @callback getAuthRequiredCb
 * @param err
 * @param data
 * @param data.authRequired {bool}
 * @param data.salt {string=}
 * @param data.challenge {string=}
 */
/**
 * Retrieve information about the OBSWebSocket authentication requirements.
 *
 * @function
 * @category request
 * @param callback {getAuthRequiredCb}
 */
OBSWebSocket.prototype.getAuthRequired = function(callback) {
  this._sendRequest('GetAuthRequired', {}, callback);
};

/**
 * Attempt to authenticate the OBSWebSocket connection.
 *
 * @function
 * @category request
 * @param password {string=}
 */
OBSWebSocket.prototype.authenticate = function(password) {
  password = password || '';

  var self = this;

  this._authHash(password, function(authResp) {
    self._sendRequest('Authenticate', { 'auth' : authResp }, function(err, data) {
      if (err) {
        console.error(OBSWebSocket.CONSOLE_NAME, "Authentication Failure.", err);
        self.onAuthenticationFailure();
        return;
      }

      console.info(OBSWebSocket.CONSOLE_NAME, "Authentication Success.");
      self.onAuthenticationSuccess();
    });
  });
};

/**
 * Initialize and authenticate the WebSocket connection.
 *
 * @function
 * @category request
 * @param address=localhost {string}
 * @param password {string=}
 */
OBSWebSocket.prototype.connect = function(address, password) {
  address = address || 'localhost';
  password = password || '';

  address += address.indexOf(':') > 0 ? '' : ':' + OBSWebSocket.DEFAULT_PORT;

  var self = this;

  if (this._connected) {
    this._socket.close();
    this._connected = false;
  }

  this._socket = new WebSocket('ws://' + address);

  this._socket.onopen = function() {
    self._connected = true;
    self.onConnectionOpened();

    self.getAuthRequired(function(err, data) {
      if (err) { return; }

      if (data['authRequired']) {
        self._auth.salt = data['salt'];
        self._auth.challenge = data['challenge'];
        self.authenticate(password);
      }
    });
  };

  this._socket.onclose = function() {
    if (self._connected) {
      self.onConnectionClosed();
    }
    self._connected = false;
  };

  this._socket.onerror = function(evt) {
    self.onConnectionFailed(evt);
    self._connected = false;
  };

  this._socket.onmessage = function(msg) {
    // console.log(OBSWebSocket.CONSOLE_NAME, msg);
    self._onMessage(msg);
  };
};

/**
 * Close and disconnect the WebSocket connection.
 *
 * @function
 * @category request
 */
OBSWebSocket.prototype.disconnect = function() {
  this._socket.close();
};

/**
 * Callback for getCurrentScene.
 * @callback getCurrentSceneCb
 * @param err
 * @param data {OBSScene}
 */
/**
 * Retrieve the currently active scene.
 *
 * @function
 * @category request
 * @param callback {getCurrentSceneCb}
 */
OBSWebSocket.prototype.getCurrentScene = function(callback) {
  function nestedCallback(err, data) {
    if (data) {
      data = marshalOBSScene(data);
    }

    callback(err, data);
  }

  this._sendRequest('GetCurrentScene', {}, nestedCallback);
};

/**
 * Set the currently active scene.
 *
 * @function
 * @category request
 * @param sceneName {string} - Scene name.
 */
OBSWebSocket.prototype.setCurrentScene = function(sceneName) {
  this._sendRequest('SetCurrentScene',
    { 'scene-name' : sceneName });
};

/**
 * Callback for getSceneList.
 * @callback getSceneListCb
 * @param err
 * @param data
 * @param data.currentScene {string} - Name of the currently active scene.
 * @param data.scenes {Array.<OBSScene>} - Array of {@link OBSScene}s.
 */
/**
 * Retrieve the list of available scenes.
 *
 * @function
 * @category request
 * @param callback {getSceneListCb}
 */
OBSWebSocket.prototype.getSceneList = function(callback) {
  function nestedCallback(err, data) {
    if (data) {
      data['currentScene'] = data['current-scene'];
      data['scenes'] = Object.keys(data['scenes']).map(function(key) { return marshalOBSScene(data['scenes'][key]); });
    }
    callback(err, data);
  }

  this._sendRequest('GetSceneList', {}, nestedCallback);
};

/**
 * Set the visibility of a selected source.
 *
 * @function
 * @category request
 * @param sourceName {string} - Name of the source.
 * @param visible {bool} - Whether the source should be visible or not.
 */
OBSWebSocket.prototype.setSourceVisbility = function(sourceName, visible) {
  this._sendRequest('SetSourceVisibility',
  { 'source' : sourceName, 'render' : visible });
};

/**
 * Toggle streaming state.
 *
 * @function
 * @category request
 */
OBSWebSocket.prototype.toggleStreaming = function() {
  this._sendRequest('StartStopStreaming');
};

/**
 * Start streaming.
 *
 * @function
 * @category request
 */
OBSWebSocket.prototype.startStreaming = function() {
  // TODO:
};

/**
 * Stop streaming.
 *
 * @function
 * @category request
 */
OBSWebSocket.prototype.stopStreaming = function() {
  // TODO;
};

/**
 * Toggle recording state.
 *
 * @function
 * @category request
 */
OBSWebSocket.prototype.startStopRecording = function() {
  this._sendRequest('StartStopRecording');
};

/**
 * Start recording.
 *
 * @function
 * @category request
 */
OBSWebSocket.prototype.startRecording = function() {
  // TODO:
};

/**
 * Stop recording.
 *
 * @function
 * @category request
 */
OBSWebSocket.prototype.stopRecording = function() {
  // TODO;
};

/**
 * Callback for getStreamStatus.
 * @callback getStreamStatusCb
 * @param err
 * @param data
 * @param data.streaming {bool}
 * @param data.recording {bool}
 * @param data.previewOnly {bool} - Always false.
 * @param data.bytesPerSec {int=}
 * @param data.strain {double=}
 * @param data.totalStreamTime {int=}
 * @param data.numTotalFrames {int=}
 * @param data.numDroppedFrames {int=}
 * @param data.fps {double=}
 */
/**
 * Retrieve details about the stream status.
 *
 * @function
 * @category request
 * @param callback {getStreamStatusCb}
 */
OBSWebSocket.prototype.getStreamStatus = function(callback) {
  function nestedCallback(err, data) {
    if (data) {
      data['previewOnly'] = data['preview-only'];
      data['bytesPerSec'] = data['bytes-per-sec'];
      data['totalStreamTime'] = data['total-stream-time'];
      data['numTotalFrames'] = data['num-total-frames'];
      data['numDroppedFrames'] = data['num-dropped-frames'];
    }

    callback(err, data);
  }

  this._sendRequest('GetStreamingStatus', {}, nestedCallback);
};

/**
 * Callback for getTransitionList.
 * @callback getTransitionListCb
 * @param err
 * @param data
 * @param data.currentTransition {string}
 * @param data.transitions {Array.<string>}
 */
/**
 * Retrieve the list of available transitions.
 *
 * @function
 * @category request
 * @param callback {getTransitionListCb}
 */
OBSWebSocket.prototype.getTransitionList = function(callback) {
  function nestedCallback(err, data) {
    if (data) {
      data['currentTransition'] = data['current-transition'];
    }

    callback(err, data);
  }

  this._sendRequest('GetTransitionList', {}, nestedCallback);
};

/**
 * Callback for getCurrentTransition.
 * @callback getCurrentTransitionCb
 * @param err
 * @param data
 * @param data.name {string}
 */
/**
 * Retrieve the currently selected transition.
 *
 * @function
 * @category request
 * @param callback {getCurrentTransitionCb}
 */
OBSWebSocket.prototype.getCurrentTransition = function(callback) {
  this._sendRequest('GetCurrentTransition', {}, callback);
};

/**
 * Set the currently selected transition.
 *
 * @function
 * @category request
 * @param transitionName {string}
 */
OBSWebSocket.prototype.setCurrentTransition = function(transitionName) {
  this._sendRequest('SetCurrentTransition',
  { 'transition-name' : transitionName });
};
})();