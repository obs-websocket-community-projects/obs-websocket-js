import {BaseOBSWebSocket} from './BaseOBSWebSocket.js';
import {IncomingMessage, OutgoingMessage} from './types.js';

export default class JsonOBSWebSocket extends BaseOBSWebSocket {
	protocol = 'obswebsocket.json';

	protected async encodeMessage(data: OutgoingMessage): Promise<string> {
		return JSON.stringify(data);
	}

	protected async decodeMessage(data: string): Promise<IncomingMessage> {
		return JSON.parse(data) as IncomingMessage;
	}
}
