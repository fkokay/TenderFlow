"use strict";

var KTAppUserAdd = function () {

    var wizard;

    var initWizard = function () {

        wizard = new KTWizard('kt_apps_user_add_user', {
            startStep: 1,
        });

        wizard.on("beforeNext", function (wizard) {

            validateKtForm();

            var isValid = $('#frmData').valid();

            if (isValid == false && wizard.getStep() == 1) {

                wizard.stop();
            }
        })

        wizard.on('change', function (wizard) {

            KTUtil.scrollTop();
        });
    }

    var goNextStep = function (number) {

        validateKtForm();

        if ($("#frmData").valid()) {
            wizard.goTo(number)
        }
    }

    var goBackStep = function () {

        wizard.goFirst();
    }

    var validateKtForm = function () {

        $('#frmData').validate({
            rules: {
                Name: {
                    required: true,

                }
            },
            messages: {
                Name: {
                    required: EFlang["Required"]
                }
            },
        });
    }

    return {

        init: function () {
            initWizard();
        },
        letsGoToNext: function (number) {
            goNextStep(number);
        },
        letsGoToBack: function () {
            goBackStep();
        },
    };
}();

var contentType = {
    seciniz: "1",
    sorgu: "2",
    surec: "3"
}
function course_radio_change(obj) {
    var cid = $(obj).val();
    var dbID = $("#process_connection_string").val();
    $("#veri_elementleri").html('');
    $.ajax({
        url: "/Reports/GetCourseElements",
        type: "GET",
        data: { "CID": cid, "dbID": dbID },
        success: function (elements) {
            elements.forEach(function (element) {
                var checboxElement = '<label class="kt-checkbox kt-checkbox--bold kt-checkbox--brand" style="display:block;">' +
                    ' <label for= "' + element.NAME + element.DID + '" >' + element.DISPLAYNAME + '</label>' +
                    ' <input id="' + element.NAME + element.DID + '" type="checkbox" class="icheck-me" data-skin="square" data-color="aero"  value="' + element.DID + '" name="veri_elements" />' +
                    '<span></span></label>';
                $("#veri_elementleri").append(checboxElement);
            });
        }
    });
}


jQuery(document).ready(function () {
    KTAppUserAdd.init();

    $(".kt-wizard-v4__nav").find("#aStep2,#aStep3").hide();

    $("#content-type").change(function () {
        $("#content-type").next(".select2").find(".select2-selection.select2-selection--single").removeClass("is-invalid");
        var val = $(this).val();
        if (val == contentType.surec) {
            $("#Query").val('');
        }
        $(".kt-wizard-v4__nav").find("#aStep2,#aStep3").hide();
        $(".kt-wizard-v4__nav").find("#aStep" + val).show();

    });

    $("#process_connection_string").change(function () {

        $("#processes_radios").html('');
        var dbID = $(this).val();
        $.ajax({
            url: "/Reports/GetCourseMasters",
            type: "GET",
            data: { "dbID": dbID },
            success: function (data) {
                data.forEach(function (d) {
                    var radioelements = '<label class="kt-radio kt-radio--bold kt-radio--brand" style="display:block;">' +
                        ' <label for= "' + d.CourseName + '-' + d.CID + '" >' + d.CourseName + '</label>' +
                        ' <input id="' + d.CourseName + '-' + d.CID + '" type="radio" class="icheck-me" data-skin="square" data-color="aero"  value="' + d.CID + '" name="course_id" onchange="course_radio_change(this);" />' +
                        '<span></span></label>';
                    $("#processes_radios").append(radioelements);
                });
            },
            error: function () {
            }
        });
    });

    $("#search-checkbox").keyup(function () {
        var searchval = $(this).val();
        var checks = $("#veri_elementleri").find("label.kt-checkbox");
        if (searchval != "") {
            checks.each(function () {
                var lbl = $(this);
                var chktext = $(lbl.find("label")[0]).text();
                if (chktext.toLowerCase().includes(searchval.toLowerCase())) {
                    lbl.show();
                }
                else {
                    lbl.hide();
                }
            });
        }
        else {
            checks.show();
        }
    });

    $("#search-radio").keyup(function () {
        var searchval = $(this).val();
        var radios = $("#process_card").find("label.kt-radio");
        if (searchval != "") {
            radios.each(function () {
                var lbl = $(this);
                var rdtext = $(lbl.find("label")[0]).text();
                if (rdtext.toLowerCase().includes(searchval.toLowerCase())) {
                    lbl.show();
                }
                else {
                    lbl.hide();
                }
            });
        }
        else {
            radios.show();
        }
    });   
});