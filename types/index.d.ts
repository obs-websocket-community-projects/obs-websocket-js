// TypeScript Version: 2.2
/// <reference types="node" />
import { EventEmitter } from 'events';
export = obs_websocket_js;

interface ObsMessage {
  messageId: string;
  status: "ok";
  [propName: string]: any;
}

interface ObsError {
  messageId: string;
  status: "error";
  error: string;
}

declare class obs_websocket_js extends EventEmitter {
  constructor();
  connect(options?: {address?: string; password?: string}, callback?: (error?: Error) => void): Promise<void>;
  disconnect(): void;
  send(requestType: string, args?: object, callback?: (error?: ObsError, data?: ObsMessage) => void): Promise<ObsMessage>;
}
