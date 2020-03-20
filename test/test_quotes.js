var assert = require('assert');

var strftime = require('./../lib/strftime');

describe('quoted substrings', function() {
  var az = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  it('should not format single quoted substrings removing quotes', function() {
    var result = strftime("'" + az + "'");
    assert.strictEqual(result, az);
  });

  it('should not format double quoted substrings removing quotes', function() {
    var result = strftime('"' + az + '"');
    assert.strictEqual(result, az);
  });
});
