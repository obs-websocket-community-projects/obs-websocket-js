import anyTest, {type TestFn} from 'ava';

import {makeServer, type MockServer} from './helpers/dev-server.js';
import OBSWebSocket, {OBSRequestTypes, type OBSResponseTypes, OBSWebSocketError} from '../src/json.js';

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

	t.is(res.responseData.obsVersion, '5.0.0-mock.0');
});

test('multiple requests with mixed parameters', async t => {
	const {client} = t.context;
	const [res1, res2, res3] = await client.callBatch([
		{requestType: 'GetVersion'},
		{requestType: 'BroadcastCustomEvent', requestData: {eventData: {}}},
		{requestType: 'GetVersion'},
	]);

	t.is(res1.responseData.obsVersion, '5.0.0-mock.0');
	t.is(res2.responseData, undefined);
	t.is(res3.responseData.obsVersion, '5.0.0-mock.0');
});

test('haltOnFailure stops early and can return fewer results than requests', async t => {
	const {client} = t.context;
	const results = await client.callBatch([
		{requestType: 'GetVersion'},
		{requestType: 'TriggerHotkeyByName', requestData: {hotkeyName: ''}},
		{requestType: 'GetVersion'},
	], {haltOnFailure: true});

	t.is(results.length, 2);
	if (results.length !== 2) { // To limit types bellow
		return;
	}

	t.true(results[0].requestStatus.result);
	t.false(results[1].requestStatus.result);
});

test('haltOnFailure results require narrowing before indexing (typescript)', async t => {
	const {client} = t.context;
	const results = await client.callBatch([
		{requestType: 'GetVersion'},
		{requestType: 'GetVersion'},
	], {haltOnFailure: true});

	// @ts-expect-error results[1] may not exist, since haltOnFailure can halt the batch early
	t.true(results[1].requestStatus.result);

	if (results.length === 2) {
		// Narrowing by length recovers precise per-index typing, no `| undefined`
		t.true(results[1].requestStatus.result);
	} else {
		t.fail('expected both requests to succeed');
	}
});
