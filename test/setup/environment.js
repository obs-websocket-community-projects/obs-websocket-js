const WebSocket = require('ws');

const onMessage = function (server, message) {
  const data = JSON.parse(message);
  let reply;

  if (data.emitMessage) {
    reply = data.emitMessage;
  } else {
    reply = {
      'message-id': data['message-id'],
      status: 'ok'
    };

    // Overwrite the default values with those specific to this request.
    reply = Object.assign(reply, server.storedResponses[data['request-type']](data));
  }

  return JSON.stringify(reply);
};

function makeServer(port) {
  const server = new WebSocket.Server({port}, err => {
    if (err) {
      throw err;
    }
  });

  // Set some underlying default responses.
  server.storedResponses = {
    ValidMethodName: () => {
      return {};
    },
    InvalidMethodName: () => {
      return {status: 'error', error: 'invalid request type'};
    },
    GetAuthRequired: () => {
      return {authRequired: false};
    }
  };

  server.on('connection', socket => {
    socket.on('message', msg => {
      socket.send(onMessage(server, msg));
    });
  });

  return server;
}

module.exports = {
  makeServer
};
