import ObsWebsocketJs = require('../'); /* tslint:disable-line: no-relative-import-in-test */

const obs = new ObsWebsocketJs();
obs.connect().then().catch();
obs.connect({address: '127.0.0.1:4445', password: 'fooBarBaz'});

obs.send('SwitchScenes');
obs.send('SwitchScenes').then();
obs.send('SwitchScenes', () => {});

obs.send('SwitchScenes', {});
obs.send('SwitchScenes', {}).then();
obs.send('SwitchScenes', {}, () => {});

// $ExpectError
obs.send(null);

obs.disconnect();
