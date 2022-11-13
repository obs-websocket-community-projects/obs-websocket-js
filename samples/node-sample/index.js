const { default: OBSWebSocket } = require('obs-websocket-js');
const obs = new OBSWebSocket();

// Declare some events to listen for.
obs.on('ConnectionOpened', () => {
  console.log('Connection Opened');
});

obs.on('Identified', () => {
	console.log('Identified, good to go!')

  // Send some requests.
  obs.call('GetSceneList').then((data) => {
    console.log('Scenes:', data);
  });
});

obs.on('SwitchScenes', data => {
  console.log('SwitchScenes', data);
});

obs.connect('ws://localhost:4455', 'password').then((info) => {
	console.log('Connected and identified', info)
}, () => {
	console.error('Error Connecting')
});
