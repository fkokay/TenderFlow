var loadMoreSize = 20;
var statusItems = [];
var statusCounts = [];
var dragInProgress = "No";

$(() => {
    getKanban();

    updateLabelsEvent();
    clearLabelModalEvent();
    showLabelFormEvent();
    showHideCardEditIconEvent();

    function loadMoreEvent() {

        var scrolled = true;

        $('.scroll-status .dx-scrollable-container').on("scroll", function () {

            let lastScrollTop = 0;
            var element = this;

            if (element.scrollTop < lastScrollTop) {
                // upscroll 
                return;
            }

            lastScrollTop = element.scrollTop <= 0 ? 0 : element.scrollTop;
            if (element.scrollTop + element.offsetHeight >= (element.scrollHeight - 20)) {

                if (scrolled) {
                    scrolled = false;

                    try {
                        var currentStatus = element.closest('.scroll-status').id;
                        if (dragInProgress == "No") {
                            loadMore(currentStatus);
                        }
                        dragInProgress = "No";
                    } catch (e) { }
                };

                setTimeout(function () { scrolled = true; }, 1000);
            }
        });
    }

    function getKanban() {
        $.ajax({
            url: '/Lists/GetKanban/',
            type: 'Get',
            contentType: "application/json",
            dataType: "json",
            data: {
                "cid": cidJsVal,
                "size": loadMoreSize,
                "filter": lastFilterIds

            },
            success: function (response) {

                dbLabelData = response.labelData;
                var canMove = response.canMove;

                if (NetolojiFilter.HasReturnResultAtLocalStorage() == true) {
                    canMove = false;
                }

                if (response.statusItems.length == 0) {
                    hideKanbanLoading();
                    return;
                }

                statusItems = [];
                statusCounts = [];

                for (var i = 0; i < response.statusItems.length; i++) {

                    var splitItems = response.statusItems[i].split("¿¿");
                    var statusName = splitItems[0].trim();
                    var itemCount = splitItems[1] == null ? "0" : splitItems[1].trim();
                    var model = { statusName: statusName, itemCount: itemCount };
                    statusCounts.push(model);
                    statusItems.push(statusName);
                }

                renderKanban($("#kanban"), statusItems);

                loadMoreEvent();

                function renderKanban($container, statuses) {

                    //Kanban status render
                    statuses.forEach((status) => {
                        renderList($container, status);
                    });

                    $container.addClass('scrollable-board').dxScrollView({
                        direction: 'horizontal',
                        showScrollbar: 'always'
                    });

                    $container.addClass('sortable-lists').dxSortable({
                        filter: '.list',
                        itemOrientation: 'horizontal',
                        handle: '.list-title',
                        moveItemOnDrop: canMove,
                        onDragEnd: function (e) {
                            if (canMove == true) {
                                $.ajax({
                                    type: 'POST',
                                    cache: false,
                                    contentType: 'application/json',
                                    dataType: 'json',
                                    data: JSON.stringify({
                                        fromIndex: e.fromIndex,
                                        toIndex: e.toIndex,
                                        cid: cidJsVal
                                    }),
                                    url: '/Lists/MoveKanbanStatus',
                                    success: function (data) { }
                                });
                            }
                        },
                        scrollSensivity: 30
                    });
                }

                function renderList($container, status) {

                    var parentDiv = "<div class='scroll-status' id='" + status + "'>";
                    const $list = $(parentDiv).addClass('list').addClass('root-status').appendTo($container);

                    renderListTitle($list, status);

                    const listTasks = response.data.filter((task) => task.Task_Status === status);

                    renderCards($list, listTasks, status);

                    var bottomDiv = $("[id='" + status + "'] .header-count");
                    $(bottomDiv).html(statusHeaderHtml(statusCounts, status));
                }

                function renderListTitle($container, status) {

                    var titleHtml = `<div class='header-text'> ${status}</div><button onclick = "TogglerUserItemClick(${cidJsVal}, '${status}')" class='btn btn-sm add-sortable-card-main'> <i class='fa fa-plus'></i></button>`;

                    $('<div>')
                        .addClass('list-title')
                        .addClass('dx-theme-text-color')
                        .addClass('col-header')
                        .html(titleHtml)
                        .appendTo($container);

                    $('<div>')
                        .addClass('header-count')
                        .html(`<div class='header-count'>???</div>`)
                        .appendTo($container);
                }

                function renderCards($container, tasks, status) {

                    const $scroll = $('<div>').appendTo($container);
                    const $items = $('<div>').appendTo($scroll);

                    //Kanban card render
                    tasks.forEach((task) => {
                        renderCard($items, task);
                    });

                    $scroll.addClass('scrollable-list').dxScrollView({
                        direction: 'vertical',
                        showScrollbar: 'always'
                    });

                    const sortable = $items.addClass("sortable-cards").dxSortable({
                        group: "tasksGroup",
                        moveItemOnDrop: canMove,
                        data: tasks,
                        onInitialized: function (e) {
                            hideKanbanLoading();
                        },
                        onDragStart: function (e) {

                            dragInProgress = "Yes";

                            try {
                                var canMove = true;

                                var dataItem = $.grep(e.fromData, function (v) {
                                    return v.Task_ID === parseInt(e.itemElement[0].id);
                                });

                                if (dataItem.length > 0) {
                                    var elem = dataItem[0].Can_Move;
                                    canMove = elem;
                                }
                               
                                if (NetolojiFilter.HasReturnResultAtLocalStorage() == true) {
                                    canMove = false;
                                }

                                if (canMove == false) {
                                    e.cancel = true;
                                }
                            } catch (e) { }

                        },
                        onDragEnd: function (e) {

                            if (canMove == true) {
                                setTimeout(function () {

                                    var moveItemId = parseInt(e.itemElement[0].id);
                                    var toStatus = e.toComponent.kanbanStatus;
                                    var fromStatus = e.fromComponent.kanbanStatus;

                                    var fromOrderIds = [];
                                    var toOrderIds = [];

                                    $(`#kanban div[id='${fromStatus}'] .sortable-cards .kanban-card`).each(function (index) { fromOrderIds.push(index + '-' + this.id); });

                                    $(`#kanban div[id='${toStatus}'] .sortable-cards .kanban-card`).each(function (index) { toOrderIds.push(index + '-' + this.id); });

                                    //MoveKanbanCard
                                    var data = {
                                        fromOrders: fromOrderIds.join(","),
                                        toOrders: toOrderIds.join(","),
                                        cid: cidJsVal,
                                        moveid: moveItemId,
                                        fromStatus: fromStatus,
                                        toStatus: toStatus,
                                        fromStatusCount: fromOrderIds.length
                                    };

                                    $.ajax({
                                        type: 'POST',
                                        cache: false,
                                        dataType: 'json',
                                        data: data,
                                        url: '/Lists/MoveKanbanCard',
                                        success: function (data) { }
                                    });

                                    //ListStart
                                    $.ajax({
                                        type: "POST",
                                        url: "/Task/ListStart",
                                        dataType: "json",
                                        data: { 'CIID': moveItemId, 'ActType': 1 }
                                    });

                                    //From To Status..
                                    changeHeaderStatus("move", e.fromComponent.kanbanStatus, e.toComponent.kanbanStatus);

                                }, 50);
                            }
                        }
                    }).dxSortable("instance");

                    sortable.kanbanStatus = status;
                }

                function renderCard($container, task) {

                    const $item = $('<div>')
                        .addClass('kanban-card')
                        .addClass('dx-card')
                        .addClass('dx-theme-text-color')
                        .addClass('item_' + task.Task_ID + ' dx-theme-background-color')
                        .attr('id', task.Task_ID)
                        .appendTo($container);

                    var selectedLabels = '';

                    if (task.Selected_Labels != '') {

                        var labels = task.Selected_Labels.split("|");

                        for (var i = 0; i < labels.length; i++) {

                            try {
                                var currentLabel = response.labelData.List.filter(function (entry) {
                                    return entry.Id === parseInt(labels[i]);
                                });

                                if (currentLabel.length > 0) {
                                    var labelName = currentLabel[0].Text;
                                    var labelColor = currentLabel[0].Color;
                                    var labelId = currentLabel[0].Id;
                                    var labelIdentifier = "label-ident_" + labelId;

                                    var labelHtml = '<span style="background: ' + labelColor + ';color: white;" class="kt-badge kt-badge--inline ' + labelIdentifier + '">' + labelName + '</span>';
                                    selectedLabels += labelHtml;
                                }
                            } catch (e) { }
                        }
                    }

                    var cardFooter = getCardFooterHtml(task.Task_ID, task.Del_Gid, task.Has_Document, task.Has_Note);

                    $('<div onclick="ToggleEditListItemClick(' + task.Task_ID + ')">').addClass('card-labels').html('<div id="labelsid_' + task.Task_ID + '" class="labels">' + selectedLabels + '</div>').appendTo($item);
                    $('<div id="card_desc_' + task.Task_ID + '" class="card-description" onclick="ToggleEditListItemClick(' + task.Task_ID + ')">').addClass('card-subject').text(task.Task_Subject).appendTo($item);
                    $('<div style="cursor: default !important;" class="dx-card__toolbar">').html(cardFooter).appendTo($item);
                }

                function getCardFooterHtml(taskId, dgid, hasDoc, hasNote) {

                    var hasLabels = dbLabelData.List.length > 0;
                    var showDel = dgid == false ? "display:none;" : "";
                    var displayLabels = hasLabels == true ? "" : "display:none;";

                    var displayDoc = hasDoc == true ? "" : "display:none;";
                    var displayNote = hasNote == true ? "" : "display:none;";

                    var footerInline = `<div class='dx__left'> &nbsp; <span style= "${displayNote}" class='dx__comment'> 
                                        <i class='la la-comment'></i></span>
                                        <span style= "${displayDoc}" class='dx__attachments'> <i class='la la-paperclip'></i></span>
                                        </div> <div class='dx__right'> <a href='javascript: void(0)' 
onclick='editLabelClick(${taskId})' style= "${displayLabels}" class='btn btn-icon btn-sm card_tags' title="${labelsLocal}"> 
<i class='la la-tags'></i> </a> <a href='javascript: void(0)' onclick='deleteListRecords(${taskId})' style="${showDel}" 
class='btn btn-icon btn-sm card_remove' title="${deleteLocal}"> <i class='la la-trash'></i></a> </div>`;

                    return footerInline;
                }
            }
        });
    }
});

var dbLabelData;

function addCardToKanban(ciid, status, desc) {

    $.ajax({
        type: 'GET',
        dataType: "json",
        cache: false,
        data: {
            cid: cidJsVal,
            ciid: ciid,
            getLabels: true
        },
        url: '/Lists/GetKanbanCard',
        success: function (result) {

            var labels = "";
            var lblData = result.labels;

            var displayNote = result.hasNote == true ? "" : "display:none;";
            var displayDoc = result.hasDoc == true ? "" : "display:none;";

            var hasNoteHtml = `<span style="${displayNote}" class="dx__comment"> <i class="la la-comment"></i></span>`;
            var hasDocHtml = `<span style="${displayDoc}" class="dx__attachments"> <i class="la la-paperclip"></i></span>`;

            for (var i = 0; i < lblData.length; i++) {

                var lblItem = lblData[i];
                labels += `<span style="background: ${lblItem.Color};color: white;" 
                class="kt-badge kt-badge--inline label-ident_${lblItem.Id}">${lblItem.Text}</span>`;
            }

            $(`#kanban div[id='${status}'] .sortable-cards`)
                .prepend(
                    `<div class="kanban-card dx-card dx-theme-text-color item_${ciid} dx-theme-background-color" id="${ciid}">
<div onclick="ToggleEditListItemClick(${ciid})" class="card-labels"><div id="labelsid_${ciid}" class="labels">${labels}</div>
</div><div id="card_desc_${ciid}" class="card-description card-subject" onclick="ToggleEditListItemClick(${ciid})"> ${desc} </div>
<div class="dx-card__toolbar"><div class="dx__left"> &nbsp; ${hasNoteHtml} ${hasDocHtml}</div>
<div class="dx__right"><a href="javascript: void(0)" onclick="editLabelClick(${ciid})"
style="" class="btn btn-icon btn-sm card_tags" title="${labelsLocal}""> <i class="la la-tags"></i>
</a><a href="javascript: void(0)" onclick="deleteListRecords(${ciid})" style=""
class="btn btn-icon btn-sm card_remove" title="${deleteLocal}""> <i class="la la-trash"></i></a></div></div></div>`);

            var toOrder = [];
            $(`#kanban div[id='${status}'] .sortable-cards .kanban-card`).each(function (index) { toOrder.push(index + '-' + this.id); });

            var data = {
                cid: cidJsVal,
                toStatus: status,
                toOrders: toOrder.join(",")
            };

            changeHeaderStatus("add", "", status);

            //Add card
            $.ajax({
                type: 'POST',
                cache: false,
                dataType: 'json',
                data: data,
                url: '/Lists/ReOrderStatus',
                success: function (data) { }
            });

        }
    });
}

function updateKanbanCard(ciid, status, desc, oldStatus) {

    $.ajax({
        type: 'GET',
        dataType: "json",
        cache: false,
        data: {
            cid: cidJsVal,
            ciid: ciid,
            getLabels: false
        },
        url: '/Lists/GetKanbanCard',
        success: function (result) {

            if (result.hasNote == true) { $(`#${ciid}` + " .dx__comment").show(); }
            else { $(`#${ciid}` + " .dx__comment").hide(); }

            if (result.hasDoc == true) { $(`#${ciid}` + " .dx__attachments").show(); }
            else { $(`#${ciid}` + " .dx__attachments").hide(); }

            var statusChanged = false;

            try {
                if (oldStatus) {
                    if (status) {
                        if (oldStatus != status) {
                            statusChanged = true;
                        }
                    }
                }
            } catch (e) { }

            if (statusChanged == false) {
                $(`#kanban div[id='${status}'] #card_desc_${ciid}`).html(desc);
            }
            else {

                $(`#kanban div[id='${oldStatus}'] #card_desc_${ciid}`).html(desc);
                var elem = $(`#kanban div[id='${oldStatus}'] .sortable-cards #${ciid}`).detach();
                $(`#kanban div[id='${status}'] .sortable-cards`).prepend(elem);

                var fromOrder = [];
                var toOrder = [];
                $(`#kanban div[id='${oldStatus}'] .sortable-cards .kanban-card`).each(function (index) { fromOrder.push(index + '-' + this.id); });
                $(`#kanban div[id='${status}'] .sortable-cards .kanban-card`).each(function (index) { toOrder.push(index + '-' + this.id); });

                var data = {
                    cid: cidJsVal,
                    fromStatus: oldStatus,
                    toStatus: status,
                    fromOrders: fromOrder.join(","),
                    toOrders: toOrder.join(",")
                };

                changeHeaderStatus("move", oldStatus, status);

                //Update card if status changed
                $.ajax({
                    type: 'POST',
                    cache: false,
                    dataType: 'json',
                    data: data,
                    url: '/Lists/ReOrderStatus',
                    success: function (data) { }
                });
            }

        }
    });

}

function displayCardCount(status) {

    var val = $(`#kanban div[id='${status}'] .kanban-card`).length;
    return val;
}

function getCardCountText(displayCount, totalCount) {

    var showingCountText = EFlang.ItemsShowing.replace("{0}", `${displayCount}`);
    var showingCountPercentText = EFlang.ItemsShowing.replace("{0}", `${displayCount}/${totalCount}`)

    var cardCountText = (displayCount == totalCount) ? showingCountText : showingCountPercentText;
    return cardCountText;
}

function loadMore(status) {

    var lastItemOrderId = $(`#kanban div[id='${status}'] .kanban-card`).length;

    var startOrder = parseInt(lastItemOrderId) + 1;
    var totalCount = parseInt(getTotalCount(status));
    var leftItemCount = (totalCount - lastItemOrderId);
    var isLastPage = (leftItemCount) <= loadMoreSize;

    if (startOrder > totalCount) {
        return;
    }

    $.ajax({
        url: '/Lists/GetKanban/',
        type: 'Get',
        contentType: "application/json",
        dataType: "json",
        data: {
            "cid": cidJsVal,
            "size": isLastPage ? leftItemCount : loadMoreSize,
            "startVal": startOrder,
            "statusBy": status,
            "filter": NetolojiFilter.HasReturnResultAtLocalStorage() ? lastFilterIds : ""
        },
        success: function (response) {

            response.data.forEach((card) => {

                var displayNote = card.Has_Note == true ? "" : "display:none;";
                var displayDoc = card.Has_Document == true ? "" : "display:none;";

                var hasNoteHtml = `<span style="${displayNote}" class="dx__comment"> <i class="la la-comment"></i></span>`;
                var hasDocHtml = `<span style="${displayDoc}" class="dx__attachments"> <i class="la la-paperclip"></i></span>`;

                //Map Labels
                var selectedLabels = '';

                if (card.Selected_Labels != '') {

                    var labels = card.Selected_Labels.split("|");

                    for (var i = 0; i < labels.length; i++) {

                        try {
                            var currentLabel = response.labelData.List.filter(function (entry) {
                                return entry.Id === parseInt(labels[i]);
                            });

                            if (currentLabel.length > 0) {
                                var labelName = currentLabel[0].Text;
                                var labelColor = currentLabel[0].Color;
                                var labelId = currentLabel[0].Id;
                                var labelIdentifier = "label-ident_" + labelId;

                                var labelHtml = `<span style="background: ${labelColor}; color: white;" class="kt-badge kt-badge--inline ${labelIdentifier}">${labelName}</span>`;
                                selectedLabels += labelHtml;
                            }
                        } catch (e) { }
                    }
                }

                $(`#kanban div[id='${status}'] .sortable-cards`)
                    .append(
                        `<div class="kanban-card dx-card dx-theme-text-color item_${card.Task_ID} dx-theme-background-color" id="${card.Task_ID}">
<div onclick="ToggleEditListItemClick(${card.Task_ID})" class="card-labels"><div id="labelsid_${card.Task_ID}" class="labels">${selectedLabels}</div>
</div><div id="card_desc_${card.Task_ID}" class="card-description card-subject" onclick="ToggleEditListItemClick(${card.Task_ID})"> ${card.Task_Subject} </div>
<div class="dx-card__toolbar"><div class="dx__left"> &nbsp; ${hasNoteHtml} ${hasDocHtml}</div>
<div class="dx__right"><a href="javascript: void(0)" onclick="editLabelClick(${card.Task_ID})"
style="" class="btn btn-icon btn-sm card_tags" title="${labelsLocal}""> <i class="la la-tags"></i>
</a><a href="javascript: void(0)" onclick="deleteListRecords(${card.Task_ID})" style=""
class="btn btn-icon btn-sm card_remove" title="${deleteLocal}""> <i class="la la-trash"></i></a></div></div></div>`);
            });

            if (response.data.length > 0) {
                loadMoreHeaderHtml(status);
            }
        }
    });
}

function editLabelClick(taskId) {
    $("#kt_label_modal input[name='LabelModalCIID']").val(taskId)
    $('#kt_label_modal').modal('show');
}

function updateLabelsEvent() {

    $('#btn-save-label').click(function () {

        $('#kt_label_modal').modal('hide');

        var ciid = $("#kt_label_modal input[name='LabelModalCIID']").val();

        var selectedLabelIds = [];
        var selectedLabelHtml = "";

        $('#selectLabelForm input:checked').each(function () {

            var labelData = $(this).attr('label-data');
            var labelId = $(this).attr('label-id');

            var array = labelData.split('¿');
            var text = array[0];
            var color = array[1];
            var labelIdentifier = "label-ident_" + labelId;

            selectedLabelHtml += "<span style='background: " + color + "; color: white;' class='kt-badge " + labelIdentifier + " kt-badge--inline'>" + text + "</span>";
            selectedLabelIds.push(labelId);
        });

        var selectedLabelString = selectedLabelIds.join("|");

        var jsonPost = {
            ciid: ciid,
            selectedLabels: selectedLabelString
        };

        $("#labelsid_" + ciid).html(selectedLabelHtml);

        $.ajax({
            type: 'GET',
            cache: false,
            data: jsonPost,
            url: '/Lists/UpdateTaskLabels',
            success: function (data) { }
        });

        //console.log(dbLabelData.List)
        var formLabels = new Array();
        $("#selectLabelForm .edit-label-input").each(function () {
            var labelText = $(this).attr("data-text");
            var labelColor = $(this).attr("bg-color");
            var Id = $(this).attr("Id").replace('kanbanLabel_', '');
            var formLabel = Id + "-" + labelText + "-" + labelColor;
            formLabels.push(formLabel)
        });

        var jsonPostData = {
            cid: cidJsVal,
            formLabels: formLabels.join("|")
        };

        $.ajax({
            type: 'GET',
            cache: false,
            dataType: "json",
            data: jsonPostData,
            url: '/Lists/UpdateLabels',
            success: function (data) {

                //UpdatedLabels Client side
                var labels = data.updatedLabels;

                $.each(labels, function (i, item) {

                    var val = item.split("-");
                    var id = val[0];
                    var text = val[1];
                    var color = val[2];

                    $(".label-ident_" + id).each(function () {
                        $(this).css({ "background": color });
                        $(this).text(text);
                    });

                });
            }
        });

    });
}

function clearLabelModalEvent() {
    //Clear modal
    $('#kt_label_modal').on('hidden.bs.modal', function (e) {
        CalcelEditLabelForm();
    })
}

function deleteListRecords(processId) {

    $("#kt_carddel_modal input[name='CardDelModalCIID']").val(processId)
    $('#kt_carddel_modal').modal('show');
}

function deleteConfDelOk(item) {

    var elem = $('.item_' + item);
    var tStatus = elem.closest('.root-status').attr("id");
    elem.delay(200).fadeOut(200).remove();

    $.ajax({
        url: "/Lists/DeleteListRecords",
        data: { "CIIDs": item },
        success: function () {

            var toOrder = [];

            $(`#kanban div[id='${tStatus}'] .sortable-cards .kanban-card`).each(function (index) { toOrder.push(index + '-' + this.id); });

            var data = {
                cid: cidJsVal,
                toStatus: tStatus,
                toOrders: toOrder.join(",")
            };

            //Card removed
            $.ajax({
                type: 'POST',
                cache: false,
                dataType: 'json',
                data: data,
                url: '/Lists/ReOrderStatus',
                success: function (data) { }
            });

            changeHeaderStatus("delete", "", tStatus);
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false
    });
}

function showLabelFormEvent() {

    $('#kt_label_modal').on('show.bs.modal', function (e) {

        $('#spnLabelSpinner').show();

        var modalCiid = $("#kt_label_modal input[name='LabelModalCIID']").val();

        $.ajax({
            type: 'GET',
            dataType: "html",
            cache: false,
            data: {
                cid: cidJsVal,
                ciid: modalCiid
            },
            url: '/Lists/GetKanbanLabels',
            success: function (data) {

                $('#selectLabelForm').html(data);
                setTimeout(function () { $('#spnLabelSpinner').hide(); }, 500);
            }
        });

    });
}

function showHideCardEditIconEvent() {
    $('.kanban-container').on('mouseover', '.dx-theme-background-color', function (e) {
        $(this).find('.cardedit-showhide').show();
    });

    $('.kanban-container').on('mouseout', '.dx-theme-background-color', function (e) {
        $(this).find('.cardedit-showhide').hide();
    });
}

$.fn.colorSelect = function () {

    if (!this.is('select')) {
        return false;
    }
    var select = this;
    select.hide();

    var multiple = select.prop('multiple');

    var container = createGroup(select)
        .removeClass('color-select-optgroup')
        .addClass('color-select-container')
        .insertAfter(select);

    select.change(function () {
        container.find('.color-select-option')
            .removeClass('color-select-option-selected');

        select.find(':selected').each(function () {
            container.find('.color-select-option[data-color = "' + $(this).attr('value') + '"]')
                .addClass('color-select-option-selected');

        });
    });

    select.change();

    return this;

    function createGroup(parent) {
        var children = parent.children();
        var group = $('<div class="color-select-optgroup" />');
        children.each(function () {
            if ($(this).is('optgroup')) {
                createGroup($(this)).appendTo(group);
            }
            if ($(this).is('option')) {
                createOption($(this)).appendTo(group);
            }
        });
        return group;
    }

    function createOption(option) {
        var color = option.attr('value');

        return $('<div class="color-select-option" />')
            .css('background-color', color)
            .attr('data-color', color)
            .click(function () {
                if (multiple) {
                    select.find('option[value="' + color + '"]').prop('selected', function (i, v) { return !v; });
                }
                else {
                    select.val(color);
                }
                select.change();
            });
    }
};

function statusHeaderHtml(array, status) {

    var statusItem = array.find(item => {
        return item.statusName == status
    })

    var totalCount = statusItem.itemCount;
    var displayCount = displayCardCount(status);
    var cardCountText = "";

    if (displayCount > 0) {
        cardCountText = getCardCountText(displayCount, totalCount);
    }

    var returnHtml = `<code totalCount='${totalCount}' displayCount='${displayCount}' class='cardTotalCount'>${cardCountText}</code>`;

    return returnHtml;
}

function getTotalCount(status) {

    try {
        var count = $(`[id='${status}'] .cardTotalCount`).attr("totalcount");

        if (typeof count === 'undefined') {
            count = 0;
        };

        return count;

    } catch (e) {
        return 0;
    }
}

function loadMoreHeaderHtml(status) {

    var totalCount = getTotalCount(status);
    var cardCount = displayCardCount(status);

    $(`[id='${status}'] .cardTotalCount`).attr("totalcount", totalCount);
    $(`[id='${status}'] .cardTotalCount`).attr("displaycount", cardCount);
    $(`[id='${status}'] .cardTotalCount`).html(`${getCardCountText(cardCount, totalCount)}`);
}

function changeHeaderStatus(type, from, to) {

    var toDisplayCount = parseInt(displayCardCount(to));
    var toTotalCount = $(`[id='${to}'] .cardTotalCount`).attr("totalcount");

    if (typeof toTotalCount === 'undefined') {
        toTotalCount = 0;
    };

    //Yeni ekleme işleminde 1 artar.
    if (type == "add") {

        var newToTotalCount = (parseInt(toTotalCount) + 1);

        $(`[id='${to}'] .cardTotalCount`).attr("totalcount", newToTotalCount);
        $(`[id='${to}'] .cardTotalCount`).attr("displaycount", toDisplayCount);
        $(`[id='${to}'] .cardTotalCount`).html(`${getCardCountText(toDisplayCount, newToTotalCount)}`);

    }
    //Silme işleminde 1 azalır.
    else if (type == "delete") {

        var newToTotalCount = (parseInt(toTotalCount) - 1);

        $(`[id='${to}'] .cardTotalCount`).attr("totalcount", newToTotalCount);
        $(`[id='${to}'] .cardTotalCount`).attr("displaycount", toDisplayCount);

        if (newToTotalCount > 0) {
            $(`[id='${to}'] .cardTotalCount`).html(`${getCardCountText(toDisplayCount, newToTotalCount)}`);
        }
        else {
            $(`[id='${to}'] .cardTotalCount`).html("");
        }
    }
    //Kart sürüklendiğinde eğer status değişti ise from 1 azalır, to 1 artar.
    else if (type == "move") {

        //Statüs değişti.
        if (from != to) {

            //From
            var fromDisplayCount = parseInt(displayCardCount(from));
            var fromTotalCount = $(`[id='${from}'] .cardTotalCount`).attr("totalcount");
            var newFromTotalCount = (parseInt(fromTotalCount) - 1);

            //To
            var newToTotalCount = (parseInt(toTotalCount) + 1);

            //From
            $(`[id='${from}'] .cardTotalCount`).attr("totalcount", newFromTotalCount);
            $(`[id='${from}'] .cardTotalCount`).attr("displaycount", fromDisplayCount);

            if (fromDisplayCount > 0) {
                $(`[id='${from}'] .cardTotalCount`).html(`${getCardCountText(fromDisplayCount, newFromTotalCount)}`);
            }
            else {
                $(`[id='${from}'] .cardTotalCount`).html("");
            }

            //To
            $(`[id='${to}'] .cardTotalCount`).attr("totalcount", newToTotalCount);
            $(`[id='${to}'] .cardTotalCount`).attr("displaycount", toDisplayCount);
            $(`[id='${to}'] .cardTotalCount`).html(`${getCardCountText(toDisplayCount, newToTotalCount)}`);
        }
    }
}

$('#current-label').on('input', function () {
    $('.label-preview').val($(this).val())
    $('.label-preview').attr("data-text", this.value);
});

$('#color-select').on('change', function () {
    $(".label-preview").css({ "background": this.value, "color": "white" });
    $('.label-preview').attr("bg-color", this.value);
});

$(document).on("click", ".ConfDelKanbanCardOkey", function (event) {
    $('#kt_carddel_modal').modal('hide');
    var ciid = $("input[name=CardDelModalCIID]").val();
    deleteConfDelOk(ciid);
});

function LabelEditPanelOpen(id) {

    var text = $("#kanbanLabel_" + id).attr("data-text");
    var color = $("#kanbanLabel_" + id).attr("bg-color");

    $('.label-preview').attr("data-text", text);
    $('.label-preview').attr("bg-color", color);
    $(".label-preview").css({ "background": color, "color": "white" });
    $(".label-preview").val(text);

    $(".label-preview").attr("id", "color-label-preview_" + id);
    $(".label-preview").attr("label-data", id + "~" + text + "~" + color);
    $("#selectLabelForm").hide();
    $("#editLabelForm").show();

    $("#current-label").val(text);
    $("#selectLabelFooter").hide();
    $("#editLabelFooter").show();
}

function CalcelEditLabelForm() {
    $('#current-label').val('');
    $("#selectLabelForm").show();
    $("#editLabelForm").hide();
    $("#selectLabelFooter").show();
    $("#editLabelFooter").hide();
}

function PreSaveEditLabelForm() {

    CalcelEditLabelForm();

    var data = $(".label-preview").attr('label-data');
    var splitData = data.split("~");

    //Değiştirilen label'ın id'si
    var labelId = splitData[0];
    //Değiştirilen label'ın text'i
    var labelText = $('.label-preview').attr("data-text");
    //Değiştirilen label'ın color'ı
    var labelColor = $('.label-preview').attr("bg-color");

    $("#kanbanLabel_" + labelId).val(labelText).text(labelText);
    $("#kanbanLabel_" + labelId).css({ "background": labelColor, "color": "white" });

    $("#kanbanLabel_" + labelId).attr("data-text", labelText);
    $("#kanbanLabel_" + labelId).attr("bg-color", labelColor);

}