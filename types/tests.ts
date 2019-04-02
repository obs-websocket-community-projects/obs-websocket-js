import * as ObsWebsocketJs from 'obs-websocket-js';

const obs = new ObsWebsocketJs();
obs.connect().then().catch();
obs.connect({address: '127.0.0.1:4445', password: 'fooBarBaz'});

obs.send('GetVersion').then();

obs.send('Authenticate', {auth: 'foo'});
obs.send('Authenticate', {auth: 'foo'}).then();
obs.sendCallback('Authenticate', {auth: 'foo'}, (error) => {
  if (error) {
    throw error;
  }
});

// Promise response.
obs.send('GetVersion').then(data => {
  console.log(data.messageId);
  console.log(data.status);
  console.log(data.version);
  console.log(data['obs-websocket-version']);
  console.log(data['obs-studio-version']);
  console.log(data['available-requests']);
});

// Callback response.
obs.sendCallback('GetVersion', (error, data) => {
  if (error) {
    throw error;
  } else if (data) {
    console.log(data.messageId);
    console.log(data.status);
    console.log(data.version);
    console.log(data['obs-websocket-version']);
    console.log(data['obs-studio-version']);
    console.log(data['available-requests']);
  }
});

// Test missing optional args. Shouldn't error.
// obs.send('StartStreaming'); // TODO: re-enable this test once making the entire args object optional works again
obs.send('StartStreaming', {});

// Event without data.
obs.on('SwitchScenes', () => {});

// Event with data.
obs.on('TransitionBegin', (data) => {
  console.log(data.name);
  console.log(data.duration);
  console.log(data["from-scene"]);
  console.log(data["to-scene"]);
});

// Missing required args.
// $ExpectError
obs.send('Authenticate', {});

// Missing callback.
// $ExpectError
obs.sendCallback('Authenticate', {auth: 'foo'});

// Not checking for error in callback.
obs.sendCallback('GetVersion', (error, data) => {
  // $ExpectError
  console.log(data.messageId);
});

// Invalid request name.
// $ExpectError
obs.send('MadeUpRequestName');

// Invalid request name type.
// $ExpectError
obs.send(null);

obs.disconnect();
