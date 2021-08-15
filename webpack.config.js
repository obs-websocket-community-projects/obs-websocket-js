const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
const pkg = require('./package.json');

let banner =
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
  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'),
    }
  },
  output: {
    path: path.join(__dirname, '/browser-dist'),
    filename: '[name].js',
    library: 'OBSWebSocket',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      test: /\.min\.js($|\?)/i,
      extractComments: false,
    })],
  },
  plugins: [
    new webpack.BannerPlugin({banner})
  ]
};
