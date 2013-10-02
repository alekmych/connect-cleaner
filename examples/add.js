var http    = require('http');
var connect = require('connect');
var cleaner = require('..');
var app     = connect();

app
  .use(connect.responseTime())
  .use(function(req, res, next) {
    if (req.url === '/favicon.ico') {
      res.statusCode = 404;
      return res.end();
    }
    next();
  })
  .use(cleaner({ 'add': true }))
  .use(connect.query())
  .use(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf8' });
    res.end('URL:\t"' + req.url + '"');
  });

http
  .createServer(app)
  .listen(8080, function() {
    console.log('`defaults` example up and running on `localhost:8080`');
  });
