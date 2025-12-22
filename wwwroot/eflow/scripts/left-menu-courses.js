var processStartMsg = "";
var processName = "";
var processAID = 0;
var processTimeOut = 0;
var processCanceled = false;
var filterResult = [];

if (document.location.pathname.toLowerCase().indexOf('/dms') == -1) {
    

    $(document).ready(function () {
        $(".leftPanel").append(buildList(dataCourseItem, true, false));
        if (typeof dataListItem != 'undefined') {
            $(".leftPanel2").append(buildList(dataListItem, true));
        }
        addFavFilter();

        function buildList(data, isSub, isList) {
            var html = (isSub) ? '' : '';

            for (loopItem in data) {

                var accordion = data[loopItem].expanded ? "aria-haspopup='true' data-ktmenu-submenu-toggle='click' data-ktmenu-submenu-mode='accordion'" : "";

                var open = data[loopItem].FolderExpanded ? "kt-menu__item--open" : "";

                if (data[loopItem].items) {

                    html += '<li  class="kt-menu__item  kt-menu__item--submenu ' + open + '"' + accordion + '>';
                    if (isList) {
                        html += '<a href="javascript:;" style="margin-top: 15px!important;"  class="kt-menu__link"> </br></br> <i class="kt-menu__link-icon fa fa-folder-open"></i> <span class="kt-menu__link-text kt-menu__listLink">' + data[loopItem].text + '</span> <i class="kt-menu__ver-arrow la la-angle-right"></i></a>'
                    }
                    else {
                        html += '<a href="javascript:;" style="margin-top: 15px!important;"  class="kt-menu__link kt-menu__toggle"> </br></br> <i class="kt-menu__link-icon fa fa-folder-open"></i> <span class="kt-menu__link-text">' + data[loopItem].text + '</span> <i class="kt-menu__ver-arrow la la-angle-right"></i></a>'
                    }
                    

                    html += '<div class="kt-menu__submenu"> <span class="kt-menu__arrow"><span> <ul class="kt-menu__subnav">';

                    html += buildList(data[loopItem].items, true, isList);

                } else {

                    var processTitle = add3Dots(data[loopItem].text, 57);

                    html += '<li class="kt-menu__item"> <a  class="kt-menu__link leftMenuItem" aid="' + data[loopItem].id + '"> <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"> <span></span></i> <span aid="' + data[loopItem].id + '" class="kt-menu__link-text spnleftMenuItem">' + processTitle + '</span> </li>'

                }
                html += '</li>';
            }

            html += '</ul></div>';
            return html;
        }

        function addFavFilter() {
            $.ajax({
                url: "/Partials/GetFavFilter",
                success: function (data) {
                    var dataSource = JSON.parse("[" + data + "]");
                    processFilterHtml(dataSource);
                    return dataSource;
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false
            });
        }

        function processFilterHtml(data) {

            if (data[0].items.length > 0) {

                var filters = data[0].items;

                var html_li_items = "";

                for (i in filters) {

                    html_li_items +=
                        " <li class='kt-menu__item'> <a href='/Filter/Display?filterId=" +
                        filters[i].id +
                        "' class='kt-menu__link filterMenuItem'> <i class='kt-menu__link-bullet kt-menu__link-bullet--dot'> <span></span></i> <span class='kt-menu__link-text'> " +
                        filters[i].text +
                        " </span> </a></li> ";
                }

                var html =
                    "<ul class='kt-menu__subnav favFilterul'> <li class='kt-menu__item  kt-menu__item--submenu kt-menu__item' aria-haspopup='true' data-ktmenu-submenu-toggle='click' data-ktmenu-submenu-mode='accordion'> <a href='javascript:;' class='kt-menu__link kt-menu__toggle'> <br><br> <i style='font-size: 15px;' class='kt-menu__link-icon fa fa-filter'></i> <span class='kt-menu__link-text'> " +
                    EFlang.FavouriteFilters +
                    " </span> <i class='kt-menu__ver-arrow la la-angle-right'></i></a> <div class='kt-menu__submenu'> <span class='kt-menu__arrow'><span> <ul class='kt-menu__subnav'> " +
                    html_li_items +
                    " </ul> </span></span></div></li></ul>";

                $(".kt-menu__wrapper").append(html);

            }
        }

        document.getElementById("kt_aside_mobile_toggler_dms_right").style.display = "none";

        function getSearchResultHtml(data) {

            var html = "";

            for (i in data) {

                if (data[i].type == 'html') {

                    html +=
                        "<li class='kt-menu__item'><a href='javascript:;' class='kt-menu__link leftMenuItem resultMenuItem' aid='" +
                        data[i].id +
                        "'><i class='kt-menu__link-bullet kt-menu__link-bullet--dot'><span></span></i><span aid='" +
                        data[i].id +
                        "' class='kt-menu__link-text spnleftMenuItem'>" +
                        data[i].title + "</span></a></li>";
                }
            }

            return html;
        }

        function normalizeText(str) {
            var result = str
                .normalize("NFC") // Unicode normalize
                .toLocaleLowerCase('tr-TR')
                .replace(/ı/g, 'i')
                .replace(/İ/g, 'i');

            return result;
        }

        function filterDatasource(data, q) {
            for (var i = 0; i < data.length; i++) {

                var item = data[i];
                var text = normalizeText(item.text);
                var param = normalizeText(q);
                var itemVisible = text.includes(param);

                if (itemVisible) {

                    var model = { title: item.text, id: item.id, type: item.spriteCssClass }

                    filterResult.push(model);
                }

                if (item.items) {
                    filterDatasource(item.items, normalizeText(q))
                }
            }
        }
        $(".kt-menu__listLink").click(function () {
            location.replace("/Lists");
        });
        $("#txtLeftMenuSearch").keyup(function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13' || this.value.trim() == '') {

                if (this.value.trim() == '') {
                    $(".leftPanel").html("");
                    $(".leftPanel").append(buildList(dataCourseItem, true,false));

                }
                else {

                    $(".leftPanel").html("");
                    filterDatasource(dataCourseItem, normalizeText(this.value.trim()));
                    var result = getSearchResultHtml(filterResult);
                    $(".leftPanel").append(result);
                    filterResult = [];
                }
                $('.kt-menu__wrapper').scrollTop(0);
            }
        });
        $("#txtLeftMenuSearch2").keyup(function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13' || this.value.trim() == '') {

                if (this.value.trim() == '') {
                    $(".leftPanel2").html("");
                    $(".leftPanel2").append(buildList(dataListItem, true,true));

                }
                else {

                    $(".leftPanel2").html("");
                    var searchVal = this.value.trim().toLowerCase();
                    filterDatasource(dataListItem, searchVal);
                    var result = getSearchResultHtml(filterResult);
                    $(".leftPanel2").append(result);
                    filterResult = [];
                }
            }
        });
    });
   
    $(document).on("click", "a.leftMenuItem span", function () {
        LeftMenuClick(this);
        
    });


    

    function LeftMenuClick(obj) {
        var arr = $(obj).attr("aid").split('|');
        processAID = arr[0];
        processTimeOut = arr[1];
        processName = $(obj).text();
        if (processTimeOut === "5001") {
            location.replace("/Lists/List/" + processAID);
        } else {
            $('#start-process-modal').find('.modal-body p').text(EFlang.StartProcess.replace('{0}', processName));

            if (processAID > 0) {
                $('.StartProcessOK').show();
                $('#start-process-modal').modal("show");
            }
        }
    }


    $(document).on("click", ".StartProcessOK", function (event) {

        $('#startProcessSpinner').show();
        $('.StartProcessOK').hide();
        StartCourse(processAID, processTimeOut, processName);
        $('#btnStartProcessCanceled').show();
    });

    function StartCourse(aid, timeout, name = '') {

        $(document).off("click", 'a.leftMenuItem span');

        var lastTimeout = parseInt(timeout) + 2000;
        $.ajax({
            url: "/Partials/StartCourse",
            type: "GET",
            data: { "AID": aid, "Timeout": timeout },
            success: function (d) {
               
                var data = jQuery.parseJSON(JSON.stringify(d));

                if (data.Redirect == false) {
                    $(document).on("click", 'a.leftMenuItem span', function () {
                        LeftMenuClick(this);
                    });
                }

                if (processCanceled == true && data.CIID > 0) {

                    setTimeout(
                        function () {

                            $.ajax({
                                url: "/Search/CancelProcessAfterStart",
                                type: "GET",
                                data: { "CIID": data.CIID },
                                success: function (d) {
                                    $("#stopProcessSpinner").hide();
                                    $('#start-process-modal').modal("hide");
                                },
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                cache: false
                            });

                            processCanceled = false;
                            data.Redirect == false;
                            toastr.info(spesificProcessCanceled.replace('{0}', name));

                        }, 1000);
                }
                else if (processCanceled == false) {

                    if (data.Redirect == true) {
                        //TaskWorkClick(data.TIID,true);
                        window.location.href = '/Task/Details?Type=work&TIID=' + data.TIID;
                    }
                    $('#start-process-modal').modal("hide");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#start-process-modal').modal("hide");
                if (textStatus === "timeout") {
                    $(document).on("click", 'a.leftMenuItem span', function () {
                        LeftMenuClick(this);
                    });
                }
            },
            timeout: lastTimeout,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false
        });
       
    }

    function add3Dots(string, limit) {
        var dots = "...";
        if (string.length > limit) {
            string = string.substring(0, limit) + dots;
        }
        return string;
    }
}
else {

    $(document).ready(function () {
        document.getElementById("kt_aside_mobile_toggler_dms_right").style.display = "inline-block";
    });
}