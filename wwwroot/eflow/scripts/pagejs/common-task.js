function TaskWorkClick(id, openPanel) {
    CheckHasInternetConnection(id)
    var isDetailPage = (window.location.href.indexOf("Details") > -1);
    if (!isDetailPage) {
        $('#detailPanelPartial').removeClass("peek-mode").addClass("work-mode");

        if ($("#kt_quick_panel").attr("is-full-screen") == "true") {

            RunFullScreenOnDesign();
        }

        if (openPanel) {
            $('#detailPanelPartial').html('');
            $("#task-detail-overlay").css("display", "flex");
            ActivateDefaultZoomIfUserSelected();

        }
    }

    $.ajax({
        type: 'GET',
        dataType: "html",
        cache: false,
        data: {
            Type: 'work',
            TIID: id,
            TaskPage: 1
        },
        url: '/Task/Detail',
        success: function (data) {

            var has = data.indexOf("session$off");
            if (has > -1) {
                window.location.href = "/Account/Login";
            }

            if (!isDetailPage) {
                $('#detailPanelPartial').html(data);
                $("#task-detail-overlay").hide();
                var dttable = $('#kt_table_1').dataTable();
                window.isRefreshed = false;
                dttable.api().ajax.reload(null, false);
            }
            else {
                window.location.href = "/Task/Details?Type=work&TIID=" + id;
            }

        },
        fail: function (xhr, textStatus, errorThrown) {

        }
    });
}

function TaskClick(id, openPanel, type = 'peek') {

    var isDetailPage = (window.location.href.indexOf("Details") > -1);
    if (!isDetailPage) {

        if ($("#kt_quick_panel").attr("is-full-screen") == "true") {

            RunFullScreenOnDesign();
        }

        if (openPanel) {
            $('#kt_quick_panel').attr('tiid', id);
            $('#detailPanelPartial').html('');
            $("#task-detail-overlay").css("display", "flex");
            if (type == "peek") {
                $('#detailPanelPartial').removeClass("work-mode").addClass("peek-mode");
            }
            else {
                $('#detailPanelPartial').removeClass("peek-mode").addClass("work-mode");
            }
            ActivateDefaultZoomIfUserSelected();
        }
    }

    $.ajax({
        type: 'GET',
        dataType: "html",
        cache: false,
        data: {
            Type: type,
            TIID: id,
            TaskPage: 1,
            Url: 'DashboardPanel'
        },
        url: '/Task/Detail',
        success: function (data) {

            var has = data.indexOf("session$off");
            if (has > -1) {
                window.location.href = "/Account/Login";
            }

            if (!isDetailPage) {
                $('#detailPanelPartial').html(data);
                $("#task-detail-overlay").hide();
                if (type == "peek") {
                    DisablePreviewModeInputs();
                    $(".headerItemPosition-newLine").hide();
                    $(".headerItemPosition-search").css("visibility", "hidden");
                }
            }
        }
    });
}

function TogglerTaskPeekClick(id) {
    CheckHasInternetConnection(id)

    if ((window.location.href.indexOf('Task/Details') > -1) ||
        (window.location.href.indexOf('Task') == -1)) {
        window.location.href = "/Task/Details?Type=peek&TIID=" + id;
    }
    $('#detailPanelPartial').html('');
    $("#task-detail-overlay").css("display", "flex");
    $('#detailPanelPartial').removeClass("work-mode").addClass("peek-mode");
    ActivateDefaultZoomIfUserSelected();

    $.ajax({
        type: 'GET',
        dataType: "html",
        cache: false,
        data: {
            Type: 'peek',
            TIID: id,
            TaskPage: 1
        },
        url: '/Task/Detail',
        success: function (data) {

            var has = data.indexOf("session$off");
            if (has > -1) {
                window.location.href = "/Account/Login";
            }

            $('#detailPanelPartial').html(data);
            $("#task-detail-overlay").hide();
            LitStickyHeaderPreviewMode();
            DisablePreviewModeInputs();
        },
        fail: function (xhr, textStatus, errorThrown) {
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function ActivateDefaultZoomIfUserSelected() {
    $("#kt_quick_panel_toggler_btn").click();
    $.ajax({
        type: 'GET',
        dataType: "json",
        traditional: true,
        url: '/Task/IsDefaultZoomEnabled',
        success: function (data) {

            if (data == "yes") {
                try {
                    TaskDetailPageZoom();
                } catch (e) { }

            }

        }
    });
}

function TaskDetailPageZoom() {

    var panelOnStyle = $('.kt-quick-panel.kt-quick-panel--on').attr('style');

    if (panelOnStyle.indexOf("width: 100% !important") >= 0) {

        SetFullScreenOffDesign();
    }
    else {
        SetFullScreenOnDesign();
    }
}

function SetFullScreenOffDesign() {
    $('.kt-quick-panel.kt-quick-panel--on').attr('style', 'width: 77%');
    $('#kt_quick_panel').attr('is-full-screen', 'false');
    $("#tdZoomIcon").toggleClass("la la-angle-double-left la la-angle-double-right");
    $("#kt_content_taskdetail").removeClass("full-screen-margin");
    $(".childTaskDetailWrapper").css("width", '');
    $("#bottomSection").removeClass("bottomSectionFullScreen");
    $("#bottomSection").addClass("bottomSectionHalfScreen");
}

function SetFullScreenOnDesign() {
    $('.kt-quick-panel.kt-quick-panel--on').attr('style', 'width: 100% !important');
    $('#kt_quick_panel').attr('is-full-screen', 'true');
    $("#tdZoomIcon").toggleClass("la la-angle-double-right la la-angle-double-left");
    $("#kt_content_taskdetail").addClass("full-screen-margin");
    $(".childTaskDetailWrapper").css("width", $(document).width() - 45);
    $("#bottomSection").removeClass("bottomSectionHalfScreen");
    $("#bottomSection").addClass("bottomSectionFullScreen");
}

function TogglerTaskPeekRedirectByNewUrl(url) {

    $.ajax({
        type: 'GET',
        dataType: "html",
        cache: false,
        url: url,
        success: function (data) {

            var has = data.indexOf("session$off");
            if (has > -1) {
                window.location.href = "/Account/Login";
            }

            try {
                $('#kt_table_1').DataTable().ajax.reload(null, false);
            } catch (e) { }

            $('#detailPanelPartial').html(data);
        },
        fail: function (xhr, textStatus, errorThrown) {
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function TaskDetailBackClick() {

    var isDetailPage = (window.location.href.indexOf("Details") > -1);

    if (isDetailPage) {
        window.location.href = "/Task/List";
    }
    else {
        $(".flaticon2-delete").click();
    }
}

function ShowWorkflowClick() {
    $('#courseMapModal').modal('show');
    lockPreviewScroll();
}

function courseMapModalClose() {
    $('#courseMapModal').modal('hide');
    unlockPreviewScroll();
}

function CollapseClick(id, processType) {

    if ($(id).hasClass("kt-portlet--collapsed")) {
        $(id).removeClass("kt-portlet--collapsed");

        var portletId = id.replace("tools", "body");
        var ciid = $(portletId).attr("data-ciid");
        $(".kt-portlet-datawrap").empty();

        GetProcessDataHtml(portletId, ciid, processType);

    }
    else {
        $(id).addClass("kt-portlet--collapsed");
    }
}

function GetProcessDataHtml(portletId, ciid, processType) {
    $('.loadingDiv_' + ciid).show();
    $.ajax({
        type: 'GET',
        dataType: "html",
        cache: false,
        url: '/Search/ProcessDataPartial?CIID=' + ciid + '&processType=' + processType,
        success: function (data) {
            $(portletId).html(data);
            $("[id^='dragdrop']").css("width", "auto");
            $("[id^='dragdrop']").css("height", "auto");
            $(".dataInput-grid").css("width", "97%");
            $('.loadingDiv_' + ciid).hide();
            $("div.control-group .form-group.row").addClass("none-frm-search-detail");
            $(".control-group").addClass("none-grp-search-detail");
        },
        fail: function (xhr, textStatus, errorThrown) {

        }
    });
}

function GetProcessDataCountsByType() {

    $.ajax({
        type: 'GET',
        dataType: "json",
        data: { 'types': ['1', '2', '3'] },
        async: true,
        traditional: true,
        url: '/Partials/ProcessDataCountByType',
        success: function (data) {

            if (data.CreatedByMe > 0) {
                $(".createdProcessTypeCount").text(data.CreatedByMe);
                $("#liCreatedProcess").show();
            }
            if (data.IncludedByMe > 0) {
                $(".includedProcessTypeCount").text(data.IncludedByMe);
                $("#liIncludedProcess").show();
            }
            if (data.ComplatedByMe > 0) {
                $(".complatedProcessTypeCount").text(data.ComplatedByMe);
                $("#liComplatedProcess").show();
            }
        }
    }).done(function (data) {
        //CheckHasInternetConnection(0)
    }).fail(function (jqXHR, textStatus) {
        //CheckHasInternetConnection(0)
    });;
}

function insertWidgetCardTotalItems() {

    return false;

    const widgetCards = document.querySelectorAll('.widget-card');

    widgetCards.forEach(widgetCard => {
        // if (widgetCard.id === 'widget_batchProcesses') {
        //    return; // Sayma
        //} 

        // Define a function to process the wrapper
        const listItemsWrapper = (wrapperSelector) => {

            const wrapper = widgetCard.querySelector(wrapperSelector);

            if (wrapper) {

                const itemCount = wrapper.querySelectorAll('li').length;
                const headLabel = widgetCard.querySelector('.widget-card__head-label');

                if (headLabel) {
                    const totalItemsText = `(${itemCount})`;
                    headLabel.setAttribute('data-total-items', totalItemsText);

                    // Find the h3.widget-card__head-title element
                    const headTitle = headLabel.querySelector('.widget-card__head-title');
                    if (headTitle) {
                        const titleText = `${headTitle.textContent.trim()} ${totalItemsText}`;
                        headLabel.setAttribute('title', titleText);
                    }
                }
            }
        };

        // Process both .widget-grid-wrapper and .widget-row-wrapper
        listItemsWrapper('.widget-grid-wrapper');
        listItemsWrapper('.widget-row-wrapper');
    });
}

function insertWidgetTabTotalItems() {

    var tabPane = $("#tabContentCompletionDate .tab-pane").get(0);
    var itemCount = tabPane.querySelectorAll('li').length;
    var buttonId = tabPane.id.replace("tasks", "btn");
    $("#" + buttonId).attr('data-total-items', itemCount.toString());
}

function refreshTasksByCompletionDate() {

    var id = 1001;
    var tiid = $("#kt_quick_panel").attr("tiid");

    var hasRow = $("div[gs-id='" + id + "'] .grid-stack-item-content .tab-pane.active .widget-row__item_" + tiid).length;

    if (hasRow == true) {
        $("div[gs-id='" + id + "'] .grid-stack-item-content .tab-pane.active .widget-row__item_" + tiid).parent().remove();
        KTApp.init();
        insertWidgetTabTotalItems();
    }
}

function refreshPendingTasksByApproval() {

    var id = 1000;

    var tiid = $("#kt_quick_panel").attr("tiid");

    var hasRow = $("div[gs-id='" + id + "'] .grid-stack-item-content .widget-row__item_" + tiid).length > 0;

    if (hasRow == true) {

        var widget = $("div[gs-id='" + id + "'] .widget-row-wrapper");

        $("div[gs-id='" + id + "'] .grid-stack-item-content .widget-row__item_" + tiid).parent().remove();

        KTApp.init();

        var currentDataFilter = parseInt($("div[gs-id='" + id + "'] .widget-card-dropdown .default-filter").attr("current-filter"));

        $.ajax({
            type: 'GET',
            dataType: "html",
            cache: false,
            data: {
                dataFilter: currentDataFilter
            },
            url: '/DashboardPanel/GetPendingTasksByApprovalNewRow',
            success: function (data) {

                if (data) {
                    widget.append(data);
                    KTApp.init();
                }

                insertWidgetCardTotalItems();
            }
        });
    }
}

function FinalizeTask(url) {

    var hasDashboard = window.location.href.toLowerCase().indexOf('dashboardpanel');

    try {

        $(".flaticon2-delete").click();
        $('.kt-quick-panel').attr('style', 'width: 0%');
        $('#kt_quick_panel').attr('is-full-screen', 'false');
        GetProcessDataCountsByType();

        if (hasDashboard == -1) {
            $('#kt_table_1').DataTable().ajax.reload(null, false);
        }
        if (hasDashboard > 0) {

            refreshPendingTasksByApproval();
            refreshTasksByCompletionDate();
        }
    }
    catch (err) {

        if (hasDashboard == -1) {
            console.log(url);
            window.location.href = "/";
        }
    }
}

function RunFullScreenOnDesign() {
    setTimeout(function () {
        $('.kt-quick-panel.kt-quick-panel--on').attr('style', 'width: 100% !important');
        $('#kt_quick_panel').attr('is-full-screen', 'true');
        $("#tdZoomIcon").toggleClass("la la-angle-double-right la la-angle-double-left");
        $("#kt_content_taskdetail").addClass("full-screen-margin");
        $(".childTaskDetailWrapper").css("width", $(document).width() - 45);
        $("#bottomSection").removeClass("bottomSectionHalfScreen");
        $("#bottomSection").addClass("bottomSectionFullScreen");
    }, 10);
}

function DisablePreviewModeInputs() {
    $("#taskDetailPanelContainer :input:not(.col-search-input)").prop("disabled", true);
    $("#taskDetailPanelContainer .tablinks").prop("disabled", false);
    $("#taskDetailPanelContainer :input").css("background-color", 'white');
    $(".file-uploader, .newRowLine").addClass("disabledContent");
    if (window.location.href.indexOf('Search/Detail') < 0) {
        $("#basic-addon2").removeClass("popupselector");
        $(".pps-more-icon").css("visibility", "hidden");
        $(".ppsinputgroupappend").css("pointer-events", "none");
        $(".kt-timeline-v2").parent().find("textarea").prop("disabled", true);
    }
    else {
        $(".kt-timeline-v2").parent().find("textarea").removeAttr("disabled");
    }
    $("#taskform .kt-radio.kt-radio--brand > span").css("border", "1px solid #d1d7e2");
    $("#taskform .kt-checkbox.kt-checkbox--brand > span").css("border", "1px solid #d1d7e2");
    $("#taskform .select2-selection--multiple > .select2-selection__rendered > .select2-search > .select2-search__field").css("background-color", "unset");
    $("#taskform .select2-container--default.select2-container--focus .select2-selection--multiple").css("border-color", "transparent");
}

function CheckHasInternetConnection(id) {

    $.ajax({
        type: 'GET',
        dataType: "json",
        traditional: true,
        url: '/Partials/HasInternetConnection',
        success: function (data) {

            if (id > 0) {
                $("#noConnectionModal input[name='CheckInternetConLastTIID']").val(id);
            }
            if (data == "no") {
                $('#noConnectionModal').modal('show');
            }
            else if (data == "yes") {
                $('#noConnectionModal').modal('hide');
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            if (id > 0) {
                $("#noConnectionModal input[name='CheckInternetConLastTIID']").val(id);
                $('#noConnectionModal').modal('show');
            }
        }
    });
}

function InternetConnectionRedirectSamePage() {

    $.ajax({
        type: 'GET',
        dataType: "json",
        traditional: true,
        url: '/Partials/HasInternetConnection',
        success: function (data) {

            if (data == "yes") {
                var tiid = $("#noConnectionModal input[name='CheckInternetConLastTIID']").val();

                if (tiid) {

                    $("#noConnectionModal input[name='CheckInternetConLastTIID']").val("")
                    TogglerTaskPeekClick(tiid)
                }
            }
            else if (data == "no") {
                window.location.reload();
            }
        }
    });
}

$.fn.hasHVScrollBar = function () {
    var e = this.get(0);
    return {
        vertical: e.scrollHeight > e.clientHeight,
        horizontal: e.scrollWidth > e.clientWidth
    };
}

function clearPostState() {
    if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }
}

function setLITHeaderResponsiveDesign() {

    //if list page
    var isListPageOpen = $('#right-1').attr('is-open') == "true" || $('#right-3').attr('is-open') == "true";
    var isTaskPageOpen = $('#kt_quick_panel').is('.kt-quick-panel--on') == true;

    if (isTaskPageOpen == true || isListPageOpen == true) {

        var containerCssName = ".litheadbarwrap";
        if (window.location.href.indexOf('Task/Details') > 0) {
            containerCssName = ".litheadbarwrap-taskdetail";
        }

        try {
            if (typeof allTableDidIds !== "undefined") {

                for (var i = 0; i < allTableDidIds.length; i++) {

                    var _didId = allTableDidIds[i];

                    var noBorderWidth = $(".newTableContainer[did='" + _didId + "'] .no-border-thwdth").width();

                    noBorderWidth = (noBorderWidth + 0.5)

                    if (noBorderWidth > 0) {

                        $(containerCssName + "[did='" + _didId + "'] .headbar-row").css("padding-left", noBorderWidth + "px");
                        $(containerCssName + "[did='" + _didId + "'] .headerItem-search").css("padding-right", noBorderWidth + 20 + "px");
                        //console.log(noBorderWidth)
                    }

                }
            }
        } catch (e) {

        }
    }
}

function CreateStickyLITHeader(did) {

    if (isIE11() == false) {

        var containerCssName = ".litheadbarwrap";

        if (window.location.href.indexOf('Task/Details?Type=peek') > 0) {
            $('.litheadbarwrap').removeClass('litheadbarwrap').addClass('litheadbarwrap-taskdetailpeek');
            containerCssName = ".litheadbarwrap-taskdetailpeek";
        }
        else if (window.location.href.indexOf('Task/Details') > 0) {
            $('.litheadbarwrap').removeClass('litheadbarwrap').addClass('litheadbarwrap-taskdetail');
            containerCssName = ".litheadbarwrap-taskdetail";
        }
        else if (window.location.href.indexOf('Search/Detail') > 0) {
            $('.litheadbarwrap').removeClass('litheadbarwrap').addClass('litheadbarwrap-searchdetail');
            containerCssName = ".litheadbarwrap-searchdetail";
            $("table .fileContainer span").css("pointer-events", "visible")
            $(".litheadbarwrap-searchdetail").hide();
            return;

        } else if (window.location.href.indexOf('Partials/ProcessesCompletedByMe') > 0) {
            $("table .fileContainer span").css("pointer-events", "visible")
            $(".litheadbarwrap").hide();
            return;

        } else if (window.location.href.indexOf('Partials/ProcessesCreatedByMe') > 0) {
            $("table .fileContainer span").css("pointer-events", "visible")
            $(".litheadbarwrap").hide();
            return;
        }
        else if (window.location.href.indexOf('Partials/ProcessesIncludedByMe') > 0) {
            $("table .fileContainer span").css("pointer-events", "visible")
            $(".litheadbarwrap").hide();
            return;
        }

        if ($(containerCssName + "[did='" + did + "']").html().indexOf("clonedTable_" + did) < 0) {
            $(containerCssName + "[did='" + did + "']").append("<div id='clonedTableId_" + did + "' class='clone-table clonedTable_" + did + "'></div>");
        }

        var clonedTableHtml = $(".newTableContainer[did='" + did + "']").clone(true);

        $(".clonedTable_" + did).html(clonedTableHtml);

        $(".clonedTable_" + did + " tbody").remove();
        $(".clonedTable_" + did + " .newTableContainer").addClass("sticky-tableheader_" + did);

        var newId = $(".sticky-tableheader_" + did).attr("id").replace("dragdrop", "sticky-table");
        var index = newId[newId.length - 1];
        $(".sticky-tableheader_" + did).prop('id', newId);

        $(".sticky-tableheader_" + did + " .all-table").removeAttr('id');

        $(".litheadbarwrap .loader").remove()

        $('#dragdrop-' + index).on('scroll', function () {
            $(".sticky-tableheader_" + did).scrollLeft($(this).scrollLeft());
        });

        $(".sticky-tableheader_" + did).css({ 'cssText': 'overflow-x: hidden !important;' });

        if (document.documentMode || /Edge/.test(navigator.userAgent)) {
            $(".row-except-ie").removeClass("row")
        }

        setInterval(function () {

            setLITHeaderResponsiveDesign();
            //CheckLITHeaderStickyEventFiredOrNot(index, containerCssName, did);
            CheckLITHeaderStickyEventStartStop(index, did);
            CheckLITFooterStickyEventFiredOrNot(index, did);

        }, 350);
    }
}

function CheckLITHeaderStickyEventStartStop(index, did) {

    try {
        var topoffset = $("#clonedTableId_" + did).offset().top;
        var bottomoffset = $("#litstickybottom-distance_" + did).offset().top;
        var distance = (bottomoffset - topoffset) - 120;

        if (distance < 0) {
            $("#clonedTableId_" + did).css('visibility', 'hidden');
        }
        else {
            $("#clonedTableId_" + did).css('visibility', 'unset');
        }
    } catch (e) {

    }
}

function CheckLITHeaderStickyEventFiredOrNot(index, containerCssClass, did) {

    containerCssClass = containerCssClass + "[did='" + did + "']";

    //Is LIT Sticky event fire

    var o1 = $("#dragdrop-" + index).offset();
    var o2 = $("#sticky-table-" + index).offset();
    var dx = o1 == null ? 0 : o1.left - (o2 == null ? 0 : o2.left);
    var dy = o1 == null ? 0 : o1.top - (o2 == null ? 0 : o2.top);
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (
        ($('#detailPanelPartial').hasClass("work-mode") == true
            || $('#detailPanelPartial').hasClass("list-mode") == true
            || window.location.href.indexOf('Task/Details?Type=work') > 0)
        && !$('#netoloji-grid-loader-' + did).is(':visible')) {

        if (distance == 0) {
            // Event not fired
            $(containerCssClass).css("background", "unset")
        }
        else {
            // Event fired
            $(containerCssClass).css("background", "white")
        }
    }
}

function CheckLITFooterStickyEventFiredOrNot(index, did) {

    //Is LIT Sticky event fire
    var o1 = $(".litstickybottom-distance" + "[did='" + did + "']").offset();
    var o2 = $(".litstickybottom" + "[did='" + did + "']").offset();

    var dx = o1 == null ? 0 : o1.left - (o2 == null ? 0 : o2.left);
    var dy = o1 == null ? 0 : o1.top - (o2 == null ? 0 : o2.top);
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (!$('#netoloji-grid-loader-' + did).is(':visible')) {

        var litstickybottomElement = $(".litstickybottom" + "[did='" + did + "']");
        var litbottomcontainerElement = $(".litbottomcontainer" + "[did='" + did + "']");
        var litbottomrowElement = $(".litbottomrow" + "[did='" + did + "']");
        var isLeftMenuProcessPage = (window.location.href.indexOf('Partials') > 0);

        var maxDistance = 30;

        if (isLeftMenuProcessPage == true) {

            litbottomcontainerElement.css("margin-bottom", "0").css("padding-bottom", "0").css("padding-top", "0")
            $(".litstickybottom-peek").css("bottom", "47px");
            maxDistance = (maxDistance + 20);
            $(".litbottomcontainerrow").css("margin-top", "0px");
        }

        //Footer is sticky
        if (distance > (maxDistance)) {

            var mainScrollDiv = $('#dragdrop-' + index).get(0);
            if (mainScrollDiv) {

                var sW = mainScrollDiv.scrollWidth;
                var cW = mainScrollDiv.clientWidth;

                litstickybottomElement.css("background", "white");
                litbottomcontainerElement.css("background", "white");

                if (sW == cW) {
                    //no-scroll
                    litstickybottomElement.css("overflow-y", "unset").css("height", "10px");
                }
                if (sW > cW) {
                    //scroll
                    litstickybottomElement.css("overflow-y", "auto").css("height", "20.1px");
                    litbottomrowElement.css("width", sW + "px")
                    litstickybottomElement.scrollLeft($('#dragdrop-' + index).scrollLeft());
                    litstickybottomElement.on('scroll', function () {
                        $('#dragdrop-' + index).scrollLeft($(this).scrollLeft());
                    });

                }
            }
        }
        else {
            //Footer is not sticky
            litstickybottomElement.css("overflow-y", "unset").css("height", "10px").css("background", "unset");
            litbottomrowElement.css("width", "unset")
            litbottomcontainerElement.css("background", "unset");
        }
    }
}

function LitStickyHeaderPreviewMode() {
    if (IsPreviewPage() == true) {

        //$(".litheadbarwrap").css("margin-bottom", "-85px")
        //$(".litheadbarwrap-taskdetail").css("margin-bottom", "-85px")
        //$(".litheadbarwrap-searchdetail").css("margin-bottom", "-90px")
        $(".headerItemPosition-newLine").hide();
        $(".headerItemPosition-search").hide();
    }
}

function Select2CustomMatcher(params, data) {

    if ($.trim(params.term) === '') {
        return data;
    }
    if (data.text.toLowerCase().indexOf(params.term.toLowerCase()) > -1) {
        return data;
    }
    return null;
}

function IsPreviewPage() {

    if (window.location.href.indexOf('Search/Detail') > 0 ||
        window.location.href.indexOf('Partials/ProcessesCreatedByMe') > 0 ||
        window.location.href.indexOf('Partials/ProcessesIncludedByMe') > 0 ||
        window.location.href.indexOf('Partials/ProcessesCompletedByMe') > 0 ||
        $('#detailPanelPartial').hasClass("peek-mode") == true ||
        window.location.href.indexOf('Task/Details?Type=peek') > 0) {

        return true;
    }
    else {
        return false;
    }
}

function CreateStickyLITFooterDesign() {

    if (isIE11() == false) {

        var litstickybottomElement = $(".litstickybottom");
        var litbottomcontainerElement = $(".litbottomcontainer");

        if (IsPreviewPage() == true) {

            litstickybottomElement.addClass('litstickybottom-peek').removeClass('litstickybottom-work');
            litbottomcontainerElement.addClass('litbottomcontainer-peek').removeClass('litbottomcontainer-work');
        }
        else {

            litstickybottomElement.addClass('litstickybottom-work').removeClass('litstickybottom-peek');
            litbottomcontainerElement.addClass('litbottomcontainer-work').removeClass('litbottomcontainer-peek');
        }

    }
}

String.prototype.replaceAllStr = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function isIE11() {
    var checkIE11 = !!navigator.userAgent.match(/Trident.*rv\:11\./);
    return checkIE11;
}

function FixTaskDetailViewForIE11(isModal) {

    if (isIE11() == true) {

        var leftInt = -100; if (isModal == false) { leftInt = (leftInt * 2) }
        $('#divAllowReassignSection').css({ 'cssText': 'float:unset; margin-left: 20px;' });
        $('#divAllowReassignSection .reassignTask').css({ 'cssText': 'margin-left:' + leftInt + 'px !important' });
    }
}

function NetolojiFilterApplyLastFilter() {

    //Seçili mevcut filtreyi çek
    var lastFilterParams = JSON.parse(localStorage.getItem("v3101_EflwFltrTasks"))

    //Seçili filtreyi uygulayıp sonuç döndür
    var postModelArray = [];
    for (var i = 0; i < lastFilterParams.length; i++) {

        var paramItem = lastFilterParams[i];

        var filterModel = {
            ProcessType: 4,
            CID: paramItem.SelectedCourseId,
            FilterText: paramItem.searchParamVal,
            DID: paramItem.SelectedElementId,
            Type: paramItem.SelectedElementType,
            ColName: paramItem.SelectedElementName,
            SubType: paramItem.SelectedGridColumnSubType,
            ColOrder: paramItem.SelectedElementOrder,
            FilterResultIdList: '',
            MatchType: paramItem.matchType
        };

        postModelArray.push(filterModel);
    }

    if (postModelArray.length > 0) {

        $.ajax({
            type: 'POST',
            contentType: "application/json;charset=utf-8",
            headers: { '__RequestVerificationToken': getAntiForgeryTokenId() },
            data: JSON.stringify({ filters: postModelArray }),
            traditional: true,
            url: '/Partials/DismissSearchParam',
            success: function (data) {

                if (data.length > 0) {
                    var result = data.join(',');
                    //Dönen sonucu v3101_EflwFltrTasks_result localStorage ına set et
                    localStorage.setItem("v3101_EflwFltrTasks_result", result);
                }
            }
        });
    }
}

function MapDesignElemens() {
    $('#dataElementMapWrapper .designMap').each(function (index, value) {
        var currentControlName = $(this).attr("control-name");
        $("#data_" + currentControlName).html(value);
    });
    $(".labelElement").parent().parent().parent().find("span").hide();

    $(".designMap").each(function (index, element) {
        var displayName = $(this).attr("display-name");
        var controlName = $(this).attr("control-name");
        $("#ctrlName_data_" + controlName).text(displayName);

        if ($(this).hasClass("hide")) { $(this).closest("td").hide(); }
        else { $(this).closest("td").show(); }

    });
    $(".textinput").closest("td").html("");
}
function MapDesignElemensSub() {
    $('#dataElementMapWrapper-sub .designMap-sub').each(function (index, value) {
        var currentControlName = $(this).attr("control-name");
        $("#subdata_" + currentControlName).html(value);
    });
    $(".labelElement").parent().parent().parent().find("span").hide();

    $(".designMap-sub").each(function (index, element) {
        var displayName = $(this).attr("display-name");
        var controlName = $(this).attr("control-name");
        $("#ctrlName_subdata_" + controlName).text(displayName);

        if ($(this).hasClass("hide")) { $(this).closest("td").hide(); }
        else { $(this).closest("td").show(); }

    });
    $(".textinput").closest("td").html("");
}

function openTab(evt, tabName, uniqueId, subText, mapCss, useFlex) {

    SetDesignElementLineItemSize(".tabcontentwrap-" + uniqueId);

    if (useFlex == 'true') {
        var tt = setInterval(function () { $('.flex-input').flexible(); }, 500);
        setTimeout(function () { clearInterval(tt); }, 3000);
    }
}

function getDatePickerPosition(formName, did) {

    //debugger
    //Aşağı
    var pickerPositionStr = "bottom-right";

    var dateTopOffset = 0;
    var distance = 0;

    var elementTopOffset = $('input[data-did=' + did + ']').offset().top;
    var formTopOffset = $("#" + formName).offset().top;

    if (window.location.href.toLowerCase().indexOf('/lists/list') != -1) {
        dateTopOffset = elementTopOffset;
        distance = 275;
    }
    else {
        dateTopOffset = (elementTopOffset - formTopOffset);
        distance = 275;
    }

    if (dateTopOffset > distance) {
        //Yukarı
        pickerPositionStr = "top-right";
    }

    //console.log(dateTopOffset + "_" + did + "_" + pickerPositionStr);

    return pickerPositionStr;
}

function hideDateElementOnScroll() {
    $(function () {
        $('.kt-quick-panel').scroll(function () { hideAndBlurDateElements(); });
        $(window).scroll(function () { hideAndBlurDateElements(); });

        function hideAndBlurDateElements() {
            $(".datetimepicker1").datetimepicker('hide');
            $(".net-picker").datetimepicker('hide');
            $(".net-picker").blur();
            $(".datetimepicker1").blur();
        }
    });
}

function SetDesignElementWidthSize(rootCss) {

    //$(document).ready(function () {
    //    $(rootCss + ' .newTableContainer').each(function (i, obj) {
    //        var did = $(this).attr("did");
    //        var parentSize = $(".grid-focus-border_" + did).width();
    //        $(".stickyheadwrap_" + did).width(parentSize);
    //        $(this).width(parentSize);
    //        console.log(parentSize)
    //        $(this).show();
    //    });
    //});
}

function SetDesignElementLineItemSize(rootCss) {

    //$(rootCss + ' .newTableContainer').each(function (i, obj) {
    //    $(this).hide();
    //    $(this).width(0);
    //});

    //setInterval(function () { SetDesignElementWidthSize(rootCss); }, 500);
}

async function ocrCreateConfirm(message) {
    return new Promise((complete, failed) => {
        $('#confirmationProcessFilterModal .confirmationProcessLabel').html(message);
        $('#confirmationProcessFilterModal .btn-ok').off('click');
        $('#confirmationProcessFilterModal .btn-calcel').off('click');
        $('#confirmationProcessFilterModal .btn-ok').on('click', () => { $('#confirmationProcessFilterModal').modal('hide'); complete(true); });
        $('#confirmationProcessFilterModal .btn-calcel').on('click', () => { $('#confirmationProcessFilterModal').modal('hide'); complete(false); });
        $('#confirmationProcessFilterModal').modal('show');
    });
}
async function confirmClearMatchedData(canceledDid) {
    var _cconfirm = await ocrCreateConfirm(EFlang.Clean_Up_OCR_Filled_Fields);
    if (_cconfirm) { clearMatchedInputs(canceledDid); }
}
function clearMatchedInputs(canceledDid) {
    var machedDidList = ocrDocumentDidList.filter(k => k.Did == canceledDid && k.IsMatch == true).map(function (obj) {
        return obj.MatchedDidList;
    });
    if (machedDidList != undefined && machedDidList.length > 0) {
        for (var i = 0; i < machedDidList[0].length; i++) {
            switch (machedDidList[0][i].Type) {
                case 1:
                case 11:
                case 16:
                case 3:
                case 2:
                    var inpt = $("input[data-did='" + machedDidList[0][i].Id + "']");
                    if (inpt.length > 0) {
                        inpt.val(machedDidList[0][i].Type == 2 ? 0 : "");
                    }
                    break;
                case 5:
                case 12:
                    var inpt = $("textarea[data-did='" + machedDidList[0][i].Id + "']");
                    if (inpt.length > 0) {
                        inpt.val("")
                    }
                    break;
                case 8:
                    var _litOcr = document.getElementById('netoloji-grid-' + machedDidList[0][i].Id);
                    try {
                        if (_litOcr !== null) {
                            var formData = new FormData();
                            formData.append("gridId", machedDidList[0][i].Id);
                            formData.append("Info", $("#tempInfo-" + machedDidList[0][i].Id).html());
                            $.ajax({
                                type: "POST",
                                url: '/NewLineItemTable/AllRowDelete',
                                data: formData,
                                dataType: 'json',
                                async: true,
                                contentType: false,
                                processData: false,
                                success: function (response) {
                                    var did = response.did;
                                    var pageNumber = 1;
                                    var rowCount = 0;
                                    $("#pagination-" + did + "").attr("rowcount", rowCount);
                                    $("#netoloji-grid-" + did + " .rowSearchBar input").prop("disabled", true);
                                    var pageLink = $('#pagination-' + did + ' li:nth-child(' + pageNumber + ')').find("a")[0];
                                    $('#tempInfo-' + did).html("");
                                    $('#tempInfo-' + did).html(response.Info);
                                    $('#netoloji-grid-' + did + ' tbody').html('');
                                    $('#row-sc-' + did + ' span').html("");
                                    $('#row-sc-' + did + ' span').html(response.formattedFooterDataResult);

                                    $(pageLink).trigger('click');
                                    $(pageLink).parent().addClass('active');

                                    $('#row-count-' + did).hide();

                                    var description = $("#row-sc-" + did + "").html();
                                    if (description) {
                                        var sublineCol = $("#row-sc-" + did + "").attr('sccol');
                                        if (sublineCol) {
                                            var sublineFormul = $("#row-sc-" + did + "").attr('scprocess');
                                            SubLinePrecess(did, sublineCol, sublineFormul);
                                        }
                                    }
                                }
                            });
                        }
                        else {
                            $('#netoloji-grid-' + _el.MatchedDid + ' tbody').html('');
                        }
                    } catch (e) { }
                    break;
            }
        }
        ocrDocumentDidList = ocrDocumentDidList.filter(obj => obj.Did !== canceledDid);
    }
}

function StartDashCourse(courseName, event, cid, aid, moveTo = false) {

    if ($(event.target).hasClass('fa-paint-brush') == false &&
        $(event.target).hasClass('btnCustomizeCard') == false) {

        Swal.fire({
            title: startDashCourseConfirm,
            text: courseName + " " + willStart,
            showCancelButton: true,
            confirmButtonColor: '#0abb87',
            cancelButtonColor: '#fd397a',
            confirmButtonText: startText,
            cancelButtonColor: '#fd397a',
            cancelButtonText: cancelText
        }).then((result) => {

            if (result.value) {

                if (aid != null) {

                    $.ajax({
                        url: "/Partials/StartCourse",
                        type: "GET",
                        data: { "AID": aid, "TimeOut": 5000 },
                        success: function (d) {

                            var data = jQuery.parseJSON(JSON.stringify(d));

                            if (data.Redirect == true) {

                                TaskClick(data.TIID, true);

                                if (moveTo == true) {
                                    try {
                                        var moveIndex = $('#998 div[cid-data=' + cid + ']').parent().index();
                                        $('#998 li:eq(' + moveIndex + ')').prependTo("#998 .widget-grid-wrapper");
                                    } catch (e) { }
                                }
                            }
                        },
                        timeout: 5000,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        cache: false
                    });
                }
            }
        });
    }
}

function DownloadDashDocument(docId, docName) {

    //Swal.fire({
    //    title: downloadDashDocumentConfirm,
    //    text: docName + " " + willDownload,
    //    showCancelButton: true,
    //    confirmButtonColor: '#0abb87',
    //    cancelButtonColor: '#fd397a',
    //    confirmButtonText: downloadText,
    //    cancelButtonColor: '#fd397a',
    //    cancelButtonText: cancelText
    //}).then((result) => {

    //    if (result.value) {
    window.location = "/Task/DownloadDocument?documentid=" + docId;
    //    }
    //});
}

function RedirectListPage(courseName, cid) {

    //Swal.fire({
    //    title: redirectListPageConfirm,
    //    text: courseName + " " + listRedirect,
    //    showCancelButton: true,
    //    confirmButtonColor: '#0abb87',
    //    cancelButtonColor: '#fd397a',
    //    confirmButtonText: openListText,
    //    cancelButtonColor: '#fd397a',
    //    cancelButtonText: cancelText
    //}).then((result) => {

    //    if (result.value) {
    window.open('/Lists/List/' + cid, '_blank');
    //    }
    //});
}

function RedirectReportPage(reportName, id) {

    //Swal.fire({
    //    title: redirectReportPageConfirm,
    //    text: reportName + " " + reportRedirect,
    //    showCancelButton: true,
    //    confirmButtonColor: '#0abb87',
    //    cancelButtonColor: '#fd397a',
    //    confirmButtonText: openReportText,
    //    cancelButtonColor: '#fd397a',
    //    cancelButtonText: cancelText
    //}).then((result) => {

    //    if (result.value) {
    window.open(`/Reports/EditXReport/${id}?edit=False`, '_blank');
    //    }
    //});
}

function RedirectPanelReportPage(reportName, id) {

    //Swal.fire({
    //    title: redirectReportPageConfirm,
    //    text: reportName + " " + reportRedirect,
    //    showCancelButton: true,
    //    confirmButtonColor: '#0abb87',
    //    cancelButtonColor: '#fd397a',
    //    confirmButtonText: openReportText,
    //    cancelButtonColor: '#fd397a',
    //    cancelButtonText: cancelText
    //}).then((result) => {

    //    if (result.value) {
    window.open(`/Reports/DashboardViewer/${id}`, '_blank');
    //    }
    //});
}

function RedirectCoursesByStartCounts(type, text, event, filter) {

    if ($(event.target).hasClass('fa-paint-brush') == false &&
        $(event.target).hasClass('btnCustomizeCard') == false) {

        var filterStr = "";

        // != All
        if (filter != 0) {
            filterStr = "?filter=" + type + "$" + filter;
        }

        if (type == 0) {
            window.open(`/Partials/ProcessesCreatedByMe` + filterStr, '_blank');
        }
        else if (type == 1) {
            window.open(`/Partials/ProcessesIncludedByMe` + filterStr, '_blank');
        }
        else {
            window.open(`/Partials/ProcessesCompletedByMe` + filterStr, '_blank');
        }
    }
}

function ActivityItemClick(id, type, val) {

    if (type == "ProcessStart") {
        window.open('/Partials/ProcessesCreatedByMe?filter=' + id, '_blank');
    }
    else if (type == "ProcessComplate") {
        window.open('/Partials/ProcessesCompletedByMe?filter=' + id, '_blank');
    }
    else if (type == "DocumentShow") {
        previewDocument(id, parseInt(val))
    }
    else if (type == "ListRowViewed" || type == "ListRowUpdated" || type == "ListStart") {

        var cid = id.split("-")[0]
        var ciid = id.split("-")[1]

        window.open('/Lists/List/' + cid + "?form=" + ciid, '_blank');
    }
    else if (type == "ListPageViewed") {
        window.open('/Lists/List/' + id, '_blank');
    }
    else if (type == "ReportShow") {

        if (val == "Rapor") {
            window.open('/Reports/EditXReport/' + id, '_blank');
        }
        else if (val == "Pano") {
            window.open('/Reports/DashboardViewer/' + id, '_blank');
        }
    }
}

function getValidDecimalSeparator(locale) {
    const numberWithDecimalSeparator = 1.1;
    return Intl.NumberFormat(locale)
        .formatToParts(numberWithDecimalSeparator)
        .find(part => part.type === 'decimal')
        .value;
}

function getValidNumberGroupSeparator(locale) {
    const numberWithDecimalSeparator = 1000.1;
    var res = Intl.NumberFormat(locale)
        .formatToParts(numberWithDecimalSeparator)
        .find(part => part.type === 'group');
    return res != undefined ? res.value : ".";
}

function ValidateNumericInput(evt, lang) {

    var culture = lang;

    //Temp code until az decimal separator change.
    if (culture == "az") {
        if (evt.code == "NumpadDecimal") {
            var enteredText = $(evt.currentTarget).val();
            if (enteredText.indexOf(".") == -1) {
                $(evt.currentTarget).val(enteredText + '.');
            }
            return false;
        }
    }

    var decimalSepCode = getValidDecimalSeparator(culture).charCodeAt(0);
    var groupSepCode = getValidNumberGroupSeparator(culture).charCodeAt(0);
    var charCode = (evt.which) ? evt.which : event.keyCode;
    var decimalsep = String.fromCharCode(decimalSepCode);
    var _value = $(evt.currentTarget).val();
    if (_value.toString().indexOf(String.fromCharCode(45)) > -1 && charCode == 45) return false;
    if ((charCode != decimalSepCode && charCode == groupSepCode) || (charCode == decimalSepCode && _value.indexOf(decimalsep) > -1)) {
        return false;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode > 46 || charCode < 44)) {
        return false;
    } else {
        return true;
    }
}

function ChangeTasksByCompletionPane(day, month, year, ddmmyyyy) {

    $(".isTasksUrgentDeadlines #spnCurrentDay").html(day + "." + month + "." + year);

    $("#tbc-load-spinner").show();
    $.ajax({
        type: 'GET',
        dataType: "html",
        cache: false,
        url: '/DashboardPanel/GetTasksByCompletionDateItem',
        data: {
            day: day,
            month: month,
            year: year
        },
        success: function (data) {

            $("#tbc-load-spinner").hide();

            if (data == "no-data") {

                $("#tabContentCompletionDate").html(`
                <div class="alert no-task-day-alert kt-margin-t-10">
                <div class="alert-icon">
                <i class="flaticon-like"></i>
                </div>
                <div class="alert-text">${noTaskForCurrentDay}</div> </div>`);
            }
            else {
                $("#tabContentCompletionDate").html(data);
                $(".tab-pane-active").attr("id", `tasks_for_${ddmmyyyy}`);
            }
        }
    });
}

window.addEventListener('message', (event) => {
    if (event.data && event.data.directSignId != null && event.data.isSuccess == true && document.body.contains(document.getElementById("task_modal_esignature"))) {
        setTimeout(() => {
            $('#task_modal_esignature').modal('hide');
        }, 2000);
    }
});

function SearchInChildOptions(params, data) {
    var term = params.term || '';
    if (!term) {
        return data;
    }
    term = term.toLowerCase();
    if (data.children && data.children.length > 0) {
        var modifiedData = $.extend({}, data, true);
        modifiedData.children = modifiedData.children.filter(function (child) {
            var childText = (child.text || '').toLowerCase();
            var childValue = child.id || '';
            return childValue !== '' && childText.indexOf(term) !== -1;
        });
        if (modifiedData.children.length > 0) {
            return modifiedData;
        }
    } else {
        var text = (data.text || '').toLowerCase();
        var value = data.id || '';
        if (value !== '' && text.indexOf(term) !== -1) {
            return data;
        }
    }
    return null;
}
function parseIntOrDefault(value, defaultValue = 1) {
    return value ? parseInt(value, 10) || defaultValue : defaultValue;
}
