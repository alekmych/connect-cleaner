exports.skip = function skip(method, url) {
  return !((method === 'GET' || method === 'HEAD') && isBigEnough(url));
};

exports.needsClean = function needsClean(path) {
  return isBigEnough(path) && path[path.length - 1] === '/';
};

exports.needsSanitize = function needsSanitize(url, add) {
  return (!add && isBigEnough(url[0]) && RE_clean.test(url[0])) || RE_garbage.test(url[1]);
};

exports.needsAdd = function needsAdd(path) {
  return path[path.length - 1] !== '/';
};

exports.needsNormalize = function needsNormalize(path) {
  return path !== normalize(path);
};
