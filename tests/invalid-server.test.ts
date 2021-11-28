import test from 'ava';

import {AddressInfo, WebSocketServer} from 'ws';

import OBSWebSocket, {OBSWebSocketError} from '../src/json.js';

test('server doesn\'t return any protocol', async t => {
	const server = await new Promise<WebSocketServer>(resolve => {
		const server = new WebSocketServer({
			port: 0,
			handleProtocols() {
				return false;
			},
		}, () => {
			resolve(server);
		});
	});
	const {port} = server.address() as AddressInfo;

	t.teardown(async () => new Promise((resolve, reject) => {
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
	}));

	const obs = new OBSWebSocket();

	t.false(obs.identified);
	await t.throwsAsync(obs.connect(`ws://localhost:${port}`), {
		instanceOf: OBSWebSocketError,
		message: 'Server sent no subprotocol',
		code: -1,
	});
	t.false(obs.identified);

	await obs.disconnect();
});

test('server returns wrong protocol', async t => {
	const server = await new Promise<WebSocketServer>(resolve => {
		const server = new WebSocketServer({
			port: 0,
			handleProtocols() {
				return 'dummy';
			},
		}, () => {
			resolve(server);
		});
	});
	const {port} = server.address() as AddressInfo;

	t.teardown(async () => new Promise((resolve, reject) => {
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
	}));

	const obs = new OBSWebSocket();

	t.false(obs.identified);
	await t.throwsAsync(obs.connect(`ws://localhost:${port}`), {
		instanceOf: OBSWebSocketError,
		message: 'Server sent an invalid subprotocol',
		code: -1,
	});
	t.false(obs.identified);

	await obs.disconnect();
});
