var processStartMsg = "";
var processName = "";
var processAID = 0;
var processTimeOut = 0;
var processCanceled = false;
var filterResult = [];

if (document.location.pathname.toLowerCase().indexOf('/dms') == -1) {

    $(document).ready(function () {

        $(".leftPanel").append(buildList(dataCourseItem, true));
        if (typeof dataListItem != 'undefined') {
            $(".leftPanel2").append(buildList(dataListItem, true));
        }
        addFavFilter();

        function buildList(data, isSub) {

            var html = (isSub) ? '' : '';

            for (item in data) {
                var accordion = data[item].expanded ? "aria-haspopup='true' data-ktmenu-submenu-toggle='click' data-ktmenu-submenu-mode='accordion'" : "";
                var open = data[item].FolderExpanded ? "kt-menu__item--open" : "";

                if (data[item].items) {
                    
                    html += '<li class="menu-item-level kt-menu__item  kt-menu__item--submenu ' + open + '"' + accordion + '>';

                    html += '<a href="javascript:;" style="margin-top: 15px!important;"  class="kt-menu__link kt-menu__toggle"> </br></br> <i class="kt-menu__link-icon fa fa-folder-open"></i> <span class="kt-menu__link-text">' + data[item].text + '</span> <i class="kt-menu__ver-arrow la la-angle-right"></i></a>'

                    html += '<div class="kt-menu__submenu"> <span class="kt-menu__arrow"><span> <ul class="kt-menu__subnav">';

                    html += buildList(data[item].items, true);

                } else {

                    var processTitle = add3Dots(data[item].text, 80);

                    html += '<li class="kt-menu__item"> <a  class="kt-menu__link leftMenuItem" aid="' + data[item].id + '"> <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"> <span></span></i> <span aid="' + data[item].id + '" class="kt-menu__link-text spnleftMenuItem">' + processTitle + '</span> </li>'

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

                var html_li_items = ``;

                for (i in filters) {

                    html_li_items += `<li class="kt-menu__item" aria-haspopup="true"><a href="/Filter/Display?filterId=` + filters[i].id + `" class="kt-menu__link "><i class="kt-menu__link-bullet kt-menu__link-bullet--line"><span></span></i><span class="kt-menu__link-text">` + filters[i].text + `</span></a></li>`;
                }

                var html = `<li class="kt-menu__item kt-menu__item--submenu kt-menu__item" aria-haspopup="true" data-ktmenu-submenu-toggle="hover" style="padding-right: 5%;"><a href="javascript:;" class="kt-menu__link kt-menu__toggle"><i id="aside-settingsicon" class="kt-menu__link-icon fa fa-star"></i><span class="kt-menu__link-text" style="width:20px; margin-top: 1px;">` + EFlang.FavouriteFilters + `</span><i style="padding-right: 30%;" class="kt-menu__ver-arrow la la-angle-right"></i></a><div class="kt-menu__submenu process-submenu-items" kt-hidden-height="168" style=""><span class="kt-menu__arrow"></span><ul class="kt-menu__subnav" style="margin-left: -27px">` + html_li_items + `</ul></div></li>`;

                $("#as-ktmenu-nav").append(html);

            }
        }

        document.getElementById("kt_aside_mobile_toggler_dms_right").style.display = "none";

        function getSearchResultHtml(data) {

            var html = ``;

            for (i in data) {

                if (data[i].type == 'html') {

                    html += `<li class="kt-menu__item" aria-haspopup="true"><a href="javascript:;" class="kt-menu__link leftMenuItem resultMenuItem" aid='` + data[i].id + `'><i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i><span aid='` + data[i].id + `' class="kt-menu__link-text spnleftMenuItem">` + data[i].title + `</span></a></li>`;
                }
            }

            return html;
        }
       
        function filterDatasource(data, q) {

            for (var i = 0; i < data.length; i++) {

                var item = data[i];
                var text = item.text.toLowerCase();
                var itemVisible = text.indexOf(q) >= 0;

                if (itemVisible) {

                    var model = { title: item.text, id: item.id, type: item.spriteCssClass }

                    filterResult.push(model);
                }

                if (item.items) {
                    filterDatasource(item.items, q)
                }
            }
        }

        $("#txtLeftMenuSearch").keyup(function (event) {

            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13' || this.value.trim() == '') {

                if (this.value.trim() == '') {

                    $(".leftPanel").html("");
                    $(".leftPanel").append(buildList(dataCourseItem, true));
                    
                }
                else {

                    $(".leftPanel").html("");
                    var searchVal = this.value.trim().toLowerCase();
                    filterDatasource(dataCourseItem, searchVal);
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
                    $(".leftPanel2").append(buildList(dataListItem, true));

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

        var arr = $(this).attr("aid").split('|');
        processAID = arr[0];
        processTimeOut = arr[1];
        processName = $(this).text();

        $('#start-process-modal').find('.modal-body p').text(EFlang.StartProcess.replace('{0}', processName));

        if (processAID > 0) {
            $('.StartProcessOK').show();
            $('#start-process-modal').modal("show");
        }
    });

    $(document).on("click", ".StartProcessOK", function (event) {

        $('#startProcessSpinner').show();
        $('.StartProcessOK').hide();
        StartCourse(processAID, processTimeOut);
        $('#btnStartProcessCanceled').show();
    });

    function StartCourse(aid, timeout) {

        var lastTimeout = parseInt(timeout) + 2000;
        $.ajax({
            url: "/Partials/StartCourse",
            type: "GET",
            data: { "AID": aid, "Timeout": timeout },
            success: function (d) {

                var data = jQuery.parseJSON(JSON.stringify(d));

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
                            toastr.info("#" + data.CIID + " " + spesificProcessCanceled);

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
            error: function () {
                $('#start-process-modal').modal("hide");
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