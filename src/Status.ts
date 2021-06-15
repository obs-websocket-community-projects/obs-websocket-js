export type StatusType = {
  code: string;
  status: string;
  description: string;
  error?: string;
};

export const Status = {
  NOT_CONNECTED: {
    code: 'NOT_CONNECTED',
    status: 'error',
    description: 'There is no Socket connection available.',
    error: 'There is no Socket connection available.'
  },
  CONNECTION_ERROR: {
    code: 'CONNECTION_ERROR',
    status: 'error',
    description: 'Connection error.',
    error: 'Connection error.'
  },
  SOCKET_EXCEPTION: {
    code: 'SOCKET_EXCEPTION',
    status: 'error',
    description: 'An exception occurred from the underlying WebSocket.',
    error: 'An exception occurred from the underlying WebSocket.'
  },
  AUTH_NOT_REQUIRED: {
    code: 'AUTH_NOT_REQUIRED',
    status: 'ok',
    description: 'Authentication is not required.'
  },
  REQUEST_TYPE_NOT_SPECIFIED: {
    code: 'REQUEST_TYPE_NOT_SPECIFIED',
    status: 'error',
    description: 'A Request Type was not specified.',
    error: 'A Request Type was not specified.',
  },
  ARGS_NOT_OBJECT: {
    code: 'ARGS_NOT_OBJECT',
    status: 'error',
    description: 'The supplied arguments parameter is not an object.',
    error: 'The supplied arguments parameter is not an object.',
  },
};
