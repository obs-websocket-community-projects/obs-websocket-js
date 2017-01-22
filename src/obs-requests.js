/**
 * Callback for GetVersion.
 * @callback getVersionCb
 * @param err {object} - Only populated if an error occurred during the request.
 * @param data {object}
 * @param data.obsWebSocketVersion {string} - Current OBS WebSocket plugin version.
 * @param data.version {double} - Hardcoded for OBS Remote backwards compatibility.
 */
/**
 * Retrieve OBSWebSocket version information.
 *
 * @function
 * @category request
 * @param callback {getVersionCb}
 */
OBSWebSocket.prototype.getVersion = function(callback) {
  this._sendRequest('GetVersion', {}, callback);
};

/**
 * Callback for getAuthRequired.
 * @callback getAuthRequiredCb
 * @param err {object} - Only populated if an error occurred during the request.
 * @param data {object}
 * @param data.authRequired {bool} - Indicates whether authentication is required.
 * @param data.salt {string=} - Authentication Salt. Only populated if authentication is required.
 * @param data.challenge {string=} - Authentication Challenge. Only populated if authentication is required.
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
 * Note that this method does not accept a callback.
 * Bind all callbacks to {@link OBSWebSocket.onAuthenticationSuccess} and {@link OBSWebSocket.onAuthenticationFailure}.
 *
 * @function
 * @category request
 * @param password='' {string=} - Defaults to empty.
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
 * @param address=localhost {string} - IP Adddress to connect to, with or without port.
 * @param password='' {string=} - Defaults to empty.
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
 * @param err {object} - Only populated if an error occurred during the request.
 * @param data {OBSScene} - Currently active scene.
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
 * @param err {object} - Only populated if an error occurred during the request.
 * @param data {object}
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
 * @param visible {bool} - Indicates whether the source should be visible or not.
 */
OBSWebSocket.prototype.setSourceVisbility = function(sourceName, visible) {
  this._sendRequest('SetSourceRender',
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
 * @todo Implement.
 * @category request
 */
OBSWebSocket.prototype.startStreaming = function() {
  // TODO:
};

/**
 * Stop streaming.
 *
 * @function
 * @todo Implement.
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
 * @todo Implement.
 * @category request
 */
OBSWebSocket.prototype.startRecording = function() {
  // TODO:
};

/**
 * Stop recording.
 *
 * @function
 * @todo Implement.
 * @category request
 */
OBSWebSocket.prototype.stopRecording = function() {
  // TODO;
};

/**
 * Callback for getStreamStatus.
 * @callback getStreamStatusCb
 * @param err {object} - Only populated if an error occurred during the request.
 * @param data {object}
 * @param data.streaming {bool} - Indicates whether OBS is currently streaming.
 * @param data.recording {bool} - Indicates whether OBS is currently recording.
 * @param data.previewOnly {bool} - Always false.
 * @param data.bytesPerSec {int=} - Current bitrate of the stream.
 * @param data.strain {double=} - Percentage of dropped frames.
 * @param data.totalStreamTime {int=} - Total uptime of the stream.
 * @param data.numTotalFrames {int=} - Total number of frames since the start of stream.
 * @param data.numDroppedFrames {int=} - Total number of dropped frames since the start of stream.
 * @param data.fps {double=} - Current Frames per Second of the stream.
 */
/**
 * Retrieve details about the stream status.
 *
 * @function
 * @category request
 * @param callback {getStreamStatusCb}
 */
OBSWebSocket.prototype.getStreamStatus = function(callback) {
  this._sendRequest('GetStreamingStatus', {}, callback);
};

/**
 * Callback for getTransitionList.
 * @callback getTransitionListCb
 * @param err {object} - Only populated if an error occurred during the request.
 * @param data {object}
 * @param data.currentTransition {string} - Name of the currently active transition.
 * @param data.transitions {Array.<string>} - Array of available transitions by name.
 */
/**
 * Retrieve the list of available transitions.
 *
 * @function
 * @category request
 * @param callback {getTransitionListCb}
 */
OBSWebSocket.prototype.getTransitionList = function(callback) {
  this._sendRequest('GetTransitionList', {}, callback);
};

/**
 * Callback for getCurrentTransition.
 * @callback getCurrentTransitionCb
 * @param err {object} - Only populated if an error occurred during the request.
 * @param data {object}
 * @param data.name {string} - Name of the currently active transition.
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
 * @param transitionName {string} - Name of the transition.
 */
OBSWebSocket.prototype.setCurrentTransition = function(transitionName) {
  this._sendRequest('SetCurrentTransition',
  { 'transition-name' : transitionName });
};
