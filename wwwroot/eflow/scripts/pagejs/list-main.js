$(document).on("click", ".ConfDelOk", function (event) {

    var serializedIds = GetSelectedCheckboxes().toString();
    $.ajax({
        url: "/Lists/DeleteListRecords",
        data: { "CIID": 0, "CIIDs": serializedIds },
        success: function () {

            var isSelectAll = $('#selectAll').is(':checked');

            var ciidList = NetolojiFilter.GetReturnResultFromStorage();

            if (ciidList) { ciidList = "ciids_" + ciidList; } else { ciidList = "" }

            var pageIndex = 1;

            try { pageIndex = parseInt($("#eflistsTableDiv").attr("pageIndex")); } catch (e) {}

            LoadListItemsData(ciidList, '', 0, pageIndex);

            $(".deleteCheckItems").hide();

            if (isSelectAll) {
                $("#selectAll").prop('checked', false);
                $('thead tr').css("background-color", "");
            }

            $('#DeleteItems').modal('hide');
            $('.modal-backdrop').remove();

        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false
    });

});
$(document).on("click", ".StartListConfOk", function (event) {
    var serializedIds = GetSelectedCheckboxes().toString();
    $.ajax({
        url: "/Lists/ManualListStart",
        data: {
            "CID": viewBagCIDVal,
            "CIIDs": serializedIds
        },
        success: function (data) {
            $(".manualStartListCheckItems").hide();
            LoadListItemsData('', '', 0);
            $('#eflistsTableDiv').find('input[type="checkbox"]:checked').each(function () {
                $(this).prop('checked', false);
            });
            $('thead tr').css("background-color", "");
            $('tbody tr').css("background-color", "");
            $('#ManualStartListItems').modal('hide');
            $('.modal-backdrop').remove();
        }
    });
});

function disableViewElem() {

    var elem = $('#list-tablediv');

    try {
        if ($("#list-tablediv").hasClass("kanban")) {
            elem = $('.dx-scrollable-container');
        }
    } catch { }

    return elem;
}

function UpdateKanbanCard(ciid, type, status, desc, oldStatus) {

    if (type == "new") {
        addCardToKanban(ciid, status, desc);
    }
    else {
        updateKanbanCard(ciid, status, desc, oldStatus);
    }

    // Update kanban with card
    $("#litemcolumn_0").attr("direction", "desc");
    $("#kt_table_1_processing_license").css("display", "none");
    disableViewElem().css("opacity", "1").css("pointer-events", "unset");
}

function GetFilterWithStorage() {

    var ciidList = '';

    var ciidList = NetolojiFilter.GetReturnResultFromStorage();

    if (ciidList) { ciidList = "ciids_" + ciidList; }

    return ciidList;
}

function LoadListItemsData(filter = '', searchText = '', userViewType = -1, pageIndex = 1, orderIndex = 0, orderDirection = "asc") {

    $.ajax({
        type: 'GET',
        dataType: "html",
        cache: false,
        data: {
            CID: viewBagCIDVal,
            filter: filter,
            searchText: searchText,
            userViewType: userViewType,
            page: pageIndex,
            orderIndex: orderIndex,
            orderDirection: orderDirection
        },
        url: '/Lists/ListItemsByCid',
        beforeSend: function () {
            $("#kt_table_1_processing_license").css("display", "block");
        },
        success: function (data) {
            $('#ListItems').html(data);
            $("#litemcolumn_0").attr("direction", "desc");
            $("#kt_table_1_processing_license").css("display", "none");

            var tableFilter = document.getElementById('tableFilteHeader');
            if (tableFilter != null) {
                try {
                    setTimeout(function () {
                        tableFilter.style.display = 'unset';
                        li_loading.style.display = 'none';
                        li_loading.innerHTML = '';
                        document.querySelector('div.kt-grid.kt-grid--hor.kt-grid--root').style.overflow = 'unset';
                    }, 1000);
                } catch (e) {}
            }

            //Open default form
            var formId = getUrlVars()["form"];

            if (formId) {
                ToggleEditListItemClick(formId);
                cleanUrlVar();
            }
        }
    });
}

function ChangeUserViewType(userViewType, cid) {

    //var targetView = "Tablo";
    //if (userViewType == "kanban") {
    //    targetView = "Kanban";
    //}

    //Swal.fire({
    //    title: `${targetView} görünüme geçmek istediğinizden emin misiniz?`,
    //    showCancelButton: true,
    //    confirmButtonColor: '#0abb87',
    //    cancelButtonColor: '#fd397a',
    //    confirmButtonText: 'Evet',
    //    cancelButtonColor: '#fd397a',
    //    cancelButtonText: 'İptal'
    //}).then((result) => {

    //    if (result.value) {

    window.open('/Lists/List/' + cid + "?v=" + userViewType, '_self');

    //    }
    //});
}

function GetUserViewTypeWithUrl() {

    var userViewType = -1;

    try {
        var urlParams = new URLSearchParams(window.location.search);
        var uvt = urlParams.get('v');

        if (uvt)
        {
            if (uvt == "table")
            {
                userViewType = 0;
            }
            else if (uvt == "kanban") {
                userViewType = 1;
            }
        }
    } catch (e) { }

    return userViewType;
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function cleanUrlVar() {

    var lhref = window.location.href.toString();
    window.history.replaceState({}, document.title, lhref.substring(0, lhref.indexOf("?")));
}

$(document).ready(function () {

    var page_cid = parseInt(document.location.pathname.replace('/Lists/List/', ''));

    NetolojiFilter.Init({

        LocalStorageDataResultKey: "v3021_EflwFltrLists_result_key_" + page_cid,
        StoreInLocalStorage: true,
        LocalStorageKey: "v3021_EflwFltrLists_key_" + page_cid,
        GetCourseNamesURL: "/Partials/GetProcessNamesListsProcessFilter",
        DataTableListID: "#kt_table_1",
        ProcessTypeId: 5
    });

    var ciidList = "";

    if (NetolojiFilter.HasFilterDataAtLocalStorage()) {

        if (NetolojiFilter.HasReturnResultAtLocalStorage()) {
            ciidList = "ciids_" + NetolojiFilter.GetReturnResultFromStorage();
        }
        else {
            ciidList = "$";           
        }
    }
 
    LoadListItemsData(ciidList, '', GetUserViewTypeWithUrl());

    $("#lstSearch").keyup(function () {
        if ((this.value.length > 2) || this.value == '') {
            LoadListItemsData(ciidList, $(this).val());
        }
    });
});

$(document).on("click", ".AddListConfOk", function (event) {
    $("#addlistorcancel").modal('hide');
});

$(document).on("click", ".AddListConfDeny", function (event) {
    $.ajax({
        url: "/Lists/RemoveDraftRecord",
        type: "GET",
        data: { "CIID": $("input[name=CIID]").val() },
        cache: false,
        success: function (d) { }
    });
    OutsideClick('right-1');
});