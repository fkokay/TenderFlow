var ctxSub, colorSub = "#000";
var xDIDSub;
var xCIIDSub;
var isSaveSub = true;

$(document).ready(function () {

    $("#newSign-sub").click(function () {
        newCanvasSub();
        isSaveSub = false;
    });

    $('.showSign-sub').on('click', function () {
        newCanvasSub();
        xDIDSub = $(this).attr("datadid");
        xCIIDSub = $(this).attr("datadciid");
        $('#signModal-sub').modal('show');
    });

    $(".btnSignImage-sub").on("click", function () {
        var canSub = $('#canvasSub')[0];
        drawAndConvertStuffSub(canSub);
    })

    //Delete File 
    $(".fileSign-sub").click(function () {

        var btnDeleteSub = $(this);

        swal({
            title: title,
            text: question,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: okprocess,
            cancelButtonText: cancelProcess
        }).then(
            function (result) {
                if (result.value) {

                    var didSub = btnDeleteSub.attr("datadid");
                    var ciidSub = btnDeleteSub.attr("dataciid");
                    var targetSub = btnDeleteSub.attr("dataapp");

                    $.ajax({
                        url: "/Task/DeleteFile",
                        data: { did: didSub, ciid: ciidSub },
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        cache: false,
                        success: function (data) {

                            $("#subtaskform #" + targetSub).find("input:hidden").val("");
                            btnDeleteSub.attr("style", "display:none !important");
                            var downSub = btnDeleteSub.next();
                            $(downSub).attr("style", "display:none !important");
                            var imgSub = $("#subtaskform #" + targetSub).find("img");
                            imgSub.attr("src", "");
                            imgSub.css("display", "none");
                        }
                    });

                    swal({
                        title: '',
                        text: success,
                        type: 'success',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
    });
});

function drawAndConvertStuffSub(canvas) {

    var canvasContext = canvas.getContext('2d');

    if (isSaveSub) {

        var imgSrcSub = canvas.toDataURL("image/png");
        $('.' + xDIDSub).removeClass("hide");
        $('.' + xDIDSub).attr('src', imgSrcSub);
        $('.' + xDIDSub).css('display', "block");
        $('#' + xDIDSub).val(imgSrcSub);
        $('#' + xDIDSub + "*").val(imgSrcSub);
        var nameSub = $('#' + xDIDSub).attr('name');

        $.ajax({
            url: "/Task/UploadFileSignature",
            type: "POST",
            data: { FileName: nameSub, imgSrc: imgSrcSub },
            success: function (d) {
            }
        });
    }
}

function newCanvasSub() {

    //define and resize canvas
    $(".contentSign-sub").height(400);
    var canvasSub = '<canvas class="canvasBground" id="canvasSub" width="' + 450 + '" height="' + 400 + '"></canvas>';
    $(".contentSign-sub").html(canvasSub);

    // setup canvas
    ctxSub = document.getElementById("canvasSub").getContext("2d");
    ctxSub.strokeStyle = colorSub;
    ctxSub.lineWidth = 1;

    // setup to trigger drawing on mouse or touch
    $("#canvasSub").drawTouchSub();
    $("#canvasSub").drawPointerSub();
    $("#canvasSub").drawMouseSub();
}

$.fn.drawTouchSub = function () {

    var startSub = function (e) {
        e = e.originalEvent;
        ctxSub.beginPath();
        x = e.changedTouches[0].pageX;
        y = e.changedTouches[0].pageY;
        ctxSub.moveTo(x, y);
        isSaveSub = true;
    };
    var moveSub = function (e) {
        e.preventDefault();
        e = e.originalEvent;
        x = e.changedTouches[0].pageX;
        y = e.changedTouches[0].pageY;
        ctxSub.lineTo(x, y);
        ctxSub.stroke();
    };
    $(this).on("touchstart", startSub);
    $(this).on("touchmove", moveSub);
};

$.fn.drawPointerSub = function () {

    var startSub = function (e) {
        e = e.originalEvent;
        ctxSub.beginPath();
        x = e.offsetX;
        y = e.offsetY;
        ctxSub.moveTo(x, y);
        isSaveSub = true;
    };
    var moveSub = function (e) {
        e.preventDefault();
        e = e.originalEvent;
        x = e.offsetX;
        y = e.offsetY;
        ctxSub.lineTo(x, y);
        ctxSub.stroke();
    };
    $(this).on("MSPointerDown", startSub);
    $(this).on("MSPointerMove", moveSub);
};

$.fn.drawMouseSub = function () {

    var clickedSub = 0;
    var startSub = function (e) {
        clickedSub = 1;
        ctxSub.beginPath();
        x = e.offsetX;
        y = e.offsetY;
        ctxSub.moveTo(x, y);
        isSaveSub = true;
    };
    var moveSub = function (e) {
        if (clickedSub) {
            x = e.offsetX;
            y = e.offsetY;
            ctxSub.lineTo(x, y);
            ctxSub.stroke();
        }
    };
    var stopSub = function (e) {
        clickedSub = 0;
    };

    $(this).on("mousedown", startSub);
    $(this).on("mousemove", moveSub);
    $(window).on("mouseup", stopSub);
};