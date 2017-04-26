const path = require('path');

module.exports = {
  target: 'web',
  entry: {
    'obs-websocket': './index.js'
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
    library: 'OBSWebSocket'
  },
  externals: {
    ws: 'WebSocket'
  },
  devtool: false
};
