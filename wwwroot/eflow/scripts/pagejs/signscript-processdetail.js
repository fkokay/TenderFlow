var ctx, color = "#000";
var xDID;
var xCIID;
var isSave = false;

$(document).ready(function () {

    $(".palette").click(function () {
        $(".palette").css("border-color", "#777");
        $(".palette").css("border-style", "solid");
        $(this).css("border-color", "#fff");
        $(this).css("border-style", "dashed");
        color = $(this).css("background-color");
        ctx.beginPath();
        ctx.strokeStyle = color;
    });

    $("#newSign").click(function () {
        newCanvas();
        isSave = false;
    });

    $('.showSign').on('click', function () {
        newCanvas();
        xDID = $(this).attr("datadid");
        xCIID = $(this).attr("dataciid");
        $('#signModal').modal('show');
    });

    $(".btnSignImage").on("click", function () {
        var can = $('#canvas')[0];
        drawAndConvertStuff(can);
    })

    $(".fileSign").click(function () {
        var btnDelete = $(this);

        swal({
            title: "Silmek İstediğinizden Emin Misiniz?",
            text: "",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Evet",
            cancelButtonText: "Vazgeç"
        }).then(
            function (result) {
                if (result.value) {

                    var did = btnDelete.attr("datadid");
                    var ciid = btnDelete.attr("dataciid");
                    var target = btnDelete.attr("dataapp");
                    $.ajax({
                        url: "/Task/DeleteFile",
                        data: { did: did, ciid: ciid },
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        cache: false,
                        success: function (data) {
                            $("#" + target).find("input:hidden").val("");
                            btnDelete.attr("style", "display:none !important");
                            var down = btnDelete.next();
                            $(down).attr("style", "display:none !important");
                            var img = $("#" + target).find("img");
                            img.attr("src", "");
                            img.css("display", "none");
                        }
                    });

                    swal({
                        title: '',
                        text: "İşlem Tamamlandı",
                        type: 'success',
                        showConfirmButton: false,
                        timer: 1500

                    })
                }
            })
    });
});

function drawAndConvertStuff(canvas) {
    var canvasContext = canvas.getContext('2d');
    if (isSave) {
        var imgSrc = canvas.toDataURL("image/png");
        $('.' + xDID).removeClass("hide");
        $('.' + xDID).attr('src', imgSrc);
        $('.' + xDID).css('display', "block");
        $('#' + xDID).val(imgSrc);
        $('#' + xDID + "*").val(imgSrc);
        var name = $('#' + xDID).attr('name');
        $.ajax({
            url: "/Task/UploadFileSignature",
            type: "POST",
            data: { FileName: name, imgSrc: imgSrc, isSearchDetail: true, did: xDID, ciid: xCIID },
            success: function (d) {

                var fileSign = $(".fileSign");

                fileSign.attr("style", "display:block !important");
                var down = fileSign.next();
                $(down).attr("style", "display:block !important");
            }
        });

    }
}

function newCanvas() {
    $(".contentSign").height(400);
    var canvas = '<canvas class="canvasBground" id="canvas" width="' + 450 + '" height="' + 400 + '"></canvas>';
    $(".contentSign").html(canvas);

    ctx = document.getElementById("canvas").getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    $("#canvas").drawTouch();
    $("#canvas").drawPointer();
    $("#canvas").drawMouse();
}

$.fn.drawTouch = function () {
    var start = function (e) {
        e = e.originalEvent;
        ctx.beginPath();
        x = e.changedTouches[0].pageX;
        y = e.changedTouches[0].pageY;
        ctx.moveTo(x, y);
        isSave = true;
    };
    var move = function (e) {
        e.preventDefault();
        e = e.originalEvent;
        x = e.changedTouches[0].pageX;
        y = e.changedTouches[0].pageY;
        ctx.lineTo(x, y);
        ctx.stroke();
    };
    $(this).on("touchstart", start);
    $(this).on("touchmove", move);

};

$.fn.drawPointer = function () {
    var start = function (e) {
        e = e.originalEvent;
        ctx.beginPath();
        x = e.offsetX;
        y = e.offsetY;
        ctx.moveTo(x, y);
        isSave = true;
    };
    var move = function (e) {
        e.preventDefault();
        e = e.originalEvent;
        x = e.offsetX;
        y = e.offsetY;
        ctx.lineTo(x, y);
        ctx.stroke();
    };
    $(this).on("MSPointerDown", start);
    $(this).on("MSPointerMove", move);

};

$.fn.drawMouse = function () {
    var clicked = 0;
    var start = function (e) {
        clicked = 1;
        ctx.beginPath();
        x = e.offsetX;
        y = e.offsetY;
        ctx.moveTo(x, y);
        isSave = true;
    };
    var move = function (e) {
        if (clicked) {
            x = e.offsetX;
            y = e.offsetY;
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };
    var stop = function (e) {
        clicked = 0;
    };
    $(this).on("mousedown", start);
    $(this).on("mousemove", move);

    $(window).on("mouseup", stop);
};