function SetActiveGridFocusBorder(id) {
    //Grid border effects
    $(".grid-focus-border_" + id).click(function (e) {

        var clickedInputType = e.target.type;

        if (clickedInputType ||
            e.target.id == "btnAddNewLineItem") {
            $('.grid-focus-border_' + id).addClass('active-grid-list');
        }
        else {
            $('.grid-focus-border_' + id).removeClass('active-grid-list');
        }

        var isPopupInput = $(e.target).hasClass("popup-control")

        if (isPopupInput == false) {
            $(".input-group-popup-append").hide();
        }

    });

    $('.grid-focus-border_' + id).focusout(function () {
        if ($('.grid-focus-border_' + id + ':hover').length
        ) {
            return;
        }
        $('.grid-focus-border_' + id).removeClass('active-grid-list');
        $(".input-group-popup-append").hide();
    });
}

$(document).ready(function () {

    $('#kt_quick_panel').scrollTop(0);

    $('.select2-me').select2({
        placeholder: EFlang.PleaseSelect,
        language: langMinStringVar,
        allowClear: true,
        matcher: function (params, data) {
            return Select2CustomMatcher(params, data);
        }
    });

    $('.select2-me-clear').select2({
        placeholder: "",
        language: langMinStringVar,
        allowClear: true
    });

    $.fn.hasScrollBar = function () {
        try {
            return this.get(0).scrollHeight > this.height();
        }
        catch (err) {
            return false;
        }
    }

    if ($('#kt_quick_panel').hasScrollBar()) {
        $(".sticky").addClass("stickyBackgroud");
        document.body.style.overflow = 'hidden';
    }

    $('#kt_quick_panel').scroll(function () {
        $(".datetimepicker-dropdown-bottom-right").hide();
        $('.datetimepicker1').trigger('blur');
    });

});

function GetAllSelectedElementValues() {

    var SelectedElements = [];

    $(".frm-ctrl-drp.form-control.select2-me").each(function (index, element) {

        try {

            var didId = $(this)[0].id;
            var elementName = $(this).find(':selected').attr("custom-attribute");
            //var selectedText = $(this).find(':selected').text();
            var selectedValue = $(this).find(':selected').val();
            var selectedType = "dropdown";

            if (selectedValue) {
                var model = { didId, elementName, selectedValue, selectedType };

                SelectedElements.push(model);
            }

        } catch (e) {

        }
    });

    $(".frm-ctrl-pps").each(function (index, element) {

        try {

            var didId = $(this).attr("data-did");
            var elementName = $(this).attr("custom-attribute");
            var selectedValue = $(this).attr("data-itemval");
            var selectedType = "popupselect";

            if (selectedValue) {
                var model = { didId, elementName, selectedValue, selectedType };

                SelectedElements.push(model);
            }

        } catch (e) {

        }
    });

    return SelectedElements;
}