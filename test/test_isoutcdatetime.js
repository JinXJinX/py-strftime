var assert = require('assert');

var strftime = require('./../lib/strftime');

describe('isoUtcDateTime', function() {
  it('should correctly format the timezone part', function(done) {
    var actual = strftime('2014-06-02T13:23:21-08:00', 'isoUtcDateTime');
    assert.strictEqual(actual, '2014-06-02T21:23:21Z');
    done();
  });
});
