jQuery(function ($) {
    $.datepicker.regional['pl'] = {
        closeText: 'Zamknij',
        prevText: '&#x3c;Poprzedni',
        nextText: 'NastÄpny&#x3e;',
        currentText: 'DziÅ',
        monthNames: ['StyczeÅ', 'Luty', 'Marzec', 'KwiecieÅ', 'Maj', 'Czerwiec',
            'Lipiec', 'SierpieÅ', 'WrzesieÅ', 'PaÅºdziernik', 'Listopad', 'GrudzieÅ'],
        monthNamesShort: ['Sty', 'Lu', 'Mar', 'Kw', 'Maj', 'Cze',
            'Lip', 'Sie', 'Wrz', 'Pa', 'Lis', 'Gru'],
        dayNames: ['Niedziela', 'PoniedziaÅek', 'Wtorek', 'Åroda', 'Czwartek', 'PiÄtek', 'Sobota'],
        dayNamesShort: ['Nie', 'Pn', 'Wt', 'År', 'Czw', 'Pt', 'So'],
        dayNamesMin: ['N', 'Pn', 'Wt', 'År', 'Cz', 'Pt', 'So'],
        weekHeader: 'Tydz',
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['pl']);
});