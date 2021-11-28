import test from 'ava';

import OBSWebSocket from '../src/msgpack.js';
import {makeServer} from './helpers/dev-server.js';

test('connects', async t => {
	const server = await makeServer();
	t.teardown(server.teardown);

	const obs = new OBSWebSocket();

	t.false(obs.identified);
	await t.notThrowsAsync(obs.connect(server.url));
	t.true(obs.identified);

	await obs.disconnect();
});
