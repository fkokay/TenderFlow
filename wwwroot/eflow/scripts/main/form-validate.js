function formValidate() {
    $(".form-validate").length > 0 && $(".form-validate").each(function () {

        var e = $(this).attr("id");
        $("#" + e).validate({
            errorElement: "span",
            errorClass: "help-inline error",
            errorPlacement: function (e, t) {
                t.parents(".controls").append(e)
            },
            highlight: function (e) {
                $(e).closest(".control-group").removeClass("error success").addClass("error")
            },
            success: function (e) {
                e.addClass("valid").closest(".control-group").removeClass("error success");
                $("span.valid").remove();
                $('.TaskAction').prop("disabled", false);
            },
            error: function (e) {

            }
        })
    });
}
