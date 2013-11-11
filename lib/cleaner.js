var path = require('path');
var base = path.basename;

var invoke = function(mod) {
  cleaner[base(mod.filename, '.js')] = mod;

  Object.keys(mod)
    .filter(function(prop) {
      return mod.hasOwnProperty(prop);
    })
    .forEach(function(prop) {
      global[prop] = mod[prop];
    });
};

['Utils', 'RegExps', 'Inspectors', 'Cleaners'].forEach(function(name) {
  invoke(require(path.join(__dirname, 'modules', name)));
});

function cleaner(opts) {
  var options = {
    add: false,
    clean: true,
    code: 301,
    immediate: true,
    normalize: false,
    pass: false,
    sanitize: false
  };

  if (opts) {
    switch (isType(opts)) {
      case 'number':
        options.code = opts;
        break;
      case 'object':
        options = defaults(options, opts);
        options = fixOptions(options);
        break;
      default:
        throw Error('Wrong type , must be `number` or `object`. Instead got ' +
          isType(opts) + '.');
    }
  }

  function middleware(req, res, next) {
    var singular, shouldRedirect, url;
    var reasons = [];

    // Check if url no need processing
    if (skip(req.method, (url = req.url))) return next();

    // Set statusCode of possible redirect in `res` parameter for convenience
    res._code = options.code;

    // Eliminate edge cases when url have miltiple delimiters in sequence
    // e.g. `/users//Eiden` -> `/users/Eiden`
    if (url !== (singular = singularize(url))) {
      shouldRedirect = true;
      reasons.push('Delimiters are not singular');
      url = singular;
    }

    // Eliminate cases with dirty "index" pages like `/?`
    url = url.split('?').filter(function(part) {
      if (part.length > 0) {
        return true;
      }

      shouldRedirect = true;
      reasons.push('Gurbage on "index" page');
      return false;
    });

    // Discard not valid urls
    // By default connect/express would walk thrue full middleware stack
    if (isDirty(url)) {
      if (options.immediate) {
        res.statusCode = 400;
        return res.end();
      } else {
        var err = new Error('Dirty URL');
        err.code = 400;
        next(err);
      }
    }

    // Switch state: url can be cleaned or sanitized at once
    // Also sanitization includes cleaning
    if (options.clean && needsClean(url[0])) {
      shouldRedirect = true;
      reasons.push('URL is not clean');
      url[0] = clean(url[0]);
    } else if (options.sanitize && needsSanitize(url, options.add)) {
      shouldRedirect = true;
      reasons.push('URL has garbage');
      url = sanitize(url, options.add);
    }

    // Ensure trailing slash in place, if needed
    if (options.add && needsAdd(url[0])) {
      shouldRedirect = true;
      reasons.push('URL has no trailing slash');
      url[0] = add(url[0]);
    }

    // Normalize letter case differences, if needed
    if (options.normalize && needsNormalize(url[0])) {
      shouldRedirect = true;
      reasons.push('URL path is denormalized');
      url[0] = normalize(url[0]);
    }

    // On this state we are done
    // Only thing left is to determine if we need redirect or pass thrue
    if (shouldRedirect) {
      // If need, fix leading slash
      url[0] = fixLeadingSlash(url[0]);

      if (options.pass) {
        var error = new Error('URL need redirect');
        error.reasons = reasons;
        error.url = url.join('?');
        error.code = res._code;

        next(error);
      } else redirect(res, url);
    } else {
      next();
    }
  }

  // Simple setter/getter system
  // Use it instead of directly mutating `_options` property of cleaner
  // instance after initializing it
  // This methods calling invalidation fix of clean/sanitize/add options
  middleware.set = function get(key, value) {
    if (isType(key, 'object')) {
      Object.keys(key).forEach(function(k) {
        if (k in options && options.hasOwnProperty(k)) {
          options[k] = key[k];
        }
      });
    } else if  (key in options && options.hasOwnProperty(key)) {
      options[key] = value;
    }

    options = fixOptions(options);

    return middleware;
  };

  middleware.get = function get(key) {
    if (key) {
      if (key in options && options.hasOwnProperty(key)) {
        return options[key];
      }

      return null;
    } else {
      // return options;
      return copy(options);
    }
  };

  middleware._options = options;

  return middleware;
}

module.exports = cleaner;
