// Last Updated: July 06, 2017

const API = {
  availableMethods: [
    'GetVersion', 'GetAuthRequired',
    'SetCurrentScene', 'GetCurrentScene', 'GetSceneList',
    'SetSourceRender', 'SetSceneItemRender', 'SetSceneItemPosition', 'SetSceneItemTransform', 'SetSceneItemCrop',
    'GetStreamingStatus', 'StartStopStreaming', 'StartStopRecording', 'StartStreaming', 'StopStreaming', 'StartRecording', 'StopRecording',
    'GetTransitionList', 'GetCurrentTransition', 'SetCurrentTransition', 'GetTransitionDuration', 'SetTransitionDuration',
    'SetVolume', 'GetVolume', 'ToggleMute', 'GetMute', 'SetMute', 'GetSpecialSources',
    'SetCurrentSceneCollection', 'GetCurrentSceneCollection', 'ListSceneCollections',
    'SetCurrentProfile', 'GetCurrentProfile', 'ListProfiles',
    'GetStudioModeStatus', 'GetPreviewScene', 'SetPreviewScene', 'TransitionToProgram', 'EnableStudioMode', 'DisableStudioMode', 'ToggleStudioMode',
    'GetCurrentRTMPSettings', 'GetRecordingFolder', 'SetRecordingFolder',
    'GetTextGDIPlusProperties', 'SetTextGDIPlusProperties', 'GetBrowserSourceProperties', 'SetBrowserSourceProperties',
    'GetStreamSettings', 'SetStreamSettings', 'SaveStreamSettings'
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

module.exports = API;
