/**
 * USING COOKIES
 * 
   //Cookie Set
   Cookies.set('name', 'value', { path:'/', SameSite:'strict' });

   //Cookie Remove
   Cookies.remove('name', { path:'/' });

   //Cookie Get
   Cookies.get('name');

   //Cookie GET with JSON parse
   Cookies.getJSON('name');
 *
 */


$(function () {

    showList();

    //var cnt = Cookies.get('NotifyCount' + getUserInfo().UserHash);
    //if (cnt !== undefined && cnt !== '') {
    //    $(".notify").text(cnt);
    //    $(".notify").removeClass("kt-hidden");
    //    $("#btnNotify").addClass("animated");
    //}

    $('body').on('click', '#clrButton', function () {
        Cookies.remove('NotifyList' + getUserInfo().UserHash, { path: '/' });
        showList();
    });

    $('body').on('click', '.btnRead', function () {
        $(this).parents(".kt-notification__item").removeClass("unRead");
    });

    $("#btnNotify").click(function () {
        $(".notify").addClass("kt-hidden");
        $(".notify").text("");
        /* Cookies.set('NotifyCount' + getUserInfo().UserHash, '', { path:'/', SameSite: 'strict' });*/
        $("#taskCountDiv").addClass("hided");
        $("#btnNotify").removeClass("animated");
    });

    $("#taskCount").click(function () {
        $("#taskCountDiv").addClass("hided");
    });

    //signalR
    var chat = $.connection.chatHub;

    //Task Notification
    chat.client.addNotify = function (FormSeyirID, type, name) {
        console.log("type:" + type);
        if (type === "NewTask" || type === "ReAssigned") {

            getNotify(FormSeyirID, type, name);

            //$(".notify").removeClass("kt-hidden");
            //var count = $(".notify").text();
            //console.log("count:" + count);
            //if (count !== "")
            //    count = parseInt(count) + 1;
            //else
            //    count = 1;
            //console.log("count2:" + count);
            //$("#btnNotify").addClass("animated");
            //Cookies.set('NotifyCount' + getUserInfo().UserHash, count, { path: '/', SameSite: 'strict' });
            //$(".notify").text(count);
            //$("#taskCountDiv").removeClass("hided");
            //$("#taskCount").val(count + " " + task);
            //playSound();
        }
        else {
            var complateCount = $("#complatedProcessTypeCount").text();
            complateCount = parseInt(complateCount) || 0;
            $("#complatedProcessTypeCount").text(complateCount + 1);
            $("#liComplatedProcess").css("display", "block");

            var createCount = $("#createdProcessTypeCount").text();
            createCount = parseInt(createCount) || 0;
            var countCreate = createCount - 1;
            $("#createdProcessTypeCount").text(countCreate);
            if (countCreate <= 0)
                $("#liCreatedProcess").css("display", "none");

            toastr.info(endTask.replace('{0}', name));
        }
    };

    chat.client.showSuccessMessage = function (message) { console.log(message); toastr.success(message); };

    //End Process Notification
    chat.client.boradCastEndTask = function (TIID, COID) {
        var notifyList = Cookies.get('NotifyList' + getUserInfo().UserHash);
        if (notifyList !== undefined) {
            var json = JSON.parse(notifyList);
            if (getUserInfo().CompanyId === COID) {
                if (json.length) {
                    var arr = [];
                    $.each(json, function (i, da) {
                        if (da.TIID !== TIID) {
                            arr.push(da);
                        }
                    });
                    if (arr.length === 0) {
                        Cookies.remove('NotifyList' + getUserInfo().UserHash, { path: '/' });
                    } else {
                        Cookies.set('NotifyList' + getUserInfo().UserHash, JSON.stringify(arr), { path: '/', SameSite: 'strict' });
                    }
                }
                else {
                    Cookies.remove('NotifyList' + getUserInfo().UserHash, { path: '/' });
                    $("[ddt=" + TIID + "]").remove();
                }
                showList();
            }
        }
    };

    //Publish Document Notification
    chat.client.publishDocument = function (docId, fromUserName, fileName) {
        var arr = [];
        var dt = new Date();
        var now = dt.toLocaleDateString() + "-" + dt.toLocaleTimeString();
        var message = "";
        if (docId.indexOf("doc-") > -1) {
            message = sharedDocumentNotification.replace('{0}', fromUserName).replace('{1}', fileName);
        } else {
            message = sharedFolderNotification.replace('{0}', fromUserName).replace('{1}', fileName);
        }
        var data = { "TIID": docId, "Title": message, "notyDate": now, "unRead": false };
        arr.push(data);
        var notifyList = Cookies.get('NotifyList' + getUserInfo().UserHash);
        if (notifyList !== undefined) {
            var json = JSON.parse(notifyList);
            if (json.length) {
                $.each(json, function (i, da) {
                    if (da.TIID !== data.TIID) { arr.push(da); }
                });
                if (arr.length === 0) {
                    Cookies.remove('NotifyList' + getUserInfo().UserHash, { path: '/' });
                } else {
                    Cookies.set('NotifyList' + getUserInfo().UserHash, JSON.stringify(arr), { path: '/', SameSite: 'strict' });
                }
            } else {
                Cookies.remove('NotifyList' + getUserInfo().UserHash, { path: '/' });
                $("[ddt=" + TIID + "]").remove();
            }
        }
        else {
            Cookies.set('NotifyList' + getUserInfo().UserHash, JSON.stringify(arr), { path: '/', SameSite: 'strict' });
        }
        showList();
    };

    $.connection.hub.start();

    $(".not").each(function () { $(this).unbind(); });

    $(".notHover").click(function () {
        var _index = $(this).attr("ddt");
        var index = _index.indexOf("-") > -1 ? $(this).attr("ddt") : parseInt($(this).attr("ddt"), 0);
        var notifyList = Cookies.get('NotifyList' + getUserInfo().UserHash);
        if (notifyList !== undefined) {
            var items = [];
            var arr = [];
            var count = JSON.parse(notifyList);
            if (count.length)
                items = JSON.parse(notifyList);
            else
                items.push(JSON.parse(notifyList));

            $.each(items, function (i, data) {
                if (data.TIID === index) {
                    data.unRead = true;
                } else {
                    arr.push(data);
                }
            });
            if (arr.length > 0) {
                Cookies.set('NotifyList' + getUserInfo().UserHash, JSON.stringify(arr), { path: '/' });
            } else {
                Cookies.remove('NotifyList' + getUserInfo().UserHash, { path: '/' });
            }
            showList();
        }
    });
});
function getNotify(tiid, type, name) {
    var data = { "TIID": tiid, "Title": name };
    if (tiid) {
        var arr = [];
        var dt = new Date();
        var now = dt.toLocaleDateString() + "-" + dt.toLocaleTimeString();
        var notifyList = Cookies.get('NotifyList' + getUserInfo().UserHash);
        if (notifyList !== undefined) {
            var json = JSON.parse(notifyList);
            if (json.length) {
                $.each(json, function (i, da) {
                    if (da.TIID !== data.TIID) { arr.push(da); }
                });
                data.notyDate = now;
                data.unRead = false;
                data.iconType = type;
                arr.push(data);
                Cookies.set('NotifyList' + getUserInfo().UserHash, JSON.stringify(arr), { path: '/', SameSite: 'strict' });
            } else {
                data.notyDate = now;
                data.unRead = false;
                data.iconType = type;
                arr.push(json);
                arr.push(data);
                Cookies.set('NotifyList' + getUserInfo().UserHash, JSON.stringify(arr), { path: '/', SameSite: 'strict' });
            }
        }
        else {
            data.notyDate = now;
            data.unRead = false;
            data.iconType = type;
            arr.push(data);
            Cookies.set('NotifyList' + getUserInfo().UserHash, JSON.stringify(arr), { path: '/', SameSite: 'strict' });
        }
    }
    showList();
}

function showList() {
    var notifyList = Cookies.get('NotifyList' + getUserInfo().UserHash);
    if (notifyList !== undefined) {
        var items = [];
        var count = JSON.parse(notifyList);
        if (count.length)
            items = JSON.parse(notifyList);
        else
            items.push(JSON.parse(notifyList));

        items.reverse();
        $(".taskCount").html("");
        $(".noti").html("");
        if (items.length > 0) {
            var title = pending + ' <span style="margin-left: 10px;" class="btn btn-label-primary btn-sm btn-bold btn-font-md task">' + items.length + '</span>';
            $(".taskCount").append(title);
            $(".noti").append('<li class="list-group-item" style="background: #d5e5ff;"><span  class="bold" style="font-size: small;">' + items.length + ' ' + pending + '</span><span id="clrButton" style="cursor:pointer;float:right"><i class="fa fa-times"></i></span></li>');
        }

        $.each(items, function (i, data) {
            var read = data.unRead ? "" : "unRead";
            var obj = '';
            if (typeof data.TIID === 'number') {
                obj = '<div  ddt="' + data.TIID + '" class="kt-notification__item notHover ' + read + '">'
                    + '<div class="kt-notification__item-icon">'
                    + '<i class="flaticon-folder-1 kt-font-brand"></i>'
                    + '</div>' + '<div class="kt-notification__item-details">'
                    + '<div class="kt-notification__item-title"><a onclick="TogglerTaskPeekClick(' + data.TIID + ')" class="btnRead" href="javascript:;">'
                    + data.Title
                    + '</a></div>'
                    + '<div class="kt-notification__item-time">'
                    + data.notyDate
                    + '</div>'
                    + '</div>'
                    + '<a onclick="TaskWorkClick(' + data.TIID + ',true)" class="btnRead" href="javascript:;"> <div class="kt-notification__item-icon">'
                    + '<i class="flaticon2-right-arrow kt-font-brand" style="color: #4c81d1!important; font-size: 9px;"></i>'
                    + '</div></a>'
                    + '</div>';
            }
            else {
                if (data.TIID.indexOf("doc-") > -1) {
                    obj = '<div  ddt="' + data.TIID + '" class="kt-notification__item notHover ' + read + '">'
                        + '<div class="kt-notification__item-icon">'
                        + '<i class="flaticon-folder-1 kt-font-brand"></i>'
                        + '</div>' + '<div class="kt-notification__item-details">'
                        + '<div class="kt-notification__item-title"><a onclick="goToDmsFile(\'' + data.TIID + '\')" class="btnRead" href="javascript:;">'
                        + data.Title
                        + '</a></div>'
                        + '<div class="kt-notification__item-time">'
                        + data.notyDate
                        + '</div>'
                        + '</div>'
                        + '<a onclick="goToDmsFile(\'' + data.TIID + '\')" class="btnRead" href="javascript:;"> <div class="kt-notification__item-icon">'
                        + '<i class="flaticon2-right-arrow kt-font-brand" style="color: #4c81d1!important; font-size: 9px;"></i>'
                        + '</div></a>'
                        + '</div>';
                } else if (data.TIID.indexOf("fld-") > -1) {
                    obj = '<div  ddt="' + data.TIID + '" class="kt-notification__item notHover ' + read + '">'
                        + '<div class="kt-notification__item-icon">'
                        + '<i class="flaticon-folder-1 kt-font-brand"></i>'
                        + '</div>' + '<div class="kt-notification__item-details">'
                        + '<div class="kt-notification__item-title"><a onclick="goToDmsFolder(\'' + data.TIID + '\')" class="btnRead" href="javascript:;">'
                        + data.Title
                        + '</a></div>'
                        + '<div class="kt-notification__item-time">'
                        + data.notyDate
                        + '</div>'
                        + '</div>'
                        + '<a onclick="goToDmsFolder(\'' + data.TIID + '\')" class="btnRead" href="javascript:;"> <div class="kt-notification__item-icon">'
                        + '<i class="flaticon2-right-arrow kt-font-brand" style="color: #4c81d1!important; font-size: 9px;"></i>'
                        + '</div></a>'
                        + '</div>';
                }
            }
            $(".noti").append(obj);
        });

        if (items.length === 0) {
            $(".noti").append('<div style="margin-left: 0px;margin-top:15%;"> <div class="kt-grid kt-grid--hor kt-grid__item kt-grid__item--fluid kt-grid__item--middle"><div class= "kt-grid__item kt-grid__item--middle kt-align-center"> <i class="bell fa fa-bell" style=" font-size: 50px; padding-bottom: 30px; color: #e7e6e6;"></i> <br> <span style="font-weight: 400; font-size: 18px;"> <img src="/Assets/theme/default/dist/default/assets/media/icons/svg/Navigation/Double-check.svg" /> ' + notificationsShowed + '  </span> <br><br> ' + noNewNotification + ' </div ></div> </div > ')
            $(".head-notification-wp-title").hide();
        }

        if (items.length > 0) {
            $(".head-notification-wp-title").show();
            $(".notify").text(items.length);
            $("#btnNotify").addClass("animated");
            $(".notify").removeClass("kt-hidden");
        }

        $(".noti").removeClass("hided");

    } else {
        $(".noti").html("");
        $(".noti").addClass("hided");
        $(".noti").append('<div style="margin-left: 0px;margin-top:15%;"> <div class="kt-grid kt-grid--hor kt-grid__item kt-grid__item--fluid kt-grid__item--middle"><div class= "kt-grid__item kt-grid__item--middle kt-align-center"> <i class="bell fa fa-bell" style=" font-size: 50px; padding-bottom: 30px; color: #e7e6e6;"></i> <br> <span style="font-weight: 400; font-size: 18px;"> <img src="/Assets/theme/default/dist/default/assets/media/icons/svg/Navigation/Double-check.svg" /> ' + notificationsShowed + '  </span> <br><br> ' + noNewNotification + ' </div ></div> </div > ')

        $(".taskCount").html("");
        $(".notify").addClass("kt-hidden");
        var countnt = $(".notify").text();
        if (countnt === "1" || countnt === "") {
            $(".notify").text("");
            Cookies.remove('NotifyCount' + getUserInfo().UserHash, { path: '/' });
            $("#btnNotify").removeClass("animated");
            $(".head-notification-wp-title").hide();
            Cookies.remove('NotifyList' + getUserInfo().UserHash, { path: '/' });
        } else {
            $(".head-notification-wp-title").show();
            var counter = parseInt(countnt) - 1;
            $(".notify").text(counter);
            Cookies.set('NotifyCount' + getUserInfo().UserHash, counter, { path: '/', SameSite: 'strict' });
        }
    }
}

var signalRUserInfo;

function getUserInfo() {
    if (signalRUserInfo !== undefined && signalRUserInfo.UserHash !== undefined && signalRUserInfo.CompanyId !== undefined) {
        return signalRUserInfo;
    }

    var user = {};
    $.ajax({
        url: "/Main/GetUserInfoEnc",
        type: "POST",
        async: false,
        success: function (data) {
            user = data
            signalRUserInfo = data;
        }
    });

    return user;
}

function sendAllClient(message, title) {
    $.ajax({
        url: "/Main/SendMessage",
        type: "POST",
        data: { message: message, title: title },
        success: function (data) {
            $("#ulBroadcast").toggleClass("hidden");
        }
    });
}

function playSound() {
    var myvideo = document.getElementById("video");
    myvideo.play();
    myvideo.muted = false;
}

function goToDmsFile(docId) {
    readNotify(docId);
    docId = docId.replace("doc-", "");
    var _url = location.href.split("/");
    var url_host = _url[0] + "/" + _url[1] + "/" + _url[2];
    window.location.href = url_host + "/DMS2/Shared?pageType=-996&doc=" + docId;
}
function goToDmsFolder(fldId) {
    readNotify(fldId);
    fldId = fldId.replace("fld-", "");
    var _url = location.href.split("/");
    var url_host = _url[0] + "/" + _url[1] + "/" + _url[2];
    window.location.href = url_host + "/DMS2/Shared?pageType=-996&fld=" + fldId;
}

function readNotify(id) {
    var notifyList = Cookies.get('NotifyList' + getUserInfo().UserHash);
    if (notifyList !== undefined) {
        var items = [];
        var arr = [];
        var count = JSON.parse(notifyList);
        if (count.length)
            items = JSON.parse(notifyList);
        else
            items.push(JSON.parse(notifyList));

        $.each(items, function (i, data) {
            if (data.TIID !== id) {
                arr.push(data);
            }
        });
        if (arr.length > 0) {
            Cookies.set('NotifyList' + getUserInfo().UserHash, JSON.stringify(arr), { path: '/' });
        } else {
            Cookies.remove('NotifyList' + getUserInfo().UserHash, { path: '/' });
        }
    }
}