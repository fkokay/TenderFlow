var TenderFlow = TenderFlow || {};

TenderFlow.OrderList = (function ($) {

    let table = null;
    function init() {

        TenderFlow.Table.LanguageReady.then(function () {
            initTable();
            bindEvents();
        });
    }
    function initTable() {

        table = $('#Table').DataTable({
            language: TenderFlow.Table.Language,
            processing: false,
            serverSide: false,
            paging: false,
            searching: false,
            order: [
                [4, 'asc'], // CARI_KODU
                [2, 'asc'], // SIPARIS_NO
                [3, 'asc']  // SIRA
            ],
            ajax: {
                url: '/Shipment/OrderList',
                type: 'POST',
                contentType: 'application/json',
                data: function (d) {

                    const startVal = $("#filterStart").val();
                    const endVal = $("#filterEnd").val();

                    return JSON.stringify({
                        Grid: d,
                        Filters: {
                            cari: $("#filterCari").val() || null,
                            startDate: startVal || null,
                            endDate: endVal || null,
                            depo: $("#filterDepo").val() || null,
                            hasBalance: $("#filterHasBalance").is(":checked")
                        }
                    });
                },
                dataSrc: function (json) {

                    json.data.forEach(x => {
                        x.CARI_KEY = String(x.CARI_KODU || '')
                            .trim()
                            .toUpperCase()
                            .replace(/\s+/g, ' ');
                    });

                    return json.data;
                }
            },
            columns: buildColumns(),
            rowGroup: {
                dataSrc: ['CARI_KEY'],
                startRender: renderGroupRow
            }
        });

        // Loader
        table.on('preXhr.dt', () => $("#tableLoading").show());
        table.on('xhr.dt', () => $("#tableLoading").hide());
        table.on('processing.dt', (e, s, p) => $("#tableLoading").toggle(p));
    }

    function buildColumns() {
        return [
            {
                data: null,
                orderable: false,
                className: "text-center",
                render: () => `
                    <div class="rg-check-area">
                        <input type="checkbox" class="row-checkbox"/>
                    </div>`
            },
            { data: 'ID', visible: false },
            { data: 'SIPARIS_NO' },
            { data: 'SIRA' },
            { data: 'CARI_KODU', visible: false },
            { data: 'CARI_ADI', visible: false },
            renderDate('TARIH'),
            renderDate('TESLIM_TARIHI'),
            { data: 'STOK_KODU' },
            { data: 'STOK_ADI' },
            { data: 'SIPARIS_MIKTAR' },
            { data: 'GONDERILEN_MIKTAR' },
            { data: 'MIKTAR' },
            { data: 'DEPO_BAKIYE' }
        ];
    }

    function renderDate(field) {
        return {
            data: field,
            render: (v, t) =>
                t === "sort" || t === "type"
                    ? v
                    : moment(v).format("DD.MM.YYYY")
        };
    }

    function renderGroupRow(rows, group) {
        const row = rows.data()[0];
        return `
            <div class="group-row rg-row">
                <div class="rg-check-area">
                    <input type="checkbox"
                           class="group-checkbox"
                           data-group="${group}">
                </div>
                <div class="rg-title">${row.CARI_ADI}</div>
            </div>`;
    }
    function bindEvents() {
        $('#Table').on('change', '.group-checkbox', function () {
            const group = $(this).data("group");
            const checked = $(this).is(":checked");

            table.rows().every(function () {
                if (this.data().CARI_KEY === group) {
                    $(this.node())
                        .find('.row-checkbox')
                        .prop('checked', checked);
                }
            });
        });

        $("#btnFilter").on("click", () => table.ajax.reload());

        $("#btnClearFilters").on("click", function () {
            $("#filterCari, #filterStart, #filterEnd").val("");
            $("#filterDepo").val("");
            $("#filterHasBalance").prop("checked", false);
            table.ajax.reload();
        });

        $(document).on("click", "#btnCreateShipment", createShipment);
        $(document).on("submit", "#shipmentForm", submitShipmentForm);
    }
    function getSelectedIds() {

        const ids = [];

        table.rows().every(function () {
            if ($(this.node()).find('.row-checkbox').is(':checked')) {
                ids.push(this.data().ID);
            }
        });

        return ids;
    }
    function createShipment() {

        const selectedIds = getSelectedIds();

        if (!selectedIds.length) {
            TenderFlow.Table.showToast(
                "Sevk edilebilecek bir sipariş seçiniz",
                "warning"
            );
            return;
        }

        const selectedRows = [];
        table.rows().every(function () {
            if ($(this.node()).find('.row-checkbox').is(':checked')) {
                selectedRows.push(this.data());
            }
        });

        const siparisNolari = [...new Set(selectedRows.map(x => x.SIPARIS_NO))];

        if (siparisNolari.length > 1) {
            TenderFlow.Table.showToast(
                "Seçilen ürünler aynı sipariş numarasına ait değil. Sevkiyat oluşturulamaz.",
                "warning"
            );
            return;
        }

        $("#tableLoading").show();

        $.ajax({
            url: "/Shipment/Create",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ ids: selectedIds }),
            success: function (html) {
                $("#shipmentModal .modal-body").html(html);
                bootstrap.Modal
                    .getOrCreateInstance(
                        document.getElementById('shipmentModal')
                    )
                    .show();
            },
            error: function () {
                TenderFlow.Table.showToast(
                    "Sevk oluşturulurken bir hata oluştu",
                    "danger"
                );
            },
            complete: function () {
                $("#tableLoading").hide();
            }
        });
    }
    function submitShipmentForm(e) {

        e.preventDefault();

        const form = $(this);
        const btn = $("#btnConfirmShipment");

        if (btn.prop("disabled")) return;

        btn.prop("disabled", true)
            .html(`<span class="spinner-border spinner-border-sm me-2"></span> İşleniyor...`);

        $.ajax({
            url: form.attr("action"),
            type: "POST",
            data: form.serialize(),
            success: function (res) {

                bootstrap.Modal
                    .getInstance(
                        document.getElementById('shipmentModal')
                    )
                    .hide();

                if (res.success) {
                    TenderFlow.Table.showToast(
                        "Sevk başarıyla oluşturuldu. Sevk No: " + res.shipmentNo,
                        "success"
                    );
                    table.ajax.reload(null, false);
                } else {
                    TenderFlow.Table.showToast(
                        res.errorMessage || "İşlem başarısız",
                        "danger"
                    );
                }
            },
            error: function () {
                TenderFlow.Table.showToast(
                    "Sevk oluşturulurken bir hata oluştu",
                    "danger"
                );
            },
            complete: function () {
                btn.prop("disabled", false)
                    .html("Sevkiyat Emri Oluştur");
            }
        });
    }

    (function () {

        const actionWrapperId = "navbar-action-wrapper";
        let lastState = false;

        function handleNavbarActionVisibility() {
            const el = document.getElementById(actionWrapperId);
            if (!el) return;

            const shouldShow = window.scrollY > 10;

            if (shouldShow === lastState) return; // gereksiz DOM işlemi yapma
            lastState = shouldShow;

            if (shouldShow) {
                el.classList.remove("navbar-action-hidden");
                el.classList.add("navbar-action-visible");
            } else {
                el.classList.remove("navbar-action-visible");
                el.classList.add("navbar-action-hidden");
            }
        }

        window.addEventListener("scroll", handleNavbarActionVisibility);
        document.addEventListener("DOMContentLoaded", handleNavbarActionVisibility);

    })();

    return {
        init,
        createShipment
    };

})(jQuery);
