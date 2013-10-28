exports.defaults = function(target, source) {
  var key;

  if (source) {
    for (key in source) {
      if (source.hasOwnProperty(key) && key in target) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

exports.redirect = function(res, url) {
  res.writeHead(res._code, {
    'Location': url.join('?')
  });
  res.end();
};

exports.fixOptions = function(options) {
  if (options.add || options.sanitize) {
    options.clean = false;
  }

  return options;
};

exports.fixLeadingSlash = function(path) {
  return path[0] === '/' ? path : '/' + path;
};

exports.isBigEnough = function(value, n) {
  return value.length > (n || 1);
};

exports.isDefined = function(obj) {
  return obj !== undefined;
};

exports.isDirty = function(url) {
  return url.length > 2;
};

exports.toString = function(obj) {
  return Object.prototype.toString.call(obj);
};

exports.isType = function(obj, check) {
  var type = toString(obj).slice(8).slice(0, -1).toLowerCase();

  if (typeof check === 'string') {
    return type === check.toLowerCase();
  }

  return type;
};

exports.log = function() {
  console.log.apply(console, arguments);
};

exports.inform = function(action, reason) {
  var str = 'ACTION:\t\t';
  str += action;
  str += '\nREASON:\t\t';
  log(str += reason);
};
