const test = require('ava');
const env = require('./setup/environment');
const OBSWebSocket = require('..');

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

test('permits null args', async t => {
  await t.notThrows(obs.send('ValidMethodName', null));
});

test.cb('sendCallback -- success case', t => {
  obs.sendCallback('ValidMethodName', {}, (err, data) => {
    t.falsy(err);
    t.deepEqual(data.status, 'ok');
    t.end();
  });
});

test.cb('sendCallback -- omitted args', t => {
  obs.sendCallback('ValidMethodName', (err, data) => {
    t.falsy(err);
    t.deepEqual(data.status, 'ok');
    t.end();
  });
});

test.cb('sendCallback -- error case', t => {
  obs.sendCallback('InvalidMethodName', {}, (err, data) => {
    t.falsy(data);
    t.deepEqual(err.status, 'error');
    t.end();
  });
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
