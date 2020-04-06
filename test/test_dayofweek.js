var assert = require('assert');
var strftime = require('./../lib/strftime');

describe('dayOfWeek', function() {
    it('should correctly format the timezone part', function(done) {
        var start = 10; // the 10 of March 2013 is a Sunday
        for(var dow = 0; dow < 7; dow++){
            var date = new Date(2013, 2, (start + dow));
            var w = strftime(date, '%w');
            assert.strictEqual(w, String(dow));
        }
        done();
    });
});
