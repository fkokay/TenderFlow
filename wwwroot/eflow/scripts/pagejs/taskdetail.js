/*<reference path="../jquery-1.7.2-vsdoc.js" />*/

var fileNum = 0;
var TablePane;
var TableScrollApi;
var dataUid;
var jsonObj = [];
var latitude;
var longitude;
var ocrDocumentDidList = [];
$(window).load(function () {
    //Görev formu action button validasyon gösterimi
    //var urlParams = new URLSearchParams(window.location.search);
    var buttonId = $.urlParam('ButtonId');
    if (buttonId)
        TaskActionClick(buttonId);
})
$(window).ready(function () {
    SetElements();
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
function GetLitDropdownData(obj) {
    var type = $(obj).attr("type");
    if (type == "Dropdown") {
        var formData = new FormData();
        var did = $(obj).closest("table").data("did");
        var columnId = $(obj).data("column");
        var ciid = $(obj).closest("table").data("ciid");
        var rownumber = $(obj).closest("tr").attr("row-number");
        var selectedvalues = localStorage["selectedValues-" + did + "-" + rownumber];
        formData.append("gridId", did);
        formData.append("ciid", ciid);
        formData.append("column", columnId);
        formData.append("rownumber", rownumber);
        formData.append("selectedvalues", JSON.stringify(selectedvalues));
        formData.append("Info", $("#tempInfo-" + did).html());
        return $.ajax({
            type: "POST",
            url: '/NewLineItemTable/GetLitDropdownData',
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            async: false,
            success: function (response) {
                return response;
            }
        });
    }
}

function RemoveStorageContainsName(sname) {
    var storageNames = Object.keys(localStorage);
    for (var i = 0; i < storageNames.length; i++) {
        if (storageNames[i].indexOf(sname) >= 0) {
            localStorage.removeItem(storageNames[i]);
        }
    }
}

$(document).ready(function () {

    jQuery.validator.addMethod("defaultStr", function (value, element) {
        var defaultStr = element.attributes.defaultStr.value;
        var required = element.attributes["data-rule-required"].value;
        var message = "Please enter a value other than zero.";
        var result = true;

        if (defaultStr === '0' && Number(value) === 0 && required === "true") {
            if (EFlang.localeCode === "en") {
                $.validator.messages.defaultStr = message;
            }
            result = false;
        }

        if (defaultStr === '0' && value === '' && required === "true") {
            if (EFlang.localeCode === "en") {
                $.validator.messages.defaultStr = message;
            }
            result = false;
        }

        return result;
    });

    $.validator.addMethod("date-compare", function (value, element, param) {

        try {

            //Zorunluluk girilmemiş ise ve input boş ise kontrol etme.
            var required = element.attributes["data-rule-required"].value;
            if (required == "false" && value == "") {
                result = true;
            }

            //Gantt ve Timeline değil ise kontrol etme.
            if (param == "false") return true;

            //Bitiş Tarihi input'u üzerinden validasyon yap.
            var hasEndData = element.attributes["has-end-date"].value;

            if (param == "true" && hasEndData == "true") {

                var startInput = $('input[type="text"][has-start-date="true"]:first');
                var endInput = $(element);

                var startDateStr = startInput.val();
                var startFormat = startInput.attr('data-format').toUpperCase().replace("II", "mm");

                var endDateStr = endInput.val();
                var endFormat = endInput.attr('data-format').toUpperCase().replace("II", "mm");

                var startDate = moment(startDateStr, startFormat);
                var endDate = moment(endDateStr, endFormat);

                if (!startDate.isValid() || !endDate.isValid()) {
                    //console.log("Geçersiz tarih formatı.");
                    result = true;
                }
                else {

                    if (startDate >= endDate) {
                        result = false;
                    } else {

                        //Bitiş tarihi, başlangıç tarihinden önceki bir tarih.
                        result = true;
                    }
                }
            }
            else {
                result = true;
            }
        } catch (e) {
            result = true;
        }
        return result;

    }, EFlang.dateCompare);

    //Data-rule-min
    $.validator.methods.min = function (value, element, param) {
        var normalizedValue = value.replace(',', '.');
        return this.optional(element) || !isNaN(normalizedValue) && parseFloat(normalizedValue) >= param;
    };

    //Data-rule-max
    $.validator.methods.max = function (value, element, param) {
        var normalizedValue = value.replace(',', '.');
        return this.optional(element) || !isNaN(normalizedValue) && parseFloat(normalizedValue) <= param;
    };

    jQuery.validator.addMethod("maxval", function (value, element) {
        var maxValue = element.attributes.maxval.value;
        var required = element.attributes["data-rule-required"].value;
        var result;
        value = value.replace("$", "").replace("TL", "").replace("€", "");
        var valueResult = value.split(",");
        maxvalueNumber = parseInt(maxValue);
        valueResultNumber = parseInt(valueResult[0])
        if (maxvalueNumber >= valueResultNumber) {
            result = true;
        } else {
            result = false;
        }
        if (required == "false" && value == "") {
            result = true;
        }
        return result;
    });
    jQuery.validator.addMethod("minval", function (value, element) {
        var minValue = element.attributes.minval.value;
        var required = element.attributes["data-rule-required"].value;
        var result;
        value = value.replace("$", "").replace("TL", "").replace("€", "");
        var valueResult = value.split(",");
        minvalueNumber = parseInt(minValue);
        valueResultNumber = parseInt(valueResult[0])
        if (minvalueNumber <= valueResultNumber) {
            result = true;
        } else {
            result = false;
        }
        if (required == "false" && value == "") {
            result = true;
        }
        return result;
    });
    if (isGeoLocationEnabled && isFormEditable) {
        getGeoLocation();
    }

    //SetElements();
    SetUploaders();
    SetButtons();
    RemoveStorageContainsName("litdropdata");
    RemoveStorageContainsName("sub-litdropdata");
    RemoveStorageContainsName("selectedValues");

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

    $('.popupselectbox-modal').on('shown.bs.modal', function (e) {

        setPopupSelectListeners();
    });

    $('.popupselectbox-modal').on('shown.bs.hidden', function (e) {
        _container = undefined;
    });

    $('select.form-select-element').on("change", function () {
        var name = $(this).attr('name');
        var selectedText = $(this).find("option:selected").text();
        var targetInput = $("input[name='" + name + "_Text']");
        $(targetInput).val($.trim(selectedText));
    });
    $('[data-toggle="tooltip"]').tooltip();
    if (window.location.href.toLowerCase().indexOf("dashboardpanel") == -1) { $(".alert").hide(); }

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
        $(this).parents().find('.popupselectbox').attr('data-current', 0);
        $(this).parents().find('.popupselectbox .firstpage').trigger('click');

    });

    $("html").on("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).parents("div.gridLeftRightPadding").addClass("onprocess");
    });

    $("html").on("drop", function (e) { e.preventDefault(); e.stopPropagation(); });

    $('.drop-area').on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).parents("div.gridLeftRightPadding").addClass("onprocess");
    });

    $('.drop-area').on('dragleave', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).parents("div.gridLeftRightPadding").removeClass("onprocess");
    });

    $('.drop-area').on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

    $('.drop-area').on('drop', function (e) {
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
                    data: { "FormHash": $("#taskform [name='taskhash']").val(), "DID": did, "Val": valStr, "startDateStr": startDate, "endDateStr": endDate },
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
                    data: { "FormHash": $("#taskform [name='taskhash']").val(), "DID": did, "Val": valStr, "startDateStr": startDate, "endDateStr": endDate },
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
    $(".newTableContainer").on("click", "tbody td", function (e) {
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
                $(".newTableContainer").find("tbody select").select2("close");
                var selectedvalue = $(this).find("select option:selected").val();
                var did = $(this).closest("table").data("did");
                var columnId = $(this).data("column");
                var ciid = $(this).closest("table").data("ciid");
                var storagekey = "litdropdata-" + columnId + "-" + ciid + "-" + did + "-";
                var isfilled = $(this).find("select").data("isfilled");
                var result;
                if (!isfilled) {
                    if (localStorage.getItem(storagekey) === null || localStorage.getItem(storagekey) === 'undefined' || JSON.parse(localStorage[storagekey]) === null || JSON.parse(localStorage[storagekey]).length == 0) {
                        var _result = GetLitDropdownData(this);
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
    var taskForm = this;
    $.each(a, function () {
        var thisval = "";
        if ($(taskForm).find("input[name='" + this.name + "']").hasClass('datetime')) {
            if ($(taskForm).find("input[name='" + this.name + "']").val() != "") {

                var $Input = $(taskForm).find("input[name='" + this.name + "']");
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
        else if ($(taskForm).find("input[name='" + this.name + "']").hasClass("numeric")) {
            //thisval = $("input[name='" + this.name + "']").attr("data-val");
            thisval = $(taskForm).find("input[name='" + this.name + "']").val();
        }
        else if ($(taskForm).find("input[name='" + this.name + "']").hasClass("popupselecttext")) {
            thisval = $(taskForm).find("input[name='" + this.name + "']").attr("data-itemval") + "[and]" + $(taskForm).find("input[name='" + this.name + "']").val();

        }
        else if ($(taskForm).find("textarea[name='" + this.name + "']").attr("type") == "memo") {
            thisval = $('<div/>').text($(taskForm).find("textarea[name='" + this.name + "']").val()).html();
        }
        else if ($(taskForm).find("input[name='" + this.name + "']").attr("type") == "checkbox" || $(taskForm).find("input[name='" + this.name + "']").attr("type") == "radio") {
            thisval = this.value;
        }
        else {
            thisval = $(taskForm).find("input[name='" + this.name + "'],select[name='" + this.name + "'],textarea[name='" + this.name + "']").val();
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
    $('#' + $(taskForm).attr('id') + ' .file-uploader').each(function () {
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

    $('#' + $(taskForm).attr('id') + ' .gridelement').each(function () {
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

function setRequiredTabColor() {
    //Tab altında zorunlu alan var ise tab adı kırmızı olsun
    try {
        let k = [...document.querySelectorAll(".tabitemwrp")].map(item => item.id);
        //console.log(k)
        for (var i = 0; i < k.length; i++) {

            var tabName = k[i].substring(3);

            var reqCount = 0;

            $("#tb_" + tabName + ' .help-inline').each(function (i, obj) {
                if ($(this).attr("style") != "display: none;") {
                    reqCount = reqCount + 1;
                }
            });
            $("#tb_" + tabName + ' .qq-uploader .error').each(function (i, obj) {
                reqCount = reqCount + 1;
            });
            $("#tb_" + tabName + ' .grid-focus-border.notvalid').each(function (i, obj) {
                reqCount = reqCount + 1;
            });

            //console.log(tabName +"_"+ reqCount);

            if (reqCount > 0) {
                $("#" + tabName).css("color", "#dc3545");
            }
            else {
                $("#" + tabName).css("color", "");
            }
        }
    } catch (e) { }
}

function SetButtons() {
    $('.TaskAction').bind("click", function (e) {
        var buttonvalidations = [];
        $('.TaskAction').attr('disabled', true);
        e.preventDefault();
        $buttonEl = $(this);
        $buttonEl.attr("oldText", $buttonEl.html());
        var button_val = $buttonEl.val();
        if (button_val != "SaveChangesList") {
            $buttonEl.html('<span class="icon-refresh icon-spin"></span> ' + EFlang.PleaseWait);
        }

        var formData = IncludeReadOnlyValuesInserialization();

        formData[$(this).attr("name")] = $(this).attr("value");

        if ($(this).attr('id') == "SaveChanges") {

            SendFormData(formData, 5);

            try {
                var dttable = $('#kt_table_1').dataTable();
                dttable.api().ajax.reload();

                //Formu kaydettikten sonra salt okunur lit'in kolonlarını disabled hale getirir.
                $('[id^="checkTableReadOnly-"]').filter(function () {
                    return $(this).html() === "True";
                }).each(function () {
                    var id = $(this).attr('id');
                    var did = id.match(/\d+$/)[0];
                    $(this).siblings().find('[id^="netoloji-grid-' + did + '"]').find('tbody input,tbody select,tbody textarea').prop('disabled', true);
                });
            } catch (e) {

            }
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
                window.isRefreshed = false;
                var buttonId = $buttonEl.attr("id").replace("BTN", "");
                //var TIID = new RegExp('[\?&]TIID=([^&#]*)').exec(window.location.href)[1];
                var TIID = $("#taskTIID").val();
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
                var gridValidate = true;
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
                        buttonvalidations = data.map(function (b) { return b.DID; });
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
                                if (!item.parent().parents(".control-group").hasClass('hide')) {

                                    item.removeClass('igr');
                                } else {
                                    item.addClass('igr');
                                }
                            });
                        }


                        if (!ignoreall) {
                            //form içindeki inputları validasyon kontrolüne dahil eder
                            $('.form-validate input,.form-validate select,.form-validate textarea,.form-validate table,div[control-name="tablo"]').each(function () {
                                var item = $(this);
                                if (item.hasClass("table-bordered") && (buttons.length > 0 && buttons[0].CHAIN_FLAG == 1)) {
                                    var dataDid = item.attr("data-did");
                                    if (dataDid) {
                                        $("[data-did=" + dataDid + "]").removeClass('igr');
                                        $("[data-did=" + dataDid + "]").removeAttr('req');

                                    }
                                }

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
                                        if (item.hasClass("table-bordered")) {
                                            $("#netoloji-grid-" + i.DID).addClass('ignr');
                                        }
                                        else {
                                            if (!item.parent().parents(".control-group").hasClass('hide')) {
                                                item.rules("add", "required");
                                                item.removeClass('igr');
                                            } else {
                                                item.addClass('igr');
                                            }
                                        }

                                    }
                                });

                                // if(item.parents().hasClass("hide"))
                                // {

                                //     item.parents().removeClass("igr");
                                //     item.removeClass('igr');
                                //     item.addClass("ignr");
                                //     item.parents().addClass("ignr");
                                //     console.log(item);
                                // }
                            })

                            $(buttons).each(function (index, i) {
                                $(".file-uploader[rq='true']").each(function () {
                                    if (i.CHAIN_FLAG == 1) {
                                        $el = $(this);
                                        if ($el.attr("data-did") == i.DID)
                                            if ($el.attr('filename').length < 1 && !$el.parent().parents(".control-group").hasClass('hide')) {
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
                                        if ($el.attr('filename').length < 1 && !$el.parent().parents(".control-group").hasClass('hide')) {
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
                                var grid = $(gridId);
                                if (grid.length) {
                                    if (!ValidateTable(gridId)) {
                                        gridValidate = false;
                                        $(gridId).addClass("invalid-table");
                                        $(gridId).parent().parent().parent(".control-group").addClass("error");
                                        $(gridId).parent().parents(".control-group").addClass("error");

                                    }
                                }


                            });
                        }
                        else {
                            $('.form-validate table,div[control-name="tablo"]').each(function () {
                                var item = $(this);

                                if (item.hasClass("table-bordered") && (buttons.length > 0 && buttons[0].CHAIN_FLAG == 1)) {

                                    var dataDid = item.attr("data-did");
                                    if (dataDid) {
                                        $("[data-did=" + dataDid + "]").removeClass('igr');
                                        $("[data-did=" + dataDid + "]").removeAttr('req');

                                    }
                                }

                                item.parent().parent().parent(".control-group").removeClass("error");
                                item.parent().parents(".control-group").removeClass("error");
                                item.parent().next(".error").hide();
                                item.addClass('igr');
                            })
                        }
                    },

                });

                if (!ignore && !ignoreall) {
                    $('.form-validate input,.form-validate select,.form-validate textarea').each(function () {
                        if ($(this).attr("data-rule-required") === "true") {
                            if (!$(this).parent().parents(".control-group").hasClass('hide')) {
                                $(this).removeClass('igr');
                            } else {
                                $(this).addClass('igr');
                            }
                        }
                    });
                    //filesvalid = CheckFilesValid();
                }
                $(".search-grid-input").addClass("igr");
                $('.form-validate').validate().settings.ignore = '.igr';

                if (ignoreall) {
                    $('.form-validate').validate().settings.ignore = '*';
                    ignoreGrid = true;
                    filesvalid = true;
                }

                var isValidTable = true;
                if ($(".invalid-table").length > 0) {
                    isValidTable = false;
                }
                var isValid = $(".form-validate").valid();

                $('.TaskAction').attr('disabled', true);

                setRequiredTabColor();

                if (!isValid || !isValidTable) {

                    $buttonEl.find('span').remove();
                    $buttonEl.text($buttonEl.attr("oldText"));

                    $('.TaskAction').attr('disabled', false);

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
                $('.form-validate input.numeric').each(function () {

                    var item = $(this);
                    var dataFormat = item.attr('data-format');
                    if (dataFormat == '') {
                        var minValue = item.attr('data-rule-min');
                        var maxValue = item.attr('data-rule-max');
                        var Value = item.val();
                    } else {
                        var minValue = item.attr('minval');
                        var maxValue = item.attr('maxval');
                        var Value = item.attr('data-val');
                    }
                    if ((minValue != undefined || maxValue != undefined) && (minValue != '' || maxValue != "")) {
                        if (item.parent().parents(".control-group").hasClass('hide')) {
                            item.removeClass('error');
                        } else {

                            if (Value !== '') {

                                minValue = parseFloat(minValue);
                                maxValue = parseFloat(maxValue);
                                Value = Value.replace(/[^0-9\-,.]/g, "").replace(",", ".");
                                var numericValue = parseFloat(Value);

                                if (!isNaN(numericValue) && (numericValue < minValue || numericValue > maxValue)) {
                                    $(this).focusout();
                                    item.removeClass('igr');
                                }
                            } else {
                                $(this).focusout();
                                item.removeClass('igr');
                            }
                        }
                    }
                });
                if ($("#taskform").valid() && filesvalid && isValidTable) {
                    $('.TaskAction').attr('disabled', true);
                    var timeOut = $(this).attr('data-initialdelay');
                    //var ignoreTable = ignoreall || ignore;
                    var ignoreTable = ignoreall;
                    if (ValidateAllTable(ignoreTable, buttonvalidations)) {
                        SendFormData(formData, timeOut, TIID, buttonId);
                    } else {

                        $buttonEl.find('span').remove();
                        $buttonEl.text($buttonEl.attr("oldText"));
                        $('.TaskAction').attr('disabled', false);
                    }

                }
                else {
                    ValidateAllTable(ignoreall, buttonvalidations);
                    $buttonEl.find('span').remove();
                    $buttonEl.text($buttonEl.attr("oldText"));
                    $('.TaskAction').attr('disabled', false);
                }
            }
            else {
                $('.TaskAction').attr('disabled', false);
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

function ValidateAllTable(ignoreTable, buttonvalidations) {
    var devamet = true;
    if (!ignoreTable) {
        $("table[id^='netoloji-grid-']").each(function () {
            var isShowing = $(this).parent().parents(".control-group").hasClass('hide');
            if (!isShowing) {
                var id = $(this).attr('id').split("-")[2];
                var req = $(this).attr('req');

                if ($("#netoloji-grid-" + id).hasClass("ignr")) {
                    req = "req";
                }


                if ($("#checkTableReadOnly-" + id).html() == "True") {
                    devamet = true;
                    return;
                }

                if (req == "req") {
                    if ($('#netoloji-grid-' + id + ' tbody tr').length < 1) {
                        devamet = false;
                        $('#netoloji-grid-' + id).addClass("invalid-table");
                        $('#netoloji-grid-' + id).parent().parent().parent(".control-group").addClass("error");
                        $('#netoloji-grid-' + id).parent().parents(".control-group").addClass("error");
                        $('#netoloji-grid-' + id).parents("div.gridLeftRightPadding").addClass("notvalid");
                    }
                }
                $("#netoloji-grid-" + id).find("input,select,textarea").each(function () {

                    var attr = $(this).attr('required');
                    if (typeof attr !== typeof undefined && attr !== false) {
                        var dataVal = $(this).attr("type") == "file" ? $(this).attr("value") : $(this).val()
                        if (isEmptyDrop(dataVal, $(this).get(0).nodeName)) {
                            $('#netoloji-grid-' + id).addClass("invalid-table");
                            $(this).addClass("invalids");
                            if ($(this).attr('type') === "file") {
                                $(this).parent("div").addClass("invalids");
                            } else {
                                $(this).addClass("invalids");
                            }
                            devamet = false;
                        }
                    }
                });
                $('#netoloji-grid-' + id + ' tbody tr td textarea').each(function () {

                    var attr = $(this).attr('required');
                    var invalid = $(this).filter(".invalids,[pattern!=''], .lit-checkbox");
                    if (typeof attr !== typeof undefined && attr !== false) {
                        var dataVal = $(this).attr("type") == "file" ? $(this).attr("value") : $(this).val()
                        if (isEmpty(dataVal)) {
                            $('#netoloji-grid-' + id).addClass("invalid-table");
                            $(this).addClass("invalids");
                            if ($(this).attr('type') === "file") {
                                $(this).parent("div").addClass("invalids");
                            } else {
                                $(this).addClass("invalids");
                            }
                            devamet = false;
                        }
                    }
                    if (invalid.length > 0) {
                        if (Checkme(this) !== true || isEmpty($(this).val())) {
                            devamet = false;
                        }
                    }
                });


                $('#netoloji-grid-' + id + ' tbody tr td input').each(function () {
                    var attr = $(this).attr('required');
                    var invalid = $(this).filter(".invalids,[pattern!=''], .lit-checkbox");
                    if (typeof attr !== typeof undefined && attr !== false) {
                        var dataVal = $(this).attr("type") == "file" ? $(this).attr("value") : $(this).val()
                        if (isEmpty(dataVal)) {
                            $('#netoloji-grid-' + id).addClass("invalid-table");
                            $(this).addClass("invalids");
                            if ($(this).attr('type') === "file") {
                                $(this).parent("div").addClass("invalids");
                            } else {
                                $(this).addClass("invalids");
                            }
                            devamet = false;
                        }
                    }
                    if (invalid.length > 0) {
                        if (Checkme(this) !== true || isEmpty($(this).val())) {
                            devamet = false;
                        }
                    }
                });
                $('#netoloji-grid-' + id + ' tbody tr td .lit-checkbox').each(function () {
                    var attr = $(this).attr('required');
                    if (typeof attr !== typeof undefined && attr !== false) {
                        if ($(this).is(":checked") == false) {
                            $(this).addClass("invalids");
                            devamet = false;
                        }
                    }
                });
            }
        });
    }
    return devamet;
}

function ValidateTable(gridId) {
    var retValue = true;
    var isShowing = $(gridId).parent().parents(".control-group").hasClass('hide');
    if (!isShowing) {

        var req = $(gridId).attr('req')?.toLowerCase();
        if (req === "true") {
            if ($(gridId + ' tbody tr').length < 1) {
                retValue = false;
                $(gridId).addClass("invalid-table");
                $(gridId).parents("div.gridLeftRightPadding").addClass("notvalid");
            }
        }
        $(gridId + ' tbody tr td input,' + gridId + ' tbody tr td select.old-netoloji-select').each(function () {
            var attr = $(this).attr('required');
            var invalid = $(this).filter(".invalids,[pattern!=''], .lit-checkbox");
            if (typeof attr !== typeof undefined && attr !== false) {
                var dataVal = $(this).attr("type") == "file" ? $(this).attr("value") : $(this).val()
                if (isEmptyDrop(dataVal, $(this).get(0).nodeName)) {
                    $(gridId).addClass("invalid-table");
                    $(this).addClass("invalids");
                    if ($(this).attr('type') === "file") {
                        $(this).parent("div").addClass("invalids");
                    } else {
                        $(this).addClass("invalids");
                    }
                    devamet = false;
                }
            }
            if (invalid.length > 0) {
                if (Checkme(this) !== true || isEmpty($(this).val())) {
                    devamet = false;
                }
            }
        });

        $(gridId + ' tbody tr td textarea').each(function () {

            var attr = $(this).attr('required');
            var invalid = $(this).filter(".invalids,[pattern!=''], .lit-checkbox");
            if (typeof attr !== typeof undefined && attr !== false) {
                var dataVal = $(this).attr("type") == "file" ? $(this).attr("value") : $(this).val()
                if (isEmpty(dataVal)) {
                    $(gridId).addClass("invalid-table");
                    $(this).addClass("invalids");
                    if ($(this).attr('type') === "file") {
                        $(this).parent("div").addClass("invalids");
                    } else {
                        $(this).addClass("invalids");
                    }
                    devamet = false;
                }
            }
            if (invalid.length > 0) {
                if (Checkme(this) !== true || isEmpty($(this).val())) {
                    devamet = false;
                }
            }
        });
    }
    return retValue;
}

//Task Action butonlarına tıklandığında görev Formu içindeki lit sütun zorunlulukları kontrol eder.(SaveChanges Hariç)
function CheckLitWhenTaskActionClick(tiid, buttonId) {
    var response = [];

    $('div.form-group.row.grid-form-group,div.custom-design .grid-form-group').not('.hide').each(function () {
        var lit = $(this).find('.newTableContainer').first();
        if (lit) {
            var didValue = lit.attr('did');
            var isRequired = convertToBool(lit.find('table').attr('req') === 'req');

            var formData = new FormData();
            formData.append("gridId", didValue);
            formData.append("Info", $("#tempInfo-" + didValue).html());
            formData.append("isRequired", isRequired);

            formData.append("TIID", tiid);
            formData.append("buttonId", buttonId);

            $.ajax({
                type: "POST",
                url: '/NewLineItemTable/CheckLitWhenTaskActionClick',
                data: formData,
                dataType: 'json',
                async: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (JSON.parse(data).length > 0) {
                        response = response.concat(JSON.parse(data));
                    }
                }
            });

        }
    });

    return response;
}

function isEmpty(value) {
    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}
function isEmptyDrop(value, type) {
    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null || (type === "SELECT" && value === "-1");
}
function SendFormData(formData, timeOut, TIID, buttonId) {
    var buttonValue = $buttonEl.val();

    if (buttonValue != "SaveChanges") {
        var invalidLitDidList = CheckLitWhenTaskActionClick(TIID, buttonId);

        if (invalidLitDidList.length > 0) {

            for (var i = 0; i < invalidLitDidList.length; i++) {
                $("#netoloji-grid-" + invalidLitDidList[i]).addClass("invalid-table");
                $("#netoloji-grid-" + invalidLitDidList[i]).parents("div.gridLeftRightPadding").addClass("notvalid");
            }

            $buttonEl.find('span').remove();
            $buttonEl.text($buttonEl.attr("oldText"));
            $('.TaskAction').attr('disabled', false);

            return;
        }
    }

    var devamet = true;
    if ($("table[id^='netoloji-grid-']").length > 0) {
        var tableData = GetAllDataForSave(false);
        if (tableData.length > 0) {

            try {
                if (typeof TIID === "undefined" || TIID == 0) {
                    TIID = parseInt($("#taskTIID").val());
                }
            } catch (e) { }

            setTimeout(function () {
                $.ajax({
                    async: false,
                    type: "POST",
                    global: false,
                    dataType: 'json',
                    url: "/NewLineItemTable/SaveNewLineItemTable",
                    data: { "lineItemData": tableData, "CIID": CIID, "TIID": TIID, "buttonId": buttonId },
                    success: function (response) {
                        if (!response.result) {
                            if (window.location.href.toLowerCase().indexOf("lists/list") < 0) {
                                devamet = false;
                            }
                            Pagination(response.did, response.tableId, response.page, response.rowCount, false);
                            var page = parseInt(response.page) + 1;
                            $('#pagination-' + response.tableId + ' li:nth-child(' + page + ')').addClass('active');
                            ValidateTable("#netoloji-grid-" + response.did);
                        } else {
                            devamet = true;
                        }
                    }
                });
            }, 50);
        }
        else {
            devamet = false;
        }
    }

    if (devamet) {
        if (isGeoLocationEnabled) {
            formData.latitude = latitude;
            formData.longitude = longitude;
        }
        formData.initialDelay = timeOut;
        isValid = true;
        if (buttonValue == "SaveChangesList") {
            isValid = $(".form-validate").valid();
            $('.TaskAction').attr('disabled', true);
            disableViewElem().css("opacity", "1").css("pointer-events", "unset");

            if (!isValid) {
                try {
                    var formName = "#right-1";
                    var topOffset = $(formName + " .error").filter(":first").position().top;
                    $(formName).scrollTop(topOffset);
                } catch (e) { }
            }
            if (window.location.href.toLowerCase().indexOf("lists") != -1) {
                setRequiredTabColor();
                ClearFullFormHash();
            }
        }
        if (isValid) {

            setTimeout(function () {
                $.ajax({
                    url: "/Task/SaveTaskForm",
                    type: "POST",
                    data: formData,
                    success: function (d) {
                        try { NetolojiFilterApplyLastFilter(); } catch (e) { }

                        var data = jQuery.parseJSON(JSON.stringify(d));
                        if (buttonValue == "SaveChanges") {

                            $buttonEl.attr("class", "btn btn-primary TaskAction");
                            $buttonEl.html(SaveChanges);
                            $('.TaskAction').removeAttr("disabled");

                            swal({
                                position: 'top-right',
                                type: 'success',
                                text: EFlang.Savedsuccessfully,
                                showConfirmButton: false,
                                timer: 1500
                            });

                        } else if (buttonValue == "SaveChangesList") {
                            $buttonEl.attr("class", "TaskAction btn btn-warning btn-elevate btn-pill btn-sm");
                            $buttonEl.html(SaveAll);

                            swal({
                                position: 'top-right',
                                type: 'success',
                                text: EFlang.Savedsuccessfully,
                                showConfirmButton: false,
                                timer: 500
                            });

                            $("#SaveChanges").parents("div[class='kt-quick-panel multiple-form']").attr('style', 'width: ' + '0%' + ' !important');
                            $("#SaveChanges").parents("div[class='kt-quick-panel multiple-form']").attr('is-open', 'false');
                            $('.TaskAction').removeAttr("disabled");
                            var CID = $buttonEl.attr("data-id");
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

                                    var viewType = $("#taskform").attr("view-type");
                                    //Kanban
                                    if (viewType == "1") {

                                        var subjectDid = $("#taskform").attr("subject-did");
                                        var status = $(`select[name="status"]`).val();
                                        var oldStatus = $(`select[name="status"]`).attr("data-placeholder");
                                        var cardDesc = $(`input[data-did="${subjectDid}"]`).val();
                                        if (typeof (cardDesc) == "undefined") {
                                            cardDesc = $(`textarea[data-did="${subjectDid}"]`).val();
                                        }
                                        var actTypeStr = "update";
                                        if (actType == 0) {
                                            actTypeStr = "new";
                                        }

                                        UpdateKanbanCard(data.CIID, actTypeStr, status, cardDesc, oldStatus);
                                    }

                                    else {
                                        var pageIndex = 1;
                                        var lastOrderIndex = 0;
                                        var lastOrderDirection = "asc";
                                        var filterData = "";

                                        if (viewType == "0") {
                                            var params = NetolojiFilter.GetDataFromLocalStorageIfExist();
                                            var isEmpty = jQuery.isEmptyObject(params);
                                            if (isEmpty == false) {
                                                filterData = GetFilterWithStorage();
                                            }

                                            try { pageIndex = parseInt($("#eflistsTableDiv").attr("pageIndex")); } catch (e) { }
                                            lastOrderIndex = parseInt(orderIndexVal);
                                            lastOrderDirection = orderDirectionVal;
                                        }

                                        LoadListItemsData(filterData, '', GetUserViewTypeWithUrl(), pageIndex, lastOrderIndex, lastOrderDirection);
                                    }
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
            }, 100);

        } else {
            $buttonEl.find('span').remove();
            $buttonEl.text($buttonEl.attr("oldText"));
            $('.TaskAction').attr('disabled', false);
        }
    }
    else {
        $buttonEl.find('span').remove();
        $buttonEl.text($buttonEl.attr("oldText"));
        $('.TaskAction').attr('disabled', false);
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
                    $buttonEl.attr("class", "btn btn-primary TaskAction");
                    $buttonEl.html(SaveChanges);
                    $('.TaskAction').removeAttr("disabled");

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
                    $('.TaskAction').removeAttr("disabled");
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
            if (($el.attr("rq") === "true" || $el.find("input[type='file']").attr("data-rule-required") === "true") && !$el.find('input').hasClass('igr')) {
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
    $('.file-uploader').each(function (i, v) {
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
                allowedExtensions: extensions,
            }
        }).on('cancel', function (id, filename) {
            $(".TaskAction").prop('disabled', false);
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
                    /*eSignDocument(true, ciid, did, result.filename);*/
                    linkSign = ` - <a href='#' class='SignAction' style='font-size: 1em;text-decoration: underline;color: #039aae;' data-esigndid='${did}' onclick='javascript:eSignDocument(true, ${ciid}, ${did}, "${result.filename}"); return false;' data-esignciid='${ciid}' data-esignfilename='${result.filename}'>${EFlang.Sign}</a>`;
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
            $("div[class='qq-upload-drop-area']").prop("style", "display:none");
            $(".TaskAction").prop('disabled', false);
            $(".ListFormButton").prop('disabled', false);
            clearMatchedInputs(did);
            var _fineUploader = $(this);
            if (result.success == true && isOcr) {
                $.ajax({
                    url: "/Task/OcrParse",
                    type: "POST",
                    data: { "ciid": ciid, "did": did, "fileName": result.filename, "tiid": parseInt($("#taskTIID").val()) },
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
                                                            var inptFormat = inpt.attr("data-format");
                                                            var newValue = formatValueForInput(_el.DataValue, langMinStringVar, inptFormat);
                                                            inpt.val(newValue);
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
            $(".TaskAction").prop('disabled', true);
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
        var formData = $("#taskform").serializeObject();

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

function getCurrencySymbolForNumeric(culture) {
    const map = {
        tr: "₺", en: "$", de: "€", fr: "€", pt: "€", pl: "zł",
        az: "₼", ar: "د.إ", es: "€", ru: "₽"
    };
    return map[culture] || "$";
}
function getValidDecimalSeparator(culture) {
    const map = {
        tr: ",", en: ".", de: ",", fr: ",", pt: ",", pl: ",",
        az: ".", ar: ",", es: ",", ru: ","
    };
    return map[culture] || ".";
}
function getValidNumberGroupSeparator(culture) {
    const map = {
        tr: ".", en: ",", de: ".", fr: " ", pt: ".", pl: " ",
        az: ",", ar: ",", es: ".", ru: " "
    };
    return map[culture] || ",";
}
function formatValueForInput(rawValue, culture, format) {
    if (rawValue == null || rawValue === "") return "";

    var num = parseFloat(rawValue.toString().replace(",", "."));
    if (isNaN(num)) return rawValue;

    var decimalSep = getValidDecimalSeparator(culture);
    var groupSep = getValidNumberGroupSeparator(culture);

    let decimalPlaces = 2;
    let prefix = "";
    let suffix = "";
    let useGrouping = false;

    switch (format.toUpperCase()) {
        case "N0": decimalPlaces = 0; useGrouping = true; break;
        case "N1": decimalPlaces = 1; useGrouping = true; break;
        case "N2": decimalPlaces = 2; useGrouping = true; break;
        case "N3": decimalPlaces = 3; useGrouping = true; break;
        case "C0": decimalPlaces = 0; useGrouping = true; prefix = getCurrencySymbolForNumeric(culture); break;
        case "C1": decimalPlaces = 1; useGrouping = true; prefix = getCurrencySymbolForNumeric(culture); break;
        case "C2": decimalPlaces = 2; useGrouping = true; prefix = getCurrencySymbolForNumeric(culture); break;
        case "C3": decimalPlaces = 3; useGrouping = true; prefix = getCurrencySymbolForNumeric(culture); break;
        case "#": decimalPlaces = 0; useGrouping = false; break;
        case "#.##": decimalPlaces = 2; useGrouping = false; break;
        case "0.00": decimalPlaces = 2; useGrouping = false; break;
        case "0.000": decimalPlaces = 3; useGrouping = false; break;
        case "$0.00": decimalPlaces = 2; useGrouping = false; prefix = "$"; break;
        case "€0.00": decimalPlaces = 2; useGrouping = false; prefix = "€"; break;
        case "#,###.00": decimalPlaces = 2; useGrouping = true; break;
        case "#,###.00 TL": decimalPlaces = 2; useGrouping = true; suffix = " TL"; break;
        default: decimalPlaces = 2; useGrouping = true; break;
    }

    let fixed = num.toFixed(decimalPlaces);
    let [intPart, decPart] = fixed.split(".");

    if (useGrouping) {
        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, groupSep);
    }

    let formatted = intPart;
    if (decimalPlaces > 0) {
        formatted += decimalSep + decPart;
    }

    return prefix + formatted + suffix;
}

function openTskSignModal(isPdf) {
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
function eSignDocument(isPdf, ciid, did, fileName) {
    document.querySelectorAll(".es-tsk-table-cell").forEach(element => { element.innerHTML = ""; });
    $('#task_iframe_signature').children('iframe')[0].src = "about:blank";
    $('#sign_ciid').val(ciid);
    $('#sign_did').val(did);
    $('#sign_fileName').val(fileName);

    if (isPdf)
        setTaskSignLocationPDF(ciid, did, fileName, 1);
    else
        openTskSignModal(false);
}
function setTaskSignLocationPDF(ciid, did, fileName, page) {
    $.ajax({
        type: 'GET', dataType: "json", traditional: true, url: "/task/GetUserAutoSignLocation",
        success: function (result) {
            Swal.close();
            if (result.IsSuccess) {
                if (result.ObjectModel === true) {
                    openTskSignModal(false);
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

function SetElements() {
    $('#taskform input, #taskform select, #taskform textarea').each(function (i) {
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

    $(".TaskAction").each(function () {

        $el = $(this);
        if ($el.attr("data-backcolor") != undefined) {
            $el.css("background-color", $el.attr("data-backcolor"));
        }
        if ($el.attr("data-textcolor") != undefined) {

            $el.css("color", $el.attr("data-textcolor"));
        }
    });

    $('.datetime').each(function () {
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

    $('.tablebody.old').on('scroll', function () {
        $('.tableheader').scrollLeft($(this).scrollLeft());
    });

    $(document).on('keydown', '.numeric', function (e) {
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

    //$(document).on('focusout', '.numeric', function (e) {
    //    var nmbr = $(this).val();

    //    if ($(this).val() != "") {
    //        $(this).attr('data-val', $(this).val());

    //        $(this).attr('data-val', nmbr);
    //        if ($(this).hasClass('gridnum')) {
    //            $(this).parents("td").attr('etext', $(this).val()).attr('eval', nmbr);
    //            SetLinkedEl($(this));
    //        }
    //    }
    //    else {
    //        $(this).attr('data-val', "");
    //    }
    //});

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

    $(document).on('focusout', '.numeric', function (e) {
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
    SetSelectors();

}

function SetSelectors() {
    $('.popupselecttext').attr("readonly", true);
    $(document).on('click', '.popupselector', function () {

 
        $(this).html('<span class="icon-refresh icon-spin"></span>');
        $("#myModalLabel").html($(this).attr('data-displayname'));
        var DID = $(this).data('did');
        var OrderedColumn = "";
        var OrderDir = "ASC";
        var Condition = "";
        var Con = $(this).attr("Con");
        var element = $(this);
        $('.popupselectbox').attr('data-targetinput', element.attr('data-targetinput'));
        $('.popupselectbox').attr('data-targetdid', DID);
        $('.popupselectbox').attr('Con', Con);

        GetSelectorValues(DID, OrderedColumn, OrderDir, Condition, 1, true, Con);

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
    $(document).delegate('.popupcolselector', 'click', function (e) {
        $(this).html('<span class="icon-refresh icon-spin"></span>');

        $("#myModalLabel").html("");

        var DID = $(this).data('did');
        var OrderedColumn = "";
        var OrderDir = "ASC";
        var Condition = "";
        var element = $(this);
        $('.popupselectbox').attr('data-targetinput', element.attr('data-targetinput'));
        $('.popupselectbox').attr('data-target-rowindex', $(this).parents("tr").index());

        //editablepopup için eklendi.(birden fazla kolon içeren tablolar için nasıl olacak.)
        if ($(".popupcolselector").parent().find(".popupselecttext").attr("editpopup") === "true") {
            Condition = "1|" + $(".popupcolselector").parent().find(".popupselecttext").val();
            var searchtext = $(".popupcolselector").parent().find(".popupselecttext").val();
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
            $('.popupselectbox').attr('data-targetdid', DID);
        }

        dataddq = DDQ;
        _did = $(this).parents(".grid").attr("did");
        var gridInd = $(this).parents(".grid").attr("index");
        var name = $(this).parents(".grid").attr("name");

        $('.popupselectbox').attr('data-tableindex', gridInd);

        var index = $(this).parents(".grid").attr("index");
        var rowIndex = $('.popupselectbox').attr('data-target-rowindex');
        var currentPage = $(".grid[index=" + gridInd + "]").data("kendoGrid").dataSource.page();
        var currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
        var columnField = $(this).parents("td").attr("columnid");

        var _readonly = getSingleValue(index, columnField, rowIndex, "readonly", -1, name);

        $('.popupselectbox').attr('data-target-readonly', _readonly);

        GetSelectorValuesCol(DDQ, lns, OrderedColumn, OrderDir, Condition, 1, true, index, _did, currentRowIndex, columnField);
    });

    $('.popupselectbox').on('hidden', function () {

        $('.popupselectbox').attr('data-targetinput', '');
        $('.popupselectbox').attr('data-targetdid', '');
        $('.popupselectbox').attr('data-current', '');
        $('.popupselectbox').attr('data-textcol', '');
        $('#pps-table-col-grp').empty();
        $('#pps-table-col-names').empty();
        $('#pps-table-filter').empty();
        $('#pps-table-data').empty();
        $('.popupselectbox .navlink').attr('data-page', '1');
    });

}

function GetSelectorValues(DID, OrderedColumn, OrderDir, Condition, PageNum, IsNew, Con) {
    $.ajax({
        url: "/Task/GetDataList",
        type: "GET",
        data: { "FormHash": $("#taskform [name='taskhash']").val(), "DID": DID, "OrderedColumn": OrderedColumn, "OrderDir": OrderDir, "Condition": Condition, "PageSize": SelectorListSize, "PageNum": PageNum, "Con": Con },
        success: function (d) {
            var data = jQuery.parseJSON(JSON.stringify(d));
            $('.popupselectbox').attr('data-current', PageNum);

            WriteSelectorListMetronic(data, $('.popupselector'), PageNum, IsNew);
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
            "FormHash": $("#taskform [name='taskhash']").val(),
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

function GetSelectorValuesCol(DDQ, LINES, OrderedColumn, OrderDir, Condition, PageNum, IsNew, tableIndex, DID, currentRowIndex, column) {

    var name = $(".grid[did=" + DID + "]").attr("name");

    $.ajax({
        url: "/Task/GetDataListCol",
        type: "POST",
        data: {
            "FormHash": $("#taskform [name='taskhash']").val(),
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
            $('.popupselectbox').attr('data-current', PageNum);

            WriteSelectorListMetronic(data, $('.popupcolselector'), PageNum, IsNew, Condition);
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
            data: { "FormHash": $("#taskform [name='taskhash']").val(), "DDQ": DDQ, "Colvals": JSON.stringify(lns) },
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
            data: { "FormHash": $("#taskform [name='taskhash']").val(), "DDQ": DDQ, "Colvals": JSON.stringify(lns) },
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

function SetSelectorPageNumberMetronic(PageCount, CurrPage) {

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

function GetConditionMetronic() {

    var cond = "";
    $("#pps-table-filter input").each(function (i) {
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
            $('.popupselectbox').attr('data-textcol', d.TextColumn);
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
        $('.popupselectbox').attr('data-pagecount', pageCount);
        SetSelectorPageNumber(pageCount, PageNum);
        if (IsNew) {
            $(".popupselectbox").modal('show');
        }
        $('.tablebody').scrollTop(0);
    }
    else {
        $('.tablebody table tbody').empty();
        $('.tablebody table tbody').html(resultNotFound);
        element.html('...');
    }
}

function SetPopupSelectWidthGrp(columns) {

    var totalColumnWidth = 0;
    $.each(columns, function (k, v) { totalColumnWidth = totalColumnWidth + v.ColWidth; });

    if (totalColumnWidth == 100) {

        var widthRatio = $(window).width() / columns.length;
        var baseWidth = 0;

        if (columns.length >= 7) { baseWidth = 500; }
        if (columns.length >= 10) { baseWidth = 750; }
        if (columns.length >= 15) { baseWidth = 1000; }

        var columnLenghtRatio = 7;
        var windowsSize = $(window).width();

        if (windowsSize > 1600 && windowsSize <= 1920)
            columnLenghtRatio = 8;
        else if (windowsSize > 1920 && windowsSize <= 2200)
            columnLenghtRatio = 9;
        else if (windowsSize > 2200)
            columnLenghtRatio = 10;

        if (columns.length >= columnLenghtRatio) {
            $("#pps-table-root").attr("style", "width: " + ((widthRatio * columns.length) + baseWidth) + "px !important");
        }
        $.each(columns, function (k, v) {
            $('#pps-table-col-grp').append('<col style="width: ' + v.ColWidth + '% !important"/>');
        });
    }
}

function WriteSelectorListMetronic(d, element, PageNum, IsNew, Condition) {

    $("#ppsm-load-spinner").show();

    var txtSearch = "";
    $("#popup-select-modal > div > div.modal-footer .tabnav").css("visibility", "visible")
    $('#ppsEmptyRowsFilterNotFound').empty();

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
            $('.popupselectbox').attr('data-textcol', d.TextColumn);
            $('#pps-table-col-grp').empty();
            $('#pps-table-col-names').empty();
            $('#pps-table-filter').empty();
            $("#pps-table-root").attr("style", "");

            SetPopupSelectWidthGrp(d.Columns);

            $.each(d.Columns, function (k, v) {

                $('#pps-table-col-names').append('<th>' + v.ColName + '</th>');

                if (k === 1) {
                    $('#pps-table-filter').append('<td><div class="kt-input-icon kt-input-icon--right kt-subheader__search"><input id="' + k + '" name="' + k + '" class="form-control filterInputbg" data-coli="' + k + '" type="text" value="' + txtSearch + '"/><span class="kt-input-icon__icon kt-input-icon__icon--right"><span><i style="color:#22b9ff" class="flaticon2-search-1"></i></span></span></div></td>');
                } else {
                    $('#pps-table-filter').append('<td><div class="kt-input-icon kt-input-icon--right kt-subheader__search"><input id="' + k + '" name="' + k + '" class="form-control filterInputbg" data-coli="' + k + '" type="text"/><span class="kt-input-icon__icon kt-input-icon__icon--right"><span><i style="color:#22b9ff" class="flaticon2-search-1"></i></span></span></div></td>');
                }

            });
        }

        $('#pps-table-data').empty();
        $.each(d.Values, function (k, v) {
            $col = $('<tr>');
            $col.attr('itemval', v[0]);
            for (var i = 1; i < v.length; i++) {
                $col.append('<td class="tdItemval">' + v[i] + '</td>');
            }
            $('#pps-table-data').append($col);
        });

        var recordCount = parseFloat(d.Total);
        $("#popup-select-modal > div > div.modal-footer .total-count-pps").html(EFlang.Total + " " + recordCount + " " + EFlang.RecordsOfListing)
        var pageCount = Math.ceil(recordCount / SelectorListSize);
        $('.popupselectbox').attr('data-pagecount', pageCount);
        SetSelectorPageNumberMetronic(pageCount, PageNum);
        if (IsNew) {
            $(".popupselectbox").modal('show');
        }
        $('.tablebody').scrollTop(0);
        $("#pps-table-filter td:first-child input").focus();
    }
    else {
        $('#pps-table-data').empty();
        $('#ppsEmptyRowsFilterNotFound').html('<div class="alert alert-default pps-alert-default" role="alert"><div class="alert-text">' + resultNotFound + '</div></div>');
        element.html('...');
        $("#popup-select-modal > div > div.modal-footer .tabnav").css("visibility", "hidden")
        $("#popup-select-modal > div > div.modal-footer .total-count-pps").html("")
    }

    $("#ppsm-load-spinner").show(1).delay(250).hide(1);

    $(".filterInputbg").blur();
}

function htmlEntities(str) {
    return String(str).replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"');
}

function setPopupSelectListeners() {

    $(document).on('click', '.popupselectbox #pps-table-data tr', function () {

        $('.popupselectbox #pps-table-data tr').removeClass('selected');
        $(this).addClass('selected');
    });

    $(document).on('dblclick', '.popupselectbox #pps-table-data tr', function () {
        var textcol = $('.popupselectbox').attr('data-textcol');
        var targetinput = $('.popupselectbox').attr('data-targetinput');
        var textval = htmlEntities($(this).find('td:eq(' + textcol + ')').html());
        var hashval = $(this).attr('itemval');
        $('#' + targetinput).val(textval);
        $('#' + targetinput).attr('data-itemval', hashval);
        $('#' + targetinput).css("color", "#555");

        //popup select value dolu fakat text boş olduğunda validationa takılmaması için eklendi
        if (hashval != "") {
            $('#' + targetinput).attr("data-rule-required", "false");
            $('#' + targetinput).parent().parent().parent(".control-group").removeClass("error");
            $('#' + targetinput).addClass("valid");
            $('#' + targetinput).parent().next(".error").hide();
            if (textval == "") {
                $('#' + targetinput).val(".");
                $('#' + targetinput).css("color", "#fff");
            }
        }

        var DID = $('.popupselectbox').attr('data-targetdid');
        if (DID == "") {
            $('#' + targetinput).parents("td").attr('etext', textval).attr('eval', hashval);
            SetLinkedEl($('#' + targetinput));
        }

        $('.popupselectbox').modal('hide');
        validatePops();

    });

    $(document).on('click', '.selectpopitem', function () {

        if ($('.popupselectbox #pps-table-data tr.selected').length > 0) {
            $('.popupselectbox #pps-table-data tr.selected').trigger('dblclick');
        }
    });

    $(document).off('keydown', '#pps-table-filter input').on('keydown', '#pps-table-filter input', function (e) {

        if (e.keyCode == 13) {
            $('.popupselectbox').attr('data-current', 0);
            $('.popupselectbox .firstpage').trigger('click');
        }
    });

    $(document).off('click', '.popupselectbox .pagenum, .popupselectbox .navlink').on('click', '.popupselectbox .pagenum, .popupselectbox .navlink', function () {

        showLoading();
        var curPage = 0;
        var targetPage = 1;
        if ($(this).hasClass('clearfilters')) {
            $('.thefilter input').val('');
        }
        else {
            curPage = $('.popupselectbox').attr('data-current');
            targetPage = parseInt($(this).attr('data-page'));
        }

        var pageCount = $('.popupselectbox').attr('data-pagecount');
        if (curPage != targetPage) {
            var OrderedColumn = "";
            var OrderDir = "ASC";
            var Condition = GetConditionMetronic();
            var Con = $('.popupselectbox').attr('con');
            var DID = $('.popupselectbox').attr('data-targetdid');

            if (DID != "") {
                GetSelectorValues(DID, OrderedColumn, OrderDir, Condition, targetPage, false, Con);
            }
            else {
                var dataEl = $('.popupselectbox').attr('data-targetinput');
                //var DDQ = dataEl.parents('table').find('thead th[data-col = "' + dataEl.parents('td').attr('data-col') + '"]').attr('dataddq');

                var gridInd = $('.popupselectbox').attr("data-tableindex");

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

                var rowIndex = $('.popupselectbox').attr('data-target-rowindex');
                var currentPage = $(".grid[index=" + gridInd + "]").data("kendoGrid").dataSource.page();
                var currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
                var columnField = $(this).parents("td").attr("columnid");

                GetSelectorValuesCol(DDQ, lns, OrderedColumn, OrderDir, Condition, targetPage, false, gridInd, DID, currentRowIndex, columnField);
            }
        }
    });

    $('.modal-content.old').resizable({
        alsoResize: ".popupselectbox",
        maxHeight: $('.modal-content').height()
    });
    $('.popupselectbox.old').draggable();
    $('.popupselectbox.old').on('show.bs.modal', function () {
        $(this).find('.modal-body').css({
            'max-height': '100%'
        });
    });
    $("#pps-table-root .thefilter").dblclick(false);

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
        var formData = $("#taskform").serializeObject();
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
                $tdEl.append('<p class="input-append" height="28px"><input type="text" data-itemval="" id="' + uniqueElmID + '" autocomplete="off" class="input-xlarge popupselecttext" readonly="readonly"><a class="popupcolselector" type="button" data-targetinput="' + uniqueElmID + '" href="#"><i class="flaticon-more-1"></i></a></p>');
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

    $('.popupselecttext').hover(function (e) {
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
    }, function () { $(this).css("visibility", "hidden"); });
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

        $("#taskform").find(":input").each(function (index, i) {
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
        var formData = $("#taskform").serializeObject();
        //console.log(formData);
        _affectedDids.push({ did: did, Affected: AffectedDids(did, formData) });
    });

    $(document).on('dblclick', '.popupselectbox #pps-table-data tr', function () {
        var textcol = $('.popupselectbox').attr('data-textcol');
        var textval = htmlEntities($(this).find('td:eq(' + textcol + ')').html());
        var hashval = $(this).attr('itemval');
        var DID = $('.popupselectbox').attr('data-targetdid');
        var targetinput = $('.popupselectbox').attr('data-targetinput');
        var formData = IncludeReadOnlyValuesInserialization();

        formData[targetinput] = hashval;
        Populate(DID, true, formData);
        var istrigger = $(this).attr("data-isTrigger");
        ExecuteInputFunc(DID, formData, true, false, istrigger);

    });

    $(".numeric").on("blur", function () {
        var did = $(this).attr("data-did");
        var istrigger = $(this).attr("data-isTrigger");
        var formData = IncludeReadOnlyValuesInserialization();
        ExecuteInputFunc(did, formData, false, true, istrigger);
    });
    $(".select2-me").on("change", function () {

        var did = $(this).attr("data-did");
        var istrigger = $(this).attr("data-isTrigger");
        var value = $(this).val();
        var formData = IncludeReadOnlyValuesInserialization();
        Populate(did, false, formData);
        ExecuteInputFunc(did, formData, false, true, istrigger);
    });

    $(".icheck-me").change(function () {
        var formData = IncludeReadOnlyValuesInserialization();
        var istrigger = "";
        var did = $(this).attr("data-did");
        if ($(this).attr("type") == "checkbox") {
            istrigger = $(this).attr("data-isTrigger");
        }
        else {
            istrigger = $(this).attr("data-isTrigger");
        }
        ExecuteInputFunc(did, formData, false, false, istrigger);

    });
    ExecuteInputsFunc();
});

function IncludeReadOnlyValuesInserialization() {
    var disabledArray = [];
    $("#taskform").find(':input').each(function () {
        if ($(this).attr('disabled')) {
            if ($(this).attr("data-did") !== undefined && $(this).attr("data-did") !== 'undefined') {
                disabledArray.push($(this).attr("data-did"));
                $(this).removeAttr('disabled');
            }
            if ($(this).attr("data-targetdid") !== undefined && $(this).attr("data-targetdid") != 'undefined') {
                disabledArray.push($(this).attr("data-targetdid"));
                $(this).removeAttr('disabled');
            }
        }
    });
    var formData = $("#taskform").serializeObject();
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
        data: { "FormHash": $("#taskform [name='taskhash']").val(), "DID": DID, "taskform": formData },
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

                            if (selected == i[0]) {
                                obj.append($("<option value='" + i[0] + "' selected ='selected' >" + i[1] + "</option>"));
                            } else {
                                if (RowCount == 1) {
                                    obj.append($("<option selected ='selected' />").val(i[0]).text(i[1]));
                                    $("#" + dt.DID + "").parent().parent().find("input[type=hidden]").val("" + i[1] + "");
                                }
                                else {
                                    obj.append($("<option value='" + i[0] + "' >" + i[1] + "</option>"));
                                }
                            }
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

function ExecuteInputFunc(dId, formdata, isPopup, isSelect2, istrigger) {
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
            data: { "FormHash": $("#taskform [name='taskhash']").val(), "dId": dId, "taskform": formdata },
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
                                $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").removeClass("hide");
                                $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "block");
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
                                $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").addClass("hide");
                                $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "none");



                            } else {

                                $("[data-did=" + item.DID + "]").parents(".control-group").addClass("hide");
                                $("label[did=" + item.DID + "]").parents("div[control-name]").addClass("hide");
                                $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").hide();
                                $("input[data-did=" + item.DID + "]").parents("span.hide").addClass("hide");
                                $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "none");
                                $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").addClass("hide");
                                $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "none");

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
                            $(".ppsMore-" + item.DID).find("span").removeClass("popupselector");

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
                            if (!$(".ppsMore-" + item.DID).find("span").hasClass("popupselector")) {
                                $(".ppsMore-" + item.DID).find("span").addClass("popupselector");
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

function ExecuteInputsFunc(spesificDid = 0) {
    try {
        $.ajax({
            url: "/Task/RunInputMethods",
            type: "POST",
            data: { "FormHash": $("#taskform [name='taskhash']").val() },
            success: function (d) {

                $.each(d, function (index, item) {

                    if ((spesificDid != 0 && spesificDid == item.DID) || spesificDid == 0) {

                        if (item.ShowExp !== -1) {
                            if ((item.ShowExp)) {
                                if (item.DataType == 8) {
                                    $("#netoloji-grid-" + item.DID).parents(".control-group").removeClass("hide");
                                    $("label[did=" + item.DID + "]").parent().removeClass("hide");
                                    $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").show();
                                    $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "block");
                                }
                                else {
                                    $("[data-did=" + item.DID + "]").parents(".control-group").removeClass("hide");
                                    $("label[did=" + item.DID + "]").parents("div.hide").removeClass("hide");
                                    $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").show();
                                    $("input[data-did=" + item.DID + "]").parents("span.hide").removeClass("hide");
                                    $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "block");
                                    $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").removeClass("hide");
                                    $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "block");
                                }
                            } else {
                                if (item.DataType == 8) {
                                    $("#netoloji-grid-" + item.DID).parents(".control-group").addClass("hide");
                                    $("label[did=" + item.DID + "]").parent().addClass("hide");
                                    $("table[data-did=" + item.DID + "]").removeClass('igr');
                                    $("table[data-did=" + item.DID + "]").removeAttr('req');
                                    $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "none");
                                    $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").hide();
                                } else {
                                    $("[data-did=" + item.DID + "]").parents(".control-group").addClass("hide");
                                    $("label[did=" + item.DID + "]").parents("div[control-name]").addClass("hide");
                                    $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "none");
                                    $("label[did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").hide();
                                    $("input[data-did=" + item.DID + "]").parents("span.hide").addClass("hide");
                                    $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").addClass("hide");
                                    $("h3[data-did=" + item.DID + "]").parents("div.dsnMapElem").closest("td").css("display", "none");
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
                                $(".ppsMore-" + item.DID).find("span").removeClass("popupselector");

                                if (item.DataType === 8) {
                                    $(".newLine-" + item.DID).find("a").addClass("hide");
                                    $(".newLine-" + item.DID).parents(".grid-focus-border_" + item.DID).addClass("gridReadonlyBackgroud");
                                    $("#searchbar-" + item.DID).attr("disabled", false);
                                    $("[data-did=" + item.DID + "]").find(".col-search-input").attr("disabled", false);
                                    $("[data-did=" + item.DID + "] .noborder-left").css({ visibility: "hidden" });
                                    $("[data-did=" + item.DID + "] .noborder-right").css({ visibility: "hidden" });                                    
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
                                if (!$(".ppsMore-" + item.DID).find("span").hasClass("popupselector")) {
                                    $(".ppsMore-" + item.DID).find("span").addClass("popupselector");
                                }

                                if (item.DataType === 8) {
                                    $(".newLine-" + item.DID).find("a").removeClass("hide");
                                    $(".newLine-" + item.DID).parents(".grid-focus-border_" + item.DID).removeClass("gridReadonlyBackgroud");
                                    $("[data-did=" + item.DID + "] .noborder-left").css({ visibility: "unset" });
                                    $("[data-did=" + item.DID + "] .noborder-right").css({ visibility: "unset" });
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
                    }

                });
            },
            cache: false
        });

    } catch (e) { }
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

                    if (window.location.href.indexOf('Task/Details') > 0) {
                        window.location.href = d;
                    }
                    else {
                        FinalizeTask(d)
                    }
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
                if (window.location.href.indexOf('Task/Details') > 0) {
                    window.location.href = d;
                }
                else {
                    FinalizeTask(d)
                }
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

    run_waitMe($('.popupselectbox'), 1, 'bounce');

}

function hideLoading() {
    $('.popupselectbox').waitMe('hide');
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
function TaskActionClick(id) {
    var button = $('#BTN' + id);
    button.click();
}

function triggerdatefocus(obj) {
    $(obj).closest("div.input-group").find("input").trigger("focus");
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