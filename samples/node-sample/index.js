const OBSWebSocket = require('../../index.js');
const ws = new OBSWebSocket();

ws.logger.setLevel('info');

// Declare some events to listen for.
ws.onConnectionOpened(() => {
  console.log('Connection Opened');

  // Send some requests.
  ws.getSceneList(null, (err, data) => {
    console.log(err, data);
  });

  ws.onSwitchScenes((err, data) => {
    console.log(err, data);
  });
});

// Open the connection and Authenticate if needed. URL defaults to localhost:4444
// ws = new OBSWebSocket('address', 'password');
//
// ws.connect(); // ws.connect('localhost');
// ws.authenticate('password');
