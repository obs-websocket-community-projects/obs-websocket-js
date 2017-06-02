const test = require('ava');
const env = require('./setup/environment');
const OBSWebSocket = require('../index');

let unauthServer;
const obs = new OBSWebSocket();

test.before(async t => {
  unauthServer = await env.makeServer(4445);
  await t.notThrows(obs.connect({
    address: 'localhost:4445'
  }));
});

test.after.always('cleanup', () => {
  unauthServer.close();
});

test('resolves when a valid request is sent', async t => {
  await t.notThrows(obs.send('ValidMethodName'));
});

test('rejects when an invalid request is sent', async t => {
  const resp = await t.throws(obs.send('InvalidMethodName'));
  t.deepEqual(resp.status, 'error');
  t.deepEqual(resp.error, 'invalid request type');
});

test('allows using lowercase request methods', async t => {
  obs.registerRequest('ValidMethodName');
  const resp = await obs.validMethodName();
  t.deepEqual(resp.status, 'ok');
});

test('allows using uppercase request methods', async t => {
  obs.registerRequest('ValidMethodName');
  const resp = await obs.ValidMethodName(); // eslint-disable-line new-cap
  t.deepEqual(resp.status, 'ok');
});

test('permits null args', async t => {
  await t.notThrows(obs.send('ValidMethodName', null));
});

test('assigns default methods based on API.js', async t => {
  const resp = await obs.getAuthRequired();
  t.deepEqual(resp.status, 'ok');
  t.false(resp.authRequired);
});

test('rejects when no open connection exists', async t => {
  const obs2 = new OBSWebSocket();
  const resp = await t.throws(obs2.send('ValidMethodName'));

  t.deepEqual(resp.status, 'error');
  t.deepEqual(resp.code, 'NOT_CONNECTED');
});

test('rejects when no request type is specified', async t => {
  const resp = await t.throws(obs.send());

  t.deepEqual(resp.status, 'error');
  t.deepEqual(resp.code, 'REQUEST_TYPE_NOT_SPECIFIED');
});
