"use strict";

var AssignedToVal = 0;
var SCID = 0;
var StatusVal = '';

var KTDatatablesDataSourceAjaxServer = function () {
    $('#divSelectedUserView').show();

    var initTable1 = function () {

        var table = $('#kt_table_1');
        var oldStart = 0;

        // begin first table
        table.DataTable({

            pageLength: pageSize,
            deferRender: true,
            "preDrawCallback": function (settings) {
                //Need to edit filter structure for integrate with filter parameters.
                if (NetolojiFilter.HasFilterDataAtLocalStorage() == true) {
                    $("#btnSpesificAssign").prop('disabled', true);
                    $("#btnSpesificAssign").html(EFlang.FilterAssigned + EFlang.FilterAllAssigned);
                    $("#btnSpesificAssign").prop('title', EFlang.FilterAllAssignedBtnHover);

                } else {
                    $("#btnSpesificAssign").prop('disabled', false);
                }
                var isRefreshed = window.isRefreshed != undefined && window.isRefreshed != 'undefined' ? window.isRefreshed : "true";
                if (isRefreshed == "true") {
                    $("#kt_table_1").hide();
                    $(".task-item-loading-container").show();
                    $(".task-item-loading-container").closest(".kt-grid.kt-grid--hor.kt-grid--root").addClass("overflow-hidden-grid");
                }
            },
            "initComplete": function (settings, json) {

                $("#btnAllProcesses").removeClass("disablePointer");
                NetolojiFilter.BindStoredBaseFilter();
                $(this).find('.kt-showHide').hide();
                var isRefreshed = window.isRefreshed != undefined && window.isRefreshed != 'undefined' ? window.isRefreshed : "true";
                if (isRefreshed == "true") {
                    $(".task-item-loading-container").hide();
                    $(".task-item-loading-container").closest(".kt-grid.kt-grid--hor.kt-grid--root").removeClass("overflow-hidden-grid");
                    $("#kt_table_1").show();
                }
                
            },
            "fnDrawCallback": function (o) {

                if (o._iDisplayStart != oldStart) {
                    $(window).scrollTop(0);
                    oldStart = o._iDisplayStart;
                }
                $(this).find('.kt-showHide').hide();
                var isRefreshed = window.isRefreshed != undefined && window.isRefreshed != 'undefined' ? window.isRefreshed : "true";
                if (isRefreshed == "true") {
                    $(".task-item-loading-container").hide();
                    $(".task-item-loading-container").closest(".kt-grid.kt-grid--hor.kt-grid--root").removeClass("overflow-hidden-grid");
                    $("#kt_table_1").show();
                }

                if (o._iDisplayLength == -1
                    || o._iDisplayLength >= o.fnRecordsDisplay()) {
                    jQuery(o.nTableWrapper).find('.dataTables_paginate').hide();

                } else {
                    jQuery(o.nTableWrapper).find('.dataTables_paginate').show();
                }

                if (o.fnRecordsDisplay() === 0) {

                    var emptyCell = $('.dataTables_empty');
                    var hasFilter = NetolojiFilter.HasFilterDataAtLocalStorage();

                    if (!emptyCell.find('#cleanFilterBtn').length && hasFilter == true) {
                        //emptyCell.append(` <button onclick="NetolojiFilter.SelectSpesificProcesses()" id="cleanFilterBtn" class="btn btn-sm btn-clean btn-bold">${cleanFilter}</button>`);
                        emptyCell.text(EFlang.noRecordsFound);
                    }
                }
            },
            serverSide: true,
            responsive: true,

            //Paging
            processing: false,
            paging: true,
            cache: true,

            "language": {
                "url": "/assets/theme/default/dist/default/crud/datatables/localization/" +
                    EFlang.localeCode + ".json"
            },
            destroy: true,
            searchDelay: 500,
            ajax: {
                url: '/Task/GetTaskList',
                type: "POST",
                data: {
                    "AssignedTo": AssignedToVal,
                    "Status": StatusVal,
                    "CID": SCID
                },
                cache: false,
                error: function (err) {
                    console.log(err);
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

                        var displayStatus = "";
                        if (full.Status == "") {
                            displayStatus = "display:none;"
                        }

                        if (full.Status != "") {
                            var win_widths = $(window).width();
                            if (win_widths <= 700) { if (full.Status.length > 10) { full.Status = full.Status.substring(0, 10) + '..'; } }
                            else if (win_widths > 700 && win_widths <= 1200) { if (full.Status.length > 30) { full.Status = full.Status.substring(0, 30) + '..'; } }
                            else if (win_widths > 1200 && win_widths <= 1500) { if (full.Status.length > 40) { full.Status = full.Status.substring(0, 40) + '..'; } }
                            else if (win_widths > 1500) { if (full.Status.length > 60) { full.Status = full.Status.substring(0, 55) + '..'; } }
                        }
                        var displayPriority = "";
                        if (full.Priority == "") {
                            displayPriority = "display:none;"
                        }
                        if (full.Priority != "") {
                            var win_width = $(window).width();
                            if (win_width <= 700) { if (full.Priority.length > 10) { full.Priority = full.Priority.substring(0, 10) + '..'; } }
                            else if (win_width > 700 && win_width <= 1200) { if (full.Priority.length > 25) { full.Priority = full.Priority.substring(0, 25) + '..'; } }
                            else if (win_width > 1200) { if (full.Priority.length > 55) { full.Priority = full.Priority.substring(0, 55) + '..'; } }
                        }
                        var dueDate = full.DueDateStr;
                        var taskAssigned = full.TaskAssignedStr;

                        var dateSep = full.DateFormatSeperator;

                        if (dateSep == "/") {
                            dueDate = dueDate.replace(/[.\s]/g, "/");
                            taskAssigned = taskAssigned.replace(/[.\s]/g, "/");
                        }

                        var subjectText = full.Subject;
                        if (subjectText == "") { subjectText = "&nbsp; "; }

                        //if (subjectText.length > 255) {
                        //    subjectText = (subjectText).substring(0, 255);
                        //}

                        var buttons = "";
                        var displayButtons = "";
                        if (full.TaskButtons) {
                            if (full.TaskButtons.length > 0) {
                                $.each(full.TaskButtons, function (index, item) {
                                    buttons += "<li class='pad'><a class='dropdown-item TaskActionIn' style='background:" + item.BackGround + "; color:" + item.TextColor + ";' name='TaskActionIn' id='" + item.ButtonID + "' targetId='" + item.TargetActID + "' data-tiid=" + full.TIID + " value='" + item.ButtonID + "' data-initialdelay=" + item.InitialDelay + " href='javascript:void(0)'>" + item.ButtonName + "</a></li>";
                                });
                            }

                            if (full.TaskButtons.length === 0) {
                                displayButtons = "display:none;";
                            }
                        } else {
                            displayButtons = "display:none;";

                        }

                        var titleSectionText = (full.ProcessName + " - " + full.Title);

                        var win_width = $(window).width();
                        var maxWidth = "";

                        var disableItem = "";
                        var hideItem = "";
                        if (full.UserCanWork == false) {
                            disableItem = "disabled";
                            hideItem = "display:none;";
                        }
                 
                        if (win_widths <= 700) { maxWidth = full.Priority.length + full.Status.length>80 ? "max-width: 1000px;" :  ""}
                        else if (win_widths > 700 && win_widths <= 1200) { maxWidth="max-width: 1100px;" }
                        else if (win_widths > 1200 && win_widths <= 1500) { maxWidth = "max-width: 1100px;" }
                        else if (win_widths > 1500 && win_widths <= 1900) { maxWidth = full.Priority.length + full.Status.length > 80 ? "max-width: 800px;" : "max-width: 1100px;" }
                        else { maxWidth = full.Priority.length + full.Status.length > 80 ? "max-width: 1200px;" : "max-width: 1500px;" }

                        return "<div id='kt-datarow_" + full.TIID + "' class='task-listing' style='border-left-color:#" + full.BackColor + ";'>" +

                            "<div class='task-user-img-wrap'>" +
                            (
                            full.InitiatedProfileImage && full.InitiatedProfileImage !== ""
                                ? "<img src='/Upload/ProfileImages/" + full.InitiatedProfileImage + "' alt='profile' />"
                                : (function () {
                                    var name = (full.InitiatedBy || "").trim();
                                    if (!name) return "";
                                    var parts = name.split(" ");
                                    var initials = parts.map(p => p[0].toUpperCase()).join("");
                                    return "<span>" + initials + "</span>";
                                })()
                            ) +
                            "</div>" +

                            "<div class='d-flex flex-grow-1 flex-column'>" +

                            /* ROW1 */
                            "<div class='row1 task-list-r'>" +
                            "<div class='left'>" +
                            "<h5 style='overflow-wrap: anywhere;'>" + titleSectionText + "</h5>" +
                            "</div>" +
                            "<div class='right'>" +
                            "<div class='mb05' style='display:flex!important;'>" +
                            "<span class='kt-font-info kt-infos kt-status' style='margin-right:3px;'>" + full.Status + "</span>" +
                            "<span class='priority' style='text-align:justify;'>" + full.Priority + "</span>" +
                            "</div>" +
                            "</div>" +
                            "</div>" +

                            /* ROW2 */
                            "<div class='row2'>" +
                            "<div onclick='TogglerTaskPeekClick(" + full.TIID + ")' class='leftside-2'>" +
                            "<div class='mb05'>" +
                            "<span class='task-description' style='min-width:600px;overflow-wrap:anywhere;" + maxWidth + "'>" +
                            subjectText +
                            "</span>" +
                            "</div>" +
                            "</div>" +
                            "<div class='right-side-2'>" +
                            "<div class='mb05 kt-showHide'>" +
                            "<div class='btn-group dropleft'>" +
                            "<button type='button' style='" + hideItem + "' class='btn btn-icon more btn-sm dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                            "<i class='flaticon-more'></i>" +
                            "</button>" +
                            "<div class='ropdown-menu dropdown-menu-sm'>" +
                            "<ul class='dropdown-menu tmp' style='right:12px!important;border-radius:0;'>" + buttons + "</ul>" +
                            "</div>" +
                            "</div>" +
                            "<button type='button' class='btn btn-primary btn-sm' id='DivTaskWorkItem_" + full.TIID + "' onclick='TaskWorkClick(" + full.TIID + ",true)' bgc='" + full.BackColor + "' style='background-color:#" + full.BackColor + " !important; border-color:#" + full.BackColor + " !important;' ucw='" + full.UserCanWork + "' " + disableItem + ">" +
                            "<i class='flaticon2-arrow'></i> " + workText +
                            "</button>" +
                            "</div>" +
                            "</div>" +
                            "</div>" +

                            /* ROW3 */
                            "<div class='row3 task-list-r'>" +
                            "<div>" +
                            "<div class='kt-widget5__info leftside-3'>" +
                            "<span>" + initiatedByText + " : </span><span class='kt-font-info'>" + full.InitiatedBy + " &nbsp;</span>" +
                            "<span>" + assignedToText + " : </span><span class='kt-font-info'>" + full.AssignedTo + "</span>" +
                            "</div>" +
                            "</div>" +
                            "<div class='right-side-3'>" +
                            "<div><span>" + taskAssigned + ' <i class="dateflow-right-arrow flaticon2-right-arrow"></i> ' + dueDate + "</span></div>" +
                            "</div>" +
                            "</div>" +

                            "</div>" +
                            "</div>";
                    },
                },
            ],
        });

        $('#kt_table_1').on('error.dt', function (e, settings, techNote, message) {
            console.log('An error has been reported by DataTables: ', message);
            var isRefreshed = window.isRefreshed != undefined && window.isRefreshed != 'undefined' ? window.isRefreshed : "true";
            if (isRefreshed == "true") {
                $(".task-item-loading-container").hide();
                $(".task-item-loading-container").closest(".kt-grid.kt-grid--hor.kt-grid--root").removeClass("overflow-hidden-grid");
                $("#kt_table_1").show();
            }
        });

        $('#kt_table_1').on('mouseover', 'tbody .task-listing', function (e) {
            $(this).find('.kt-showHide').show();
        });

        $('#kt_table_1').on('mouseout', 'tbody .task-listing', function (e) {
            $(this).find('.kt-showHide').hide();
        });

        $("#txtGeneralSearch").on('keypress', function (e) {
            if (e.which == 13 || e.keyCode == 13) {
                var sortFilterText = this.value;
                var cid = window.SCID;
                if (cid != '' && cid != undefined) {
                    sortFilterText += "|" + "SelectedCourseId_" + cid;
                }
                $('#kt_table_1').dataTable().fnFilter(sortFilterText);
            }
            //Filter Chart
            if ((this.value.length > 4) || this.value == '') {

                //Dashboard grafik alanı kaldırıldı.
                var showDashboardReport = false;

                var collapsed = $('#kt_portlet_tools_12').hasClass('kt-portlet--collapse')
                    || $('#kt_portlet_tools_12').hasClass('kt-portlet--collapsed');

                if (showDashboardReport == true) {

                    if (!collapsed) {
                        if (this.value != '') {
                            InitCharts(this.value);
                        }
                        else {
                            InitCharts('');
                        }
                    }

                }
            }
        });

        $("#txtGeneralSearch").on('keyup', function (e) {
            if (this.value == '') {
                $('#kt_table_1').dataTable().fnFilter(this.value);
            }
        });

        $('#SelectedOrderId').bind('change', function (e) {
            var courseId = localStorage.getItem('CourseNameVal_current_4');
            var sortFilterText = 'Sort_' + this.value;
                var cid = courseId != '' && courseId !== undefined ? window.SCID : '' ;
            
            var assingedId = window.AssignedToVal;

            var tiidResult = NetolojiFilter.GetReturnResultFromStorage();

            if (tiidResult) 
                sortFilterText += "|" + "tiids_" + tiidResult;
            if (cid && !tiidResult)
                sortFilterText += "|" + "cids_" + cid;
            if (assingedId && !tiidResult)
                sortFilterText += "|" + "assinged_" + assingedId;

            $('#kt_table_1').dataTable().fnFilter(sortFilterText);
        });

    };

    return {

        //main function to initiate the module
        init: function () {

            initTable1();
        },

    };

}();

jQuery(document).ready(function () {
    NetolojiFilter.SetGroupIDCourseId();

    KTDatatablesDataSourceAjaxServer.init();

    BindViewAction();

    BindSortAction();

    if (NetolojiFilter.HasFilterDataAtLocalStorage()) {

        if (NetolojiFilter.HasReturnResultAtLocalStorage()) {

            NetolojiFilter.SendFilterTextToDatatablesNet("tiids_" + NetolojiFilter.GetReturnResultFromStorage());
        }
        else {
            $('#kt_table_1').dataTable().fnFilter('$');
        }
    }
});

function BindSortAction() {
    $('#SelectedOrderId').bind('change', function (e) {

        SetListSortParamIfNotExist();
        SetUserPref("EFLISTSORT", $('#SelectedOrderId').val(), function () { });
    });
}

function BindViewAction() {

    $('#SelectedViewID').bind('change', function (e) {

        SetUserPref("LAST_VIEW", $('#SelectedViewID').val(), function () {
            var dttable = $('#kt_table_1').dataTable();
            dttable.api().ajax.reload();
            //window.location.href = '/Task/List';
        });
    });
}

function SetUserPref(PrefName, PrefValue, callbackFn) {
    $.ajax({
        url: "/Main/SetUserPref",
        type: "GET",
        data: { "PrefName": PrefName, "PrefValue": PrefValue },
        success: function (d) {
            if (d == "OK") {
                if (callbackFn && typeof (callbackFn) === "function") {
                    callbackFn();
                }
                if (PrefName == "LEFT_MENU_POS") {
                    localStorage.setItem("LeftWidth", PrefValue);
                }

            }
        },
        contentType: "text/plain; charset=utf-8",
        cache: false
    });
}

function SetListSortParamIfNotExist() {
    $.ajax({
        url: "/Main/SetListSortIfNotExist",
        type: "GET",
        success: function (d) {
            if (d == "OK") {

            }
        },
        contentType: "text/plain; charset=utf-8",
        cache: false
    });
}