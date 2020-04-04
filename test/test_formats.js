var assert = require('assert');
var _ = require('underscore');

var strftime = require('../lib/strftime');

var expects = {
  '%a': 'Fri',
  '%A': 'Friday',
  '%b': 'Nov',
  '%B': 'November',
  '%d': '07',
  '%-d': '7',
  '%f': '000000',
  '%H': '13',
  '%-H': '13',
  '%I': '01',
  '%-I': '1',
  '%j': '280',
  '%-j': '280',
  '%m': '11',
  '%-m': '11',
  '%M': '07',
  '%-M': '7',
  '%p': 'PM',
  '%S': '07',
  '%-S': '7',
  '%U': '40',
  '%w': '5',
  '%W': '44',
  '%y': '14',
  '%Y': '2014',
  // '%z': '%TZ_OFFSET%',
  // '%Z': '%TZ_PREFIX%',
  '%%': '%',

  '': 'Fri Nov 07 13:07:07 2014',
  '%c': 'Fri Nov 07 13:07:07 2014',
  '%x': '11/07/14',
  '%X': '13:07:07',

  '%a %b %d %Y %-H:%M:%S': 'Fri Nov 07 2014 13:07:07',
  '%m/%-d/%y': '11/7/14',
  '%b %d, %Y': 'Nov 07, 2014',
};

function pad(num, size) {
    var s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
}

function parseOffset(date) {
  var offset = date.getTimezoneOffset();
  var hours = Math.floor(-1 * offset / 60);
  var minutes = (-1 * offset) - (hours * 60);
  var sign = offset > 0 ? '-' : '+';
  return {
    offset: offset,
    hours: Math.abs(hours),
    minutes: Math.abs(minutes),
    sign: sign,
  };
}

function timezoneOffset(date) {
  var offset = parseOffset(date);
  return offset.sign + pad(offset.hours, 2) + pad(offset.minutes, 2);
}

describe('dateformat([now], [mask])', function() {
        var now = new Date(2014, 10, 7, 13, 7, 7);
        var tzOffset = timezoneOffset(now);
        _.each(expects, function (value, key) {
            it('should format `' + key + '` mask', function(done) {
            var expected = expects[key].replace(/%TZ_PREFIX%/, 'GMT')
                                       .replace(/%TZ_OFFSET%/g, tzOffset)
                                       .replace(/GMT\+0000/g, 'UTC');

            var actual = strftime(now, key);
            assert.strictEqual(actual, expected);
            done();
        });
  })
  // it('should use `default` mask, when `mask` is empty', function(done) {
  //   var now = new Date(2014, 10, 26, 13, 19, 44);
  //   var expected = expects['default'];
  //   var actual = strftime(now);
  //
  //   assert.strictEqual(actual, expected);
  //   done();
  // });
});
