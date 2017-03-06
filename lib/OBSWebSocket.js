var Core = require('./Core');

class OBSWebSocket extends Core {
  constructor(address, password) {
    address = address || 'localhost';
    password = password || '';

    super(address, password);
  }
}

require('./MethodBinding')(OBSWebSocket);

module.exports = exports = OBSWebSocket;
