"use strict";

var dotBoxMouseOverDesign = false;

var KTDatatablesDataSourceAjaxServer = function () {

    var table;
    var initTable1 = function () {
        table = $('#kt_table_1');

        // begin first table
        table.DataTable({
            deferRender: true,
            "initComplete": function (settings, json) {
                if (settings._iDisplayLength == -1
                    || settings._iDisplayLength >= settings.fnRecordsDisplay()) {
                    jQuery(settings.nTableWrapper).find('.dataTables_paginate').hide();
                } else {
                    jQuery(settings.nTableWrapper).find('.dataTables_paginate').show();
                }
            },
            "bStateSave": true,
            "fnStateSave": function (oSettings, oData) {
                localStorage.setItem('kt_table_1s', JSON.stringify(oData));
            },
            "fnStateLoad": function (oSettings) {
                return JSON.parse(localStorage.getItem('kt_table_1s'));
            },

            serverSide: true,
            responsive: true,
            //"scrollY": true,
            //Paging
            processing: true,
            paging: true,
            pageLength: 20,
            //bSort: false,
            cache: true,
            "language": {
                "url": "/assets/theme/default/dist/default/crud/datatables/localization/" +
                    EFlang.localeCode + ".json"
            },
            destroy: true,
            searchDelay: 500,
            ajax: {
                contentType: "application/json",
                url: '/Search/GetSearchResultsList',
                headers: { '__RequestVerificationToken': getAntiForgeryTokenId() },
                data: { "searchModel": JSON.stringify(searchmodel) },
                type: "GET",
                cache: false,
                error: function (err) {
                    console.log(err);
                }
            },
            order: [[3, 'desc']],
            columns: [
                { data: 'CheckBox' },
                { data: 'ProcessName' },
                { data: 'Instance' },
                { data: 'StartDate' },
                { data: 'CompletedDate' },
                { data: 'Actions' },
            ],

            columnDefs: [
                {
                    targets: 0,
                    orderable: false,
                    render: function (data, type, full, meta) {

                        var styleHidden = ""; if (hasAccess == 'False') { styleHidden = "display:none;"; }

                        return "<label style='" + styleHidden + "' class='kt-checkbox kt-checkbox--bold kt-checkbox--brand'><input id='" + full.CIID + "' type='checkbox'> &nbsp;<span></span></label>";
                    },
                },
                {
                    targets: 1,
                    orderable: true,
                    render: function (data, type, full, meta) {

                        return "<a href='/Search/Detail?CIID=" + full.CIID + "'><span style='overflow-wrap: anywhere' class='kt-widget1__number kt-font-brand opacityColumn'>&nbsp;&nbsp" + full.ProcessName + "</span></a>"
                    },
                },
                {
                    targets: 2,
                    orderable: true,
                    render: function (data, type, full, meta) {
                        return "<p style='white-space: pre-line; overflow-wrap: anywhere'>"+full.Instance+"</p>";
                    },
                },
                {
                    targets: 3,
                    orderable: true,
                    render: function (data, type, full, meta) {

                        var startedDate = moment(full.Started).format(DateFormat);

                        return '&nbsp;&nbsp;' + startedDate;
                    },
                },
                {
                    targets: 4,
                    orderable: true,
                    render: function (data, type, full, meta) {

                        if (full.Status == "CANCELED") {
                            return '&nbsp;&nbsp;<span class="btn btn-bold btn-sm btn-font-sm  btn-label-danger opacityColumn">' + "İPTAL" + '</span>';
                        }
                        else {
                            var complatedDate = moment(full.Completed).format(DateFormat);
                            if (complatedDate.includes('0001')) {
                                complatedDate
                                return '&nbsp;&nbsp;<span class="btn btn-bold btn-sm btn-font-sm  btn-label-success opacityColumn">' + ActiveProcess + '</span>';
                            }

                            return '&nbsp;&nbsp;' + complatedDate;
                        }
                    },
                },
                {
                    targets: 5,
                    orderable: false,
                    render: function (data, type, full, meta) {

                        var dotBoxMouseOverDesignStyle = "";
                        if (dotBoxMouseOverDesign) { dotBoxMouseOverDesignStyle = "visibility:hidden;" }

                        return "<div class='dropdown dropdown-inline kt-showHide' style='" +
                            dotBoxMouseOverDesignStyle +
                            " float:right; margin-right:30px;'> <button type='button' class='btn btn-sm btn-clean btn-icon btn-icon-md' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'> <i class='flaticon-more-1'></i></button><div data-id='" +
                            full.CIID + "' data-datasource='" +
                            full.ProcessName +
                            "' class='dropdown-menu dropdown-menu-right'> <a class='dropdown-item' href='/Search/Detail?CIID=" +
                            full.CIID +
                            "'><i class='la la-edit'></i> " +
                            DetailText + "</a></div></div>";
                    },
                },
            ],
        });
    };

    (function ($) {
        $.fn.invisible = function () {
            return this.each(function () {
                $(this).css("visibility", "hidden");
            });
        };
        $.fn.visible = function () {
            return this.each(function () {
                $(this).css("visibility", "visible");
            });
        };
    }(jQuery));

    $('#kt_table_1').on('click', 'tbody td, thead th:first-child', function (e) {
        var selectedRow = $(this).closest('tr');
        var checkbox = selectedRow.find('[type=checkbox]');
        if (checkbox[0].checked) { selectedRow.css("background-color", "aliceblue"); }
        else { selectedRow.css("background-color", ""); }

        ShowDeleteItems();

    });

    $('#kt_table_1').on('mouseover', 'tbody .odd, tbody .even', function (e) {

        if (dotBoxMouseOverDesign) {
            $(this).find('.kt-showHide').visible();
        }
    });

    $('#kt_table_1').on('mouseout', 'tbody .odd, tbody .even', function (e) {

        if (dotBoxMouseOverDesign) {
            $(this).find('.kt-showHide').invisible();
        }
    });

    $("#txtGeneralSearch").on('keyup', function () {
        $('#kt_table_1').dataTable().fnFilter(this.value);
    });

    $('#selectAll').click(function (e) {
        var table = $(e.target).closest('table');
        $('td input:checkbox', table).prop('checked', this.checked);
        if (this.checked) { $('tr').css("background-color", "aliceblue"); }
        else { $('tr').css("background-color", ""); }
    });

    return {

        //main function to initiate the module
        init: function () {
            initTable1();
        },

    };

}();

jQuery(document).ready(function () {
    KTDatatablesDataSourceAjaxServer.init();
});

function GetSelectedCheckboxes() {

    var checkedItems = [];

    $('#kt_table_1').find('input[type="checkbox"]:checked').each(function () {
        if (this.id != "selectAll") {
            checkedItems.push(this.id);
        }
    });

    return checkedItems;
}

function ShowDeleteItems() {
    if (($('#kt_table_1').find('input[type="checkbox"]:checked').length) > 0)
        $(".deleteCheckItems").show();
    else
        $(".deleteCheckItems").hide();
}
