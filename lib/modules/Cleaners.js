var regExps = require('./regExps');
var utils = require('./Utils');

exports.singularize = function(url) {
  return url
    .replace(regExps.slash, '/')
    .replace(regExps.question, '?')
    .replace(regExps.amp, '&')
    .replace(regExps.hash, '#');
};

exports.clean = function(path) {
  return path.replace(regExps.clean, '');
};

exports.sanitize = function(url, add) {
  var path = url[0];
  var query = url[1];

  if (!add && utils.isBigEnough(path)) url[0] = path.replace(regExps.clean, '');
  if (utils.isDefined(query)) url[1] = query.replace(regExps.garbage, '');

  return url;
};

exports.add = function(path) {
  return path + '/';
};

exports.normalize = function(path) {
  return path.toLowerCase();
};
