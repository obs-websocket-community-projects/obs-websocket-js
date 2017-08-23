const test = require('ava');
const env = require('./setup/environment');
const util = require('./setup/util');
const OBSWebSocket = require('../lib/index');

let unauthServer;
const obs = new OBSWebSocket();

test.before(async t => {
  unauthServer = await env.makeServer(4446);
  await t.notThrows(obs.connect({
    address: 'localhost:4446'
  }));
});

test.after.always('cleanup', () => {
  unauthServer.close();
});

test.cb('emits data when a server event occurs', t => {
  util.avaTimeout(t, 100);

  obs.on('GenericEvent', data => {
    t.deepEqual(data.message, 'message');
    t.end();
  });

  obs.send('echo', {
    emitMessage: {
      'update-type': 'GenericEvent',
      message: 'message'
    }
  });
});

test.cb('permits using .onEventName syntax', t => {
  util.avaTimeout(t, 100);

  obs.onSwitchScenes(data => {
    t.deepEqual(data.message, 'message');
    t.end();
  });

  obs.send('echo', {
    emitMessage: {
      'update-type': 'SwitchScenes',
      message: 'message'
    }
  });
});

test.cb('allows registering custom event listeners', t => {
  util.avaTimeout(t, 100);

  obs.registerEvent('CustomEvent');

  obs.onCustomEvent(data => {
    t.deepEqual(data.message, 'message');
    t.end();
  });

  obs.send('echo', {
    emitMessage: {
      'update-type': 'CustomEvent',
      message: 'message'
    }
  });
});
