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
  API.availableMethods.forEach(method => {
    OBSWebSocket.prototype[method] = function(args, callback) {
      return this.send(method, args, callback);
    };
  });

  // TODO: Not even sure it's worth having err in the callbacks. Pretty sure it can't happen.
  API.availableEvents.forEach(event => {
    OBSWebSocket.prototype['on' + event] = function(callback) {
      if (!eventCallbacks['obs:event:' + event]) {
        eventCallbacks['obs:event:' + event] = [];
      }
      eventCallbacks['obs:event:' + event].push(callback);

      this.on(event, (msg) => {
        var err = msg.error ? msg : null;
        var data = msg.error ? null : msg;

        iterateEventCallbacks(eventCallbacks['obs:event:' + event], err, data);
      });
    };
  });
};

module.exports = exports = MethodBinding;
