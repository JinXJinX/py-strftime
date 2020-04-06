var assert = require('assert');
var strftime = require('./../lib/strftime');

describe('test week number of the year', function() {
    it('should correctly format the timezone part', function(done) {
        var start = 10; // the 10 of March 2013 is a Sunday
        var date = new Date(2020, 0, 1);
        var day = date.getDay();   // 0 is Sunday ... 6 is Saturday

        // All days in a new year preceding the first Sunday
        // are considered to be in week 0
        var week_num_sunday_first_day = 0;

        // In iso 8601. The first week of the year is the week that contains
        // that year's first Thursday
        var week_num_monday_first_day = (day > 1 && day < 5) ? 1 : 0;

        while (date.getFullYear() === 2020) {
            day = date.getDay();
            if (day === 0)
                week_num_sunday_first_day ++;

            if (day === 1)
                week_num_monday_first_day ++;

            var real_week_num_sunday = strftime(date, "%U");
            var real_week_num_monday = strftime(date, "%W")

            it(date + 'week num(Sunday first day) wrong. ', function(done) {
                assert.strictEqual(String(week_num_sunday_first_day), real_week_num_sunday);
                done();
            });

            it(date + 'week num(Monday first day) wrong. ', function(done) {
                assert.strictEqual(String(week_num_monday_first_day), real_week_num_monday);
                done();
            });

            date.setUTCDate(date.getDate() + 1);
        }

        done();
    });
});
