$("#controlContainer").css("min-height", $('#kt_quick_panel').height() - 195);
$(".kt-subheader .kt-subheader__toolbar .btn").css("margin-left", "-0px");

//Eğer modal ise
if ((window.location.href.indexOf('Task/List') > 0)
    || (window.location.href.indexOf('Task/Index') > 0)
    || (window.location.href.indexOf('DashboardPanel/Index') > 0)) {
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
    FixTaskDetailViewForIE11(true);
    $("#parentCustomControlContainer").css("min-height", $('#kt_quick_panel').height() - 195);
}
//Detay sayfa ise
else {
    $("#divInstructions").css("margin-left", "-34px");
    $("#divInstructions").css("margin-right", "-35px");
    $("#divInstructions").css("margin-top", "-20px");
    $("div.sticky").css("margin-left", "24px");
    $("div.sticky").css("margin-right", "24px");
    $("div.sticky").css("margin-bottom", "9px");
    $("div.sticky").css("margin-top", "-21px");
    $(".taskdp_portlet_bg").css("min-height", $(document).height() - 550 + "px");
    $("div.sticky").css("border-radius", "4px");
    $("#tdZoomIcon").hide();
    FixTaskDetailViewForIE11(false);

    $('#taskDetailSubheader').attr('style', 'width:90% !important; float:left;');
    $('#taskDetailSubheaderToolbar').attr('style', 'width:10% !important; float:right;');
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

$(document).ready(function () {
    if ($("#kt_quick_panel").attr("is-full-screen") == "true") {
        SetFullScreenOnDesign();
    }
    if (window.location.href.indexOf('Task/Details') > 0) {
        setLITHeaderResponsiveDesign();
    }
    if (window.location.href.indexOf('Task/Details?Type=peek') > 0) {
        $("#taskform .kt-radio.kt-radio--brand > span").css("border", "1px solid #d1d7e2");
        $("#taskform .kt-checkbox.kt-checkbox--brand > span").css("border", "1px solid #d1d7e2");
        $("#taskDetailPanelContainer :input").css("background-color", 'white');
        $(".ppsinputgroupappend").css("pointer-events", "none")
        $("#basic-addon2").removeClass("popupselector")
        $("#taskform .select2-selection--multiple > .select2-selection__rendered > .select2-search > .select2-search__field").css("background-color", "unset");
        $("#taskform .select2-selection--multiple").css("border-color", "white")
        $(".tdDocumentDel").css("pointer-events", "none")
        $(".pps-more-icon").css("visibility", "hidden")
    }
    if ($('#detailPanelPartial').hasClass("peek-mode") == true) {
        $("#taskform .select2-selection--multiple").css("border-color", "white")
        $(".tdDocumentDel").hide();
    }
});