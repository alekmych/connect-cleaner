exports.defaults = function defaults(target, source) {
  source || (source = target);

  for (key in source) {
    if (source.hasOwnProperty(key) && key in target) {
      target[key] = source[key];
    }
  }

  return target;
};

exports.redirect = function redirect(res, url) {
  res.writeHead(res._code, {
    'Location': url.join('?')
  });
  res.end();
};

exports.fixOptions = function fixOptions(options) {
  if (options.add || options.sanitize) {
    options.clean = false;
  }

  return options;
};

exports.fixLeadingSlash = function fixLeadingSlash(path) {
  return path[0] === '/' ? path : '/' + path;
};

exports.isBigEnough = function isBigEnough(value, n) {
  return value.length > (n || 1);
};

exports.isDefined = function isDefined(obj) {
  return obj !== undefined;
};

exports.isDirty = function isDirty(url) {
  return url.length > 2;
};

exports.toString = function toString(obj) {
  return Object.prototype.toString.call(obj);
};

exports.isType = function isType(obj, check) {
  var type = toString(obj).slice(8).slice(0, -1).toLowerCase();

  if (typeof check === 'string') {
    return type === check.toLowerCase();
  }

  return type;
};

exports.log = function log() {
  console.log.apply(console, arguments);
}

exports.inform = function inform(action, reason) {
  var str = 'ACTION:\t\t';
  str += action;
  str += '\nREASON:\t\t';
  log(str += reason);
};
