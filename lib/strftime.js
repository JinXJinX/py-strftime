/*
 * Py Date Format 0.0.1
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
      var token = /%\-?\w/g;
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

        var _ = utc ? 'getUTC' : 'get';
        var d = date[_ + 'Date']();
        var D = date[_ + 'Day']();
        var m = date[_ + 'Month']();
        var y = date[_ + 'FullYear']();
        var H = date[_ + 'Hours']();
        var M = date[_ + 'Minutes']();
        var s = date[_ + 'Seconds']();
        var L = date[_ + 'Milliseconds']();
        var o = utc ? 0 : date.getTimezoneOffset();
        var W = getWeek(date);
        var N = getDayOfWeek(date);
        // reference: https://strftime.org/
        var flags = {
          '%a':  strftime.i18n.dayNames[D],  // Weekday as locale’s abbreviated name. e.g. Wen
          '%A': strftime.i18n.dayNames[D + 7],  // Weekday as locale’s full name. e.g. Monday
          '%w': D, // Weekday as a decimal number, where 0 is Sunday and 6 is Saturday.
          '%d':   pad(d),  // Day of the month as a zero-padded decimal number. e.g. 02
          '%-d':   d,  // Day of the month as a decimal number. e.g. 9
          '%b':  strftime.i18n.monthNames[m],  // Month as locale’s abbreviated name. e.g. Sep
          '%B': strftime.i18n.monthNames[m + 12],  // Month as locale’s full name. e.g. September
          '%m':   pad(m + 1),  // Month as a zero-padded decimal number. e.g. 09
          '%-m':    m + 1,  // Month as a decimal number. (Platform specific). e.g. 8
          '%y':   String(y).slice(2),  // Year without century as a zero-padded decimal number. e.g. 08
          '%Y': y,  // Year with century as a decimal number. e.g. 2020
          '%H':   pad(H),  // Hour (24-hour clock) as a zero-padded decimal number. e.g. 07
          '%-H':    H,  // Hour (24-hour clock) as a decimal number. (Platform specific) e.g. 16
          '%I':   pad(H % 12 || 12),  // Hour (12-hour clock) as a zero-padded decimal number. e.g. 01
          '%-I':    H % 12 || 12,  // Hour (12-hour clock) as a decimal number. (Platform specific) e.g. 7
          '%p': H < 12 ? strftime.i18n.timeNames[6] : strftime.i18n.timeNames[7], // TODO  // Locale’s equivalent of either AM or PM.  AM
          '%M':   pad(M),  // Minute as a zero-padded decimal number. e.g. 07
          '%-M':    M,  // Minute as a decimal number. (Platform specific) e.g. 7
          '%S':   pad(s),  // 	Second as a zero-padded decimal number. 07
          '%-S':    s,  // Second as a decimal number. (Platform specific) 7
          '%f': null, // TODO  // 	Microsecond as a decimal number, zero-padded on the left.  000000
          '%z': null, // TODO  // UTC offset in the form +HHMM or -HHMM (empty string if the the object is naive).
          '%Z':    gmt ? 'GMT' : utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),  // Time zone name
          '%j': null, // TODO  // Day of the year as a zero-padded decimal number.
          '%-j': null, // TODO  // Day of the year as a decimal number. (Platform specific)
          '%U': null, // TODO  // Week number of the year
          '%W':    W,  // ISO 8601 Week number of the year, Monday is the first day of the week
          // '%c': '', // TODO  // Locale’s appropriate date and time representation.  Mon Sep 30 07:06:05 2013
          // '%x': '', // TODO  // Locale’s appropriate date representation.  09/30/13
          // '%X': '', // TODO  // Locale’s appropriate time representation.  07:06:05
          '%%': '%', // TODO // A literal '%' character.

          // l:    pad(L, 3),
          // L:    pad(Math.round(L / 10)),
          // t:    H < 12 ? strftime.i18n.timeNames[0] : strftime.i18n.timeNames[1],
          // tt:   H < 12 ? strftime.i18n.timeNames[2] : strftime.i18n.timeNames[3],
          // T:    H < 12 ? strftime.i18n.timeNames[4] : strftime.i18n.timeNames[5],
          // TT:   H < 12 ? strftime.i18n.timeNames[6] : strftime.i18n.timeNames[7],
          // o:    (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
          // S:    ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10],
          // N:    N
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
function getWeek(date) {
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

  return {}.toString.call(val)
    .slice(8, -1).toLowerCase();
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
