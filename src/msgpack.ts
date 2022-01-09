import {decode, encode} from '@msgpack/msgpack';
import {BaseOBSWebSocket} from './base.js';
export {OBSWebSocketError} from './base.js';
export type {EventTypes} from './base.js';
import {IncomingMessage, OutgoingMessage} from './types.js';
export * from './types.js';

export default class OBSWebSocket extends BaseOBSWebSocket {
	protocol = 'obswebsocket.msgpack';

	protected async encodeMessage(data: OutgoingMessage): Promise<ArrayBufferView> {
		return encode(data);
	}

	protected async decodeMessage(data: ArrayBuffer | Blob): Promise<IncomingMessage> {
		// Browsers provide Blob while node gives straight ArrayBuffer
		if (typeof Blob !== 'undefined' && data instanceof Blob) {
			data = await data.arrayBuffer();
		}

		return decode(data as ArrayBuffer) as IncomingMessage;
	}
}
