var Logger = require('./Logger');

var OBSWebSocket = function() {
  this.log = new Logger('[OBS]');
  this._socket = undefined;
  this._auth = {
    salt: '',
    challenge: ''
  };
  this._connected = false;

  this.OBSScene = require('./OBSScene');
  this.OBSSource = require('./OBSSource');
};

require('./Core')(OBSWebSocket);

require('./Requests')(OBSWebSocket);
require('./Events')(OBSWebSocket);
require('./Socket')(OBSWebSocket);

module.exports = exports = OBSWebSocket;
