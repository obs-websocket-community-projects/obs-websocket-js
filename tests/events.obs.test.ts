import anyTest, {TestFn} from 'ava';

import {makeServer, MockServer} from './helpers/dev-server.js';
import OBSWebSocket, {OBSEventTypes, WebSocketOpCode} from '../src/json.js';

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
	const {client, server} = t.context;
	const eventFiredPromise = new Promise<OBSEventTypes['StudioModeStateChanged']>(resolve => {
		client.on('StudioModeStateChanged', resolve);
	});
	server.send({
		op: WebSocketOpCode.Event,
		d: {
			eventType: 'StudioModeStateChanged',
			eventIntent: 1,
			eventData: {
				studioModeEnabled: true,
			},
		},
	});

	const event = await eventFiredPromise;
	t.true(event.studioModeEnabled);
});

