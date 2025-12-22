"use strict";

var KTDatatablesDataSourceAjaxServerGrp = function () {

    var initTableGrp = function () {

        var table = $('#kt_table_4');

        // begin first table
        table.DataTable({

            deferRender: true,

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
                url: '/Admin/GetGroupsList',
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
                    var hasFilter = GroupFilter.HasFilterDataAtLocalStorage();

                    if (hasFilter == true) {
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
                      
                        var toggleText = 'fa-toggle-off';
                        var activeButtonHtml = '<span class="btn btn-bold btn-sm btn-font-sm  btn-label-danger opacityColumn" style="opacity: 0.5;">' + PassiveText + '</span>';

                        if (full.IsActive == true) {
                            toggleText = 'fa-toggle-on';
                            activeButtonHtml = '<span class="btn btn-bold btn-sm btn-font-sm  btn-label-success opacityColumn">' + ActiveText + '</span>';
                        }

                        return "<div class='row'><div class='col-lg-12'> <div style='box-shadow: 0px 1px 15px 1px rgba(69, 65, 78, 0.1);' class='kt-portlet kt-portlet--collapsed' data-ktportlet='true' id='kt_portlet_tools_" +
                            full.GID +
                            "'> <div class='kt-portlet__head'><div class='kt-portlet__head-label' style='cursor:pointer;'><h3 class='kt-portlet__head-title'> <span id='titleText' style='display:inline-block;color: #464457;' class='kt-widget5__title' onclick='TogglerGroupItemClick(" +
                            full.GID + ")'>" + full.GroupName +
                            "</span> </h3></div><div class='kt-portlet__head-toolbar' data-isactive='" + full.IsActive +
                            "' data-id='" +
                            full.GID + "' data-group='" + full.GroupName +
                            "'> <a href='#isactivegroup' class='isactiverow' data-toggle='modal'><i class='fa " + toggleText +
                            " kt-showHide' style='font-size:15px;margin-right:20px;visibility:hidden;cursor:pointer;margin-top: 8px;'></i></a> <a href='#deletegroup' class='deleterow' data-toggle='modal'><i class='fa fa-trash-alt kt-showHide' style='font-size:15px;color:hotpink;margin-right:20px;visibility:hidden;cursor:pointer;margin-top: 8px;'></i></a> <div class='kt-portlet__head-group'><div style='float: left;margin-right: 20px;margin-top: 7px;font-size: 12px;'> <span class='kt-widget1__number kt-font-brand'>" +
                            full.MemberCount +
                            " <i class='kt-menu__link-icon fa fa-user'></i></span> </div> " + activeButtonHtml+" </div></div></div><div class='col-lg-12 loadingDiv_" +
                            full.GID +
                            "' style='display:none;'> <div style='margin: auto;width: 20px;height: 20px;position: absolute; top: -40px;bottom: 20px;left: 0;right: 0' class='kt-spinner kt-spinner--v2 kt-spinner--md kt-spinner--info spinnerDiv'></div> </div><div data-gid='" +
                            full.GID +
                            "' class='kt-portlet__body' id='kt_portlet_body_" +
                            full.GID +
                            "'></div></div></div></div>";
                    },
                },
            ],
        });

        $('#kt_table_4').on('error.dt', function (e, settings, techNote, message) {
            console.log('An error has been reported by DataTables: ', message);
        });

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

        $('#kt_table_4').on('mouseover', 'tbody .odd, tbody .even', function (e) {
            $(this).find('.kt-showHide').visible();
        });

        $('#kt_table_4').on('mouseout', 'tbody .odd, tbody .even', function (e) {
            $(this).find('.kt-showHide').invisible();
        });

        $("#txtGeneralSearch").on('keypress', function (e) {
            if (e.which == 13 || e.keyCode == 13) {
                $('#kt_table_4').dataTable().fnFilter(this.value);
            }
        });

        $("#txtGeneralSearch").on('keyup', function (e) {

            if (this.value == '') {
                $('#kt_table_4').dataTable().fnFilter(this.value);
            }
        });
    };

    return {

        init: function () {
            initTableGrp();
        },

    };

}();

jQuery(document).ready(function () {

    KTDatatablesDataSourceAjaxServerGrp.init();

    if (GroupFilter.HasFilterDataAtLocalStorage()) {

        if (GroupFilter.HasReturnResultAtLocalStorage()) {

            GroupFilter.SendFilterTextToDatatablesNet("gids_" + GroupFilter.GetReturnResultFromStorage());
        }
        else {
            $('#kt_table_4').dataTable().fnFilter('$');
        }
    }
});

function TogglerGroupItemClick(id) {
    $.ajax({
        type: 'GET',
        dataType: "html",
        cache: false,
        data: {
            GID: id
        },
        url: '/Group/AddGroupMetronic',
        success: function (data) {

            $('.membermultiselect').val(null).trigger('change');

            var has = data.indexOf("DOCTYPE");
            if (has > -1) {
                window.location.href = "/Account/Login";
            }
            
            $('#detailPanelPartial').html(data);
            $("#kt_quick_panel_toggler_btn").click();
        },
        fail: function (xhr, textStatus, errorThrown) {
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}