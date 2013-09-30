var should = require('should');

var cleaner = require('..');

describe('cleaner', function() {
  var instance;

  before(function() {
    instance = cleaner();
  });

  it('should have exsposed options object', function(done) {
    should.exist(instance.options);
    done();
  });
});
