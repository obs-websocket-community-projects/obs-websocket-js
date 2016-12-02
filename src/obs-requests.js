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
