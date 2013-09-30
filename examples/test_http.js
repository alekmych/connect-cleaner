var http = require('http');

http
  .createServer(function(req, res) {
    res.writeHeader(200, { 'Content-Type': 'text/plain; charset=utf8' });
    res.end('response');
  })
  .listen(8080);
