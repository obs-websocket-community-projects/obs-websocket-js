var Core = require('./Core.js');

class OBSWebSocket extends Core {
  constructor(address, password) {
    address = address || 'localhost';
    password = password || '';

    super(address, password);
    this._auth = {
      salt: '',
      chellenge: ''
    };
  }
}

module.exports = exports = OBSWebSocket;
