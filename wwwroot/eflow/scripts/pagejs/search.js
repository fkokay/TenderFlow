var datepickerConf = {
    culture: currentCulture,
    animation: false,
    format: "g"
};

$(document).ready(function () {

    kendo.culture(currentCulture);
    SetElements();

});

function SetElements() {

    $.each($(".datetime"), function (i, item) {

        //if ($(item).attr("name") == "StartDate2") {
        //    datepickerConf.value = new Date();
        //}
        //else {
            datepickerConf.value = null;
        //}

        $(item).kendoDateTimePicker(datepickerConf);
    });

}