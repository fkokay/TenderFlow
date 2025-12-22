function ListDetailPageZoom(val) {

    var id = "right-1";
    if (val == "ldz-r2") {
        id = "right-2";
    }
    else if (val == "ldz-r3") {
        id = "right-3";
    }

    if (id == "right-1") {

    }
    else if (id == "right-2") {
        $("#ldz-r1").attr("style", "display:none;")
    }
    else if (id == "right-3") {
        $("#ldz-r2").attr("style", "display:none;")
    }

    if ($("#zoom-" + val).hasClass("la-angle-double-right")) {
        $("#zoom-" + val).removeClass('la-angle-double-right').addClass('la-angle-double-left');
        OpenModalZoom(id, "True");

    }
    else {
        $("#zoom-" + val).removeClass('la-angle-double-left').addClass('la-angle-double-right');
        OpenModalZoom(id, "False");
    }
}