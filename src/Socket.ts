import WebSocket from 'isomorphic-ws';
import EventEmitter from 'eventemitter3';
import debugLib from 'debug';
import {Status, StatusType} from './Status.js';
import hash from './utils/authenticationHashing.js';
import logAmbiguousError from './utils/logAmbiguousError.js';
import camelCaseKeys from './utils/camelCaseKeys.js';
import {EventHandlersDataMap, RequestMethodReturnMap, RequestMethodsArgsMap} from './typings/obsWebsocket.js';

export const debug = debugLib('obs-websocket-js:Socket');

export type ConnectArgs = {
	address: string;
	password: string;
};

export abstract class Socket extends EventEmitter<EventHandlersDataMap> {
	protected connected = false;
	protected socket: WebSocket;

	emit<T extends EventEmitter.EventNames<EventHandlersDataMap>>(event: T, ...args): boolean {
		debug('[emit] %s err: %o data: %o', event, ...args);
		return super.emit(event, ...args);
	}

	async connect(args: Partial<ConnectArgs> = {}): Promise<void> {
		const parsedArgs = {
			address: 'ws://localhost:4444',
			password: '',
			...args,
		};

		if (this.socket) {
			try {
				// Blindly try to close the socket.
				// Don't care if its already closed.
				// We just don't want any sockets to leak.
				await this.disconnect();
			} catch (error: any) {
				// These errors are probably safe to ignore, but debug log them just in case.
				debug('Failed to close previous WebSocket:', error.message);
			}
		}

		try {
			await this.connect0(parsedArgs.address);
			await this.authenticate(parsedArgs.password);
		} catch (e: any) {
			this.socket.close();
			this.connected = false;
			logAmbiguousError(debug, 'Connection failed:', e);
			// Rethrow to let the user handle it
			throw e;
		}
	}

	/**
   * Close and disconnect the WebSocket connection.
   *
   * @function
   * @category request
   * @return {Promise}
   */
	async disconnect(): Promise<void> {
		debug('Disconnect requested.');

		if (this.socket) {
			return new Promise((resolve, reject) => {
				this.once('ConnectionClosed', () => {
					resolve();
				});

				try {
					this.socket.close();
				} catch (e: any) {
					reject(e);
				}
			});
		}

		return Promise.resolve();
	}

	/**
   * Opens a WebSocket connection to an obs-websocket server, but does not attempt any authentication.
   *
   * @param {String} address url with or without ws:// or wss:// prefix.
   * @returns {Promise}
   * @private
   * @return {Promise} on attempted creation of WebSocket connection.
   */
	private async connect0(address: string): Promise<void> {
		// We need to wrap this in a promise so we can resolve only when connected
		return new Promise<void>((resolve, reject): void => {
			let settled = false;
			// Check if the address starts with a prefix and prepend if needed
			const regex = /^wss?:\/\//i;
			const parsedAddress = `${regex.test(address) ? '' : 'ws://'}${address}`;

			debug('Attempting to connect to: %s', parsedAddress);
			this.socket = new WebSocket(parsedAddress);

			// We only handle the initial connection error.
			// Beyond that, the consumer is responsible for adding their own generic `error` event listener.
			this.socket.onerror = (err: WebSocket.ErrorEvent): void => {
				if (settled) {
					logAmbiguousError(debug, 'Unknown Socket Error', err);
					this.emit('error', err);
					return;
				}

				settled = true;
				logAmbiguousError(debug, 'Websocket Connection failed:', err);
				reject(Status.CONNECTION_ERROR);
			};

			this.socket.onopen = (): void => {
				if (settled) {
					return;
				}

				this.connected = true;
				settled = true;

				debug('Connection opened: %s', address);
				this.emit('ConnectionOpened');
				resolve();
			};

			// Looks like this should be bound. We don't technically cancel the connection when the authentication fails.
			this.socket.onclose = (): void => {
				this.connected = false;
				debug('Connection closed: %s', address);
				this.emit('ConnectionClosed');
			};

			// This handler must be present before we can call _authenticate.
			this.socket.onmessage = (msg: WebSocket.MessageEvent): void => {
				debug('[OnMessage]: %o', msg);
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
					// @ts-expect-error Internal event, not documented
					this.emit(`obs:internal:message:id-${message.messageId as string}`, err, data);
				} else if (message.updateType) {
					this.emit(message.updateType, data);
				} else {
					logAmbiguousError(debug, 'Unrecognized Socket Message:', message);
					// @ts-expect-error Unrecognized Socket Message
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
	private async authenticate(password = ''): Promise<StatusType | null> {
		if (!this.connected) {
			// eslint-disable-next-line @typescript-eslint/no-throw-literal
			throw Status.NOT_CONNECTED;
		}

		const auth = await this.send('GetAuthRequired');

		if (!auth.authRequired) {
			debug('Authentication not Required');
			this.emit('AuthenticationSuccess');
			return Status.AUTH_NOT_REQUIRED;
		}

		try {
			await this.send('Authenticate', {
				auth: hash(auth.salt ?? '', auth.challenge ?? '', password),
			});
		} catch (e: any) {
			debug('Authentication Failure %o', e);
			this.emit('AuthenticationFailure');
			throw e;
		}

		debug('Authentication Success');
		this.emit('AuthenticationSuccess');

		return null;
	}

	// Overwritten in parent class
	abstract send<K extends keyof RequestMethodsArgsMap>(requestType: K, args?: RequestMethodsArgsMap[K] extends Record<string, unknown> ? RequestMethodsArgsMap[K] : undefined): Promise<RequestMethodReturnMap[K]>;
}
