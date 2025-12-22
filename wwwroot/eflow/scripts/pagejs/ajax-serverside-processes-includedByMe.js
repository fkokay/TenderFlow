"use strict";
var KTDatatablesDataSourceAjaxServerIbm = function () {

    $('#divSelectedUserView').hide();

    var initTableIbm = function () {

        var table = $('#kt_table_3');

        function add3Dots(string, limit) {
            var dots = "...";
            if (string.length > limit) {
                string = string.substring(0, limit) + dots;
            }
            return string;
        }

        // begin first table
        table.DataTable({

            deferRender: true,

            "initComplete": function (settings, json) {
                $("#btnAllProcesses").removeClass("disablePointer");
            },

            serverSide: true,
            responsive: true,

            //Paging
            processing: true,
            paging: true,
            cache: true,

            "language": {
                "url": "/assets/theme/default/dist/default/crud/datatables/localization/" +
                    EFlang.localeCode + ".json"
            },
            destroy: true,
            searchDelay: 500,
            ajax: {
                contentType: "application/json",
                url: '/Partials/ProcessDataByType?type=2',
                data: {
                    filterVal: dashFilterVal
                },
                type: "GET",
                cache: false,
                error: function (err) {
                    console.log(err);
                }
            },
            drawCallback: function (settings) {
                if (settings._iDisplayLength == -1
                    || settings._iDisplayLength >= settings.fnRecordsDisplay()) {
                    jQuery(settings.nTableWrapper).find('.dataTables_paginate').hide();

                } else {
                    jQuery(settings.nTableWrapper).find('.dataTables_paginate').show();
                }

                if (settings.fnRecordsDisplay() === 0) {

                    var emptyCell = $('.dataTables_empty');
                    var hasFilter = NetolojiFilter.HasFilterDataAtLocalStorage();

                    if (!emptyCell.find('#cleanFilterBtn').length && hasFilter == true) {
                        //emptyCell.append(` <button onclick="NetolojiFilter.SelectSpesificProcesses()" id="cleanFilterBtn" class="btn btn-sm btn-clean btn-bold">${cleanFilter}</button>`);
                        emptyCell.text(EFlang.noRecordsFound);
                    }
                }
            },
            columns: [
                { data: "Actions", name: "Actions", autoWidth: true }
            ],
            columnDefs: [
                {
                    targets: -1,
                    orderable: false,
                    render: function (data, type, full, meta) {

                        if (full.BackColor == "FFFFFF") {
                            full.BackColor = "A9A9A9";
                        }

                        var displayInstanceTitle = "";
                        if (full.Instance == "") {
                            displayInstanceTitle = "display:none;"
                        }

                        var instanceTitle = add3Dots(full.Instance, 1000).trim();

                        return "<div class='row' style='margin-bottom: -29px !important;'> <div class='col-lg-12'> <div style='min-height: 60px !important; box-shadow: 0px 1px 15px 1px rgba(69, 65, 78, 0.1);' class='kt-portlet kt-portlet--collapsed' data-ktportlet='true' id='kt_portlet_tools_" +
                            full.CIID +
                            "'> <div class='kt-portlet__head' style='border-bottom:unset !important; min-height: unset !important; padding-top: 13px;'> <div class='kt-portlet__head-label'> <h3 class='kt-portlet__head-title'> " +
                            full.CourseName +
                            "</h3> </div><div class='kt-portlet__head-toolbar'><div class='kt-portlet__head-group head_group_process'><div style='float: left;margin-top: 7px;font-size: 12px;padding-left: 5px;'> <span style='padding-right: 10px; padding-left: 10px;'>" +
                            full.CreatedDate +
                            "</span>  <a href='/Search/Detail?CIID=" + full.CIID + "' target='_blank' title='" + processStatus+"' style='margin-right:5px;height: 1.9rem !important; width: 1.9rem !important;' class='btn btn-sm btn-icon btn-warning btn-icon-md'><i class='la la-link'></i></a>" +
                            "<a style='height: 1.9rem !important; width: 1.9rem !important; margin-bottom: 1px;' onclick='CollapseClick(\"#kt_portlet_tools_" +
                            full.CIID +
                            "\",2)' href='javascript:;' data-ktportlet-tool='toggle' class='btn btn-sm btn-icon btn-brand btn-icon-md'><i class='la la-angle-down'></i></a> </div></div></div></div> <span class='kt-font-brand' style='" + displayInstanceTitle + "font-size: 12px;margin-left: 25px; margin-right: 60px; margin-top: 5px; overflow-wrap: anywhere; margin-bottom: 18px; font-weight: 500;'> " +
                            instanceTitle +
                            " </span>  <div class='col-lg-12 loadingDiv_" +
                            full.CIID +
                            "' style='display:none;'> <div style='margin: auto;width: 20px;height: 20px;position: absolute; top: -40px;bottom: 20px;left: 0;right: 0' class='kt-spinner kt-spinner--v2 kt-spinner--md kt-spinner--info'></div> </div><div data-ciid='" +
                            full.CIID +
                            "' class='kt-portlet-datawrap kt-portlet__body' id='kt_portlet_body_" +
                            full.CIID +
                            "'></div></div></div></div> ";
                    },
                },
            ],
        });

        $('#kt_table_3').on('error.dt', function (e, settings, techNote, message) {
            console.log('An error has been reported by DataTables: ', message);
        });

        $("#txtGeneralSearch").on('keypress', function (e) {
            if (e.which == 13 || e.keyCode == 13) {
                $('#kt_table_3').dataTable().fnFilter(this.value);
            }          
        });

        $('#SelectedProcessOrderID').bind('change', function (e) {
            var sortFilterText = this.value;
            var cid = window.SCID;

            localStorage.removeItem("_selectedProcessOrderID_ibm");
            localStorage.setItem("_selectedProcessOrderID_ibm", sortFilterText);

            var ciidResult = NetolojiFilter.GetReturnResultFromStorage();

            if (ciidResult) {
                sortFilterText += "|" + "ciids_" + ciidResult;
            }
            if (cid && !ciidResult) {
                sortFilterText += "|" + "cids_" + cid;
            }

            if (ciidResult = '' && cid == 0) {
                NetolojiFilter.ClearAllFilter();
            }

            $('#kt_table_3').dataTable().fnFilter(sortFilterText);
        });

    };

    return {

        init: function () {
            initTableIbm();
        },

    };

}();

jQuery(document).ready(function () {

    KTDatatablesDataSourceAjaxServerIbm.init();

    if (NetolojiFilter.HasFilterDataAtLocalStorage()) {

        if (NetolojiFilter.HasReturnResultAtLocalStorage()) {

            NetolojiFilter.SendFilterTextToDatatablesNet("ciids_" + NetolojiFilter.GetReturnResultFromStorage());
        }
        else {

            $('#kt_table_3').dataTable().fnFilter('$');
        }
    }
    else {
        var retrievedObject = localStorage.getItem("_selectedProcessOrderID_ibm");

        if (retrievedObject) {
            $('#SelectedProcessOrderID').val(retrievedObject).trigger('change');
        }
    }
});