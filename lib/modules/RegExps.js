// singularize xx...n to x (`//` -> `/`)
exports.RE_slash = /\/{2,}/;
exports.RE_question = /\?{2,}/;
exports.RE_amp = /&{2,}/;
exports.RE_hash = /#{2,}/;

// trailing slashes
exports.RE_clean = /\/+$/;

// trailing garbage [?&=#]
exports.RE_garbage = /[?&=#]+$/;
