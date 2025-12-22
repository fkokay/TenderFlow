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