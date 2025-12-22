$(document).ready(function () {

    $('.select2-me').select2({ language: EFlang.localeCode });

    $('.timepicker1').timepicker({
        minuteStep: 1,
        defaultTime: '',
        showSeconds: false,
        showMeridian: false,
        snapToStep: true
    }).on('changeDate', function (e) {
        $(this).timepicker('hide');
    });
    if ($('#Reminder').is(':checked')) {
        $(".reminder-panel").removeClass("kt-hidden");
    } else {
        $(".reminder-panel").addClass("kt-hidden");
    }

    $('#SaveUsrSignOptions').bind("click", function () {
        $('#SignPage').val($('#ddlESignUsrPdfPageSize').val());
        var selectedCell = 0;
        document.querySelectorAll("table.es-usr-table-sign tbody tr td div.es-usr-table-cell").forEach(div => {
            var esImg = div.querySelector("img#eSignUsrImg");
            if (esImg) {
                selectedCell = parseIntOrDefault(div.getAttribute("data-id"));
            }
        });
        if (selectedCell == 0) {
            swal({
                position: 'top-right',
                type: 'info',
                text: "E-İmza: Lütfen E-İmza konumunu seçiniz",
                showConfirmButton: false,
                timer: 5000
            });
        } else {
            $('#SignLoc').val(selectedCell);
            $('#user_modal_sign_location').modal('hide');
        }
    });

    $('#SaveOptions').bind("click", function () {
        
        if ($('#IsUserESignPlacement').is(':checked')) {
            if ($('#SignLoc').val() == '') {
                swal({
                    position: 'top-right',
                    type: 'info',
                    text: "E-İmza: Lütfen E-İmza konumunu seçiniz",
                    showConfirmButton: false,
                    timer: 5000
                });
                return false;
            }
        } else {
            $('#SignPage').val('');
            $('#SignLoc').val('');
        }

        if ($('#Reminder').is(':checked')) {
            if (checkBoxListValidation()) {
                ChangesSaved();
                setTimeout(function () {
                    $("#form-options").submit();
                }, 750);
            } else {
                return false;
            }
        }
        else {
            ChangesSaved();
            setTimeout(function () {
                $("#form-options").submit();
            }, 750);
        }
    });

    var onSuccess = function (result) {

        if (result === 'Ok') {
            swal({
                position: 'top-right',
                type: 'success',
                text: changesSaved,
                showConfirmButton: true,
                timer: 1500
            });
        }
    }

    function ChangesSaved() {
        swal({
            position: 'top-right',
            type: 'success',
            text: changesSaved,
            showConfirmButton: true,
            timer: 1500
        });
    }

    $('#Reminder').click(function () {
        if ($(this).is(':checked')) {
            $(".reminder-panel").removeClass("kt-hidden");
            removeRequired(false);
        } else {
            $(".reminder-panel").addClass("kt-hidden");
            removeRequired(false);
        }
    });

    clearPostState();

    //validation inputs
    function removeRequired(flag) {
        $(".reminder-panel :input").each(function () {
            var input = $(this);
            if (input.attr("name") === "ReminderTime") {
                if (flag)
                    input.removeAttr("required");
                else
                    input.attr("required", "true");
            }
        });
    }

    //checkbox list validation
    function checkBoxListValidation() {
        var flag = false;
        $("input[name='ReminderSelectedDays']").each(function () {
            var input = $(this);
            if (input.prop("checked")) {
                flag = true;
            }
            input.removeAttr("required");
        });
        if (!flag) {
            $("input[name='ReminderSelectedDays']").each(function () {
                var input = $(this);

                input.parents(".form-group").addClass("text-danger");
            });
        } else {
            $("input[name='ReminderSelectedDays']").each(function () {
                var input = $(this);
                input.parents(".form-group").removeClass("text-danger");
            });
        }
        if ($(".timepicker1").val() === "") {
            flag = false;
            $(".timepicker1").parents(".form-group").addClass("text-danger");
        } else {
            $(".timepicker1").parents(".form-group").removeClass("text-danger");
        }

        if ($("#SelectedView").val() === "") {
            flag = false;
            $("#SelectedView").parents(".form-group").addClass("text-danger");
        } else {
            $("#SelectedView").parents(".form-group").removeClass("text-danger");
        }

        return flag;
    }

    /* ESIGN PLACEMENT START*/
    document.querySelectorAll(".es-usr-table-cell").forEach(div => {
        div.onclick = function (ev) { setImageToCellUsr(ev); };
    });
    document.querySelector("#IsUserESignPlacement").onchange = function (ev) {
        if ($("#IsUserESignPlacement").is(":checked"))
            $("#isUserESignPlacementEdit").show();
        else {
            $("#isUserESignPlacementEdit").hide();
        }
    };
    $("#isUserESignPlacementEdit").click(function () { $('#user_modal_sign_location').modal('show'); });
    function setImageToCellUsr(ev) {
        document.querySelectorAll(".es-usr-table-cell").forEach(element => { element.innerHTML = ""; });
        var el = document.getElementById('eSignUsrImg');
        ev.target.appendChild(el.cloneNode(true));
    }
    /* ESIGN PLACEMENT END */
});

