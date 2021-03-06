// Generated by CoffeeScript 1.9.3
(function() {
  var fs, timeout;

  fs = require('fs');

  timeout = require('./timeout');

  module.exports = function(dir, max_wait) {
    var deleted, i, len, pipe, read, ref, result, t_limit;
    t_limit = Date.now() + max_wait;
    while (!read) {
      try {
        if (fs.readFileSync(dir + '/done').length) {
          read = true;
        }
      } catch (_error) {}
      timeout(t_limit, 'Process execution timeout or exit flag read failure');
    }
    while (!deleted) {
      try {
        fs.unlinkSync(dir + '/done');
        deleted = true;
      } catch (_error) {}
      timeout(t_limit, 'Can not delete exit code file');
    }
    result = {};
    ref = ['stdout', 'stderr', 'status'];
    for (i = 0, len = ref.length; i < len; i++) {
      pipe = ref[i];
      result[pipe] = fs.readFileSync(dir + '/' + pipe, {
        encoding: 'utf-8'
      });
      read = true;
      fs.unlinkSync(dir + '/' + pipe);
    }
    try {
      fs.rmdirSync(dir);
    } catch (_error) {}
    result.status = Number(result.status);
    return result;
  };

}).call(this);
