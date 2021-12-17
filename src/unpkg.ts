// For CDN use generate file with all the exported values on OBSWebSocket object
/* eslint-disable @typescript-eslint/naming-convention */
import JSONOBSWebSocket, {EventSubscription, OBSWebSocketError, RequestBatchExecutionType, WebSocketOpCode} from './json.js';

export default class OBSWebSocket extends JSONOBSWebSocket {
	static OBSWebSocketError = OBSWebSocketError;
	static WebSocketOpCode = WebSocketOpCode;
	static EventSubscription = EventSubscription;
	static RequestBatchExecutionType = RequestBatchExecutionType;
}
