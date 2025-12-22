"use strict";

var dotBoxMouseOverDesign = false;

var KTDatatablesDataSourceAjaxServer = function () {

    var initTable1 = function () {
        var table = $('#kt_table_1');

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
            serverSide: true,
            responsive: true,
            //"scrollY": true,
            //Paging
            processing: true,
            paging: true,
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
                url: '/Admin/GetDataSourcesList',
                type: "GET",
                cache: false,
                error: function (err) {
                    console.log(err);
                }
            },
            columns: [
                { data: 'Description' },
                { data: 'Driver' },
                { data: 'Server' },
                { data: 'TestDriver' },
                { data: 'TestServer' },
                { data: 'Actions' },
            ],
            rowCallback: function (row, data) {

            },
            columnDefs: [
                {
                    targets: 0,
                    orderable: true,
                    render: function (data, type, full, meta) {
                        return "<a id='dtsDescription_" + full.DBID + "' href='javascript:;'><span class='kt-widget1__number kt-font-brand opacityColumn'>&nbsp;&nbsp;" + full.Description + "</span></a>"
                    },
                },
                {
                    targets: 1,
                    orderable: true,
                    render: function (data, type, full, meta) {
                        return '&nbsp;&nbsp;' + full.Driver;
                    },
                },
                {
                    targets: 2,
                    orderable: true,
                    render: function (data, type, full, meta) {
                        return '&nbsp;&nbsp;' + full.Server;
                    },
                },
                {
                    targets: 3,
                    orderable: true,
                    render: function (data, type, full, meta) {
                        return '&nbsp;&nbsp;' + full.TestDriver;
                    },
                },
                {
                    targets: 4,
                    orderable: true,
                    render: function (data, type, full, meta) {

                        return '&nbsp;&nbsp;' + full.TestServer;
                    },
                },
                {
                    targets: 5,
                    orderable: false,
                    render: function (data, type, full, meta) {

                        var editUrl = "/Admin/AddDataSource?DBID=" + full.DBID;
                        var descriptionDivId = "#dtsDescription_" + full.DBID;
                        $(descriptionDivId).attr("href", editUrl);

                        var dotBoxMouseOverDesignStyle = "";
                        if (dotBoxMouseOverDesign) { dotBoxMouseOverDesignStyle = "visibility:hidden;" }

                        return "<div class='dropdown dropdown-inline kt-showHide' style='" +
                            dotBoxMouseOverDesignStyle +
                            " float:right; margin-right:30px;'> <button type='button' class='btn btn-sm btn-clean btn-icon btn-icon-md' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'> <i class='flaticon-more-1'></i></button> <div data-id='" +
                            full.DBID + "' data-datasource='" +
                            full.Description +
                            "' class='dropdown-menu dropdown-menu-right'> <a class='dropdown-item' href='" +
                            editUrl +
                            "'  ><i class='la la-edit'></i> " +
                            EditText +
                            "</a> <a href='#deletesource' class='dropdown-item deleterow' data-toggle='modal' ><i style='margin-top: -1px;' class='la la-trash-o'></i>" +
                            DeleteText + "</a> </div></div>";
                       
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