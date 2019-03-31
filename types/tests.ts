import * as ObsWebsocketJs from 'obs-websocket-js';

const obs = new ObsWebsocketJs();
obs.connect().then().catch();
obs.connect({address: '127.0.0.1:4445', password: 'fooBarBaz'});

obs.send('GetVersion').then();

obs.send('Authenticate', {auth: 'foo'});
obs.send('Authenticate', {auth: 'foo'}).then();

// Test missing optional args. Shouldn't error.
// obs.send('StartStreaming'); // TODO: re-enable this test once making the entire args object optional works again
obs.send('StartStreaming', {});

obs.on('SwitchScenes', () => {});

// Missing required args.
// $ExpectError
obs.send('Authenticate', {});

// $ExpectError
obs.send('MadeUpRequestName');

// $ExpectError
obs.send(null);

obs.disconnect();
