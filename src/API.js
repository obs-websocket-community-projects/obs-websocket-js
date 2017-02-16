var latestVersion = '0.3.2';
var version = {
  '0.3.2': {
    'name': '0.3.2',
    'core': {
      'params': {
        'messageId': 'message-id',
        'requestType': 'request-type'
      },
      'response': {
        'updateType': 'update-type',
        'messageId': 'message-id'
      }
    },
    'getVersion': {
      'name': 'GetVersion',
      'params': {},
      'response': {
        'version': 'version',
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
      'response': {}
    },
    'setCurrentScene': {
      'name': 'SetCurrentScene',
      'params': {
        'sceneName': 'scene-name'
      },
      'response': {}
    },
    'getSceneList': {
      'name': 'GetSceneList',
      'params': {},
      'response': {}
    },
    'setSourceVisbility': {
      'name': 'SetSourceRender',
      'params': {
        'source': 'source',
        'render': 'render'
      }
    },
    'getStreamStatus': {
      'name': 'GetStreamingStatus',
      'params': {},
      'response': {}
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
        'transitionName': 'transition-name'
      },
      'response': {}
    },
    'getCurrentTransition': {
      'name': 'GetCurrentTransition',
      'params': {},
      'response': {}
    },
    'getTransitionList': {
      'name': 'GetTransitionList',
      'params': {},
      'response': {}
    }
  }
};

module.exports = exports = {
  latestVersion: latestVersion,
  version: version
};
