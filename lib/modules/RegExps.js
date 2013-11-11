// singularize xx...n to x (`//` -> `/`)
exports.slash = /\/{2,}/;
exports.question = /\?{2,}/;
exports.amp = /&{2,}/;
exports.hash = /#{2,}/;

// trailing slashes
exports.clean = /\/+$/;

// trailing garbage [?&=#]
exports.garbage = /[?&=#]+$/;
