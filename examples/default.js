var http = require('http');

var connect = require('connect');
var cleaner = require('..');

var app = connect();

app
  .use(connect.responseTime())
  .use(cleaner())
  .use(function(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf8'
    });
    res.end('Hello World drom connect!');
  });

http
  .createServer(app)
  .listen(8080, function() {
    console.log('connect is up and running on `localhost:8080`');
  });
