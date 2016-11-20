## Classes

<dl>
<dt><a href="#OBSSource">OBSSource</a></dt>
<dd></dd>
<dt><a href="#OBSScene">OBSScene</a></dt>
<dd></dd>
<dt><a href="#OBSWebSocket">OBSWebSocket</a></dt>
<dd></dd>
</dl>

<a name="OBSSource"></a>

## OBSSource
**Kind**: global class  
<a name="new_OBSSource_new"></a>

### new OBSSource(name, type, x, y, boundsX, boundsY, volume, visible)

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Source name. |
| type | <code>string</code> | Type. |
| x | <code>double</code> | X position. |
| y | <code>double</code> | Y position. |
| boundsX | <code>double</code> | BoundsX. |
| boundsY | <code>double</code> | BoundsY. |
| volume | <code>double</code> | Source Volume. |
| visible | <code>bool</code> | Scene visibility. |

<a name="OBSScene"></a>

## OBSScene
**Kind**: global class  
<a name="new_OBSScene_new"></a>

### new OBSScene(name, sources)

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Source name. |
| sources | <code>[Array.&lt;OBSSource&gt;](#OBSSource)</code> | Array of [OBSSource](#OBSSource)s. |

<a name="OBSWebSocket"></a>

## OBSWebSocket
**Kind**: global class  

* [OBSWebSocket](#OBSWebSocket)
    * _listener_
        * [.onConnectionOpened()](#OBSWebSocket+onConnectionOpened)
        * [.onConnectionClosed()](#OBSWebSocket+onConnectionClosed)
        * [.onConnectionFailed()](#OBSWebSocket+onConnectionFailed)
        * [.onAuthenticationSuccess()](#OBSWebSocket+onAuthenticationSuccess)
        * [.onAuthenticationFailure()](#OBSWebSocket+onAuthenticationFailure)
        * [.onSceneSwitch()](#OBSWebSocket+onSceneSwitch)
        * [.onSceneListChanged()](#OBSWebSocket+onSceneListChanged)
        * [.onStreamStarting()](#OBSWebSocket+onStreamStarting)
        * [.onStreamStarted()](#OBSWebSocket+onStreamStarted)
        * [.onStreamStopping()](#OBSWebSocket+onStreamStopping)
        * [.onStreamStopped()](#OBSWebSocket+onStreamStopped)
        * [.onRecordingStarting()](#OBSWebSocket+onRecordingStarting)
        * [.onRecordingStarted()](#OBSWebSocket+onRecordingStarted)
        * [.onRecordingStopping()](#OBSWebSocket+onRecordingStopping)
        * [.onRecordingStopped()](#OBSWebSocket+onRecordingStopped)
        * [.onStreamStatus()](#OBSWebSocket+onStreamStatus)
        * [.onExit()](#OBSWebSocket+onExit)
    * _request_
        * [.getVersion()](#OBSWebSocket+getVersion)
        * [.getAuthRequired()](#OBSWebSocket+getAuthRequired)
        * [.authenticate()](#OBSWebSocket+authenticate)
        * [.connect()](#OBSWebSocket+connect)
        * [.getCurrentScene()](#OBSWebSocket+getCurrentScene)
        * [.setCurrentScene()](#OBSWebSocket+setCurrentScene)
        * [.getSceneList()](#OBSWebSocket+getSceneList)
        * [.setSourceVisbility()](#OBSWebSocket+setSourceVisbility)
        * [.toggleStreaming()](#OBSWebSocket+toggleStreaming)
        * [.startStreaming()](#OBSWebSocket+startStreaming)
        * [.stopStreaming()](#OBSWebSocket+stopStreaming)
        * [.startStopRecording()](#OBSWebSocket+startStopRecording)
        * [.startRecording()](#OBSWebSocket+startRecording)
        * [.stopRecording()](#OBSWebSocket+stopRecording)
        * [.getStreamStatus()](#OBSWebSocket+getStreamStatus)
        * [.getTransitionList()](#OBSWebSocket+getTransitionList)
        * [.getCurrentTransition()](#OBSWebSocket+getCurrentTransition)
        * [.setCurrentTransition()](#OBSWebSocket+setCurrentTransition)

<a name="OBSWebSocket+onConnectionOpened"></a>

### obsWebSocket.onConnectionOpened()
Triggered on socket open.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+onConnectionClosed"></a>

### obsWebSocket.onConnectionClosed()
Triggered on socket close.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+onConnectionFailed"></a>

### obsWebSocket.onConnectionFailed()
Triggered on socket failure.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+onAuthenticationSuccess"></a>

### obsWebSocket.onAuthenticationSuccess()
Triggered on [OBSWebSocket.authenticate](OBSWebSocket.authenticate) success.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+onAuthenticationFailure"></a>

### obsWebSocket.onAuthenticationFailure()
Triggered on [OBSWebSocket.authenticate](OBSWebSocket.authenticate) failure.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+onSceneSwitch"></a>

### obsWebSocket.onSceneSwitch()
Triggered on Scene Change.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+onSceneListChanged"></a>

### obsWebSocket.onSceneListChanged()
Triggered when the scene list is modified (a scene has been created, removed, or renamed).

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+onStreamStarting"></a>

### obsWebSocket.onStreamStarting()
Triggered when a request to start streaming has been issued.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+onStreamStarted"></a>

### obsWebSocket.onStreamStarted()
Triggered when the stream has successfully started.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+onStreamStopping"></a>

### obsWebSocket.onStreamStopping()
Triggered when a request to stop streaming has been issued.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+onStreamStopped"></a>

### obsWebSocket.onStreamStopped()
Triggered when the stream has successfully stopped.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+onRecordingStarting"></a>

### obsWebSocket.onRecordingStarting()
Triggered when a request to start recording has been issued.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+onRecordingStarted"></a>

### obsWebSocket.onRecordingStarted()
Triggered when the recording has successfully started.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+onRecordingStopping"></a>

### obsWebSocket.onRecordingStopping()
Triggered when a request to stop streaming has been issued.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+onRecordingStopped"></a>

### obsWebSocket.onRecordingStopped()
Triggered when the recording has successfully stopped.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+onStreamStatus"></a>

### obsWebSocket.onStreamStatus()
Triggered once per second while streaming. Emits details about the stream status.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+onExit"></a>

### obsWebSocket.onExit()
Triggered when OBS has been closed.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: listener  
<a name="OBSWebSocket+getVersion"></a>

### obsWebSocket.getVersion()
Retrieve OBSWebSocket version information.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+getAuthRequired"></a>

### obsWebSocket.getAuthRequired()
Retrieve information about the OBSWebSocket authentication requirements.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+authenticate"></a>

### obsWebSocket.authenticate()
Attempt to authenticate the OBSWebSocket connection.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+connect"></a>

### obsWebSocket.connect()
Initialize and authenticate the connection.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+getCurrentScene"></a>

### obsWebSocket.getCurrentScene()
Retrieve the currently active scene.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+setCurrentScene"></a>

### obsWebSocket.setCurrentScene()
Set the currently active scene.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+getSceneList"></a>

### obsWebSocket.getSceneList()
Retrieve the list of available scenes.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+setSourceVisbility"></a>

### obsWebSocket.setSourceVisbility()
Set the visibility of a selected source.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+toggleStreaming"></a>

### obsWebSocket.toggleStreaming()
Toggle streaming state.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+startStreaming"></a>

### obsWebSocket.startStreaming()
Start streaming.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+stopStreaming"></a>

### obsWebSocket.stopStreaming()
Stop streaming.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+startStopRecording"></a>

### obsWebSocket.startStopRecording()
Toggle recording state.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+startRecording"></a>

### obsWebSocket.startRecording()
Start recording.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+stopRecording"></a>

### obsWebSocket.stopRecording()
Stop recording.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+getStreamStatus"></a>

### obsWebSocket.getStreamStatus()
Retrieve details about the stream status.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+getTransitionList"></a>

### obsWebSocket.getTransitionList()
Retrieve the list of available transitions.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+getCurrentTransition"></a>

### obsWebSocket.getCurrentTransition()
Retrieve the currently selected transition.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
<a name="OBSWebSocket+setCurrentTransition"></a>

### obsWebSocket.setCurrentTransition()
Set the currently selected transition.

**Kind**: instance method of <code>[OBSWebSocket](#OBSWebSocket)</code>  
**Category**: request  
