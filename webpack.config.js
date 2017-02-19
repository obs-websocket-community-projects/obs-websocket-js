module.exports = {
  target: "web",
  entry: {
    "obs-websocket": "./lib/OBSWebSocket.js"
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
