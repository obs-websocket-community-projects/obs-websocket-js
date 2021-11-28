import anyTest, {TestFn} from 'ava';

import {makeServer, MockServer} from './helpers/dev-server.js';
import OBSWebSocket, {OBSEventTypes, OpCode} from '../src/json.js';

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
	const eventFiredPromise = new Promise<OBSEventTypes['StreamStateChanged']>(resolve => {
		client.on('StreamStateChanged', resolve);
	});
	server.send({
		op: OpCode.Event,
		d: {
			eventType: 'StreamStateChanged',
			eventIntent: 1,
			eventData: {
				outputActive: true,
				outputState: 'started',
			},
		},
	});

	const event = await eventFiredPromise;
	t.true(event.outputActive);
	t.is(event.outputState, 'started');
});

