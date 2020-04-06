/*
 * Py Date Format 0.0.2
 * Jinx
 * MIT license
 *
 * forked from Steven Levithan's https://github.com/felixge/node-dateformat
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to strftime.masks.default.
 */

(function(global) {
  'use strict';

  var strftime = (function() {
      // var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|"[^"]*"|'[^']*'/g;
      var token = /%\-?[\w%]/g;
      var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
      var timezoneClip = /[^-+\dA-Z]/g;

      // Regexes and supporting functions are cached through closure
      return function (date, mask, utc, gmt) {

        // You can't provide utc if you skip other args (use the 'UTC:' mask prefix)
        if (arguments.length === 1 && kindOf(date) === 'string' && !/\d/.test(date)) {
          mask = date;
          date = undefined;
        }

        date = date || new Date;

        if(!(date instanceof Date)) {
          date = new Date(date);
        }

        if (isNaN(date)) {
          throw TypeError('Invalid date');
        }

        // mask = String(strftime.masks[mask] || mask || strftime.masks['default']);
        mask = String(mask || '%c');

        var defaultMasks = {
          '%c': '%a %b %d %H:%M:%S %Y',   // Mon Sep 30 07:06:05 2013
          '%x': '%m/%d/%y',  // 09/30/13
          '%X': '%H:%M:%S',  // 07:06:05
        }

        for (var key in defaultMasks) {
            mask = mask.replace(key, defaultMasks[key])
        }

        // Allow setting the utc/gmt argument via the mask
        var maskSlice = mask.slice(0, 4);
        if (maskSlice === 'UTC:' || maskSlice === 'GMT:') {
          mask = mask.slice(4);
          utc = true;
          if (maskSlice === 'GMT:') {
            gmt = true;
          }
        }

        // var _ = utc ? 'getUTC' : 'get';
        // var d = date[_ + 'Date']();
        // var D = date[_ + 'Day']();
        // var m = date[_ + 'Month']();
        // var y = date[_ + 'FullYear']();
        // var H = date[_ + 'Hours']();
        // var M = date[_ + 'Minutes']();
        // var s = date[_ + 'Seconds']();
        // var L = date[_ + 'Milliseconds']();

        if (utc)
            date = new Date(date.toUTCString())

        var d = date.getDate();
        var D = date.getDay();
        var m = date.getMonth();
        var y = date.getFullYear();
        var H = date.getHours();
        var M = date.getMinutes();
        var s = date.getSeconds();
        var L = date.getMilliseconds();

        var o = utc ? 0 : date.getTimezoneOffset();
        var W = getWeek(date, 1);
        var W2 = getWeek(date, 0);
        var N = getDayOfWeek(date);
        var j = getDayOfYear(date);
        var a = strftime.i18n.dayNames[D];
        var A = strftime.i18n.dayNames[D + 7];
        var b = strftime.i18n.monthNames[m];
        var B = strftime.i18n.monthNames[m + 12];
        var p = H < 12 ? strftime.i18n.timeNames[6] : strftime.i18n.timeNames[7];
        var z = (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4);
        var Z = gmt ? 'GMT' : utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, '');
        // reference: https://strftime.org/
        var flags = {
          '%a':    a,                   // Wen          // Weekday as locale’s abbreviated name.
          '%A':    A,                   // Monday       // Weekday as locale’s full name.
          '%b':    b,                   // Sep          // Month as locale’s abbreviated name.
          '%B':    B,                   // September    // Month as locale’s full name.
          '%d':    pad(d),              // 02           // Day of the month as a zero-padded decimal number.
          '%-d':   d,                   // 7            // Day of the month as a decimal number.
          '%f':    pad(L * 1000, 6),    // 000000       // Microsecond as a decimal number, zero-padded on the left.
          '%H':    pad(H),              // 07           // Hour (24-hour clock) as a zero-padded decimal number.
          '%-H':   H,                   // 7            // Hour (24-hour clock) as a decimal number. (Platform specific)
          '%I':    pad(H % 12 || 12),   // 07           // Hour (12-hour clock) as a zero-padded decimal number.
          '%-I':   H % 12 || 12,        // 7            // Hour (12-hour clock) as a decimal number. (Platform specific)
          '%j':    pad(j, 3),           // 007          // Day of the year as a zero-padded decimal number.
          '%-j':   j,                   // 7            // Day of the year as a decimal number. (Platform specific)
          '%m':    pad(m + 1),          // 07           // Month as a zero-padded decimal number.
          '%-m':   m + 1,               // 7            // Month as a decimal number. (Platform specific).
          '%M':    pad(M),              // 07           // Minute as a zero-padded decimal number.
          '%-M':   M,                   // 7            // Minute as a decimal number. (Platform specific)
          '%p':    p,                   // AM           // Locale’s equivalent of either AM or PM.
          '%S':    pad(s),              // 07           // Second as a zero-padded decimal number.
          '%-S':   s,                   // 7            // Second as a decimal number. (Platform specific)
          '%U':    W2,                  // 7            // Week number of the year
          '%w':    D,                   // 0            // Weekday as a decimal number, where 0 is Sunday and 6 is Saturday.
          '%W':    W,                   // 7            // ISO 8601 Week number of the year, Monday is the first day of the week
          '%y':    String(y).slice(2),  // 07           // Year without century as a zero-padded decimal number.
          '%Y':    y,                   // 2020         // Year with century as a decimal number.
          '%z':    z,                   // +0700        // UTC offset in the form +HHMM or -HHMM (empty string if the the object is naive).
          '%Z':    Z,                   // EST          // Time zone name
          '%%':    '%',                 // %            // A literal '%' character.
        };

        return mask.replace(token, function (match) {
          if (match in flags) {
            return flags[match];
          }
          return match.slice(1, match.length - 1);
        });
      };
    })();

// Internationalization strings
strftime.i18n = {
    dayNames: [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ],
    monthNames: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ],
    timeNames: [
        'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    ]
};

function pad(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) {
        val = '0' + val;
    }
    return val;
}

/**
 * Get the ISO 8601 week number
 * Based on comments from
 * http://techblog.procurios.nl/k/n618/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html
 *
 * @param  {Object} `date`
 * @return {Number}
 */
function getWeekISO8601(date) {
    // Remove time components of date
    var targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Change date to Thursday same week
    targetThursday.setDate(targetThursday.getDate() - ((targetThursday.getDay() + 6) % 7) + 3);

    // Take January 4th as it is always in week 1 (see ISO 8601)
    var firstThursday = new Date(targetThursday.getFullYear(), 0, 4);

    // Change date to Thursday same week
    firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);

    // Check if daylight-saving-time-switch occurred and correct for it
    var ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
    targetThursday.setHours(targetThursday.getHours() - ds);

    // Number of weeks between target Thursday and first Thursday
    var weekDiff = (targetThursday - firstThursday) / (86400000*7);
    return 1 + Math.floor(weekDiff);
}

/**
 * Get ISO-8601 numeric representation of the day of the week
 * 1 (for Monday) through 7 (for Sunday)
 *
 * @param  {Object} `date`
 * @return {Number}
 */
function getDayOfWeek(date) {
    var dow = date.getDay();
    if(dow === 0) {
        dow = 7;
    }
    return dow;
}

/**
 * Week number of the year (Sunday as the first day of the week) as
 * decimal number.
 * All days in a new year preceding the first Sunday
 * are considered to be in week 0.
 *
 * @param  {Object} `date`
 * @return {Number}
 */
function getWeek(date, firstDayOfWeek) {
    var firstDateOfYear = new Date(date.getFullYear(), 0, 1)
    var firstDateDay = firstDateOfYear.getDay();  // Sunday - Sat 0 - 6
    var weekOneFirstDate;
    if (firstDateDay === firstDayOfWeek) {
        weekOneFirstDate = firstDateOfYear;
    } else {
        weekOneFirstDate = new Date(date.getFullYear(), 0, 8 - firstDateDay)
    }

    return date < weekOneFirstDate ? 0 : Math.ceil((getDiffDay(date, weekOneFirstDate) + 1)/7)
}

function getDayOfYear(date) {
    var firstDateOfYear = new Date(date.getFullYear(), 0, 1)
    return getDiffDay(date, firstDateOfYear)
}

function getDiffDay(date1, date2) {
    var diffTime = Math.abs(date1 - date2);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * kind-of shortcut
 * @param  {*} val
 * @return {String}
 */
function kindOf(val) {
    if (val === null) {
        return 'null';
    }

    if (val === undefined) {
        return 'undefined';
    }

    if (typeof val !== 'object') {
        return typeof val;
    }

    if (Array.isArray(val)) {
        return 'array';
    }

    return {}.toString.call(val).slice(8, -1).toLowerCase();
};

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return strftime;
        });
    } else if (typeof exports === 'object') {
        module.exports = strftime;
    } else {
        global.strftime = strftime;
    }
})(this);
