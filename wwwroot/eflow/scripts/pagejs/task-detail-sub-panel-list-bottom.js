$("#controlContainer").css("min-height", $('#kt_quick_panel').height() - 195);
$(".kt-subheader .kt-subheader__toolbar .btn").css("margin-left", "-0px");

//Eğer modal ise
if (window.location.href.indexOf('Task/List') > 0) {
    $(".kt-portlet .kt-portlet__head").css("padding", "0 0px");
    if ($(document).width() < 1800) {

        $("#SaveChanges").css("margin-right", "15px");

    }
    $("#toolButtons").css("margin-left", "-3px");
    $("#divInstructions").css("margin-left", "-10px");
    $("#divInstructions").css("margin-right", "-10px");
    $("#kt_content_taskdetail").css("padding", "10px");
    $(".kt-taskdetail-head").css("padding-top", "0px");
    $("#taskDetailPanelContainer").css("margin-top", "-15px");
    $("#taskDetailSeperator").show();
    $("#taskDetailSeperator").css("padding", "0px");
}
//Detay sayfa ise
else {
    $("#divInstructions").css("margin-left", "-34px");
    $("#divInstructions").css("margin-right", "-34px");
    $("#divInstructions").css("margin-top", "-37px");
    $("div.sticky").css("margin-left", "24px");
    $("div.sticky").css("margin-right", "24px");
    $("div.sticky").css("margin-bottom", "9px");
    $("div.sticky").css("margin-top", "-19px");
}

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};