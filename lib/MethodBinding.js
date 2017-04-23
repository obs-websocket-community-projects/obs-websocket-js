var API = require('./API');
var log = require('loglevel');

var eventCallbacks = {};

function iterateEventCallbacks(callbacks, err, data) {
  for (var callback in callbacks) {
    if (typeof callbacks[callback] === 'function') {
      if (err) { log.error(err); }
      callbacks[callback](err, data);
    }
  }
}

var MethodBinding = function(OBSWebSocket) {

  // Bind each request command to a function of the same name.
  API.availableMethods.forEach(method => {
    OBSWebSocket.prototype[method] = function(args, callback) {
      return this.send(method, args, callback);
    };
  });

  API.availableEvents.forEach(event => {
    OBSWebSocket.prototype['on' + event] = function(callback) {
      if (typeof callback !== 'function') {
        return;
      }

      if (!eventCallbacks[event]) {
        eventCallbacks[event] = [];
      }

      eventCallbacks[event].push(callback);

      // TODO: Determine if having err in the callback is even possible/necessary.
      this.on(event, (msg) => {
        var err = msg.error ? msg : null;
        var data = msg.error ? null : msg;

        iterateEventCallbacks(eventCallbacks[event], err, data);
      });
    };
  });
};

module.exports = exports = MethodBinding;
