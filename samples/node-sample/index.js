var OBSWebSocket = require('../../lib/OBSWebSocket.js');
var ws = new OBSWebSocket();

// Declare some events to listen for.
ws.onConnectionOpened = function() {
  console.log('Connection Opened');

  // Send some requests.
  ws.getSceneList(null, function(err, data) {
    console.log('Error:', err);
    console.log('Data:', data);
  });

  ws.onSceneSwitch((data) => {
    console.log(data);
  });
};

// Open the connection and Authenticate if needed. URL defaults to localhost:4444
// ws.connect(); // ws.connect('localhost', 'password');
