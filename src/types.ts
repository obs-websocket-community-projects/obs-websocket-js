// This file is manually updated while obs-websocket doesn't have
// docs/comments.json in 5.x branch.

import {JsonObject, JsonPrimitive, JsonValue} from 'type-fest';

export enum OpCode {
	Hello = 0,
	Identify = 1,
	Identified = 2,
	Reidentify = 3,
	Event = 5,
	Request = 6,
	RequestResponse = 7,
	RequestBatch = 8,
	RequestBatchResponse = 9,
}

export interface Input {
	inputKind: string;
	inputName: string;
	unversionedInputKind: string;
}
export interface Scene {
	sceneName: string;
	isGroup: boolean;
}
export interface SceneItem {
	sceneItemId: number;
	sceneItemIndex: number;
	sourceName?: string;
	sourceType?: string;
	inputKind?: string;
	isGroup?: boolean;
}
export interface SceneItemTransform {
	sourceWidth: number;
	sourceHeight: number;
	positionX: number;
	positionY: number;
	rotation: number;
	width: number;
	height: number;
	alignment: number;
	boundsType: string;
	boundsAlignment: number;
	boundsWidth: number;
	boundsHeight: number;
	cropLeft: number;
	cropRight: number;
	cropTop: number;
	cropBottom: number;
}

export type IncomingMessage<Type = keyof IncomingMessageTypes> = Type extends keyof IncomingMessageTypes ? {
	op: Type;
	d: IncomingMessageTypes[Type];
} : never;

export type OutgoingMessage<Type = keyof OutgoingMessageTypes> = Type extends keyof OutgoingMessageTypes ? {
	op: Type;
	d: OutgoingMessageTypes[Type];
} : never;

export interface IncomingMessageTypes {
	[OpCode.Hello]: {obsWebSocketVersion: string; rpcVersion: number; authentication?: {challenge: string; salt: string}};
	[OpCode.Identified]: {negotiatedRpcVersion: number};
	[OpCode.Event]: EventMessage;
	[OpCode.RequestResponse]: ResponseMessage;
}

export interface OutgoingMessageTypes {
	[OpCode.Identify]: {rpcVersion: number; authentication?: string; ignoreInvalidMessages?: boolean; eventSubscriptions?: number};
	[OpCode.Reidentify]: {ignoreInvalidMessages?: boolean; eventSubscriptions?: number};
	[OpCode.Request]: RequestMessage;
}

export type RequestMessage<T = keyof OBSRequestTypes> = T extends keyof OBSRequestTypes ? {
	requestType: T;
	requestId: string;
	requestData: OBSRequestTypes[T];
} : never;

export type ResponseMessage<T = keyof OBSResponseTypes> = T extends keyof OBSResponseTypes ? {
	requestType: T;
	requestId: string;
	requestStatus: {result: boolean; code: number; comment: string};
	responseData: OBSResponseTypes[T];
} : never;

type EventMessage<T = keyof OBSEventTypes> = T extends keyof OBSEventTypes ? {
	eventType: T;
	eventIntent: number;
	eventData: OBSEventTypes[T];
} : never;

export interface OBSRequestTypes {
	// General
	GetVersion: void;
	BroadcastCustomEvent: JsonValue;
	GetStats: void;
	GetHotkeyList: void;
	TriggerHotkeyByName: {hotkeyName: string};
	TriggerHotkeyByKeySequence: {keyId: string; keyModifiers?: {shift?: boolean; control?: boolean; alt?: boolean; command?: boolean}};
	GetStudioModeEnabled: void;
	SetStudioModeEnabled: {studioModeEnabled: boolean};
	Sleep: {sleepMillis: number};

	// Config
	GetPersistentData: {realm: string; slotName: string};
	SetPersistentData: {realm: string; slotName: string; slotValue: JsonValue};
	GetSceneCollectionList: void;
	SetCurrentSceneCollection: {sceneCollectionName: string};
	CreateSceneCollection: {sceneCollectionName: string};
	GetProfileList: void;
	SetCurrentProfile: {profileName: string};
	CreateProfile: {profileName: string};
	RemoveProfile: {profileName: string};
	GetProfileParameter: {parameterCategory: string; parameterName: string};
	SetProfileParameter: {parameterCategory: string; parameterName: string; parameterValue?: string | null};
	GetVideoSettings: void;
	SetVideoSettings: {fpsNumerator?: number; fpsDenominator?: number; baseWidth?: number; baseHeight?: number; outputWidth?: number; outputHeight?: number};
	GetStreamServiceSettings: void;
	SetStreamServiceSettings: {streamServiceType: string; streamServiceSettings: JsonObject};

	// Sources
	GetSourceActive: {sourceName: string};
	GetSourceScreenshot: {sourceName: string; imageFormat: string; imageWidth?: number; imageHeight?: number; imageCompressionQuality?: number};
	SaveSourceScreenshot: {sourceName: string; imageFormat: string; imageFilePath: string; imageWidth?: number; imageHeight?: number; imageCompressionQuality?: number};

	// Scenes
	GetSceneList: void;
	GetCurrentProgramScene: void;
	SetCurrentProgramScene: {sceneName: string};
	GetCurrentPreviewScene: void;
	SetCurrentPreviewScene: {sceneName: string};
	CreateScene: {sceneName: string};
	RemoveScene: {sceneName: string};
	SetSceneName: {sceneName: string; newSceneName: string};

	// Inputs
	GetInputList: {inputKind?: string} | void;
	GetInputKindList: {unversioned?: string} | void;
	CreateInput: {sceneName: string; inputName: string; inputKind: string; inputSettings?: JsonObject; sceneItemEnabled?: boolean};
	SetInputName: {inputName: string; newInputName: string};
	GetInputDefaultSettings: {inputKind: string};
	GetInputSettings: {inputName: string};
	SetInputSettings: {inputName: string; inputSettings: JsonObject};
	GetInputMute: {inputName: string};
	SetInputMute: {inputName: string; inputMuted: boolean};
	ToggleInputMute: {inputName: string};
	GetInputVolume: {inputName: string};
	SetInputVolume: {inputName: string; inputVolumeMul?: number; inputVolumeDb?: number};
	GetInputAudioSyncOffset: {inputName: string};
	SetInputAudioSyncOffset: {inputName: string; inputAudioSyncOffset: number};
	GetInputAudioMonitorType: {inputName: string};
	SetInputAudioMonitorType: {inputName: string; monitorType: string};
	GetInputPropertiesListPropertyItems: {inputName: string; propertyName: string};
	PressInputPropertiesButton: {inputName: string; propertyName: string};

	// Scene Items
	GetSceneItemList: {sceneName: string};
	GetGroupSceneItemList: {sceneName: string};
	CreateSceneItem: {sceneName: string; sourceName: string; sceneItemEnabled?: boolean};
	RemoveSceneItem: {sceneName: string; sceneItemId: number};
	GetSceneItemTransform: {sceneName: string; sceneItemId: number};
	GetSceneItemEnabled: {sceneName: string; sceneItemId: number};
	SetSceneItemEnabled: {sceneName: string; sceneItemId: number; sceneItemEnabled: boolean};
	GetSceneItemLocked: {sceneName: string; sceneItemId: number};
	SetSceneItemLocked: {sceneName: string; sceneItemId: number; sceneItemLocked: boolean};
	GetSceneItemIndex: {sceneName: string; sceneItemId: number};
	SetSceneItemIndex: {sceneName: string; sceneItemId: number; sceneItemIndex: number};

	// Stream
	GetStreamStatus: void;
	ToggleStream: void;
	StartStream: void;
	StopStream: void;
}

export interface OBSResponseTypes {
	// General
	GetVersion: {obsVersion: string; obsWebSocketVersion: string; rpcVersion: string; availableRequests: string[]; supportedImageFormats: string[]};
	BroadcastCustomEvent: void;
	GetStats: {activeFps: number; availableDiskSpace: number; averageFrameRenderTime: number; cpuUsage: number; memoryUsage: number; outputSkippedFrames: number; outputTotalFrames: number; renderSkippedFrames: number; renderTotalFrames: number; webSocketSessionIncomingMessages: number; webSocketSessionOutgoingMessages: number};
	GetHotkeyList: {hotkeys: string[]};
	TriggerHotkeyByName: void;
	TriggerHotkeyByKeySequence: void;
	GetStudioModeEnabled: {studioModeEnabled: boolean};
	SetStudioModeEnabled: void;
	Sleep: void;

	// Config
	GetPersistentData: {slotValue: null | JsonValue};
	SetPersistentData: void;
	GetSceneCollectionList: {currentSceneCollectionName: string; sceneCollections: string[]};
	SetCurrentSceneCollection: void;
	CreateSceneCollection: void;
	GetProfileList: {currentProfileName: string; profiles: string[]};
	SetCurrentProfile: void;
	CreateProfile: void;
	RemoveProfile: void;
	GetProfileParameter: {parameterValue: string | null; defaultParameterValue: string | null};
	SetProfileParameter: void;
	GetVideoSettings: {baseHeight: number; baseWidth: number; fpsDenominator: number; fpsNumerator: number; outputHeight: number; outputWidth: number};
	SetVideoSettings: void;
	GetStreamServiceSettings: {streamServiceType: string; streamServiceSettings: JsonObject};
	SetStreamServiceSettings: void;

	// Sources
	GetSourceActive: {videoActive: boolean; videoShowing: boolean};
	GetSourceScreenshot: {imageData: string};
	SaveSourceScreenshot: void;

	// Scenes
	GetSceneList: {currentProgramSceneName: string; currentPreviewSceneName: null | string; scenes: Scene[]};
	GetCurrentProgramScene: {currentProgramSceneName: string};
	SetCurrentProgramScene: void;
	GetCurrentPreviewScene: {currentPreviewSceneName: string};
	SetCurrentPreviewScene: void;
	CreateScene: void;
	RemoveScene: void;
	SetSceneName: void;

	// Inputs
	GetInputList: {inputs: Input[]};
	GetInputKindList: {inputKinds: string[]};
	CreateInput: {sceneItemId: string};
	SetInputName: void;
	GetInputDefaultSettings: {defaultInputSettings: JsonObject};
	GetInputSettings: {inputSettings: JsonObject; inputKind: string};
	SetInputSettings: void;
	GetInputMute: {inputMuted: boolean};
	SetInputMute: void;
	ToggleInputMute: {inputMuted: boolean};
	GetInputVolume: {inputVolumeMul: number; inputVolumeDb: number};
	SetInputVolume: void;
	GetInputAudioSyncOffset: {inputAudioSyncOffset: number};
	SetInputAudioSyncOffset: void;
	GetInputAudioMonitorType: {monitorType: string};
	SetInputAudioMonitorType: void;
	GetInputPropertiesListPropertyItems: {propertyItems: Array<{itemEnabled: boolean; itemName: string; itemValue: JsonPrimitive}>};
	PressInputPropertiesButton: void;

	// Scene Items
	GetSceneItemList: {sceneItems: SceneItem[]};
	GetGroupSceneItemList: {sceneItems: SceneItem[]};
	CreateSceneItem: {sceneItemId: number};
	RemoveSceneItem: void;
	GetSceneItemTransform: {sceneItemTransform: SceneItemTransform};
	GetSceneItemEnabled: {sceneItemEnabled: boolean};
	SetSceneItemEnabled: void;
	GetSceneItemLocked: {sceneItemLocked: boolean};
	SetSceneItemLocked: void;
	GetSceneItemIndex: {sceneItemIndex: number};
	SetSceneItemIndex: void;

	// Stream
	GetStreamStatus: {outputActive: boolean; outputBytes: number; outputDuration: number; outputReconnecting: boolean; outputSkippedFrames: number; outputTimecode: string; outputTotalFrames: number};
	ToggleStream: {outputActive: boolean};
	StartStream: void;
	StopStream: void;
}

export interface OBSEventTypes {
	// General
	ExitStarted: void;
	StudioModeStateChanged: {studioModeEnabled: boolean};

	// Config
	CurrentSceneCollectionChanged: {sceneCollectionName: string};
	SceneCollectionListChanged: {sceneCollections: string[]};
	CurrentProfileChanged: {profileName: string};
	ProfileListChanged: {profiles: string[]};

	// Scenes
	SceneCreated: {sceneName: string; isGroup: boolean};
	SceneRemoved: {sceneName: string; isGroup: boolean};
	SceneNameChanged: {oldSceneName: string; sceneName: string};
	CurrentSceneChanged: {sceneName: string};
	CurrentPreviewSceneChanged: {sceneName: string};
	SceneListChanged: {scenes: Scene[]};

	// Inputs
	InputCreated: {inputName: string; inputKind: string; unversionedInputKind: string; inputSettings: JsonObject; defaultInputSettings: JsonObject};
	InputRemoved: {inputName: string};
	InputNameChanged: {oldInputName: string; inputName: string};
	InputActiveStateChanged: {inputName: string; videoActive: boolean};
	InputShowStateChanged: {inputName: string; videoShowing: boolean};
	InputMuteStateChanged: {inputName: string; inputMuted: boolean};
	InputVolumeChanged: {inputName: string; inputVolumeMul: number; inputVolumeDb: number};
	InputAudioSyncOffsetChanged: {inputName: string; inputAudioSyncOffset: number};
	InputAudioTracksChanged: {inputName: string; inputAudioTracks: Record<string, boolean>};
	InputAudioMonitorTypeChanged: {inputName: string; monitorType: string};

	// Transitions
	TransitionCreated: {transitionName: string; transitionKind: string; transitionFixed: boolean};
	TransitionRemoved: {transitionName: string};
	TransitionNameChanged: {oldTransitionName: string; transitionName: string};

	// Outputs
	StreamStateChanged: {outputActive: boolean; outputState: string};
	RecordStateChanged: {outputActive: boolean; outputState: string};
	ReplayBufferStateChanged: {outputActive: boolean; outputState: string};
	VirtualcamStateChanged: {outputActive: boolean; outputState: string};
	ReplayBufferSaved: {savedReplayPath: string};

	// Scene Items
	SceneItemCreated: {sceneName: string; inputName: string; sceneItemId: number; sceneItemIndex: number};
	SceneItemRemoved: {sceneName: string; inputName: string; sceneItemId: number; sceneItemIndex: number};
	SceneItemListReindexed: {sceneName: string; sceneItems: Array<{sceneItemId: number; sceneItemIndex: number}>};
	SceneItemEnableStateChanged: {sceneName: string; sceneItemId: number; sceneItemEnabled: boolean};
	SceneItemLockStateChanged: {sceneName: string; sceneItemId: number; sceneItemLocked: boolean};
	SceneItemTransformChanged: {sceneName: string; sceneItemId: number; sceneItemTransform: SceneItemTransform};

	// Media Inputs
	MediaInputPlaybackStarted: {inputName: string};
	MediaInputPlaybackEnded: {inputName: string};
	MediaInputActionTriggered: {inputName: string; mediaAction: string};
}
