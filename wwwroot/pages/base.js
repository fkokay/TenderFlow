var TenderFlow = TenderFlow || {};
TenderFlow.Table = TenderFlow.Table || {};

TenderFlow.Table.LanguageReady = new Promise(function (resolve) {

    var base = {
        paginate: {
            next: '<i class="icon-base ti ti-chevron-right scaleX-n1-rtl icon-18px"></i>',
            previous: '<i class="icon-base ti ti-chevron-left scaleX-n1-rtl icon-18px"></i>',
            first: '<i class="icon-base ti ti-chevrons-left scaleX-n1-rtl icon-18px"></i>',
            last: '<i class="icon-base ti ti-chevrons-right scaleX-n1-rtl icon-18px"></i>'
        }
    };

    $.getJSON("https://cdn.datatables.net/plug-ins/2.3.2/i18n/tr.json", function (tr) {
        TenderFlow.Table.Language = $.extend(true, tr, base);
        resolve();
    });
});