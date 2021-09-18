const test = require('ava');
const env = require('./setup/environment');
const {OBSWebSocket} = require('..');

let unauthServer;

const obs = new OBSWebSocket();

test.before(async t => {
	unauthServer = env.makeServer(4445);
	await t.notThrowsAsync(obs.connect({
		address: 'localhost:4445',
	}));
});

test.after.always('cleanup', () => {
	unauthServer.close();
});

test('resolves when a valid request is sent', async t => {
	await t.notThrowsAsync(obs.send('ValidMethodName'));
});

test('rejects when an invalid request is sent', async t => {
	try {
		await obs.send('InvalidMethodName');
		t.fail('expected promise rejection');
	} catch (e) {
		t.is(e.status, 'error');
		t.is(e.error, 'invalid request type');
	}
});

test('permits null args', async t => {
	await t.notThrowsAsync(obs.send('ValidMethodName', null));
});

test('rejects when no open connection exists', async t => {
	const obs2 = new OBSWebSocket();
	try {
		await obs2.send('ValidMethodName');
		t.fail('expected promise rejection');
	} catch (e) {
		t.is(e.status, 'error');
		t.is(e.code, 'NOT_CONNECTED');
	}
});

test('rejects when no request type is specified', async t => {
	try {
		await obs.send();
		t.fail('expected promise rejection');
	} catch (e) {
		t.is(e.status, 'error');
		t.is(e.code, 'REQUEST_TYPE_NOT_SPECIFIED');
	}
});
