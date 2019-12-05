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

Typescript definitions are included in this package, and are automatically generated to match the latest `obs-websocket` release.

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
- Address is optional; defaults to `localhost` with a port of `4444`.  
- Password is optional.  

```js
const obs = new OBSWebSocket();
obs.connect({ address: 'localhost:4444', password: '$up3rSecretP@ssw0rd' });
```

#### Sending Requests
All requests support the following two Syntax options where both `err` and `data` will contain the raw response from the WebSocket plugin.  
_Note that all response objects will supply both the original [obs-websocket][link-obswebsocket] response items in their original format (ex: `'response-item'`), but also camelCased (ex: `'responseItem'`) for convenience._  
- RequestName must exactly match what is defined by the [`obs-websocket`][link-obswebsocket] plugin.  
- `{args}` are optional. Note that both `request-type` and `message-id` will be bound automatically.  
- To use callbacks instead of promises, use the `sendCallback` method instead of `send`.

```js
// Promise API
obs.send('RequestName', {args}) // returns Promise

// Callback API
obs.sendCallback('RequestName', {args}, callback(err, data)) // no return value

// The following are additional supported requests.
obs.connect({ address: 'address', password: 'password' }) // returns Promise
obs.disconnect();
```

#### Receiving Events
For all events, `data` will contain the raw response from the WebSocket plugin.  
_Note that all response objects will supply both the original [obs-websocket][link-obswebsocket] response items in their original format (ex: `'response-item'`), but also camelCased (ex: `'responseItem'`) for convenience._  
- EventName must exactly match what is defined by the [`obs-websocket`][link-obswebsocket] plugin.

```js
obs.on('EventName', callback(data));

// The following are additional supported events.
obs.on('ConnectionOpened', callback(data));
obs.on('ConnectionClosed', callback(data));
obs.on('AuthenticationSuccess', callback(data));
obs.on('AuthenticationFailure', callback(data));
```

#### Handling Errors
By default, certain types of WebSocket errors will be thrown as uncaught exceptions.
To ensure that you are handling every error, you must do the following:
1. Add a `.catch()` handler to every returned Promise.
2. Add a `error` event listener to the `OBSWebSocket` object. By default only errors on the initial socket connection will be caught. Any subsequent errors will be emit here and will be considered uncaught without this handler.

```js
// You must add this handler to avoid uncaught exceptions.
obs.on('error', err => {
    console.error('socket error:', err);
});
```

#### Example
See more examples in [`\samples`](samples).
```js
const OBSWebSocket = require('obs-websocket-js');

const obs = new OBSWebSocket();
obs.connect({
        address: 'localhost:4444',
        password: '$up3rSecretP@ssw0rd'
    })
    .then(() => {
        console.log(`Success! We're connected & authenticated.`);

        return obs.send('GetSceneList');
    })
    .then(data => {
        console.log(`${data.scenes.length} Available Scenes!`);

        data.scenes.forEach(scene => {
            if (scene.name !== data.currentScene) {
                console.log(`Found a different scene! Switching to Scene: ${scene.name}`);

                obs.send('SetCurrentScene', {
                    'scene-name': scene.name
                });
            }
        });
    })
    .catch(err => { // Promise convention dicates you have a catch on every chain.
        console.log(err);
    });

obs.on('SwitchScenes', data => {
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

## Upgrading from 1.x to 2.x
In order to better decouple the javascript library from the [obs-websocket][link-obswebsocket] plugin the decision has been made to no longer provide method definitions for request/event methods. You are responsible for aligning your method calls with the plugin version that you would like to support.

```js
// No longer supported.
obs.getVersion();
obs.onSwitchScenes();

// Supported.
obs.send('GetVersion');
obs.on('SwitchScenes');
```

## Upgrading from 2.x to 3.x
- The `es5` build is no longer provided. If you're in an environment which must run ES5-compatible code, continue using the latest 2.x release.
- The Callback API has been separated from the Promise API. If you use callbacks in your `send` invocations, you will need to update them to use the new `sendCallback` method:

  ```js
  // No longer supported!
  obs.send('StartStreaming', (error) => {
    // Code here...
  });

  // Use this instead:
  obs.sendCallback('StartStreaming', (error) => {
    // Code here...
  });
  ```

- The `connect` method no longer accepts a callback. Use the promise it returns instead.

  ```js
  // No longer supported!
  obs.connect({address: 'localhost: 4444'}, (error) => {
    // Code here...
  });

  // Use this instead:
  obs.connect({address: 'localhost: 4444'}).then(() => {
    console.log('connected');
  }).catch((error) => {
    console.error(error);
  });
  ```

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
