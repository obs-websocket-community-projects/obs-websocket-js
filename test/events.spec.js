const test = require('ava');
const env = require('./setup/environment');
const { OBSWebSocket } = require('..');

let unauthServer;
const obs = new OBSWebSocket();

test.before(async t => {
  unauthServer = env.makeServer(4446);
  await t.notThrowsAsync(obs.connect({
    address: 'localhost:4446'
  }));
});

test.after.always('cleanup', () => {
  unauthServer.close();
});

test.cb('emits data when a server event occurs', t => {
  obs.on('GenericEvent', data => {
    t.is(data.message, 'message');
    t.end();
  });

  obs.send('echo', {
    emitMessage: {
      'update-type': 'GenericEvent',
      message: 'message'
    }
  });
});

test.cb('allows registering custom event listeners', t => {
  obs.on('CustomEvent', data => {
    t.is(data.message, 'message');
    t.end();
  });

  obs.send('echo', {
    emitMessage: {
      'update-type': 'CustomEvent',
      message: 'message'
    }
  });
});
