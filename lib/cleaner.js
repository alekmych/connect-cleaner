var cleaners = require('./modules/Cleaners');
var inspectors = require('./modules/Inspectors');
var utils = require('./modules/Utils');

function cleaner(opts) {
  var options = {
    add: false,
    clean: true,
    code: 301,
    normalize: false,
    pass: false,
    sanitize: false
  };

  if (opts) {
    switch (utils.isType(opts)) {
      case 'number':
        options.code = opts;
        break;
      case 'object':
        options = utils.config(options, opts);
        options = utils.fixOptions(options);
        break;
      default:
        throw Error('Wrong type, must be `Number` or `Object`. Instead got ' +
          utils.isType(opts) + '.');
    }
  }

  function middleware(req, res, next) {
    var singular, shouldRedirect, url, brokenIndex;
    var reasons = [];

    // Check if URL has "wrong" method or too short
    if (inspectors.skip(req.method, (url = req.url))) return next();

    // Cut leading url
    // some cleaners may cause cutting it it incidentally
    url = url.slice(1);
    // Set statusCode of possible redirect in `res` parameter for convenience
    res._code = options.code;

    // Eliminate edge cases when url have miltiple delimiters in sequence
    // e.g. `/users//Eiden` -> `/users/Eiden`
    if (url !== (singular = cleaners.singularize(url))) {
      shouldRedirect = true;
      reasons.push('Delimiters are not singular');
      url = singular;
    }

    // Eliminate cases with dirty "index" pages like `/?`
    url = url.split('?').filter(function(part) {
      if (part.length > 0) return true;

      shouldRedirect = true;
      if (!brokenIndex) {
        reasons.push('Broken index URL');
        brokenIndex = true;
      }
      return false;
    });

    // Discard invalid urls
    if (utils.isBroken(url)) {
      if (options.pass) {
        var err = new Error('Broken URL');
        err.code = 400;
        return next(err);
      }
        res.statusCode = 400;
        return res.end();
    }

    // Switch state: url can be cleaned or sanitized at once
    // Also sanitization includes cleaning
    if (options.clean && inspectors.needsClean(url[0])) {
      shouldRedirect = true;
      reasons.push('URL is not clean');
      url[0] = cleaners.clean(url[0]);
    } else if (options.sanitize && inspectors.needsSanitize(url, options.add)) {
      shouldRedirect = true;
      reasons.push('URL has garbage');
      url = cleaners.sanitize(url, options.add);
    }

    // Ensure trailing slash in place, if needed
    if (options.add && inspectors.needsAdd(url[0])) {
      shouldRedirect = true;
      reasons.push('URL has no trailing slash');
      url[0] = cleaners.add(url[0]);
    }

    // Normalize letter case differences, if needed
    if (options.normalize && inspectors.needsNormalize(url[0])) {
      shouldRedirect = true;
      reasons.push('URL path is denormalized');
      url[0] = cleaners.normalize(url[0]);
    }

    url[0] = '/' + url[0];

    // On this state we are done
    // Only thing left is to determine if we need redirect or pass thrue
    if (shouldRedirect) {
      // If need, fix leading slash
      url[0] = utils.fixOptions(url[0]);

      if (options.pass) {
        var error = new Error('URL need redirect');
        error.reasons = reasons;
        error.url = url.join('?');
        error.code = res._code;

        next(error);
      } else utils.redirect(res, url);
    } else {
      next();
    }
  }

  // Simple setter/getter system
  // Use it instead of directly mutating `_options` property of cleaner
  // instance after initializing it
  // This methods calling invalidation fix of clean/sanitize/add options
  middleware.set = function get(key, value) {
    if (utils.isType(key, 'object')) {
      options = utils.config(options, key);
    } else if  (key in options && options.hasOwnProperty(key)) {
      options[key] = value;
    }

    options = utils.fixOptions(options);

    return middleware;
  };

  middleware.get = function get(key) {
    if (key) {
      if (key in options && options.hasOwnProperty(key)) {
        return options[key];
      }

      return null;
    } else {
      // return options copy
      return utils.copy(options);
    }
  };

  middleware._options = options;

  return middleware;
}

module.exports = cleaner;
