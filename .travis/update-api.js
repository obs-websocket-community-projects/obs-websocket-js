var https = require('https');
var fs = require('fs');
var path = require('path');

var outFile = path.join(__dirname, '../lib/API.js');

https.get('https://raw.githubusercontent.com/Palakis/obs-websocket/master/docs/generated/comments.json', (resp) => {
  var data = '';

  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { parseApi(JSON.parse(data)); });
}).on("error", (err) => { console.log("Error: " + err.message); });

function parseApi(raw) {
  var api = {
    availableEvents: [],
    availableMethods: []
  };

  Object.keys(raw.events).forEach(key => {
    raw.events[key].forEach(event => {
      api.availableEvents.push(event.name);
    });
  });

  Object.keys(raw.requests).forEach(key => {
    raw.requests[key].forEach(event => {
      api.availableMethods.push(event.name);
    });
  });

  console.log(`Found ${api.availableMethods.length} methods, ${api.availableEvents.length} events.`);
  fs.writeFileSync(outFile, `// This file is generated, do not edit.\nmodule.exports = ${JSON.stringify(api, null, 2)}`)
}
