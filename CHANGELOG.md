# 0.4.0
- Rewrite.
- Implement Promises and Event Emitter.
  - Events are now emit using `on('EventName', callback)`
  - Events can also be referenced `onEventName(callback)`
  - Requests now use the syntax `send('RequestName', {args}, callback) returns Promise`
  - Requests can also be referenced `EventName({args}, callback) returns Promise`
    - In both cases `callback(err, data)`
- Stop trying to marshal the response data.
  - Aside from CamelCasing all the response data, no other actions are taken on the response at the moment.
  - No marshaling is done on the request objects at the moment.
- Note that some method names have changed. Please reference [obs-websocket](https://github.com/Palakis/obs-websocket) for the API.

# 0.3.3
- Fix NPM Registration

# 0.3.0
- Add .disconnect
- Fix .onSceneListChanged
- Fix .setSourceVisibility
- API changes to .onStreamStatus to match obs-websocket API.
  - response.numberOfFrames => response.numTotalFrames
  - response.numberOfDroppedFrames => response.numDroppedFrames
- Extend documentation.
