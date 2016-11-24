/**
 * Callback for GetVersion.
 * @callback getVersionCb
 * @param obsVersion {string}
 */
/**
 * Retrieve OBSWebSocket version information.
 *
 * @function
 * @category request
 * @param callback {getVersionCb}
 */
OBSWebSocket.prototype.getVersion = function(callback) {
  function nestedCallback(message) {
    message['obsVersion'] = '1.0'; // TODO: Make this relevant.
    callback(message);
  }
  this._sendRequest('GetVersion', {}, nestedCallback);
};

/**
 * Callback for getAuthRequired.
 * @callback getAuthRequiredCb
 * @param authRequired {bool}
 * @param salt {string=}
 * @param challenge {string=}
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
    self._sendRequest('Authenticate', { 'auth' : authResp }, function(message) {
      if (message.status === 'ok') {
        console.info(OBSWebSocket.CONSOLE_NAME, "Authentication Success.");
        self.onAuthenticationSuccess();
      } else {
        console.error(OBSWebSocket.CONSOLE_NAME, "Authentication Failure.", message);
        self.onAuthenticationFailure();
      }
    });
  });
};

/**
 * Initialize and authenticate the connection.
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

  this._socket = new WebSocket('ws://' + address, ['soap', 'xmpp']);

  this._socket.onopen = function() {
    self._connected = true;
    self.onConnectionOpened();

    self.getAuthRequired(function(message) {
      if (message['authRequired']) {
        self._auth.salt = message['salt'];
        self._auth.challenge = message['challenge'];
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
 * Callback for getCurrentScene.
 * @callback getCurrentSceneCb
 * @param scene {OBSScene}
 */
/**
 * Retrieve the currently active scene.
 *
 * @function
 * @category request
 * @param callback {getCurrentSceneCb}
 */
OBSWebSocket.prototype.getCurrentScene = function(callback) {
  function nestedCallback(message) {
    message = marshalOBSScene(message);
    callback(message);
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
 * @param currentScene {string} - Name of the currently active scene.
 * @param scenes {Array.<OBSScene>} - Array of {@link OBSScene}s.
 */
/**
 * Retrieve the list of available scenes.
 *
 * @function
 * @category request
 * @param callback {getSceneListCb}
 */
OBSWebSocket.prototype.getSceneList = function(callback) {
  function nestedCallback(message) {
    message['currentScene'] = message['current-scene'];
    message['scenes'] = Object.keys(message['scenes']).map(function(key) { return marshalOBSScene(message['scenes'][key]); });
    callback(message);
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
 * @param streaming {bool}
 * @param recording {bool}
 * @param previewOnly {bool} - Always false.
 * @param bytesPerSec {int=}
 * @param strain {double=}
 * @param totalStreamTime {int=}
 * @param numTotalFrames {int=}
 * @param numDroppedFrames {int=}
 * @param fps {double=}
 */
/**
 * Retrieve details about the stream status.
 *
 * @function
 * @category request
 * @param callback {getStreamStatusCb}
 */
OBSWebSocket.prototype.getStreamStatus = function(callback) {
  function nestedCallback(message) {
    message['previewOnly'] = message['preview-only'];
    message['bytesPerSec'] = message['bytes-per-sec'];
    message['totalStreamTime'] = message['total-stream-time'];
    message['numTotalFrames'] = message['num-total-frames'];
    message['numDroppedFrames'] = message['num-dropped-frames'];
    callback(message);
  }

  this._sendRequest('GetStreamingStatus', {}, nestedCallback);
};

/**
 * Callback for getTransitionList.
 * @callback getTransitionListCb
 * @param currentTransition {string}
 * @param transitions {Array.<string>}
 */
/**
 * Retrieve the list of available transitions.
 *
 * @function
 * @category request
 * @param callback {getTransitionListCb}
 */
OBSWebSocket.prototype.getTransitionList = function(callback) {
  function nestedCallback(message) {
    message['currentTransition'] = message['current-transition'];
    callback(message);
  }

  this._sendRequest('GetTransitionList', {}, nestedCallback);
};

/**
 * Callback for getCurrentTransition.
 * @callback getCurrentTransitionCb
 * @param name {string}
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
