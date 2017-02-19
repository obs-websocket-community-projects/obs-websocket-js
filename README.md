# obs-websocket-js

*OBSWebSocket.JS allows Javascript-based connections to [obs-websocket](https://github.com/Palakis/obs-websocket).  
Based heavily on [obs-remote](https://github.com/nodecg/obs-remote-js), built for the older, obs-classic compatible plugin.*

[![Build Status][badge-build-status]](https://travis-ci.org/haganbmj/obs-websocket-js) [![Latest release][badge-release]][Releases] [![Latest Tag][badge-tag]][Tags]

###### [Download](https://haganbmj.github.io/obs-websocket-js/dist/obs-websocket.js) | [Documentation](https://github.com/haganbmj/obs-websocket-js/blob/gh-pages/dist/DOCUMENTATION.md) | [Examples](https://github.com/haganbmj/obs-websocket-js/blob/gh-pages/samples)

## Usage

#### Plain Javascript
Include the distributable file in the header of your HTML.
```html
<script type='text/javascript' src='obs-websocket.js'></script>
```

Then make use of it.
```html
<script>
  var obs = new OBSWebSocket();

  // Bind some listeners by assigning functions, with params if applicable.
  obs.onConnectionOpened = function() {
    console.log('Connection Opened');

    // Send some requests by calling existing functions and passing callbacks.
    obs.getCurrentScene(function(err, data) {
      console.log(err, data);
    });
  };

  // Open the connection and Authenticate if needed. URL defaults to localhost:4444
  obs.connect(); // obs.connect('url', 'password');
</script>
```


#### NodeJS
```sh
npm install obs-websocket-js --save
```

Add the library to your application.
```js
var OBSWebSocket = require('obs-websocket-js');
var obs = new OBSWebSocket();

obs.connect('url', 'password');
```

## Contributing
- Install [node.js](http://nodejs.org).
- Clone the repo.
- Go nuts.
- Generate the concatenated Javascript file and API documentation by running the following...
```sh
npm install
npm install --only=dev
npm run build
```
- Run grunt watch using the following. This will only update the distribution js file, not the markdown.
```sh
npm run watch
```

#### Formatting Guidelines
- 2 spaces rather than tabs.



  [Releases]: https://github.com/haganbmj/obs-websocket-js/releases "obs-websocket-js Releases"
  [Tags]: https://github.com/haganbmj/obs-websocket-js/tags "obs-websocket-js Tags"
  [badge-build-status]: https://img.shields.io/travis/haganbmj/obs-websocket-js/master.svg?style=flat "Travis Status"
  [badge-tag]: https://img.shields.io/github/tag/haganbmj/obs-websocket-js.svg?style=flat "Latest Tag"
  [badge-release]: https://img.shields.io/github/release/haganbmj/obs-websocket-js.svg?style=flat "Latest Release"
