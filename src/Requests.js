var AuthHashing = require('./AuthHashing');

var Requests = function(OBSWebSocket) {
  OBSWebSocket.prototype.getVersion = function(callback) {
    this.apiLookup('getVersion', {}, callback);
  };

  OBSWebSocket.prototype.getAuthRequired = OBSWebSocket.prototype.getAuthenticationRequired = function(callback) {
    this.apiLookup('getAuthenticationRequired', {}, callback);
  };

  OBSWebSocket.prototype.authenticate = function(password = '') {
    var self = this;

    var args = { 'auth': new AuthHashing(this._auth.salt, this._auth.challenge).hash(password) };

    self.apiLookup('authenticate', args, function(err) {
      if (err) {
        self.log.error('Authentication Failure.', err);
        self.emit('onAuthenticationFailure', err);
      } else {
        self.log.info('Authentication Success.');
        self.emit('onAuthenticationSuccess');
      }
    });
  };

  OBSWebSocket.prototype.getCurrentScene = function(callback) {
    function nestedCallback(err, data) {
      if (data) {
        data = marshalOBSScene(data);
      }

      callback(err, data);
    }

    this.apiLookup('getCurrentScene', {}, nestedCallback);
  };

  OBSWebSocket.prototype.setCurrentScene = function(sceneName) {
    this.apiLookup('setCurrentScene',
      { 'sceneName' : sceneName });
  };

  OBSWebSocket.prototype.getSceneList = function(callback) {
    function nestedCallback(err, data) {
      if (data) {
        data['scenes'] = Object.keys(data['scenes']).map(function(key) { return marshalOBSScene(data['scenes'][key]); });
      }
      callback(err, data);
    }

    this.apiLookup('getSceneList', {}, nestedCallback);
  };

  OBSWebSocket.prototype.setSourceVisbility = function(sourceName, visible) {
    this.apiLookup('setSourceVisbility',
    { 'source' : sourceName, 'render' : visible });
  };

  OBSWebSocket.prototype.toggleStreaming = function() {
    this.apiLookup('toggleStreaming');
  };

  OBSWebSocket.prototype.toggleRecording = function() {
    this.apiLookup('toggleRecording');
  };

  OBSWebSocket.prototype.getStreamStatus = function(callback) {
    this.apiLookup('getStreamingStatus', {}, callback);
  };

  OBSWebSocket.prototype.getTransitionList = function(callback) {
    this.apiLookup('getTransitionList', {}, callback);
  };

  OBSWebSocket.prototype.getCurrentTransition = function(callback) {
    this.apiLookup('getCurrentTransition', {}, callback);
  };

  OBSWebSocket.prototype.setCurrentTransition = function(transitionName) {
    this.apiLookup('setCurrentTransition',
    { 'transitionName' : transitionName });
  };
};

module.exports = exports = Requests;
