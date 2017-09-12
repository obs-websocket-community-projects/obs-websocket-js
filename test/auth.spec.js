const test = require('ava');
const env = require('./setup/environment');
const util = require('./setup/util');
const OBSWebSocket = require('../lib/index');
const SHA256 = require('sha.js/sha256');

let unauthServer;
let authServer;

const password = 'supersecretpassword';

test.before(async () => {
  unauthServer = await env.makeServer(4444);
  authServer = await env.makeServer(4443);

  const salt = 'PZVbYpvAnZut2SS6JNJytDm9';
  const challenge = 'ztTBnnuqrqaKDzRM3xcVdbYm';
  const secret = new SHA256().update(password).update(salt).digest('base64');
  const expectedAuthResponse = new SHA256().update(secret).update(challenge).digest('base64');

  authServer.storedResponses.GetAuthRequired = () => {
    return {
      authRequired: true,
      salt,
      challenge
    };
  };

  authServer.storedResponses.Authenticate = data => {
    return data.auth === expectedAuthResponse ? {} : {status: 'error', error: 'authentication failed'};
  };
});

test.after.always('cleanup', () => {
  authServer.close();
  unauthServer.close();
});

test('connects when auth is not required', async t => {
  const obs = new OBSWebSocket();
  await t.notThrows(obs.connect({
    address: 'localhost:4444'
  }));
});

test('connects when auth is required', async t => {
  const obs = new OBSWebSocket();
  await t.notThrows(obs.connect({
    address: 'localhost:4443',
    password
  }));
});

// FIXME: Not sure I like this behavior, it returns the raw socket response when you provide an incorrect url.
test('fails to connect when an incorrect url is provided', async t => {
  const obs = new OBSWebSocket();
  const resp = await t.throws(obs.connect({
    address: 'localhost:4442'
  }));

  t.deepEqual(resp.message, 'connect ECONNREFUSED 127.0.0.1:4442');
});

test('fails to connect when the wrong password is provided', async t => {
  const obs = new OBSWebSocket();
  const resp = await t.throws(obs.connect({
    address: 'localhost:4443',
    password: 'wrong_password'
  }));

  t.deepEqual(resp.error, 'authentication failed');
});

test.cb('emits ConnectionOpened', t => {
  util.avaTimeout(t, 400);

  const obs2 = new OBSWebSocket();
  obs2.on('ConnectionOpened', () => {
    t.end();
  });

  obs2.connect({
    address: 'localhost:4444'
  });
});

test.cb('emits ConnectionClosed', t => {
  util.avaTimeout(t, 400);

  const obs2 = new OBSWebSocket();
  obs2.on('ConnectionClosed', () => {
    t.end();
  });

  obs2.connect({
    address: 'localhost:4444'
  }).then(() => {
    obs2.disconnect();
  });
});

test.cb('emits AuthenticationSuccess', t => {
  util.avaTimeout(t, 400);

  const obs2 = new OBSWebSocket();
  obs2.on('AuthenticationSuccess', () => {
    t.end();
  });

  obs2.connect({
    address: 'localhost:4443',
    password: 'supersecretpassword'
  });
});

test.cb('emits AuthenticationFailure', t => {
  util.avaTimeout(t, 400);

  const obs2 = new OBSWebSocket();
  obs2.on('AuthenticationFailure', () => {
    t.end();
  });

  obs2.connect({
    address: 'localhost:4443',
    password: 'wrong_password'
  }).catch(() => {});
});

test.cb('throws AuthenticationFailure', t => {
  util.avaTimeout(t, 400);

  const obs2 = new OBSWebSocket();
  obs2.connect({
    address: 'localhost:4443',
    password: 'wrong_password'
  }).catch(() => {
    t.end();
  });
});

test.cb('emits error when an unhandled socket error occurs', t => {
  util.avaTimeout(t, 400);

  const obs2 = new OBSWebSocket();
  obs2.on('ConnectionOpened', () => {
    obs2._socket.onerror('first error message');
    obs2._socket.onerror('second error message');
  });

  obs2.on('error', error => {
    t.deepEqual(error, 'first error message');
    t.end();
  });

  obs2.connect({
    address: 'localhost:4444'
  });
});

test.cb('emits error when an unrecognized socket message is received', t => {
  util.avaTimeout(t, 400);

  const obs2 = new OBSWebSocket();
  obs2.on('ConnectionOpened', () => {
    obs2.send('echo', {
      emitMessage: {
        message: 'message'
      }
    });
  });

  obs2.on('error', error => {
    t.deepEqual(error.message, 'message');
    t.end();
  });

  obs2.connect({
    address: 'localhost:4444'
  });
});
