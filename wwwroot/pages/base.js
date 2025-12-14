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

TenderFlow.Table.showToast = function (message, type = "success", delay = 3000) {

    const toastEl = document.getElementById("globalToast");
    const toastMessage = document.getElementById("toastMessage");

    if (!toastEl || !toastMessage) {
        console.warn("globalToast DOM bulunamadı");
        return;
    }

    toastEl.classList.remove("bg-success", "bg-danger", "bg-warning", "bg-info");

    const colorMap = {
        success: "bg-success",
        danger: "bg-danger",
        error: "bg-danger",
        warning: "bg-warning",
        info: "bg-info"
    };

    toastEl.classList.add(colorMap[type] || "bg-info");

    toastMessage.innerText = message;

    const bsToast = bootstrap.Toast.getOrCreateInstance(toastEl, {
        delay: delay
    });

    bsToast.show();
};