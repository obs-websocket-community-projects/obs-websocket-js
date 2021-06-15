var path = require('path');
var webpack = require('webpack');
var BabiliPlugin = require('babili-webpack-plugin');
var pkg = require('./package.json');

var banner =
  `OBS WebSocket Javascript API (${pkg.name}) v${pkg.version}\n` +
  `Author: ${pkg.author}\n` +
  `License: ${pkg.license}\n` +
  `Repository: ${pkg.repoUrl}\n` +
  `Build Timestamp: ${pkg.timestamp || new Date().toISOString()}`;

banner += pkg.sha ? `\nBuilt from Commit: ${pkg.repoUrl}/commit/${pkg.sha}` : ``;

module.exports = {
  target: 'web',
  stats: 'detailed',
  mode: 'none',
  entry: {
    'obs-websocket': './dist/OBSWebSocket.js',
    'obs-websocket.min': './dist/OBSWebSocket.js'
  },
  output: {
    path: path.join(__dirname, '/browser-dist'),
    filename: '[name].js',
    library: 'OBSWebSocket',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  plugins: [
    new BabiliPlugin({}, {
      test: /\.min\.js($|\?)/i,
      comments: false
    }),
    new webpack.BannerPlugin({banner})
  ]
};
