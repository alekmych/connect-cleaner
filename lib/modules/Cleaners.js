exports.singularize = function singularize(url) {
  return url
    .replace(RE_slash, '/')
    .replace(RE_question, '?')
    .replace(RE_amp, '&')
    .replace(RE_hash, '#');
};

exports.clean = function clean(path) {
  return path.replace(RE_clean, '');
};

exports.sanitize = function sanitize(url, add) {
  var path = url[0];
  var query = url[1];

  if (!add && isBigEnough(path)) url[0] = path.replace(RE_clean, '');
  if (isDefined(query)) url[1] = query.replace(RE_garbage, '');

  return url;
};

exports.add = function add(path) {
  return path + '/';
};

exports.normalize = function normalize(path) {
  return path.toLowerCase();
};
