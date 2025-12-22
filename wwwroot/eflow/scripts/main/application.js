function sidebarFixed() {
    $("#left").addClass("sidebar-fixed");
    $("#left .ui-resizable-handle").css("top", 0);
    $(window).scrollTop() == 0 && $("#left").css("top", 40);
    $("#content").hasClass("container") && $("#left").css("left", $("#content").offset().left);
    $("#left").getNiceScroll().resize().show();
    getSidebarScrollHeight(initSidebarScroll);
}

function topbarFixed() {
    $("#content").addClass("nav-fixed");
    $("#navigation").addClass("navbar-fixed-top");
    $("#left").css("top") == "0px" && $("#left").css("top", 40)
}

function initSidebarScroll() {
    if (!$("#left").hasClass("hasScroll")) {
        $("#left").niceScroll({
            cursorwidth: 9,
            cursorborder: 0,
            cursorcolor: "#999",
            railoffset: {
                top: 0,
                left: 0
            },
            autohidemode: !1,
            horizrailenabled: !1
        });
        $("#left").addClass("hasScroll");
        $("#left").on("touchmove", function (e) {
            e.preventDefault()
        })
    } else $("#left").getNiceScroll().resize().show()
}

function getSidebarScrollHeight(callbackFn) {
    var e = $("#left"),
        eu = $("#left .ui-resizable-handle"),
        r = $("#content").height();

    e.height(r);
    eu.height(r);

    if (callbackFn && typeof (callbackFn) === "function") {
        callbackFn();
    }

}

function initLeftNav() {
    leftwidth = parseFloat(localStorage.LeftWidth);
    if (leftwidth != 200) {
        if (leftwidth != 0) {
            SetSideBar(leftwidth);
        }
        else {
            $("#left").addClass("forced-hide");
            $("#content").addClass("nav-hidden");
        }
    }
   
}

function checkLeftNav() {
    var e = $(window),
        t = $("#content"),
        n = $("#left");
    if (e.width() <= 767) {
        if (!n.hasClass("mobile-show")) {
            n.hide();
            $("#main").css("margin-left", 0);
            $("#bodybottom .container-fluid").css("margin-left", 17);
        }
        $(".toggle-mobile").length == 0 && $("#navigation .user").before('<a href="#" class="toggle-mobile"><i class="icon-reorder"></i></a>');
        $(".mobile-nav").length == 0 && createSubNav()
    } else {
       
        if (!n.is(":visible") && !n.hasClass("forced-hide") && !$("#content").hasClass("nav-hidden")) {
            n.show();
            $("#main").css("margin-left", n.width())
        }
        $(".toggle-mobile").remove();
        $(".mobile-nav").removeClass("open");
        if (t.hasClass("forced-fixed")) {
            t.removeClass("nav-fixed");
            $("#navigation").removeClass("navbar-fixed-top")
        }
        e.width() < 1200 && $("#navigation .container").length > 0 && versionFluid()
    }
}
function resizeHandlerHeight() {
    var e = $(window).height(),
        t = $(window).scrollTop() == 0 ? 40 : 0;
    $("#left .ui-resizable-handle").height(e - t)
}
function toggleMobileNav() {
    var e = $(".mobile-nav");
    e.toggleClass("open");
    e.find(".open").removeClass("open")
}
function getNavElement(e) {
    var t = $.trim(e.find(">a").text()),
        n = "";
    n += "<li><a href='" + e.find(">a").attr("href") + "'>" + t + "</a>";
    e.find(">.dropdown-menu").length > 0 && (n += getNav(e.find(">.dropdown-menu")));
    n += "</li>";
    return n
}
function getNav(e) {
    var t = "";
    t += "<ul>";
    e.find(">li").each(function () {
        t += getNavElement($(this))
    });
    t += "</ul>";
    nav = t;
    return t
}
function createSubNav() {
    if ($(".mobile-nav").length == 0) {
        var e = $("#navigation .main-nav"),
            t = e;
        getNav(t);
        $("#navigation").append(nav);
        $("#navigation > ul").last().addClass("mobile-nav");
        $(".mobile-nav > li > a").click(function (e) {
            var t = $(this);
            $("#navigation").getNiceScroll().resize().show();
            if (t.next().length !== 0) {
                e.preventDefault();
                var n = t.next();
                t.parents(".mobile-nav").find(".open").not(n).each(function () {
                    var e = $(this);
                    e.removeClass("open");
                    e.prev().find("i").removeClass("icon-angle-down").addClass("icon-angle-left")
                });
                n.toggleClass("open");
                t.find("i").toggleClass("icon-angle-left").toggleClass("icon-angle-down")
            }
        })
    }
}
function hideNav() {
    $("#left").toggle().toggleClass("forced-hide");
    if ($("#left").is(":visible")) {
        $("#main").css("margin-left", $("#left").width());
        $("#bodybottom .container-fluid").css("margin-left", $("#left").width() + 17);
        SetUserPref("LEFT_MENU_POS", $("#left").width());
    }
    else {
        $("#main").css("margin-left", 0);
        $("#bodybottom .container-fluid").css("margin-left", 17);
        SetUserPref("LEFT_MENU_POS", 0);
    }
}
function scrolledClone(e, t) {
    t.remove();
    e.parent().removeClass("open")
}
function resizeContent() {
    if (colcolor) {
        SetColColors();
    }
    var wH = $(window).height();

    var e = 40;
    $("#footer").length > 0 && (e += $("#footer").outerHeight());
    var h = $(window).height() - e;
    $("#content, #main").css({
        "min-height": h,
        height: h
    });

}
var nav = "";
$(document).ready(function () {
    SetStorages();
    initLeftNav();
    checkLeftNav();
    resizeContent();
    $(".gallery-dynamic").length > 0 && $(".gallery-dynamic").imagesLoaded(function () {
        $(".gallery-dynamic").masonry({
            itemSelector: "li",
            columnWidth: 201,
            isAnimated: !0
        })
    });
    $(".gototop").click(function (e) {
        e.preventDefault();
        $("html, body").animate({
            scrollTop: 0
        }, 600)
    });
    $("body").attr("data-mobile-sidebar") == "slide" && $("body").touchwipe({
        wipeRight: function () {
            $("#left").show().addClass("mobile-show");
            initSidebarScroll()
        },
        wipeLeft: function () {
            $("#left").hide().removeClass("mobile-show")
        },
        preventDefaultEvents: !1
    });
    $("body").attr("data-mobile-sidebar") == "button" && $(".mobile-sidebar-toggle").click(function (e) {
        e.preventDefault();
        $("#left").toggle().toggleClass("mobile-show");
        initSidebarScroll()
    });
    $(".main-nav > li, .subnav-menu > li").hover(function () {
        if ($(this).attr("data-trigger") == "hover") if ($(this).parents(".subnav-menu").length > 0 && $("#left").hasClass("sidebar-fixed")) $(this).find(">a").trigger("click");
        else {
            $(this).closest(".dropdown-menu").stop(!0, !0).show();
            $(this).addClass("open")
        }
    }, function () {
        if ($(this).attr("data-trigger") == "hover") {
            $(this).closest(".dropdown-menu").stop(!0, !0).hide();
            $(this).removeClass("open")
        }
    });
    $(".subnav-menu > li > a[data-toggle=dropdown]").click(function () {
        var e = $(this);
        if ($("#left").hasClass("sidebar-fixed") || $("#left").hasClass("mobile-show")) {
            $(".cloned").remove();
            var t = e.next(),
                n = e.offset(),
                r = t.clone().css({
                    top: n.top,
                    left: n.left + $("#left").width()
                }).show().addClass("cloned");
            $("body").append(r);
            t.hide();
            $("#left").scroll(function () {
                scrolledClone(e, r)
            });
            $(window).scroll(function () {
                scrolledClone(e, r)
            });
            $("body").click(function (t) {
                var n = $(t.target);
                if (n.parents(".cloned").length == 0 && n.attr("data-toggle") != "dropdown") {
                    e.parent().removeClass("open");
                    r.remove();
                }
            })
        }
    });
    $("body").on("click", ".change-input", function (e) {
        e.preventDefault();
        var t = $(this),
            n = t.parent().prev(),
            r = t.parent().clone();
        r.html(n.clone().val(""));
        n.after(r);
        t.addClass("btn-satgreen update-input").removeClass("btn-grey-4 change-input").text("Update")
    });
    $("body").on("click", ".update-input", function (e) {
        e.preventDefault();
        var t = $(this),
            n = t.parent();
        t.after('<span><i class="icon-spinner icon-spin"></i>Updating...</span>');
        setTimeout(function () {
            n.find("span").remove();
            n.prev().slideUp(200, function () {
                n.prev().remove();
                t.removeClass("update-input btn-satgreen").addClass("btn-grey-4 change-input").text("Change")
            })
        }, 1e3)
    });
    $(".subnav-hidden").each(function () {
        $(this).find(".subnav-menu").is(":visible") && $(this).find(".subnav-menu").hide()
    });
    createSubNav();
    $("#navigation").on("click", ".toggle-mobile", function (e) {
        e.preventDefault();
        toggleMobileNav()
    });
    $(".content-slideUp").click(function (e) {
        e.preventDefault();
        var t = $(this),
            n = t.parents(".box").find(".box-content");
        n.slideToggle("fast", function () {
            t.find("i").toggleClass("icon-angle-up").toggleClass("icon-angle-down");
            t.find("i").hasClass("icon-angle-up") ? n.hasClass("scrollable") && destroySlimscroll(n) : n.hasClass("scrollable")
        })
    });
    $(".content-remove").click(function (e) {
        e.preventDefault();
        var t = $(this),
            n = t.parents("[class*=span]"),
            r = parseInt(n.attr("class").replace("span", "")),
            i = n.prev().length > 0 ? n.prev() : n.next();
        if (i.length > 0) var s = parseInt(i.attr("class").replace("span", ""));
        bootbox.animate(!1);
        bootbox.confirm("Do you really want to remove the widget <strong>" + t.parents(".box-title").find("h3").text() + "</strong>?", "Cancel", "Yes, remove", function (e) {
            if (e) {
                t.parents("[class*=span]").remove();
                i.length > 0 && i.removeClass("span" + s).addClass("span" + (s + r))
            }
        })
    });
    $(".content-refresh").click(function (e) {
        e.preventDefault();
        var t = $(this);
        t.find("i").addClass("icon-spin");
        setTimeout(function () {
            t.find("i").removeClass("icon-spin")
        }, 2e3)
    });
    $(".custom-checkbox").each(function () {
        var e = $(this);
        e.hasClass("checkbox-active") && e.find("i").toggleClass("icon-check-empty").toggleClass("icon-check");
        e.bind("click", function (t) {
            t.preventDefault();
            e.find("i").toggleClass("icon-check-empty").toggleClass("icon-check");
            e.toggleClass("checkbox-active")
        })
    });
    $(".sortable-box").sortable({
        connectWith: ".box",
        items: ".box",
        opacity: .7,
        placeholder: "widget-placeholder",
        forcePlaceholderSize: !0,
        tolerance: "pointer"
    });
    $(".toggle-subnav").click(function (e) {
        if (!$(this).parent().hasClass("designerlink")) {
            e.preventDefault();
            var t = $(this);
            t.parents(".subnav").toggleClass("subnav-hidden").find(".subnav-menu,.subnav-content").slideToggle("fast");
            t.find("i").toggleClass("icon-folder-close").toggleClass("icon-folder-open");
            if ($("#left").hasClass("mobile-show") || $("#left").hasClass("sidebar-fixed")) {
                getSidebarScrollHeight();
                $("#left").getNiceScroll().resize().show()
            }
        }
    });
    $("#left").sortable({
        items: ".subnav",
        placeholder: "widget-placeholder",
        forcePlaceholderSize: !0,
        axis: "y",
        handle: ".subnav-title",
        tolerance: "pointer"
    });
    $(".scrollable").length > 0 && $(".scrollable").each(function () {
        var e = $(this),
            t = parseInt(e.attr("data-height")),
            n = e.attr("data-visible") == "true" ? !0 : !1,
            r = e.attr("data-start") == "bottom" ? "bottom" : "top",
            i = {
                height: t,
                color: "#666",
                start: r,
                allowPageScroll: !0
            };
        if (n) {
            i.alwaysVisible = !0;
            i.disabledFadeOut = !0
        }
        e.slimScroll(i)
    });
    $(".spark-me").length > 0 && $(".spark-me").sparkline("html", {
        height: "25px",
        enableTagOptions: !0
    });
    $("#left").hasClass("no-resize") || $("#left").resizable({
        minWidth: 60,
        handles: "e",
        resize: function (e, t) {
            var r = $("#main"),
                b = $("#bodybottom .container-fluid");
            if (Math.abs(200 - t.size.width) <= 20) {
                $("#left").css("width", 200);
                r.css("margin-left", 200);
                b.css("margin-left", 200);
            } else {
                r.css("margin-left", $("#left").width());
                b.css("margin-left", $("#left").width());
            }
        },
        stop: function (e, t) {
            $("#left .ui-resizable-handle").css("background", "none")
            SetUserPref("LEFT_MENU_POS", t.size.width);
        },
        start: function () {
            $("#left .ui-resizable-handle").css("background", "#aaa")
        }
    });
    $("[rel=popover]").popover();
    $(".toggle-nav").click(function (e) {
        e.preventDefault();
        hideNav()
    });
    $("#content").hasClass("nav-hidden") && hideNav();
    $(".table .sel-all").change(function (e) {
        e.preventDefault();
        e.stopPropagation();
        var t = $(this);
        t.parents(".table").find("tbody .selectable").prop("checked", el.prop("checked"))
    });
    resizeHandlerHeight();
    $(".table .alpha").click(function (e) {
        e.preventDefault();
        var t = $(this),
            n = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            r = "",
            i = [];
        t.parents().find(".alpha .alpha-val span").each(function () {
            i.push($(this).text())
        });
        r += "<li class='active'><span>All</span></li>";
        for (var s = 0; s < n.length; s++) {
            var o = $.inArray(n.charAt(s), i) != -1 ? " class='active'" : "";
            r += "<li" + o + "><span>" + n.charAt(s) + "</span></li>"
        }
        t.parents(".table").before("<div class='letterbox'><ul class='letter'>" + r + "</ul></div>");
        $(".letterbox .letter > .active").click(function () {
            var e = $(this);
            if (e.text() != "All") {
                var t = e.parents(".box-content").find(".table .alpha:contains('" + e.text() + "')");
            }
            e.parents(".letterbox").remove()
        })
    });
    $(".theme-colors > li > span").hover(function (e) {
        var color = $(this).attr("class");
        setTheme(color);
    }, function () {
        var e = $(this),
            t = $("body");
        t.attr("data-theme") !== undefined ? t.attr("class", "").addClass(t.attr("data-theme")) : t.attr("class", "")
    }).click(function () {
        var color = $(this).attr("class");
        setTheme(color);
        setCookie("EFlowTheme", "theme-" + color, 365);
    });
    $("body").attr("data-layout-topbar") == "fixed" && topbarFixed();
    $("body").attr("data-layout-sidebar") == "fixed" && sidebarFixed();

});
$.fn.scrollBottom = function () {
    return $(document).height() - this.scrollTop() - this.height()
};

function setTheme(color) {
    $("body").attr("class", "").addClass("theme-" + color).attr("data-theme", "theme-" + color);
}

function setCookie(key, value, dayToExpire) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (dayToExpire * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

function SetSideBar(wt) {
    $("#left").css("width", wt);
    var r = $("#main"),
    b = $("#bodybottom .container-fluid");

    if (Math.abs(200 - wt) <= 20) {
        $("#left").css("width", 200);
        r.css("margin-left", 200);
        b.css("margin-left", 200);
    }
    else {
        r.css("margin-left", wt);
        b.css("margin-left", wt + 17);
    }
}
$(window).scroll(function (e) {
    var t = 0,
        n = $(window),
        r = $(document);
    if (n.scrollTop() == 0 || $("#left").hasClass("sidebar-fixed")) $("#left .ui-resizable-handle").css("top", t);
    else {
        n.scrollTop() + $("#left .ui-resizable-handle").height() <= r.height() ? t = n.scrollTop() - 40 : t = r.height() - $("#left .ui-resizable-handle").height() - 40;
        $("#left .ui-resizable-handle").css("top", t)
    } !$("#content").hasClass("nav-fixed") && $("#left").hasClass("sidebar-fixed") && (n.scrollTop() < 40 ? $("#left").css("top", 40 - n.scrollTop()) : $("#left").css("top", 0));
    getSidebarScrollHeight();
    resizeHandlerHeight()
});
$(window).resize(function (e) {
    checkLeftNav();
    resizeContent();
    getSidebarScrollHeight(initSidebarScroll);

});
function SetStorages() {
    if (localStorage.getItem("LeftWidth") === null) {
        localStorage.setItem("LeftWidth", GetUserPref("LEFT_MENU_POS"));
    }
}
function SetUserPref(PrefName, PrefValue, callbackFn) {
    $.ajax({
        url: "/Main/SetUserPref",
        type: "GET",
        data: { "PrefName": PrefName, "PrefValue": PrefValue },
        success: function (d) {
            if (d == "OK") {
                if (callbackFn && typeof (callbackFn) === "function") {
                    callbackFn();
                }
                if (PrefName == "LEFT_MENU_POS") {
                    localStorage.setItem("LeftWidth", PrefValue);
                }
            }
        },
        contentType: "text/plain; charset=utf-8",
        cache: false
    });
}

function GetUserPref(PrefName, callbackFn) {
    var retval = "";
    $.ajax({
        url: "/Main/GetUserPref",
        type: "GET",
        data: { "PrefName": PrefName },
        async: false,
        success: function (d) {
            if (callbackFn && typeof (callbackFn) === "function") {
                callbackFn(d);
            }
            else {
                retval = d;
            }
        },
        contentType: "text/plain; charset=utf-8",
        cache: false
    });
    return retval;
}