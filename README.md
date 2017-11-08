# obs-websocket-js

<p align="center"><i>
OBSWebSocket.JS allows Javascript-based connections to the Open Broadcaster plugin <a href="https://github.com/Palakis/obs-websocket">obs-websocket</a>.
</i></p>

<p align="center">
  <a href="https://travis-ci.org/haganbmj/obs-websocket-js"><img src="https://img.shields.io/travis/haganbmj/obs-websocket-js/master.svg?style=flat"></a>
  <a href="https://coveralls.io/github/haganbmj/obs-websocket-js?branch=master"><img src="https://coveralls.io/repos/github/haganbmj/obs-websocket-js/badge.svg?branch=master"></a>
  <a href="https://libraries.io/bower/obs-websocket-js"><img src="https://img.shields.io/bower/v/obs-websocket-js.svg?style=flat"></a>
  <a href="https://www.npmjs.com/package/obs-websocket-js"><img src="https://img.shields.io/npm/v/obs-websocket-js.svg?style=flat"></a>
  <a href="https://www.npmjs.com/package/obs-websocket-js"><img src="https://img.shields.io/npm/dt/obs-websocket-js.svg"></a>
  <img src="https://img.shields.io/npm/l/obs-websocket-js.svg">
  <a href="https://greenkeeper.io/"><img src="https://badges.greenkeeper.io/haganbmj/obs-websocket-js.svg"></a>
</p>

<p align="center"><b>
  <a href="https://raw.githubusercontent.com/haganbmj/obs-websocket-js/gh-pages/dist/obs-websocket.js">Download</a> |
  <a href="https://github.com/haganbmj/obs-websocket-js/tree/master/samples">Samples</a> |
  <a href="https://github.com/haganbmj/obs-websocket-js/blob/gh-pages/CHANGELOG.md">Changelog</a>
</b></p>

## Installation

```sh
npm install obs-websocket-js --save

bower install obs-websocket-js --save
```

## Usage
#### Instantiation
The web distributable exposes a global named `OBSWebSocket`.  

```html
<script type='text/javascript' src='./dist/obs-websocket.js'></script>
```

In node...  

```js
const OBSWebSocket = require('obs-websocket-js');
```

Create a new WebSocket connection using the following.
- Address is optional; defaults to `localhost` with a default port of `4444`.  
- Password is optional.  

```js
const obs = new OBSWebSocket();
obs.connect({ address: 'localhost:4444', password: '$up3rSecretP@ssw0rd' });
```

#### Sending Requests
All requests support the following two Syntax options where both `err` and `data` will contain the raw response from the WebSocket plugin.  
_Note that all response objects will supply both the original [obs-websocket][link-obswebsocket] response items in their original format (ex: `'response-item'`), but also camelCased (ex: `'responseItem'`) for convenience._  
- RequestName must exactly match what is defined by the [`obs-websocket`][link-obswebsocket] plugin.  
  - When calling a method directly (instead of via `.send`), you may also use the `lowerCamelCase` version of the request, i.e. `requestName` instead of `RequestName`. This may be preferred if you use a linter such as [ESlint](http://eslint.org/).
- `{args}` are optional. Note that both `request-type` and `message-id` will be bound automatically.  
- `callback(err, data)` is optional.  

```js
// These three options are equivalent for every available request.
obs.send('RequestName', {args}, callback(err, data)) returns Promise
obs.RequestName({args}, callback(err, data)) returns Promise
obs.requestName({args}, callback(err, data)) returns Promise

// The following are additional supported requests.
obs.connect({ address: 'address', password: 'password' }, callback(err, data)) returns Promise
```

#### Receiving Events
All events support the following two Syntax options where `data` will contain the raw response from the WebSocket plugin.  
_Note that all response objects will supply both the original [obs-websocket][link-obswebsocket] response items in their original format (ex: `'response-item'`), but also camelCased (ex: `'responseItem'`) for convenience._  
- EventName must exactly match what is defined by the [`obs-websocket`][link-obswebsocket] plugin.

```js
obs.on('EventName', callback(data));
obs.onEventName(callback(data));

// The following are additional supported requests.
obs.on('ConnectionOpened', callback(data));
obs.on('ConnectionClosed', callback(data));
obs.on('AuthenticationSuccess', callback(data));
obs.on('AuthenticationFailure', callback(data));
```

#### Custom Requests/Events
If this does not yet support a new method, or if you have custom hooks in your build of [`obs-websocket`][link-obswebsocket] and prefer to use the `obs.requestName` and `obs.onEventName` syntaxes, you can register your own methods at runtime. As always, these must match exactly what is to be expected from the plugin.  

```js
obs.registerRequest('RequestName')
obs.registerRequest(['RequestName1', 'RequestName2'])

obs.registerEvent('EventName')
obs.registerEvent(['EventName1', 'EventName2'])
```

#### Handling Errors
By default, certain types of WebSocket errors will be thrown as uncaught exceptions.
To ensure that you are handling every error, you must do the following:
1. Add a `.catch()` handler to every returned Promise.
2. Add a `error` event listener to the `OBSWebSocket` object.

#### Example
See more examples in [`\samples`](samples).
```js
const OBSWebSocket = require('obs-websocket-js');

const obs = new OBSWebSocket();
obs.connect({ address: 'localhost:4444', password: '$up3rSecretP@ssw0rd' })
  .then(() => {
    console.log(`Success! We're connected & authenticated.`);
    
	  return obs.getSceneList();
  })
  .then(data => {
    console.log(`${data.scenes.length} Available Scenes!`);
    
    data.scenes.forEach(scene => {
      if (scene.name !== data.currentScene) {
        console.log(`Found a different scene! Switching to Scene: ${scene.name}`);

        obs.setCurrentScene({'scene-name': scene.name});
      }
    });
  })
  .catch(err => { // Promise convention dicates you have a catch on every chain.
    console.log(err);
  });

obs.onSwitchScenes(data => {
  console.log(`New Active Scene: ${data.sceneName}`);
});

// You must add this handler to avoid uncaught exceptions.
obs.on('error', err => {
	console.error('socket error:', err);
});
```

#### Debugging
To enable debug logging, set the `DEBUG` environment variable:

```sh
# Enables debug logging for all modules of osb-websocket-js
DEBUG=obs-websocket-js:*

# on Windows
set DEBUG=obs-websocket-js:*
```

If you have multiple libraries or application which use the `DEBUG` environment variable, they can be joined with commas:

```sh
DEBUG=foo,bar:*,obs-websocket-js:*

# on Windows
set DEBUG=foo,bar:*,obs-websocket-js:*
```

Browser debugging uses `localStorage`

```js
localStorage.debug = 'obs-websocket-js:*';

localStorage.debug = 'foo,bar:*,obs-websocket-js:*';
```

For more information, see the [`debug`][link-debug] documentation.

## Projects Using **obs-websocket-js**
_To add your project to this list, submit a Pull Request._
- [GamesDoneQuick/agdq17-layouts](https://github.com/GamesDoneQuick/agdq17-layouts)
- [nodecg/nodecg-obs](https://github.com/nodecg/nodecg-obs)

## [Contributing Guidelines][link-contributing]



  [badge-build-status]: https://img.shields.io/travis/haganbmj/obs-websocket-js/master.svg?style=flat "Travis Status"
  [badge-tag]: https://img.shields.io/github/tag/haganbmj/obs-websocket-js.svg?style=flat "Latest Tag"
  [badge-release]: https://img.shields.io/github/release/haganbmj/obs-websocket-js.svg?style=flat "Latest Release"
  [badge-coveralls]: https://coveralls.io/repos/github/haganbmj/obs-websocket-js/badge.svg?branch=master "Coveralls Status"
  [badge-npm-downloads]: https://img.shields.io/npm/dt/obs-websocket-js.svg "NPM Downloads"

  [link-obswebsocket]: https://github.com/Palakis/obs-websocket "OBS WebSocket Plugin"
  [link-Travis-CI]: https://travis-ci.org/haganbmj/obs-websocket-js "Travis CI"
  [link-Coveralls]: https://coveralls.io/github/haganbmj/obs-websocket-js?branch=master "Coveralls"
  [link-releases]:  https://github.com/haganbmj/obs-websocket-js/releases "obs-websocket-js Releases"
  [link-tags]: https://github.com/haganbmj/obs-websocket-js/tags "obs-websocket-js Tags"
  [link-download]: https://raw.githubusercontent.com/haganbmj/obs-websocket-js/gh-pages/dist/obs-websocket.js "Download"
  [link-documentation]: https://github.com/haganbmj/obs-websocket-js/blob/gh-pages/DOCUMENTATION.md "Documentation"
  [link-samples]: https://github.com/haganbmj/obs-websocket-js/tree/master/samples "Samples"
  [link-changelog]: https://github.com/haganbmj/obs-websocket-js/blob/gh-pages/CHANGELOG.md "Changelog"
  [link-contributing]: .github/CONTRIBUTING.md "Contributing"
  [link-debug]: https://github.com/visionmedia/debug "Debug Documentation"
