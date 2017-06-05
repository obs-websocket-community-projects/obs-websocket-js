const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();

// Declare some events to listen for.
obs.onConnectionOpened(() => {
  console.log('Connection Opened');

  // Send some requests.
  obs.getSceneList({}, (err, data) => {
    console.log("Using callbacks:", err, data);
  });

  obs.getSceneList().then(data => {
    console.log("Using promises:", data);
  });
});

obs.onSwitchScenes(data => {
  console.log(data);
});

obs.connect();
