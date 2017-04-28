module.exports = {
  NOT_CONNECTED: {
    code: 'Not Connected',
    status: 'error',
    description: 'There is no Socket connection available.'
  },
  SOCKET_EXCEPTION: {
    code: 'Socket Exception',
    status: 'error',
    description: 'An exception occurred from the underlying WebSocket.'
  },
  AUTH_NOT_REQUIRED: {
    code: 'Auth Not Required',
    status: 'ok',
    description: 'Authentication is not required.'
  },
  REQUEST_TYPE_NOT_SPECIFIED: {
    code: 'Request Type Not Spcecified',
    status: 'error',
    description: 'A Request Type was not specified.'
  }
};
