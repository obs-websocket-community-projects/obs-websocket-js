const API = require('./API');
const log = require('loglevel');

const eventCallbacks = {};

function iterateEventCallbacks(callbacks, err, data) {
  for (const callback in callbacks) {
    if (typeof callbacks[callback] === 'function') {
      if (err) {
        log.error(err);
      }
      callbacks[callback](err, data);
    }
  }
}

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

      if (!eventCallbacks[event]) {
        eventCallbacks[event] = [];
      }

      eventCallbacks[event].push(callback);

      // TODO: Determine if having err in the callback is even possible/necessary.
      this.on(event, msg => {
        const err = msg.error ? msg : null;
        const data = msg.error ? null : msg;

        iterateEventCallbacks(eventCallbacks[event], err, data);
      });
    };
  });
}

module.exports = methodBinding;
