var csv = require('oh-csv');

function csvBoyMiddleware(options) {
  options = options || {};
  options.mimes = options.mimes || ['text/csv'];
  options.methods = options.methods || ['POST', 'PUT', 'PATCH'];

  return function csvBoy(req, res, next) {
    if (-1 === options.methods.indexOf(req.method)
        || !hasBody(req)
        || -1 === options.mimes.indexOf(mime(req))) {
      return next();
    }

    req.csvboy = new csv.Parser(options.csvOptions);

    if(options.immediate) {
      req.pipe(req.csvboy);
    }

    next();
  };
}

// utility functions copied from Connect
function hasBody(req) {
  var encoding = 'transfer-encoding' in req.headers,
      length = 'content-length' in req.headers
               && req.headers['content-length'] !== '0';
  return encoding || length;
};

function mime(req) {
  var str = req.headers['content-type'] || '';
  return str.split(';')[0];
};

module.exports = csvBoyMiddleware;
