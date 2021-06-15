import WebSocket from 'isomorphic-ws';
import EventEmitter from 'eventemitter3';
import debug from 'debug';
import { Status, StatusType } from './Status.js';
import hash from './utils/authenticationHashing.js';
import logAmbiguousError from './utils/logAmbiguousError.js';
import camelCaseKeys from './utils/camelCaseKeys.js';
import { EventHandlersDataMap, RequestMethodReturnMap, RequestMethodsArgsMap } from './typings/obsWebsocket.js';

export type ConnectArgs = {
  address: string;
  secure: boolean;
  password: string;
};

export abstract class Socket extends EventEmitter<EventHandlersDataMap> {
  protected connected = false;
  protected socket: WebSocket;
  protected debug = debug('obs-websocket-js:Socket');

  emit<T extends EventEmitter.EventNames<EventHandlersDataMap>>(event: T, ...args): boolean {
    this.debug('[emit] %s err: %o data: %o', event, ...args);
    return super.emit(event, ...args);
  }

  async connect(args: Partial<ConnectArgs> = {}): Promise<void> {
    const parsedArgs = {
      address: 'localhost:4444',
      password: '',
      secure: false,
      ...args,
    };

    if (this.socket) {
      try {
        // Blindly try to close the socket.
        // Don't care if its already closed.
        // We just don't want any sockets to leak.
        this.socket.close();
      } catch (error) {
        // These errors are probably safe to ignore, but debug log them just in case.
        this.debug('Failed to close previous WebSocket:', error.message);
      }
    }

    try {
      await this.connect0(parsedArgs.address, parsedArgs.secure);
      await this.authenticate(parsedArgs.password);
    } catch (e) {
      this.socket.close();
      this.connected = false;
      logAmbiguousError(this.debug, 'Connection failed:', e);
      // retrhow to let the user handle it
      throw e;
    }
  }

  /**
   * Opens a WebSocket connection to an obs-websocket server, but does not attempt any authentication.
   *
   * @param {String} address url without ws:// or wss:// prefix.
   * @param {Boolean} secure whether to us ws:// or wss://
   * @returns {Promise}
   * @private
   * @return {Promise} on attempted creation of WebSocket connection.
   */
  private connect0(address: string, secure: boolean): Promise<void> {
    // we need to wrap this in a promise so we can resolve only when connected
    return new Promise<void>((resolve, reject): void => {
      let settled = false;

      this.debug('Attempting to connect to: %s (secure: %s)', address, secure);
      this.socket = new WebSocket((secure ? 'wss://' : 'ws://') + address);

      // We only handle the initial connection error.
      // Beyond that, the consumer is responsible for adding their own generic `error` event listener.
      // FIXME: Unsure how best to expose additional information about the WebSocket error.
      this.socket.onerror = (err: WebSocket.ErrorEvent): void => {
        if (settled) {
          logAmbiguousError(this.debug, 'Unknown Socket Error', err);
          this.emit('error', err);
          return;
        }

        settled = true;
        logAmbiguousError(this.debug, 'Websocket Connection failed:', err);
        reject(Status.CONNECTION_ERROR);
      };

      this.socket.onopen = (): void => {
        if (settled) {
          return;
        }

        this.connected = true;
        settled = true;

        this.debug('Connection opened: %s', address);
        this.emit('ConnectionOpened');
        resolve();
      };

      // Looks like this should be bound. We don't technically cancel the connection when the authentication fails.
      this.socket.onclose = (): void => {
        this.connected = false;
        this.debug('Connection closed: %s', address);
        this.emit('ConnectionClosed');
      };

      // This handler must be present before we can call _authenticate.
      this.socket.onmessage = (msg: WebSocket.MessageEvent): void => {
        this.debug('[OnMessage]: %o', msg);
        const message = camelCaseKeys(JSON.parse(String(msg.data)));
        let err = {};
        let data = {};

        if (message.status === 'error') {
          err = message;
        } else {
          data = message;
        }

        // Emit the message with ID if available, otherwise try to find a non-messageId driven event.
        if (message.messageId) {
          // @ts-ignore Internal event
          this.emit(`obs:internal:message:id-${message.messageId}`, err, data);
        } else if (message.updateType) {
          this.emit(message.updateType, data);
        } else {
          logAmbiguousError(this.debug, 'Unrecognized Socket Message:', message);
          // @ts-ignore Unrecognized Socket Message
          this.emit('message', message);
        }
      };
    });
  }

  /**
   * Authenticates to an obs-websocket server. Must already have an active connection before calling this method.
   *
   * @param {String} [password=''] authentication string.
   * @private
   * @return {Promise} on resolution of authentication call.
   */
  private async authenticate(password = ''): Promise<StatusType|null> {
    if (!this.connected) {
      throw Status.NOT_CONNECTED;
    }

    const auth = await this.send('GetAuthRequired');

    if (!auth.authRequired) {
      this.debug('Authentication not Required');
      this.emit('AuthenticationSuccess');
      return Status.AUTH_NOT_REQUIRED;
    }

    try {
      await this.send('Authenticate', {
        auth: hash(auth.salt || '', auth.challenge || '', password)
      });
    } catch (e) {
      this.debug('Authentication Failure %o', e);
      this.emit('AuthenticationFailure');
      throw e;
    }

    this.debug('Authentication Success');
    this.emit('AuthenticationSuccess');

    return null;
  }

  /**
   * Close and disconnect the WebSocket connection.
   *
   * @function
   * @category request
   * @return {Promise}
   */
  async disconnect(): Promise<void> {
    this.debug('Disconnect requested.');

    if (this.socket) {
      await this.socket.close();
    }
  }

  // overwritten in parent class
  abstract send<K extends keyof RequestMethodsArgsMap>(requestType: K, args?: RequestMethodsArgsMap[K] extends object ? RequestMethodsArgsMap[K] : undefined): Promise<RequestMethodReturnMap[K]>;
}
