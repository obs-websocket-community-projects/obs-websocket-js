module.exports = {
  wrap(statusType) {
    const resp = {
      code: statusType.code,
      status: statusType.status,
      description: statusType.description
    };

    if (statusType.status === 'error') {
      resp.error = statusType.description;
    }

    return resp;
  },

  NOT_CONNECTED: {
    code: 'Not Connected',
    status: 'error',
    description: 'There is no Socket connection available.'
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
