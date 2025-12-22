var breadcrumps = "";
var session_breadcrumps = [];

function ShowHideFavBox() {
    try {
        //Get total li count
        var liCount = $('ul#ulFavCatalog li').length;
        //Show or hide FavInfo text.
        if (liCount == 0) {
            $("#divFavInfo").removeClass('d-none').addClass('d-block');
        }
        else {
            $("#divFavInfo").removeClass('d-block').addClass('d-none');
        }
    } catch (e) {}
}

function ToogleListItems(itemId, folderId, foldername) {
    var FolderName = foldername;
    var ItemID = itemId;
    var element_check = document.getElementById("ulbreadcrump");
    sessionStorage.removeItem('fonts');
    $.ajax({
        type: 'GET',
        dataType: "html",
        data: {
            ParentId: itemId,
            FolderId: folderId
        },
        url: '/Lists/ListModel',
        success: function (data) {
            $('#dashlistPanelPartial').html(data);
            if (FolderName !== undefined) {
                $("#ulbreadcrump").append(breadcrumps);
                var li_list = $("#ulbreadcrump").find("li");
                if (!(($(li_list).hasClass("ItemID_" + ItemID + "")))) {
                    breadcrumps += '<li class="ItemID_' + ItemID + '"> <a href="javascript: void (0)" onclick="ToogleListItems(' + ItemID + ') " >' + FolderName + ' </a></li>';
                    $("#ulbreadcrump").find("li:not(#TurnBack)").remove();
                    session_breadcrumps.push(sessionStorage);
                    var session_check = false;
                    $.each(sessionStorage, function (key, value) {
                        if (value == ItemID) {
                            session_check = true;
                        }

                    });
                    if (!session_check) {
                        sessionStorage.setItem(foldername, ItemID);
                    }

                    $("#ulbreadcrump").append(breadcrumps);
                }
            }
            else if (FolderName === undefined) {
                $("#ulbreadcrump").append(breadcrumps);
                var li_list = $("#ulbreadcrump").find("li");
                var index = 0;
                $.each(li_list, function (x, y) {
                    if ($(y).hasClass("ItemID_" + ItemID + "")) {
                        index = x;
                    }
                });
                var deletebread = breadcrumps.split('</li>');
                $.each(li_list, function (x, y) {
                    if (x > index) {
                        $(y).remove();
                    }
                });
                deletebread.splice(index, deletebread.length);
                breadcrumps = "";
                for (var i = 0; i < deletebread.length; i++) {
                    if (deletebread[i] != "")
                        breadcrumps += deletebread[i] + "</li>";
                }
            }
            if (ItemID == -1) {

                if (element_check != null) {
                    element_check.querySelectorAll("li").forEach(e => e.remove());
                    breadcrumps = "";
                    sessionStorage.clear();
                }
            }
            ShowHideFavBox();
        },
        fail: function (xhr, textStatus, errorThrown) {

        }
    });
}

var breadcrumps = "";
var sessionbreadcrumb_foldername = [];
var sessionbreadcrumb_folderID = [];
var clickfolder_ID = 0;

function SetSessionBreadcrumpItems(itemId, folderıd) {
    sessionStorage.removeItem('fonts');
    $.ajax({
        type: 'GET',
        dataType: "html",
        cache: false,
        url: '/Lists/ListModel',
        success: function (data) {
            clickfolder_ID = sessionStorage.getItem('ClickFolders');
            if (clickfolder_ID != -1) {
                for (var i = 0; i < sessionStorage.length; i++) {
                    var foldername = sessionStorage.key(i);
                    if (foldername != 'ClickFolders') {
                        if (parseInt(sessionStorage.getItem(foldername)) <= parseInt(clickfolder_ID)) {
                            sessionbreadcrumb_foldername.push(foldername);
                            sessionbreadcrumb_folderID.push(sessionStorage.getItem(foldername));
                        }
                    }
                }
                for (var i = sessionbreadcrumb_foldername.length - 1; i > -1; i--) {
                    if (!(i == -1)) {
                        breadcrumps += '<li class="ItemID_' + sessionbreadcrumb_folderID[i] + '"> <a href="javascript: void (0)" onclick="ToogleListItems(' + sessionbreadcrumb_folderID[i] + ') " >' + sessionbreadcrumb_foldername[i] + ' </a></li>'
                    }
                }
                $("#ulbreadcrump").append(breadcrumps);
            }
        }
    });
}