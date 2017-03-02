var Core = require('./Core');

class OBSWebSocket extends Core {
  constructor(address, password) {
    address = address || 'localhost';
    password = password || '';

    super(address, password);
  }
}

require('./Requests')(OBSWebSocket);
// require('./Events');

module.exports = exports = OBSWebSocket;
