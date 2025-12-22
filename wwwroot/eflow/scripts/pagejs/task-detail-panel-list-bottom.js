$("#controlContainer").css("min-height", $('#kt_quick_panel').height() - 195);
$(".kt-subheader .kt-subheader__toolbar .btn").css("margin-left", "-0px");

//Eğer modal ise
if ((window.location.href.indexOf('Task/List') > 0)
    || (window.location.href.indexOf('Task/Index') > 0)) {

    $(".kt-portlet .kt-portlet__head").css("padding", "0 0px");
    if ($(document).width() < 1800) {
        $("#SaveChanges").css("margin-right", "15px");
    }
    $("#toolButtons").css("margin-left", "-3px");
    $("#divInstructions").css("margin-left", "-2%");
    $("#divInstructions").css("margin-right", "-2%");
    $("#divInstructions").css("margin-top", "-25px");
    $("#kt_content_taskdetail").css("padding", "10px");
    $(".kt-taskdetail-head").css("padding-top", "0px");
    $("#taskDetailPanelContainer").css("margin-top", "-15px");
    $("#taskDetailSeperator").show();
    $("#taskDetailSeperator").css("padding", "0px");
    $("#taskDetallPanelHeadAreaBox").addClass("taskDetallModalHeadAreaBox");
    $(".qpanelHeadWrapper").css("margin-top", "-19px");
}

$("#multiform-rightmenu").css("min-height", $('#right-1').height() - 50 + "px");
//$('#parentCustomControlContainer .gridLeftRightPadding').attr('style', 'max-width: ' + ($(document).width() - 424) + 'px !important');
$("#parentCustomControlContainer").css("min-height", $('#kt_quick_panel').height() - 195);


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