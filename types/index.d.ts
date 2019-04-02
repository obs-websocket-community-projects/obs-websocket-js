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

    interface Scene {
      name: string;
      sources: ObsWebSocket.Source[];
    }

    interface Source {
      cy: number;
      cx: number;
      name: string;
      render: boolean;
      source_cx: number;
      source_cy: number;
      type: string;
      volume: number;
      x: number;
      y: number;
    }
  }

  interface RequestMethodsArgsMap {
    GetVersion: void;

    GetAuthRequired: void;

    Authenticate: { auth: string };

    SetHeartbeat: { enable: boolean };

    SetFilenameFormatting: { "filename-formatting": string };

    GetFilenameFormatting: void;

    SetCurrentProfile: { "profile-name": string };

    GetCurrentProfile: void;

    ListProfiles: void;

    StartStopRecording: void;

    StartRecording: void;

    StopRecording: void;

    SetRecordingFolder: { "rec-folder": string };

    GetRecordingFolder: void;

    StartStopReplayBuffer: void;

    StartReplayBuffer: void;

    StopReplayBuffer: void;

    SaveReplayBuffer: void;

    SetCurrentSceneCollection: { "sc-name": string };

    GetCurrentSceneCollection: void;

    ListSceneCollections: void;

    GetSceneItemProperties: { "scene-name"?: string; item: string };

    SetSceneItemProperties: {
      "scene-name"?: string;
      rotation: number;
      item: string;
      visible: boolean;
      position: { alignment: number; x: number; y: number };
      bounds: { y: number; type: string; alignment: number; x: number };
      scale: { x: number; y: number };
      crop: { bottom: number; left: number; right: number; top: number };
    };

    ResetSceneItem: { "scene-name"?: string; item: string };

    SetSceneItemRender: {
      source: string;
      render: boolean;
      "scene-name"?: string;
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

    GetSourcesList: void;

    GetSourcesTypesList: void;

    GetVolume: { source: string };

    SetVolume: { source: string; volume: number };

    GetMute: { source: string };

    SetMute: { source: string; mute: boolean };

    ToggleMute: { source: string };

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

    GetStreamingStatus: void;

    StartStopStreaming: void;

    StartStreaming: {
      stream?: {
        type?: string;
        metadata?: {};
        settings?: {
          server?: string;
          key?: string;
          "use-auth"?: boolean;
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
        "use-auth"?: boolean;
        username?: string;
        password?: string;
      };
      save: boolean;
    };

    GetStreamSettings: void;

    SaveStreamSettings: void;

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
  }

  interface RequestMethodReturnMap {
    GetVersion: {
      messageId: string;
      status: "ok";
      version: number;
      "obs-websocket-version": string;
      "obs-studio-version": string;
      "available-requests": string;
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
      name: string;
      rotation: number;
      visible: boolean;
      position: { alignment: number; x: number; y: number };
      bounds: { y: number; type: string; alignment: number; x: number };
      scale: { x: number; y: number };
      crop: { top: number; bottom: number; left: number; right: number };
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
      sources: ObsWebSocket.Source[];
    };

    GetSceneList: {
      messageId: string;
      status: "ok";
      "current-scene": string;
      scenes: ObsWebSocket.Scene[];
    };

    ReorderSceneItems: void;

    GetSourcesList: { messageId: string; status: "ok"; sources: string[] };

    GetSourcesTypesList: {
      messageId: string;
      status: "ok";
      ids: { isAsync: boolean }[];
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

    AddFilterToSource: void;

    RemoveFilterFromSource: void;

    ReorderSourceFilter: void;

    MoveSourceFilter: void;

    SetSourceFilterSettings: void;

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
        "use-auth": boolean;
        username: string;
        password: string;
      };
    };

    SaveStreamSettings: void;

    GetStudioModeStatus: {
      messageId: string;
      status: "ok";
      "studio-mode": boolean;
    };

    GetPreviewScene: {
      messageId: string;
      status: "ok";
      name: string;
      sources: ObsWebSocket.Source[];
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
  }

  interface EventHandlersDataMap {
    ConnectionOpened: void;
    ConnectionClosed: void;
    AuthenticationSuccess: void;
    AuthenticationFailure: void;
    SwitchScenes: { "scene-name": string; sources: ObsWebSocket.Source[] };

    ScenesChanged: void;

    SceneCollectionChanged: void;

    SceneCollectionListChanged: void;

    SwitchTransition: { "transition-name": string };

    TransitionListChanged: void;

    TransitionDurationChanged: { "new-duration": number };

    TransitionBegin: {
      name: string;
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
      streaming: boolean;
      recording: boolean;
      "preview-only": boolean;
      "bytes-per-sec": number;
      "kbits-per-sec": number;
      strain: number;
      "total-stream-time": number;
      "num-total-frames": number;
      "num-dropped-frames": number;
      fps: number;
    };

    RecordingStarting: void;

    RecordingStarted: void;

    RecordingStopping: void;

    RecordingStopped: void;

    ReplayStarting: void;

    ReplayStarted: void;

    ReplayStopping: void;

    ReplayStopped: void;

    Exiting: void;

    Heartbeat: {
      "total-stream-bytes"?: number;
      pulse: boolean;
      "current-scene"?: string;
      streaming?: boolean;
      "total-stream-time"?: number;
      "current-profile"?: string;
      "total-stream-frames"?: number;
      recording?: boolean;
      "total-record-time"?: number;
      "total-record-bytes"?: number;
      "total-record-frames"?: number;
    };

    SourceOrderChanged: { "scene-name": string };

    SceneItemAdded: { "scene-name": string; "item-name": string };

    SceneItemRemoved: { "scene-name": string; "item-name": string };

    SceneItemVisibilityChanged: {
      "scene-name": string;
      "item-name": string;
      "item-visible": boolean;
    };

    PreviewSceneChanged: {
      "scene-name": string;
      sources: ObsWebSocket.Source[];
    };

    StudioModeSwitched: { "new-state": boolean };
  }

  class ObsWebSocket extends EventEmitter {
    connect(
      options?: { address?: string; password?: string },
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
