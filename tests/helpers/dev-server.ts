import {decode, encode} from '@msgpack/msgpack';
import sha256 from 'crypto-js/sha256.js';
import Base64 from 'crypto-js/enc-base64.js';
import {JsonObject} from 'type-fest';
import {AddressInfo, WebSocketServer} from 'ws';
import {IncomingMessage, WebSocketOpCode, OutgoingMessage} from '../../src/types.js';

export interface MockServer {
	server: WebSocketServer;
	url: string;
	received: OutgoingMessage[];
	sent: IncomingMessage[];
	send: (message: IncomingMessage) => void;
	teardown: () => Promise<void>;
}

class FailureResponse extends Error {
	constructor(public code: number, message: string) {
		super(message);
	}
}

export const PASSWORD = 'supersecretpassword';
const SALT = 'PZVbYpvAnZut2SS6JNJytDm9';
const CHALLENGE = 'ztTBnnuqrqaKDzRM3xcVdbYm';
const SECRET = Base64.stringify(sha256(PASSWORD + SALT));
const EXPECTED_AUTH_RESPONSE = Base64.stringify(sha256(SECRET + CHALLENGE));

const REQUEST_HANDLERS: Record<string, (req?: JsonObject | void) => FailureResponse | Record<string, unknown> | void> = {
	/* eslint-disable @typescript-eslint/naming-convention */
	GetVersion: () => ({obsVersion: '5.0.0-mock.0'}),
	BroadcastCustomEvent(params) {
		if (!params) {
			return new FailureResponse(301, 'Missing params');
		}

		if (!params.eventData) {
			return new FailureResponse(300, 'Missing eventData');
		}

		return undefined;
	},
	TriggerHotkeyByName(params) {
		if (!params) {
			return new FailureResponse(301, 'Missing params');
		}

		if (!params.hotkeyName) {
			return new FailureResponse(300, 'Missing hotkeyName');
		}

		return undefined;
	},
	/* eslint-enable @typescript-eslint/naming-convention */
};

export async function makeServer(
	authenticate?: boolean,
): Promise<MockServer> {
	const server = await new Promise<WebSocketServer>(resolve => {
		const server = new WebSocketServer({
			port: 0,
			handleProtocols(protocols) {
				if (protocols.has('obswebsocket.msgpack')) {
					return 'obswebsocket.msgpack';
				}

				return 'obswebsocket.json';
			},
		}, () => {
			resolve(server);
		});
	});

	const received: OutgoingMessage[] = [];
	const sent: IncomingMessage[] = [];
	let sendToClient: (message: IncomingMessage) => void;

	server.on('connection', socket => {
		function send(message: IncomingMessage) {
			sent.push(message);

			switch (socket.protocol) {
				case 'obswebsocket.msgpack':
					socket.send(encode(message));
					return;
				default:
					socket.send(JSON.stringify(message));
			}
		}

		sendToClient = send;

		socket.on('message', data => {
			let message: OutgoingMessage;
			switch (socket.protocol) {
				case 'obswebsocket.msgpack':
					message = decode(data as ArrayBuffer) as OutgoingMessage;
					break;
				default:
					message = JSON.parse(data as unknown as string) as OutgoingMessage;
			}

			received.push(message);

			switch (message.op) {
				case WebSocketOpCode.Identify:
					if (authenticate) {
						if (!message.d.authentication) {
							socket.close(4008, 'Missing authentication');
							break;
						}

						if (message.d.authentication !== EXPECTED_AUTH_RESPONSE) {
							socket.close(4008, 'Authentication failed.');
							break;
						}
					}

					send({
						op: WebSocketOpCode.Identified,
						d: {
							negotiatedRpcVersion: 1,
						},
					});
					break;
				case WebSocketOpCode.Reidentify:
					send({
						op: WebSocketOpCode.Identified,
						d: {
							negotiatedRpcVersion: 1,
						},
					});
					break;
				case WebSocketOpCode.Request: {
					const {requestData, requestId, requestType} = message.d;
					if (!(requestType in REQUEST_HANDLERS)) {
						send({
							op: WebSocketOpCode.RequestResponse,
							d: {
								// @ts-expect-error don't care
								requestType,
								requestId,
								requestStatus: {
									result: false,
									code: 204,
									comment: 'unknown type',
								},
							},
						});
						break;
					}

					const responseData = REQUEST_HANDLERS[requestType](requestData);

					if (responseData instanceof FailureResponse) {
						send({
							op: WebSocketOpCode.RequestResponse,
							d: {
								// @ts-expect-error don't care
								requestType,
								requestId,
								requestStatus: {
									result: false,
									code: responseData.code,
									comment: responseData.message,
								},
							},
						});
						break;
					}

					send({
						op: WebSocketOpCode.RequestResponse,
						d: {
							// @ts-expect-error don't care
							requestType,
							requestId,
							requestStatus: {
								result: true,
								code: 100,
							},
							// @ts-expect-error don't care
							responseData,
						},
					});

					break;
				}

				default:
					socket.close(4005, 'The specified `op` was invalid or missing');
			}
		});

		send({
			op: WebSocketOpCode.Hello,
			d: {
				obsWebSocketVersion: '5.0.0-mock.0',
				rpcVersion: 1,
				...authenticate ? {
					authentication: {
						challenge: CHALLENGE,
						salt: SALT,
					},
				} : {},
			},
		});
	});

	const {port} = server.address() as AddressInfo;

	return {
		server,
		url: `ws://localhost:${port}`,
		received,
		sent,
		send(message) {
			sendToClient(message);
		},
		async teardown() {
			return new Promise((resolve, reject) => {
				// Server doesn't close with open connections
				for (const client of server.clients) {
					client.close();
				}

				server.close(err => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			});
		},
	};
}
