/**
 * Triggered on socket open.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onConnectionOpened = function() {};

/**
 * Triggered on socket close.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onConnectionClosed = function() {};

/**
 * Triggered on socket failure.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onConnectionFailed = function() {};

/**
 * Triggered on {@link OBSWebSocket.authenticate} success.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onAuthenticationSuccess = function() {};

/**
 * Triggered on {@link OBSWebSocket.authenticate} failure.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onAuthenticationFailure = function() {};

/**
 * Triggered on Scene Change.
 *
 * @function
 * @category listener
 * @param sceneName {string} - Name of the currently active scene.
 */
OBSWebSocket.prototype.onSceneSwitch = function(sceneName) {}; // jshint ignore:line

/**
 * Triggered when the scene list is modified (a scene has been created, removed, or renamed).
 * @function
 * @category listener
 * @param response {object}
 * @param response.currentScene {string} - Name of the currently active scene.
 * @param response.scenes {Array.<OBSScene>} - List of all scenes in the current profile.
 */
OBSWebSocket.prototype.onSceneListChanged = function(response) {}; // jshint ignore:line

/**
 * Triggered when a request to start streaming has been issued.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onStreamStarting = function() {};

/**
 * Triggered when the stream has successfully started.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onStreamStarted = function() {};

/**
 * Triggered when a request to stop streaming has been issued.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onStreamStopping = function() {};

/**
 * Triggered when the stream has successfully stopped.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onStreamStopped = function() {};

/**
 * Triggered when a request to start recording has been issued.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onRecordingStarting = function() {};

/**
 * Triggered when the recording has successfully started.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onRecordingStarted = function() {};

/**
 * Triggered when a request to stop streaming has been issued.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onRecordingStopping = function() {};

/**
 * Triggered when the recording has successfully stopped.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onRecordingStopped = function() {};

/**
 * Triggered once per second while streaming. Emits details about the stream status.
 * NOTE: This is currently only emit when streaming, it is not emit when only recording.
 *
 * @function
 * @category listener
 * @param response {object}
 * @param response.streaming {bool} - Indicates whether OBS is currently streaming.
 * @param response.recording {bool} - Indicates whether OBS is currently recording.
 * @param data.previewOnly {bool} - Always false.
 * @param response.bytesPerSec {int} - Current bitrate of the stream.
 * @param response.strain {int} - Percentage of dropped frames.
 * @param response.totalStreamTime {int} - Total uptime of the stream.
 * @param response.numTotalFrames {int} - Total number of frames since the start of stream.
 * @param response.numDroppedFrames {int} - Total number of dropped frames since the start of stream.
 * @param response.fps {double} - Current Frames per Second of the stream.
 */
OBSWebSocket.prototype.onStreamStatus = function(response) {}; // jshint ignore:line

/**
 * Triggered when OBS has been closed.
 *
 * @function
 * @category listener
 */
OBSWebSocket.prototype.onExit = function() {};
