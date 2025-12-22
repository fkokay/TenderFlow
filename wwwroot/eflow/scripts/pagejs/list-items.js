$('#selectAll').click(function (e) {
    var table = $(e.target).closest('table');

    $('td input:checkbox:not([disabled])', table).prop('checked', this.checked);
    if (this.checked) {
        $('tr').css("background-color", "aliceblue");
    }
    else {
        $('tr').css("background-color", "");
    }
    $('td input:checkbox:disabled', table).closest('tr').css('background-color', '');

});

$('#eflistsTableDiv').on('click', 'tbody td:first-child, thead th:first-child', function (e) {
    var selectedRow = $(this).closest('tr');
    var checkbox = selectedRow.find('[type=checkbox]');
    if (checkbox[0].checked) { selectedRow.css("background-color", "aliceblue"); }
    else { selectedRow.css("background-color", ""); }

    ShowDeleteItems();
    ShowListStartItems();
});

function orderListColumn(index, event) {

    $.ajax({
        type: 'GET',
        dataType: "html",
        cache: false,
        data: {
            CID: orderCidVal,
            filter: GetFilterWithStorage(),
            orderIndex: index,
            userViewType: GetUserViewTypeWithUrl(),
            orderDirection: $(event).attr("direction"),
            columnType: $(event).attr("columnType"),
            page: $(event).attr("currentPage")
        },
        url: '/Lists/ListItemsByCid',
        success: function (data) {
            $('#ListItems').html(data);
            var direction = $(event).attr("direction");

            if (direction == "asc") {
                $("#litemcolumn_" + index).attr("direction", "desc");
            }
            else if (direction == "desc") {
                $("#litemcolumn_" + index).attr("direction", "asc");
            }

        }
    });
}

function GetSelectedCheckboxes() {

    var checkedItems = [];

    $('#eflistsTableDiv').find('input[type="checkbox"]:checked').each(function () {
        if (this.id != "selectAll") {
            checkedItems.push(this.id);
        }
    });

    return checkedItems;
}

function ShowDeleteItems() {

    var selectedCount = ($('#eflistsTableDiv').find('input[type="checkbox"]:checked').not('#selectAll').length);

    if (selectedCount > 0) {
        $(".deleteCheckItems").show();

        var selectedCountText = deleteSelectedRowText;

        if (selectedCount > 1) {
            selectedCountText = deleteSelectedText;
        }
        $("#deleteSelectedListbtn").html('<i class="la la-trash-o"></i> &nbsp;' + selectedCountText);
    }
    else {
        $(".deleteCheckItems").hide();
    }
}

function ShowListStartItems() {
    var selectedCount = ($('#eflistsTableDiv').find('input[type="checkbox"]:checked').not('#selectAll').length);

    if (selectedCount > 0) {
        $(".manualStartListCheckItems").show();
        var selectedCountText = selectedCount > 1 ? manuelListStartText: manuelListStartRowText;
        $("#startItemListbtn").html('<i class="la la-play"></i> &nbsp;' + selectedCountText);
    }
    else {
        $(".manualStartListCheckItems").hide();
    }
}

$(document).ready(function () {
    $("#btnAllProcesses").removeClass("disablePointer");
    $('#eflistsTableDiv tr').on('mouseover', function () {
        var checkbox = $(this).find('input[type="checkbox"]');
        var hiddenElement = $(this).closest('tr').find('i.fa-lock');
        if (checkbox.prop('disabled')) {
            hiddenElement.show();
        }
    }).on('mouseleave', function () {
        var hiddenElement = $(this).closest('tr').find('i.fa-lock');
        hiddenElement.hide();
    });
});