nodes = {};
function bindNodes() {

    nodes = $(".item");

    //draggable items initial
    nodes.draggable({
        helper: "clone",
        revert: "invalid",
        zIndex: 1000
    });

    //drop area
    $(".cart, .cart1").droppable({
        greedy: true,
        drop: function (event, ui) {
            if (!ui.draggable.hasClass("cont")) {
                var dropped = ui.draggable.clone();
                var text = dropped.find("input[type=text]").val();
                if (text !== undefined) {
                    var grid = generateGrid(text);
                    $(this).append('<div class="cont dialog"><span class="closebutton close-classic" >&times;</span >' + grid + '</div>');
                } else {

                    if (dropped.find("img")) {
                        var item = dropped.find("img");
                        item.addClass("imgUpload");
                    }
                    $(this).append('<div class="cont dialog"><span class="closebutton close-classic">&times;</span >' + dropped.html() + '</div>');
                }

                bindNodes();
            }
        }
    });

    //remove html element from html
    $(".closebutton").click(function () {
        $(this).parent().remove();
    });

    //show remove button on hover
    $('.cont').hover(function (e) {
        $(this).children(".closebutton").css("visibility", "initial");
    }, function () {
        $(this).children(".closebutton").css("visibility", "hidden");
    });

    loadUpload();
    var borderThickness = $("#TableBorderSize").val();
    $("#TableBorderSize").val(borderThickness).change();
}

//bind upload file
function loadUpload() {
    //fileupload 
    $(".imgUpload").each(function (index, item) {

        $(this).unbind();
        var fileupload = $(this).next();
        $(this).click(function () {
            fileupload.click();
        });
        fileupload.change(function () {
            var image = $(this).prev();
            var formData = new FormData();
            var totalFiles = $(this)[0].files.length;
            for (var i = 0; i < totalFiles; i++) {
                var file = $(this)[0].files[i];

                formData.append("FileUpload", file);
            }
            $.ajax({
                type: "POST",
                url: '/Partials/Upload',
                data: formData,
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function (response) {
                    image.attr("src", response);
                },
                error: function (error) {
                    alert(error);
                }
            });
        });

    });
}
//Grid generator
function generateGrid(input) {

    var parts = input.trim().replace(/ /g, '').split('');
    var grid = "";
    var sum = 0;
    for (var i = 0; i < parts.length; i++) {
        sum += parseInt(parts[i]);
    }
    var avg = 100 / sum;
    if (parts.length > 0) {
        grid = '<table style="width:100%;border:1px solid #808080" border="1">';
        for (var j = 0; j < parts.length; j++) {
            var yuzde = parts[j] * avg;
            grid += '<td class="cart1" width="' + yuzde + '%" ></td>';
        }
        grid += '</table>';
    }
    return grid;
}

$(document).ready(function () {

    bindNodes();
    //Add close buttons to html template
    testAjax(function (output) {

        $("#cart").html(output.TaskNotice_Html);
        setEventAction();
        bindNodes();
    });
    //slide when clicked to panel
    $(".panel-heading").click(function () {
        $(this).next(".panel-body").slideToggle("slow", function () {

        });
    });
    //slide only first panel
    $(".products .panel-body").each(function (index, elem) {
        if (index === 0) {
            //...
        }
        else {
            $(elem).slideUp();
        }
    });
    //html save
    $("#btnSave").click(function () {
        //LoadingStart();
        $("#cart span").each(function (index) {

            if ($(this).hasClass("closebutton")) {
                $(this).remove();
            }
        });
        $(".cont :input").each(function (index) {
            if ($(this)[0].type === "file")
                $(this).remove();
        });
        if ($("#cart").html() != "") {
            $('#cart param').each(function () { if ($(this).attr("name") === "borderthickness") $(this).remove(); });
            if ($("#cart").html() != "")
                $("#cart").append('<param name="borderthickness" value="' + $("#TableBorderSize").val() + '"/>');
        }

        var htmlContent = $("#cart").html();
        var companyId = $("#companyId").val();
        var type = $('input[name=iCheck]:checked').val();
        var taskId = $("#TaskList").val();        
        if (type == 'Task' && (taskId == null || taskId == '')) {
            swal({
                position: 'top-right',
                type: 'warning',
                text: 'Görev formu seçimi yapılmadı',
                showConfirmButton: true,
                timer: 1500
            });
            return;
        }
        $.ajax({
            type: "POST",
            url: "/Partials/HtmlBuilder",
            data: "{html:'" + htmlContent + "',companyId:'" + companyId + "',type :'" + type + "',taskId :'" + taskId + "'}",
            contentType: "application/json",
            dataType: "json",
            success: function (data) {

                SaveSucceded();
                setEventAction();
                bindNodes();
                //LoadingStop();
            },
            error: function (err) {
                toastr.error(err.statusText);
                LoadingError();
            }
        });

    });

    //dropdown course changed
    $("#Course").on("change", function () {
        var cid = $(this).val();
        $.ajax({
            type: "POST",
            url: "/Partials/GetTasks",
            data: "{CID:'" + cid + "'}",
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                $("#TaskList").html("");
                $.each(data, function (index, item) {
                    $("#TaskList").append($('<option></option>').text(item.Text).val(item.Value));
                });

            },
            error: function (data) {
                toastr.error(error);
            }
        });
    });

    //dropdown Task changed
    $("#TaskList").on("change", function () {
        $("#TableBorderSize").val(0);
        var tid = $(this).val();
        $.ajax({
            type: "POST",
            url: "/Partials/GetTaskButtons",
            data: "{TID:'" + tid + "'}",
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                var buttonList = $("#taskButtons").find(".panel-body");
                buttonList.html("");
                $.each(data, function (index, item) {
                    buttonList.append('<li class="list-group-item"><div class="item">'
                        + '<table width="100%" cellspacing="0" cellpadding="0">'
                        + '<tr>'
                        + '<td>'
                        + '<table cellspacing="0" cellpadding="0">'
                        + '<tr>'
                        + '<td style="border-radius: 2px;" bgcolor="' + item.BackGround + '">'
                        + '<a style="padding: 8px 12px;border: 1px solid ' + item.BackGround + ' ;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px;text-decoration: none;font-weight:bold;display: inline-block;color:' + item.TextColor + '" id=' + item.ButtonID + ' href="#~' + item.ButtonName + '~">' + item.ButtonName + '</a>'
                        + '</td>'
                        + '</tr>'
                        + '</table>'
                        + '</td>'
                        + ' </tr>'
                        + '</table>');
                });
                bindNodes();
            },
            error: function (data) {
                toastr.error(error);
            }
        });

        $.ajax({
            type: "POST",
            url: "/Partials/GetTaskInputs",
            data: "{TID:'" + tid + "'}",
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                var inputList = $("#htmlVariable").find(".inputListdiv");
                inputList.html("");
                $.each(data, function (index, item) {
                    inputList.append('<li class="list-group-item"><div class="item"><p>%' + item.Name + '% </p></div></li>');
                });
                bindNodes();
            },
            error: function (data) {
                toastr.error(error);
            }
        });
        if (Number(tid) > 0) {
            $.ajax({
                type: "POST",
                url: "/Partials/GetTaskHtml",
                data: "{TID:'" + tid + "'}",
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    $("#cart").html(data.Notice_Html);
                    if (data.Notice_Html.toLowerCase().indexOf('<param name="borderthickness"') > -1) {
                        var borderThickness = $("#cart param").each(function () { if ($(this).attr("name") === "borderthickness") { return $(this); } });
                        if (borderThickness != undefined) {
                            $("#TableBorderSize").val(borderThickness.last().attr("value")).change();
                        } else {
                            $("#TableBorderSize").val("1").change();
                        }
                    } else {
                        $("#TableBorderSize").val("1").change();
                    }
                    setEventAction()
                    bindNodes();
                },
                error: function (data) {
                    toastr.error(error);
                }
            });
        }

    });

    //dropdown Table Border Size changed
    $("#TableBorderSize").on("change", function () {
        var borderThickness = $(this).val();
        borderThickness = borderThickness == "0" ? "1" : borderThickness;
        changeBorderThickness(borderThickness);
    });
    function changeBorderThickness(val) {
        $("#cart table").each(function () {
            if ($(this).attr("border") !== undefined) {
                $(this).attr('border', val);
                $(this).css('border', val + 'px solid #808080');
            }
        });

        $("#cart .cart1.ui-droppable").each(function () {
            $(this).css('border', val + 'px solid #808080');
        });
    }

    // radio button changed
    $('input').click(function () {
        var value = $(this).val();
        if (value == 'Task') {
            $("#UserVariable").addClass("hidden");
            $("#htmlVariable").removeClass("hidden");
            $("#taskButtons").removeClass("hidden");
            $("#customBuil").removeClass("hidden");
            TaskHtml(function (output) {
                $("#cart").html("");
                $("#cart").html(output.Notice_Html);
                setEventAction();
                bindNodes();
            });
        } else {
            $("#taskButtons").addClass("hidden");
            $("#customBuil").addClass("hidden")
        }
        if (value == "User") {
            $("#UserVariable").removeClass("hidden");
            $("#htmlVariable").addClass("hidden");
            testAjax(function (output) {

                $("#cart").html(output.NewUser_Html);
                setEventAction();
                bindNodes();
            });

        }
        if (value == "Html") {
            $("#UserVariable").addClass("hidden");
            $("#htmlVariable").removeClass("hidden");

            testAjax(function (output) {

                $("#cart").html(output.TaskNotice_Html);
                setEventAction();
                bindNodes();
            });
        }

        loadUpload();
    });
    //fill htmls
    function TaskHtml(handleData) {
        var tid = $("#TaskList").val();
        if (tid == null) {
            handleData("");
            return;
        }
        $.ajax({
            type: "POST",
            url: "/Partials/GetTaskHtml",
            data: "{TID:'" + tid + "'}",
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                handleData(data);
            }
        });
    }
    function testAjax(handleData) {
        $.ajax({
            type: "POST",
            url: "/Partials/GetHtml",
            data: "{_CompanyId:'" + companyId + "'}",
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                handleData(data);
            }
        });
    }
    //loading panels
    function LoadingStart() {
        $('.checkmark').css("display", "none");
        $('.circle-loader').removeClass('load-complete');
        $("#wait").css("display", "initial");
    }
    function LoadingStop() {

        $('.circle-loader').addClass('load-complete');
        $('.checkmark').css("display", "initial");

        setTimeout(function () {
            $("#wait").css("display", "none");
        }, 2000)

    }
    function LoadingError() {
        $("#wait").css("display", "none");
    }
    //add removed button and file upload items to html
    function setEventAction() {
        $("#cart .cont").each(function (index) {
            $(this).prepend('<span class="closebutton close-classic" >&times;</span >');
        });
        $(".cont img").each(function (index) {
            $(this).after('<input type="file" id="FileUpload" accept=".jpg,.jpeg,.gif,.png,.tif" style=" overflow: hidden; display: none;  visibility: hidden;" />');
        });
    }

    function SaveSucceded() {
        swal({
            position: 'top-right',
            type: 'success',
            text: 'Değişiklikler başarıyla kaydedildi.',
            showConfirmButton: true,
            timer: 1500
        });
    }
});