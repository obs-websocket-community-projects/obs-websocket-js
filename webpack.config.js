const path = require('path');
const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');
const pkg = require('./package.json');

const banner =
  `OBS WebSocket Javascript API (${pkg.name}) v${pkg.version}\n` +
  `Author: ${pkg.author}\n` +
  `Repository: ${pkg.repoUrl}\n` +
  `Built from Commit SHA: ${pkg.sha}\n` +
  `Build Timestamp: ${pkg.timestamp}`;

module.exports = {
  target: 'web',
  entry: {
    'obs-websocket': './index.js',
    'obs-websocket.min': './index.js'
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
    library: 'OBSWebSocket'
  },
  externals: {
    ws: 'WebSocket'
  },
  devtool: 'source-map',
  plugins: [
    new BabiliPlugin({}, {
      test: /\.min\.js($|\?)/i
    }),
    new webpack.BannerPlugin({banner})
  ]
};
