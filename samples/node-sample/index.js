const OBSWebSocket = require('../../index.js');
const ws = new OBSWebSocket();

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

ws.connect();
