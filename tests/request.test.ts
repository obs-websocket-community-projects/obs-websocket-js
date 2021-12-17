import anyTest, {TestFn} from 'ava';

import {makeServer, MockServer} from './helpers/dev-server.js';
import OBSWebSocket, {OBSWebSocketError} from '../src/json.js';

const test = anyTest as TestFn<{
	server: MockServer;
	client: OBSWebSocket;
}>;

test.beforeEach(async t => {
	const server = await makeServer();
	const client = new OBSWebSocket();
	await client.connect(server.url);

	t.context = {
		server,
		client,
	};
});

test.afterEach(async t => {
	await t.context.client.disconnect();
	await t.context.server.teardown();
});

test('disconencted throws', async t => {
	const {client} = t.context;
	await client.disconnect();
	await t.throwsAsync(client.call('GetVersion'), {
		instanceOf: Error,
		message: 'Not connected',
	});
});

test('request without parameters', async t => {
	const {client} = t.context;
	const res = await client.call('GetVersion');

	t.is(res.obsVersion, '5.0.0-mock.0');
});

test('request without parameters triggers typescript error (but still works)', async t => {
	const {client} = t.context;
	// @ts-expect-error Should not match any signature
	const res = await client.call('GetVersion', {});

	t.is(res.obsVersion, '5.0.0-mock.0');
});

test('request requiring parameters throws', async t => {
	const {client} = t.context;
	// Wish there was a typescript error here but method overloading to say
	// when 2nd argument is needed didn't work out.
	await t.throwsAsync(client.call('BroadcastCustomEvent'), {
		instanceOf: OBSWebSocketError,
		message: 'Missing params',
		code: 301,
	});
});

test('request requiring parameters but void response', async t => {
	const {client} = t.context;
	const prom = client.call('BroadcastCustomEvent', {eventData: {test: 'true'}});
	await t.notThrowsAsync(prom);
	// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
	const res = await prom;
	t.is(res, undefined);
});

test('request missing parameter typescript error + throws', async t => {
	const {client} = t.context;
	await t.throwsAsync(
		client.call('TriggerHotkeyByName', {
			// @ts-expect-error wrong key
			notKeyName: 'asd',
		}),
		{
			instanceOf: OBSWebSocketError,
			message: 'Missing hotkeyName',
			code: 300,
		},
	);
});
