exports.connect = function connect(opts) {
  // var options = opts || {};
  var c = connect;

  c._fn = null;

  c._test = {
    _body: null,
    _code: null,
    _header: null,
    _next: null,
    _redirect: null,
    _url: null
  };

  c.req = {
    method: opts.method || 'GET',
    url: opts.url || '/'
  };

  c.res = {
    statusCode: null,
    writeHead: function(code, headers) {
      c._test._code = c.res.statusCode = code;
      if (headers.Location) c._test._url = headers.Location;
    },
    end: function(body) {
      if (body) c._test._body = body;
      if (c._test._url) c._test._redirect = true;
    }
  };

  c.next = function() {
    c._test._next = true;
  };

  c.use = function(fn) {
    c._fn = fn;
    return c;
  };

  c.handle = function(cb) {
    if (c._fn === null) {
      throw Error('connect mock needs some middleware');
    } else {
      c._fn(c.req, c.res, c.next);
      c._test._code = c.res.statusCode;
      if (cb) cb(c._test);
    }
  };

  return connect;
};
