var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var url = require('url');

var app = express();
var server = require('http').Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// init websockets servers
var wssShareDB = require('./src/wss-sharedb')(server);
var wssCursors = require('./src/wss-cursors')(server);

server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/sharedb') {
    wssShareDB.handleUpgrade(request, socket, head, (ws) => {
      wssShareDB.emit('connection', ws);
    });
  } else if (pathname === '/cursors') {
    wssCursors.handleUpgrade(request, socket, head, (ws) => {
      wssCursors.emit('connection', ws);
    });
  } else {
    socket.destroy();
  }
});

server.listen(4000);