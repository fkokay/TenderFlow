var TenderFlow = TenderFlow || {};
TenderFlow.CustomerSelector = (function ($) {

    let tableCustomer = null;
    let modalInstance = null;

    function init() {

        modalInstance = new bootstrap.Modal(
            document.getElementById('customerSelectModal')
        );
    }

    function open() {

        TenderFlow.Table.LanguageReady.then(function () {

            if (!tableCustomer) {
                initTable();
            }

            modalInstance.show();
        });
    }

    function clear() {
        $("#filterCari").val("");
    }

    function initTable() {

        tableCustomer = $("#TableCustomer").DataTable({
            language: TenderFlow.Table.Language,
            processing: false,
            serverSide: false,
            paging: true,
            searching: true,
            orderCellsTop: true,
            dom: 'tp',
            order: [[0, 'asc']],
            ajax: {
                url: '/Shipment/CustomerList',
                type: 'POST',
                contentType: 'application/json',
                dataSrc: '',
                data: d => JSON.stringify(d)
            },
            columns: [
                { data: 'CARI_KOD' },
                { data: 'CARI_ISIM' },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    className: "text-center",
                    render: function (data, type, row) {
                        return `
                            <button type="button"
                                    class="btn btn-sm btn-primary btnSelectCustomer"
                                    data-cari="${row.CARI_KOD}">
                                Seç
                            </button>
                        `;
                    }
                }
            ],
            displayLength: 10,
            select: true,
            initComplete: function () {

                const api = this.api();

                // filter row inputları
                $('#TableCustomer thead tr.dt-filter-row th').each(function (i) {
                    $('input', this).on('keyup change', function () {
                        if (api.column(i).search() !== this.value) {
                            api.column(i).search(this.value).draw();
                        }
                    });
                });

                applyDataTableAdjustments();
            }
        });


        $('#TableCustomer tbody').on('dblclick', 'tr', function () {

            if (!tableCustomer) return;

            const row = tableCustomer.row(this);
            const data = row.data();

            if (!data) return;

            $("#filterCari").val(data.CARI_KOD);
            modalInstance.hide();
        });

        $(document).on("click", ".btnSelectCustomer", function () {

            const cariKod = $(this).data("cari");

            $("#filterCari").val(cariKod).trigger("change");

            modalInstance.hide();
        });
    }

    function applyDataTableAdjustments() {

        const adjustments = [
            { selector: ".dt-buttons .btn", remove: "btn-secondary" },
            { selector: ".dt-buttons.btn-group", add: "mb-md-0 mb-6" },
            { selector: ".dt-search .form-control", remove: "form-control-sm", add: "ms-0" },
            { selector: ".dt-search", add: "mb-0 mb-md-6" },
            { selector: ".dt-length .form-select", remove: "form-select-sm" },
            { selector: ".dt-layout-end", add: "gap-md-2 gap-0 mt-0" },
            { selector: ".dt-layout-start", add: "mt-0" },
            { selector: ".dt-layout-table", remove: "row mt-2" },
            { selector: ".dt-layout-full", remove: "col-md col-12", add: "table-responsive" }
        ];

        setTimeout(() => {
            adjustments.forEach(x => {
                document.querySelectorAll(x.selector).forEach(el => {
                    if (x.remove) x.remove.split(" ").forEach(c => el.classList.remove(c));
                    if (x.add) x.add.split(" ").forEach(c => el.classList.add(c));
                });
            });
        }, 50);
    }

    return {
        init,
        open,
        clear
    };

})(jQuery);
