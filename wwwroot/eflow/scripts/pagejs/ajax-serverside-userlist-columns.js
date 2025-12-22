"use strict";

var dotBoxMouseOverDesign = false;

var KTDatatablesDataSourceAjaxServer = function () {

    var initTable1 = function () {
        var table = $('#kt_table_1');

        // begin first table
        table.DataTable({
            deferRender: true,
            serverSide: true,
            responsive: true,
            //"scrollY": false,
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
                url: '/Admin/GetAccountUsers',
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
                    var hasFilter = UserFilter.HasFilterDataAtLocalStorage();

                    if (hasFilter == true) {
                        emptyCell.text(EFlang.noRecordsFound);
                    }
                }
            },
            columns: [
                { data: 'UserName' },
                { data: 'Email' },
                { data: 'Role' },
                { data: 'TaskCount' },
                { data: 'Status' },
                { data: 'Actions' },
            ],
            rowCallback: function (row, data) {
                if (!data.IsActive) {
                    $(row).find(".opacityColumn").css("opacity", "0.5");
                }               
            },
            columnDefs: [
                {
                    targets: 0,
                    orderable: true,
                    render: function (data, type, full, meta) {

                        var editUrl = "/Account/UserWizard?UserId=" + full.USERID + "&isLdapUser=" + full.IsLdapUser + "&isEntraUser=" + full.IsEntraUser + "&isKeycloakUser=" + full.IsKeycloakUser;

                        return "<a id='divUsername_" + full.USERID + "' href='" + editUrl +"'><span class='kt-widget1__number kt-font-brand opacityColumn'>" + full.UserName +"</span></a>";
                    },
                },
                {
                    targets: 1,
                    orderable: true,
                    render: function (data, type, full, meta) {
                        return "<span class='opacityColumn'>" + full.Email + "</span>";
                    },
                },
                {
                    targets: 2,
                    orderable: true,
                    render: function (data, type, full, meta) {
                        
                        var displayLDAP = ""; if (!full.IsLdapUser || full.IsSystemAdmin) { displayLDAP = "display:none;" }
                        var displaySystemAdmin = ""; if (!full.IsSystemAdmin) { displaySystemAdmin = "display:none;" }                     
                        var displayCompanyAdministrator = ""; if (!full.isCompanyAdministrator || full.IsSystemAdmin) { displayCompanyAdministrator = "display:none;" }
                        var displayGroupManager = ""; if (!full.isGroupManager || full.IsSystemAdmin) { displayGroupManager = "display:none;" }
                        var displayDesigner = ""; if (!full.isDesigner || full.IsSystemAdmin) { displayDesigner = "display:none;" }
                        var displaydesignerManager = ""; if (!full.isDesignerManager || full.IsSystemAdmin) { displaydesignerManager = "display:none;" }
                        var displayreportManager = ""; if (!full.isReportManager || full.IsSystemAdmin) { displayreportManager = "display:none;" }
                        return "<div class='row opacityColumn'> <span style='" +
                            displayCompanyAdministrator +
                            "font-size:0.85rem;margin-right: 2px;' class='btn btn-bold btn-label-success'>" +
                            companyAdministratorText +
                            "</span>  <span style='" +
                            displayGroupManager +
                            "font-size:0.85rem;margin-right: 2px;' class='btn btn-bold btn-label-warning' disabled>" +
                            groupManagerText +
                            "</span> <span style='" +
                            displayDesigner +
                            "font-size:0.85rem;margin-right: 2px;' class='btn btn-bold btn-label-danger' disabled>" +
                            designerText +
                            "</span> <span style='" +
                            displaydesignerManager +
                            "font-size:0.85rem;margin-right: 2px;' class='btn btn-bold btn-label-danger' disabled>" +
                            designerManagerText +
                            "</span> <span style='" +
                            displayreportManager +
                            "font-size:0.85rem;margin-right: 2px;' class='btn btn-bold btn-label-warning' disabled>" +
                            reportManagerText +
                            "</span> <span style='" +
                            displaySystemAdmin +
                            "font-size:0.85rem;margin-right: 2px;' class='btn btn-bold btn-label-primary' disabled>" +
                            systemAdminText +
                            "</span> <span style='" +
                            displayLDAP +
                            "font-size:0.85rem;margin-right: 2px;' class='btn btn-bold btn-label-dark'>LDAP</span></div>";

                    },
                },
                {
                    targets: 3,
                    orderable: true,
                    render: function (data, type, full, meta) {
                        return "<span class='kt-widget1__number kt-font-brand opacityColumn' val="+full.TaskCount+">" + full.TaskCount +" <i class='kt-menu__link-icon flaticon2-hourglass-1'></i></span>";
                    },
                },
                {
                    targets: 4,
                    orderable: true,
                    render: function (data, type, full, meta) {

                        if (full.IsActive)
                            return "<span class='btn btn-bold btn-sm btn-font-sm  btn-label-success opacityColumn'>" + ActiveText + "</span>";
                        else
                            return "<span class='btn btn-bold btn-sm btn-font-sm  btn-label-danger opacityColumn'>" + PassiveText + "</span>";
                    },
                },
                {
                    targets: 5,
                    orderable: false,
                    render: function (data, type, full, meta) {

                        var usernameDivId = "#divUsername_" + full.USERID;
                        var editUrl = "/Account/UserWizard?UserId=" + full.USERID + "&isLdapUser=" + full.IsLdapUser + "&isEntraUser=" + full.IsEntraUser + "&isKeycloakUser=" + full.IsKeycloakUser;
                        var disableUserDelete = ""; if (full.IsSystemAdmin || full.TaskCount > 0) { disableUserDelete = "disabled" }                      
                        var hideActive = ""; if (full.IsActive) { hideActive = "display:none;" }
                        var hidePassive = ""; if (!full.IsActive) { hidePassive = "display:none;" }
                        var hideTrans = ""; if (showTransferLink === 'True') { hideTrans = "display:none;" }
                     
                        $(usernameDivId).attr("href", editUrl);

                        var dotBoxMouseOverDesignStyle = "";
                        if (dotBoxMouseOverDesign) { dotBoxMouseOverDesignStyle = "visibility:hidden;" }

                        return "<div class='dropdown dropdown-inline kt-showHide' style='" +
                            dotBoxMouseOverDesignStyle +
                            " float:right; margin-right:30px;'> <button type='button' class='btn btn-sm btn-clean btn-icon btn-icon-md' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'> <i class='flaticon-more-1'></i></button> <div data-userid='" +
                            full.USERID + "' data-username='" +
                            full.UserName +
                            "' class='dropdown-menu dropdown-menu-right'> <a href='#TaskTransferToUserNonDelete' data-toggle='modal' class ='dropdown-item transfertasksrow' style= '" +
                            hideTrans +
                            "'><i class ='la la-refresh'></i> " +
                            reAssignTaskText +
                            "</a> <a class='dropdown-item' href='" +
                            editUrl +
                            "'  ><i class='la la-edit'></i> " +
                            editText +
                            "</a> <a class='dropdown-item' href='/Account/ResetPassword?USERID=" +
                            full.USERID +
                            "'><i class='la la-lock'></i> " +
                            resetPasswordText +
                            "</a> <a style='" + hidePassive +
                            "' href='#deactivateuser' class='dropdown-item deactivaterow' data-toggle='modal'><i class='la la-clock-o'></i> " +
                            PassiveText + "</a> <a style='" +
                            hideActive +
                            "' href='#activateuser' class='dropdown-item activaterow' data-toggle='modal'><i class='la la-clock-o'></i> " +
                            ActiveText +
                            "</a> <a data-isRemovable='" + !full.IsSystemAdmin +
                            "' href='#deleteuser' class='dropdown-item deleterow " +
                            disableUserDelete +
                            "' data-toggle='modal' ><i style='margin-top: -1px;' class='la la-trash-o'></i>" +
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

    $("#txtGeneralSearch").on('keypress', function (e) {
        if (e.which == 13 || e.keyCode == 13) {
            $('#kt_table_1').dataTable().fnFilter(this.value);
        }
    });

    $("#txtGeneralSearch").on('keyup', function (e) {

        if (this.value == '') {
            $('#kt_table_1').dataTable().fnFilter(this.value);
        }
    });

    $('#SelectedStatusId').bind('change', function (e) {
        $('#kt_table_1').dataTable().fnFilter('Status_' + this.value);
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

    if (UserFilter.HasFilterDataAtLocalStorage()) {

        if (UserFilter.HasReturnResultAtLocalStorage()) {

            UserFilter.SendFilterTextToDatatablesNet("uids_" + UserFilter.GetReturnResultFromStorage());
        }
        else {
            $('#kt_table_1').dataTable().fnFilter('$');
        }
    }
});

function TogglerUserItemClick(id) {
    $("#kt_table_1_processing").css("display", "block");
    $.ajax({
        type: 'GET',
        dataType: "html",
        cache: false,
        data: {
            Id: id
        },
        url: '/Admin/UserLicense',
        success: function (data) {

            $('#detailPanelPartial').html(data);
            $("#kt_quick_panel_toggler_btn").click();
            $("#kt_table_1_processing").css("display", "none");
        },
        fail: function (xhr, textStatus, errorThrown) {
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
            $("#kt_table_1_processing").css("display", "none");
        }
    });    
}
