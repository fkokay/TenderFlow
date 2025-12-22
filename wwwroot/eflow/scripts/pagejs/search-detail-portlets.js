function OpenPortletActiveTasks(ciid) {
    if ($("#kt_portlet_tools_8").attr("class").indexOf("kt-portlet--collapse") > 0) {

        $.ajax({
            type: 'GET',
            dataType: "html",
            cache: false,
            data: {
                CIID: ciid,
                type: '8',
                partialId: '1'
            },
            url: '/Search/DetailByType',
            beforeSend : function (data) {
                $("#kt-spinner_portlet_8").show();
            },
            success: function (data) {
                ReturnPage(data);
                $("#kt-spinner_portlet_8").show(0).delay(400).hide(0);
                $('#kt_portlet_tools_8_content').html(data);
            }
        });

    }
    else {
        $('#kt_portlet_tools_8_content').html("");
    }
}

function OpenPortletGraphicalStatus(ciid) {
    if ($("#kt_portlet_tools_7").attr("class").indexOf("kt-portlet--collapse") > 0) {

        $.ajax({
            type: 'GET',
            dataType: "html",
            cache: false,
            data: {
                CIID: ciid,
                type: '7',
                partialId: '2'
            },
            url: '/Search/DetailByType',
            beforeSend: function (data) {
                $("#kt-spinner_portlet_7").show();
            },
            success: function (data) {
                ReturnPage(data);
                $("#kt-spinner_portlet_7").show(0).delay(400).hide(0);
                $('#kt_portlet_tools_7_content').html(data);
            }
        });

    }
    else {
        $('#kt_portlet_tools_7_content').html("");
    }
}

function OpenPortletTaskHistory(ciid) {
    if ($("#kt_portlet_tools_2").attr("class").indexOf("kt-portlet--collapse") > 0) {

        $.ajax({
            type: 'GET',
            dataType: "html",
            cache: false,
            data: {
                CIID: ciid,
                type: '2',
                partialId: '3'
            },
            url: '/Search/DetailByType',
            beforeSend: function (data) {
                $("#kt-spinner_portlet_2").show();
            },
            success: function (data) {
                ReturnPage(data);
                $("#kt-spinner_portlet_2").show(0).delay(400).hide(0);
                $('#kt_portlet_tools_2_content').html(data);
            }
        });

    }
    else {
        $('#kt_portlet_tools_2_content').html("");
    }
}

function OpenPortletParentTasks(ciid) {
    if ($("#kt_portlet_tools_6").attr("class").indexOf("kt-portlet--collapse") > 0) {

        $.ajax({
            type: 'GET',
            dataType: "html",
            cache: false,
            data: {
                CIID: ciid,
                type: '6',
                partialId: '4'
            },
            url: '/Search/DetailByType',
            beforeSend: function (data) {
                $("#kt-spinner_portlet_6").show();
            },
            success: function (data) {
                ReturnPage(data);
                $("#kt-spinner_portlet_6").show(0).delay(400).hide(0);
                $('#kt_portlet_tools_6_content').html(data);
            }
        });

    }
    else {
        $('#kt_portlet_tools_6_content').html("");
    }
}

function OpenPortletSubTasks(ciid) {
    if ($("#kt_portlet_tools_4").attr("class").indexOf("kt-portlet--collapse") > 0) {

        $.ajax({
            type: 'GET',
            dataType: "html",
            cache: false,
            data: {
                CIID: ciid,
                type: '4',
                partialId: '5'
            },
            url: '/Search/DetailByType',
            beforeSend: function (data) {
                $("#kt-spinner_portlet_4").show();
            },
            success: function (data) {
                ReturnPage(data);
                $("#kt-spinner_portlet_4").show(0).delay(400).hide(0);
                $('#kt_portlet_tools_4_content').html(data);
            }
        });

    }
    else {
        $('#kt_portlet_tools_4_content').html("");
    }
}

function OpenPortletSystemLogs(ciid) {
    if ($("#kt_portlet_tools_3").attr("class").indexOf("kt-portlet--collapse") > 0) {

        $.ajax({
            type: 'GET',
            dataType: "html",
            cache: false,
            data: {
                CIID: ciid,
                type: '3',
                partialId: '6'
            },
            url: '/Search/DetailByType',
            beforeSend: function (data) {
                $("#kt-spinner_portlet_3").show();
            },
            success: function (data) {
                ReturnPage(data);
                $("#kt-spinner_portlet_3").show(0).delay(400).hide(0);
                $('#kt_portlet_tools_3_content').html(data);
            }
        });

    }
    else {
        $('#kt_portlet_tools_3_content').html("");
    }
}

function OpenPortletTaskSummary(ciid) {
    if ($("#kt_portlet_tools_1").attr("class").indexOf("kt-portlet--collapse") > 0) {

        $.ajax({
            type: 'GET',
            dataType: "html",
            cache: false,
            data: {
                CIID: ciid,
                type: '1',
                partialId: '7'
            },
            url: '/Search/DetailByType',
            beforeSend: function (data) {
                $("#kt-spinner_portlet_1").show();
            },
            success: function (data) {
                ReturnPage(data);
                $("#kt-spinner_portlet_1").show(0).delay(400).hide(0);
                $('#kt_portlet_tools_1_content').html(data);
            }
        });

    }
    else {
        $('#kt_portlet_tools_1_content').html("");
    }
}

function OpenPortletProcessData(ciid) {

    if ($("#kt_portlet_tools_5").attr("class").indexOf("kt-portlet--collapse") > 0) {

        $.ajax({
            type: 'GET',
            dataType: "html",
            cache: false,
            data: {
                CIID: ciid,
                type: '5',
                partialId: '8'
            },
            url: '/Search/DetailByType',
            beforeSend: function (data) {
                $("#kt-spinner_portlet_5").show();
            },
            success: function (data) {                
                ReturnPage(data);
                $("#kt-spinner_portlet_5").show(0).delay(400).hide(0);
                $('#kt_portlet_tools_5_content').html(data);
                $("div.control-group .form-group.row").addClass("frm-search-detail");
                $(".control-group").addClass("grp-search-detail");
            }
        });

    }
    else {
        $('#kt_portlet_tools_5_content').html("");
    }
}

function ReturnPage(data) {
    var has = data.indexOf("session$off");
    if (has > -1) {
        window.location.href = "/Account/Login";
    }
}

$(document).ready(function () {
    var defaultOpenItems = document.getElementsByClassName("default-open");
    for (var i = 0; i < defaultOpenItems.length; i++) { defaultOpenItems[i].click();}
});