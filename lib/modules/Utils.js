// Configuring options object
exports.config = function(defaults, options) {
  var key;

  if (options) {
    for (key in options) {
      if (defaults.hasOwnProperty(key)) {
        defaults[key] = options[key];
      }
    }
  }

  return defaults;
};

exports.copy = function(source) {
  var obj = {};
  var key;

  for (key in source) {
    if (source.hasOwnProperty(key)) {
      obj[key] = source[key];
    }
  }

  return obj;
};

// Immediate redirect helper
exports.redirect = function(res, url) {
  res.writeHead(res._code, {
    'Location': url.join('?')
  });
  res.end();
};

// Fix options collisions
exports.fixOptions = function(options) {
  if (options.add || options.sanitize) {
    options.clean = false;
  }

  return options;
};

exports.isBigEnough = function(value, n) {
  return value.length > (n || 1);
};

var undef = 'undefined';

exports.isDefined = function(obj) {
  return typeof obj !== undef;
};

exports.isBroken = function(url) {
  return url.length > 2;
};

// Simple type checking
exports.toString = function(obj) {
  return Object.prototype.toString.call(obj);
};

exports.isType = function(obj, check) {
  var type = exports.toString(obj).slice(8).slice(0, -1).toLowerCase();

  if (typeof check === 'string') {
    return type === check.toLowerCase();
  }

  return type;
};
