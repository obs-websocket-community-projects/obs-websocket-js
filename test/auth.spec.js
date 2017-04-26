const test = require('ava');
const WebSocket = require('ws');
const OBSWebSocket = require('../index');
const SHA256 = require('sha.js/sha256');

function makeServer(port) {
  return new Promise((resolve, reject) => {
    const server = new WebSocket.Server({port}, err => {
      if (err) {
        return reject(err);
      }

      resolve(server);
    });
  });
}

test.before(async () => {
  const server = await makeServer(4444);
  const passwordedServer = await makeServer(5555);

  server.on('connection', socket => {
    socket.on('message', message => {
      const data = JSON.parse(message);
      let reply = {
        'message-id': data['message-id']
      };

      switch (data['request-type']) {
        case 'GetAuthRequired':
          reply = Object.assign(reply, {authRequired: false});
          break;
        default:
        // Do nothing.
      }

      socket.send(JSON.stringify(reply));
    });
  });

  const password = 'supersecretpassword';
  const salt = 'PZVbYpvAnZut2SS6JNJytDm9';
  const challenge = 'ztTBnnuqrqaKDzRM3xcVdbYm';
  const secret = new SHA256().update(password).update(salt).digest('base64');
  const expectedAuthResponse = new SHA256().update(secret).update(challenge).digest('base64');

  passwordedServer.on('connection', socket => {
    socket.on('message', message => {
      const data = JSON.parse(message);
      let reply = {
        'message-id': data['message-id']
      };

      switch (data['request-type']) {
        case 'GetAuthRequired':
          reply = Object.assign(reply, {
            authRequired: true,
            salt,
            challenge
          });
          break;
        case 'Authenticate':
          if (data.auth === expectedAuthResponse) {
            reply = Object.assign(reply, {
              status: 'ok'
            });
          } else {
            reply = Object.assign(reply, {
              status: 'error',
              error: 'Authentication Failed.'
            });
          }
          break;
        default:
          // Do nothing.
      }

      socket.send(JSON.stringify(reply));
    });
  });
});

test('connects when auth is not required', async t => {
  const obs = new OBSWebSocket();
  await t.notThrows(obs.connect());
});

test('connects when auth is required', async t => {
  const obs = new OBSWebSocket();
  await t.notThrows(obs.connect({
    address: 'localhost:5555',
    password: 'supersecretpassword'
  }));
});

test('fails to connect when the wrong password is provided', async t => {
  const obs = new OBSWebSocket();
  await t.throws(obs.connect({
    address: 'localhost:5555',
    password: 'wrong_password'
  }));
});
