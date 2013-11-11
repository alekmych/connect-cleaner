var cleaners = require('./Cleaners');
var regExps = require('./RegExps');
var utils = require('./Utils');

// Skip request if method is not GET or HEAD or URL length less the 2
exports.skip = function(method, url) {
  return !((method === 'GET' || method === 'HEAD') && utils.isBigEnough(url));
};

exports.needsClean = function(path) {
  return utils.isBigEnough(path) && path[path.length - 1] === '/';
};

// check parts lengthes and inspect them for garbage
exports.needsSanitize = function(url, add) {
  return (!add && utils.isBigEnough(url[0]) && regExps.clean.test(url[0])) || regExps.garbage.test(url[1]);
};

exports.needsAdd = function(path) {
  return path[path.length - 1] !== '/';
};

// check url path case normalization
exports.needsNormalize = function(path) {
  return path !== cleaners.normalize(path);
};
