# obs-websocket-js

[![Build Status][badge-build-status]](https://travis-ci.org/haganbmj/obs-websocket-js) [![Latest release][badge-release]][Releases] [![Latest Tag][badge-tag]][Tags]

**OBSWebSocket.JS allows Javascript-based connections to [obs-websocket](https://github.com/Palakis/obs-websocket).  
Based heavily on [obs-remote](https://github.com/nodecg/obs-remote-js), which is built for the older, obs-classic compatible plugin.**

# [API Documentation](https://github.com/haganbmj/obs-websocket-js/blob/gh-pages/DOCUMENTATION.md)
# [Distributable](https://haganbmj.github.io/obs-websocket-js/obs-websocket.js)

## Usage

### Plain Javascript
Include the distributable file in the header of your HTML.
```html
<script type='text/javascript' src='dist/obs-websocket.js'></script>
```

Then make use of it.
```html
<script>
  var ws = new OBSWebSocket();

  // Bind some listeners by assigning functions, with params if applicable.
  ws.onConnectionOpened = function() {
    console.log('Connection Opened');

    // Send some requests by calling existing functions and passing callbacks.
    ws.getCurrentScene(function(err, data) {
      console.log(err, data);
    });
  };

  // Open the connection and Authenticate if needed. URL defaults to localhost:4444
  ws.connect(); // ws.connect('url', 'password');
</script>
```


### NodeJS
```sh
npm install obs-websocket-js --save
```

Add the library to your application.
```js
var OBSWebSocket = require('obs-websocket-js');
var obsWS = new OBSWebSocket();

obsWS.connect('url', 'password');
```

# Contributing
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
npm run grunt watch
```

## Formatting Guidelines
- 2 spaces rather than tabs.



  [Releases]: https://github.com/haganbmj/obs-websocket-js/releases "obs-websocket-js Releases"
  [Tags]: https://github.com/haganbmj/obs-websocket-js/tags "obs-websocket-js Tags"
  [badge-build-status]: https://img.shields.io/travis/haganbmj/obs-websocket-js/master.svg?style=flat "Travis Status"
  [badge-tag]: https://img.shields.io/github/tag/haganbmj/obs-websocket-js.svg?style=flat "Latest Tag"
  [badge-release]: https://img.shields.io/github/release/haganbmj/obs-websocket-js.svg?style=flat "Latest Release"
