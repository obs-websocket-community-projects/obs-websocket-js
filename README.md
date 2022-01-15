# obs-websocket-js

<p align="center"><i>
obs-websocket-js allows Javascript-based connections to the Open Broadcaster Software plugin <a href="https://github.com/obsproject/obs-websocket">obs-websocket</a>.
</i>
  <br>
  Created by <a href="https://github.com/haganbmj">Brendan Hagan</a>
  <br>
  Maintained by <a href="https://github.com/obs-websocket-community-projects">OBS Websocket Community</a>
</p>

<p align="center">
  <a href="https://github.com/obs-websocket-community-projects/obs-websocket-js/actions"><img src="https://img.shields.io/github/checks-status/obs-websocket-community-projects/obs-websocket-js/master"></a>
  <a href="https://www.npmjs.com/package/obs-websocket-js"><img src="https://img.shields.io/npm/v/obs-websocket-js.svg?style=flat"></a>
  <a href="https://www.npmjs.com/package/obs-websocket-js"><img src="https://img.shields.io/npm/dt/obs-websocket-js.svg"></a>
  <img src="https://img.shields.io/npm/l/obs-websocket-js.svg">
</p>

<p align="center"><b>
  <a href="https://github.com/obs-websocket-community-projects/obs-websocket-js/releases">Download</a> |
  <a href="https://github.com/obs-websocket-community-projects/obs-websocket-js/tree/master/samples">Samples</a> |
  <a href="https://github.com/obs-websocket-community-projects/obs-websocket-js/releases">Changelog</a>
</b></p>

# Version Warning!

> You are currently reading the documentation for upcoming v5. [For v4 documentation look here](https://github.com/obs-websocket-community-projects/obs-websocket-js/tree/v4)

---

## Installation

### Via package manager

Using a package manager like npm / yarn is the recommended installation method when you're planning to use obs-websocket-js in node.js, building a web app that you'll bundle with webpack or rollup, or for using type definitions.

```sh
npm install obs-websocket-js@next
```
or
```sh
yarn add obs-websocket-js@next
```

> Until obs-websocket 5.0 is released, the client supporting 5.x is released under next tag

## Usage

### Builds

dist folder of the npm package includes 2 different builds to support [different message encodings supported by obs-websocket](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#connection-steps).

| Connection Encoding | JSON | Msgpack |
|---|---|---|
Used by default | By web bundles | By node.js
Manually opting into | `import OBSWebSocket from 'obs-web-socket/json'` | `import OBSWebSocket from 'obs-web-socket/msgpack'`
Benefits | Easier debugging, smaller bundle | Connection uses less bandwidth
Downsides | Connection uses more bandwidth | Harder to debug, bigger bundle size

In addition each version has both modern and legacy builds. Modern bundlers will opt into modern build which uses [most modern JS features while also being supported by most modern browsers](https://github.com/developit/microbundle#-modern-mode-). If you need support for older browsers, make sure to configure your bundler to also transpile dependencies with babel or other such .

### Creating an OBS Websocket client

`OBSWebSocket` is available as the default export in ES Modules:

```ts
import OBSWebSocket from 'obs-websocket-js';

const obs = new OBSWebSocket();
```

When using commonjs `require()` it is available under the `default` object key:

```ts
const {default: OBSWebSocket} = require('obs-websocket-js');
const OBSWebSocket = require('obs-websocket-js').default;

const obs = new OBSWebSocket();
```

### Connecting

```ts
connect(url = 'ws://127.0.0.1:4444', password?: string, identificationParams = {}): Promise
```

To connect to obs-websocket server use the `connect` method.

Parameter | Description
---|---
`url`<br />`string (optional)` | Websocket URL to connect to, including protocol. (For example when connecting via a proxy that supports https use `wss://127.0.0.1:4444`)
`password`<br />`string (optional)` | Password required to authenticate with obs-websocket server
`identificationParams`<br />`object (optional)` | Object with parameters to send with the [Identify message](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#identify-opcode-1)<br />Use this to include RPC version to guarantee compatibility with server

Returns promise that resolves to data from [Hello](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#hello-opcode-0) and [Identified](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#identified-opcode-2) messages or rejects with connection error (either matching obs-websocket [WebSocketCloseCode](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#websocketclosecode) or with code -1 when non-compatible server is detected).

```ts
import OBSWebSocket, {EventSubscription} from 'obs-websocket-js';
const obs = new OBSWebSocket();

// connect to obs-websocket running on localhost with same port
await obs.connect();

// Connect to obs-ws running on 192.168.0.4
await obs.connect('ws://192.168.0.4:4444');

// Connect to localhost with password
await obs.connect('ws://127.0.0.1:4444', 'super-sekret');

// Connect expecting RPC version 1
await obs.connect('ws://127.0.0.1:4444', undefined, {rpcVersion: 1});

// Connect with request for high-volume event
await obs.connect('ws://127.0.0.1:4444', undefined, {
  eventSubscriptions: EventSubscription.All | EventSubscription.InputVolumeMeters,
  rpcVersion: 1
});

// A complete example
try {
  const {
    obsWebSocketVersion,
    negotiatedRpcVersion
  } = await obs.connect('ws://192.168.0.4:4444', 'password', {
    rpcVersion: 1
  });
  console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)
} catch (error) {
  console.error('Failed to connect', error.code, error.message);
}
```

### Reidentify

```ts
reidentify(data: {}): Promise
```

To update session parameters set by initial identification use `reidentify` method.

Parameter | Description
---|---
`data`<br />`object` | Object with parameters to send with the [Reidentify message](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#reidentify-opcode-3)

Returns promise that resolves when the server has acknowledged the request

```ts
await obs.reidentify({
  eventSubscriptions: EventSubscription.General | EventSubscription.InputShowStateChanged
});
```

### Disconnecting

```ts
disconnect(): Promise
```

Disconnects from obs-websocket server. This keeps any registered event listeners.

Returns promise that resolves when connection is closed

```ts
await obs.disconnect();
```

### Sending Requests

```ts
call(requestType: string, requestData?: object): Promise
```

Sending requests to obs-websocket is done via `call` method.

Parameter | Description
---|---
`requestType`<br />`string` | Request type ([see obs-websocket documentation](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#requests))
`requestData`<br />`object (optional)` | Request data ([see obs-websocket documentation for the request](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#requests))

Returns promise that resolves with response data (if applicable) or rejects with error from obs-websocket.

```ts
// Request without data
const {currentProgramSceneName} = await obs.call('GetCurrentProgramScene');

// Request with data
await obs.call('SetCurrentProgramScene', {sceneName: 'Gameplay'});

// Both together now
const {inputMuted} = obs.call('ToggleInputMute', {inputName: 'Camera'});
```

### Receiving Events

```ts
on(event: string, handler: Function)
once(event: string, handler: Function)
off(event: string, handler: Function)
addListener(event: string, handler: Function)
removeListener(event: string, handler: Function)
```

To listen for events emitted by obs-websocket use the event emitter API methods.

Parameter | Description
---|---
`event`<br />`string` | Event type ([see obs-websocket documentation](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#events))
`handler`<br />`Function` | Function that is called when event is sent by the server. Recieves data as the first argument ([see obs-websocket documentation for the event](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#events))


```ts
function onCurrentSceneChanged(event) {
  console.log('Current scene changed to', event.sceneName)
}

obs.on('CurrentSceneChanged', onCurrentSceneChanged);

obs.once('ExitStarted', () => {
  console.log('OBS started shutdown');

  // Just for example, not necessary should you want to reuse this instance by re-connect()
  obs.off('CurrentSceneChanged', onCurrentSceneChanged);
});
```

> Internally [eventemitter3](https://github.com/primus/eventemitter3) is used and it's documentation can be referenced for advanced usage

#### Internal events

In addition to obs-websocket events, following events are emitted by obs-websocket-js client itself:

* `ConnectionOpened` - When connection has opened (no data)
* `ConnectionClosed` - When connection closed (called with `OBSWebSocketError` object)
* `ConnectionError` - When connection closed due to an error (generally above is more useful)
* `Hello` - When server has sent Hello message (called with [Hello data](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#hello-opcode-0))
* `Identified` - When client has connected and identified (called with [Identified](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#identified-opcode-2) data)

## Typescript Support

This library is written in typescript and typescript definitions are published with the package. Each package is released with typescript defintions matching the currently released version of obs-websocket. This data can be reused from `OBSEventTypes`, `OBSRequestTypes` and `OBSResponseTypes` named exports, though in most cases function parameters will enforce the typings correctly.

```ts
import OBSWebSocket, {OBSEventTypes, OBSRequestTypes, OBSResponseTypes} from 'obs-websocket-js';

function onProfileChanged(event: OBSEventTypes['CurrentProfileChanged']) {
  event.profileName
}

obs.on('CurrentProfileChanged', onProfileChanged);
obs.on('VendorEvent', ({vendorName, eventType, eventData}) => {
  if (vendorName !== 'fancy-plugin') {
    return;
  }
});

const req: OBSRequestTypes['SetSceneName'] = {
  sceneName: 'old-and-busted',
  newSceneName: 'new-hotness'
};
obs.call('SetSceneName', req);
obs.call('SetInputMute', {
  inputName: 'loud noises',
  inputMuted: true
});
```

## Debugging

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

For more information, see the [`debug`](https://github.com/visionmedia/debug) package documentation.

## Upgrading

* Upgrading from 4.x to 5.x (available soon)
* [Upgrading from 2.x to 3.x](https://github.com/obs-websocket-community-projects/obs-websocket-js/tree/v4#upgrading-from-2x-to-3x)
* [Upgrading from 1.x to 2.x](https://github.com/obs-websocket-community-projects/obs-websocket-js/tree/v4#upgrading-from-1x-to-2x)

## Projects Using **obs-websocket-js**
_To add your project to this list, submit a Pull Request._
- [GamesDoneQuick/agdq17-layouts](https://github.com/GamesDoneQuick/agdq17-layouts)
- [nodecg/nodecg-obs](https://github.com/nodecg/nodecg-obs)

## [Contributing Guidelines](.github/CONTRIBUTING.md)
