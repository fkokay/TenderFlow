"use strict";

//List Item Delete
function TogglerDeleteListItemClick(id) {
    swal({
        title: question,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: cancelProcess,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: okprocess
    }).then((result) => {
        if (result.value) {
            $("#kt_table_1_processing_license").css("display", "block");

            $.ajax({
                type: 'GET',
                dataType: "html",
                data: {
                    CIID: id
                },
                url: '/Lists/DeleteListRecord',
                success: function (data) {
                    var res = data === "true" ? "success" : "error";
                    swal({
                        position: 'top-right',
                        type: res,
                        text: savechanges,
                        showConfirmButton: false,
                        timer: 5000
                    });

                    var ciidList = NetolojiFilter.GetReturnResultFromStorage();

                    if (ciidList) { ciidList = "ciids_" + ciidList; } else { ciidList = "" }

                    LoadListItemsDataByCiid(id);

                    $("#kt_table_1_processing_license").css("display", "none");
                },
                fail: function (xhr, textStatus, errorThrown) {
                    console.log(xhr);
                    console.log(textStatus);
                    console.log(errorThrown);
                    $("#kt_table_1_processing_license").css("display", "none");
                }
            });

        }
    });
}

//SubList Items Lists
function ToogleSubListItems(cid, ciid) {

    PreLoadSub('#detailPanelPartial-2');

    var filter = "";
    var ciidList = NetolojiSubFilter.GetReturnResultFromStorageWithCiid(ciid);
    if (ciidList) {
        ciidList = "ciids_" + ciidList;
        filter = ciidList;
    }
    else {
        $('#efSublistsTableDiv tbody').html("");
        $(".list-items-footer-sub").text("");
        NetolojiSubFilter.ClearFilterResultToStorageByCiid(ciid);
    }

    $.ajax({
        type: 'GET',
        dataType: "html",
        data: {
            CID: cid,
            page: 1,
            CIID: ciid,
            filter: filter
        },
        url: '/Lists/SubListItems',
        success: function (data) {
            ReturnPage(data)
            $('#detailPanelPartial-2').html(data);
            OpenModal("right-2", false);
        },
        fail: function (xhr, textStatus, errorThrown) {
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

    OpenModal("right-2", true);
    $("#ldz-r1").attr("style", "display:none;")
}

function PreLoadSub(id) {

    $("#kt_process_detail_form-sub").hide();

    function getSubRandomShimmerWidth() {
        return Math.floor(Math.random() * (92 - 22 + 1)) + 12;
    }

    var sub_loadingContent = `
        <div class="kt-portlet__head">
            <div class="list_table_shimmer" style="width: 153px; height: 20px;"></div>
        </div>
        <div style='display: contents;' class="kt-content px-0 pb-0">
            <table class="table table-semantic-loading">
                <thead>
                    <tr>
                        <th width="28">
                            <div class="list_table_shimmer" style="width: 100%; height: 16px;"></div>
                        </th>
                        <th width="0%">
                            <div class="list_table_shimmer" style="width: ${getSubRandomShimmerWidth()}%; height: 16px;"></div>
                        </th>
                        <th width="20%">
                            <div class="list_table_shimmer" style="width: ${getSubRandomShimmerWidth()}%; height: 16px;"></div>
                        </th>
                        <th width="20%">
                            <div class="list_table_shimmer" style="width: ${getSubRandomShimmerWidth()}%; height: 16px;"></div>
                        </th>
                        <th width="20%">
                            <div class="list_table_shimmer" style="width: ${getSubRandomShimmerWidth()}%; height: 16px;"></div>
                        </th>
                        <th width="20%">
                            <div class="list_table_shimmer" style="width: ${getSubRandomShimmerWidth()}%; height: 16px;"></div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${Array(20).fill().map(() => `
                        <tr>
                            <td width="28">
                                <div class="list_table_shimmer" style="width: 100%; height: 14px;"></div>
                            </td>
                            <td>
                                <div class="list_table_shimmer" style="width: ${getSubRandomShimmerWidth()}%; height: 14px;"></div>
                            </td>
                            <td>
                                <div class="list_table_shimmer" style="width: ${getSubRandomShimmerWidth()}%; height: 14px;"></div>
                            </td>
                            <td>
                                <div class="list_table_shimmer" style="width: ${getSubRandomShimmerWidth()}%; height: 14px;"></div>
                            </td>
                            <td>
                                <div class="list_table_shimmer" style="width: ${getSubRandomShimmerWidth()}%; height: 14px;"></div>
                            </td>
                            <td>
                                <div class="list_table_shimmer" style="width: ${getSubRandomShimmerWidth()}%; height: 14px;"></div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    $(id).html(sub_loadingContent);
}

//SubList New Item
function TogglerUserSubItemClick(id, ciid) {

    try {
        NetolojiSubFilter.CloseFilterForms();
    }
    catch{ }

    $("#kt_table_1_processing_license").css("display", "block");

    $.ajax({
        type: 'GET',
        dataType: "html",
        data: {
            cid: id,
            ciid: ciid
        },
        url: '/Lists/SubStartListItem',
        success: function (tiid) {

            $.ajax({
                type: 'GET',
                dataType: "html",
                data: {
                    Type: 'work',
                    TIID: tiid,
                    TaskPage: 1,
                    NewTask: true
                },
                url: '/Lists/SubDetailList',
                success: function (data) {
                    ReturnPage(data)
                    $('#detailPanelPartial-3').html(data);
                    OpenModal('right-3', true);
                    $("#kt_table_1_processing_license").css("display", "none");
                },
                fail: function (xhr, textStatus, errorThrown) {
                    console.log(xhr);
                    console.log(textStatus);
                    console.log(errorThrown);
                    $("#kt_table_1_processing_license").css("display", "none");
                }
            });

        },
        fail: function (xhr, textStatus, errorThrown) {

            $("#kt_table_1_processing_license").css("display", "none");
        }
    });

    $("#ldz-r2").attr("style", "display:none;")
}

//SubList Item Delete
function TogglerDeleteSubListItemClick(ciid, cid, parentCiid) {

    swal({
        text: EFlang.DeleteConfirm,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: cancelProcess,
        confirmButtonColor: '#4c81d1',
        cancelButtonColor: '#ebedf2',
        confirmButtonText: okprocess
    }).then((result) => {
        if (result.value) {
            $("#kt_table_1_processing_license").css("display", "block");
            $.ajax({
                type: 'GET',
                dataType: "html",
                data: {
                    CIID: ciid
                },
                url: '/Lists/DeleteListRecord',
                success: function (data) {

                    $.ajax({
                        type: 'GET',
                        dataType: "html",
                        data: {
                            CID: cid,
                            CIID: parentCiid
                        },
                        url: '/Lists/SubListItems',
                        success: function (data) {
                            ReturnPage(data)
                            $('#detailPanelPartial-2').html(data);
                            $("#kt_table_1_processing_license").css("display", "none");
                        },
                        fail: function (xhr, textStatus, errorThrown) {
                            console.log(xhr);
                            console.log(textStatus);
                            console.log(errorThrown);
                            $("#kt_table_1_processing_license").css("display", "none");
                        }
                    });
                    $("#kt_table_1_processing_license").css("display", "none");
                },
                fail: function (xhr, textStatus, errorThrown) {
                    console.log(xhr);
                    console.log(textStatus);
                    console.log(errorThrown);
                    $("#kt_table_1_processing_license").css("display", "none");
                }
            });
        }
    })
}

//SubList Item Edit
function ToggleEditSubListItemClick(id) {

    try {
        NetolojiSubFilter.CloseFilterForms();
    }
    catch{ }

    $("#kt_table_1_processing_license").css("display", "block");
    $.ajax({
        type: 'GET',
        dataType: "html",
        data: {
            Type: 'work',
            CIID: id,
            TaskPage: 1
        },
        url: '/Lists/EditSubDetailList',
        success: function (data) {
            ReturnPage(data)
            $('#detailPanelPartial-3').html(data);
            OpenModal('right-3', false);
            $("#kt_table_1_processing_license").css("display", "none");
        },
        fail: function (xhr, textStatus, errorThrown) {
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
            $("#kt_table_1_processing_license").css("display", "none");
        }
    });
    $("#ldz-r2").attr("style", "display:none;")
}

function OpenModal(id, calcelValidate) {

    try {
        NetolojiFilter.CloseFilterForms();
    }
    catch{ }

    //Open modal if forms valid
    if (id != "right-3" && calcelValidate == false) {
        var isTaskFormInvalid = CheckFormsInValid($("#taskform"));
        if (isTaskFormInvalid == true) {
            return;
        }
    }

    var form1_width;
    var form2_width;
    var form3_width;

    if (isZoomEnabled == "True") {
        form1_width = "width: 100% !important; z-index: 600;";
        form2_width = "width: 100% !important; z-index: 500;";
        form3_width = "width: 100% !important; z-index: 400;";
    }
    else {
        form1_width = "width: 85% !important; z-index: 600;";
        form2_width = "width: 87% !important; z-index: 500;";
        form3_width = "width: 89% !important; z-index: 400;";
    }

    //Set all items last selected false
    $(".multiple-form").attr('last-selected', 'false');

    //Set current last selected item
    $("#" + id).attr('last-selected', 'true').attr('is-open', 'true');

    //First form opened
    $("#" + id).attr('style', form1_width);

    //Get all opened forms
    var allOpenForms = $(".multiple-form").closest("[is-open='true']").toArray();

    var forms = [];

    //Push opened form id's to array
    for (var i = 0; i < allOpenForms.length; i++) {
        forms.push(allOpenForms[i].id)
    }

    //Remove last opened form from array to handle others
    var _index = forms.indexOf(id);
    if (_index > -1) {
        var removed = forms.splice(_index, 1);
    }

    //Handle other forms
    $.each(forms, function (index, val) {

        if (index == 0) {
            $("#" + val).attr('style', form3_width);

        }
        else {
            $("#" + val).attr('style', form2_width);
        }
        $("#" + val).find("button").attr("disabled", true);
    });

    disableViewElem().css("opacity", "0.5").css("pointer-events", "none");
}

function CloseModal(isSave, id, ciid, isNewTask) {

    ClearFullFormHash();

    try {
        NetolojiFilter.CloseFilterForms();
    }
    catch{ }

    if (id == "right-2") {
        $("#ldz-r1").attr("style", "display:inline-block;")
        if (ciid) {
            //ToggleEditListItemClick(ciid);
            NetolojiSubFilter.CloseFilterForms();
        }
    }
    else if (id == "right-3") {
        $("#ldz-r2").attr("style", "display:inline-block;")

        if (ciid) {
            //Sub-list
            $.ajax({
                url: "/Lists/RemoveDraftRecord",
                type: "GET",
                data: { "CIID": ciid },
                cache: false,
                success: function (d) { }
            });
        }
    }
    else if (id == "right-1") {

        //Parent-list
        $.ajax({
            url: "/Lists/RemoveDraftRecord",
            type: "GET",
            data: { "CIID": $("input[name=CIID]").val() },
            cache: false,
            success: function (d) { }
        });
    }

    //Save modal if forms valid
    if (isNewTask === true) {
        $.ajax({
            type: 'GET',
            dataType: "html",
            data: {
                CIID: ciid
            },
            url: '/Lists/DeleteListRecord',
            success: function (data) {

                $("#kt_table_1_processing_license").css("display", "none");

            },
            fail: function (xhr, textStatus, errorThrown) {
                console.log(xhr);
                console.log(textStatus);
                console.log(errorThrown);
                $("#kt_table_1_processing_license").css("display", "none");
            }
        });

    }
    if (isSave == true) {
        var isTaskFormInvalid = CheckFormsInValid($("#taskform"));
        if (id == "right-1" && isTaskFormInvalid == true) {
            return;
        }

        var isSubFormInvalid = CheckFormsInValid($("#subtaskform"));
        if (id == "right-3" && isSubFormInvalid == true) {
            return;
        }
    }

    var form1_width;
    var form2_width;

    if (isZoomEnabled == "True") {
        form1_width = "width: 100% !important; z-index: 600;";
        form2_width = "width: 100% !important; z-index: 500;";
    }
    else {
        form1_width = "width: 85% !important; z-index: 600;";
        form2_width = "width: 87% !important; z-index: 500;";
    }

    $("#" + id).attr('style', 'width: ' + '0%' + ' !important');

    $("#" + id).attr('is-open', 'false');

    //Get all opened forms
    var allOpenForms = $(".multiple-form").closest("[is-open='true']").toArray();

    var forms = [];

    //Push opened forms to array
    for (var i = 0; i < allOpenForms.length; i++) {
        forms.push(allOpenForms[i].id)
    }

    //Handle other forms
    $.each(forms, function (index, val) {

        if (index == 0) {

            if (forms.length == 1) {
                // if only one opened item left
                $("#" + val).attr('style', form1_width);
                $("#" + val).find("button").attr("disabled", false);
            }
            else {
                $("#" + val).attr('style', form2_width);
            }

        }
        if (index == 1) {
            $("#" + val).attr('style', form1_width);
            $("#" + val).find("button").attr("disabled", false);
        }

    });

    if (id === 3) {
        $("#kt_table_1_processing_license").css("display", "block");
        $.ajax({
            type: 'GET',
            dataType: "html",
            data: {
                Type: 'work',
                CIID: ciid,
                TaskPage: 1,
                userViewType: GetUserViewTypeWithUrl()
            },
            url: '/Lists/EditDetailList',
            success: function (data) {
                $('#detailPanelPartial').html("");
                $('#detailPanelPartial').html(data);
                $("#1").find("button").attr("disabled", true);
                $("#kt_table_1_processing_license").css("display", "none");
            },
            fail: function (xhr, textStatus, errorThrown) {
                console.log(xhr);
                console.log(textStatus);
                console.log(errorThrown);
                $("#kt_table_1_processing_license").css("display", "none");
            }
        });
    }

    try {
        if (forms.length > 1) {
            disableViewElem().css("opacity", "0.5").css("pointer-events", "none");
        }
        else {
            disableViewElem().css("opacity", "1").css("pointer-events", "unset");
        }
    } catch (e) {
        disableViewElem().css("opacity", "1").css("pointer-events", "unset");
    }

    setTimeout(function () {
        SetDesignElementLineItemSize(".designMap");
    }, 300);
}

function OutsideClick(id) {

    ClearFullFormHash();

    try {
        NetolojiFilter.CloseFilterForms();
    }
    catch{ }

    var form1_width;
    var form2_width;

    if (isZoomEnabled == "True") {
        form1_width = "width: 100% !important; z-index: 600;";
        form2_width = "width: 100% !important; z-index: 500;";
    }
    else {
        form1_width = "width: 85% !important; z-index: 600;";
        form2_width = "width: 87% !important; z-index: 500;";
    }

    $("#" + id).attr('style', 'width: ' + '0%' + ' !important');

    $("#" + id).attr('is-open', 'false');

    //Get all opened forms
    var allOpenForms = $(".multiple-form").closest("[is-open='true']").toArray();

    var forms = [];

    //Push opened forms to array
    for (var i = 0; i < allOpenForms.length; i++) {
        forms.push(allOpenForms[i].id)
    }

    //Handle other forms
    $.each(forms, function (index, val) {

        if (index == 0) {

            if (forms.length == 1) {
                // if only one opened item left
                $("#" + val).attr('style', form1_width);
                $("#" + val).find("button").attr("disabled", false);
            }
            else {
                $("#" + val).attr('style', form2_width);
            }

        }
        if (index == 1) {
            $("#" + val).attr('style', form1_width);
            $("#" + val).find("button").attr("disabled", false);
        }

    });
    try {
        if (forms.length > 1) {
            disableViewElem().css("opacity", "0.5").css("pointer-events", "none");
        }
        else {
            disableViewElem().css("opacity", "1").css("pointer-events", "unset");
        }
    } catch (e) {
        disableViewElem().css("opacity", "1").css("pointer-events", "unset");
    }
}

function CloseModalNew(isSave, id, ciid) {
    CIID = 0;
    var isNew = $("input[name='newTask']").val();
    if (ciid === undefined && isSave === false && isNew === "true") {
        CIID = $("input[name='CIID']").val();
        if (CIID !== 0) {
            $.ajax({
                type: 'GET',
                dataType: "html",
                data: {
                    CIID: CIID
                },
                url: '/Lists/DeleteListRecord',
                success: function (data) {

                    $("#kt_table_1_processing_license").css("display", "none");

                },
                fail: function (xhr, textStatus, errorThrown) {
                    console.log(xhr);
                    console.log(textStatus);
                    console.log(errorThrown);
                    $("#kt_table_1_processing_license").css("display", "none");
                }
            });
        }
    }
    var form1_width;
    var form2_width;

    if (isZoomEnabled == "True") {
        form1_width = "width: 100% !important; z-index: 600;";
        form2_width = "width: 100% !important; z-index: 500;";
    }
    else {
        form1_width = "width: 85% !important; z-index: 600;";
        form2_width = "width: 87% !important; z-index: 500;";
    }

    $("#" + id).attr('style', 'width: ' + '0%' + ' !important');

    $("#" + id).attr('is-open', 'false');

    //Get all opened forms
    var allOpenForms = $(".multiple-form").closest("[is-open='true']").toArray();

    var forms = [];

    //Push opened forms to array
    for (var i = 0; i < allOpenForms.length; i++) {
        forms.push(allOpenForms[i].id)
    }

    //Handle other forms
    $.each(forms, function (index, val) {

        if (index == 0) {

            if (forms.length == 1) {
                // if only one opened item left
                $("#" + val).attr('style', form1_width);
                $("#" + val).find("button").attr("disabled", false);
            }
            else {
                $("#" + val).attr('style', form2_width);
            }

        }
        if (index == 1) {
            $("#" + val).attr('style', form1_width);
            $("#" + val).find("button").attr("disabled", false);
        }

    });
    try {
        if (forms.length > 1) {
            disableViewElem().css("opacity", "0.5").css("pointer-events", "none");
        }
        else {
            disableViewElem().css("opacity", "1").css("pointer-events", "unset");
        }
    } catch (e) {
        disableViewElem().css("opacity", "1").css("pointer-events", "unset");
    }
}

function CheckFormsInValid(form) {

    if (form.length > 0 && form.valid() == false) { return true } else { return false }
}

function ReturnPage(data) {
    var has = data.indexOf("DOCTYPE");
    if (has > -1) {
        window.location.href = "/Account/Login";
    }
}

function LoadListItemsDataByCiid(id, filter = '') {

    $.ajax({
        type: 'GET',
        dataType: "html",
        data: {
            CIID: id,
            filter: filter
        },
        url: '/Lists/ListItemsByCiid',
        success: function (data) {
            ReturnPage(data);
            $('#ListItems').html(data);
        },
        fail: function (xhr, textStatus, errorThrown) {
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function OpenModalZoom(id, hasZoom) {

    var form1_width;
    var form2_width;
    var form3_width;

    if (hasZoom == "True") {
        form1_width = "width: 100% !important; z-index: 600;";
        form2_width = "width: 100% !important; z-index: 500;";
        form3_width = "width: 100% !important; z-index: 400;";
    }
    else {
        form1_width = "width: 85% !important; z-index: 600;";
        form2_width = "width: 87% !important; z-index: 500;";
        form3_width = "width: 89% !important; z-index: 400;";
    }

    //Set all items last selected false
    $(".multiple-form").attr('last-selected', 'false');

    //Set current last selected item
    $("#" + id).attr('last-selected', 'true').attr('is-open', 'true');

    //First form opened
    $("#" + id).attr('style', form1_width);

    //Get all opened forms
    var allOpenForms = $(".multiple-form").closest("[is-open='true']").toArray();

    var forms = [];

    //Push opened form id's to array
    for (var i = 0; i < allOpenForms.length; i++) {
        forms.push(allOpenForms[i].id)
    }

    //Remove last opened form from array to handle others
    var _index = forms.indexOf(id);
    if (_index > -1) {
        var removed = forms.splice(_index, 1);
    }

    //Handle other forms
    $.each(forms, function (index, val) {

        if (index == 0) {
            $("#" + val).attr('style', form3_width);

        }
        else {
            $("#" + val).attr('style', form2_width);
        }
        $("#" + val).find("button").attr("disabled", true);
    });

    disableViewElem().css("opacity", "0.5").css("pointer-events", "none");
}

//List New Item
function TogglerUserItemClick(id, status = '') {

    $("#kt_table_1_processing_license").css("display", "block");
    $.ajax({
        type: 'GET',
        dataType: "html",
        data: {
            cid: id
        },
        url: '/Lists/StartListItem',
        success: function (data) {

            $.ajax({
                type: 'GET',
                dataType: "html",
                data: {
                    Type: 'work',
                    TIID: JSON.parse(data),
                    TaskPage: 1,
                    NewTask: true,
                    userViewType: GetUserViewTypeWithUrl()
                },
                url: '/Lists/DetailList',
                success: function (data) {
                    ReturnPage(data);
                    $('#detailPanelPartial').html(data);
                    OpenModal("right-1", true);
                    $("#kt_table_1_processing_license").css("display", "none");
                    currentFormHash = GetCurrentFormHash("#taskform");

                    if (status != '') {
                        $('[name=status]').val(status).trigger('change');
                    }
                },
                fail: function (xhr, textStatus, errorThrown) {
                    console.log(xhr);
                    console.log(textStatus);
                    console.log(errorThrown);
                    $("#kt_table_1_processing_license").css("display", "none");
                }
            });

        },
        fail: function (xhr, textStatus, errorThrown) {

            $("#kt_table_1_processing_license").css("display", "none");
        }
    });
}

//List Item Update
function ToggleEditListItemClick(id) {
    $("#kt_table_1_processing_license").css("display", "block");
    $.ajax({
        type: 'GET',
        dataType: "html",
        data: {
            Type: 'work',
            CIID: id,
            TaskPage: 1,
            userViewType: GetUserViewTypeWithUrl()
        },
        url: '/Lists/EditDetailList',
        success: function (data) {
            ReturnPage(data)
            $('#detailPanelPartial').html(data);
            OpenModal("right-1", true);
            $("#kt_table_1_processing_license").css("display", "none");
            currentFormHash = GetCurrentFormHash("#taskform");

        },
        fail: function (xhr, textStatus, errorThrown) {
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
            $("#kt_table_1_processing_license").css("display", "none");
        }
    });
}

function ToggleEditListViewLoad(id) {
    $.ajax({
        type: 'GET',
        dataType: "html",
        data: {
            Type: 'work',
            CIID: id,
            TaskPage: 1,
            userViewType: GetUserViewTypeWithUrl()
        },
        url: '/Lists/EditDetailList',
        success: function (data) {
            ReturnPage(data)
            $('#detailPanelPartial').html(data);
            currentFormHash = GetCurrentFormHash("#taskform");
        }
    });
}

function IsFormDataChanged() {

    var formVal = GetCurrentFormHash("#taskform");

    var tableVal = "";

    if (currentTableHash != "") {
        tableVal = GetCurrentTablesHash();
    }

    if ((formVal == currentFormHash) &&
        (tableVal == currentTableHash)) {
        return false;
    }
    else {
        return true;
    }
}
