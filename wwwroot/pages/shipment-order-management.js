var TenderFlow = TenderFlow || {};
TenderFlow.ShipmentOrderManagement = TenderFlow.ShipmentOrderManagement || {};

TenderFlow.ShipmentOrderManagement = (function ($) {
    let table = null;
    let tableDocument = null;
    function init() {
        TenderFlow.Table.LanguageReady.then(function () {
            setDefaultDates();

            table =$('#Table').DataTable({
                language: TenderFlow.Table.Language,
                processing: false,
                serverSide: true,
                paging: false,
                searching: false,
                order: [[0, 'asc']],
                ajax: {
                    url: '/Shipment/ShipmentOrderManagementList',
                    type: 'POST',
                    contentType: 'application/json',
                    data: function (d) {
                        return JSON.stringify({
                            Grid: d,
                            Filters: {
                                startDate: $("#startDate").val() || null,
                                endDate: $("#endDate").val() || null,
                                status: $("#status").val() || null,
                                showCompleted: $("#showCompleted").is(":checked"),
                                highlightZeroPrice: $("#highlightZeroPrice").is(":checked")
                            }
                        });
                        d.Filters = {
                            startDate: $("#startDate").val(),
                            endDate: $("#endDate").val(),
                            status: $("#status").val(),
                            showCompleted: $("#showCompleted").is(":checked"),
                            highlightZeroPrice: $("#highlightZeroPrice").is(":checked")
                        };
                        return JSON.stringify(d);
                    },
                },
                deferLoading: 0,
                columns: [
                    {
                        data: 'BELGE_NO',
                        render: function (data, type, row) {
                            return `<a href="/Shipment/Edit?belgeNo=${row.BELGE_NO}">${row.BELGE_NO}</a>`;

                        }
                    },
                    {
                        data: 'SIPARIS_NO',
                        render: function (data, type, row) {
                            if (!data) return '';

                            return `
                            <button type="button" class="btn btn-sm btn-outline-primary select-siparis-btn"
                                    data-siparis="${data}">
                                ${row.SIPARIS_NO}
                            </button>`;

                        }
                    },
                    {
                        data: 'TARIH',
                        render: function (v, t) {
                            if (t === "sort" || t === "type") return v;
                            return moment(v).format("DD.MM.YYYY");
                        }
                    },
                    {
                        data: 'CARI_KODU',
                        visible: false
                    },
                    {
                        data: 'CARI_ADI',
                        className: "col-cari",
                        render: function (data, type, row) {
                            return `
                                <div>
                                    <div class="d-inline-block me-2">
                                        <div>${row.CARI_ADI}</div>
                                        <div><small class="text-muted">${row.CARI_KODU}</small></div>
                                        <div><small class="text-muted">E-Fatura Carisi :</small> ${ row.EFATURA_CARISI === "E" ? '<span class="badge bg-success">Evet</span>' : '<span class="badge bg-secondary">Hayır</span>'}</div>
                                    </div>
                                </div>
                            `;   
                        
                        }
                    },
                    {
                        data: 'EFATURA_CARISI',
                        visible: false  
                    },
                    { data: 'DURUM_ACIKLAMA' },
                    { data: 'KULLANICI_ADSOYAD' },
                    {
                        data: 'KAPALI',
                        className: "text-center",
                        render: function (data, type, row) {
                            return data === "E" ? '<span class="badge bg-success">Evet</span>' : '<span class="badge bg-secondary">Hayır</span>';
                        }
                    },
                    {
                        data: 'KISMI_TESLIMAT',
                        className: "text-center",
                        render: function (data, type, row) {
                            return data === "E" ? '<span class="badge bg-info">Evet</span>' : '<span class="badge bg-secondary">Hayır</span>';
                        }
                    },
                    {
                        data: 'TOPLAM_MIKTAR',
                        className: "text-center"
                    },
                    {
                        data: 'TOPLAM_TOPLANAN',
                        className: "text-center"
                    },
                    {
                        data: 'TOPLAM_KALAN',
                        className: "text-center"
                    },
                    { data: 'TOPLAM_IRS_EDILEN' },
                    { data: 'TOPLAM_IRS_EDILMEYEN' },
                    {
                        data: 'BELGE_NO',
                        render: function (data, type, row) {
                            return `
                                <div class="d-inline-block">

                                    <a href="javascript:;" 
                                       class="btn btn-icon btn-text-secondary rounded-pill waves-effect dropdown-toggle hide-arrow"
                                       data-bs-toggle="dropdown"
                                       aria-expanded="false">
                                        <i class="ti ti-dots-vertical"></i>
                                    </a>

                                    <ul class="dropdown-menu dropdown-menu-end m-0">

                                        ${row.TOPLAM_IRS_EDILEN > 0
                                                            ? `<li>
                                                   <a href="javascript:;" class="dropdown-item"
                                                      onclick="TenderFlow.ShipmentOrderManagement.showDocuments('${row.BELGE_NO}')">
                                                       <i class="ti ti-eye me-1"></i> Belgeler
                                                   </a>
                                               </li>`
                                                            : ''
                                                        }

                                        ${row.TOPLAM_IRS_EDILMEYEN > 0
                                                            ? `<li>
                                                   <a href="javascript:;" class="dropdown-item"
                                                      onclick="TenderFlow.ShipmentOrderManagement.createDocument('${row.BELGE_NO}')">
                                                       <i class="ti ti-plus me-1"></i> İrsaliye Oluştur
                                                   </a>
                                               </li>`
                                                            : ''
                                                        }

                                        ${row.TOPLAM_IRS_EDILMEYEN > 0 && row.TOPLAM_IRS_EDILEN > 0 ? `<div class="dropdown-divider"></div>` :''}

                                        <li>
                                            <a href="javascript:;" class="dropdown-item text-danger"
                                               onclick="TenderFlow.ShipmentOrderManagement.deleteShipment('${row.BELGE_NO}', ${row.TOPLAM_IRS_EDILEN})">
                                                <i class="ti ti-trash me-1"></i> Sil
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            `;
                        }
                    }
                ],
                displayLength: 10,
                rowCallback: function (row, data) {

                    $(row).removeClass("table-danger");

                    if (!$("#highlightZeroPrice").is(":checked"))
                        return;

                    if (data.SIFIR_FIYAT_VAR === "E") {
                        $(row).addClass("table-danger");
                    }
                }
            });

            bindGlobalEvents();
        });

        $(document).on("click", ".select-siparis-btn", function () {

            const siparisRaw = $(this).data("siparis");   // "SO123,SO456"
            const siparisList = siparisRaw.split(",").map(x => x.trim());

            if (siparisList.length === 1) {
                const sipNo = siparisList[0];
                window.location.href = `/Shipment/OrderDetails?siparisNo=${sipNo}`;
                return;
            }

            let html = "";
            siparisList.forEach(no => {
                html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${no}
                <button class="btn btn-sm btn-primary openSiparisBtn" data-no="${no}">
                    Aç
                </button>
            </li>`;
            });

            $("#siparisListContainer").html(html);

            $("#siparisSelectModal").modal("show");
        });

        $(document).on("click", ".openSiparisBtn", function () {
            const sipNo = $(this).data("no");

            window.location.href = `/Shipment/OrderDetails?siparisNo=${sipNo}`;
        });
    }

    function bindGlobalEvents() {
        // Group checkbox
        $('#Table tbody').on('change', '.group-checkbox', function () {

            const groupName = $(this).data("group");
            const checked = $(this).is(":checked");

            table.rows().every(function () {
                const rowData = this.data();
                if (rowData.CARI_ADI === groupName) {
                    $(this.node()).find('.row-checkbox').prop('checked', checked);
                }
            });
        });

        // Loading
        table.on('preXhr.dt', () => $("#tableLoading").show());
        table.on('xhr.dt', () => $("#tableLoading").hide());
        table.on('processing.dt', (e, s, p) => $("#tableLoading").toggle(p));

        // Filter buttons
        $("#btnFilter").on("click", () => table.ajax.reload());

        $("#btnClearFilters").on("click", function () {
            $("#startDate, #endDate").val("");
            $("#status").val("0");
            $("#showCompleted, #highlightZeroPrice").prop("checked", false);
            table.ajax.reload();
        });

    }

    function setDefaultDates() {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

        document.getElementById("startDate").value = formatDateLocal(firstDay);
        document.getElementById("endDate").value = formatDateLocal(today);
    }

    function formatDateLocal(date) {
        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0")
        ].join("-");
    }

    function openTemplatePopup() {
        $("#IrsaliyeSablonModal").modal("show");

        $.ajax({
            url: "/Shipment/ShipmentTemplateList",
            type: "POST",
            success: function (list) {

                let html = "";
                list.forEach(item => {
                    html += `
                        <tr>
                            <td>${item.TEMPLATEID}</td>
                            <td>${item.LICENSEPLATEID ?? ""}</td>
                            <td>${item.CARRIERNAME ?? ""}</td>
                            <td>${item.DPERSON1FIRSTNAME ?? ""}</td>
                            <td>${item.CARRIERCITY ?? ""}</td>
                            <td>${item.CARRIERSUBCITY ?? ""}</td>
                            <td>
                                <button class="btn btn-sm btn-primary btnSelectTemplate"
                                    data-plaka="${item.LICENSEPLATEID}"
                                    data-vkn="${item.CARRIERVKN}"
                                    data-adi="${item.CARRIERNAME}"
                                    data-il="${item.CARRIERCITY}"
                                    data-ilce="${item.CARRIERSUBCITY}"
                                    data-ulke="${item.CARRIERCOUNTRY}"
                                    data-posta="${item.CARRIERPOSTAL}"
                                    data-soforad="${item.DPERSON1FIRSTNAME}"
                                    data-soforsoyad="${item.DPERSON1FAMILYNAME}"
                                    data-sofortckn="${item.DPERSON1NID}"
                                    data-dorse1="${item.DORSEPLAKA1}"
                                    data-dorse2="${item.DORSEPLAKA2}">
                                    Seç
                                </button>
                            </td>
                        </tr>
                    `;
                });

                $("#sablonTable tbody").html(html);

                $(document).on("click", ".btnSelectTemplate", function () {

                    $("#plaka").val($(this).data("plaka"));
                    $("#tasiyiciVkn").val($(this).data("vkn"));
                    $("#tasiyiciAdi").val($(this).data("adi"));
                    $("#tasiyiciIl").val($(this).data("il"));
                    $("#tasiyiciIlce").val($(this).data("ilce"));
                    $("#tasiyiciUlke").val($(this).data("ulke"));
                    $("#tasiyiciPostaKodu").val($(this).data("posta"));

                    $("#soforAdi").val($(this).data("soforad"));
                    $("#soforSoyadi").val($(this).data("soforsoyad"));
                    $("#soforTckn").val($(this).data("sofortckn"));

                    $("#dorse1").val($(this).data("dorse1"));
                    $("#dorse2").val($(this).data("dorse2"));

                    $("#IrsaliyeSablonModal").modal("hide");
                });
            }
        });
    }

    function createDocument(documentNumber) {

        $("#EIrsaliyeModal").attr("data-document-number", documentNumber);
        resetEIrsaliyeForm();

        const now = new Date();
        $("#sevkTarihi").val(now.toISOString().slice(0, 16));

        new bootstrap.Modal(document.getElementById('EIrsaliyeModal')).show();

        $("#btnSendEi").off("click").on("click", function () {

            const btn = $(this);
            const originalText = btn.html();

            btn.prop("disabled", true);
            btn.html(`<span class="spinner-border spinner-border-sm me-2"></span> Gönderiliyor...`);

            const payload = {
                documentNumber: $("#EIrsaliyeModal").attr("data-document-number"),
                eWaybillInfo: {
                    SEVKTAR: $("#sevkTarihi").val() || null,
                    PLAKA: $("#plaka").val() || "",
                    TASIYICIVKN: $("#tasiyiciVkn").val() || "",
                    TASIYICIADI: $("#tasiyiciAdi").val() || "",
                    TASIYICIIL: $("#tasiyiciIl").val() || "",
                    TASIYICIILCE: $("#tasiyiciIlce").val() || "",
                    TASIYICIULKE: $("#tasiyiciUlke").val() || "",
                    TASIYICIPOSTAKODU: $("#tasiyiciPostaKodu").val() || "",
                    SOFOR1ADI: $("#soforAdi").val() || "",
                    SOFOR1SOYADI: $("#soforSoyadi").val() || "",
                    SOFOR1TCKN: $("#soforTckn").val() || "",
                    SOFOR1ACIKLAMA: $("#soforAciklama").val() || "",
                    DORSEPLAKA1: $("#dorse1").val() || "",
                    DORSEPLAKA2: $("#dorse2").val() || ""
                }
            };

            $.ajax({
                url: "/Shipment/CreateDocument",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(payload),
                success: function (res) {

                    if (res.success) {
                        showToast("E-İrsaliye başarıyla oluşturuldu", "success");
                        $("#EIrsaliyeModal").modal("hide");
                    } else {
                        showToast(res.errorMessage, "danger");
                    }
                },
                error: function () {
                    showToast("Sunucu hatası oluştu", "danger");
                },
                complete: function () {
                    btn.prop("disabled", false);
                    btn.html(originalText);
                }
            });
        });
    }

    function resetEIrsaliyeForm() {
        $("#EIrsaliyeModal input").val("");
    }

    function showDocuments(shipmentNo) {

        if ($.fn.DataTable.isDataTable('#TableDocument')) {
            $('#TableDocument').DataTable().clear().destroy();
        }

        const modal = new bootstrap.Modal(document.getElementById('DocumentsModal'));

        tableDocument = $("#TableDocument").DataTable({
            language: {
                paginate: TenderFlow.Table.Language.paginate,
                url: 'https://cdn.datatables.net/plug-ins/2.3.2/i18n/tr.json'
            },
            processing: false,
            serverSide: false,
            paging: true,
            dom: 'tp',
            ajax: {
                url: `/Shipment/DocumentList?shipmentNo=${shipmentNo}`,
                type: 'POST',
                contentType: 'application/json',
                dataSrc: ''
            },
            columns: [
                { data: 'BELGE_NO' },
                { data: 'BELGE_TIPI' },
                { data: 'TARIH' },
                { data: 'CARI_KODU' },
                { data: 'CARI_ADI' },
                {
                    data: 'BELGE_NO',
                    render: function (data, type, row) {
                        return `
                            <a href="#" class="btn btn-sm btn-info"
                                onclick="TenderFlow.ShipmentOrderManagement.viewDocumentPopup('${row.RESMI_BELGE_NO}', '${row.BELGE_TIPI}')">
                                <i class="ti ti-eye me-1"></i> Görüntüle
                            </a>
                        `;
                    }
                }
            ],
            displayLength: 10
        });

        modal.show();
    }

    function viewDocumentPopup(documentNumber, documentType) {

        const tick = new Date().getTime();
        const url = `/Shipment/DocumentView?documentNumber=${documentNumber}&documentType=${documentType}&_=${tick}`;

        $("#documentFrame").remove();
        $("#documentFrameContainer").html(`
            <iframe id="documentFrame" style="width:100%; height:78vh; border:0;"></iframe>
        `);

        $("#documentLoading").show();
        $("#documentFrame").attr("src", url);

        $("#documentFrame").on("load", function () {
            $("#documentLoading").hide();
        });

        new bootstrap.Modal(document.getElementById('DocumentViewModal')).show();
    }

    function printDocument() {
        const frame = document.getElementById('documentFrame');
        if (frame && frame.contentWindow) {
            frame.contentWindow.focus();
            frame.contentWindow.print();
        }
    }

    function showToast(message, type = "success") {

        const toastEl = document.getElementById("globalToast");
        const toastMessage = document.getElementById("toastMessage");

        toastEl.classList.remove("bg-success", "bg-danger", "bg-warning", "bg-info");

        toastEl.classList.add({
            success: "bg-success",
            error: "bg-danger",
            danger: "bg-danger",
            warning: "bg-warning"
        }[type] || "bg-info");

        toastMessage.innerText = message;

        new bootstrap.Toast(toastEl, { delay: 3000 }).show();
    }

    function deleteShipment(documentNumber) {

        $("#btnDeleteConfirm").data("documentNumber", documentNumber);
        new bootstrap.Modal(document.getElementById("DeleteConfirmModal")).show();

        $("#btnDeleteConfirm").on("click", function () {

            const documentNumber = $(this).data("documentNumber");

            $.ajax({
                url: "/Shipment/DeleteShipment",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ documentNumber: documentNumber }),
                success: function (res) {
                    $("#DeleteConfirmModal").modal("hide");
                    if (res.success) {
                        showToast("Kayıt başarıyla silindi", "success");
                        table.ajax.reload(null, false);
                    } else {
                        showToast(res.errorMessage, "danger");
                    }
                },
                error: function () {
                    showToast("Silme işleminde hata oluştu", "danger");
                }
            });

        });
    }

    return {
        init,
        openTemplatePopup,
        createDocument,
        showDocuments,
        viewDocumentPopup,
        printDocument,
        deleteShipment
    };
})(jQuery);
