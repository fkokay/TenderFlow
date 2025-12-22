var fileTypes = { Folder: 0, Txt: 1, Doc: 2, Docx: 3, Odt: 4, Pdf: 5, Rtf: 6, Tex: 7, Wks: 8, Wps: 9, Wpd: 10, Ods: 11, Xlr: 12, Xls: 13, Xlsx: 14, Key: 15, Odp: 16, Pps: 17, Ppt: 18, Pptx: 19, Accdb: 20, Ai: 21, Bmp: 22, Gif: 23, Ico: 24, Jpeg: 25, Jpg: 26, Png: 27, Ps: 28, Psd: 29, Svg: 30, Tif: 31, Tiff: 32, Aif: 33, Cda: 34, Mid: 35, Midi: 36, Mp3: 37, Mpa: 38, Ogg: 39, Wav: 40, Wma: 41, Wpl: 42, _7z: 43, Arj: 44, Deb: 45, Pkg: 46, Rar: 47, Rpm: 48, TarGz: 49, Z: 50, Zip: 51, Bin: 52, Dmg: 53, Iso: 54, Toast: 55, Vcd: 56, Csv: 57, Dat: 58, Db: 59, Dbf: 60, Log: 61, Mdb: 62, Sav: 63, Sql: 64, Tar: 65, Xml: 66, Apk: 67, Bat: 68, Cgi: 69, Pl: 70, Com: 71, Exe: 72, Gadget: 73, Jar: 74, Py: 75, Wsf: 76, Fnt: 77, Fon: 78, Otf: 79, Ttf: 80, Asp: 81, Aspx: 82, Cer: 83, Cfm: 84, Css: 85, Htm: 86, Html: 87, Js: 88, Jsp: 89, Part: 90, Php: 91, Rss: 92, Xhtml: 93, C: 94, Class: 95, Cpp: 96, Cs: 97, H: 98, Java: 99, Sh: 100, Swift: 101, Vb: 102, Bak: 103, Cab: 104, Cfg: 105, Cpl: 106, Cur: 107, Dll: 108, Dmp: 109, Drv: 110, Icns: 111, Ini: 112, Lnk: 113, Msi: 114, Sys: 115, Tmp: 116, _3g2: 117, _3gp: 118, Flv: 119, H264: 120, M4v: 121, Mkv: 122, Mov: 123, Mp4: 124, Mpg: 125, Mpeg: 126, Rm: 127, Swf: 128, Vob: 129, Wmv: 130, OctetStrean: 131, Other: 132 };
function previewDocument(docId, version) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        cache: false,
        async: false,
        url: '/Dms2/GetDocumentInfo',
        data: { 'docId': docId, 'version': version },
        success: function (result) {
            if (result.IsSuccess == true) {
                /* Default = 0, Ocr = 1, Form = 2 */
                if (isPreviewable(result.FileName)) {
                    if (result.FolderType == 0) {
                        openPreviewDocument(docId, version, result.FileName, result.FileType, result.Length, result.FolderId, result.IsBlockedDownload);
                    } else {
                        if (!result.IsAuth) {
                            $('#dash_modal_document_form_element_buttons').hide();
                        }
                        $('#dash_dms_form_element_document_id').val(parseInt(docId));
                        $('#dash_dms_form_element_document_version').val(parseInt(version));
                        $('#dash_dms_form_element_document_folderId').val(parseInt(result.FolderId));
                        getDocumentFormElement(docId, version, result.FileName, result.FileType, result.Length, result.FolderId, result.IsBlockedDownload);
                    }
                } 
            }
        },
        fail: function (xhr, textStatus, errorThrown) {
            console.log(xhr + "\n" + textStatus + "\n" + errorThrown);
        },
        error: function (ex) {
            console.log(ex);
        }
    });
}
function getDocumentFormElement(docId, version, fileName, fileType, length, folderId, isblockedDownload) {
    $.ajax({
        type: 'GET',
        dataType: "html",
        cache: false,
        url: "/Dms2/GetDocumentFormElement",
        data: { 'docId': docId, 'isOcr': false, 'version': version },
        success: function (data) {
            if (data.replace('\r\n', '') == '') {
                openPreviewDocument(docId, version, rfileName, fileType, length, folderId, isblockedDownload);
            } else {
                $("#dash_modal_document_form_element_list").html(data);
                getOcrItems(docId, version);
                openPreviewFormDocument(docId, version, fileName, fileType, length, folderId, isblockedDownload);
                $('#dash_modal_document_form_element').modal({ backdrop: false, show: true, draggable: false });
                lockPreviewScroll();
            }
        },
        fail: function (xhr, textStatus, errorThrown) {
            console.log(xhr + "\n" + textStatus + "\n" + errorThrown);
            openPreviewDocument(docId, version, fileName, fileType, length, folderId, isblockedDownload);
        }
    });
}
function openPreviewFormDocument(docId, version, fileName, fileType, length, folderId, isblockedDownload) {
    $('#dash_form_element_document_name').html(fileName + " - (V" + version + ")" + " - (" + EFlang.Preview + ")");
    $('#dash_dms_modal_form_element_preview').html(modalBodyLoadingIframe);
    var _iframe = "";
    var docTypeUrl = "";
    var iframeDom = null;
    if (fileType == fileTypes.Doc || fileType == fileTypes.Docx || fileType == fileTypes.Xls || fileType == fileTypes.Xlsx || fileType == fileTypes.Csv) {
        if (length != null && length > 0) {
            if (fileType == fileTypes.Xls || fileType == fileTypes.Xlsx || fileType == fileTypes.Csv) {
                iframeDom = document.createElement('iframe');
                iframeDom.src = `/Features/DocumentManagement?folderid=${folderId}&id=${docId}&version=${version}&ReadOnly=true`;
            } else {
                iframeDom = document.createElement('iframe');
                iframeDom.src = `/DocumentManagement/LoadAndSave?folderid=${folderId}&id=${docId}&version=${version}&ReadOnly=true`;
            }
        }
        else {
            _iframe = `<div class="col-md-12" style=" text-align: center; vertical-align: middle; position: relative; top: 40%; font-size: medium; font-weight: 400;">${EFlang.UnableToPreviewFile}</div>`;
        }
    }
    else {
        if (fileType == fileTypes.Bmp || fileType == fileTypes.Gif || fileType == fileTypes.Ico || fileType == fileTypes.Jpeg || fileType == fileTypes.Jpg || fileType == fileTypes.Png || fileType == fileTypes.Svg || fileType == fileTypes.Tif || fileType == fileTypes.Tiff) {
            docTypeUrl = "GetImageValue";
        }
        else if (fileType == fileTypes.Txt) { docTypeUrl = "GetTextValue"; }
        else if (fileType == fileTypes.Pdf) {
            docTypeUrl = "PreviewDocument";
            iframeDom = document.createElement('iframe');
        }
        else {
            _iframe = `<div class="col-md-12" style=" text-align: center; vertical-align: middle; position: relative; top: 40%; font-size: medium; font-weight: 400;">${EFlang.UnableToPreviewFile}</div>`;
        }
    }

    if (iframeDom != null) {
        iframeDom.id = 'course-document-iframe';
        iframeDom.style.border = '0';
        iframeDom.style.width = '100%';
        iframeDom.style.height = '100%';
        iframeDom.setAttribute('scrolling', 'yes');
        iframeDom.onload = removeIframeLoading;
        $('#dash_dms_modal_form_element_preview').append(iframeDom);
    }

    if (_iframe != "") {
        setIframeToFormPreview(_iframe);
    }
    if (docTypeUrl != "") {
        $.ajax({
            type: "POST",
            url: "/Dms2/" + docTypeUrl,
            dataType: "json",
            data: { 'documentid': docId, 'version': version },
            success: function (result) {
                if (result && result != "") {
                    if (docTypeUrl == "PreviewDocument") {
                        var iframe_url = result.toLowerCase().indexOf("preview.ashx") >= 0 ? result : `/DMS2/preview_pdf?file=${result}&Dwnl=${isblockedDownload}&id=${docId}&ver=${version}`;
                        $('#dash_dms_modal_form_element_preview').append(iframeDom);
                        iframeDom.src = iframe_url;
                    }
                    else if (docTypeUrl == "GetTextValue") {
                        result = $('<textarea style="resize:none;">').html(result).text();
                        _iframe = `<textarea style="resize:none;border:none;padding:10px;width:100%;height:100%;overflow:auto;" disabled="" id="prwText">${result}</textarea>`;
                        setIframeToFormPreview(_iframe);
                    }
                    else if (docTypeUrl == "GetImageValue") {
                        _iframe = `<img draggable="false" style="display: block;margin-left: auto;margin-right: auto;width: auto;max-width: 100%; height:100%;" src="${result}" />`;
                        setIframeToFormPreview(_iframe);
                    }
                }
                else {
                    _iframe = `<div class="col-md-12" style=" text-align: center; vertical-align: middle; position: relative; top: 40%; font-size: medium; font-weight: 400;">${EFlang.UnableToPreviewFile}</div>`;
                    setIframeToFormPreview(_iframe);
                }
            },
            error: function (ex) {
                _iframe = `<div class="col-md-12" style=" text-align: center; vertical-align: middle; position: relative; top: 40%; font-size: medium; font-weight: 400;">${EFlang.UnableToPreviewFile}</div>`;
                setIframeToFormPreview(_iframe);
            }
        });
    }
}
function getOcrItems(docId, version) {
    $.ajax({
        type: 'GET',
        dataType: "html",
        cache: false,
        url: "/Dms2/GetOcrItem",
        data: { 'docId': docId, 'version': version },
        success: function (data) {
            if (data.replace('\r\n', '') == '') {
                $("#dash_modal_document_form_element_item_list").html("");
            } else {
                $("#dash_modal_document_form_element_item_list").html(data);
            }
        },
        fail: function (xhr, textStatus, errorThrown) {
            $("#dash_modal_document_form_element_item_list").html("");
            console.log(xhr + "\n" + textStatus + "\n" + errorThrown);
        }
    });
}
function setIframeToFormPreview(iframe) { $('#dash_dms_modal_form_element_preview').append(iframe); }
function setIframeToPreview(iframe) { $('#dash_dms_modal_preview_modalbody').html(''); $('#dash_dms_modal_preview_modalbody').append(iframe); }
function setDmsDatetimePicker(did, format) {
    if ($('input[data-did=' + did + ']').hasClass("datetimepicker1")) {
        if (format.toUpperCase().indexOf("H") > -1) {
            $('input[data-did=' + did + ']').datetimepicker({
                locale: langMinStringVar,
                format: format,
                language: langMinStringVar,
                weekStart: 1,
                pickerPosition: getDmsDatePickerPosition('docDashFormElementForm', did)
            }).on('changeDate', function (e) {
                $(this).attr("data-isclicked", true);
                $(this).datetimepicker('hide');
                $(this).parent().find('span.error').remove();
            });
        }
        else {
            $('input[data-did=' + did + ']').datetimepicker({
                locale: langMinStringVar,
                language: langMinStringVar,
                format: format,
                minView: 2,
                pickTime: false,
                weekStart: 1,
                pickerPosition: getDmsDatePickerPosition('docDashFormElementForm', did)
            }).on('changeDate', function (e) {
                $(this).attr("data-isclicked", true);
                $(this).datetimepicker('hide');
                $(this).parent().find('span.error').remove();
            });
        }
    }
}
function getDmsDatePickerPosition(formName, id) {
    var pickerPositionStr = "bottom-right";
    var dateTopOffset = 0;
    var distance = 0;
    var elementTopOffset = $('input[data-did=' + id + ']').offset().top;
    var formTopOffset = $("#" + formName).offset().top;
    dateTopOffset = (elementTopOffset - formTopOffset);
    distance = 275;
    if (dateTopOffset > distance) pickerPositionStr = "top-right";
    return pickerPositionStr;
}
function openPreviewDocument(docId, version, fileName, fileType, length, folderId, isblockedDownload) {
    var _iframe = "";
    var docTypeUrl = "";
    $('#dash_dms_modal_preview_modalbody').empty();
    $('#dash_dms_modal_preview').modal({ backdrop: false, show: true, draggable: false });
    lockPreviewScroll();
    $('#dash_dms_modal_preview_title').html(fileName + " - (V" + version + ")" + " - (" + EFlang.Preview + ")");
    $('#dash_dms_modal_preview_modalbody').html(modalBodyLoadingIframe);
    var iframeDom = null;
    if (fileType == fileTypes.Doc || fileType == fileTypes.Docx || fileType == fileTypes.Xls || fileType == fileTypes.Xlsx || fileType == fileTypes.Csv) {
        if (length != null && length > 0) {
            if (fileType == fileTypes.Xls || fileType == fileTypes.Xlsx || fileType == fileTypes.Csv) {
                iframeDom = document.createElement('iframe');
                iframeDom.src = `/Features/DocumentManagement?folderid=${folderId}&id=${docId}&version=${version}&ReadOnly=true`;
            } else {
                iframeDom = document.createElement('iframe');
                iframeDom.src = `/DocumentManagement/LoadAndSave?folderid=${folderId}&id=${docId}&version=${version}&ReadOnly=true`;
            }
        }
        else {
            _iframe = `<div class="col-md-12" style="text-align: center; vertical-align: middle; position: relative; top: 40%; font-size: medium; font-weight: 400;">${EFlang.UnableToPreviewFile}</div>`;
        }
    }
    else {
        if (fileType == fileTypes.Bmp || fileType == fileTypes.Gif || fileType == fileTypes.Ico || fileType == fileTypes.Jpeg || fileType == fileTypes.Jpg || fileType == fileTypes.Png || fileType == fileTypes.Svg || fileType == fileTypes.Tif || fileType == fileTypes.Tiff) {
            docTypeUrl = "GetImageValue";
        }
        else if (fileType == fileTypes.Txt) { docTypeUrl = "GetTextValue"; }
        else if (fileType == fileTypes.Pdf) {
            docTypeUrl = "PreviewDocument";
            iframeDom = document.createElement('iframe');
        }
        else {
            _iframe = `<div class="col-md-12" style=" text-align: center; vertical-align: middle; position: relative; top: 40%; font-size: medium; font-weight: 400;">${EFlang.UnableToPreviewFile}</div>`;
        }
    }

    if (iframeDom != null) {
        iframeDom.id = 'course-document-iframe';
        iframeDom.style.border = '0';
        iframeDom.style.width = '100%';
        iframeDom.style.height = '100%';
        iframeDom.setAttribute('scrolling', 'yes');
        iframeDom.onload = removeIframeLoading;
        $('#dash_dms_modal_preview_modalbody').append(iframeDom);
    }

    if (_iframe != "") {
        setIframeToPreview(_iframe);
    }
    if (docTypeUrl != "") {
        $.ajax({
            type: "POST", url: "/Dms2/" + docTypeUrl, dataType: "json",
            data: { 'documentid': docId, 'version': version },
            success: function (result) {
                if (result && result != "") {
                    if (docTypeUrl == "PreviewDocument") {
                        var iframe_url = result.toLowerCase().indexOf("preview.ashx") >= 0 ? result : `/DMS2/preview_pdf?file=${result}&Dwnl=${isblockedDownload}&id=${docId}&ver=${version}`;
                        $('#dash_dms_modal_preview_modalbody').append(iframeDom);
                        iframeDom.src = iframe_url;
                    }
                    else if (docTypeUrl == "GetTextValue") {
                        result = $('<textarea style="resize:none;">').html(result).text();
                        _iframe = `<textarea style="resize:none;border:none;padding:10px;width:100%;height:100%;overflow:auto;" disabled="" id="prwText">${result}</textarea>`;
                        setIframeToPreview(_iframe);
                    }
                    else if (docTypeUrl == "GetImageValue") {
                        _iframe = `<img draggable="false" style="display: block;margin-left: auto;margin-right: auto;width: auto;max-width: 100%; height:100%;" src="${result}"/>`;
                        setIframeToPreview(_iframe);
                    }
                }
                else {
                    _iframe = `<div class="col-md-12" style=" text-align: center; vertical-align: middle; position: relative; top: 40%; font-size: medium; font-weight: 400;">${EFlang.UnableToPreviewFile}</div>`;
                    setIframeToPreview(_iframe);
                }
            },
            error: function (ex) {
                _iframe = `<div class="col-md-12" style=" text-align: center; vertical-align: middle; position: relative; top: 40%; font-size: medium; font-weight: 400;">${EFlang.UnableToPreviewFile}</div>`;
                setIframeToPreview(_iframe);
            }
        });
    }
}
function previewModalClose(mdl) {
    $('#' + mdl).modal('hide');
    unlockPreviewScroll();
}
function validationForm(id) {
    var isValid = true;
    $('#' + id + ' :input.form-control-solid').each(function (evt) {
        var isRequired = $(this).data("rule-required");
        var type = $(this).data("input-type");
        var val = $(this).val().trim();
        $(this).parent().find('span.error').remove();
        switch (type) {
            case 'String':
                if (isRequired) {
                    if (val == "") {
                        isValid = false;
                        $(this).parent().append('<span class="error">' + $.validator.messages.required + '</span>');
                    }
                }
                break;
            case 'Date':
                if (isRequired) {
                    if (val == "") {
                        isValid = false;
                        $(this).parent().append('<span class="error">' + $.validator.messages.required + '</span>');
                    }
                }
                break;
            case 'Numeric':
                if (isRequired) {
                    if (val == "") {
                        isValid = false;
                        $(this).parent().append('<span class="error">' + $.validator.messages.required + '</span>');
                    } else if (val.indexOf("NaN") > -1) {
                        isValid = false;
                        $(this).parent().append('<span class="error">' + $.validator.messages.digits + '</span>');
                    }
                }
                break;
        }
    });
    return isValid;
}
function saveDocumentFormElement() {
    var docId = $('#dash_dms_form_element_document_id').val();
    var isValid = validationForm('docDashFormElementForm');
    var version = $('#dash_dms_form_element_document_version').val();
    $('#btnDashSaveDocumentFormElement').attr('disabled', true);
    if (isValid) {
        var formData = $('#docDashFormElementForm').serializeDmsObject();
        $.ajax({
            type: "POST", url: "/Dms2/SaveDocumentFormElement", dataType: "json",
            data: {
                __RequestVerificationToken: getAntiForgeryToken(),
                'docId': docId,
                'data': JSON.stringify(formData),
                'version': parseInt(version)
            },
            success: function (result) {
                if (result.IsSuccess) {
                    /*İşlem başarılı ise */
                    previewModalClose('dash_modal_document_form_element');
                } else {
                    iziToast.warning({ title: 'DMS', message: result.Message });
                }
                $('#btnDashSaveDocumentFormElement').attr('disabled', false);
            },
            error: function (err) {
                console.log(err);
                $('#btnDashSaveDocumentFormElement').attr('disabled', false);
            }
        });
    } else { $('#btnDashSaveDocumentFormElement').attr('disabled', false); }
}
$.fn.serializeDmsObject = function () {
    var data = []
    var a = this.serializeArray();
    var elementForm = this;
    $.each(a, function () {
        var thisval = "";
        var type = 0;
        if ($(elementForm).find("input[name='" + this.name + "']").hasClass('datetime')) {
            thisval = $(elementForm).find("input[name='" + this.name + "']").val();
            type = 2;
        }
        else if ($(elementForm).find("input[name='" + this.name + "']").hasClass("numeric")) {
            thisval = $(elementForm).find("input[name='" + this.name + "']").val();
            var dataformat = $(elementForm).find("input[name='" + this.name + "']").data("format");

            if (~EFlang.Currency.indexOf("EGP") && dataformat.toUpperCase().substring(0, 1) == "C") {
                thisval = thisval.replace("ج.م.‏", "");
                thisval = "\u202A" + thisval + "\u202A"; //+ ".ج.م"
            }
            type = 3;
        }
        else if ($(elementForm).find("input[name='" + this.name + "']").hasClass("string")) {
            thisval = $(elementForm).find("input[name='" + this.name + "']").val();
            type = 1;
        }

        if (this.name != "__RequestVerificationToken") {
            var el = { type: type, ddid: parseInt(this.name), value: thisval };
            data.push(el);
        }
    });
    return data;
};
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
        nmbr = "\u202A" + nmbr + "\u202A" + ".ج.م";
    }
    return nmbr;
}
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