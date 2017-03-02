var Logger = require('./Logger');
var log = new Logger('[OBS-API]');

// TODO: Load this from apiMap instead like a smart person.
var methods = [
  'getCurrentScene',
  'setCurrentScene',
  'getSceneList',
  'setSourceVisibility',
  'getStreamStatus',
  'toggleStreaming',
  'toggleRecording',
  'getCurrentTransition',
  'getTransitionList'
];

// TODO: Map these to response objects.
// TODO: Modify these to be of the 'onSceneSwitch' format.
var events = [
  'onConnectionOpened',
	'onConnectionClosed',
	'onConnectionFailed',
	'onAuthenticationSuccess',
	'onAuthenticationFailure',

  'SwitchScenes',
  'ScenesChanged',
  'StreamStarting',
  'StreamStarted',
  'StreamStopping',
  'StreamStopped',
  'RecordingStarting',
  'RecordingStarted',
  'RecordingStopping',
  'RecordingStopped',
  'StreamStatus',
  'Exiting'
];


// TODO: Passthrough, such that only modified endpoints are listed in new versions.
// Revision history.
// Add descriptions as if jsdoc? Parse jsdoc dynamically through that.
// Method @since version
// Param @since version
// Response @since version
// >> All in generated jsdoc
var apiMap = {
  '4.0.0': {
    'name': '4.0.0',
    'methods': {
      'setSourceVisbility': {
        'name': 'SetSourceRender',
        'params': {
          'source': 'source',
          'render': 'render',
          'sceneName': 'scene-name'
        },
        'response': {}
      }
    }
  },

  '0.3.2': {
    'name': '0.3.2',
    'core': {
      'params': {
        'messageId': 'message-id',
        'requestType': 'request-type'
      },
      'response': {
        'status': 'status',
        'messageId': 'message-id',
        'updateType': 'update-type',
        'error': 'error'
      }
    },
    'methods': {
      'getVersion': {
        'name': 'GetVersion',
        'params': {},
        'response': {
          'version': 'version', // FIXME: Consider just dropping this.
          'websocketVersion': 'obs-websocket-version',
          'obsStudioVersion': 'obs-studio-version'
        }
      },
      'getAuthenticationRequired': {
        'name': 'GetAuthRequired',
        'params': {},
        'response': {
          'authRequired': 'authRequired',
          'challenge': 'challenge',
          'salt': 'salt'
        }
      },
      'authenticate': {
        'name': 'Authenticate',
        'params': {
          'auth': 'auth'
        },
        'response': {}
      },
      'getCurrentScene': {
        'name': 'GetCurrentScene',
        'params': {},
        'response': {
          "name": "name",
          "sources": "sources"
        }
      },
      'setCurrentScene': {
        'name': 'SetCurrentScene',
        'params': {
          'name': 'scene-name'
        },
        'response': {}
      },
      'getSceneList': {
        'name': 'GetSceneList',
        'params': {},
        'response': {
          "currentScene": "current-scene",
          "scenes": "scenes"
        }
      },
      'setSourceVisbility': {
        'name': 'SetSourceRender',
        'params': {
          'sourceName': 'source',
          'render': 'render'
        },
        'response': {}
      },
      'getStreamStatus': {
        'name': 'GetStreamingStatus',
        'params': {},
        'response': {
          'streaming': 'streaming',
          'recording': 'recording',
          'previewOnly': 'preview-only' // FIXME: Remove?
        }
      },
      'toggleStreaming': {
        'name': 'StartStopStreaming',
        'params': {},
        'response': {}
      },
      'toggleRecording': {
        'name': 'StartStopRecording',
        'params': {},
        'response': {}
      },
      'setCurrentTransition': {
        'name': 'SetCurrentTransition',
        'params': {
          'name': 'transition-name'
        },
        'response': {}
      },
      'getCurrentTransition': {
        'name': 'GetCurrentTransition',
        'params': {},
        'response': {
          'name': 'name'
        }
      },
      'getTransitionList': {
        'name': 'GetTransitionList',
        'params': {},
        'response': {
          'currentTransition': 'current-transition',
          'transitions': 'transitions'
        }
      }
    }
  }
};

var latestVersion = '0.3.2';

class API {
  constructor() {
    var version;
    this.setVersion(latestVersion);
    this.availableMethods = methods;
    this.availableEvents = events;
  }

  setVersion(v) {
    if (!apiMap[v]) {
      log.error('Requested API version was not recognized. Defaulting to latest (' + latestVersion + ')');
      this.version = latestVersion;
      return;
    }

    log.debug('API version set to ' + v);
    this.version = v;
  }

  // Marshal outgoing requests.
  // TODO: Passthrough to older API versions if not declared in the assigned one.
  marshalRequest(requestType, args) {
    log.debug('[Marshal Request]', 'API Version:', this.version, 'Request Type:', requestType, 'Args:', args);

    var api = apiMap[this.version];
    var func = api.methods[requestType];

    if (!func) {
      var err = {
        'error': 'Unsupported',
        'message': 'API Version ' + api.name + ' does not support function: ' + requestType + '. No marshaling will be performed on the request object.',
        'api': api.name,
        'requestType': requestType
      };

      log.error(err.message);
      return args;
    }

    // Bind the requestType then marshal it to the appropriate version formatting.
    args.requestType = func.name;

    // Bind the function params.
    for (var key in func.params) {
      if (func.params.hasOwnProperty(key)) {
        args[func.params[key]] = args[key];
      }
    }

    // Bind core params too I guess.
    for (var key in api.core.params) {
      if (api.core.params.hasOwnProperty(key)) {
        args[api.core.params[key]] = args[key];
      }
    }

    return args;
  }

  // Marshal incoming responses.
  marshalResponse(requestType, args) {
    log.debug('[Marshal Response]', 'API Version:', this.version, 'Request Type:', requestType, 'Args:', args);

    var api = apiMap[this.version];
    var func = api.methods[requestType];

    // Bind the core response criteria.
    for (var key in api.core.response) {
      if (api.core.response.hasOwnProperty(key)) {
        args[key] = args[api.core.response[key]];
      }
    }

    // Determine if this is an error response.
    // If so we don't really need to marshal the rest of the response.
    if (args.status === 'error') {
      log.debug('[Marshal Response]', 'Response is an error. No function marshaling performed.');
      return args;
    }

    if (!func) {
      var err = {
        'error': 'Unsupported',
        'message': 'API Version ' + api.name + ' does not support function: ' + requestType + '. No marshaling will be performed on the response object.',
        'api': api.name,
        'requestType': requestType
      };

      log.error(err.message);
      return args;
    }

    // Bind the function response.
    for (var key in func.response) {
      if (func.response.hasOwnProperty(key)) {
        args[key] = args[func.response[key]];
      }
    }

    log.debug('[Marshal Response]', 'Result:', args);
    return args;
  }

  // Marshal incoming events.
  // TODO:
  marshalEvent(args) {
    // log.debug('[Marshal Event]', 'API Version:', this.version, 'Args:', args);

    var api = apiMap[this.version];
    var evt = args[api.core.response.updateType];

    log.debug('Event: ' + evt);

    return {
      'eventType': evt,
      'data': args
    };
  }
}

module.exports = API;
