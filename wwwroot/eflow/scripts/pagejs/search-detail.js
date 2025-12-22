var variableID = 0;
$(window).ready(function () {
    SetSelectors();

});
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

$(document).ready(function () {
    $('.popupselectbox-modal').on('shown.bs.modal', function (e) {

        setPopupSelectListeners();
    });

    $('.popupselectbox-modal').on('shown.bs.hidden', function (e) {
        _container = undefined;
    });
    SetUploaders();

    $("input[id *= 'datetimepicker1']").each(function () {
        var did = $(this).data("did");
        var startDate = $(this).data("startdate");
        var endDate = $(this).data("enddate");
        var format = $(this).data("format");
        setDatetimePicker(did, startDate, endDate, format);
    });

    $(".newTableContainer").on("click", "tbody td", function () {

        $(".newTableContainer").find("tbody select").select2("close");

        var did = $(this).closest("table").data("did");
        var columnId = $(this).data("column");
        var ciid = $(this).closest("table").data("ciid");
        var storagekey = "litdropdata-" + columnId + "-" + ciid + "-" + did + "-";
        var isfilled = $(this).find("select").data("isfilled");
        var result;
        if (!isfilled) {
            if (localStorage.getItem(storagekey) === null || localStorage.getItem(storagekey) === 'undefined' || JSON.parse(localStorage[storagekey]) === null || JSON.parse(localStorage[storagekey]).length == 0) {
                var _result = GetLitDropdownData(this);
                var _result = GetLitDropdownData(this);
                if (_result != undefined) {
                    result = _result.responseJSON.data;
                }
                var istriggered = _result != undefined ? _result.responseJSON.istriggered : false;
                if (!istriggered)
                    localStorage[storagekey] = JSON.stringify(result);
            }
            else {
                result = JSON.parse(localStorage[storagekey]);
            }
            $(this).find("select").select2({ placeholder: ' ', data: result, disabled: false, allowClear: true });
            if (istriggered)
                $(this).find("select").data("isfilled", false);
            else
                $(this).find("select").data("isfilled", true);
        }
        $(this).find("select").select2("open");
    });
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

});

$(window).bind('beforeunload', function () {

    $("input[id *= 'datetimepicker1']").each(function () {
        $("input[id *= 'datetimepicker1']").datetimepicker("destroy");
    });
});

function setDatetimePicker(did, startDate, endDate, format) {
    if (~format.toUpperCase().indexOf("H")) {
        var dateNow = new Date();
        $('input[data-did=' + did + ']').datetimepicker({
            defaultDate: moment(dateNow).hours(0).minutes(0).seconds(0).milliseconds(0),
            locale: langMinStringVar,
            format: format,
            startDate: startDate,
            endDate: endDate,
            language: langMinStringVar,
            weekStart: 1,
            pickerPosition: getDatePickerPosition('taskform', did)
        }).on('changeDate', function (e) {
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
            $(this).datetimepicker('hide');
        });
    }
}
function htmlEntities(str) {
    return String(str).replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"');
}
$(function () {
    $('#ust_surecler a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    });

    $('select.form-select-element').on("change", function () {
        var name = $(this).attr('name');
        var selectedText = $(this).find("option:selected").text();
        var targetInput = $("input[name='" + name + "_Text']");
        $(targetInput).val($.trim(selectedText));
    });

    $('.editRow').click(function () {

        //Hide all edit buttons

        $('.editRow').addClass('hidden');
        if ($(this).prev().prev().find("div.lit-wrapper").length > 0) {
            EnableInputs();
        }

        $root = $(this).parents('.controls');
        $inputElm = $root.find('.dataInput');
        $dataElm = $root.find('.data');
        if ($inputElm.hasClass('hidden')) {
            $inputElm.removeClass('hidden');
            $dataElm.addClass('hidden');
            $inputElm.find("textarea").removeAttr("disabled");
            $inputElm.find("input").removeAttr("disabled");
            $inputElm.find("select").removeAttr("disabled");
        }


    });

    $(".submitRowData").click(function () {

        $btn = $(this);
        if (!$btn.hasClass('disabled')) {
            $btn.prepend('<span class="icon-refresh icon-spin"></span> ');
            $btn.addClass('disabled');

            $rootElm = $btn.parents('.dataInput');

            var name = "";
            if ($rootElm.parent().find("div.lit-wrapper").length > 0) {

                name = $rootElm.parent().find("div.lit-wrapper").attr("name");
            }
            else if ($rootElm.find("input").attr('type') == 'file') {
                name = $rootElm.find('div').attr('name');
            }
            else {
                name = $rootElm.find('input,textarea,select').attr('name');
            }

            var DID = "";
            if ($btn.prev().attr('data-did') === undefined) {
                if ($btn.closest("div").prev().find("div.lit-wrapper .litheadbarwrap-searchdetail").length > 0) {
                    DID = $btn.closest("div").prev().find("div.lit-wrapper .litheadbarwrap-searchdetail").attr("DID");
                    var isValid = CheckRequired(DID);
                    if (!isValid) {
                        $btn.removeClass("disabled");
                        return;
                    }
                }
                else if ($btn.prev().parent().find("input,select,textarea") !== undefined) {
                    DID = $btn.prev().parent().find("input,select,textarea").attr('data-did');
                }
                else if ($btn.prev().find("input,textarea,select").attr('data-did') === undefined) {
                    if ($btn.prev().prev().find("input,textarea,select") === undefined) {
                        DID = $btn.prev().prev().prev().attr("data-did");
                    }
                    else {
                        DID = $btn.prev().prev().find("input,textarea,select").attr('data-did');
                    }
                }
                else {
                    DID = $btn.prev().find("input,textarea,select").attr('data-did');
                }
            }
            else {
                DID = $btn.prev().attr('data-did');
            }
            if (($btn.prev().prop("tagName") == "SPAN")) {
                if (DID === undefined) {
                    DID = $btn.prev().find("input[data-role=datetimepicker],input[data-role=datepicker],input[data-role=timepicker]").attr('data-did');
                }
            }
            $('input[name="editName"]').val(name);
            $('input[name="DID"]').val(DID)
            $("#taskform").find("input").each(function () {
                var elementName = ($("#taskform").find("input").attr("name"));
                if (elementName == "__RequestVerificationToken" || elementName == "DID" || elementName == "CIID" || elementName == "editName") {
                    $(this).removeAttr("disabled");
                }
            });

            if ($btn.closest("div").prev().find("div.lit-wrapper .litheadbarwrap-searchdetail").length > 0) {
                var tableData = GetAllDataForSave(false);
                var CIID = $('input[name="CIID"]').val();
                $.ajax({
                    type: "POST",
                    url: "/NewLineItemTable/SaveNewLineItemTable",
                    data: { "lineItemData": tableData, "CIID": CIID, "TIID": 0, "buttonId": 0 },
                    dataType: 'json'
                }).success(function (data) {
                    if (data.result == 1) {
                        //Set back to visible all edit buttons
                        if ($('.editRow').hasClass('hidden')) {
                            $('.editRow').removeClass('hidden');

                        }

                        $rootElm.addClass('hidden');
                        $btn.parents('.controls').find('.data').text(data.value).removeClass('hidden');
                        $btn.parents('.controls').find('.editRow').removeClass('hidden');
                        DisablePreviewModeInputs(DID);
                    }
                    else {
                        if ($rootElm.parent().find('span.error').length > 0) {
                            $rootElm.parent().find('span.error').remove();
                        }

                        $rootElm.after('<span class="help-inline error">' + data.errorMsg + '</span>');

                    }
                    $btn.find('span').remove();
                    $btn.removeClass('disabled');
                }).error(function (data) {
                    $btn.find('span').remove();
                    $btn.removeClass('disabled');
                });
            }
            else {
                $.ajax({
                    type: "POST",
                    url: "/Search/Edit/",
                    data: $('#taskform').serializeObject(),
                    dataType: 'json'
                }).success(function (data) {
                    if (data.result == 1) {
                        //Set back to visible all edit buttons
                        if ($('.editRow').hasClass('hidden')) {
                            $('.editRow').removeClass('hidden');
                        }
                        $rootElm.addClass('hidden');
                        if (data.type == "6") {
                            if ($btn.parents('.controls').find(".kt-timeline-v2").length > 0) {
                                var newLog = "<div class='kt-timeline-v2__item'><span class='kt-timeline-v2__item-time'></span ><div class='kt-timeline-v2__item-cricle' ><i class='fa fa-genderless kt-font-brand' ></i></div ><div class='kt-timeline-v2__item-text kt-padding-top-5' > " + data.Zaman + '-' + data.Kaydeden + " <br> <p style='font-weight: 500 !important;white-space: pre-line;'>" + data.value + "</p></div ></div > ";
                                $btn.parents('.controls').find(".kt-timeline-v2").find("#LogItems").append(newLog);
                            }
                            else {
                                var newLog = "<div class='kt-timeline-v2' style='margin-left: -60px;'> <div class='kt-timeline-v2__items  kt-padding-top-25 kt-padding-bottom-30' id='LogItems'><div class='kt-timeline-v2__item'><span class='kt-timeline-v2__item-time'></span ><div class='kt-timeline-v2__item-cricle' ><i class='fa fa-genderless kt-font-brand' ></i></div ><div class='kt-timeline-v2__item-text kt-padding-top-5' > " + data.Zaman + '-' + data.Kaydeden + " <br> <p style='font-weight: 500 !important;white-space: pre-line;'>" + data.value + "</p></div ></div>";
                                $btn.parents('.controls').find('.data').append(newLog);
                                $btn.parents('.controls').find('.dataInput').prepend(newLog);

                            }
                        }
                        else if (data.type == "4") {
                            var newDocElem = "";
                            if ($btn.parents('.controls').find(".data .document-showcase").length > 0) {
                                $btn.parents('.controls').find(".data .document-showcase").remove();
                            }
                            newDocElem += "<div class='document-showcase' id='" + data.Name + "-showcase'><i class='icon-file'></i><span class='filename'>" + data.datafilename + "</span>";

                            if (data.datamimetype == "application/pdf" || (data.datamimetype.Length > 5 ? data.datamimetype.Substring(0, 5) == "image" : false)) {
                                newDocElem += "<a target='_blank' href='/Task/ShowDocument?DOC=" + data.documenturl + "&TYPE=V' class='btn btn-small'><i class='icon-picture'></i>" + data.View + "</a>";

                            }
                            newDocElem += "<a href='/Task/ShowDocument?DOC=" + data.documenturl + "&TYPE=D' class='btn btn-small'><i class='icon-download-alt'></i>" + data.Download + "</a>";
                            newDocElem += "<a href='#' class='btn btn-small fileDel tdDocumentDel' datadid='" + data.DID + "' dataciid='" + data.CIID + "' dataapp='" + data.Name + "-showcase'>"
                                + "<i class='icon-trash'></i>" + data.Delete + "</a>"
                                + "</div><div class='clearfix'></div>";
                            $btn.parents('.controls').find('.data').append(newDocElem);

                            //Document elementi silme işlemini gerçekleştiremiyordu , düzeltildi. 
                            $btn.parents('.controls').find('.data').on('click', '.fileDel', function (e) {
                                e.preventDefault();
                                fileDelete($(this));
                            });
                        }
                        else {
                            $btn.parents('.controls').find('.data').text(data.value).removeClass('hidden');

                        }
                        $btn.parents('.controls').find('.data').removeClass('hidden');
                        $btn.parents('.controls').find('.editRow').removeClass('hidden');
                        if ($btn.parents('.controls').find("span.help-inline.error").length > 0) {
                            $btn.parents('.controls').find("span.help-inline.error").remove();
                        }
                    }
                    else {
                        if ($rootElm.parent().find('span.error').length > 0) {
                            $rootElm.parent().find('span.error').remove();
                        }

                        $rootElm.after('<span class="help-inline error">' + data.errorMsg + '</span>');
                    }
                    $btn.find('span').remove();
                    $btn.removeClass('disabled');
                }).error(function (data) {
                    $btn.find('span').remove();
                    $btn.removeClass('disabled');
                });
            }
        }
    });

    var search = 0;
    var limitPerPage = 20;
    var currentPage = 1;
    var initiliazeCount = 0;
    var allTableDidIds = [];
    function getDecimalSeparator(locale) {
        const numberWithDecimalSeparator = 1.1;
        return Intl.NumberFormat(locale)
            .formatToParts(numberWithDecimalSeparator)
            .find(part => part.type === 'decimal')
            .value;
    }
    function getNumberGroupSeparator(locale) {
        const numberWithDecimalSeparator = 1000.1;
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
        if (~EFlang.Currency.indexOf("EGP")) {
            nmbr = nmbr.replace("ج.م.‏", "");
            nmbr = "\u202A" + nmbr + "\u202A" + "ج.م.";
        }
        return nmbr;
    }


    $(document).on('focusout', '.numeric, .numericdata', function (e) {

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

    $('.datetime[rd="False"]').each(function () {
        var maxDateAttr = parseInt($(this).attr("max-date"));
        var minDateAttr = parseInt($(this).attr("min-date"));

        if (maxDateAttr > 0)
            var maxDate = new Date(maxDateAttr * 60 * 1000);

        if (minDateAttr > 0)
            var minDate = new Date(minDateAttr * 60 * 1000);

        var dateFormat = $(this).attr('date-format');

        $dateItem = $(this);

        var datepickerConf = {
            culture: currentCulture,
            min: minDate ? new Date(minDate) : new Date(1000, 1, 1),
            max: maxDate ? new Date(maxDate) : new Date(3000, 1, 1),
            animation: false
        };

        if (dateFormat == 'long') {
            $(this).kendoDateTimePicker(datepickerConf);
        } else if (dateFormat == 'short') {
            $(this).kendoTimePicker();
        } else {
            $(this).kendoDatePicker(datepickerConf);
        }

        $(this).parent().width(150);
    });

    $(document).on('focusout', '.numericdata', function (e) {
        var nmbr = $(this).val();

        if ($(this).val() != "") {
            $(this).attr('data-val', $(this).val());

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

});

function CheckRequired(t) {
    var selectLastId = 0;
    var newRowNumber;
    var ciid = $('#netoloji-grid-' + t).data("ciid");
    var rowCount = parseInt($("#pagination-" + t + "").attr("rowcount"));

    if ($("#searchbar-" + t).val() != "") {

        var formData = new FormData();
        formData.append("Info", $("#tempInfo-" + t).html());

        $.ajax({
            type: "POST",
            url: "/NewLineItemTable/GetTempInfoTotalRowCount/",
            data: formData,
            dataType: 'json',
            async: false,
            contentType: false,
            processData: false,
            success: function (response) {
                newRowNumber = parseInt(response.rowCount) + 1;
            }
        });
    }
    else {
        var storageName = "rownumstorage-" + ciid + t;
        if (localStorage.getItem(storageName) === null) {
            newRowNumber = rowCount + 1;
            localStorage.setItem(storageName, newRowNumber);
        }
        else {
            var retrievedObject = localStorage.getItem(storageName);
            newRowNumber = parseInt(retrievedObject) + 1;
            localStorage.setItem(storageName, newRowNumber);
        }
    }

    $('#netoloji-grid-' + t).parents("div.gridLeftRightPadding").removeClass("notvalid");
    $('#netoloji-grid-' + t).parent().parents(".control-group").removeClass("error");
    $("table[data-did=" + t + "]").removeClass("invalid-table");
    $("table[data-did=" + t + "]").removeClass('igr');
    var html = $('#temp-' + t).html().replace("row-number", "row-number='" + newRowNumber + "'");
    var isvalid = true;
    $("#pagination-" + t + "").attr("rowcount");
    $('#netoloji-grid-' + t + ' tbody tr td input, #netoloji-grid-' + t + ' tbody tr td select').each(function () {
        var attr = $(this).attr('required');
        if (typeof attr !== typeof undefined && attr !== false) {
            if (isEmpty($(this).val())) {
                $('#netoloji-grid-' + t).addClass("invalid-table");
                if ($(this).attr('type') === "file") {
                    if (isEmpty($(this).get(0).title)) {
                        $(this).parent("div").addClass("invalids");
                        isvalid = false;
                    }
                } else {
                    $(this).addClass("invalids");
                    isvalid = false;
                }
            }
        }
    });

    $('#netoloji-grid-' + t + ' tbody tr td textarea').each(function () {
        var attr = $(this).attr('required');
        if (typeof attr !== typeof undefined && attr !== false) {
            if (isEmpty($(this).val())) {
                $(this).addClass("invalids");
                isvalid = false;
            }
        }
    });

    $('#netoloji-grid-' + t + ' tbody tr td .lit-checkbox').each(function () {
        var attr = $(this).attr('required');
        if (typeof attr !== typeof undefined && attr !== false) {
            if ($(this).is(":checked") == false) {
                $(this).addClass("invalids");
                isvalid = false;
            }
        }
    });

    return isvalid;
}

function SetUploaders() {
    $('.file-uploader').each(function (i, v) {
        var Allextensions = $(v).data("extensions");
        var extensions = $(v).data("extensions") == "" ? [] : $(v).data("extensions").split("|");
        $(v).fineUploader({
            debug: true,
            request: {
                endpoint: "/task/uploadfile",
                inputName: 'upload',
                params: { Allextensions },
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
                sizeLimit: $(v).data("datasize") * 1024 * 1024,
                allowedExtensions: extensions,
            },
        }).on('cancel', function (id, filename) {

            $(".TaskAction").prop('disabled', false);
            $(".ListFormButton").prop('disabled', false);
            var canceledId = id.target.id;
            var _fileName = $("#" + canceledId).attr("filename");
            var _realFilename = $("#" + canceledId).attr("realfilename");
            var _didFileName = $("#" + canceledId).attr("data-did");
            var _ciidFileName = $("#" + canceledId).attr("data-ciid");

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
                    }
                });
            }
        }).on('complete', function (event, id, filename, responseJSON) {
            var result = jQuery.parseJSON(JSON.stringify(responseJSON));
            $(this).closest(".control-group").removeClass("error");
            $(this).find('.qq-uploader .error').remove();
            $(this).find('.qq-upload-status-text').html("-" + result.message);
            $(this).find('.qq-progress-bar-wrap').hide();
            $(this).attr("filename", result.filename);
            $(this).attr("realfilename", filename.trim());
            $(this).find(".qq-upload-cancel").css("display", "inline");
            $("div[class='qq-upload-drop-area']").prop("style", "display:none");
            $(".TaskAction").prop('disabled', false);
            $(".ListFormButton").prop('disabled', false);
        })
            .on('progress', function (event, id, filename, responseJSON) {
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
            sizeLimit: 1024 * 1024 * 1024
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
function SetSelectors() {
    $('.popupselecttext').attr("readonly", true);
    $('.popupselector').on('click', function (e) {
        $(this).html('<span class="icon-refresh icon-spin"></span>');
        $("#myModalLabel").html($(this).attr('data-displayname'));
        var DID = $(this).data('did');
        var OrderedColumn = "";
        var OrderDir = "";
        var Condition = "";
        var Con = $(this).attr("Con");
        if (Con === undefined || typeof (con) == "undefined") {
            Con = "";
        }
        var element = $(this);
        $('.popupselectbox').attr('data-targetinput', element.attr('data-targetinput'));
        $('.popupselectbox').attr('data-targetdid', DID);
        $('.popupselectbox').attr('Con', Con);
        var CIID = $('input[name="CIID"]').val();
        GetSelectorValues(CIID, DID, OrderedColumn, OrderDir, Condition, 1, true, Con);

    });

    var dataddq;
    var _gridIndex;
    var _rowIndex;
    var _did;
    var ua = navigator.userAgent.toLowerCase();
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
        var CIID = $('input[name="CIID"]').val();
        GetSelectorValuesCol(CIID, DDQ, lns, OrderedColumn, OrderDir, Condition, 1, true, index, _did, currentRowIndex, columnField);
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
function GetSelectorValues(CIID, DID, OrderedColumn, OrderDir, Condition, PageNum, IsNew, Con) {
    $.ajax({
        url: "/Search/GetDataList",
        type: "GET",
        data: { "CIID": CIID, "DID": DID, "OrderedColumn": OrderedColumn, "OrderDir": OrderDir, "Condition": Condition, "PageSize": SelectorListSize, "PageNum": PageNum, "Con": Con },
        success: function (d) {
            var data = jQuery.parseJSON(JSON.stringify(d));
            $('.popupselectbox').attr('data-current', PageNum);
            WriteSelectorListMetronic(data, $('.popupselector'), PageNum, IsNew);
            hideLoading();
        },
        cache: false
    });
}

function GetDataPopup(CIID, DID, DDQ, Condition, tableIndex, currentRowIndex, name, columnField, rowIndex, type, format, readonly, _showValCol) {

    var name = $(".grid[did=" + DID + "]").attr("name");

    $.ajax({
        url: "/Search/GetDataValue",
        type: "POST",
        data: {
            "CIID": CIID,
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
            var CIID = $('input[name="CIID"]').val();

            if (DID != "") {
                GetSelectorValues(CIID, DID, OrderedColumn, OrderDir, Condition, targetPage, false, Con);
            }
            else {
                var dataEl = $('.popupselectbox').attr('data-targetinput');

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
function GetSelectorValuesCol(CIID, DDQ, LINES, OrderedColumn, OrderDir, Condition, PageNum, IsNew, tableIndex, DID, currentRowIndex, column) {

    var name = $(".grid[did=" + DID + "]").attr("name");

    $.ajax({
        url: "/Search/GetDataListCol",
        type: "POST",
        data: {
            "CIID": CIID,
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
function validatePops() {
    $('.popupselecttext').each(function (item) {

        if ($(this).attr("data-itemval") != "") {
            $(this).attr("data-rule-required", "false");
        }
    });
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
function EnableInputs() {
    $('table[id^="netoloji-grid-"] td input, table[id^="netoloji-grid-"] td .select2-selection--single, table[id^="netoloji-grid-"] td textarea,table[id^="netoloji-grid-"] td[type="document"] ').each(function () {
        $(this).css('background-color', '');
    });

    $(".newTableContainer > table > tbody > tr > td > input,select,textarea").removeAttr("disabled")
    $(".newTableContainer .popup-control").removeAttr("disabled")
    $(".newTableContainer .pps-clear").show();
    $("div.inputWrapper.kt-uppy__input-label").show();
    $(".newTableContainer .lit-checkbox").removeAttr("disabled")
    $(".newTableContainer .select2-selection--single").css("pointer-events", 'auto');
    $(".newTableContainer td a[file-data]").css("pointer-events", 'auto');
    $(".newTableContainer table td[type=CheckBox] .kt-checkbox.kt-checkbox--brand > span").css("border", "1px solid #d1d7e2");
    $(".btn-newitem").show();
    $(".gridLeftRightPadding .kt-inbox__search").show();
    $(".gridLeftRightPadding").removeClass("grid-focus-border");
    $(".border-effect").find("thead").css("pointer-events", 'auto');
    $(".newTableContainer").find("thead").css("pointer-events", 'auto');
    $(".newTableContainer > table > tbody > tr > td.noborder.noborder").css("pointer-events", 'auto');
    $(".border-effect").find("tbody td").each(function () {
        if ($(this).attr("type") != "Document") {
            $(this).css("pointer-events", 'auto');
        }
    });
    $("div.lit-wrapper").find("div.input-group-popup-append").each(function () {
        $(this).find("button.btn.btn-secondary").removeAttr("disabled");
    });

    $("div.lit-wrapper").find("tr").each(function () {
        $(this).find("textarea,input,label,select").removeAttr("disabled");
    });

    $('td[type="document"]').each(function () {
        var input = $(this).find('input.fileInput');
        if (input.attr('value') !== '') {
            $(input).closest('div').hide();
        }
    });

    $("div.lit-wrapper .litheadbarwrap-searchdetail").css("display", "");

}
function DisablePreviewModeInputs(did) {

    $('table[id^="netoloji-grid-"] td input, table[id^="netoloji-grid-"] td .select2-selection--single, table[id^="netoloji-grid-"] td textarea,table[id^="netoloji-grid-"] td[type="document"] ').each(function () {
        $(this).attr('style', $(this).attr('style') + " ; background-color: rgba(247,248,250,0.5) !important;");
    });

    $(".newTableContainer > table > tbody > tr > td > input,select,textarea").prop("disabled", true)
    $(".newTableContainer .popup-control").prop("disabled", true);
    $(".newTableContainer .pps-clear").hide();
    $("div.inputWrapper.kt-uppy__input-label").hide();
    $(".newTableContainer .lit-checkbox").prop("disabled", true)
    $(".newTableContainer .select2-selection--single").css("pointer-events", 'none');
    $(".newTableContainer td a[file-data]").css("pointer-events", 'none');
    $(".newTableContainer table td[type=CheckBox] .kt-checkbox.kt-checkbox--brand > span").css("border", "1px solid #d1d7e2");
    $(".btn-newitem").hide();
    $(".gridLeftRightPadding .kt-inbox__search").hide();
    $(".gridLeftRightPadding").removeClass("grid-focus-border");
    $(".border-effect").find("thead").css("pointer-events", 'none');
    $(".newTableContainer").find("thead").css("pointer-events", 'unset');
    $(".newTableContainer > table > tbody > tr > td.noborder.noborder").css("pointer-events", "none");
    $("#SelectedProcessOrderID").removeAttr("disabled");
    if (typeof(did) != undefined && did != undefined) {
        $(document).off("mouseover", "#netoloji-grid-" + did + " tr");
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
                    $('#pps-table-filter').append('<td><div class="kt-input-icon kt-input-icon--right kt-subheader__search"><input class="form-control filterInputbg" data-coli="' + k + '" type="text" value="' + txtSearch + '"/><span class="kt-input-icon__icon kt-input-icon__icon--right"><span><i style="color:#22b9ff" class="flaticon2-search-1"></i></span></span></div></td>');
                } else {
                    $('#pps-table-filter').append('<td><div class="kt-input-icon kt-input-icon--right kt-subheader__search"><input class="form-control filterInputbg" data-coli="' + k + '" type="text"/><span class="kt-input-icon__icon kt-input-icon__icon--right"><span><i style="color:#22b9ff" class="flaticon2-search-1"></i></span></span></div></td>');
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
}
$(".fileDel").click(function () {
    fileDelete($(this));
});
function fileDelete(el) {
    var con = confirm(ConfirmFileDelete);
    if (con) {
        var did = el.attr("datadid");
        var ciid = el.attr("dataciid");
        var target = el.attr("dataapp");
        $.ajax({
            url: "/Search/DeleteFile",
            data: { did: did, ciid: ciid },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (data) {
                if (data) {
                    $("#" + target).parent().find("#doc.file-uploader").attr("filename", "");
                    $("#" + target).parent().find("#doc.file-uploader").attr("realfilename", "");
                    $("#" + target).next(".clearfix").css("display", "none");
                    $("#" + target).css("display", "none");
                    $("#" + target).prev("input:hidden").val("");
                }
            }
        });
    }
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
                    if (invalid) {
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
                    if (invalid) {
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
            if (invalid) {
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
            if (invalid) {
                if (Checkme(this) !== true || isEmpty($(this).val())) {
                    devamet = false;
                }
            }
        });
    }
    return retValue;
}

function isEmpty(value) {
    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}
function isEmptyDrop(value, type) {
    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null || (type === "SELECT" && value === "-1");
}

function NumericInput(evt) {
    var culture = langMinStringVar;
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
function convertToBool(val) {
    return (val + '').toLowerCase() == 'true' ? true : false;
}
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();

    $.each(a, function () {
        var thisval = "";
        if ($("input[name='" + this.name + "']").hasClass('datetime')) {

            if ($("input[name='" + this.name + "']").val() != "") {

                thisval = $("input[name='" + this.name + "']").val();
            }
            else {
                thisval = "";
            }
        }
        else if ($("input[name='" + this.name + "']").hasClass("numeric")) {
            thisval = $("input[name='" + this.name + "']").val();
        }

        else if ($("input[name='" + this.name + "']").hasClass("popupselecttext")) {
            thisval = $("input[name='" + this.name + "']").attr("data-itemval") + "[and]" + $("input[name='" + this.name + "']").val();
        }
        else if ($("textarea[name='" + this.name + "']").attr("type") == "memo") {
            thisval = $('<div/>').text(this.value).html();
        }
        else {
            thisval = this.value;
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
    $('#' + $(this).attr('id') + ' .file-uploader').each(function () {
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

    $('#' + $(this).attr('id') + ' .gridelement').each(function () {
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