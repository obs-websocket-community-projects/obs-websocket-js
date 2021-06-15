import { Socket } from './Socket.js';
import { Status, StatusType } from './Status.js';
import { Callback, RequestMethodReturnMap, RequestMethodsArgsMap } from './typings/obsWebsocket';

export class OBSWebSocket extends Socket {
  private static requestCounter = 0;

  private static generateMessageId(): string {
    return String(OBSWebSocket.requestCounter++);
  }

  /**
   * Generic Socket request method. Returns a promise.
   * Generates a messageId internally and will override any passed in the args.
   * Note that the requestType here is pre-marshaling and currently must match exactly what the websocket plugin is expecting.
   *
   * @param  {String}   requestType obs-websocket plugin expected request type.
   * @param  {Object}   [args={}]   request arguments.
   * @return {Promise}              Promise, passes the plugin response object.
   */
  send<K extends keyof RequestMethodsArgsMap>(
    requestType: K,
    args?: RequestMethodsArgsMap[K] extends object ? RequestMethodsArgsMap[K] : undefined
  ): Promise<RequestMethodReturnMap[K]> {
    // @ts-ignore this assignment works in js
    // eslint-disable-next-line no-param-reassign
    args = args || {};

    return new Promise((resolve, reject) => {
      const messageId = OBSWebSocket.generateMessageId();
      let rejectReason: StatusType|null = null;

      if (!requestType) {
        rejectReason = Status.REQUEST_TYPE_NOT_SPECIFIED;
      }

      if (args && (typeof args !== 'object' || Array.isArray(args))) {
        rejectReason = Status.ARGS_NOT_OBJECT;
      }

      if (!this.connected) {
        rejectReason = Status.NOT_CONNECTED;
      }

      // Assign a temporary event listener for this particular messageId to uniquely identify the response.
      this.once(`obs:internal:message:id-${messageId}`, (err, data) => {
        if (err && Object.keys(err).length > 0) {
          this.debug('[send:reject] %o', err);
          reject(err);
        } else {
          this.debug('[send:resolve] %o', data);
          resolve(data);
        }
      });

      // If we don't have a reason to fail fast, send the request to the socket.
      if (!rejectReason) {
        // @ts-ignore not documented but required
        args['request-type'] = requestType;
        // @ts-ignore not documented but required
        args['message-id'] = messageId;

        // Submit the request to the websocket.
        this.debug('[send] %s %s %o', messageId, requestType, args);
        try {
          this.socket.send(JSON.stringify(args));
        } catch (_) {
          // TODO: Consider inspecting the exception thrown to gleam some relevant info and pass that on.
          rejectReason = Status.SOCKET_EXCEPTION;
        }
      }

      // If the socket call was unsuccessful or bypassed, simulate its resolution.
      if (rejectReason) {
        this.emit(`obs:internal:message:id-${messageId}`, rejectReason);
      }
    });
  }

  /**
   * Generic Socket request method. Handles callbacks.
   * Internally calls `send` (which is promise-based). See `send`'s docs for more details.
   *
   * @param  {String}   requestType obs-websocket plugin expected request type.
   * @param  {Object}   [args={}]   request arguments.
   * @param  {Function} callback    Optional. callback(err, data)
   */
  sendCallback<K extends keyof RequestMethodsArgsMap>(
    requestType: K,
    args: RequestMethodsArgsMap[K] extends object ? RequestMethodsArgsMap[K] : Callback<K>,
    callback?: Callback<K> | undefined
  ): void {
    let finalArgs = args;
    let finalCallback = callback;

    // Allow the `args` argument to be omitted.
    if (typeof callback === 'undefined' && typeof args === 'function') {
      finalCallback = args;
      // @ts-ignore this is valid
      finalArgs = {};
    }

    // Perform the actual request, using `send`.
    // @ts-ignore args are valid smh
    this.send(requestType, finalArgs).then((...response) => {
      // check for safety because javascript
      if (finalCallback) {
        finalCallback(null, ...response);
      }
    })
      .catch((error: Error) => {
        if (finalCallback) {
          finalCallback(error);
        }
      });
  }
}
