var obsWSJS = require('obs-websocket-js');
var ws = new obsWSJS.OBSWebSocket();

// Declare some events to listen for.
ws.onConnectionOpened = function() {
  console.log('Connection Opened');

  // Send some requests.
  ws.getSceneList(function(err, data) {
    console.log('Error:', err);
    console.log('Data:', data);
  });
};

ws.onConnectionFailed = function() {
  console.log('Connection Failed');
};

// Open the connection and Authenticate if needed. URL defaults to localhost:4444
ws.connect(); // ws.connect('localhost', 'password');
