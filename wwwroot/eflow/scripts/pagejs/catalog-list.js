function setFavStatus(id) {

    var setToActive = false;

    var element = $("#" + id);

    if (element.hasClass("inactive")) {
        $("#" + id).toggleClass('inactive active');
        setToActive = true;
    }
    else {
        element.toggleClass('active inactive');
    } 

    return setToActive;
}

function setFavStatusThumb(id, cid) {

    var status = setFavStatus(id);

    $.ajax({
        url: "/Lists/SetListFavStatus",
        type: "GET",
        data: {
            "cid": cid,
            "status": status,
            "parentId": viewbagParentId,
            "folderId": viewbagFolderId
        },
        cache: false,
        success: function (d) {

            $.ajax({
                type: 'GET',
                data: {
                    "parentId": viewbagParentId,
                    "folderId": viewbagFolderId
                },
                dataType: "html",
                cache: false,
                url: '/Lists/GetFavBoxPartial',
                success: function (data) {
                    $('#catalogFavPartial').html(data);
                }
            });
        }
    });
}

function setFavStatusBox(id, cid) {

    var status = setFavStatus(id, cid);

    $.ajax({
        url: "/Lists/SetListFavStatus",
        type: "GET",
        data: { "cid": cid, "status": status },
        cache: false,
        success: function (d) {

            //Delete from HTML.
            $("#" + id).closest("li").remove();

            var thumFavId = id.slice(2);
            //Change the fav icon status.

            setFavStatus(thumFavId);
            //Get total li count
            var liCount = $('ul#ulFavCatalog li').length;

            //Show or hide FavInfo text.
            showHideFavStatusBox(liCount);
        }
    });   
}

function showHideFavStatusBox(count) {
    if (count == 0) {
        $("#divFavInfo").removeClass('d-none').addClass('d-block');
    }
    else {
        $("#divFavInfo").removeClass('d-block').addClass('d-none');
    }
}

function orderThumb(type) {

    $.ajax({
        type: 'GET',
        data: {
            "orderType": type,
            "parentId": viewbagParentId,
            "folderId": viewbagFolderId
        },
        dataType: "html",
        cache: false,
        url: '/Lists/GetThumbBoxPartial',
        success: function (data) {

            $('#catalogThumbPartial').html(data);

            if (type == "desc") {
                $("#orderThumbTitle").removeClass('la-sort-alpha-asc').addClass('la-sort-alpha-desc');
                $(".list-dropdown-orderby span").text(EFlang.Old);
            }
            else {
                $("#orderThumbTitle").removeClass('la-sort-alpha-desc').addClass('la-sort-alpha-asc');
                $(".list-dropdown-orderby span").text(EFlang.New);
            }  
        }
    });
}