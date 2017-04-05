var log = require('loglevel');

// TODO:
// Revision history.
// Add descriptions as if jsdoc? Parse jsdoc dynamically through that.
// Method @since version
// Param @since version
// Response @since version
// >> All in generated jsdoc
var apiMap = {

  /**
   * Version      4.0.0
   * Released     March 2, 2017
   * Deprecated   n/a
   */
  '4.0.0': {
    'name': '4.0.0',
    'core': {
      'events': {
        'response': {
          'eventType': 'update-type',
          'streamTimecode': 'stream-timecode',
          'recordTimecode': 'rec-timecode'
        }
      }
    },
    'events': {
      'SourceOrderChanged': {
        'name': 'SourceOrderChanged',
        'response': {
          'scene': 'scene-name'
        }
      },
      'SourceAdded': {
        'name': 'SceneItemAdded',
        'response': {
          'scene': 'scene-name',
          'source': 'item-name'
        }
      },
      'SourceRemoved': {
        'name': 'SceneItemRemoved',
        'response': {
          'scene': 'scene-name',
          'source': 'item-name'
        }
      },
      'SourceVisibilityChanged': {
        'name': 'SceneItemVisibilityChanged',
        'response': {
          'scene': 'scene-name',
          'source': 'item-name',
          'render': 'item-visible'
        }
      },
      'SceneCollectionChanged': {
        'name': 'SceneCollectionChanged',
        'response': {}
      },
      'SceneCollectionListChanged': {
        'name': 'SceneCollectionListChanged',
        'response': {}
      },
      'TransitionSwitch': {
        'name': 'SwitchTransition',
        'response': {
          'name': 'transition-name'
        }
      },
      'TransitionDurationChanged': {
        'name': 'TransitionDurationChanged',
        'response': {
          'duration': 'new-duration'
        }
      },
      'TransitionListChanged': {
        'name': 'TransitionListChanged',
        'response': {}
      },
      'TransitionStarting': {
        'name': 'TransitionBegin',
        'response': {}
      },
      'ProfileChanged': {
        'name': 'ProfileChanged',
        'response': {}
      },
      'ProfileListChanged': {
        'name': 'ProfileListChanged',
        'response': {}
      }
    },
    'methods': {
      'setSourceVisbility': {
        'name': 'SetSourceRender',
        'params': {
          'source': 'source',
          'render': 'render',
          'sceneName': 'scene-name'
        },
        'response': {}
      },
      'getCurrentTransition': {
        'name': 'GetCurrentTransition',
        'params': {},
        'response': {
          'name': 'name',
          'duration': 'duration'
        }
      },
      'setTransitionDuration': {
        'name': 'setTransitionDuration',
        'params': {
          'duration': 'duration'
        },
        'response': {}
      },
      'setVolume': {
        'name': 'SetVolume',
        'params': {
          'source': 'source',
          'volume': 'volume'
        },
        'response': {}
      },
      'getVolume': {
        'name': 'GetVolume',
        'params': {
          'source': 'source'
        },
        'response': {
          'name': 'name',
          'volume': 'volume',
          'muted': 'muted'
        }
      },
      'setSourceMute': {
        'name': 'SetMute',
        'params': {
          'source': 'source',
          'muted': 'mute'
        },
        'response': {}
      },
      'toggleSourceMute': {
        'name': 'ToggleMute',
        'params': {
          'souurce': 'source'
        },
        'response': {}
      },
      'setSourcePosition': {
        'name': 'SetSceneItemPosition',
        'params': {
          'scene': 'scene-name',
          'source': 'item',
          'x': 'x',
          'y': 'y'
        },
        'response': {}
      },
      'setSourceTransform': {
        'name': 'SetSceneItemTransform',
        'params': {
          'scene': 'scene-name',
          'source': 'item',
          'x-scale': 'x-scale',
          'y-scale': 'y-scale',
          'rotation': 'rotation'
        },
        'response': {}
      },
      'setSceneCollection': {
        'name': 'SetCurrentSceneCollection',
        'params': {
          'name': 'sc-name'
        },
        'response': {}
      },
      'getCurrentSceneCollection': {
        'name': 'GetCurrentSceneCollection',
        'params': {},
        'response': {
          'name': 'sc-name'
        }
      },
      'getSceneCollectionList': {
        'name': 'ListSceneCollections',
        'params': {},
        'response': {
          'names': 'scene-collections'
        }
      },
      'setProfile': {
        'name': 'SetCurrentProfile',
        'params': {
          'name': 'profile-name'
        },
        'response': {}
      },
      'getCurrentProfile': {
        'name': 'GetCurrentProfile',
        'params': {},
        'response': {
          'name': 'profile-name'
        }
      },
      'getProfileList': {
        'name': 'ListProfiles',
        'params': {},
        'response': {
          'names': 'profiles'
        }
      }
    }
  },

  /**
   * Version      0.3.2
   * Released     December 10, 2016
   * Deprecated   March 2, 2017
   */
  '0.3.2': {
    'name': '0.3.2',
    'core': {
      'methods': {
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
      'events': {
        'response': {
          'eventType': 'update-type'
        }
      }
    },
    'events': {
      'SceneSwitch': {
        'name': 'SwitchScenes',
        'response': {
          'name': 'scene-name'
        }
      },
      'SceneListChanged': {
        'name': 'ScenesChanged',
        'response': {}
      },
      'StreamStarting': {
        'name': 'StreamStarting',
        'response': {}
      },
      'StreamStarted': {
        'name': 'StreamStarted',
        'response': {}
      },
      'StreamStopping': {
        'name': 'StreamStopping',
        'response': {}
      },
      'StreamStopped': {
        'name': 'StreamStopped',
        'response': {}
      },
      'RecordingStarting': {
        'name': 'RecordingStarting',
        'response': {}
      },
      'RecordingStarted': {
        'name': 'RecordingStarted',
        'response': {}
      },
      'RecordingStopping': {
        'name': 'RecordingStopping',
        'response': {}
      },
      'RecordingStopped': {
        'name': 'RecordingStopped',
        'response': {}
      },
      'StreamStatus': {
        'name': 'StreamStatus',
        'response': {}
      },
      'Exit': {
        'name': 'Exiting',
        'response': {}
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

var latestVersion = '4.0.0';
var versions = ['0.3.2', '4.0.0'];

class API {
  constructor() {
    this.apiMap = {};
    this.availableMethods = {};
    this.availableEvents = {};

    this.setVersion(latestVersion);
    this.buildAPI();
    this.setAllMethodsAndEvents();
  }

  buildAPI() {
    for (var i = versions.length; i--; i > 0) {
      if (typeof versions[i - 1] !== 'undefined') { // If a newer version exists..
        var tempAPI = Object.assign({}, apiMap[versions[i]]); // Get the current version and copy it.

        Object.assign(tempAPI.core, apiMap[versions[i - 1]].core); // Set the copy with the older's core.
        Object.assign(tempAPI.methods, apiMap[versions[i - 1]].methods); // Set the copy with the olders core.
        Object.assign(tempAPI.events, apiMap[versions[i - 1]].events); // Set the copy with the older's core.

        Object.assign(tempAPI.core.methods, apiMap[versions[i]].core.methods); // Extend the copy with the newer's modifications.
        Object.assign(tempAPI.core.events, apiMap[versions[i]].core.events); // Extend the copy with the newer's modifications.
        Object.assign(tempAPI.methods, apiMap[versions[i]].methods); // Extend the copy with the newer's modifications.
        Object.assign(tempAPI.events, apiMap[versions[i]].events); // Extend the copy with the newer's modifications.

        apiMap[versions[i - 1]] = tempAPI; // Assign it back and continue?
      }
    }

    this.apiMap = Object.assign({}, apiMap);
  }

  setAllMethodsAndEvents() {
    for (var key in versions) {
      Object.assign(this.availableMethods, apiMap[versions[key]].methods);
      Object.assign(this.availableEvents, apiMap[versions[key]].events);
    }

    var availMethods = [];
    var availEvents = [];

    for (var key in this.availableMethods) {
      if (this.availableMethods.hasOwnProperty(key)) {
        availMethods.push(key);
      }
    }

    for (var key in this.availableEvents) {
      if (this.availableEvents.hasOwnProperty(key)) {
        availEvents.push(key);
      }
    }

    this.availableEvents = availEvents;
    this.availableMethods = availMethods;
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

    var api = this.apiMap[this.version];
    var func = api.methods[requestType];

    if (!func) {
      var err = {
        'error': 'Unsupported',
        'message': 'API Version ' + api.name + ' does not support function: ' + requestType + '. No marshaling will be performed on the request object.',
        'api': api.name,
        'requestType': requestType
      };

      args.requestType = requestType;

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
    for (var key in api.core.methods.params) {
      if (api.core.methods.params.hasOwnProperty(key)) {
        args[api.core.methods.params[key]] = args[key];
      }
    }

    return args;
  }

  // Marshal incoming responses.
  marshalResponse(requestType, args) {
    log.debug('[Marshal Response]', 'API Version:', this.version, 'Request Type:', requestType, 'Args:', args);

    var api = this.apiMap[this.version];
    var func = api.methods[requestType];

    // Bind the core response criteria.
    for (var key in api.core.methods.response) {
      if (api.core.methods.response.hasOwnProperty(key)) {
        args[key] = args[api.core.methods.response[key]];
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
  marshalEvent(args) {
    log.debug('[Marshal Event]', 'API Version:', this.version, 'Args:', args); // Gets spammy when StreamStatus is emitting.

    var api = this.apiMap[this.version];
    var evt = args[api.core.methods.response.updateType];

    try {
      for (var key in api[evt].response) {
        if (api[evt].response.hasOwnProperty(key)) {
          args[key] = args[api[evt].response[key]];
        }
      }
    } catch (e) {
      log.info('Unrecognized Event: ' + evt);
    }

    log.debug('Event: ' + evt, 'Args:', args);

    return {
      'eventType': evt,
      'data': args
    };
  }
}

module.exports = API;
