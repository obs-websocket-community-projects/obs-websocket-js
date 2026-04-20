import OBSWebSocket from 'obs-websocket-js'

const obs = new OBSWebSocket();

function setStatus(message) {
	document.getElementById('status').innerText = message;
}

document.getElementById('connect-form').addEventListener('submit', async e => {
	e.preventDefault();
	const address = document.getElementById('address').value || 'ws://localhost:4455';
	const password = document.getElementById('password').value;

	try {
		setStatus('Connecting...');
		await obs.connect(address, password);
		setStatus('Connected');
	} catch (e) {
		setStatus('Error: ' + e.message);
	}
});

obs.on('Identified', () => {
	obs.call('GetSceneList').then(data => {
		const sceneListDiv = document.getElementById('scene_list');
		sceneListDiv.innerHTML = '';

		// Internal scene order != scene order in OBS, need to reverse it
		data.scenes.sort((a, b) => b.sceneIndex - a.sceneIndex).forEach(scene => {
			const sceneElement = document.createElement('button');
			sceneElement.textContent = scene.sceneName;
			sceneElement.onclick = function() {
				obs.call('SetCurrentProgramScene', {
					'sceneUuid': scene.sceneUuid
				});
			};

			sceneListDiv.appendChild(sceneElement);
		});
	});
});
