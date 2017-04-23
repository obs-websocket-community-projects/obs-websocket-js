var Socket = require('./Socket');
var log = require('loglevel');

var NOP = function() {};
var requestCounter = 0;

function generateMessageId() {
  return '' + requestCounter++;
}

class Core extends Socket {
  constructor(address, password) {
    super(address, password);

    this.logger = log;

    // Bind all event emissions from the socket such that they are marshaled an re-emit at the base OBSWebSocket scope.
    this.on('obs:internal:event', this._handleEvent);
  }

  // Internal generic Socket request method. Returns a promise, handles callbacks.
  // Generates a messageId internally and will override any passed in the args.
  // Note that the requestType here is pre-marshaling and currently must match exactly what the websocket plugin is expecting.
  send(requestType, args = {}, callback = NOP) {
    return new Promise((resolve, reject) => {
      if (!requestType) { log.error('[Core:send]', 'Request Type not specified.'); reject(); }

      // Assign the core message details.
      args['request-type'] = requestType;
      var messageId = args['message-id'] = generateMessageId();

      // Submit the request to the websocket.
      log.debug('[Core:send]', messageId, requestType, args);
      this._socket.send(JSON.stringify(args));

      // Asign a temporary event listener for this particular messageId to uniquely identify the response.
      this.once('obs:internal:message:id-' + messageId, (message) => {
        // TODO: Do additional stuff with the msg to determine errors, marshaling, etc.
        // message = API.marshalResponse(requestType, message);

        if (message.status === 'error') {
          log.error('[Core:send:Response:reject]', message);
          try { callback(message, null); } catch (e) { log.error('Callback failure', e); }
          reject(message);
        } else {
          log.debug('[Core:send:Response:resolve]', message);
          try { callback(null, message); } catch (e) { log.error('Callback failure', e); }
          resolve(message);
        }
      });
    });
  }

  // TODO: Marshal to use the API defined eventType rather than the obs-websocket defined one.
  // Perform some logic them re-emit the event to the public name.
  _handleEvent(message) {
    this.emit(message.updateType, message);
  }
}

module.exports = exports = Core;
