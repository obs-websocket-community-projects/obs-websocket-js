module.exports = {
  target: "web",
  entry: {
    "obs-websocket": "./index.js"
  },
  output: {
    "path": __dirname + "/dist",
    "filename": "[name].js",
    "library": "OBSWebSocket"
  },
  externals: {
    "ws": "WebSocket"
  },
  devtool: false
};
