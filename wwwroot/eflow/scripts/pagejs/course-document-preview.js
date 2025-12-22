var fileTypes = { Folder: 0, Txt: 1, Doc: 2, Docx: 3, Odt: 4, Pdf: 5, Rtf: 6, Tex: 7, Wks: 8, Wps: 9, Wpd: 10, Ods: 11, Xlr: 12, Xls: 13, Xlsx: 14, Key: 15, Odp: 16, Pps: 17, Ppt: 18, Pptx: 19, Accdb: 20, Ai: 21, Bmp: 22, Gif: 23, Ico: 24, Jpeg: 25, Jpg: 26, Png: 27, Ps: 28, Psd: 29, Svg: 30, Tif: 31, Tiff: 32, Aif: 33, Cda: 34, Mid: 35, Midi: 36, Mp3: 37, Mpa: 38, Ogg: 39, Wav: 40, Wma: 41, Wpl: 42, _7z: 43, Arj: 44, Deb: 45, Pkg: 46, Rar: 47, Rpm: 48, TarGz: 49, Z: 50, Zip: 51, Bin: 52, Dmg: 53, Iso: 54, Toast: 55, Vcd: 56, Csv: 57, Dat: 58, Db: 59, Dbf: 60, Log: 61, Mdb: 62, Sav: 63, Sql: 64, Tar: 65, Xml: 66, Apk: 67, Bat: 68, Cgi: 69, Pl: 70, Com: 71, Exe: 72, Gadget: 73, Jar: 74, Py: 75, Wsf: 76, Fnt: 77, Fon: 78, Otf: 79, Ttf: 80, Asp: 81, Aspx: 82, Cer: 83, Cfm: 84, Css: 85, Htm: 86, Html: 87, Js: 88, Jsp: 89, Part: 90, Php: 91, Rss: 92, Xhtml: 93, C: 94, Class: 95, Cpp: 96, Cs: 97, H: 98, Java: 99, Sh: 100, Swift: 101, Vb: 102, Bak: 103, Cab: 104, Cfg: 105, Cpl: 106, Cur: 107, Dll: 108, Dmp: 109, Drv: 110, Icns: 111, Ini: 112, Lnk: 113, Msi: 114, Sys: 115, Tmp: 116, _3g2: 117, _3gp: 118, Flv: 119, H264: 120, M4v: 121, Mkv: 122, Mov: 123, Mp4: 124, Mpg: 125, Mpeg: 126, Rm: 127, Swf: 128, Vob: 129, Wmv: 130, OctetStrean: 131, Other: 132 };

var modalBodyLoadingIframe = `<div id="iframe-loading-spinner" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);text-align: center;z-index: 10;">
                                   <span class="spinner-border" role="status" aria-hidden="true"></span>
                                   <span style="margin-left:10px;">${EFlang.waitingForResponseText}</span>
                                </div>`;


const allowedExtensions = new Set([".pdf", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".bmp", ".doc", ".docx", ".xls", ".xlsx", ".csv", ".txt"]);

function isPreviewable(filename) {
    if (typeof filename !== "string") return false;

    const extMatch = filename.match(/\.[^\.]+$/);
    const ext = extMatch ? extMatch[0].toLowerCase() : "";

    return ext && allowedExtensions.has(ext);
}

function listPreviewDocument(el, event) {
    event.stopPropagation();
    coursePreviewDocument(el, event);
}

function coursePreviewDocument(element, event) {

    const ciid = element.getAttribute("data-ciid");
    const did = element.getAttribute("data-did");
    const row = element.getAttribute("data-row");
    const col = element.getAttribute("data-col");
    const ctrlPressed = event.ctrlKey || event.metaKey;
    const docInfoEndPointUrl = window.location.origin + "/Task/GetCourseDocumentInfo"
    $.ajax({
        type: 'GET',
        dataType: 'json',
        cache: false,
        async: true,
        url: docInfoEndPointUrl,
        data: { 'ciid': ciid, 'did': did, 'row': row, 'col': col },
        success: function (result) {
            if (result.IsSuccess == true) {
                openCoursePreviewDocument(ciid, did, row, col, result.Cid, result.FileName, result.FileType, result.Length, ctrlPressed);
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
function openCoursePreviewDocument(ciid, did, row, col, cid, fileName, fileType, length, ctrlPressed) {
    var _iframe = "";
    var docTypeUrl = "";
    $('#course_document_modal_preview_modalbody').empty();
    if (!ctrlPressed) {
        $('#course_document_modal_preview').modal({ backdrop: false, show: true, draggable: false });
        lockPreviewScroll();
    }
    $('#course_document_modal_preview_title').html(fileName + " - (" + EFlang.Preview + ")");
    $('#course_document_modal_preview_modalbody').html(modalBodyLoadingIframe);
    var docId = `${ciid}-${did}`;
    if (row != -1) {
        docId = docId + `_${row}_${col}`
    }
    var iframeDom = null;
    if (fileType == fileTypes.Doc || fileType == fileTypes.Docx || fileType == fileTypes.Xls || fileType == fileTypes.Xlsx || fileType == fileTypes.Csv) {
        if (length != null && length > 0) {
            if (fileType == fileTypes.Xls || fileType == fileTypes.Xlsx || fileType == fileTypes.Csv) {
                iframeDom = document.createElement('iframe');
                iframeDom.src = `/Features/DocumentManagement?folderid=0&id=${docId}&version=0&ReadOnly=true`;
            } else {
                iframeDom = document.createElement('iframe');
                iframeDom.src = `/DocumentManagement/LoadAndSave?folderid=0&id=${docId}&version=0&ReadOnly=true`;
            }
        }
        else {
            _iframe = '<div class="col-md-12" style=" text-align: center; vertical-align: middle; position: relative; top: 40%; font-size: medium; font-weight: 400;">' + EFlang.UnableToPreviewFile + '</div>';
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
            _iframe = '<div class="col-md-12" style=" text-align: center; vertical-align: middle; position: relative; top: 40%; font-size: medium; font-weight: 400;">' + EFlang.UnableToPreviewFile + '</div>';
        }
    }

    if (iframeDom != null) {
        iframeDom.id = 'course-document-iframe';
        iframeDom.style.border = '0';
        iframeDom.style.width = '100%';
        iframeDom.style.height = '100%';
        iframeDom.setAttribute('scrolling', 'yes');
        iframeDom.onload = removeIframeLoading;
        if (!ctrlPressed)
            $('#course_document_modal_preview_modalbody').append(iframeDom);
    }

    if (_iframe != "") {
        setCourseIframeToPreview(_iframe);
    }

    if (docTypeUrl != "") {
        var _blankSrc = null;
        $.ajax({
            type: "POST", url: "/Task/" + docTypeUrl, dataType: "json",
            data: { 'documentid': docId, 'version': 0 },
            success: function (result) {
                if (result && result != "") {
                    if (docTypeUrl == "PreviewDocument") {
                        var iframe_url = result.toLowerCase().indexOf("preview.ashx") >= 0 ? result : "/Task/preview_pdf?file=" + result + "&Dwnl=true&id=" + docId + "&ver=0";
                        if (ctrlPressed) {
                            _blankSrc = window.location.origin + iframe_url;
                        } else {                            
                            $('#course_document_modal_preview_modalbody').append(iframeDom);
                            iframeDom.src = iframe_url;
                        }
                    }
                    else if (docTypeUrl == "GetTextValue") {
                        if (ctrlPressed) {
                            const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
                            _blankSrc = URL.createObjectURL(blob);
                        } else {
                            result = $('<textarea style="resize:none;">').html(result).text();
                            _iframe = '<textarea style="resize:none;border:none;padding:10px;width:100%;height:100%;overflow:auto;" disabled="" id="prwText">' + result + '</textarea>';
                            setCourseIframeToPreview(_iframe);
                        }
                    }
                    else if (docTypeUrl == "GetImageValue") {
                        if (ctrlPressed) {
                            _blankSrc = result;
                        } else {
                            _iframe = '<img draggable="false" style="display: block;margin-left: auto;margin-right: auto;width: auto;max-width: 100%; height:100%;" src="' + result + '"/>';
                            setCourseIframeToPreview(_iframe);
                        }
                    }
                }
                else {
                    if (!ctrlPressed) {
                        _iframe = '<div class="col-md-12" style=" text-align: center; vertical-align: middle; position: relative; top: 40%; font-size: medium; font-weight: 400;">' + EFlang.UnableToPreviewFile + '</div>';
                        setCourseIframeToPreview(_iframe);
                    }
                }
            },
            error: function (ex) {
                if (!ctrlPressed) {
                    _iframe = '<div class="col-md-12" style=" text-align: center; vertical-align: middle; position: relative; top: 40%; font-size: medium; font-weight: 400;">' + EFlang.UnableToPreviewFile + '</div>';
                    setCourseIframeToPreview(_iframe);
                }
            }
        }).then(function () {
            if (_blankSrc != null) {
                window.open(_blankSrc.replace(" ", "%20"), '_blank', 'noopener,noreferrer');
            }
        });
    }
    else if (ctrlPressed && iframeDom != null) {
        window.open(iframeDom.src.replace(" ", "%20"), '_blank', 'noopener,noreferrer');
    }
}
function setCourseIframeToPreview(iframe) { $('#course_document_modal_preview_modalbody').html(''); $('#course_document_modal_preview_modalbody').append(iframe); }
function coursePreviewModalClose(mdl) {
    $('#' + mdl).modal('hide');
    unlockPreviewScroll();
}
function removeIframeLoading() {
    const spinner = document.getElementById('iframe-loading-spinner');
    if (spinner) spinner.remove();
    $(this).fadeIn(200);
}