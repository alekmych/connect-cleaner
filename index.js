var GARBAGE_RE = /[?&\/]+$/;
var TRAILING_SLASH_RE = /\/+$/;

module.exports = function(type) {
  type || (type = 301);

  return function(req, res, next) {
    if (isNotGetOrHead(req.method)) return next();

    if (isShort(req.url)) return next();

    var url = req.url;
    res._type = type;

    if (isDenormalized(url)) {
      return redirect(res, url.toLowerCase());
    };

    if (hasTrailingGarbage(url)) {
      return redirect(res, url.replace(GARBAGE_RE, ''));
    }

    cleanUp(res, url, next);
  }
};

function isNotGetOrHead(method) {
  return !(method === 'GET' || method === 'HEAD');
}

function isShort(url) {
  return url.length < 2;
}

function isDenormalized(url) {
  return url.toLowerCase() !== url;
}

function hasTrailingGarbage(url) {
  return GARBAGE_RE.test(url);
}

function redirect(res, url) {
  res.writeHead(res._type, {
    'Location': url
  });
  res.end();
}

function cleanUp(res, url, next) {
  var query, splitted, url;

  splitted = url.split('?');
  url = splitted[0];

  if (!TRAILING_SLASH_RE.test(url)) return next();

  url = url.replace(TRAILING_SLASH_RE, '');
  query = (splitted[1] && splitted[1].length) ? '?' + splitted[1] : '';

  redirect(res, url + query);
}
