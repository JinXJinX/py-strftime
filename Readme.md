# py-strftime

Use Python's strftime function in Javascript

[![Build Status](https://travis-ci.org/JinXJinX/py-strftime.svg?branch=master)](https://travis-ci.org/JinXJinX/py-strftime)

## Installation

```bash
$ npm install py-strftime
$ py-strftime --help
```

## Usage
```
var date = new Date(2020, 0, 1)
strftime(date, '%c')
// "Wed Jan 01 00:00:00 2020"
```

### Directives

Code | Meaning | Example
---- | ----------- | ---
`%a` | Weekday as locale’s abbreviated name. | Mon
`%A	` | Weekday as locale’s full name. | Monday
`%w` | Weekday as a decimal number, where 0 is Sunday and 6 is Saturday. | 1
`%d` | Day of the month as a zero-padded decimal number. | 30
`%-d` | Day of the month as a decimal number. (Platform specific) | 30
`%b` | Month as locale’s abbreviated name. | Sep
`%B` | Month as locale’s full name. | September
`%m` | Month as a zero-padded decimal number.	| 09
`%-m` | Month as a decimal number. (Platform specific) | 9
`%y` | Year without century as a zero-padded decimal number. | 13
`%Y` | Year with century as a decimal number. | 2013
`%H` | Hour (24-hour clock) as a zero-padded decimal number.	| 07
`%-H` | Hour (24-hour clock) as a decimal number. (Platform specific)	| 7
`%I` | Hour (12-hour clock) as a zero-padded decimal number.	| 07
`%-I` | Hour (12-hour clock) as a decimal number. (Platform specific)	| 7
`%p` | Locale’s equivalent of either AM or PM.	| AM
`%M` | Minute as a zero-padded decimal number.	| 06
`%-M` | Minute as a decimal number. (Platform specific)	| 6
`%S` | Second as a zero-padded decimal number.	| 05
`%-S` | Second as a decimal number. (Platform specific)	| 5
`%f` | Microsecond as a decimal number, zero-padded on the left.	| 000000
`%z` |  UTC offset in the form +HHMM or -HHMM (empty string if the the object is naive).
`%Z` | Time zone name (empty string if the object is naive).
`%j` | Day of the year as a zero-padded decimal number.	| 273
`%-j` | Day of the year as a decimal number. (Platform specific)	| 273
`%U` | Week number of the year (Sunday as the first day of the week) as a zero padded decimal number. All days in a new year preceding the first Sunday are considered to be in week 0. | 39
`%W` | Week number of the year (Monday as the first day of the week) as a decimal number. All days in a new year preceding the first Monday are considered to be in week 0. | 39
`%c` | Locale’s appropriate date and time representation.	| Mon Sep 30 07:06:05 2013
`%x` | Locale’s appropriate date representation.	| 09/30/13
`%X` | Locale’s appropriate time representation.	| 07:06:05
`%%` | A literal '%' character.	| %

Reference: [Python strftime cheat sheet](https://strftime.org)


### Localization
Day names, month names and the AM/PM indicators can be localized by
passing an object with the necessary strings. For example:
```js
var strftime = require('strftime');
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
```
> Notice that only one language is supported at a time and all strings
> *must* be present in the new value.

## License

(c) 2020 JinXJinX, MIT license.
