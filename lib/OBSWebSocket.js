/**
 * TODO: This does nothing now. Move the logic from Core.js into this or expand this to have some purpose.
 */

var Core = require('./Core');

class OBSWebSocket extends Core {
  constructor(address, password) {
    super(address, password);
  }
}

require('./MethodBinding')(OBSWebSocket);

module.exports = exports = OBSWebSocket;
