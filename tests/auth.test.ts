import test from 'ava';

import OBSWebSocket, {OBSWebSocketError, WebSocketOpCode} from '../src/json.js';
import {makeServer, PASSWORD} from './helpers/dev-server.js';

test('connects: auth not required', async t => {
	const server = await makeServer(false);
	t.teardown(server.teardown);

	const obs = new OBSWebSocket();

	t.false(obs.identified);
	await t.notThrowsAsync(obs.connect(server.url));
	t.true(obs.identified);

	await obs.disconnect();
});

test('connects: auth not required but has password', async t => {
	const server = await makeServer(false);
	t.teardown(server.teardown);

	const obs = new OBSWebSocket();

	t.false(obs.identified);
	await t.notThrowsAsync(obs.connect(server.url, PASSWORD));
	t.true(obs.identified);

	await obs.disconnect();
});

test('connects: auth required but has no password', async t => {
	const server = await makeServer(true);
	t.teardown(server.teardown);

	const obs = new OBSWebSocket();

	t.false(obs.identified);
	await t.throwsAsync(obs.connect(server.url), {
		instanceOf: OBSWebSocketError,
		message: 'Missing authentication',
		code: 4008,
	});
	t.false(obs.identified);

	await obs.disconnect();
});

test('connects: auth required', async t => {
	const server = await makeServer(true);
	t.teardown(server.teardown);

	const obs = new OBSWebSocket();

	t.false(obs.identified);
	await t.notThrowsAsync(obs.connect(server.url, PASSWORD));
	t.true(obs.identified);

	await obs.disconnect();
});

test('connects: identify params', async t => {
	const server = await makeServer(true);
	t.teardown(server.teardown);

	const obs = new OBSWebSocket();

	t.false(obs.identified);
	await t.notThrowsAsync(obs.connect(server.url, PASSWORD));
	t.true(obs.identified);

	await obs.disconnect();
});

test('connects: reconnects', async t => {
	const server = await makeServer(false);
	t.teardown(server.teardown);

	const obs = new OBSWebSocket();

	t.false(obs.identified);
	await t.notThrowsAsync(obs.connect(server.url));
	t.true(obs.identified);
	await t.notThrowsAsync(obs.connect(server.url));
	t.true(obs.identified);

	t.is(server.server.clients.size, 1);

	await obs.disconnect();
});

test('connects: identify extra fileds', async t => {
	const server = await makeServer(false);
	t.teardown(server.teardown);

	const obs = new OBSWebSocket();

	t.false(obs.identified);
	await t.notThrowsAsync(obs.connect(server.url, undefined, {
		eventSubscriptions: 63,
	}));
	t.true(obs.identified);

	const message = server.received.find(({op}) => op === WebSocketOpCode.Identify);

	t.assert(message);
	// For typescript
	if (!message) {
		return;
	}

	t.like(message.d, {
		eventSubscriptions: 63,
	});

	await obs.disconnect();
});

test('connects: reidentify', async t => {
	const server = await makeServer(false);
	t.teardown(server.teardown);

	const obs = new OBSWebSocket();

	await obs.connect(server.url, undefined, {
		eventSubscriptions: 63,
	});

	await t.notThrowsAsync(obs.reidentify({
		eventSubscriptions: 127,
	}));

	const message = server.received.find(({op}) => op === WebSocketOpCode.Reidentify);

	t.assert(message);
	// For typescript
	if (!message) {
		return;
	}

	t.like(message.d, {
		eventSubscriptions: 127,
	});

	await obs.disconnect();
});

test('disconnect: does nothing when not connected', async t => {
	const obs = new OBSWebSocket();

	await t.notThrowsAsync(obs.disconnect());
});
