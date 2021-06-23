import {Socket, debug} from './Socket.js';
import {Status, StatusType} from './Status.js';
import {RequestMethodReturnMap, RequestMethodsArgsMap} from './typings/obsWebsocket';

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
  async send<K extends keyof RequestMethodsArgsMap>(
    requestType: K,
    args?: RequestMethodsArgsMap[K] extends Record<string, unknown> ? RequestMethodsArgsMap[K] : undefined,
  ): Promise<RequestMethodReturnMap[K]> {
    // @ts-expect-error this assignment works in js
    args = args ?? {};

    return new Promise((resolve, reject) => {
      const messageId = OBSWebSocket.generateMessageId();
      let rejectReason: StatusType | null = null;

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
      // @ts-expect-error Internal message
      this.once(`obs:internal:message:id-${messageId}`, (err, data) => {
        if (err && Object.keys(err).length > 0) {
          debug('[send:reject] %o', err);
          reject(err);
        } else {
          debug('[send:resolve] %o', data);
          resolve(data);
        }
      });

      // If we don't have a reason to fail fast, send the request to the socket.
      if (!rejectReason) {
        // @ts-expect-error not documented but required
        args['request-type'] = requestType;
        // @ts-expect-error not documented but required
        args['message-id'] = messageId;

        // Submit the request to the websocket.
        debug('[send] %s %s %o', messageId, requestType, args);

        try {
          this.socket.send(JSON.stringify(args));
        } catch (e: unknown) {
          this.emit('error', e);
          rejectReason = Status.SOCKET_EXCEPTION;
        }
      }

      // If the socket call was unsuccessful or bypassed, simulate its resolution.
      if (rejectReason) {
        // @ts-expect-error Internal message
        this.emit(`obs:internal:message:id-${messageId}`, rejectReason);
      }
    });
  }
}
