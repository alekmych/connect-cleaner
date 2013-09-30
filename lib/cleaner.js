// Module
function cleaner(opts) {
  var keys;
  var options = middleware.options = {
    'add': false,
    'clean': true,
    'code': 301,
    'normalize': false,
    'sanitize': false
  };

  opts || (opts = {});

  (keys = Object.keys(options)).forEach(function(opt) {
    if (opt in opts) {
      options[opt] = opts[opt];
    }
  });

  if (options.sanitize || options.add) {
    options.clean = false;
  }

  function middleware(req, res, next) {
    var hasSlash, redirect, url;

    if (pass(req.method, (url = req.url))) return next();

    url = url.split('?');

    if (options.clean && needClean(url[0])) {
      redirect = true;
      url[0] = clean(url[0]);
    } else if (options.sanitize && needSanitize(url)) {
      redirect = true;
      url = sanitize(url);
    }

    if (options.add && !needClean(url[0])) {
      redirect = true;
      url[0] = add(url[0]);
    }

    if (options.normalize && needNormalize(url[0])) {
      redirect = true;
      url[0] = normalize(url[0]);
    }

    if (redirect) {
      redirect(url);
    } else {
      next();
    }
  }

  return middleware;
}


// RegExps
RegExps: {
  var RE_TR_SLASH = /\/+$/;
  var RE_GARBAGE = /[\/?&]+$/;
}

// Checkers
Checkers: {

  function needClean(path) {
    return path[path.length -1] === '/';
  }

  function needNormalize(path) {
    return path !== path.toLowerCase();
  }

  function needSanitize(url) {
    return RE_GARBAGE.test(url[0]) || RE_GARBAGE.test(url[1]);
  }

  function pass(method, url) {
    return (method === 'GET' || method === 'HEAD') && url.length < 2;
  }
}


// Cleaners
Cleaners: {
  function clean(path) {
    return path.replace(RE_TR_SLASH, '');
  }

  function sanitize(url) {
    url[0] = url[0].replace(RE_GARBAGE, '');
    url[1] = url[1].replace(RE_GARBAGE, '');

    return url;
  }

  function add(path) {
    return path + '/';
  }

  function normalize(path) {
    return path.toLowerCase();
  }
}


// Utils
Utils: {
  function redirect(url) {
    res.writeHead(res._code, {
      'Location': url.join('?')
    });
    res.end();
  }
}


module.exports = cleaner;

exports.checkers = {
  'needClean': needClean,
  'needNormalize': needNormalize,
  'needSanitize': needSanitize,
  'pass': pass
};

exports.cleaners = {
  'add': add,
  'clean': clean,
  'sanitize': sanitize,
  'normalize': normalize
};

exports.utils = {
  'redirect': redirect
};
