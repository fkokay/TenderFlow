var userlist = [];
var tab = 1;
var searchText = "";
var page = 1;
var pagesize = 32;
var selectedList = 0;
var selectedDocType;

$(document).ready(function () {

    PanelItemHover();

    $("#txtGeneralSearch").keyup(function (e) {

        delaySearch(function () {
            searchText = $("#txtGeneralSearch").val();

            GetDataHtml();

        }, 1000);
    });

    $('#rdiStoredProc').click(function () {

        $("#param").empty();
        $("#param").hide();

        if ($('#rdiStoredProc').is(':checked')) {

            $("#listbox").show();
            $("#customQur").hide();
            $("#Query").val("");

            var data = $("#frmData").serializeObject();
            $("#listbox").find("select").empty();

            $.ajax({
                url: "/Reports/GetProc",
                data: data,
                type: "post",
                cache: false,
                success: function (result) {

                    $.each(result, function (index, item) {
                        $("#listbox").find("select").append("<option>" + item + "</option>");
                    });
                }
            });

        }

    });

    $('#rdiCustomQuery').click(function () {

        $("#param").empty();
        $("#param").hide();

        if ($('#rdiCustomQuery').is(':checked')) {
            $("#listbox").hide();
            $("#customQur").show();
        }

    });

    $("#SpQuery").on('change', function () {

        var data = $("#frmData").serializeObject();
        var conName = $("#ConnectionString option:selected").text();
        $("#ConnectionName").val(conName);
        data.ConnectionName = conName

        $.ajax({
            url: "/Reports/GetProcParams",
            data: data,
            type: "post",
            cache: false,
            success: function (result) {
                if (result) {
                    $("#param").empty().hide();
                    $.each(result, function (index, item) {

                        if (index === 0) {
                            $("#param").show();
                        }

                        var input = '<div style="margin-top: 5px;" class="control-group"><label style="margin-left: 10px;" class="control-label">'
                            + item.Name + '(' + item.DataType + ')</label><div class="col-sm-8"><input id="' + item.Name + '" dataid="'
                            + item.DataType + '" class="mdlInput form-control" name="param" type="text" ></div></div>';

                        $("#param").append(input);
                    });
                }
            }
        });

    });

    function PostReport() {

        var conName = $("#ConnectionString option:selected").text();
        $("#ConnectionName").val(conName);

        var data = $("#frmData").serializeObject();
        if (data.ContentType == contentType.surec) {
            conName = $("#process_connection_string option:selected").text();
            data.ConnectionName = conName;
            data.ConnectionString = conName;
        }
        var jsonObj = [];

        var params = $("#frmData").find("input[name='param']");
        $.each(params, function (index, item) {
            ReportParamater = {}
            ReportParamater.Name = item.id;
            ReportParamater.DataType = item.getAttribute("dataid");
            ReportParamater.Value = item.value;

            jsonObj.push(ReportParamater);
        });
        data.Parameters = jsonObj;

        $.ajax({
            url: "/Reports/ReportDocument",
            headers: { '__RequestVerificationToken': getAntiForgeryTokenId() },
            data: JSON.stringify(data),
            type: "post",
            cache: false,
            contentType: "application/json",
            dataType: "json",
            traditional: true,
            success: function (result) {
                if (result > 0) {
                    $('#newDocument').modal('hide');
                    swal({
                        position: 'top-right',
                        type: 'success',
                        text: EFlang.ReportSuccessful,
                        showConfirmButton: true,
                        timer: 1500
                    });
                    if (data.DocType === "1") {
                        let url = new URL("/Reports/DashboardViewer/" + result, window.location.origin);
                        url.searchParams.set("isfirst", true);
                        window.location.href = url.toString();
                    } else {
                        window.location.href = "/Reports/EditXReport/" + result + "?edit=True";
                    }
                }
                else if (result == -1) {
                    swal({
                        position: 'top-right',
                        type: 'error',
                        html: EFlang.ReportFailed,
                        showConfirmButton: true,
                        timer: 1500
                    });
                }
                else if (result == 0) {
                    swal({
                        position: 'top-right',
                        type: 'error',
                        html: EFlang.QueryNotDefined,
                        showConfirmButton: true,
                        timer: 1500
                    });
                }
            }
        });
    }

    $(".btnRun").click(function () {
        var paramRequired = false;
        var data = $("#frmData").serializeObject();
        var jsonObj = [];
        var params = $("#frmData").find("input[name='param']");
        $.each(params, function (index, item) {
            ReportParamater = {}
            ReportParamater.Name = item.id;
            ReportParamater.DataType = item.getAttribute("dataid");
            ReportParamater.Value = item.value;
            jsonObj.push(ReportParamater);

            if (item.value == "") {
                paramRequired = true;
            }

        });
        data.Parameters = jsonObj;
        var conName = $("#ConnectionString option:selected").text();
        $("#ConnectionName").val(conName);
        data.ConnectionName = conName;
        if (((data.CustomQuery === "true" && data.Query !== "") || (data.CustomQuery === "false" && data.SpQuery)) && paramRequired == false) {
            $.ajax({
                url: "/Reports/ReportDocumentRun",
                headers: { '__RequestVerificationToken': getAntiForgeryTokenId() },
                data: JSON.stringify(data),
                type: "post",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                traditional: true,
                success: function (result) {
                    if (result > 0) {
                        swal({
                            position: 'top-right',
                            type: 'success',
                            text: EFlang.QueryRunSucceed,
                            showConfirmButton: true,
                            timer: 1500
                        });
                    }
                    else if (result == -1) {
                        swal({
                            position: 'top-right',
                            type: 'warning',
                            html: EFlang.ReportFailed,
                            showConfirmButton: true,
                            timer: 1500
                        });
                    }
                    else if (result == 0) {
                        swal({
                            position: 'top-right',
                            type: 'warning',
                            html: EFlang.QueryNotDefined,
                            showConfirmButton: true,
                            timer: 1500
                        });
                    }
                }, error: function (err) {
                    toastr.success("Hata");
                }
            });
        }
        else if (paramRequired == true) {
            toastr.error(EFlang.SpParameterValidate);
        }
        else {
            toastr.error(EFlang.QueryNotDefined);
        }
    });

    $(".btnBack").click(function () {
        $("#process_card").find("input[name='course_id']").prop("checked", false);
        $("#veri_elementleri").find("input[name='veri_elements']").prop("checked", false);
        $("#btnPreviousRD").hide();
        $("#process_card").show();
        $("#elements_card").hide();
        $("#btnNextRD").show();
        $("#ConnectionString option").prop("selected", false);
        $("#process_connection_string").attr("disabled", false);
        $("#reportname-error").hide();
        $("#Name").removeClass("error");
        KTAppUserAdd.letsGoToBack();
    });
    $("#btnPreviousRD").click(function () {
        $("#btnPreviousRD").hide();
        $("#process_card").show();
        $("#elements_card").hide();
        $("#btnNextRD").show();
        $("#process_connection_string").attr("disabled", false);
    });
    $("#btnSaveRD").click(function () {
        PostReport();
    });
    $("#btnNextRD").click(function () {
        $("#btnNextRD").hide();
        $("#process_card").hide();
        $("#elements_card").show();
        $("#btnPreviousRD").show();
        $("#process_connection_string").attr("disabled", true);
    });

    $(".btnNext").click(function () {

        $('#frmData').validate({
            rules: {
                Name: {
                    required: true,

                }
            },
            messages: {
                Name: {
                    required: EFlang["Required"]
                }
            },
        });

        if ($("#frmData").valid()) {
            var detay = $("#content-type").val();

            $("#content-type").next(".select2").find(".select2-selection.select2-selection--single").removeClass("is-invalid");
            if (detay == contentType.sorgu) {
                $("#secondPage").show();
            }
            else if (detay == contentType.surec) {
                $("#thirdPage").show();
            }
            else {
                $("#content-type").next(".select2").find(".select2-selection.select2-selection--single").addClass("is-invalid");
            }
            KTAppUserAdd.letsGoToNext(Number(detay));
        }
    });

    $(".btnEnd").click(function () {

        var query = $("#Query").val();
        var spQuery = $("#SpQuery").val();
        if (query || spQuery) {
            PostReport();
        }
        else {
            $("#Query").addClass("error");
            $("#SpQuery").addClass("error");
        }
    });

    $(".btnCancelDoc").click(function () {

        $("#secondPage").hide();
        $("#firstPage").show();
        $("#param").empty();
        $("#param").hide();
        $("#Query").val("");
        $("#ConnectionString option").prop("selected", false);
    });

    $('#newDocument').on('hidden.bs.modal', function () {

        $("#ConnectionString option").prop("selected", false);
        $("#secondPage").hide();
        $("#firstPage").show();
        $("#param").empty();
        $("#param").hide();
        $("#Query").val("");
        $("#Name").removeClass("error");
        $("#reportname-error").hide();
    })
});

var model = {
    DashboardViewList: [],
    SelectedDocType: -1,
    Search: {
        "searchText": searchText,
        "page": page,
        "pageSize": pagesize,
        "docType": tab,
        "searchType": 0
    }
};

var delaySearch = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

jQuery.fn.fadeOutAndRemove = function (speed) {
    $(this).fadeOut(speed, function () {
        $(this).remove();
    })
}

jQuery.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function TabChanged(id) {

    tab = id;
    selectedDocType = id;

    GetDataHtml();
}

function getModel() {

    model.Search.searchText = searchText;
    model.Search.docType = tab;
    model.SelectedDocType = selectedDocType;
    model.Search.pageSize = pagesize;
    model.Search.page = page;
    model.Search.searchType = $('#SelectedMenuId').val();
    return model;
}

function GetDataHtml() {

    var data = getModel();
    $('.loadingDiv').show();

    var routeName = "Reports";
    var currentUrl = window.location.href;
    if (currentUrl.indexOf("mobile-reports") >= 0) {
        routeName = "mobile-reports";
    }

    $.ajax({
        data: JSON.stringify(data),
        type: "POST",
        dataType: "html",
        contentType: "application/json; charset=utf-8",
        url: "/Reports/DashListMetronic?routeUrlName=" + routeName,
        cache: false,
        success: function (result) {

            $('.loadingDiv').hide();
            $("#dashlistPanelPartial").html("");
            $("#dashlistPanelPartial").html(result);
            PanelItemHover();

        }
    });
}

function SetUserPref() {
    $.ajax({
        url: "/Reports/SetUserPref",
        type: "POST",
        data: { "name": "LISTSTYLE", "value": selectedList },
        success: function (d) {

        }, error: function (er) {

        }

    });
}

function GetUserPref() {
    $.ajax({
        url: "/Reports/GetUserPref",
        type: "POST",
        async: false,
        success: function (d) {
            selectedList = d;
        }, error: function (er) {

        }
    });
}

function GetURLParameter(sParam, sPageURL) {

    var sURLVariables = sPageURL.split('?');

    for (var i = 0; i < sURLVariables.length; i++) {

        var sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {

            return sParameterName[1];
        }
    }

}

function PanelItemHover() {

    $(".panel-item .kt-portlet").mouseover(
        function () {
            $(this).css('background-color', '#eff0f1');
        }
    );

    $(".panel-item .kt-portlet").mouseout(
        function () {
            $(this).css('background-color', '');
        }
    );
}

$(document).on("click", ".addFavBtn", function () {

    var id = $(this).attr('data-id');

    $.ajax({
        url: "/Reports/Fav",
        data: { id: id },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        traditional: true,
        success: function (data) {
            GetDataHtml();
        }
    });
});

$(document).on("click", ".btnadd", function () {

    var selectedOption = $("#shareGroupId");

    if (jQuery.inArray($(selectedOption).val(), userlist) !== -1) {

    } else {

        if ($(selectedOption).val()) {

            userlist.push($(selectedOption).val());

            $('#shareUserList').append(
                '<li data-gid=" ' +
                $(selectedOption).val() +
                ' "> ' +
                '<span style="display:none;">' +
                $(selectedOption).find(':selected').text() +
                '</span>' +
                '<div class="alert alert-add alert-primary alert-dismissible fade show" role="alert"> ' + $(selectedOption).find(':selected').text() + ' <button data-text=' + $(selectedOption).find(':selected').text() + ' type="button" data-gid=' + $(selectedOption).val() + ' class="close btnGrpClose" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>' +
                '</li>'
            );

        }
    }
});

$(document).on("click", ".btnGrpClose", function () {

    var closeId = $(this).attr('data-gid');

    userlist = jQuery.grep(userlist, function (value) {
        return value != closeId;
    });

});

$(document).on("click", ".transfertasks", function () {

    $("#shareGroupId").val(null).trigger("change");
    $("#shareGroupModal #id").val("");
    var id = $(this).attr('data-id');
    $("#shareGroupModal #id").val(id);

    $.ajax({
        url: "/Reports/SharedUsers",
        data: { id: id },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            userlist = data;

            var selectedOption = $("#shareGroupId");
            $('#shareUserList').empty();

            $.each(data, function (index, item) {

                $('#shareUserList').append(
                    '<li data-gid=" ' +
                    item +
                    ' "> ' +
                    '<span style="display:none;">' +
                    $('#shareGroupId option[value="' + item + '"]').text() +
                    '</span>' +
                    '<div class="alert alert-add alert-primary alert-dismissible fade show" role="alert"> ' + $('#shareGroupId option[value="' + item + '"]').text() + ' <button data-text=' + $('#shareGroupId option[value="' + item + '"]').text() + ' type="button" data-gid=' + item + ' class="close btnGrpClose" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>' +
                    '</li>'
                );

            });
        }
    });

});

$(document).on("click", ".saveshared", function () {

    var id = $("#shareGroupModal #id").val();
    $.ajax({
        url: "/Reports/Share",
        data: { id: id, groupIds: userlist },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        traditional: true,
        success: function (data) {
            $('#shareGroupModal').modal("hide");
            userlist = null;
            userlist = [];
            GetDataHtml();
        }
    });

});

$(document).on("click", ".calcelshared", function () {
    $("#shareGroupModal #id").val("");
});

$('#SelectedMenuId').bind('change', function (e) {

    GetDataHtml();
});

$(document).on("click", ".deleterowok", function (event) {

    $buttonEl = $(this);

    var id = $("#deleteReport input[name='id']").val();

    $.ajax({
        url: "/Reports/Delete",
        data: { id: id },
        cache: false,
        traditional: true,
        success: function (data) {

            $('#deleteReport').modal('hide');
            GetDataHtml();
            $('#panel-item-id_' + id).fadeOutAndRemove('slow');

        },
        fail: function (xhr, textStatus, errorThrown) {

        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false
    });

});

$(document).on("click", ".deleterow", function (event) {

    var id = $(this).attr('data-id');

    $("#deleteReport input[name='id']").val(id);

});

//New Report
$(document).on("click", ".reportType", function () {

    KTAppUserAdd.letsGoToBack();

    var newDocumentTitle = EFlang.ReportDetail;
    var newReportDashboardTitle = EFlang.ReportName;
    var dataid = $(this).attr('data-id');

    if (dataid == 1) {
        newDocumentTitle = EFlang.DashboardDetail;
        var newReportDashboardTitle = EFlang.DashboardName;
    }

    $('#newDocument').find("#btnPreviousRD").hide();
    $('#newDocument').find("#process_card").show();
    $('#newDocument').find("#elements_card").hide();
    $('#newDocument').find("#btnNextRD").show();

    $('#newDocumentTitle').text(newDocumentTitle);
    $('#newDocument').find(".doctype").val(dataid);
    $('#newDocument').find('input[type="text"]').val("");
    $('#newDocument').find('textarea').val("");
    $('#newDocument').find("select[name='SpQuery']").empty();
    $('#newDocument').find("label.new-dashboard-report-title").text(newReportDashboardTitle);
    $("#secondPage").addClass("hide");
    $("#firstPage").removeClass("hide");
    $("#listbox").find("select").empty();
    $("#listbox").addClass("hide");
    $("#customQur").removeClass("hide");
    $('#newDocument').modal('show');
    $('#rdiCustomQuery').prop("checked", true);
    $('#rdiStoredProc').prop("checked", false);
    $("#reportname-error").hide();
});