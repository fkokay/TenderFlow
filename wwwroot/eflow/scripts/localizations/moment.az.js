
function n(e, n) {
    var r = e.split("_"),
        i = Math.min(t.length, r.length),
        s = -1;
    while (++s < i) if (t[s](n)) return r[s];
    return r[i - 1]
}
function r(e, t, r) {
    var i = {
        mm: "минута_минуты_минут_минуты",
        hh: "час_часа_часов_часа",
        dd: "день_дня_дней_дня",
        MM: "месяц_месяца_месяцев_месяца",
        yy: "год_года_лет_года"
    };
    return r === "m" ? t ? "минута" : "минуту" : e + " " + n(i[r], +e)
}
function i(e, t) {
    var n = {
        nominative: "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),
        accusative: "января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_")
    }, r = /D[oD]? *MMMM?/.test(t) ? "accusative" : "nominative";
    return n[r][e.month()]
}
function s(e, t) {
    var n = {
        nominative: "воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),
        accusative: "воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_")
    }, r = /\[ ?[Вв] ?(?:прошлую|следующую)? ?\] ?dddd/.test(t) ? "accusative" : "nominative";
    return n[r][e.day()]
}
var t = [function (e) {
    return e % 10 === 1 && e % 100 !== 11
}, function (e) {
    return e % 10 >= 2 && e % 10 <= 4 && e % 10 % 1 === 0 && (e % 100 < 12 || e % 100 > 14)
}, function (e) {
    return e % 10 === 0 || e % 10 >= 5 && e % 10 <= 9 && e % 10 % 1 === 0 || e % 100 >= 11 && e % 100 <= 14 && e % 100 % 1 === 0
}, function (e) {
    return !0
}
];
moment.lang("ru", {
    months: i,
    monthsShort: "янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),
    weekdays: s,
    weekdaysShort: "вск_пнд_втр_срд_чтв_птн_сбт".split("_"),
    weekdaysMin: "вс_пн_вт_ср_чт_пт_сб".split("_"),
    longDateFormat: {
        LT: "HH:mm",
        L: "DD.MM.YYYY",
        LL: "D MMMM YYYY г.",
        LLL: "D MMMM YYYY г., LT",
        LLLL: "dddd, D MMMM YYYY г., LT"
    },
    calendar: {
        sameDay: "[Сегодня в] LT",
        nextDay: "[Завтра в] LT",
        lastDay: "[Вчера в] LT",
        nextWeek: function () {
            return this.day() === 2 ? "[Во] dddd [в] LT" : "[В] dddd [в] LT"
        },
        lastWeek: function () {
            switch (this.day()) {
                case 0:
                    return "[В прошлое] dddd [в] LT";
                case 1:
                case 2:
                case 4:
                    return "[В прошлый] dddd [в] LT";
                case 3:
                case 5:
                case 6:
                    return "[В прошлую] dddd [в] LT"
            }
        },
        sameElse: "L"
    },
    relativeTime: {
        future: "через %s",
        past: "%s назад",
        s: "несколько секунд",
        m: r,
        mm: r,
        h: "час",
        hh: r,
        d: "день",
        dd: r,
        M: "месяц",
        MM: r,
        y: "год",
        yy: r
    },
    ordinal: "%d.",
    week: {
        dow: 1,
        doy: 7
    }
})