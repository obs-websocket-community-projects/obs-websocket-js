const API = require('./API');

function methodBinding(OBSWebSocket) {
  // Bind each request command to a function of the same name.
  API.availableMethods.forEach(method => {
    const handler = function (args, callback) {
      return this.send(method, args, callback);
    };

    // Bind to both UpperCamelCase and lowerCamelCase versions of the method name.
    OBSWebSocket.prototype[method] = handler;
    OBSWebSocket.prototype[method.charAt(0).toLowerCase() + method.slice(1)] = handler;
  });

  API.availableEvents.forEach(event => {
    OBSWebSocket.prototype['on' + event] = function (callback) {
      if (typeof callback !== 'function') {
        return;
      }

      this.on(event, data => {
        this._doCallback(callback, data);
      });
    };
  });
}

module.exports = methodBinding;
