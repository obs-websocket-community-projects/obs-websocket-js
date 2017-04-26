# obs-websocket-js

*OBSWebSocket.JS allows Javascript-based connections to [obs-websocket][link-obswebsocket].*

[![Build Status][badge-build-status]][link-Travis-CI] [![Latest release][badge-release]][link-releases] [![Latest Tag][badge-tag]][link-tags]

##### [Download][link-download] | [Samples][link-samples] | [Changelog][link-changelog]

## Installation
```sh
npm install obs-websocket-js --save
```
```html
<script type='text/javascript' src='./dist/obs-websocket.js'></script>
```

## Usage
#### Instantiation
The web distributable exposes a global named `OBSWebSocket`.  
In node.js, import the project using the following.  

```js
var OBSWebSocket = require('obs-websocket-js');
```

Create a new WebSocket connection using the following.
- Address is optional; defaults to `localhost` with a default port of `4444`.  
- Password is optional.  

```js
var obs = new OBSWebSocket('address', 'password');
```

#### Sending Requests
All requests support the following two Syntax options where both `err` and `data` will contain the raw response from the WebSocket plugin.  
_Note that all response objects will supply both the original [obs-websocket][link-obswebsocket] response items in their original format (ex: `'response-item'`), but also camelCased (ex: `'responseItem'`) for convenience._  
- RequestName must exactly match what is defined by the [obs-websocket][link-obswebsocket] plugin.  
- {args} are optional. Note that both `request-type` and `message-id` will be bound automatically.  
- callback(err, data) is optional.  

```js
obs.send('RequestName', {args}, callback(err, data)) returns Promise
obs.RequestName({args}, callback(err, data)) returns Promise

// The following are additional supported requests.
obs.connect({ address: 'address' }, callback(err, data)) returns Promise
obs.authenticate({ password: 'password' }, callback(err, data)) returns Promise
```

#### Receiving Events
All events support the following two Syntax options where both `err` and `data` will contain the raw response from the WebSocket plugin.  
_Note that all response objects will supply both the original [obs-websocket][link-obswebsocket] response items in their original format (ex: `'response-item'`), but also camelCased (ex: `'responseItem'`) for convenience._  
- EventName must exactly match what is defined by the [obs-websocket][link-obswebsocket] plugin.

```js
obs.on('EventName', callback(err, data));
obs.onEventName(callback(err, data));

// The following are additional supported requests.
obs.on('ConnectionOpened', callback(err, data));
obs.on('ConnectionClosed', callback(err, data));
obs.on('AuthenticationSuccess', callback(err, data));
obs.on('AuthenticationFailure', callback(err, data));
```

#### Example
```js
var OBSWebSocket = require('obs-websocket-js');

var obs = new OBSWebSocket('localhost:4444', '$up3rSecretP@ssw0rd');

obs.onAuthenticationSuccess(function(err, data) {
  console.log("Success! We're Authenticated.");

  obs.GetSceneList({})
    .then((data) => {
      console.log(data.scenes.length + ' Available Scenes!');

      data.scenes.forEach((scene) => {
        if (scene.name != data.currentScene) {
          console.log('Found a different scene! Switching to Scene:', scene.name);

          obs.SetCurrentScene({ 'scene-name': scene.name });

          return;
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

obs.onSwitchScenes((err, data) => {
  console.log('New Active Scene: ', data.sceneName);
});
```

## TODOs
- Unit testing / Socket mocking.
- More examples.

## Projects Using **obs-websocket-js**
_To add your project to this list, submit a Pull Request._
- [GamesDoneQuick/agdq17-layouts](https://github.com/GamesDoneQuick/agdq17-layouts)

## [Contributing Guidelines][link-contributing]



  [link-obswebsocket]: https://github.com/Palakis/obs-websocket "OBS WebSocket Plugin"
  [link-Travis-CI]: https://travis-ci.org/haganbmj/obs-websocket-js "Travis CI"
  [badge-build-status]: https://img.shields.io/travis/haganbmj/obs-websocket-js/master.svg?style=flat "Travis Status"
  [badge-tag]: https://img.shields.io/github/tag/haganbmj/obs-websocket-js.svg?style=flat "Latest Tag"
  [badge-release]: https://img.shields.io/github/release/haganbmj/obs-websocket-js.svg?style=flat "Latest Release"

  [link-releases]:  https://github.com/haganbmj/obs-websocket-js/releases "obs-websocket-js Releases"
  [link-tags]: https://github.com/haganbmj/obs-websocket-js/tags "obs-websocket-js Tags"
  [link-download]: https://github.com/haganbmj/obs-websocket-js/blob/gh-pages/dist/obs-websocket.js "Download"
  [link-documentation]: https://github.com/haganbmj/obs-websocket-js/blob/gh-pages/DOCUMENTATION.md "Documentation"
  [link-samples]: https://github.com/haganbmj/obs-websocket-js/tree/master/samples "Samples"
  [link-changelog]: https://github.com/haganbmj/obs-websocket-js/blob/gh-pages/CHANGELOG.md "Changelog"
  [link-contributing]: .github/CONTRIBUTING.md "Contributing"
