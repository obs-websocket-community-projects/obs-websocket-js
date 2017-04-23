// Last Updated: April 22, 2017

var API = {
  availableMethods: [
    'GetVersion', 'GetAuthRequired',
    'SetCurrentScene', 'GetCurrentScene', 'GetSceneList',
    'SetSourceRender', 'SetSceneItemRender', 'SetSceneItemPosition', 'SetSceneItemTransform', 'SetSceneItemCrop',
    'GetStreamingStatus', 'StartStopStreaming', 'StartStopRecording', 'StartStreaming', 'StopStreaming', 'StartRecording', 'StopRecording',
    'GetTransitionList', 'GetCurrentTransition', 'SetCurrentTransition', 'GetTransitionDuration', 'SetTransitionDuration',
    'SetVolume', 'GetVolume', 'ToggleMute', 'GetMute', 'SetMute', 'GetSpecialSources',
    'SetCurrentSceneCollection', 'GetCurrentSceneCollection', 'ListSceneCollections',
    'SetCurrentProfile', 'GetCurrentProfile', 'ListProfiles',
    'GetStudioModeStatus', 'GetPreviewScene', 'SetPreviewScene', 'TransitionToProgram', 'EnableStudioMode', 'DisableStudioMode', 'ToggleStudioMode'
  ],
  availableEvents: [
    'ConnectionOpened', 'ConnectionClosed', 'AuthenticationSuccess', 'AuthenticationFailure',
    'SwitchScenes', 'ScenesChanged', 'SceneCollectionChanged', 'SceneCollectionListChanged',
    'SwitchTransition', 'TransitionListChanged',
    'ProfileChanged', 'ProfileListChanged',
    'StreamStarting', 'StreamStarted', 'StreamStopping', 'StreamStopped',
    'RecordingStarting', 'RecordingStarted', 'RecordingStopping', 'RecordingStopped',
    'Exiting',
    'StreamStatus',
    'TransitionDurationChanged', 'TransitionBegin',
    'SourceOrderChanged', 'SceneItemAdded', 'SceneItemRemoved', 'SceneItemVisibilityChanged',
    'PreviewSceneChanged', 'StudioModeSwitched'
  ]
};

module.exports = exports = API;
