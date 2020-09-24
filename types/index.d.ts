// This file is generated, do not edit.
// TypeScript Version: 3.1
/// <reference types="node" />
declare module "obs-websocket-js" {
  import { EventEmitter } from "events";

  namespace ObsWebSocket {
    type Callback<K extends keyof RequestMethodReturnMap> = (
      error?: Error | ObsWebSocket.ObsError,
      response?: RequestMethodReturnMap[K]
    ) => void;

    interface ObsError {
      messageId: string;
      status: "error";
      error: string;
    }

    interface SceneItem {
      source_cx: number;
      cy: number;
      alignment: number;
      name: string;
      id: number;
      render: boolean;
      muted: boolean;
      locked: boolean;
      cx: number;
      source_cy: number;
      type: string;
      volume: number;
      x: number;
      y: number;
      parentGroupName?: string;
      groupChildren?: ObsWebSocket.SceneItem[];
    }

    interface SceneItemTransform {
      locked: boolean;
      groupChildren?: ObsWebSocket.SceneItemTransform[];
      parentGroupName?: string;
      rotation: number;
      height: number;
      width: number;
      sourceHeight: number;
      sourceWidth: number;
      visible: boolean;
      bounds: { y: number; type: string; alignment: number; x: number };
      crop: { left: number; bottom: number; right: number; top: number };
      position: { y: number; alignment: number; x: number };
      scale: { y: number; x: number };
    }

    interface OBSStats {
      fps: number;
      "render-total-frames": number;
      "render-missed-frames": number;
      "output-total-frames": number;
      "output-skipped-frames": number;
      "average-frame-time": number;
      "cpu-usage": number;
      "memory-usage": number;
      "free-disk-space": number;
    }

    interface Output {
      name: string;
      totalBytes: number;
      width: number;
      height: number;
      flags: {
        service: boolean;
        encoded: boolean;
        video: boolean;
        audio: boolean;
        rawValue: number;
        multiTrack: boolean;
      };
      droppedFrames: number;
      totalFrames: number;
      congestion: number;
      reconnecting: boolean;
      type: string;
      active: boolean;
      settings: {};
    }

    interface Scene {
      name: string;
      sources: ObsWebSocket.SceneItem[];
    }
  }

  interface RequestMethodsArgsMap {
    GetVersion: void;

    GetAuthRequired: void;

    Authenticate: { auth: string };

    SetHeartbeat: { enable: boolean };

    SetFilenameFormatting: { "filename-formatting": string };

    GetFilenameFormatting: void;

    GetStats: void;

    BroadcastCustomMessage: { realm: string; data: {} };

    GetVideoInfo: void;

    OpenProjector: {
      type?: string;
      monitor?: number;
      geometry?: string;
      name?: string;
    };

    ListOutputs: void;

    GetOutputInfo: { outputName: string };

    StartOutput: { outputName: string };

    StopOutput: { outputName: string; force?: boolean };

    SetCurrentProfile: { "profile-name": string };

    GetCurrentProfile: void;

    ListProfiles: void;

    StartStopRecording: void;

    StartRecording: void;

    StopRecording: void;

    PauseRecording: void;

    ResumeRecording: void;

    SetRecordingFolder: { "rec-folder": string };

    GetRecordingFolder: void;

    StartStopReplayBuffer: void;

    StartReplayBuffer: void;

    StopReplayBuffer: void;

    SaveReplayBuffer: void;

    SetCurrentSceneCollection: { "sc-name": string };

    GetCurrentSceneCollection: void;

    ListSceneCollections: void;

    GetSceneItemProperties: {
      "scene-name"?: string;
      item: { name?: string; id?: number };
    };

    SetSceneItemProperties: {
      "scene-name"?: string;
      rotation?: number;
      item: { name?: string; id?: number };
      visible?: boolean;
      locked?: boolean;
      position: { y?: number; alignment?: number; x?: number };
      bounds: { y?: number; type?: string; alignment?: number; x?: number };
      scale: { x?: number; y?: number };
      crop: { bottom?: number; left?: number; right?: number; top?: number };
    };

    ResetSceneItem: {
      "scene-name"?: string;
      item: { name?: string; id?: number };
    };

    SetSceneItemRender: {
      "scene-name"?: string;
      source: string;
      render: boolean;
    };

    SetSceneItemPosition: {
      "scene-name"?: string;
      item: string;
      x: number;
      y: number;
    };

    SetSceneItemTransform: {
      "scene-name"?: string;
      item: string;
      "x-scale": number;
      "y-scale": number;
      rotation: number;
    };

    SetSceneItemCrop: {
      "scene-name"?: string;
      item: string;
      top: number;
      bottom: number;
      left: number;
      right: number;
    };

    DeleteSceneItem: { scene?: string; item: { name: string; id: number } };

    DuplicateSceneItem: {
      fromScene?: string;
      toScene?: string;
      item: { name: string; id: number };
    };

    SetCurrentScene: { "scene-name": string };

    GetCurrentScene: void;

    GetSceneList: void;

    ReorderSceneItems: {
      scene?: string;
      items: ObsWebSocket.Scene[];
      "items[]": { id?: number; name?: string };
    };

    SetSceneTransitionOverride: {
      sceneName: string;
      transitionName: string;
      transitionDuration?: number;
    };

    RemoveSceneTransitionOverride: { sceneName: string };

    GetSceneTransitionOverride: { sceneName: string };

    GetSourcesList: void;

    GetSourceTypesList: void;

    GetVolume: { source: string; useDecibel?: boolean };

    SetVolume: { source: string; volume: number; useDecibel?: boolean };

    GetMute: { source: string };

    SetMute: { source: string; mute: boolean };

    ToggleMute: { source: string };

    SetSourceName: { sourceName: string; newName: string };

    SetSyncOffset: { source: string; offset: number };

    GetSyncOffset: { source: string };

    GetSourceSettings: { sourceName: string; sourceType?: string };

    SetSourceSettings: {
      sourceName: string;
      sourceType?: string;
      sourceSettings: {};
    };

    GetTextGDIPlusProperties: { source: string };

    SetTextGDIPlusProperties: {
      source: string;
      render?: boolean;
      "bk-color"?: number;
      "bk-opacity"?: number;
      chatlog?: boolean;
      chatlog_lines?: number;
      color?: number;
      extents?: boolean;
      extents_cx?: number;
      extents_cy?: number;
      file?: string;
      read_from_file?: boolean;
      font?: { style?: string; size?: number; face?: string; flags?: number };
      vertical?: boolean;
      align?: string;
      valign?: string;
      text?: string;
      gradient?: boolean;
      gradient_color?: number;
      gradient_dir?: number;
      gradient_opacity?: number;
      outline?: boolean;
      outline_color?: number;
      outline_size?: number;
      outline_opacity?: number;
    };

    GetTextFreetype2Properties: { source: string };

    SetTextFreetype2Properties: {
      source: string;
      word_wrap?: boolean;
      color2?: number;
      custom_width?: number;
      drop_shadow?: boolean;
      font?: { style?: string; flags?: number; face?: string; size?: number };
      text_file?: string;
      text?: string;
      color1?: number;
      outline?: boolean;
      from_file?: boolean;
      log_mode?: boolean;
    };

    GetBrowserSourceProperties: { source: string };

    SetBrowserSourceProperties: {
      source: string;
      is_local_file?: boolean;
      local_file?: string;
      url?: string;
      css?: string;
      width?: number;
      height?: number;
      fps?: number;
      shutdown?: boolean;
      render?: boolean;
    };

    GetSpecialSources: void;

    GetSourceFilters: { sourceName: string };

    GetSourceFilterInfo: { sourceName: string; filterName: string };

    AddFilterToSource: {
      sourceName: string;
      filterName: string;
      filterType: string;
      filterSettings: {};
    };

    RemoveFilterFromSource: { sourceName: string; filterName: string };

    ReorderSourceFilter: {
      sourceName: string;
      filterName: string;
      newIndex: number;
    };

    MoveSourceFilter: {
      sourceName: string;
      filterName: string;
      movementType: string;
    };

    SetSourceFilterSettings: {
      sourceName: string;
      filterName: string;
      filterSettings: {};
    };

    SetSourceFilterVisibility: {
      sourceName: string;
      filterName: string;
      filterEnabled: boolean;
    };

    GetAudioMonitorType: { sourceName: string };

    SetAudioMonitorType: { sourceName: string; monitorType: string };

    TakeSourceScreenshot: {
      sourceName: string;
      embedPictureFormat?: string;
      saveToFilePath?: string;
      fileFormat?: string;
      compressionQuality?: number;
      width?: number;
      height?: number;
    };

    GetStreamingStatus: void;

    StartStopStreaming: void;

    StartStreaming: {
      stream?: {
        type?: string;
        metadata?: {};
        settings?: {
          server?: string;
          key?: string;
          use_auth?: boolean;
          username?: string;
          password?: string;
        };
      };
    };

    StopStreaming: void;

    SetStreamSettings: {
      type: string;
      settings: {
        server?: string;
        key?: string;
        use_auth?: boolean;
        username?: string;
        password?: string;
      };
      save: boolean;
    };

    GetStreamSettings: void;

    SaveStreamSettings: void;

    SendCaptions: { text: string };

    GetStudioModeStatus: void;

    GetPreviewScene: void;

    SetPreviewScene: { "scene-name": string };

    TransitionToProgram: {
      "with-transition"?: { name: string; duration?: number };
    };

    EnableStudioMode: void;

    DisableStudioMode: void;

    ToggleStudioMode: void;

    GetTransitionList: void;

    GetCurrentTransition: void;

    SetCurrentTransition: { "transition-name": string };

    SetTransitionDuration: { duration: number };

    GetTransitionDuration: void;

    GetTransitionPosition: void;
  }

  interface RequestMethodReturnMap {
    GetVersion: {
      messageId: string;
      status: "ok";
      version: number;
      "obs-websocket-version": string;
      "obs-studio-version": string;
      "available-requests": string;
      "supported-image-export-formats": string;
    };

    GetAuthRequired: {
      messageId: string;
      status: "ok";
      authRequired: boolean;
      challenge?: string;
      salt?: string;
    };

    Authenticate: void;

    SetHeartbeat: void;

    SetFilenameFormatting: void;

    GetFilenameFormatting: {
      messageId: string;
      status: "ok";
      "filename-formatting": string;
    };

    GetStats: { messageId: string; status: "ok"; stats: ObsWebSocket.OBSStats };

    BroadcastCustomMessage: void;

    GetVideoInfo: {
      messageId: string;
      status: "ok";
      baseWidth: number;
      baseHeight: number;
      outputWidth: number;
      outputHeight: number;
      scaleType: string;
      fps: number;
      videoFormat: string;
      colorSpace: string;
      colorRange: string;
    };

    OpenProjector: void;

    ListOutputs: {
      messageId: string;
      status: "ok";
      outputs: Array<{ [k: string]: any }>;
    };

    GetOutputInfo: { messageId: string; status: "ok"; outputInfo: {} };

    StartOutput: void;

    StopOutput: void;

    SetCurrentProfile: void;

    GetCurrentProfile: {
      messageId: string;
      status: "ok";
      "profile-name": string;
    };

    ListProfiles: {
      messageId: string;
      status: "ok";
      profiles: Array<{ [k: string]: any }>;
    };

    StartStopRecording: void;

    StartRecording: void;

    StopRecording: void;

    PauseRecording: void;

    ResumeRecording: void;

    SetRecordingFolder: void;

    GetRecordingFolder: {
      messageId: string;
      status: "ok";
      "rec-folder": string;
    };

    StartStopReplayBuffer: void;

    StartReplayBuffer: void;

    StopReplayBuffer: void;

    SaveReplayBuffer: void;

    SetCurrentSceneCollection: void;

    GetCurrentSceneCollection: {
      messageId: string;
      status: "ok";
      "sc-name": string;
    };

    ListSceneCollections: {
      messageId: string;
      status: "ok";
      "scene-collections": string[];
    };

    GetSceneItemProperties: {
      messageId: string;
      status: "ok";
      muted: boolean;
      name: string;
      parentGroupName?: string;
      alignment: number;
      height: number;
      rotation: number;
      width: number;
      sourceHeight: number;
      sourceWidth: number;
      locked: boolean;
      itemId: number;
      visible: boolean;
      groupChildren?: ObsWebSocket.SceneItemTransform[];
      crop: { left: number; right: number; bottom: number; top: number };
      bounds: { type: string; alignment: number; x: number; y: number };
      scale: { y: number; x: number };
      position: { alignment: number; y: number; x: number };
    };

    SetSceneItemProperties: void;

    ResetSceneItem: void;

    SetSceneItemRender: void;

    SetSceneItemPosition: void;

    SetSceneItemTransform: void;

    SetSceneItemCrop: void;

    DeleteSceneItem: void;

    DuplicateSceneItem: {
      messageId: string;
      status: "ok";
      scene: string;
      item: { id: number; name: string };
    };

    SetCurrentScene: void;

    GetCurrentScene: {
      messageId: string;
      status: "ok";
      name: string;
      sources: ObsWebSocket.SceneItem[];
    };

    GetSceneList: {
      messageId: string;
      status: "ok";
      "current-scene": string;
      scenes: ObsWebSocket.Scene[];
    };

    ReorderSceneItems: void;

    SetSceneTransitionOverride: void;

    RemoveSceneTransitionOverride: void;

    GetSceneTransitionOverride: {
      messageId: string;
      status: "ok";
      transitionName: string;
      transitionDuration: number;
    };

    GetSourcesList: { messageId: string; status: "ok"; sources: string[] };

    GetSourceTypesList: {
      messageId: string;
      status: "ok";
      types: { isAsync: boolean }[];
    };

    GetVolume: {
      messageId: string;
      status: "ok";
      name: string;
      volume: number;
      muted: boolean;
    };

    SetVolume: void;

    GetMute: { messageId: string; status: "ok"; name: string; muted: boolean };

    SetMute: void;

    ToggleMute: void;

    SetSourceName: void;

    SetSyncOffset: void;

    GetSyncOffset: {
      messageId: string;
      status: "ok";
      name: string;
      offset: number;
    };

    GetSourceSettings: {
      messageId: string;
      status: "ok";
      sourceName: string;
      sourceType: string;
      sourceSettings: {};
    };

    SetSourceSettings: {
      messageId: string;
      status: "ok";
      sourceName: string;
      sourceType: string;
      sourceSettings: {};
    };

    GetTextGDIPlusProperties: {
      messageId: string;
      status: "ok";
      source: string;
      vertical: boolean;
      "bk-color": number;
      "bk-opacity": number;
      chatlog: boolean;
      chatlog_lines: number;
      color: number;
      extents: boolean;
      extents_cx: number;
      extents_cy: number;
      file: string;
      read_from_file: boolean;
      font: { style: string; size: number; face: string; flags: number };
      valign: string;
      align: string;
      text: string;
      outline_opacity: number;
      gradient: boolean;
      gradient_color: number;
      gradient_dir: number;
      gradient_opacity: number;
      outline: boolean;
      outline_color: number;
      outline_size: number;
    };

    SetTextGDIPlusProperties: void;

    GetTextFreetype2Properties: {
      messageId: string;
      status: "ok";
      source: string;
      word_wrap: boolean;
      color2: number;
      custom_width: number;
      drop_shadow: boolean;
      font: { style: string; flags: number; face: string; size: number };
      text_file: string;
      text: string;
      color1: number;
      outline: boolean;
      from_file: boolean;
      log_mode: boolean;
    };

    SetTextFreetype2Properties: void;

    GetBrowserSourceProperties: {
      messageId: string;
      status: "ok";
      source: string;
      is_local_file: boolean;
      local_file: string;
      url: string;
      css: string;
      width: number;
      height: number;
      fps: number;
      shutdown: boolean;
    };

    SetBrowserSourceProperties: void;

    GetSpecialSources: {
      messageId: string;
      status: "ok";
      "desktop-1"?: string;
      "desktop-2"?: string;
      "mic-1"?: string;
      "mic-2"?: string;
      "mic-3"?: string;
    };

    GetSourceFilters: { messageId: string; status: "ok"; filters: {}[] };

    GetSourceFilterInfo: {
      messageId: string;
      status: "ok";
      enabled: boolean;
      type: string;
      name: string;
      settings: {};
    };

    AddFilterToSource: void;

    RemoveFilterFromSource: void;

    ReorderSourceFilter: void;

    MoveSourceFilter: void;

    SetSourceFilterSettings: void;

    SetSourceFilterVisibility: void;

    GetAudioMonitorType: {
      messageId: string;
      status: "ok";
      monitorType: string;
    };

    SetAudioMonitorType: void;

    TakeSourceScreenshot: {
      messageId: string;
      status: "ok";
      sourceName: string;
      img: string;
      imageFile: string;
    };

    GetStreamingStatus: {
      messageId: string;
      status: "ok";
      streaming: boolean;
      recording: boolean;
      "stream-timecode"?: string;
      "rec-timecode"?: string;
      "preview-only": boolean;
    };

    StartStopStreaming: void;

    StartStreaming: void;

    StopStreaming: void;

    SetStreamSettings: void;

    GetStreamSettings: {
      messageId: string;
      status: "ok";
      type: string;
      settings: {
        server: string;
        key: string;
        use_auth: boolean;
        username: string;
        password: string;
      };
    };

    SaveStreamSettings: void;

    SendCaptions: void;

    GetStudioModeStatus: {
      messageId: string;
      status: "ok";
      "studio-mode": boolean;
    };

    GetPreviewScene: {
      messageId: string;
      status: "ok";
      name: string;
      sources: ObsWebSocket.SceneItem[];
    };

    SetPreviewScene: void;

    TransitionToProgram: void;

    EnableStudioMode: void;

    DisableStudioMode: void;

    ToggleStudioMode: void;

    GetTransitionList: {
      messageId: string;
      status: "ok";
      "current-transition": string;
      transitions: string[];
    };

    GetCurrentTransition: {
      messageId: string;
      status: "ok";
      name: string;
      duration?: number;
    };

    SetCurrentTransition: void;

    SetTransitionDuration: void;

    GetTransitionDuration: {
      messageId: string;
      status: "ok";
      "transition-duration": number;
    };

    GetTransitionPosition: {
      messageId: string;
      status: "ok";
      position: number;
    };
  }

  interface EventHandlersDataMap {
    ConnectionOpened: void;
    ConnectionClosed: void;
    AuthenticationSuccess: void;
    AuthenticationFailure: void;
    SwitchScenes: { "scene-name": string; sources: ObsWebSocket.SceneItem[] };

    ScenesChanged: void;

    SceneCollectionChanged: void;

    SceneCollectionListChanged: void;

    SwitchTransition: { "transition-name": string };

    TransitionListChanged: void;

    TransitionDurationChanged: { "new-duration": number };

    TransitionBegin: {
      name: string;
      type: string;
      duration: number;
      "from-scene": string;
      "to-scene": string;
    };

    TransitionEnd: {
      name: string;
      type: string;
      duration: number;
      "to-scene": string;
    };

    TransitionVideoEnd: {
      name: string;
      type: string;
      duration: number;
      "from-scene": string;
      "to-scene": string;
    };

    ProfileChanged: void;

    ProfileListChanged: void;

    StreamStarting: { "preview-only": boolean };

    StreamStarted: void;

    StreamStopping: { "preview-only": boolean };

    StreamStopped: void;

    StreamStatus: {
      fps: number;
      streaming: boolean;
      "replay-buffer-active": boolean;
      "bytes-per-sec": number;
      "kbits-per-sec": number;
      strain: number;
      "total-stream-time": number;
      "num-total-frames": number;
      "num-dropped-frames": number;
      recording: boolean;
      "render-total-frames": number;
      "render-missed-frames": number;
      "output-total-frames": number;
      "output-skipped-frames": number;
      "average-frame-time": number;
      "cpu-usage": number;
      "memory-usage": number;
      "free-disk-space": number;
      "preview-only": boolean;
    };

    RecordingStarting: void;

    RecordingStarted: void;

    RecordingStopping: void;

    RecordingStopped: void;

    RecordingPaused: void;

    RecordingResumed: void;

    ReplayStarting: void;

    ReplayStarted: void;

    ReplayStopping: void;

    ReplayStopped: void;

    Exiting: void;

    Heartbeat: {
      "total-stream-frames"?: number;
      pulse: boolean;
      "current-scene"?: string;
      streaming?: boolean;
      "total-stream-time"?: number;
      "total-stream-bytes"?: number;
      "current-profile"?: string;
      recording?: boolean;
      "total-record-time"?: number;
      "total-record-bytes"?: number;
      "total-record-frames"?: number;
      stats: ObsWebSocket.OBSStats;
    };

    BroadcastCustomMessage: { realm: string; data: {} };

    SourceCreated: {
      sourceName: string;
      sourceType: string;
      sourceKind: string;
      sourceSettings: {};
    };

    SourceDestroyed: {
      sourceName: string;
      sourceType: string;
      sourceKind: string;
    };

    SourceVolumeChanged: { sourceName: string; volume: number };

    SourceMuteStateChanged: { sourceName: string; muted: boolean };

    SourceAudioSyncOffsetChanged: { sourceName: string; syncOffset: number };

    SourceAudioMixersChanged: {
      sourceName: string;
      mixers: boolean[];
      hexMixersValue: string;
    };

    SourceRenamed: {
      previousName: string;
      newName: string;
      sourceType: string;
    };

    SourceFilterAdded: {
      sourceName: string;
      filterName: string;
      filterType: string;
      filterSettings: {};
    };

    SourceFilterRemoved: {
      sourceName: string;
      filterName: string;
      filterType: string;
    };

    SourceFilterVisibilityChanged: {
      sourceName: string;
      filterName: string;
      filterEnabled: boolean;
    };

    SourceFiltersReordered: { sourceName: string; filters: string[] };

    SourceOrderChanged: { "scene-name": string; "scene-items": number[] };

    SceneItemAdded: {
      "scene-name": string;
      "item-name": string;
      "item-id": number;
    };

    SceneItemRemoved: {
      "scene-name": string;
      "item-name": string;
      "item-id": number;
    };

    SceneItemVisibilityChanged: {
      "scene-name": string;
      "item-name": string;
      "item-id": number;
      "item-visible": boolean;
    };

    SceneItemLockChanged: {
      "scene-name": string;
      "item-name": string;
      "item-id": number;
      "item-locked": boolean;
    };

    SceneItemTransformChanged: {
      "scene-name": string;
      "item-name": string;
      "item-id": number;
      transform: ObsWebSocket.SceneItemTransform;
    };

    SceneItemSelected: {
      "scene-name": string;
      "item-name": string;
      "item-id": number;
    };

    SceneItemDeselected: {
      "scene-name": string;
      "item-name": string;
      "item-id": number;
    };

    PreviewSceneChanged: {
      "scene-name": string;
      sources: ObsWebSocket.SceneItem[];
    };

    StudioModeSwitched: { "new-state": boolean };
  }

  class ObsWebSocket extends EventEmitter {
    connect(
      options?: { address?: string; password?: string; secure?: boolean },
      callback?: (error?: Error) => void
    ): Promise<void>;
    disconnect(): void;

    send<K extends keyof RequestMethodsArgsMap>(
      requestType: K,
      ...args: RequestMethodsArgsMap[K] extends object
        ? [RequestMethodsArgsMap[K]]
        : [undefined?]
    ): Promise<RequestMethodReturnMap[K]>;

    sendCallback<K extends keyof RequestMethodsArgsMap>(
      requestType: K,
      ...args: RequestMethodsArgsMap[K] extends object
        ? [RequestMethodsArgsMap[K], ObsWebSocket.Callback<K>]
        : [ObsWebSocket.Callback<K>]
    ): void;

    on<K extends keyof EventHandlersDataMap>(
      type: K,
      listener: (data: EventHandlersDataMap[K]) => void
    ): this;
  }

  export = ObsWebSocket;
}
