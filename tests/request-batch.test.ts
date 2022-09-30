import anyTest, {TestFn} from 'ava';

import {makeServer, MockServer} from './helpers/dev-server.js';
import OBSWebSocket, {OBSRequestTypes, OBSResponseTypes, OBSWebSocketError} from '../src/json.js';

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
	await t.throwsAsync(client.callBatch([{requestType: 'GetVersion'}]), {
		instanceOf: Error,
		message: 'Not connected',
	});
});

test('single request without parameters', async t => {
	const {client} = t.context;
	const [res] = await client.callBatch([{requestType: 'GetVersion'}]);

	t.is((res.responseData as OBSResponseTypes['GetVersion']).obsVersion, '5.0.0-mock.0');
});

test('multiple requests with mixed parameters', async t => {
	const {client} = t.context;
	const [res1, res2, res3] = await client.callBatch([
		{requestType: 'GetVersion'},
		{requestType: 'BroadcastCustomEvent', requestData: {eventData: {}}},
		{requestType: 'GetVersion'},
	]);

	t.is((res1.responseData as OBSResponseTypes['GetVersion']).obsVersion, '5.0.0-mock.0');
	t.is((res2.responseData as OBSResponseTypes['BroadcastCustomEvent']), undefined);
	t.is((res3.responseData as OBSResponseTypes['GetVersion']).obsVersion, '5.0.0-mock.0');
});
