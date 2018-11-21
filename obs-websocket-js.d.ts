import {EventEmitter} from 'events';
export = obs_websocket_js;

declare class obs_websocket_js extends EventEmitter {
  constructor();
  connect(options?: {address?: string; password?: string}): Promise<void>;
  disconnect(): void;
  send(requestType: string, args: object, callback?: Function): Promise<any>;
}
