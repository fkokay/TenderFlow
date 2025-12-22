if ($('#SelectedViewID').val() != 0) {

    var idleTime = 0;
    $(document).ready(function () {

        var idleInterval = setInterval(timerIncrement, 2000);

        $(this).mousemove(function (e) {
            idleTime = 0;
            $("[aria-labelledby=select2-SelectedViewID-container]").finish();
            $("[aria-labelledby=select2-SelectedViewID-container] span.select2-selection__arrow").css("display", "unset")
            $("[aria-labelledby=select2-SelectedViewID-container] span.select2-selection__clear").css("display", "unset")
            $("[aria-labelledby=select2-SelectedViewID-container]").stop(true, true);
        });
        $(this).keypress(function (e) {
            idleTime = 0;
            $("[aria-labelledby=select2-SelectedViewID-container]").finish();            
            $("[aria-labelledby=select2-SelectedViewID-container] span.select2-selection__arrow").css("display", "unset")
            $("[aria-labelledby=select2-SelectedViewID-container] span.select2-selection__clear").css("display", "unset")
            $("[aria-labelledby=select2-SelectedViewID-container]").stop(true, true);
        });


    });

    function timerIncrement() {
        idleTime = idleTime + 1;
        
        if (idleTime > 3) {

            $("[aria-labelledby=select2-SelectedViewID-container] span.select2-selection__arrow").css("display", "none")
            $("[aria-labelledby=select2-SelectedViewID-container] span.select2-selection__clear").css("display", "none")
            $("[aria-labelledby=select2-SelectedViewID-container]").effect("bounce", { times: 1 }, 3000);
        }
    }
}