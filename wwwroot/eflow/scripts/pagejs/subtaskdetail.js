/*<reference path="../jquery-1.7.2-vsdoc.js" />*/

var fileNum = 0;
var TablePane;
var TableScrollApi;
var dataUid;
var jsonObj = [];
var latitude;
var longitude;

var ocrDocumentDidList = [];
$(document).ready(function () {

    jQuery.validator.addMethod("defaultStr", function (value, element) {
        var defaultStr = element.attributes.defaultStr.value;
        var required = element.attributes["data-rule-required"].value;
        var message = "Please enter a value other than zero.";

        //No validate
        var result = true;

        if (defaultStr = '0' && value == '0' && required == "true") {

            if (EFlang.localeCode == "en") {
                $.validator.messages.defaultStr = message;
            }
            result = false;
        }

        if (defaultStr = '0' && value == '' && required == "true") {

            if (EFlang.localeCode == "en") {
                $.validator.messages.defaultStr = message;
            }
            result = false;
        }

        return result;
    });

    SubSetElements();

    var buttonId = $.urlParam('ButtonId');
    if (buttonId)
        TaskActionClickSub(buttonId);

    $('#subtaskform .drop-area').on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).parents("div.gridLeftRightPadding").addClass("onprocess");
    });

    $('#subtaskform .drop-area').on('dragleave', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).parents("div.gridLeftRightPadding").removeClass("onprocess");
    });

    $('#subtaskform .drop-area').on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

    $('#subtaskform .drop-area').on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var file = e.originalEvent.dataTransfer.files;
        var did = $(this).attr("did");
        var id = $(this).attr("id");
        var CIID = $("#netoloji-grid-" + did).data("ciid");
        var formdata = new FormData();
        formdata.append('id', id);
        formdata.append('did', did);
        formdata.append('ciid', CIID);
        formdata.append('file', file[0]);
        formdata.append('isPressCtrl', e.ctrlKey);
        formdata.append("Info", $("#tempInfo-" + did).html());
        $(this).parents("div.gridLeftRightPadding").removeClass("onprocess");
        $("#netoloji-grid-loader-" + did + "").show();
        $("#netoloji-grid-loader-" + did + "").attr("style", "display:inline-flex");

        Promise.all([UploadExcel(formdata)]).then(function () {
            $("#netoloji-grid-loader-" + did).hide();
        }).catch(function () { });
    });

    $("#subtaskform .newTableContainer").on("click", "tbody td", function (e) {
        e.stopImmediatePropagation();
        var isdisabled = $(this).find("select").prop("disabled");
        if (!isdisabled) {
            var _isopen = $(this).find("select").attr("isopen");
            var isopen = convertToBool(_isopen);
            if (isopen == true) {
                $(this).find("select").attr("isopen", false);
                $(this).find("select").select2("close");
            }
            else {
                $("#subtaskform .newTableContainer").find("tbody select").select2("close");
                var selectedvalue = $(this).find("select option:selected").val();
                var did = $(this).closest("table").data("did");
                var columnId = $(this).data("column");
                var ciid = $(this).closest("table").data("ciid");
                var storagekey = "sub-litdropdata-" + columnId + "-" + ciid + "-" + did + "-";
                var isfilled = $(this).find("select").data("isfilled");
                var result;
                if (!isfilled) {
                    if (localStorage.getItem(storagekey) === null || localStorage.getItem(storagekey) === 'undefined' || JSON.parse(localStorage[storagekey]) === null || JSON.parse(localStorage[storagekey]).length == 0) {
                        var _result = GetLitDropdownData(this);
                        console.log(_result)
                        if (_result != undefined && _result.responseJSON != undefined) {
                            result = _result.responseJSON.data;
                        }
                        var istriggered = _result != undefined && _result.responseJSON != undefined ? _result.responseJSON.istriggered : false;
                        if (!istriggered)
                            localStorage[storagekey] = JSON.stringify(result);
                    }
                    else {
                        result = JSON.parse(localStorage[storagekey]);
                    }
                    $(this).find("select").select2({ placeholder: ' ', data: result, disabled: false, allowClear: true });
                    $(this).find("select").val(selectedvalue).trigger("change");
                    if (istriggered)
                        $(this).find("select").data("isfilled", false);
                    else
                        $(this).find("select").data("isfilled", true);
                }
                $(this).find("select").attr("isopen", true);
                $(this).find("select").select2("open");
            }
        }
    });

});

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return decodeURI(results[1]) || 0;
    }
}

function getGeoLocation() {
    if (navigator.geolocation) {
        // get the current position
        navigator.geolocation.getCurrentPosition(

            // if this was successful, get the latitude and longitude
            function (position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                $('.box-bordered map-icon-24').remove();
                $('.box-bordered h3').after('<a href="#" class="map-icon-24 show-map"></a>');
                $('#geoLocationMapHref').show();

                $('.show-map').on('click', function () {
                    $('#mapModal').modal('show');
                });
            },
            // if there was an error
            function (error) {
                if (error.message.indexOf('Only secure origins are allowed') > -1) {
                    //showAlert("Geolocation: " + EFlang.GeoLocation_ONLY_SECURE_ORIGINS);

                    swal({
                        position: 'top-right',
                        type: 'error',
                        text: "Geolocation: " + EFlang.GeoLocation_ONLY_SECURE_ORIGINS,
                        showConfirmButton: false,
                        timer: 5000
                    });
                    return;
                }

                switch (error.code) {
                    case error.PERMISSION_DENIED:

                        swal({
                            position: 'top-right',
                            type: 'error',
                            text: "Geolocation: " + EFlang.GeoLocation_PERMISSION_DENIED,
                            showConfirmButton: false,
                            timer: 5000
                        });
                        break;

                    case error.POSITION_UNAVAILABLE:
                        swal({
                            position: 'top-right',
                            type: 'error',
                            text: "Geolocation: " + EFlang.GeoLocation_POSITION_UNAVAILABLE,
                            showConfirmButton: false,
                            timer: 5000
                        });
                        break;

                    case error.TIMEOUT:
                        swal({
                            position: 'top-right',
                            type: 'error',
                            text: "Geolocation: " + EFlang.GeoLocation_TIMEOUT,
                            showConfirmButton: false,
                            timer: 5000
                        });
                        break;

                    case error.UNKNOWN_ERROR:
                        swal({
                            position: 'top-right',
                            type: 'error',
                            text: "Geolocation: " + EFlang.GeoLocation_UNKNOWN_ERROR,
                            showConfirmButton: false,
                            timer: 5000
                        });
                        break;
                }
                return;
            });
    } else {
        swal({
            position: 'top-right',
            type: 'error',
            text: EFlang.GeoLocation_NOT_SUPPORTED,
            showConfirmButton: false,
            timer: 5000
        });
    }
}

$(document).ready(function () {

    if (isGeoLocationEnabled && isFormEditable) {
        getGeoLocation();
    }

    SetUploaders();
    SetButtonsSub();

    $('#mapModal').on('shown.bs.modal', function (e) {

        $('#mapModal .modal-body .map-details .latitude').text(latitude);
        $('#mapModal .modal-body .map-details .longitude').text(longitude);

        if ($('#map-container').html() == '') {

            var mapProp = {
                center: new google.maps.LatLng(latitude, longitude),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map-container"), mapProp);

            var myLatLng = {
                lat: latitude, lng: longitude
            };
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map
            });
        }
    });

    $('.sub-popupselectbox-modal').on('shown.bs.modal', function (e) {

        setPopupSelectListenersSub();
    });

    $('.sub-popupselectbox-modal').on('shown.bs.hidden', function (e) {
        _container = undefined;
    });

    $('select.form-select-element').on("change", function () {
        var name = $(this).attr('name');
        var selectedText = $(this).find("option:selected").text();
        var targetInput = $("input[name='" + name + "_Text']");
        $(targetInput).val($.trim(selectedText));
    });

    $('[data-toggle="tooltip"]').tooltip();

    $(".alert").hide();

    var pageNum = getUrlParameter('TaskPage');

    $(".uriTask").each(function () {
        var url = $(this).attr("href") + "&TaskPage=" + pageNum;
        $(this).attr("href", url);
    });
    //Delete File 
    $(".fileDel").click(function () {
        var con = confirm(ConfirmFileDelete);
        if (con) {
            var target = $(this).attr("dataapp");
            $("#" + target).parent().find("#doc.file-uploader").attr("filename", "");
            $("#" + target).parent().find("#doc.file-uploader").attr("realfilename", "");
            $("#" + target).next().next().next().attr("filename", "");
            $("#" + target).next().next().next().attr("realfilename", "");
            $("#" + target).next(".clearfix").css("display", "none");
            $("#" + target).css("display", "none");
            $("#" + target).prev("input:hidden").val("");
        }
    });

    //popup select on text blur
    $(".grid").on("click", "td", function (e) {

        $("input").on("keydown", function (event) {
            if (event.keyCode == 13) {

                var attr = $(this).attr("editpopup");
                if (typeof attr !== typeof undefined && attr !== "false") {

                    var gridIndex = $(".grid[did=" + _did + "]").attr("index");
                    var name = $(".grid[did=" + _did + "]").attr("name");
                    var columnField = $(this).attr('name');

                    var tableIndex = $(".grid[did=" + _did + "]").attr("index");

                    var rowIndex = $(this).parents("tr").index();

                    var currentPage = $(".grid[index=" + tableIndex + "]").data("kendoGrid").dataSource.page();
                    var currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);

                    var _showValCol = getSingleValue(tableIndex, columnField, currentRowIndex, "showValCol", -1, name);

                    var itemVal = $(this).attr("itemVal");

                    _gridIndex = gridIndex;

                    var columnSize = $(".grid[did=" + _did + "]").find("thead[role=rowgroup] tr[role=row] th[role=columnheader]").size();

                    var _ddq = getSingleValue(tableIndex, columnField, currentRowIndex, "ddQuery", -1, name);
                    var _type = getSingleValue(tableIndex, columnField, currentRowIndex, "type", -1, name);
                    var _format = getSingleValue(tableIndex, columnField, currentRowIndex, "format", -1, name);
                    var _readonly = getSingleValue(tableIndex, columnField, currentRowIndex, "readonly", -1, name);
                    var _validationMessage = getSingleValue(tableIndex, columnField, currentRowIndex, "validationMessage", -1, name);
                    var _validation = getSingleValue(tableIndex, columnField, currentRowIndex, "validation", -1, name);

                    GetDataPopup(_did, _ddq, $(this).val(), tableIndex, currentRowIndex, name, columnField, rowIndex, _type, _format, _readonly, _showValCol);
                }

            }
        });

    });

    $(document).on("click", ".popclear", function () {
        $(this).parent().find("input").val("");
        $(this).parents().find('.popupselectbox-sub').attr('data-current', 0);
        $(this).parents().find('.popupselectbox-sub .firstpage').trigger('click');

    });
    $("input[id *= 'datetimepicker1']").each(function () {
        var did = $(this).data("did");
        var startDate = $(this).data("startdate");
        var endDate = $(this).data("enddate");
        var format = $(this).data("format");
        setDatetimePicker(did, startDate, endDate, format);
    });
    $("input[id *= 'datetimepicker1']").on("change", function () {
        var isClicked = $(this).attr("data-isclicked");
        var currentElement = $(this);
        if (convertToBool(isClicked)) {
            var valStr = $(this).val();
            var did = $(this).data("did");
            var startDate = $(this).data("startdate");
            var endDate = $(this).data("enddate");
            if (startDate != "" || endDate != "") {
                $.ajax({
                    type: "POST",
                    url: '/Task/CheckValueofDateElements',
                    data: { "FormHash": $("#subtaskform [name='taskhash']").val(), "DID": did, "Val": valStr, "startDateStr": startDate, "endDateStr": endDate },
                    dataType: 'json',
                    success: function (data) {
                        if (data.success == 0) {
                            currentElement.parent().find('span.error').remove();
                            currentElement.parent().append('<span class="error">' + data.message + '</span>');
                        }
                        else {
                            currentElement.parent().find('span.error').remove();
                        }
                        currentElement.val(data.result);
                    }
                });
            }
        }
    });

    $("input[id *= 'datetimepicker1']").on("blur", function () {
        var isClicked = $(this).attr("data-isclicked");
        var currentElement = $(this);
        if (!convertToBool(isClicked)) {
            var valStr = $(this).val();
            var did = $(this).data("did");
            var startDate = $(this).data("startdate");
            var endDate = $(this).data("enddate");
            if ((startDate != "" || endDate != "") && valStr != "") {
                $.ajax({
                    type: "POST",
                    url: '/Task/CheckValueofDateElements',
                    data: { "FormHash": $("#subtaskform [name='taskhash']").val(), "DID": did, "Val": valStr, "startDateStr": startDate, "endDateStr": endDate },
                    dataType: 'json',
                    success: function (data) {
                        if (data.success == 0) {
                            currentElement.parent().find('span.error').remove();
                            currentElement.parent().append('<span class="error">' + data.message + '</span>');
                        }
                        else {
                            currentElement.parent().find('span.error').remove();
                        }
                        currentElement.val(data.result);
                        currentElement.attr("data-isclicked", true);
                    }
                });
            }
        }
    });
});

$(window).bind('beforeunload', function () {

    $("input[id *= 'datetimepicker1']").each(function () {
        $("input[id *= 'datetimepicker1']").datetimepicker("destroy");
    });
});

function setDatetimePicker(did, startDate, endDate, format) {
    if ($('input[data-did=' + did + ']').hasClass("datetimepicker1")) {
        if (~format.toUpperCase().indexOf("H")) {
            $('input[data-did=' + did + ']').datetimepicker({
                locale: langMinStringVar,
                format: format,
                startDate: startDate,
                endDate: endDate,
                language: langMinStringVar,
                weekStart: 1,
                pickerPosition: getDatePickerPosition('taskform', did)
            }).on('changeDate', function (e) {
                $(this).attr("data-isclicked", true);
                $(this).datetimepicker('hide');
            });
        }
        else {
            $('input[data-did=' + did + ']').datetimepicker({
                locale: langMinStringVar,
                language: langMinStringVar,
                format: format,
                minView: 2,
                startDate: startDate,
                endDate: endDate,
                pickTime: false,
                weekStart: 1,
                pickerPosition: getDatePickerPosition('taskform', did)
            }).on('changeDate', function (e) {
                $(this).attr("data-isclicked", true);
                $(this).datetimepicker('hide');
            });
        }
    }
}

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    var subTaskForm = this;
    $.each(a, function () {
        var thisval = "";
        if ($(subTaskForm).find("input[name='" + this.name + "']").hasClass('datetime')) {
            if ($(subTaskForm).find("input[name='" + this.name + "']").val() != "") {

                var $Input = $(subTaskForm).find("input[name='" + this.name + "']");
                var elementMode = $Input.attr("data-role");
                var kendoDateInput;

                switch (elementMode) {
                    case "datepicker":
                        kendoDateInput = $Input.data("kendoDatePicker");
                        break;
                    case "timepicker":
                        kendoDateInput = $Input.data("kendoTimePicker");
                        break;
                    case "datetimepicker":
                        kendoDateInput = $Input.data("kendoDateTimePicker");
                        break;
                    default:
                        kendoDateInput = $Input.data("kendoDatePicker");
                        break;
                }


                dateval = kendoDateInput._value ? kendoDateInput._value : kendoDateInput.options.value;

                if (!dateval)
                    dateval = kendoDateInput._oldText;

                thisval = kendo.toString(dateval, "g");
            }
            else {
                thisval = "";
            }
        }
        else if ($(subTaskForm).find("input[name='" + this.name + "']").hasClass("numeric")) {
            //thisval = $("input[name='" + this.name + "']").attr("data-val");
            thisval = $(subTaskForm).find("input[name='" + this.name + "']").val();
        }
        else if ($(subTaskForm).find("input[name='" + this.name + "']").hasClass("popupselecttext")) {
            thisval = $(subTaskForm).find("input[name='" + this.name + "']").attr("data-itemval") + "[and]" + $(subTaskForm).find("input[name='" + this.name + "']").val();

        }
        else if ($(subTaskForm).find("textarea[name='" + this.name + "']").attr("type") == "memo") {
            thisval = $('<div/>').text($(subTaskForm).find("textarea[name='" + this.name + "']").val()).html();
        }
        else if ($(subTaskForm).find("input[name='" + this.name + "']").attr("type") == "checkbox" || $(subTaskForm).find("input[name='" + this.name + "']").attr("type") == "radio") {
            thisval = this.value;
        }
        else {
            thisval = $(subTaskForm).find("input[name='" + this.name + "'],select[name='" + this.name + "'],textarea[name='" + this.name + "']").val();
        }
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(thisval || '');
        } else {
            o[this.name] = thisval || '';
        }
    });
    $('#' + $(subTaskForm).attr('id') + ' .file-uploader').each(function () {
        var nm = $(this).attr("name");
        var thisval = $(this).attr('filename') + "[and]" + $(this).attr('realfilename');
        if (o[nm]) {
            if (!o[nm].push) {
                o[nm] = [o[nm]];
            }
            o[nm].push(thisval || '');
        } else {
            o[nm] = thisval || '';
        }
    });

    $('#' + $(subTaskForm).attr('id') + ' .gridelement').each(function () {
        var nm = $(this).attr("data-name");
        var tempval = [];
        $(this).find('tbody tr').each(function (i) {
            //if (!($(this).hasClass("template"))) {
            tempval.push('[<]Data row="' + i + '"[>]');
            $(this).find('td[role="gridcell"]').each(function (i) {

                var etext = $(this).html();
                //var eval = $(this).attr();
                // for check box
                if ($(this).attr('rtype') == "boolean") {
                    var eval = $(this).find('input').val();
                    var etext = eval;
                    if (eval == true)
                        etext = "true";
                    else
                        etext = "false";

                }
                if (eval == undefined) { eval = ""; }
                tempval.push('[<]ColumnData datatext="' + etext.replace(/"/g, '&quot;') + '" id="' + $(this).attr("columnid") + '"[>]');
                tempval.push(eval.replace(/"/g, '&quot;'));
                tempval.push('[<]/ColumnData[>]');
            });
            tempval.push('[<]/Data[>]');
            //}
        });

        var thisval = tempval.join('');
        if (o[nm]) {
            if (!o[nm].push) {
                o[nm] = [o[nm]];
            }
            o[nm].push(thisval || '');
        } else {
            o[nm] = thisval || '';

        }
    });
    return o;
};

function SetButtonsSub() {
    $('#subtaskform button.TaskActionSub').bind("click", function (e) {
        $('#subtaskform button.TaskActionSub').attr('disabled', true);
        e.preventDefault();
        $buttonEl = $(this);
        $buttonEl.attr("oldText", $buttonEl.html());

        var button_val = $buttonEl.val();
        if (button_val != "SaveChangesList") {
            $buttonEl.html('<span class="icon-refresh icon-spin"></span> ' + EFlang.PleaseWait);
        }

        var formData = IncludeReadOnlyValuesInserializationSub();
        formData[$(this).attr("name")] = $(this).attr("value");

        if ($(this).attr('id') == "SaveChanges") {

            SendFormDataSub(formData, 5, true);
        }
        else {
            var requiredSignDocArr = [];
            $('.hdnSign').each(function (i) {
                if ($(this).data('required') == 1) {
                    requiredSignDocArr.push({ 'ciid': $(this).data('ciid'), 'did': $(this).data('did') });
                }
            });
            var hasRequiredSign = false;
            if (requiredSignDocArr.length > 0) {
                $.ajax({
                    type: 'POST',
                    dataType: "json",
                    async: false,
                    url: '/Task/ControlRequireSign',
                    data: { "requiredSign": JSON.stringify(requiredSignDocArr) },
                    success: function (result) {
                        if (result.IsSuccess) {
                            hasRequiredSign = true;
                            $('.hdnSign').each(function (i) {
                                if ($(this).data('required') == 1 && $(this).data('did') == result.ObjectModel) {
                                    $('.lnkSign' + result.ObjectModel).focus();
                                    $('.errSign' + result.ObjectModel).removeClass("d-none");
                                }
                            });
                        }
                    },
                    cache: false
                });
            }
            if (!hasRequiredSign) {
                var buttonId = $buttonEl.attr("id").replace("BTN", "");
                var TIID = parseInt($('#subtaskform').find("#taskTIID").val());
                $('.grid-validation-error').remove();
                $('.grid-invalid').remove();
                $('.control-group').removeClass('error');
                $('.tblvalid').remove();
                $('.control-group').find('.help-inline').remove();
                $("div.gridLeftRightPadding").removeClass("notvalid");
                var filesvalid = true;
                var label = $('.control-label');
                label.parent().removeClass('grid-validation-error-parent');
                $(this).parents('.control-group').find('.help-inline').remove();
                var ignore = false;
                var ignoreall = false;
                var filesvalid = true;
                $.ajax({
                    url: "/Task/GetValidationButtons",
                    type: "GET",
                    data: { "TIID": TIID, "BUTTONID": buttonId },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    cache: false,
                    async: false,
                    success: function (data) {

                        $("table[id^='netoloji-grid-']").each(function () {
                            $(this).removeClass("ignr");
                            $(this).removeClass("invalid-table");
                            $(this).parent().parent().parent(".control-group").removeClass("error");
                            $(this).parent().parents(".control-group").removeClass("error");
                            $(this).parent().next(".error").hide();
                        });

                        var buttons = data;
                        var filesvalid = true;
                        if (buttons.length == 1 && buttons[0].CHAIN_FLAG == 1 && buttons[0].DID == -1) {
                            //Eğer buton validaasyonu aldıysa ve hiçbir input seçlmediyse (Validasyon yapılmadan geç demek)
                            ignoreall = true;
                        }
                        else if (buttons.length > 0 && buttons[0].CHAIN_FLAG == 1) {
                            //Eğer buton validasyonu aldıysa ve input seçildiyse (Validasyon sadece o inputlarda yapılacak)
                            ignore = true;
                        } else {
                            //Form validasyon
                            ignore = false;
                            ignoreGrid = false;
                            $('.form-validate input,.form-validate select,.form-validate textarea').each(function () {
                                var item = $(this);
                                item.removeClass('igr');
                            });
                        }


                        if (!ignoreall) {
                            //form içindeki inputları validasyon kontrolüne dahil eder
                            $('.form-validate input,.form-validate select,.form-validate textarea').each(function () {
                                var item = $(this);
                                item.parent().parent().parent(".control-group").removeClass("error");
                                item.parent().parents(".control-group").removeClass("error");
                                item.parent().next(".error").hide();
                                item.addClass('igr');
                                if (item.hasClass("datetimepicker1") && item.attr("data-rule-required") == 'true') {
                                    item.rules("add", "required");
                                }
                                if (item.attr("type") == "file") {
                                    item.parents('.control-group').find('.help-inline').remove();
                                    if (item.attr("data-rule-required") == 'true') {
                                        item.closest(".file-uploader").attr("rq", true);
                                        item.removeAttr("data-rule-required");
                                    }
                                    if (item.hasClass("igr")) {
                                        if (buttons[0].CHAIN_FLAG == 1) {
                                            //item.closest(".file-uploader").attr("rq", true);
                                        }        
                                        else {
                                            //item.closest(".file-uploader").attr("rq", false);
                                            //item.closest(".file-uploader").removeData("ruleRequired");
                                        }
                                    }
                                }
                                $(buttons).each(function (index, i) {
                                    if (i.DID == item.attr("data-did")) {
                                        item.rules("add", "required");
                                        item.removeClass('igr');
                                    }
                                });
                            })

                            $(buttons).each(function (index, i) {

                                $(".file-uploader[rq='true']").each(function () {
                                    if (i.CHAIN_FLAG == 1) {
                                        $el = $(this);
                                        if ($el.attr("data-did") == i.DID)
                                            if ($el.attr('filename').length < 1) {
                                                cvp = false;
                                                $el.closest(".control-group").addClass("error");
                                                $el.find('.qq-upload-button').next('span').remove();
                                                $el.find('.qq-upload-button').after('<span class="error">' + EFlang.FileRequired + '</span>');
                                                $('.help-inline').show();
                                                filesvalid = false;
                                            }
                                    }
                                    else {
                                        $el = $(this);
                                        if ($el.attr('filename').length < 1) {
                                            cvp = false;
                                            $el.closest(".control-group").addClass("error");
                                            $el.find('.qq-upload-button').next('span').remove();
                                            $el.find('.qq-upload-button').after('<span class="error">' + EFlang.FileRequired + '</span>');
                                            $('.help-inline').show();
                                            filesvalid = false;
                                        }
                                    }
                                });

                                var gridId = "#netoloji-grid-" + i.DID;

                                var isValidTable = ValidateTable(gridId);
                                if (!isValidTable) {
                                    $(gridId).addClass("invalid-table");
                                    $(gridId).parent().parent().parent(".control-group").addClass("error");
                                    $(gridId).parent().parents(".control-group").addClass("error");
                                }

                            });
                        }

                    },

                });

                if (!ignore && !ignoreall) {
                    $('.form-validate input,.form-validate select,.form-validate textarea').each(function () {
                        if ($(this).attr("data-rule-required") === "true") {
                            $(this).removeClass('igr');
                        }
                    });
                    ValidateAllTable();
                }
                $(".search-grid-input").addClass("igr");
                $('.form-validate').validate().settings.ignore = '.igr';

                var isValidTable = true;
                if ($(".invalid-table").length > 0) {
                    isValidTable = false;
                }

                var isValid = $(".form-validate").valid();

                $('.TaskActionSub').attr('disabled', true);
                if (!isValid || !isValidTable) {

                    $buttonEl.find('span').remove();
                    $buttonEl.text($buttonEl.attr("oldText"));

                    $('.TaskActionSub').attr('disabled', false);

                    //Detay sayfası ise
                    if (window.location.href.indexOf('Task/Details') > 0) {

                        try {
                            $("html, body").stop().delay(100).animate({ scrollTop: $("#kt_content_taskdetail .error").filter(":first").position().top }, 1000);

                        } catch (e) { }
                    }
                    else {
                        //Panel içinde açılan sayfa ise
                        try {
                            $('#kt_quick_panel').stop().delay(100).animate({ scrollTop: $("#kt_content_taskdetail .error").filter(":first").position().top }, 1000);
                        } catch (e) { }
                    }

                    return false;
                }

                if ($("#subtaskform").valid() && filesvalid && isValidTable) {
                    $('.TaskActionSub').attr('disabled', true);
                    var timeOut = $(this).attr('data-initialdelay');
                    SendFormDataSub(formData, timeOut, true);
                }
                else {
                    ValidateAllTable();
                    $buttonEl.find('span').remove();
                    $buttonEl.text($buttonEl.attr("oldText"));
                    $('.TaskActionSub').attr('disabled', false);
                }
            }
            else {
                $('#subtaskform button.TaskActionSub').attr('disabled', false);
                $buttonEl.find('span').remove();
                $buttonEl.text($buttonEl.attr("oldText"));
            }
        }
    });
}
function signDocTask(v) {
    $('.errSign').addClass("d-none");
    var did = parseInt($(v).data('esigndid'));
    var ciid = parseInt($(v).data('esignciid'));
    var fileName = $(v).data('esignfilename');
    var isPdf = $(`div.file-uploader[data-did='${did}']`).attr('filename').split(';')[0].split('.').pop() == "pdf";
    eSignDocument(isPdf, ciid, did, fileName);
    return false;
}

function ValidateAllTable() {
    $("#subtaskform table[id^='netoloji-grid-']").each(function () {
        var id = $(this).attr('id').split("-")[2];
        var req = $(this).attr('req');
        $('#netoloji-grid-' + id + ' tbody tr td input,#netoloji-grid-' + id + ' tbody tr td textarea,#netoloji-grid-' + id + ' tbody tr td select').each(function () {
            var attr = $(this).attr('required');
            if (typeof attr !== typeof undefined && attr !== false) {
                if (isEmpty($(this).val())) {
                    $('#netoloji-grid-' + id).addClass("invalid-table");
                    if ($(this).attr('type') === "file") {
                        $(this).parent("div").addClass("invalids");
                    } else {
                        $(this).addClass("invalids");
                    }
                }
            }
        });

    });
}

function ValidateTable(gridId) {
    var retValue = true;
    $(gridId + ' tbody tr td input').each(function () {
        var attr = $(this).attr('required');
        if (typeof attr !== typeof undefined && attr !== false) {
            if (isEmpty($(this).val())) {
                retValue = false;
                return retValue;
            }
        }
    });
    $(gridId + ' tbody tr td textarea').each(function () {
        var attr = $(this).attr('required');
        if (typeof attr !== typeof undefined && attr !== false) {
            if (isEmpty($(this).val())) {
                retValue = false;
                return retValue;
            }
        }
    });
    $(gridId + ' tbody tr td select').each(function () {
        var attr = $(this).attr('required');
        if (typeof attr !== typeof undefined && attr !== false) {
            if (isEmpty($(this).val())) {
                retValue = false;
                return retValue;
            }
        }
    });
    return retValue;
}

function isEmpty(value) {
    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

function SendFormDataSub(formData, timeOut, issub) {
   
    if (!issub)
        CIID = $("[name=CIID]").val();

    try {
        if (typeof TIID === "undefined" || TIID == 0) {
            TIID = parseInt($('#subtaskform').find("#taskTIID").val());
        }
    } catch (e) { }

    if ($("#subtaskform table[id^='netoloji-grid-']").length > 0) {
        var tableData = GetAllDataForSave(issub);
        if (tableData.length > 0) {

            $.ajax({
                async: false,
                type: "POST",
                global: false,
                dataType: 'json',
                url: "/NewLineItemTable/SaveNewLineItemTable",
                data: { "lineItemData": tableData, "CIID": CIID, "TIID": TIID },
                success: function (response) {
                    if (!response.result) {
                        devamet = false;
                        Pagination(response.did, response.tableId, response.page, response.rowCount, false);
                        var page = parseInt(response.page) + 1;
                        $('#pagination-' + response.tableId + ' li:nth-child(' + page + ')').addClass('active');
                        ValidateTable("#netoloji-grid-" + response.did);
                    } else {
                        devamet = true;
                    }
                }
            });
        }
        else {
            devamet = false;
        }
    }
    else {
        devamet = true;
    }

    var buttonValue = $buttonEl.val();

    if (devamet) {
        if (isGeoLocationEnabled) {
            formData.latitude = latitude;
            formData.longitude = longitude;
        }
        formData.initialDelay = timeOut;
        var isValid = $("#subtaskform").valid();
        $('#subtaskform button.TaskActionSub').attr('disabled', true);

        if (!isValid) {
            try {
                var formName = "#right-3";
                var topOffset = $(formName + " .error").filter(":first").position().top;
                $(formName).scrollTop(topOffset);
            } catch (e) { }
        }
        if (isValid) {
            $.ajax({
                url: "/Task/SaveTaskForm",
                type: "POST",
                data: formData,
                success: function (d) {

                    var data = jQuery.parseJSON(JSON.stringify(d));
                    var hasParentDid = data.HasParentDid;

                    if (buttonValue == "SaveChanges") {

                        $buttonEl.attr("class", "btn btn-primary TaskActionSub");
                        $('.TaskActionSub').removeAttr("disabled");

                        swal({
                            position: 'top-right',
                            type: 'success',
                            text: 'Değişiklikler başarıyla kaydedildi.',
                            showConfirmButton: false,
                            timer: 1500
                        });

                    } else if (buttonValue == "SaveChangesList") {
                        $buttonEl.attr("class", "TaskActionSub btn btn-warning btn-elevate btn-pill btn-sm");

                        swal({
                            position: 'top-right',
                            type: 'success',
                            text: EFlang.Savedsuccessfully,
                            showConfirmButton: false,
                            timer: 700
                        });

                        $('.TaskActionSub').removeAttr("disabled");

                        var CID = $buttonEl.attr("data-id");
                        var CIID = $buttonEl.attr("data-ciid");

                        var actType = 0;
                        if (!convertToBool($buttonEl.attr("data-isNewTask"))) {
                            actType = 1;
                        }

                        //ListStart
                        $.ajax({
                            type: "POST",
                            url: "/Task/ListStart",
                            dataType: "json",
                            data: { 'CIID': data.CIID, 'ActType': actType },
                            success: function (result) {

                                var subPageIndex = 1;
                                var subLastOrderIndex = 0;
                                var subLastOrderDirection = "asc";
                                var filterData = "";

                                try {

                                    var ciidList = NetolojiSubFilter.GetReturnResultFromStorage();
                                    if (ciidList) {
                                        ciidList = "ciids_" + ciidList;
                                        filterData = ciidList;
                                    }

                                    subPageIndex = parseInt($("#efSublistsTableDiv").attr("pageIndex-sub"));
                                    subLastOrderIndex = subOrderIndexVal;
                                    subLastOrderDirection = subOrderDirectionVal;
                                } catch (e) { }

                                $.ajax({
                                    type: 'GET',
                                    dataType: "html",
                                    cache: false,
                                    data: {
                                        CID: CID,
                                        CIID: CIID,
                                        page: subPageIndex,
                                        orderIndex: subLastOrderIndex,
                                        orderDirection: subLastOrderDirection,
                                        filter: filterData
                                    },
                                    url: '/Lists/SubListItems',
                                    success: function (data) {
                                        $("#detailPanelPartial-2").html(data);
                                    }
                                });
                            }
                        });

                    } else if (data.ExceptionMessage == null || data.ExceptionMessage == "") {

                        if (data.RedirectUrl != null && data.RedirectUrl.indexOf('#') != 0) {

                            if (window.location.href.indexOf("Details") > -1) {
                                window.location.href = data.RedirectUrl.replace("Detail", "Details");
                            }
                            else {
                                TogglerTaskPeekRedirectByNewUrl(data.RedirectUrl);
                            }
                        }
                        else {
                            FinalizeTask(data.RedirectUrl)
                        }
                    }
                    else {
                        toastr.error(data.ExceptionMessage);
                    }
                },
                cache: false
            });
        }
        else {
            $buttonEl.find('span').remove();
            $buttonEl.text($buttonEl.attr("oldText"));
            $('.TaskActionSub').attr('disabled', false);
        }
    }
}

function SendFormDataNew(formData, onsave) {

    var devamet = onsave ? true : OnSaveMasterObjectCollectionToXML();

    var buttonValue = $buttonEl.val();

    if (devamet) {

        if (isGeoLocationEnabled) {
            formData.latitude = latitude;
            formData.longitude = longitude;
        }

        $.ajax({
            url: "/Task/SaveTaskForm",
            type: "POST",
            data: formData,
            success: function (d) {
                var data = jQuery.parseJSON(JSON.stringify(d));

                if (buttonValue == "SaveChanges") {
                    $(".alert-success").removeClass("hidden").removeAttr("style").css({ "background": "#C8E5BC" });
                    $buttonEl.attr("class", "btn btn-primary TaskActionSub");
                    //$buttonEl.html('<i class="icon-save"></i> ' + SaveChanges);
                    $('.TaskActionSub').removeAttr("disabled");

                    $('#main').animate({ scrollTop: 0 }, 300);
                } else if (data.ExceptionMessage == null || data.ExceptionMessage == "") {

                    if (data.RedirectUrl != null && data.RedirectUrl.indexOf('#') != 0) {
                        window.location.href = data.RedirectUrl;
                    }
                    else {
                        window.location.href = "/Task/List" + data.RedirectUrl;
                    }
                }
                else {
                    $(".alert-danger").find("span").html(data.ExceptionMessage);
                    $(".alert-danger").removeClass("hidden");
                    $('.TaskActionSub').removeAttr("disabled");
                }
            },
            cache: false
        });
    }
}

function CheckFilesValid() {
    var cvp = true;
    $(".file-uploader").each(function () {
        $el = $(this);
        if ($el.attr('filename').length < 1) {
            if ($el.attr("rq") === "true" || $el.find("input[type='file']").attr("data-rule-required") === "true") {
                cvp = false;
                $el.closest(".control-group").addClass("error");
                $el.find('.qq-upload-button').next('span').remove();
                $el.find('.qq-upload-button').after('<span class="error">' + EFlang.FileRequired + '</span>');
                $('.help-inline').show();
            }
        }
    });
    return cvp;
}

function CheckFilesValidNew(DID) {
    var cvp = true;
    $(".file-uploader[rq='true']").each(function () {
        $el = $(this);
        if ($el.attr("data-did") == DID)
            if ($el.attr('filename').length < 1) {
                cvp = false;
                $el.closest(".control-group").addClass("error");
                $el.find('.qq-upload-button').next('span').remove();
                $el.find('.qq-upload-button').after('<span class="error">' + EFlang.FileRequired + '</span>');
                $('.help-inline').show();
                return false;
            }
    });
    return cvp;
}

function SetUploaders() {
    ocrDocumentDidList = [];
    $('.file-uploader-sub').each(function (i, v) {
        var Allextensions = $(v).data("extensions");
        var extensions = $(v).data("extensions") == "" ? [] : $(v).data("extensions").split("|");
        var isSign = $(v).data("sign") == "True";
        var isOcr = $(v).data("ocr") == "True";
        var did = parseInt($(v).data("did"));
        var ciid = parseInt($(v).data("ciid"));
        ocrDocumentDidList.push({ Did: did, IsMatch: false, MatchedDidList: [] });
        $(v).fineUploader({
            debug: true,
            request: {
                endpoint: "/task/uploadfile",
                inputName: 'upload',
                params: { Allextensions, isSign, isOcr, did, ciid },
            },
            text: {
                uploadButton: '<i class="icon-upload"></i> ' + EFlang.UploadText,
                cancelButton: EFlang.CancelText,
                failUpload: EFlang.UploadFailText,
                formatProgress: '{percent}% - {total_size}',
                retryButton: EFlang.RetryText,
                waitingForResponse: EFlang.waitingForResponseText,
                filenameText: ''
            },
            multiple: false,
            validation: {
                sizeLimit: $(v).data("datasize") * 1024 * 1024, // 50 mb = 50 * 1024 * 1024 bytes
                allowedExtensions: extensions
            }

        }).on('cancel', function (id, filename) {
            $(".TaskActionSub").prop('disabled', false);
            $(".ListFormButton").prop('disabled', false);
            var canceledId = id.target.id;
            var _fileName = $("#" + canceledId).attr("filename");
            var _realFilename = $("#" + canceledId).attr("realfilename");
            var _didFileName = $("#" + canceledId).attr("data-did");
            var _ciidFileName = $("#" + canceledId).attr("data-ciid");

            if (isOcr && ocrDocumentDidList.filter(k => k.Did == did && k.IsMatch == true).length > 0) {
                confirmClearMatchedData(did);
            }
            if (_fileName !== null && _fileName !== ''
                && _realFilename !== null && _realFilename !== ''
                && _didFileName !== null && _didFileName !== ''
                && _ciidFileName !== null && _ciidFileName !== '') {
                var canceledID = "#" + canceledId;
                $.ajax({
                    type: 'POST',
                    dataType: "json",
                    async: true,
                    url: '/Task/DeleteUploadWithCancel',
                    data: { "ciid": _ciidFileName, "did": _didFileName, "filename": _fileName, "realfilename": _realFilename },
                    success: function (data) {
                        $(canceledID).attr("filename", "");
                        $(canceledID).attr("realfilename", "");
                        $("a[data-esigndid='" + did + "']").addClass("d-none");
                        $("a[data-esigndid='" + did + "']").attr("data-esignfilename", "");
                    }
                });
            }
            //cancel
        }).on('complete', function (event, id, filename, responseJSON) {
            var result = jQuery.parseJSON(JSON.stringify(responseJSON));
            var linkSign = "";
            if (result.success == true) {
                var isPdf = result.filename.split('.').pop() == "pdf";
                if (isSign && isPdf) {
                    /*subESignDocument(true, ciid, did, result.filename);*/
                    linkSign = ` - <a href='#' class='SignAction' style='font-size: 1em;text-decoration: underline;color: #039aae;' data-esigndid='${did}' onclick='javascript:subESignDocument(true, ${ciid}, ${did}, "${result.filename}"); return false;' data-esignciid='${ciid}' data-esignfilename='${result.filename}'>${EFlang.Sign}</a>`;
                }
                if (isOcr) {
                    var ntldoc = document.querySelector("#ntlOcrJson");
                    ntldoc.load(window.location.protocol + '//' + window.location.host + '/Img/NTL-Robot.json');
                    var progressIndicator = document.querySelector(".progress__indicator-outer");
                    progressIndicator.style.visibility = "visible";
                    progressIndicator.style.opacity = "1";
                }
                $(this).find('.qq-upload-status-text').html(" - " + result.message + linkSign);
            } else {
                if (result.error != '' && result.error != undefined) {
                    $(this).find('.qq-upload-status-text').html(" - " + result.error + linkSign);
                } else if (result.message != '' && result.message != undefined) {
                    $(this).find('.qq-upload-status-text').html(" - " + result.message + linkSign);
                }
            }
            $(this).closest(".control-group").removeClass("error");
            $(this).find('.qq-uploader .error').remove();
            $(this).find('.qq-progress-bar-wrap').hide();
            $(this).attr("filename", result.filename);
            $(this).attr("realfilename", filename.trim());
            $(this).find(".qq-upload-cancel").css("display", "inline");
            $(".TaskActionSub").prop('disabled', false);
            $(".ListFormButton").prop('disabled', false);
            clearMatchedInputs(did);
            var _fineUploader = $(this);
            if (result.success == true && isOcr) {
                $.ajax({
                    url: "/Task/OcrParse",
                    type: "POST",
                    data: { "ciid": ciid, "did": did, "fileName": result.filename, "tiid": parseInt($('#subtaskform').find("#taskTIID").val()) },
                    success: function (d) {
                        var progressIndicator = document.querySelector(".progress__indicator-outer");
                        progressIndicator.style.opacity = "0";
                        progressIndicator.style.visibility = "hidden";
                        _fineUploader.find('.qq-upload-status-text').html(" - " + result.message + linkSign);
                        var _resultOcr = JSON.parse(d);
                        if (_resultOcr.ocr != null) {
                            if (_resultOcr.ocr.isSuccess) {
                                var ocrMatchedList = _resultOcr.ocr.matchedList;
                                if (ocrMatchedList != null && ocrMatchedList.length > 0) {
                                    jQuery.each(ocrMatchedList, function (_key, _val) {
                                        var _el = ocrMatchedList[_key];
                                        if (_el.DataValue != "" && _el.DataValue != null) {
                                            try {
                                                switch (_el.DidType) {
                                                    case 1:
                                                    case 11:
                                                        //String:1 /Encrypted String:11
                                                        var inpt = $("input[data-did='" + _el.MatchedDid + "']");
                                                        if (inpt.length > 0) {
                                                            ocrDocumentDidList.filter(function (obj) { return obj.Did === did }).map(function (obj) { obj.IsMatch = true; obj.MatchedDidList.push({ Type: _el.DidType, Id: _el.MatchedDid }) });
                                                            inpt.val(_el.DataValue);
                                                        }
                                                        break;
                                                    case 2:
                                                        //Numeric
                                                        var inpt = $("input[data-did='" + _el.MatchedDid + "']");
                                                        if (inpt.length > 0) {
                                                            ocrDocumentDidList.filter(function (obj) { return obj.Did === did }).map(function (obj) { obj.IsMatch = true; obj.MatchedDidList.push({ Type: _el.DidType, Id: _el.MatchedDid }) });
                                                            inpt.val(_el.DataValue);
                                                            inpt.focus();
                                                        }
                                                        break;
                                                    case 16:
                                                        //Encrypted Numeric
                                                        var inpt = $("input[data-did='" + _el.MatchedDid + "']");
                                                        if (inpt.length > 0) {
                                                            ocrDocumentDidList.filter(function (obj) { return obj.Did === did }).map(function (obj) { obj.IsMatch = true; obj.MatchedDidList.push({ Type: _el.DidType, Id: _el.MatchedDid }) });
                                                            inpt.val(_el.DataValue);
                                                            inpt.focus();
                                                        }
                                                        break;
                                                    case 3:
                                                        //DateTime
                                                        var inpt = $("input[data-did='" + _el.MatchedDid + "']");
                                                        if (inpt.length > 0) {
                                                            try {
                                                                var _dateFormat = "DD-MM-YYYY";
                                                                var _inputFormat = inpt.data('format');
                                                                if (_inputFormat != "") {
                                                                    if (_inputFormat.indexOf(' ') >= 0)
                                                                        _dateFormat = _inputFormat.split(' ')[0].toUpperCase() + " " + _inputFormat.split(' ')[1];
                                                                    else
                                                                        _dateFormat = _inputFormat.toUpperCase();
                                                                }
                                                                _dateFormat = _dateFormat.replace("hh:ii", "HH:mm");
                                                                _dateFormat = _dateFormat.replace("HH:MM", "HH:mm:ss");
                                                                var momnt = moment(_el.DataValue, "YYYY-MM-DD HH:mm:ss").format(_dateFormat);
                                                                inpt.val(momnt);
                                                                inpt.focus();
                                                                inpt.datetimepicker('hide');
                                                                ocrDocumentDidList.filter(function (obj) { return obj.Did === did }).map(function (obj) { obj.IsMatch = true; obj.MatchedDidList.push({ Type: _el.DidType, Id: _el.MatchedDid }) });
                                                            } catch (e) { }
                                                        }
                                                        break;
                                                    case 5:
                                                        //Memo
                                                        var inpt = $("textarea[data-did='" + _el.MatchedDid + "']");
                                                        if (inpt.length > 0) {
                                                            ocrDocumentDidList.filter(function (obj) { return obj.Did === did }).map(function (obj) { obj.IsMatch = true; obj.MatchedDidList.push({ Type: _el.DidType, Id: _el.MatchedDid }) });
                                                            inpt.val(_el.DataValue);
                                                        }
                                                        break;
                                                    case 12:
                                                        //Encrypted Memo
                                                        var inpt = $("textarea[data-did='" + _el.MatchedDid + "']");
                                                        if (inpt.length > 0) {
                                                            ocrDocumentDidList.filter(function (obj) { return obj.Did === did }).map(function (obj) { obj.IsMatch = true; obj.MatchedDidList.push({ Type: _el.DidType, Id: _el.MatchedDid }) });
                                                            inpt.val(_el.DataValue);
                                                        }
                                                        break;
                                                    case 8:
                                                        var _litOcr = document.getElementById('netoloji-grid-' + _el.MatchedDid);
                                                        try {
                                                            if (_litOcr !== null && _el.DataValue != null && _el.DataValue.dataHtml != null) {
                                                                if (_el.DataValue.footerData) {
                                                                    $('#row-sc-' + _el.MatchedDid + ' span').html("");
                                                                    $('#row-sc-' + _el.MatchedDid + ' span').html(_el.DataValue.formattedFooterDataResult);
                                                                    $("#pagination-" + _el.MatchedDid + "").attr("rowcount", _el.DataValue.totalRow);
                                                                    var storageName = "rownumstorage-" + ciid + _el.MatchedDid;
                                                                    localStorage.setItem(storageName, _el.DataValue.totalRow);
                                                                }
                                                                $('#tempInfo-' + _el.MatchedDid).html(_el.DataValue.Info);
                                                                $('#netoloji-grid-' + _el.MatchedDid + ' tbody').html('');
                                                                $('#netoloji-grid-' + _el.MatchedDid + ' tbody').append(_el.DataValue.dataHtml);
                                                                SetElementType($('#netoloji-grid-' + _el.MatchedDid + ''));

                                                                Pagination(_el.MatchedDid, _el.MatchedDid, 1, _el.DataValue.totalRow, true, true);

                                                                var sublineCol = $("#row-sc-" + _el.MatchedDid + "").attr('sccol');
                                                                if (sublineCol) {
                                                                    var sublineFormul = $("#row-sc-" + _el.MatchedDid + "").attr('scprocess');
                                                                    SubLinePrecess(_el.MatchedDid, sublineCol, sublineFormul);
                                                                }
                                                                $("#netoloji-grid-" + _el.MatchedDid + " .rowSearchBar input").prop("disabled", false);
                                                                $("#clonedTableId_" + _el.MatchedDid + " .rowSearchBar input").prop("disabled", false);

                                                                $('#netoloji-grid-' + _el.MatchedDid + ' tbody textarea,#netoloji-grid-' + _el.MatchedDid + ' tbody input').each(function (e) {
                                                                    Checkme($(this));
                                                                });
                                                                ocrDocumentDidList.filter(function (obj) { return obj.Did === did }).map(function (obj) { obj.IsMatch = true; obj.MatchedDidList.push({ Type: _el.DidType, Id: _el.MatchedDid }) });
                                                            }
                                                        } catch (e) { }
                                                        break;
                                                }
                                            } catch (e) {

                                            }
                                        }
                                    });
                                    if ($('#bottomSection').length > 0) {
                                        if ($('#bottomSection button').length > 0)
                                            $('#bottomSection button').last().focus();
                                    } else if ($('.ListFormButton').length > 0)
                                        $('.ListFormButton').focus();
                                }
                            }
                        }
                    },
                    error: function (err) {
                        var progressIndicator = document.querySelector(".progress__indicator-outer");
                        progressIndicator.style.opacity = "0";
                        progressIndicator.style.visibility = "hidden";
                        console.log(err);
                        _fineUploader.find('.qq-upload-status-text').html(" - " + result.message + linkSign);
                    },
                    cache: false
                });
            }
        }).on('progress', function (event, id, filename, responseJSON) {
            $(".TaskActionSub").prop('disabled', true);
            $(".ListFormButton").prop('disabled', true);
        });
    });

    $('.upload-excel').fineUploader({
        debug: true,
        request: {
            endpoint: "/task/UploadExcel",
            inputName: 'upload'
        },
        text: {
            uploadButton: '<i class="icon-upload"></i> ' + EFlang.UploadText,
            cancelButton: EFlang.CancelText,
            failUpload: EFlang.UploadFailText,
            formatProgress: '{percent}% - {total_size}',
            retryButton: EFlang.RetryText,
            waitingForResponse: EFlang.waitingForResponseText,
            filenameText: ''
        },
        multiple: false,
        validation: {
            allowedExtensions: ['xlsx'],
            sizeLimit: 1024 * 1024 * 1024 // 50 mb = 50 * 1024 * 1024 bytes
        }
    }).on('complete', function (event, id, filename, responseJSON) {
        var gridName = $(this).data("gridname").toString();
        var result = jQuery.parseJSON(JSON.stringify(responseJSON));
        var formData = $("#subtaskform").serializeObject();

        $.ajax({
            url: "/Task/GetTableFromExcel",
            type: "POST",
            data: { "FormData": formData, "GridName": gridName, "FilePath": result.filePath },
            success: function (d) {
                var data = jQuery.parseJSON(JSON.stringify(d));
                if (data.ExceptionMessage == "0") {
                    var $ContainerEl = $("div").find("'[data-name=" + gridName + "]'");
                    $ContainerEl.find("table tbody").append(data.ResultData);
                    var $gridEL = $ContainerEl.find(".gridelement");
                    var ScActive = $gridEL.attr("data-scActive");

                    if (ScActive == 'true') {
                        SummaryCalculate($gridEL);
                    }
                }
                else {
                    alert(data.ExceptionMessage);
                }
            },
            cache: false
        });
    });
}

function subOpenTskSignModal(isPdf) {
    var ciid = parseInt($('#sign_ciid').val());
    var did = parseInt($('#sign_did').val());
    var fileName = $('#sign_fileName').val();
    $('#task_modal_sign_location').addClass('loading');
    var pageNumber = isPdf == true ? parseInt($('#ddlESignTskPdfPageSize').val()) : 1;
    var selectedCell = 0;
    document.querySelectorAll("table.es-tsk-table-sign tbody tr td div.es-tsk-table-cell").forEach(div => {
        var esImg = div.querySelector("img#eSignTskImg");
        if (esImg) {
            selectedCell = parseIntOrDefault(div.getAttribute("data-id"));
        }
    });
    if (isPdf && selectedCell == 0) {
        swal({
            position: 'top-right',
            type: 'info',
            text: "E-İmza: Lütfen E-İmza konumunu seçiniz",
            showConfirmButton: false,
            timer: 5000
        });
        $('#task_modal_sign_location').removeClass('loading');
    }
    else {
        $.ajax({
            type: 'GET', dataType: "json", traditional: true, url: "/task/GetSignUrlTask",
            data: { 'ciid': ciid, 'did': did, 'fileName': fileName, 'pageNumber': pageNumber, 'selectedCell': selectedCell },
            success: function (result) {
                if (result.IsSuccess) {
                    $('#task_modal_esignature').addClass('loading');
                    $('#task_iframe_signature').children('iframe')[0].src = result.ObjectModel.Url;
                    $('#task_modal_esignature').modal({ backdrop: 'static', keyboard: false, show: true });
                    $('#btnSignDocAl').removeClass("btnSignDocAl");
                } else if (result != null && result.Message != null) {
                    swal({
                        position: 'top-right',
                        type: 'info',
                        text: result.Message,
                        showConfirmButton: false,
                        timer: 5000
                    });
                }
                $('#task_modal_sign_location').modal('hide');
                $('#task_modal_sign_location').removeClass('loading');
            },
            fail: function (xhr, textStatus, errorThrown) {
                $('#task_modal_sign_location').modal('hide');
                $('#task_modal_sign_location').removeClass('loading');
                console.log(xhr + "\n" + textStatus + "\n" + errorThrown);
            }
        });
    }
}
function subESignDocument(isPdf, ciid, did, fileName) {
    document.querySelectorAll(".es-tsk-table-cell").forEach(element => { element.innerHTML = ""; });
    $('#task_iframe_signature').children('iframe')[0].src = "about:blank";
    $('#sign_ciid').val(ciid);
    $('#sign_did').val(did);
    $('#sign_fileName').val(fileName);

    if (isPdf)
        subSetTaskSignLocationPDF(ciid, did, fileName, 1);
    else
        subOpenTskSignModal(false);
}
function subSetTaskSignLocationPDF(ciid, did, fileName, page) {
    $.ajax({
        type: 'GET', dataType: "json", traditional: true, url: "/task/GetUserAutoSignLocation",
        success: function (result) {
            Swal.close();
            if (result.IsSuccess) {
                if (result.ObjectModel === true) {
                    subOpenTskSignModal(false);
                } else {
                    $('#task_modal_sign_location').addClass('loading');
                    $('#task_modal_sign_location').modal({ backdrop: 'static', keyboard: false, show: true });
                    var ddlESignTskPdfPageSize = document.getElementById("ddlESignTskPdfPageSize");
                    $.ajax({
                        type: 'GET', dataType: "json", traditional: true, url: "/task/GetImageFromPDF",
                        data: { 'cid': CID, 'ciid': ciid, 'did': did, 'fileName': fileName, 'page': page },
                        success: function (result) {
                            if (result.IsSuccess) {
                                var base64String = "data:image/png;base64," + result.ObjectModel;
                                document.getElementById("eSignTskPdfPreviewImg").src = base64String;
                                var pdfPageSize = parseInt(result.Model);

                                ddlESignTskPdfPageSize.innerHTML = "";
                                for (let i = 1; i <= pdfPageSize; i++) {
                                    let option = document.createElement("option");
                                    option.value = i;
                                    option.textContent = i;
                                    option.selected = i == page ? true : false;
                                    ddlESignTskPdfPageSize.appendChild(option);
                                }
                                ddlESignTskPdfPageSize.setAttribute("data-pagesize", pdfPageSize);

                                $('#task_modal_sign_location').removeClass('loading');
                            } else if (result != null && result.Message != null) {
                                swal({
                                    position: 'top-right',
                                    type: 'info',
                                    text: result.Message,
                                    showConfirmButton: false,
                                    timer: 5000
                                });
                            }
                            $('#task_modal_sign_location').removeClass('loading');
                        },
                        fail: function (xhr, textStatus, errorThrown) {
                            console.log(xhr + "\n" + textStatus + "\n" + errorThrown);
                            $('#task_modal_sign_location').removeClass('loading');
                        }
                    });
                }
            }
        },
        fail: function (xhr, textStatus, errorThrown) {
            console.log(xhr + "\n" + textStatus + "\n" + errorThrown);
            $('#task_modal_sign_location').removeClass('loading');
        }
    });
}
function SubSetElements() {

    $('#subtaskform input, #subtaskform select, #subtaskform textarea').each(function (i) {
        if ($(this).attr('rd') === "True") {
            if ($(this).hasClass('popupselecttext')) {
                $(this).next().next().prop('disabled', true);
            }
            else {
                $(this).attr("readonly", true);
                if ($(this).attr('type') == "log") {
                    $(this).remove();
                }
            }
        }
    });

    $("#subtaskform button.TaskActionSub").each(function () {

        $el = $(this);
        if ($el.attr("data-backcolor") != undefined) {
            $el.css("background-color", $el.attr("data-backcolor"));
        }
        if ($el.attr("data-textcolor") != undefined) {

            $el.css("color", $el.attr("data-textcolor"));
        }
    });

    $('#subtaskform input.datetime').each(function () {
        var maxDateAttr = parseInt($(this).attr("max-date"));
        var minDateAttr = parseInt($(this).attr("min-date"));

        if (maxDateAttr > 0)
            var maxDate = new Date(maxDateAttr * 60 * 1000);

        if (minDateAttr > 0)
            var minDate = new Date(minDateAttr * 60 * 1000);

        var dateFormatPattern = $(this).attr('date-format');

        $dateItem = $(this);

        var datepickerConf = {
            culture: currentCulture,
            min: minDate ? new Date(minDate) : new Date(1000, 1, 1),
            max: maxDate ? new Date(maxDate) : new Date(3000, 1, 1),
            animation: false
        };

        if (dateFormatPattern == 'long') {
            $(this).kendoDateTimePicker(datepickerConf);
            if ($dateItem.attr("rd") != "False") {
                $dateItem.data("kendoDateTimePicker").readonly();
            }
        } else if (dateFormatPattern == 'short') {
            $(this).kendoTimePicker();
            if ($dateItem.attr("rd") != "False") {
                $dateItem.data("kendoTimePicker").readonly();
            }
        } else {
            $(this).kendoDatePicker(datepickerConf);
            if ($dateItem.attr("rd") != "False") {
                $dateItem.data("kendoDatePicker").readonly();
            }
        }



        $(this).parent();

    });

    $('#subtaskform .tablebody.old').on('scroll', function () {
        $('.tableheader').scrollLeft($(this).scrollLeft());
    });

    $(document).on('keydown', '#subtaskform input.numeric', function (e) {
        if (e.shiftKey)
            e.preventDefault();
        if (e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 190 || e.keyCode == 109 || e.keyCode == 188 || e.keyCode == 189 || e.keyCode == 110 || e.keyCode == 9) {
            //Sadece sayılar ve nokta(190), virgül(188), tab(9)
        } else {
            if (e.keyCode < 95) {
                if (e.keyCode < 48 || e.keyCode > 57) {
                    e.preventDefault();
                }
            } else {
                if (e.keyCode < 96 || e.keyCode > 105) {
                    e.preventDefault();
                }
            }
        }
    });

    var search = 0;
    var limitPerPage = 20;
    var currentPage = 1;
    var initiliazeCount = 0;
    var allTableDidIds = [];
    function getDecimalSeparator(locale) {
        var numberWithDecimalSeparator = 1.1;
        return Intl.NumberFormat(locale)
            .formatToParts(numberWithDecimalSeparator)
            .find(part => part.type === 'decimal')
            .value;
    }
    function getNumberGroupSeparator(locale) {
        var numberWithDecimalSeparator = 1000.1;
        var res = Intl.NumberFormat(locale)
            .formatToParts(numberWithDecimalSeparator)
            .find(part => part.type === 'group');
        return res != undefined ? res.value : ".";
    }

    function NumericFormatAz(value, format) {
        var result = value;
        $.ajax({
            type: "POST",
            url: "/NewLineItemTable/NumericFormat",
            data: { "value": value.toString(), "format": format },
            dataType: 'json',
            async: false,
            success: function (response) {
                result = response.Result.toString();
            }
        });
        return result;
    }

    function NumericFormat(dataformat, Value) {
        var decimalCharacters = dataformat.length > 1 ? dataformat.substring(1, dataformat.length) : 2;

        if (Number.isSafeInteger(Value)) {
            number = BigInt(Value);
        }

        if (dataformat.toUpperCase().substring(0, 1) == "N") {
            var nmbr = Value.toLocaleString(EFlang.localeCode, { minimumFractionDigits: decimalCharacters, maximumFractionDigits: decimalCharacters });
        }
        else if (dataformat.toUpperCase().substring(0, 1) == "C") {
            var nmbr = Value.toLocaleString(EFlang.localeCode, { style: 'currency', currency: EFlang.Currency, currencyDisplay: 'symbol', minimumFractionDigits: decimalCharacters, maximumFractionDigits: decimalCharacters });
        }
        if (~EFlang.Currency.indexOf("EGP") && dataformat.toUpperCase().substring(0, 1) == "C") {
            nmbr = nmbr.replace("ج.م.‏", "");
            nmbr = "\u202A" + nmbr + "\u202A" + "ج.م.";
        }
        return nmbr;
    }



    $(document).on('focusout', '#subtaskform input.numeric', function (e) {
        if ($(this).val() != "") {
            var dataformat = $(this).attr('data-format');
            //data format null geldiğinde default format atmaması için yapılmıştır.
            if (!(dataformat == "" || dataformat == undefined)) {
                var nmbr = $(this).parseNumber({ format: dataformat, locale: EFlang.localeCode });

                if (dataformat.toUpperCase().substring(0, 1) == "N" || dataformat.toUpperCase().substring(0, 1) == "C") {
                    var nmbr = EFlang.localeCode == "az" ? NumericFormatAz(nmbr, dataformat) : NumericFormat(dataformat, nmbr);
                    $(this).val(nmbr);
                }
                else {

                    $(this).val(nmbr);

                    $(this).formatNumber({ format: dataformat, locale: EFlang.localeCode });

                    nmbr = $(this).parseNumber({ format: dataformat, locale: EFlang.localeCode });

                    $(this).formatNumber({ format: dataformat, locale: EFlang.localeCode });
                }
            }

            if (nmbr == '') {
                $(this).val('0');
                nmbr = 0;
            }

            $(this).attr('data-val', nmbr);
            if ($(this).hasClass('gridnum')) {
                $(this).parents("td").attr('etext', $(this).val()).attr('eval', nmbr);
                SetLinkedEl($(this));
            }
        }
        else {
            $(this).attr('data-val', "");
        }
    });

    SetTDEvent();
    SubSetSelectors();

}

function SubSetSelectors() {
    $('.popupselecttext').attr("readonly", true);

    $(document).on('click', '.sub-popupselector', function (e) {
        $(this).html('<span class="icon-refresh icon-spin"></span>'); ""
        $("#myModalLabel").html($(this).attr('data-displayname'));
        var DID = $(this).data('did');
        var OrderedColumn = "";
        var OrderDir = "ASC";
        var Condition = "";
        var Con = $(this).attr("Con");
        var element = $(this);
        $('.popupselectbox-sub').attr('data-targetinput', element.attr('data-targetinput'));
        $('.popupselectbox-sub').attr('data-targetdid', DID);
        $('.popupselectbox-sub').attr('Con', Con);

        GetSubSelectorValues(DID, OrderedColumn, OrderDir, Condition, 1, true, Con);
    });

    var dataddq;
    var _gridIndex;
    var _rowIndex;
    var _did;
    var ua = navigator.userAgent.toLowerCase();

    if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('chrome') > -1) {

        } else {
            //$(document).delegate('.popuptext', 'click', function (e) {
            //    var item = $(this).next().next();
            //    alert($(item).html());
            //    item.html('<span class="icon-refresh icon-spin"></span>');
            //    item.click();
            //});
        }
    }
    $(document).delegate('.popupcolselector-sub', 'click', function (e) {

        $(this).html('<span class="icon-refresh icon-spin"></span>');

        $("#myModalLabel").html("");

        var DID = $(this).data('did');
        var OrderedColumn = "";
        var OrderDir = "ASC";
        var Condition = "";
        var element = $(this);
        $('.popupselectbox-sub').attr('data-targetinput', element.attr('data-targetinput'));
        $('.popupselectbox-sub').attr('data-target-rowindex', $(this).parents("tr").index());

        //editablepopup için eklendi.(birden fazla kolon içeren tablolar için nasıl olacak.)
        if ($(".popupcolselector-sub").parent().find(".popupselecttext").attr("editpopup") === "true") {
            Condition = "1|" + $(".popupcolselector-sub").parent().find(".popupselecttext").val();
            var searchtext = $(".popupcolselector-sub").parent().find(".popupselecttext").val();
            var DDQ = $(this).parents('table').find('thead th[data-col = "' + $(this).parents('td').attr('data-col') + '"]').attr('data-ddq');
        }

        var lns = new Array();
        $parenttr = $(this).parent().parent().parent();
        $($parenttr.children('td').each(function (i) {
            if ($(this).attr('data-col') != null) {
                var vc = new VIEWCOL($(this).attr('etype'), $(this).attr('data-col'), $(this).attr('eval'));
                lns[i] = vc;
            }
        }));

        if (DDQ == undefined) {
            DDQ = $(this).parents("td").attr("dataddq");
            $('.popupselectbox-sub').attr('data-targetdid', DID);
        }

        dataddq = DDQ;
        _did = $(this).parents(".grid").attr("did");
        var gridInd = $(this).parents(".grid").attr("index");
        var name = $(this).parents(".grid").attr("name");

        $('.popupselectbox-sub').attr('data-tableindex', gridInd);

        var index = $(this).parents(".grid").attr("index");
        var rowIndex = $('.popupselectbox-sub').attr('data-target-rowindex');
        var currentPage = $(".grid[index=" + gridInd + "]").data("kendoGrid").dataSource.page();
        var currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
        var columnField = $(this).parents("td").attr("columnid");

        var _readonly = getSingleValue(index, columnField, rowIndex, "readonly", -1, name);

        $('.popupselectbox-sub').attr('data-target-readonly', _readonly);

        GetSubSelectorValuesCol(DDQ, lns, OrderedColumn, OrderDir, Condition, 1, true, index, _did, currentRowIndex, columnField);


    });

    $('.popupselectbox-sub').on('hidden', function () {

        $('.popupselectbox-sub').attr('data-targetinput', '');
        $('.popupselectbox-sub').attr('data-targetdid', '');
        $('.popupselectbox-sub').attr('data-current', '');
        $('.popupselectbox-sub').attr('data-textcol', '');
        $('#pps-table-col-grp-sub').empty();
        $('#pps-table-col-names-sub').empty();
        $('#pps-table-filter-sub').empty();
        $('#pps-table-data-sub').empty();
        $('.popupselectbox-sub .navlink').attr('data-page', '1');
    });

}

function GetSubSelectorValues(DID, OrderedColumn, OrderDir, Condition, PageNum, IsNew, Con) {

    $.ajax({
        url: "/Task/GetDataList",
        type: "GET",
        data: { "FormHash": $("#subtaskform [name='taskhash']").val(), "DID": DID, "OrderedColumn": OrderedColumn, "OrderDir": OrderDir, "Condition": Condition, "PageSize": SelectorListSize, "PageNum": PageNum, "Con": Con },
        success: function (d) {
            var data = jQuery.parseJSON(JSON.stringify(d));
            $('.popupselectbox-sub').attr('data-current', PageNum);

            WriteSelectorSubListMetronic(data, $('.sub-popupselector'), PageNum, IsNew);
            hideLoading();
        },
        cache: false
    });
}

//edit popup
function GetDataPopup(DID, DDQ, Condition, tableIndex, currentRowIndex, name, columnField, rowIndex, type, format, readonly, _showValCol) {

    var name = $(".grid[did=" + DID + "]").attr("name");

    $.ajax({
        url: "/Task/GetDataValue",
        type: "POST",
        data: {
            "FormHash": $("#subtaskform [name='taskhash']").val(),
            "DDQ": DDQ,
            "objectCollection": JSON.stringify(masterObjectCollection[tableIndex][name][currentRowIndex]),
            "Condition": Condition,
        },
        success: function (d) {

            var updatedObject = {
                tableId: DID,
                columnField: columnField,
                rowIndex: currentRowIndex,
                index: tableIndex,
                dataValue: "",
                dataText: "",
                formula: "",
                showValCol: _showValCol,
                format: format,
                ddQuery: DDQ,
                type: type,
                readonly: readonly,

            }
            if (d.Values.length > 0) {

                updatedObject.dataValue = d.Values[0][0];
                updatedObject.dataText = d.Values[0][2];

            }


            var columnSize = $(".grid[did=" + _did + "]").find("thead[role=rowgroup] tr[role=row] th[role=columnheader]").size();
            registerObject(updatedObject, currentRowIndex, columnSize, name);
            $(".grid[did=" + _did + "]").data("kendoGrid").dataSource.data()[currentRowIndex][columnField] = updatedObject.dataText;
            WriteToGridCell(_did, currentRowIndex, columnField, updatedObject.dataText);

            calculateFormulaNew(_did, currentRowIndex);
            $.fn.setRelatedFields(tableIndex, name, rowIndex, columnField);

        },
        cache: false
    });

}
function GetSubSelectorValuesCol(DDQ, LINES, OrderedColumn, OrderDir, Condition, PageNum, IsNew, tableIndex, DID, currentRowIndex, column) {

    var name = $(".grid[did=" + DID + "]").attr("name");

    $.ajax({
        url: "/Task/GetDataListCol",
        type: "POST",
        data: {
            "FormHash": $("#subtaskform [name='taskhash']").val(),
            "DDQ": DDQ,
            "Colvals": JSON.stringify(LINES),
            "objectCollection": JSON.stringify(masterObjectCollection[tableIndex][name][currentRowIndex]),
            "OrderedColumn": OrderedColumn,
            "OrderDir": OrderDir,
            "Condition": Condition,
            "PageSize": SelectorListSize,
            "PageNum": PageNum,
            "DID": DID,
            "rowIndex": _rowIndex,
            "column": column
        },
        success: function (d) {

            if (d.Total == 0)
                _container = undefined;

            var data = jQuery.parseJSON(JSON.stringify(d));
            $('.popupselectbox-sub').attr('data-current', PageNum);

            WriteSelectorSubListMetronic(data, $('.popupcolselector-sub'), PageNum, IsNew, Condition);
            hideLoading();
        },
        cache: false
    });
}
function SetDropDownValuesCol($dropEl) {

    var DDQ = $dropEl.parents('table').find('thead th[data-col = "' + $dropEl.parent().parent().attr('data-col') + '"]').attr('data-ddq');
    if (DDQ != "") {
        var lns = new Array();
        $parenttr = $dropEl.parent().parent().parent();
        $($parenttr.children('td').each(function (i) {
            if ($(this).attr('data-col') != null) {
                var vc = new VIEWCOL($(this).attr('etype'), $(this).attr('data-col'), $(this).attr('eval'));
                lns[i] = vc;
            }
        }));

        $.ajax({
            url: "/Task/GetDropdownListCol",
            type: "POST",
            async: false,
            data: { "FormHash": $("#subtaskform [name='taskhash']").val(), "DDQ": DDQ, "Colvals": JSON.stringify(lns) },
            success: function (d) {
                var data = jQuery.parseJSON(JSON.stringify(d));
                WriteDropList(data, $dropEl);
            },
            cache: false
        });
    }
}
function SetOneValueElement($inputEL) {
    var DDQ = $inputEL.parents('table').find('thead th[data-col = "' + $inputEL.parent().parent().attr('data-col') + '"]').attr('data-ddq');
    if (DDQ != "" && DDQ != null) {
        var lns = new Array();
        $parenttr = $inputEL.parent().parent().parent();
        $($parenttr.children('td').each(function (i) {
            if ($(this).attr('data-col') != null) {
                var vc = new VIEWCOL($(this).attr('etype'), $(this).attr('data-col'), $(this).attr('eval'));
                lns[i] = vc;
            }
        }));

        $.ajax({
            url: "/Task/GetOneElementValue",
            type: "POST",
            async: false,
            data: { "FormHash": $("#subtaskform [name='taskhash']").val(), "DDQ": DDQ, "Colvals": JSON.stringify(lns) },
            success: function (d) {
                var data = jQuery.parseJSON(JSON.stringify(d));
                if ($inputEL.hasClass("numeric")) {
                    var dataformat = $(this).find("input").attr('data-format');
                    if (dataformat == "" || dataformat == undefined) {
                        dataformat = "#.########"
                    }

                    $inputEL.val(data.Values[0]);

                }
                else if ($inputEL.hasClass("alphanumeric")) {
                    $inputEL.val(data.Values[0]);
                }
                $inputEL.focusout();

            },
            cache: false
        });
    }
}
function WriteDropList(d, $dropEl) {
    var eval = $dropEl.parent().parent().attr('eval');
    var isn = true;
    $dropEl.empty();

    $.each(d.Values, function (k, v) {
        $opt = $('<option>');
        $opt.attr('value', v[0]);
        if (v[0] == eval) {
            $opt.attr('selected', true);
            isn = false;
        }
        for (var i = 1; i < v.length; i++) {
            $opt.append(v[i]);
        }
        $dropEl.append($opt);
    });
    if (isn) {
        if ($dropEl.find("option:first").length > 0) {
            $dropEl.val($dropEl.find("option:first").val());

            var eval2 = $dropEl.find("option:selected").text();
            var val2 = $dropEl.val();
            $dropEl.parents("td").attr('etext', eval2).attr('eval', val2);
        }

    }

    /** Exlorer 9 Düzeltmesi START**/
    //$dropEl.width($dropEl.width());
    //$dropEl.width($dropEl.width("100%"));
    /** Exlorer 9 Düzeltmesi END**/

    $dropEl.focusout();
}

function VIEWCOL(a, b, c) {
    this.CT = a;
    this.CN = b;
    this.CV = c;
}

function SetSubSelectorPageNumberMetronic(PageCount, CurrPage) {

    $('.numbersarea').empty();
    var start = (Math.floor((CurrPage / 6) - 0.01) * 6) + 1;
    if (start > 1) {
        $('.numbersarea').append('<a class="numbers-more" href="javascript:;"> <span style="margin: 2px 2px 0 2px;height: 0px;">...</span> </a>');
    }
    for (var i = start; i <= PageCount; i++) {
        if (i == CurrPage) {
            $('.numbersarea').append('<a href="javascript:;" class="btn pagenum selectednum"><span>' + i + '</span></a>')
        }
        else {

            $('.numbersarea').append('<a href="javascript:;" data-page="' + i + '" class="btn pagenum"><span>' + i + '</span></a>')
        }
        maxnum = i;

        if ((i % 6) == 0) {
            break;
        }
    }
    if (maxnum < PageCount) {
        $('.numbersarea').append('<a class="numbers-more" href="javascript:;"> <span style="margin: 2px 2px 0 2px;height: 0px;">...</span> </a>');
    }
    $('.lastpage').attr('data-page', PageCount);
    $('.firstpage').attr('data-page', 1);
    if (CurrPage == 1) {
        $('.prevpage').removeClass('active');
        $('.firstpage').removeClass('active');

        $('.prevpage').addClass('disabled');
        $('.firstpage').addClass('disabled');
        $('.nextpage ').removeClass('disabled');
        $('.lastpage').removeClass('disabled');
        $('.prevpage').attr('data-page', 1);
    }
    else {
        $('.prevpage').addClass('active');
        $('.firstpage').addClass('active');
        $('.prevpage').removeClass('disabled');
        $('.firstpage').removeClass('disabled');
        $('.prevpage').attr('data-page', CurrPage - 1);
    }
    if (PageCount != CurrPage) {
        $('.nextpage').addClass('active');
        $('.lastpage').addClass('active');
        $('.nextpage').attr('data-page', CurrPage + 1);
        $('.nextpage ').removeClass('disabled');
        $('.lastpage').removeClass('disabled');
    }
    else {
        $('.nextpage').attr('data-page', CurrPage);
        $('.nextpage').removeClass('active');
        $('.lastpage').removeClass('active');
        $('.prevpage').removeClass('disabled');
        $('.firstpage').removeClass('disabled');
    }
    if (PageCount == CurrPage) {
        $('.nextpage ').addClass('disabled');
        $('.lastpage').addClass('disabled');
    }
    if (CurrPage == 1) {
        $('.prevpage ').addClass('disabled');
        $('.firstpage').addClass('disabled');
    }
    $(".pagenum ").each(function (i, item) {

        if ($(item).hasClass("selectednum")) {
            $(item).addClass("disabled");
        } else {
            $(item).removeClass("disabled");
        }

    })

}

function SetSelectorPageNumber(PageCount, CurrPage) {
    $('.numbersarea').empty();
    var start = (Math.floor((CurrPage / 6) - 0.01) * 6) + 1;
    if (start > 1) {
        $('.numbersarea').append('<a href="javascript:;"> <span style="float: left;margin: 2px 7px 0 7px;height: 0px;">...</span> </a>');
    }
    for (var i = start; i <= PageCount; i++) {
        if (i == CurrPage) {
            $('.numbersarea').append('<a href="javascript:;" class="btn pagenum selectednum btn-primary"><span>' + i + '</span></a>')
        }
        else {

            $('.numbersarea').append('<a href="javascript:;" data-page="' + i + '" class="btn pagenum btn-primary"><span>' + i + '</span></a>')
        }
        maxnum = i;

        if ((i % 6) == 0) {
            break;
        }
    }
    if (maxnum < PageCount) {
        $('.numbersarea').append('<a href="javascript:;"> <span style="float: left;margin: 2px 7px 0 7px;height: 0px;">...</span> </a>');
    }
    $('.lastpage').attr('data-page', PageCount);
    $('.firstpage').attr('data-page', 1);
    if (CurrPage == 1) {
        $('.prevpage').removeClass('active');
        $('.firstpage').removeClass('active');

        $('.prevpage').addClass('disabled');
        $('.firstpage').addClass('disabled');
        $('.nextpage ').removeClass('disabled');
        $('.lastpage').removeClass('disabled');
        $('.prevpage').attr('data-page', 1);
    }
    else {
        $('.prevpage').addClass('active');
        $('.firstpage').addClass('active');
        $('.prevpage').removeClass('disabled');
        $('.firstpage').removeClass('disabled');
        $('.prevpage').attr('data-page', CurrPage - 1);
    }
    if (PageCount != CurrPage) {
        $('.nextpage').addClass('active');
        $('.lastpage').addClass('active');
        $('.nextpage').attr('data-page', CurrPage + 1);
        $('.nextpage ').removeClass('disabled');
        $('.lastpage').removeClass('disabled');
    }
    else {
        $('.nextpage').attr('data-page', CurrPage);
        $('.nextpage').removeClass('active');
        $('.lastpage').removeClass('active');
        $('.prevpage').removeClass('disabled');
        $('.firstpage').removeClass('disabled');
    }
    if (PageCount == CurrPage) {
        $('.nextpage ').addClass('disabled');
        $('.lastpage').addClass('disabled');
    }
    if (CurrPage == 1) {
        $('.prevpage ').addClass('disabled');
        $('.firstpage').addClass('disabled');
    }
    $(".pagenum ").each(function (i, item) {

        if ($(item).hasClass("selectednum")) {
            $(item).addClass("disabled");
        } else {
            $(item).removeClass("disabled");
        }

    })

}

function GetCondition() {
    var cond = "";
    $(".thefilter input").each(function (i) {
        var cVal = $(this).val();
        if (cVal != "") {
            if (cond != "") {
                cond += ";";
            }
            cond += $(this).attr('data-coli') + "|" + cVal;
        }
    });
    return cond;
}

function GetSubConditionMetronic() {

    var cond = "";
    $("#pps-table-filter-sub input").each(function (i) {
        var cVal = $(this).val();
        if (cVal != "") {
            if (cond != "") {
                cond += ";";
            }
            cond += $(this).attr('data-coli') + "|" + cVal;
        }
    });
    return cond;
}

function WriteSelectorList(d, element, PageNum, IsNew, Condition) {

    var txtSearch = "";
    if (Condition) {
        var searchText = Condition.split('|');
        $.each(searchText, function (i, t) {
            if (i === 1)
                txtSearch = t;
        });
    }

    if (d.Values.length > 0) {
        if (IsNew) {
            element.html('<i class="flaticon-more-1"></i>');
            $('.popupselectbox-sub').attr('data-textcol', d.TextColumn);
            $('.tableheader table colgroup').empty();
            $('.tablebody table colgroup').empty();
            $('.tableheader table thead .theader').empty();
            $('.tableheader table thead .thefilter').empty();
            $.each(d.Columns, function (k, v) {


                $('.tableheader table colgroup, .tablebody table colgroup').append('<col style="width: ' + v.ColWidth + 'px"/>');
                $('.tableheader table thead .theader').append('<th>' + v.ColName + '</th>');
                if (k === 1) {

                    $('.tableheader table thead .thefilter').append('<th><input data-coli="' + k + '" type="text" value="' + txtSearch + '"/><a   class="popclear"  href="#" ><i class="icon-remove"></i></a></th>');
                } else {
                    $('.tableheader table thead .thefilter').append('<th><input data-coli="' + k + '" type="text"/></th>');
                }

            });
        }

        $('.tablebody table tbody').empty();
        $.each(d.Values, function (k, v) {
            $col = $('<tr>');
            $col.attr('itemval', v[0]);
            for (var i = 1; i < v.length; i++) {
                $col.append('<td>' + v[i] + '</td>');
            }
            $('.tablebody table tbody').append($col);
        });

        var recordCount = parseFloat(d.Total);
        var pageCount = Math.ceil(recordCount / SelectorListSize);
        $('.popupselectbox-sub').attr('data-pagecount', pageCount);
        SetSelectorPageNumber(pageCount, PageNum);
        if (IsNew) {
            $(".sub-popupselectbox-modal").modal('show');
        }
        $('.tablebody').scrollTop(0);
    }
    else {
        $('.tablebody table tbody').empty();
        $('.tablebody table tbody').html(resultNotFound);
        element.html('...');
    }
}

function WriteSelectorSubListMetronic(d, element, PageNum, IsNew, Condition) {

    $("#sub-ppsm-load-spinner").show();

    var txtSearch = "";
    $("#popup-select-modal-sub > div > div.modal-footer .tabnav").css("visibility", "visible")
    $('#ppssubEmptyRowsFilterNotFound').empty();

    if (Condition) {
        var searchText = Condition.split('|');
        $.each(searchText, function (i, t) {
            if (i === 1)
                txtSearch = t;
        });
    }

    if (d.Values.length > 0) {
        if (IsNew) {
            element.html('<i class="flaticon-more-1"></i>');
            $('.popupselectbox-sub').attr('data-textcol', d.TextColumn);
            $('#pps-table-col-grp-sub').empty();
            $('#pps-table-col-names-sub').empty();
            $('#pps-table-filter-sub').empty();

            $.each(d.Columns, function (k, v) {

                $('#pps-table-col-grp-sub').append('<col style="width: ' + v.ColWidth + 'px"/>');
                $('#pps-table-col-names-sub').append('<th>' + v.ColName + '</th>');

                if (k === 1) {
                    $('#pps-table-filter-sub').append('<td><div class="kt-input-icon kt-input-icon--right kt-subheader__search"><input class="form-control filterInputbg" data-coli="' + k + '" type="text" value="' + txtSearch + '"/><span class="kt-input-icon__icon kt-input-icon__icon--right"><span><i style="color:#22b9ff" class="flaticon2-search-1"></i></span></span></div></td>');
                } else {
                    $('#pps-table-filter-sub').append('<td><div class="kt-input-icon kt-input-icon--right kt-subheader__search"><input class="form-control filterInputbg" data-coli="' + k + '" type="text"/><span class="kt-input-icon__icon kt-input-icon__icon--right"><span><i style="color:#22b9ff" class="flaticon2-search-1"></i></span></span></div></td>');
                }

            });
        }

        $('#pps-table-data-sub').empty();
        $.each(d.Values, function (k, v) {
            $col = $('<tr>');
            $col.attr('itemval', v[0]);
            for (var i = 1; i < v.length; i++) {
                $col.append('<td class="tdItemval">' + v[i] + '</td>');
            }
            $('#pps-table-data-sub').append($col);
        });

        var recordCount = parseFloat(d.Total);
        $("#popup-select-modal-sub > div > div.modal-footer .total-count-pps-sub").html(EFlang.Total + " " + recordCount + " " + EFlang.RecordsOfListing)
        var pageCount = Math.ceil(recordCount / SelectorListSize);
        $('.popupselectbox-sub').attr('data-pagecount', pageCount);
        SetSubSelectorPageNumberMetronic(pageCount, PageNum);
        if (IsNew) {
            $(".sub-popupselectbox-modal").modal('show');
        }
        $('.tablebody').scrollTop(0);
        $("#pps-table-filter-sub td:first-child input").focus();
    }
    else {
        $('#pps-table-data-sub').empty();
        $('#ppssubEmptyRowsFilterNotFound').html('<div class="alert alert-default pps-alert-default" role="alert"><div class="alert-text">' + resultNotFound + '</div></div>');
        element.html('...');
        $("#popup-select-modal-sub > div > div.modal-footer .tabnav").css("visibility", "hidden")
        $("#popup-select-modal-sub > div > div.modal-footer .total-count-pps-sub").html("")
    }

    $("#sub-ppsm-load-spinner").show(1).delay(250).hide(1);

}

function htmlEntities(str) {
    return String(str).replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"');
}

function setPopupSelectListenersSub() {

    $(document).on('click', '#pps-table-data-sub tr', function () {

        $('#pps-table-data-sub tr').removeClass('selected');
        $(this).addClass('selected');
    });

    $(document).on('dblclick', '#pps-table-data-sub tr', function () {

        var textcol = $('.popupselectbox-sub').attr('data-textcol');
        var targetinput = $('.popupselectbox-sub').attr('data-targetinput');
        var textval = htmlEntities($(this).find('td:eq(' + textcol + ')').html());
        var hashval = $(this).attr('itemval');
        var subNameTargetInput = targetinput + '-sub';
        var hashval = $(this).attr('itemval');

        $("[data-subName=" + subNameTargetInput + "]").val(textval);
        $("[data-subName=" + subNameTargetInput + "]").attr('data-itemval', hashval);

        $("[data-subName=" + subNameTargetInput + "]").css("color", "#555");

        //popup select value dolu fakat text boş olduğunda validationa takılmaması için eklendi
        if (hashval != "") {
            $("[data-subName=" + subNameTargetInput + "]").attr("data-rule-required", "false");
            $("[data-subName=" + subNameTargetInput + "]").parent().parent().parent(".control-group").removeClass("error");
            $("[data-subName=" + subNameTargetInput + "]").addClass("valid");
            $("[data-subName=" + subNameTargetInput + "]").parent().next(".error").hide();
            if (textval == "") {
                $("[data-subName=" + subNameTargetInput + "]").val(".");
                $("[data-subName=" + subNameTargetInput + "]").css("color", "#fff");
            }
        }

        var DID = $('.popupselectbox-sub').attr('data-targetdid');
        if (DID == "") {
            $("[data-subName=" + subNameTargetInput + "]").parents("td").attr('etext', textval).attr('eval', hashval);
            SetLinkedEl($("[data-subName=" + subNameTargetInput + "]"));
        }

        $('.sub-popupselectbox-modal').modal('hide');
        validatePops();
    });

    $(document).on('click', '.selectpopitem', function () {

        if ($('#pps-table-data-sub tr.selected').length > 0) {
            $('#pps-table-data-sub tr.selected').trigger('dblclick');
        }
    });

    $(document).off('keydown', '#pps-table-filter-sub input').on('keydown', '#pps-table-filter-sub input', function (e) {

        if (e.keyCode == 13) {
            $('.popupselectbox-sub').attr('data-current', 0);
            $('.popupselectbox-sub .firstpage').trigger('click');
        }
    });

    $(document).off('click', '.popupselectbox-sub .pagenum, .popupselectbox-sub .navlink').
        on('click', '.popupselectbox-sub .pagenum, .popupselectbox-sub .navlink', function () {

            showLoading();
            var curPage = 0;
            var targetPage = 1;
            if ($(this).hasClass('clearfilters')) {
                $('.thefilter input').val('');
            }
            else {
                curPage = $('.popupselectbox-sub').attr('data-current');
                targetPage = parseInt($(this).attr('data-page'));
            }

            var pageCount = $('.popupselectbox-sub').attr('data-pagecount');
            if (curPage != targetPage) {
                var OrderedColumn = "";
                var OrderDir = "ASC";
                var Condition = GetSubConditionMetronic();
                var Con = $('.popupselectbox-sub').attr('con');
                var DID = $('.popupselectbox-sub').attr('data-targetdid');

                if (DID != "") {
                    GetSubSelectorValues(DID, OrderedColumn, OrderDir, Condition, targetPage, false, Con);
                }
                else {
                    var dataEl = $('.popupselectbox-sub').attr('data-targetinput');
                    //var DDQ = dataEl.parents('table').find('thead th[data-col = "' + dataEl.parents('td').attr('data-col') + '"]').attr('dataddq');

                    var gridInd = $('.popupselectbox-sub').attr("data-tableindex");


                    var cell = $(".grid[index=" + gridInd + "]").find("tbody[role=rowgroup] td[columnid=" + dataEl + "]");

                    var DDQ = cell.attr("dataddq");

                    var DID = $(".grid[index=" + gridInd + "]").attr('did');

                    var lns = new Array();
                    $parenttr = cell.parents("tr");
                    $($parenttr.children('td').each(function (i) {
                        if ($(this).attr('data-col') != null) {
                            var vc = new VIEWCOL($(this).attr('rtype'), $(this).attr('columnid'), $(this).attr('eval'));
                            lns[i] = vc;
                        }
                    }));

                    var rowIndex = $('.popupselectbox-sub').attr('data-target-rowindex');
                    var currentPage = $(".grid[index=" + gridInd + "]").data("kendoGrid").dataSource.page();
                    var currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
                    var columnField = $(this).parents("td").attr("columnid");

                    GetSubSelectorValuesCol(DDQ, lns, OrderedColumn, OrderDir, Condition, targetPage, false, gridInd, DID, currentRowIndex, columnField);
                }
            }
        });

    $('.modal-content.old').resizable({
        alsoResize: ".popupselectbox-sub",
        maxHeight: $('.modal-content').height()
    });
    $('.popupselectbox-sub.old').draggable();

    $('.popupselectbox-sub.old').on('show.bs.modal', function () {
        $(this).find('.modal-body').css({
            'max-height': '100%'
        });
    });
    $("#pps-table-root-sub .thefilter").dblclick(false);
}

function SetLinkedEl($dataEl) {
    $parenttd = $dataEl.parent().parent();
    $parenttr = $parenttd.parent();
    var datacol = $parenttd.attr('data-col');


    $($parenttr.children('td').each(function (i) {
        if ($(this).attr('data-links') !== undefined) {
            if ($(this).attr('data-links').indexOf(datacol) >= 0) {
                var etyp = $(this).attr("etype").toLowerCase();
                if (etyp == 'popupselect') {
                    //$(this).attr('eval', '');
                    //$(this).attr('etext', '');
                    $(this).find('input').val('');
                }
                else if (etyp == 'dropdown') {
                    SetDropDownValuesCol($(this).find('select'));
                }
                else if (etyp == 'numeric') {
                    SetOneValueElement($(this).find('input'));
                }
                else if (etyp == 'SetDropDownValuesCol') {
                    SetOneValueElement($(this).find('input'));
                }
                else if (etyp == 'date') {
                    SetOneValueElement($(this).find('input'));
                }
            }
        }
    }));
}

function SetTDEvent() {
    $('.gridcontainer').on('click', '.export-excel', function (e) {
        var gridname = $(this).data("gridname").toString();
        var formData = $("#subtaskform").serializeObject();
        $.ajax({
            url: "/Task/ExporttoExcel",
            type: "POST",
            data: { "FormData": formData, "GridName": gridname },
            success: function (d) {
                var data = jQuery.parseJSON(JSON.stringify(d));
                window.open(data.RedirectUrl);
            },
            cache: false
        });;
    });

    $('.gridcontainer').on('click', '.row-new', function (e) {
        var $ContainerEl = $(this).parents('.gridcontainer');
        var $rowTheme = $ContainerEl.find(".template").clone();
        $rowTheme.removeClass("template");
        $ContainerEl.find("table tbody").append($rowTheme);
        $ContainerEl.find(".row-edit:last").trigger("click");
        inputBindEvents();
    });


    $('.gridelement').on('click', '.row-edit', function (e) {
        $ContainerEl = $(this).parents('.gridcontainer');
        $ContainerEl.find(".row-save:visible").trigger("click");
        var $trEl = $(this).parents('tr');

        if ($trEl.find('input').length != 0) {
            var checkBoxEl = $trEl.find('.checkb');
            $(checkBoxEl).removeAttr("disabled");
            var opt = {
                checkboxClass: 'icheckbox_square-aero',
                increaseArea: "10%"
            }
            $(checkBoxEl).iCheck(opt);

        }

        //if ($trEl.find('input').length == 0) {

        SetColsInputs($trEl, 0, $trEl.find('td').length - 1);
        $trEl.find(".row-save").show();
        $trEl.find(".row-edit").hide();
        //}

        $trEl.find("input").eq(0).focus();
    });

    function SetColsInputs($el, colid, colCount) {
        $tdEl = $el.find("td:eq(" + colid + ")");
        if ($tdEl.find('input').length == 0) {
            $tdEl.html('');
            var datacol = $tdEl.attr("data-col");
            var etyp = $tdEl.attr("etype").toLowerCase();
            var formula = $tdEl.attr("formula");
            var readonly = $tdEl.attr("ro");
            var dataDID = $tdEl.attr("data-did");

            var uniqueElmID = dataDID + datacol + colid;

            if (readonly == "true") {
                $tdEl.append('<p height="28px">' + $tdEl.attr('etext') + '</p>');
            }
            else if (etyp == 'popupselect') {
                $tdEl.append('<p class="input-append" height="28px"><input type="text" data-itemval="" id="' + uniqueElmID + '" autocomplete="off" class="input-xlarge popupselecttext" readonly="readonly"><a class="popupcolselector-sub" type="button" data-targetinput="' + uniqueElmID + '" href="#"><i class="flaticon-more-1"></i></a></p>');
            }
            else if (etyp == 'checkbox') {
                $tdEl.append('<p height="28px"><span class="checkbox-holder"><input id="' + datacol + colid + '" type="checkbox" class="checkb" /></span></p>');
                var checkBoxEl = $tdEl.find('.checkb');

                var opt = {
                    checkboxClass: 'icheckbox_square-aero',
                    increaseArea: "10%"
                }
                $(checkBoxEl).iCheck(opt);
            }
            else if (etyp == 'dropdown') {
                $tdEl.append('<p height="28px"><select id="' + uniqueElmID + '"></select></p>');
            }
            else if (etyp == 'numeric') {
                if (formula != "") {
                    $tdEl.append('<p height="28px"><input id="' + datacol + colid + '" class="' + etyp + ' gridnum formulainput" readonly type="text" data-format="' + $tdEl.attr("data-format") + '" value=""/></p>');
                }
                else {
                    $tdEl.append('<p height="28px"><input id="' + datacol + colid + '" class="' + etyp + ' gridnum"' + (readonly == "true" ? ' readonly' : '') + ' type="text" data-format="' + $tdEl.attr("data-format") + '" value=""/></p>');
                }
            }
            else if (etyp == 'date') {
                $tdEl.append('<p height="28px"><input id="' + datacol + colid + '" class="griddate" type="text" data-format="' + $tdEl.attr("data-format") + '" value=""/></p>');
                if ($tdEl.attr("data-format") != "") {
                    $tdEl.find('input').datepicker({ dateFormat: $tdEl.attr("data-format") });
                } else {
                    $tdEl.find('input').datepicker({ dateFormat: DateFormatNorm });
                }
            }
            else {
                $tdEl.append('<p height="28px"><input id="' + datacol + colid + '" class="' + etyp + '" type="text" data-format="' + $tdEl.attr("data-format") + '" value=""/></p>');
            }
        }
        if (colid + 1 < colCount) {
            SetColsInputs($el, colid + 1, colCount);
        }
        else {
            SetColDefaultVals($el, 0, colCount)
        }

    }

    function SetColDefaultVals($el, colid, colCount) {
        $tdEl = $el.find("td:eq(" + colid + ")");

        var datacol = $tdEl.attr("data-col");
        var etyp = $tdEl.attr("etype").toLowerCase();
        var dataDID = $tdEl.attr("data-did");

        var uniqueElmID = dataDID + datacol + colid;

        if (etyp == 'popupselect') {
        }
        else if (etyp == 'dropdown') {
            SetDropDownValuesCol($('#' + uniqueElmID));
        }
        else if (etyp == 'numeric') {
            SetOneValueElement($('#' + datacol + colid));
        }
        else if (etyp == 'date') {
        }
        else {
            SetOneValueElement($('#' + datacol + colid));
        }

        $tdEl.find('input').val($tdEl.attr("etext"));

        if (colid + 1 < colCount) {
            SetColDefaultVals($el, colid + 1, colCount);
        }
    }

    $('.gridelement').on('click', '.row-save', function (e) {
        var $trEl = $(this).parents('tr');
        var $gridEL = $(this).parents('.gridelement');
        var ScActive = $gridEL.attr("data-scactive");
        if ($trEl.find('input').length >= 0) {
            var FormulaVals = new Array();
            $trEl.find('td').each(function (i) {
                if (!$(this).hasClass("grid-actions")) {
                    FormulaVals[i + 1] = Number($(this).attr('eval'));
                }
            });
            $trEl.find('td').each(function (i) {
                if (!$(this).hasClass("grid-actions")) {
                    var dataFormula = $(this).attr('formula');
                    if (dataFormula != "") {
                        var dataformat = $(this).find("input").attr('data-format');
                        if (dataformat == "" || dataformat == undefined) {
                            dataformat = "0.00000000"
                        }
                        var nmbr = eval(ConvertMeth(dataFormula));
                        $(this).find("input").val($.formatNumber(nmbr, { format: dataformat, locale: EFlang.localeCode }));
                        $(this).find("input").focusout();
                    }

                    if ($(this).find("input").hasClass("griddate")) {
                        var dateval = $(this).find("input").datepicker('getDate');
                        var datetext = $(this).find("input").val();
                        var datevalstr = "";
                        if (datetext != "") {
                            var datevalstr = moment(dateval).format('MM/DD/YYYY');
                        }
                        $(this).attr('etext', datetext).attr('eval', datevalstr);
                    }

                    var val = $(this).attr('etext');

                    //// if this td is check box put the true and false values as entered by the user
                    //if ($(this).find("input").hasClass("checkb")) {

                    //    var checkBoxEl = $(this).find('.checkb');

                    //    if ($(checkBoxEl).is(':checked')) {
                    //        $(checkBoxEl).parents("td").attr('etext', '<span class="checkbox-holder"><input class="checkb" type="checkbox" checked disabled/></span>').attr('eval', 'true');
                    //    }
                    //    else
                    //    {
                    //        $(checkBoxEl).parents("td").attr('etext', '<span class="checkbox-holder><input class="checkb" type="checkbox" disabled/></span>').attr('eval', 'false');
                    //    }
                    //}

                    //$(this).html('<p>' + val + '</p>');

                    //var opt = {
                    //    checkboxClass: 'icheckbox_square-aero',
                    //    increaseArea: "10%"
                    //}
                    //$(this).find('.checkb').iCheck(opt);

                    //// TEST ////
                    // if this td is check box put the true and false values as entered by the user
                    if ($(this).find("input").hasClass("checkb")) {

                        var checkBoxEl = $(this).find('.checkb');

                        if ($(checkBoxEl).is(':checked')) {
                            //$(checkBoxEl).parents("td").attr('etext', '<span class="checkbox-holder"><input class="checkb" type="checkbox" checked disabled/></span>').attr('eval', 'true');
                            $(checkBoxEl).parents("td").attr('eval', 'true');
                            val = '<span class="checkbox-holder"><input class="checkb" type="checkbox" checked disabled/></span>';
                        }
                        else {
                            //$(checkBoxEl).parents("td").attr('etext', '<span class="checkbox-holder><input class="checkb" type="checkbox" disabled/></span>').attr('eval', 'false');
                            $(checkBoxEl).parents("td").attr('eval', 'false');
                            val = '<span class="checkbox-holder><input class="checkb" type="checkbox" disabled/></span>';
                        }

                        $(this).find('.checkb').iCheck('disable');
                    }
                    else {
                        $(this).html('<p>' + val + '</p>');
                    }
                    //// TEST ////

                }
            });
        }
        if (ScActive == 'true') {
            SummaryCalculate($gridEL);
        }
        $trEl.find(".row-edit").show();
        $trEl.find(".row-save").hide();
    });

    function ConvertMeth(str) {
        var ReVal = "";
        var strVals = str.split("");
        $.each(strVals, function (index, value) {
            var rv = letterToNumbers(value);
            if (rv != 0) {
                ReVal += "FormulaVals[" + String(rv) + "]";
            }
            else {
                ReVal += String(value);
            }
        });

        return ReVal;
    }

    function letterToNumbers(string) {
        string = string.toUpperCase();
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', sum = 0, i;
        for (i = 0; i < string.length; i++) {
            sum += Math.pow(letters.length, i) * (letters.indexOf(string.substr(((i + 1) * -1), 1)) + 1);
        }
        return sum;
    }

    $('.gridelement').on('click', '.row-delete', function (e) {
        $(this).parents('tr').remove();
    });

    $('.gridelement').on('keydown', 'td input, td select', function (e) {
        // TAB KEY = 9, -> KEY = 39
        if (e.keyCode == 9 || e.keyCode == 39) {
            e.preventDefault();
            if ($(this).parents("td").next().length > 0) {
                $(this).parents("td").next().find("input").focus();
            }
        }
        if (e.keyCode == 13) {
            $(this).focusout();
            $(this).parents('tr').find(".row-save").click();
        }
    });

    $('.gridelement').on('focusout', 'td select', function (e) {
        var eval = $(this).find("option:selected").text();
        var val = $(this).val();
        $(this).parents("td").attr('etext', eval).attr('eval', val);
        SetLinkedEl($(this));
    });

    $('.gridelement').on('focusout', 'td input', function (e) {
        var eval = "";
        var val = $(this).val();
        if (!$(this).hasClass('popupselecttext')) {
            if (!$(this).hasClass('numeric') && !$(this).hasClass('griddate')) {
                eval = val;
                $(this).val(val);
                $(this).parents("td").attr('etext', val).attr('eval', eval);
                SetLinkedEl($(this));
            }

        }
    });

}

function SummaryCalculate($gridEL) {
    var ScCol = $gridEL.attr("data-sccol");
    var ScFunc = $gridEL.attr("data-scfunc");
    var FuncVals = new Array();
    $gridEL.find('tbody tr').each(function (i) {
        var $dataCol = $(this).find("td[data-col='" + ScCol + "']");
        if (!($(this).hasClass('template'))) {
            FuncVals[FuncVals.length] = $dataCol.attr('eval');
        }
    });

    var FuncReturn;
    if (ScFunc == "Sum") {
        FuncReturn = ArraySum(FuncVals)
    }
    else if (ScFunc == "Max") {
        FuncReturn = ArrayMax(FuncVals)
    }
    else if (ScFunc == "Min") {
        FuncReturn = ArrayMin(FuncVals)
    }
    else if (ScFunc == "Avg") {
        FuncReturn = ArrayAvg(FuncVals)
    }
    else if (ScFunc == "Count") {
        FuncReturn = Number(FuncVals.length);
    }

    $gridEL.find('.grid-calculation').html(FuncReturn).formatNumber({ format: '#.#######', locale: EFlang.localeCode });;
}

function ArraySum(values) {
    var answerValue = 0;
    for (i = 0; i < values.length; i++) {
        answerValue += Number(values[i]);
    }
    return answerValue;
}

function ArrayMax(values) {
    return Math.max.apply(Math, values);
};

function ArrayMin(values) {
    return Math.min.apply(Math, values);
};

function ArrayAvg(values) {
    return ArraySum(values) / values.length;
}

//popup select clear button
$(function () {

    $('#subtaskform .popupselecttext').hover(function (e) {
        if ($(this).val() != '' || $(this).attr("data-itemval") != '') {
            if (!convertToBool($(this).attr("rd")))
                $(this).next('.btnClear').css("visibility", "initial");
        }
        else {
            $(this).next('.btnClear').css("visibility", "hidden");
        }
    }, function () {
        $(this).next('.btnClear').css("visibility", "hidden");
    });

    $('.btnClear').hover(function () {
        if ($(this).prev('.popupselecttext').val() != '' || $(this).attr("data-itemval") != '') {
            $(this).css("visibility", "initial");
        }
    })
    $('.btnClear').click(function () {
        var isReq = $(this).prev('.popupselecttext').attr("isReq");
        $(this).prev('.popupselecttext').val('');
        $(this).prev('.popupselecttext').attr("data-itemval", "");
        $(this).prev('.popupselecttext').attr("data-rule-required", isReq);
        $(this).css("visibility", "hidden");
        var did = $(this).prev('.popupselecttext').attr("data-did");
        Populate(did, "", false);
    });

    validatePops();

    //incele ekranında inputları disable eder.
    var location = new RegExp('[\?&]Type=([^&#]*)').exec(window.location.href);
    var type = location === null ? "work" : location[1];
    if (showWork === false)
        type = "peek";
    if (type == "peek") {

        $("#subtaskform").find(":input").each(function (index, i) {
            $(this).attr("disabled", "disabled");


        });

    }



});

function validatePops() {
    $('.popupselecttext').each(function (item) {

        if ($(this).attr("data-itemval") != "") {
            $(this).attr("data-rule-required", "false");
        }
    });
}

function convertToBool(val) {
    return (val + '').toLowerCase() == 'true' ? true : false;
}

//cascade dropdown
$(function () {
    var _affectedDids = [];

    $(".select2-me.form-select-element").each(function (i, v) {
        var did = $(v).attr("data-did");
        var formData = IncludeReadOnlyValuesInserializationSub();
        _affectedDids.push({ did: did, Affected: AffectedDids(did, formData) });
    });

    $(document).on('dblclick', '#pps-table-data-sub tr', function () {

        var textcol = $('.popupselectbox-sub').attr('data-textcol');
        var textval = htmlEntities($(this).find('td:eq(' + textcol + ')').html());
        var hashval = $(this).attr('itemval');
        var DID = $('.popupselectbox-sub').attr('data-targetdid');
        var targetinput = $('.popupselectbox-sub').attr('data-targetinput');
        var formData = IncludeReadOnlyValuesInserializationSub();
        formData[targetinput] = hashval;
        Populate(DID, true, formData);
        var istrigger = $(this).attr("data-isTrigger");
        ExecuteInputFuncSub(DID, formData, true, false, istrigger);
    });
    $(".select2-me").on("change", function () {
        var did = $(this).attr("data-did");
        var value = $(this).val();
        var formData = IncludeReadOnlyValuesInserializationSub();
        Populate(did, false, formData);
        var istrigger = $(this).attr("data-isTrigger");
        ExecuteInputFuncSub(did, formData, false, true, istrigger);
    });

    $(".numeric").on("blur", function () {
        var did = $(this).attr("data-did");
        var istrigger = $(this).attr("data-isTrigger");
        var formData = IncludeReadOnlyValuesInserialization();
        ExecuteInputFuncSub(did, formData, false, true, istrigger);
    });
    $(".icheck-me").change(function () {
        var formData = IncludeReadOnlyValuesInserializationSub();
        var istrigger = "";
        var did = $(this).attr("data-did");
        if ($(this).attr("type") == "checkbox") {
            istrigger = $(this).attr("data-isTrigger");
        }
        else {
            istrigger = $(this).attr("data-isTrigger");
        }
        ExecuteInputFuncSub(did, formData, false, false, istrigger);

    });
    ExecuteInputsFuncSub();
});
function IncludeReadOnlyValuesInserializationSub() {
    var disabledArray = [];
    $("#subtaskform").find(':input').each(function () {
        if ($(this).attr('disabled')) {
            disabledArray.push($(this).attr("data-did"));
            if ($(this).attr("data-targetdid") !== undefined && $(this).attr("data-targetdid") != 'undefined') {
                disabledArray.push($(this).attr("data-targetdid"));
            }
            $(this).removeAttr('disabled');
        }
    });

    var formData = $("#subtaskform").serializeObject();
    if (disabledArray.length > 0) {
        for (var i = 0; i < disabledArray.length; i++) {

            $("input[data-did=" + disabledArray[i] + "]").attr("disabled", true);
            $("textarea[data-did=" + disabledArray[i] + "]").attr("disabled", true);
            $("select[data-did=" + disabledArray[i] + "]").attr("disabled", true);

        }
    }
    return formData;
}

function AffectedDids(DID, formData) {
    var dids = [];
    $.ajax({
        url: "/Task/GetAffectedDids",
        type: "POST",
        async: false,
        data: { "FormHash": $("#taskform [name='taskhash']").val(), "DID": DID, "taskform": formData },
        success: function (d) {
            dids = d;
        }
    });

    return dids;
}

function Populate(DID, isHash, formData) {


    $.ajax({
        url: "/Task/GetDataPopulate",
        type: "POST",
        data: { "FormHash": $("#subtaskform [name='taskhash']").val(), "DID": DID, "taskform": formData },
        success: function (d) {
            var data = jQuery.parseJSON(JSON.stringify(d));
            $.each(data, function (idx, dt) {
                if (DID != dt.DID) {
                    var obj = $("[data-did=" + dt.DID + "]");
                    var selected = $("[data-did=" + dt.DID + "]").val();
                    var RowCount = dt.Total;
                    if (obj.prop('nodeName') == 'SELECT') {
                        obj.empty();
                        obj.append($("<option />").val("").text(""));
                        $.each(dt.Values, function (index, i) {
                            if (selected == i[0])
                                obj.append($("<option value='" + selected + "' selected ='selected' >" + i[1] + "</option>"));
                            else
                                if (RowCount == 1) {
                                    obj.append($("<option selected ='selected' />").val(i[0]).text(i[1]));
                                }
                                else
                                    obj.append($("<option />").val(i[0]).text(i[1]));
                        });


                    } else {
                        obj.attr("Con", dt.Condition);

                    }
                }
            })
        },
        cache: false
    });
}

function ExecuteInputFuncSub(dId, formdata, isPopup, isSelect2, istrigger) {

    if (istrigger === undefined || istrigger == "") {
        istigger = true;
    }
    else {
        istrigger = istrigger.toLowerCase() == "true" ? true : false;
    }
    if (istrigger || isPopup) {
        $.ajax({
            url: "/Task/RunInputMethod",
            type: "POST",
            data: { "FormHash": $("#subtaskform [name='taskhash']").val(), "dId": dId, "taskform": formdata },
            success: function (d) {

                $.each(d, function (index, item) {
                    if (item.ShowExp !== -1) {
                        if ((item.ShowExp)) {
                            if (item.DataType == 8) {
                                $("#netoloji-grid-" + item.DID).parents(".control-group").removeClass("hide");
                                $("label[did=" + item.DID + "]").parent().removeClass("hide");
                                $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").show();
                                $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "block");
                                $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").removeClass("hide");
                                $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "block");

                            }
                            else {
                                $("[data-did=" + item.DID + "]").parents(".control-group").removeClass("hide");
                                $("label[did=" + item.DID + "]").parents("div.hide").removeClass("hide");
                                $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").show();
                                $("input[data-did=" + item.DID + "]").parents("span.hide").removeClass("hide");
                                $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "block");
                                $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "block");
                                $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").removeClass("hide");
                            }
                        }
                        else {
                            if (item.DataType == 8) {
                                $("#netoloji-grid-" + item.DID).parents(".control-group").addClass("hide");
                                $("label[did=" + item.DID + "]").parent().addClass("hide");
                                $("table[data-did=" + item.DID + "]").removeClass('igr');
                                $("table[data-did=" + item.DID + "]").removeAttr('req');
                                $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").hide();
                                $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "none");

                            }
                            else {

                                $("[data-did=" + item.DID + "]").parents(".control-group").addClass("hide");
                                $("label[did=" + item.DID + "]").parents("div[control-name]").addClass("hide");
                                $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").hide();
                                $("input[data-did=" + item.DID + "]").parents("span.hide").addClass("hide");
                                $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "none");
                                $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "none");
                                $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").addClass("hide");
                                if (item.ReqExp !== 1) {
                                    $("[data-did=" + item.DID + "]").closest(".form-control").removeData("ruleRequired");
                                    $("[data-did=" + item.DID + "]").parents("div[control-name]").find("input,select,textarea").attr("data-rule-required", false);
                                    var displayname = $("[data-did=" + item.DID + "]").attr("name");
                                    $("[data-did=" + item.DID + "]").parents(".custom-design").find("#ctrlName_data_" + displayname).removeClass("error");
                                    $("[data-did=" + item.DID + "]").closest(".control-group").removeClass("error");
                                }
                            }
                        }
                    }
                    if (item.DisableExp !== -1) {
                        if ((item.DisableExp)) {
                            if ($("[data-did=" + item.DID + "]").closest(".file-uploader").length > 0) {
                                $("[data-did=" + item.DID + "]").closest(".file-uploader").attr("rd", true);
                                $("[data-did=" + item.DID + "]").closest(".file-uploader").hide();
                            }
                            $("[data-did=" + item.DID + "]").parents(".control-group").find("input,select,textarea").attr("disabled", true);
                            $("[data-did=" + item.DID + "]").parents("div[control-name]").find("input,select,textarea").attr("disabled", true);
                            $("input[data-did=" + item.DID + "]").attr("readonly");
                            $("textarea[data-did=" + item.DID + "]").attr("readonly");

                            $("[data-did='" + item.DID + "']").attr("rd", "True");
                            $(".clear-" + item.DID).css({ visibility: "hidden" });
                            $(".ppsMore-" + item.DID).css("pointer-events", "none");
                            $(".ppsMore-" + item.DID).find("span").removeClass("sub-popupselector");

                            if (item.DataType === 8) {
                                $("label[did=" + item.DID + "]").parents("div[control-name]").find("table").find("input,select,textarea").attr("disabled", true);
                                $("label[did=" + item.DID + "]").parents("div[control-name]").find("table").find(".first-del-btn a, .last-del-btn a").css("pointer-events", "none");
                                $(".newLine-" + item.DID).find("a").addClass("hide");
                                $(".newLine-" + item.DID).parents(".grid-focus-border_" + item.DID).addClass("gridReadonlyBackgroud");
                                $(".noborder-left").css({ visibility: "hidden" });
                                $(".noborder-right").css({ visibility: "hidden" });
                            }
                        }
                        else {
                            if ($("[data-did=" + item.DID + "]").closest(".file-uploader").length > 0) {
                                $("[data-did=" + item.DID + "]").closest(".file-uploader").attr("rd", false);
                                $("[data-did=" + item.DID + "]").closest(".file-uploader").show();
                            }
                            $("[data-did=" + item.DID + "]").parents(".control-group").find("input,select,textarea").attr("disabled", false);
                            $("[data-did=" + item.DID + "]").parents("div[control-name]").find("input,select,textarea").attr("disabled", false);
                            $("input[data-did=" + item.DID + "]").removeAttr("readonly");
                            $("textarea[data-did=" + item.DID + "]").removeAttr("readonly");

                            $("[data-did='" + item.DID + "']").attr("rd", "False");

                            if ($("[data-did='" + item.DID + "']").val()) {
                                $(".clear-" + item.DID).css({ visibility: "unset" });
                            }
                            $(".ppsMore-" + item.DID).css("pointer-events", "auto");
                            if (!$(".ppsMore-" + item.DID).find("span").hasClass("sub-popupselector")) {
                                $(".ppsMore-" + item.DID).find("span").addClass("sub-popupselector");
                            }

                            if (item.DataType === 8) {
                                $("label[did=" + item.DID + "]").parents("div[control-name]").find("table").find("input,select,textarea").attr("disabled", false);
                                $("label[did=" + item.DID + "]").parents("div[control-name]").find("table").find(".first-del-btn a, .last-del-btn a").css("pointer-events", "auto");
                                $(".newLine-" + item.DID).find("a").removeClass("hide");
                                $(".newLine-" + item.DID).parents(".grid-focus-border_" + item.DID).removeClass("gridReadonlyBackgroud");
                                $(".noborder-left").css({ visibility: "unset" });
                                $(".noborder-right").css({ visibility: "unset" });
                            }
                        }
                    }
                    if (item.ReqExp !== -1) {
                        if ((item.ReqExp)) {
                            if (item.DataType === 8) {
                                if ($('#netoloji-grid-' + item.DID + ' tbody tr').length == 0) {
                                    $("table[data-did=" + item.DID + "]").addClass("invalid-table");
                                    $("table[data-did=" + item.DID + "]").addClass("ignr");
                                    $('#netoloji-grid-' + item.DID).parent().parent().parent(".control-group").addClass("error");
                                    $('#netoloji-grid-' + item.DID).parent().parents(".control-group").addClass("error");
                                    $('#netoloji-grid-' + item.DID).parents("div.gridLeftRightPadding").addClass("notvalid");
                                    var displayname = $("[data-did=" + item.DID + "]").attr("name");
                                    $("[data-did=" + item.DID + "]").parents(".custom-design").find("#ctrlName_data_" + displayname).addClass("error");
                                }
                            }
                            else {
                                if ($("[data-did=" + item.DID + "]").closest(".file-uploader").length > 0) {
                                    $("[data-did=" + item.DID + "]").closest(".file-uploader").attr("rq", true);
                                }

                                $("[data-did=" + item.DID + "]").parents(".control-group").find("input,select,textarea").attr("data-rule-required", true);
                                $("[data-did=" + item.DID + "]").parents("div[control-name]").find("input,select,textarea").attr("data-rule-required", true);
                                if ($("[data-did=" + item.DID + "]").val() == '') {
                                    $("[data-did=" + item.DID + "]").closest(".control-group").find("label").addClass("error");
                                }
                            }
                        }

                        else {
                            if (item.DataType === 8) {
                                $("table[data-did=" + item.DID + "]").removeClass("invalid-table");
                                $("table[data-did=" + item.DID + "]").removeClass('ignr');
                                $('#netoloji-grid-' + item.DID).parent().parent().parent(".control-group").removeClass("error");
                                $('#netoloji-grid-' + item.DID).parent().parents(".control-group").removeClass("error");
                                $('#netoloji-grid-' + item.DID).parents("div.gridLeftRightPadding").removeClass("notvalid");
                                var displayname = $("[data-did=" + item.DID + "]").attr("name");
                                $("[data-did=" + item.DID + "]").parents(".custom-design").find("#ctrlName_data_" + displayname).removeClass("error");
                            }

                            else {
                                if ($("[data-did=" + item.DID + "]").closest(".file-uploader").length > 0) {
                                    $("[data-did=" + item.DID + "]").closest(".file-uploader").attr("rq", false);
                                    $("[data-did=" + item.DID + "]").closest(".file-uploader").removeData("ruleRequired");
                                    $("[data-did=" + item.DID + "]").closest(".control-group").find("span.error").remove();
                                    $("[data-did=" + item.DID + "]").closest("div.controls").find("span.error").remove();

                                }
                                else {
                                    $("[data-did=" + item.DID + "]").closest(".form-control").removeData("ruleRequired");
                                }
                                $("[data-did=" + item.DID + "]").parents(".control-group").find("input,select,textarea").attr("data-rule-required", false);
                                $("[data-did=" + item.DID + "]").parents(".controls span").find("input,select,textarea").attr("data-rule-required", false);
                                $("[data-did=" + item.DID + "]").parents("div[control-name]").find("input,select,textarea").attr("data-rule-required", false);
                                $("[data-did=" + item.DID + "]").parents(".control-group").find('.help-inline').remove();
                                $("[data-did=" + item.DID + "]").parents(".custom-design").find('.help-inline').remove();
                                $("[data-did=" + item.DID + "]").closest(".control-group").find("label").removeClass("error");
                                var displayname = $("[data-did=" + item.DID + "]").attr("name");
                                $("[data-did=" + item.DID + "]").parents(".custom-design").find("#ctrlName_data_" + displayname).removeClass("error");
                                $("[data-did=" + item.DID + "]").closest(".control-group").removeClass("error");
                            }

                        }
                    }
                });
            },
            cache: false
        });
    }
}

function ExecuteInputsFuncSub() {

    $.ajax({
        url: "/Task/RunInputMethods",
        type: "POST",
        data: { "FormHash": $("#subtaskform [name='taskhash']").val() },
        success: function (d) {

            $.each(d, function (index, item) {

                if (item.ShowExp !== -1) {
                    if ((item.ShowExp)) {
                        if (item.DataType == 8) {
                            $("#netoloji-grid-" + item.DID).parents(".control-group").removeClass("hide");
                            $("label[did=" + item.DID + "]").parent().removeClass("hide");
                            $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").show();
                            $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "block");
                            $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "block");
                            $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").removeClass("hide");
                        }
                        else {
                            $("[data-did=" + item.DID + "]").parents(".control-group").removeClass("hide");
                            $("label[did=" + item.DID + "]").parents("div.hide").removeClass("hide");
                            $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").show();
                            $("input[data-did=" + item.DID + "]").parents("span.hide").removeClass("hide");
                            $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "block");
                            $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "block");
                            $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").removeClass("hide");

                        }
                    }
                    else {
                        if (item.DataType == 8) {
                            $("#netoloji-grid-" + item.DID).parents(".control-group").addClass("hide");
                            $("label[did=" + item.DID + "]").parent().addClass("hide");
                            $("table[data-did=" + item.DID + "]").removeClass('igr');
                            $("table[data-did=" + item.DID + "]").removeAttr('req');
                            $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "none");
                            $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").hide();
                            $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "none");
                            $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").addClass("hide");

                        }
                        else {
                            $("[data-did=" + item.DID + "]").parents(".control-group").addClass("hide");
                            $("label[did=" + item.DID + "]").parents("div[control-name]").addClass("hide");
                            $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "none");
                            $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").hide();
                            $("input[data-did=" + item.DID + "]").parents("span.hide").addClass("hide");
                            $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "none");
                            $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").addClass("hide");

                            if (item.ReqExp !== 1) {
                                $("[data-did=" + item.DID + "]").closest(".form-control").removeData("ruleRequired");
                                $("[data-did=" + item.DID + "]").parents("div[control-name]").find("input,select,textarea").attr("data-rule-required", false);
                                var displayname = $("[data-did=" + item.DID + "]").attr("name");
                                $("[data-did=" + item.DID + "]").parents(".custom-design").find("#ctrlName_data_" + displayname).removeClass("error");
                                $("[data-did=" + item.DID + "]").closest(".control-group").removeClass("error");
                            }
                        }
                    }
                }
                if (item.DisableExp !== -1) {

                    if ((item.DisableExp)) {
                        if ($("[data-did=" + item.DID + "]").closest(".file-uploader").length > 0) {
                            $("[data-did=" + item.DID + "]").closest(".file-uploader").attr("rd", true);
                            $("[data-did=" + item.DID + "]").closest(".file-uploader").hide();
                        }
                        $("[data-did=" + item.DID + "]").parents(".control-group").find("input,select,textarea").attr("disabled", true);
                        $("[data-did=" + item.DID + "]").parents("div[control-name]").find("input,select,textarea").attr("disabled", true);

                        $("input[data-did=" + item.DID + "]").attr("readonly");
                        $("textarea[data-did=" + item.DID + "]").attr("readonly");

                        $("[data-did='" + item.DID + "']").attr("rd", "True");
                        $(".clear-" + item.DID).css({ visibility: "hidden" });
                        $(".ppsMore-" + item.DID).css("pointer-events", "none");
                        $(".ppsMore-" + item.DID).find("span").removeClass("sub-popupselector");

                        if (item.DataType === 8) {
                            $(".newLine-" + item.DID).find("a").addClass("hide");
                            $(".newLine-" + item.DID).parents(".grid-focus-border_" + item.DID).addClass("gridReadonlyBackgroud");
                        }
                    } else {
                        if ($("[data-did=" + item.DID + "]").closest(".file-uploader").length > 0) {
                            $("[data-did=" + item.DID + "]").closest(".file-uploader").attr("rd", false);
                            $("[data-did=" + item.DID + "]").closest(".file-uploader").show();
                        }
                        $("[data-did=" + item.DID + "]").parents(".control-group").find("input,select,textarea").attr("disabled", false);
                        $("[data-did=" + item.DID + "]").parents("div[control-name]").find("input,select,textarea").attr("disabled", false);
                        $("input[data-did=" + item.DID + "]").removeAttr("readonly");
                        $("textarea[data-did=" + item.DID + "]").removeAttr("readonly");

                        $("[data-did='" + item.DID + "']").attr("rd", "False");

                        if ($("[data-did='" + item.DID + "']").val()) {
                            $(".clear-" + item.DID).css({ visibility: "unset" });
                        }
                        $(".ppsMore-" + item.DID).css("pointer-events", "auto");
                        if (!$(".ppsMore-" + item.DID).find("span").hasClass("sub-popupselector")) {
                            $(".ppsMore-" + item.DID).find("span").addClass("sub-popupselector");
                        }

                        if (item.DataType === 8) {
                            $(".newLine-" + item.DID).find("a").removeClass("hide");
                            $(".newLine-" + item.DID).parents(".grid-focus-border_" + item.DID).removeClass("gridReadonlyBackgroud");
                        }
                    }
                }
                if (item.ReqExp !== -1) {
                    if ((item.ReqExp)) {

                        if (item.DataType === 8) {
                            if ($('#netoloji-grid-' + item.DID + ' tbody tr').length == 0) {
                                $("netoloji-grid-" + item.DID + "]").addClass("invalid-table");

                                $('#netoloji-grid-' + item.DID).parent().parent().parent(".control-group").addClass("error");
                                $('#netoloji-grid-' + item.DID).parent().parents(".control-group").addClass("error");
                                $('#netoloji-grid-' + item.DID).parents("div.gridLeftRightPadding").addClass("notvalid");
                                var displayname = $("[data-did=" + item.DID + "]").attr("name");
                                $("[data-did=" + item.DID + "]").parents(".custom-design").find("#ctrlName_data_" + displayname).addClass("error");
                            }
                        }
                        else {
                            if ($("[data-did=" + item.DID + "]").closest(".file-uploader").length > 0) {
                                $("[data-did=" + item.DID + "]").closest(".file-uploader").attr("rq", true);
                            }

                            $("[data-did=" + item.DID + "]").parents(".control-group").find("input,select,textarea").attr("data-rule-required", true);
                            $("[data-did=" + item.DID + "]").parents("div[control-name]").find("input,select,textarea").attr("data-rule-required", true);
                            if ($("[data-did=" + item.DID + "]").val() == '') {
                                $("[data-did=" + item.DID + "]").closest(".control-group").find("label").addClass("error");
                                var displayname = $("[data-did=" + item.DID + "]").attr("name");
                                if (!($("div#data_" + displayname).find(".controls .document-showcase").length > 0)) {
                                    $("[data-did=" + item.DID + "]").parents(".custom-design").find("#ctrlName_data_" + displayname).addClass("error");
                                    $("[data-did=" + item.DID + "]").closest(".control-group").addClass("error");
                                }
                            }
                        }
                    }
                    else {

                        if (item.DataType === 8) {
                            $("table[data-did=" + item.DID + "]").removeClass("invalid-table");
                            $("table[data-did=" + item.DID + "]").removeClass('igr');
                            $('#netoloji-grid-' + item.DID).parent().parent().parent(".control-group").removeClass("error");
                            $('#netoloji-grid-' + item.DID).parent().parents(".control-group").removeClass("error");
                            $('#netoloji-grid-' + item.DID).parents("div.gridLeftRightPadding").removeClass("notvalid");
                            var displayname = $("[data-did=" + item.DID + "]").attr("name");
                            $("[data-did=" + item.DID + "]").parents(".custom-design").find("#ctrlName_data_" + displayname).removeClass("error");
                        }
                        else {
                            if ($("[data-did=" + item.DID + "]").closest(".file-uploader").length > 0) {
                                $("[data-did=" + item.DID + "]").closest(".file-uploader").attr("rq", false);
                                $("[data-did=" + item.DID + "]").closest(".file-uploader").removeData("ruleRequired");
                                $("[data-did=" + item.DID + "]").closest(".control-group").find("span.error").remove();
                                $("[data-did=" + item.DID + "]").closest("div.controls").find("span.error").remove();
                            }

                            $("[data-did=" + item.DID + "]").parents(".control-group").find("input,select,textarea").attr("data-rule-required", false);
                            $("[data-did=" + item.DID + "]").parents(".controls span").find("input,select,textarea").attr("data-rule-required", false);
                            $("[data-did=" + item.DID + "]").parents("div[control-name]").find("input,select,textarea").attr("data-rule-required", false);
                            $("[data-did=" + item.DID + "]").parents(".control-group").find('.help-inline').remove();
                            $("[data-did=" + item.DID + "]").closest(".form-control").removeData("ruleRequired");
                            $("[data-did=" + item.DID + "]").parents(".custom-design").find('.help-inline').remove();
                            $("[data-did=" + item.DID + "]").closest(".control-group").find("label").removeClass("error");
                            var displayname = $("[data-did=" + item.DID + "]").attr("name");
                            $("[data-did=" + item.DID + "]").parents(".custom-design").find("#ctrlName_data_" + displayname).removeClass("error");
                            $("[data-did=" + item.DID + "]").closest(".control-group").removeClass("error");

                        }
                    }
                }
            });
        },
        cache: false
    });

}

//Page url
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}
//reassignTask

$(function () {

    $(".reassignTask").click(function () {


        $buttonEl = $(this);
        $buttonEl.attr('disabled', true);
        var reId = $("select[name=Reassignment]").val();
        var taskhash = $("input[name=taskhash]").val();
        var page = getUrlParameter('TaskPage');
        $buttonEl.attr("oldText", $buttonEl.html());
        $buttonEl.html('<span class="icon-refresh icon-spin"></span> ' + EFlang.PleaseWait);
        if (reId) {
            $.ajax({
                url: "/Task/ReassignTask",
                type: "POST",
                data: { "Reassignment": reId, "taskhash": taskhash, "pageNum": page },
                success: function (d) {

                    window.location.href = d;
                },
                error: function () {
                    $buttonEl.html($buttonEl.attr("oldText"));
                }
            });
        } else {
            $buttonEl.html($buttonEl.attr("oldText"));
            $buttonEl.attr('disabled', false);
        }


    });

    $(".AssignBackTo").click(function () {
        $buttonEl = $(this);
        $buttonEl.attr('disabled', true);
        var taskhash = $("input[name=taskhash]").val();
        var page = getUrlParameter('TaskPage');
        $buttonEl.attr("oldText", $buttonEl.html());
        $buttonEl.html('<span class="icon-refresh icon-spin"></span> ' + EFlang.PleaseWait);
        $.ajax({
            url: "/Task/AssignBackTo",
            type: "POST",
            data: { "taskhash": taskhash, "pageNum": page },
            success: function (d) {
                window.location.href = d;
            },
            error: function () {
                $buttonEl.html($buttonEl.attr("oldText"));
                $buttonEl.attr('disabled', false);
            }
        });

    });


});

function validateDate() {
    var retval = true;
    errorList = "";
    $('.form-validate input').each(function () {

        var item = $(this);
        if (item.hasClass("datetime")) {
            if (item.val() != "") {
                var date = kendo.parseDate(item.val());
                if (date) {


                } else {


                    item.parent().parent().parent(".control-group").addClass("error");
                    item.parent().parents(".control-group").addClass("error");
                    retval = false;

                }
            }
        }
    });

    return retval;
}


function showLoading() {

    run_waitMe($('.popupselectbox-sub'), 1, 'bounce');

}
function hideLoading() {
    $('.popupselectbox-sub').waitMe('hide');
}
function run_waitMe(el, num, effect) {
    text = '';
    fontSize = '';
    maxSize = '';
    textPos = 'vertical';

    el.waitMe({
        effect: effect,
        text: text,
        bg: 'rgba(255,255,255,0.7)',
        color: '#000',
        maxSize: maxSize,
        source: 'img.svg',
        textPos: textPos,
        fontSize: fontSize,
        onClose: function () { }
    });
}


//Drag and drop File upload to LIT
$(function () {

    $('.dropArea').filedrop({
        url: '/LineItemTable/UploadFiles',

        allowedfileextensions: ['.xls', '.xlsx'],
        paramname: 'files',
        data: {

            DID: function () {
                return $(this).attr("did");
            },
            Ciid: CIID
        },
        error: function (err, file) {
            toastr.error(fileTypeError)
            $("#wait").css("display", "none");
        },
        maxfiles: 1,
        maxfilesize: 5, // in MB

        dragOver: function (e) {

            $(this).addClass('active-drop');

            did = $(this).attr("did");
        },
        dragLeave: function (e) {

            $(this).removeClass('active-drop');
            did = $(this).attr("did");
        },
        drop: function (e) {

            $(this).removeClass('active-drop');
            did = $(this).attr("did");
            $("#wait").css("display", "block");
        },
        afterAll: function (e) {
            $("#wait").css("display", "none");
        },
        uploadFinished: function (i, file, response, time) {

            var grid = $("[data-did=" + did + "]");

            $.fn.initGridSingle(grid, response);
            $("#wait").css("display", "none");
            $(".qq-upload-drop-area").css("display", "none");
        },

    })

})

//action button click event
function TaskActionClickSub(id) {
    var button = $('#BTN' + id);
    button.click();
}

function PrintDocument(doc) {
    var url = "/Task/PrintDocument?DOC=" + doc;
    var newTab = window.open(url, '_blank');
    newTab.print();
}

function NumericInput(evt) {
    var culture = "@langMinString";
    var decimalSepCode = getDecimalSeparator(culture).charCodeAt(0);
    var groupSepCode = getNumberGroupSeparator(culture).charCodeAt(0);
    var charCode = (evt.which) ? evt.which : event.keyCode;
    var decimalsep = String.fromCharCode(decimalSepCode);
    var _value = $(evt.currentTarget).val();
    if (_value.toString().indexOf(String.fromCharCode(45)) > -1 && charCode == 45) return false;
    if ((charCode != decimalSepCode && charCode == groupSepCode) || (charCode == decimalSepCode && _value.indexOf(decimalsep) > -1)) {
        return false;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode > 46 || charCode < 44)) {
        return false;
    } else {
        return true;
    }
}