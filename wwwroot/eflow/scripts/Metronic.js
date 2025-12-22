$(function () {
    $("#m_header_menu .m-menu__toggle").click(function (e) {

        $(".m-menu__item--submenu").removeClass("m-menu__item--open-dropdown");
        $(".m-menu__item--submenu").removeClass("m-menu__item--hover");
        var item = $(this).parent("li")
        $(item).addClass("m-menu__item--open-dropdown m-menu__item--hover");
        e.stopPropagation();

    });

    $(".m-nav__item").click(function (e) {
        $(".m-nav__item").removeClass("m-dropdown--open");
        $(this).toggleClass("m-dropdown--open", 1000, "easeOutSine");
        e.stopPropagation();

    });

    $("#m_ver_menu m-menu__link m-menu__toggle").click(function (e) {


        var item = $(this).parent("li")
        $(item).toggleClass("m-menu__item--open", 1000, "easeOutSine");
        e.stopPropagation();


    });

    $(document).click(function (e) {
        $(".m-menu__item--submenu").removeClass("m-menu__item--open-dropdown");
        $(".m-menu__item--submenu").removeClass("m-menu__item--hover");
        $(".m-nav__item").removeClass("m-dropdown--open");
    });

    $("#m_aside_left_minimize_toggle").click(function () {


        $(this).toggleClass("m-brand__toggler--active");
        $("body").toggleClass("m-brand--minimize");
        $("body").toggleClass("m-aside-left--minimize");
    });

    $(".m-quick-sidebar__close").click(function () {
        $("#m_quick_sidebar").toggleClass("m-quick-sidebar--on");
    });

});

$(document).ready(function () {
    //Left menu load

    $("#txtSearchMenu").keyup(function (e) {

        var text = $(this).val().toLowerCase();
        $(".leftPanel").empty();
        if (text.length > 0) {
            $(".leftPanel").append(buildListWithText(dataSourceItem, true, text));
            $(".leftMenuItem").each(function (i, j) {

                $(this).closest("ul").css("display", "block");
                $(this).closest("ul").parent().find(".arrow").addClass("open");

            });
        }
        else
            $(".leftPanel").append(buildList(dataSourceItem, true));

        $(".leftPanel2").empty();
        if (text.length > 0) {
            $(".leftPanel2").append(buildListWithText(dataListItem, true, text));
            $(".leftMenuItem").each(function (i, j) {

                $(this).closest("ul").css("display", "block");
                $(this).closest("ul").parent().find(".arrow").addClass("open");

            });
        }
        else
            $(".leftPanel2").append(buildList(dataListItem, true));

    });

    $(".leftPanel").append(buildList(dataSourceItem, true));
    $(".leftPanel2").append(buildList(dataListItem, true));

    function buildList(data, isSub) {

        var html = (isSub) ? '' : '';

        for (item in data) {
            var open = data[item].expanded ? "m-menu__item--open" : "";

            if (data[item].items) {

                html += '<li  class="m-menu__item  m-menu__item--submenu ' + open + '" >';
                html += '<a href="javascript:;"  class="m-menu__link m-menu__toggle"> <i class="m-menu__link-icon flaticon-folder"></i> <span class="m-menu__link-text">' + data[item].text + '</span> <i class="m-menu__ver-arrow la la-angle-right"></i>'
                html += '<div class="m-menu__submenu"> <span class="m-menu__arrow"><span> <ul class="m-menu__subnav">';
                html += '<li  class="m-menu__item  m-menu__item--parent" >'
                html += '<a href="javascript:;"  class="m-menu__link "> <span class="m-menu__link-text">' + data[item].text + '</span> </a></li>'

                html += buildList(data[item].items, true);

            } else {
                html += '<li class="m-menu__item"> <a  class="m-menu__link leftMenuItem" aid="' + data[item].id + '"> <i class="m-menu__link-bullet m-menu__link-bullet--dot"> <span></span></i> <span class="m-menu__link-text">' + data[item].text + '</span> </li>'
            }
            html += '</li>';
        }
        html += '</ul></div>';
        return html;
    }

    function buildListWithText(data, isSub, text) {
        var html = (isSub) ? '' : '';
        for (item in data) {
            var open = data[item].expanded ? "m-menu__item--open" : "";
            if (data[item].items) { // An array will return 'object'

                html += '<li  class="m-menu__item  m-menu__item--submenu ' + open + '" >';
                html += '<a href="javascript:;"  class="m-menu__link m-menu__toggle"><i class="m-menu__link-icon flaticon-folder"></i><span class="m-menu__link-text">' + data[item].text + '</span><i class="m-menu__ver-arrow la la-angle-right"></i>'
                html += '<div class="m-menu__submenu"><span class="m-menu__arrow"><span><ul class="m-menu__subnav">'
                html += '<li  class="m-menu__item  m-menu__item--parent" >'
                html += '<a href="javascript:;"  class="m-menu__link "><span class="m-menu__link-text">' + data[item].text + '</span></a></li>'
                html += buildListWithText(data[item].items, true, text);

            } else {
                if (data[item].text.toLowerCase().indexOf(text) >= 0) {
                    var cls = data[item].id.replace(" ", "-")

                    html += '<li class="m-menu__item"><a  class="m-menu__link leftMenuItem ' + cls + '" aid="' + data[item].id + '"><i class="m-menu__link-bullet m-menu__link-bullet--dot"><span></span></i><span class="m-menu__link-text">' + data[item].text + '</span></li>'

                }
            }
            html += '</li>';
        }
        html += '</ul></div>';
        return html;
    }
});
$('select').select2({ language: EFlang.localeCode, allowClear: true });
$(".modal").css("z-index", 10055);
$(".modal-dialog").css("background", "#fff");

$(document).on("click", "a.leftMenuItem", function () {
    var arr = $(this).attr("aid").split('|');
    processAID = arr[0];
    processTimeOut = arr[1];
    processName = $(this).text();

    $('#start-process-modal').find('.modal-body p').text(EFlang.StartProcess.replace('{0}', processName));

    if (processAID > 0) {
        $('.StartProcessOK').button('reset');
        $('.StartProcessOK').show();
        $('#surecload-animation').hide();
        $('#start-process-modal').modal("show");
    }
});
