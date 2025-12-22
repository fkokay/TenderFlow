$(document).ready(function () {

    var stickyToggle = function (sticky, stickyWrapper, scrollElement) {

        var stickyHeight = sticky.outerHeight();
        var stickyTop = stickyWrapper.offset().top;
        if (scrollElement.scrollTop() >= stickyTop) {
            stickyWrapper.height(stickyHeight);
            sticky.addClass("is-sticky");

            if ($('.clickedAddButton').length == 0) {
                $(".k-pager-wrap").append("<button onclick='addNewRowBottom()' type='button' class='clickedAddButton btn btn-primary'><i class='flaticon2-add-1'></i> Yeni Satır Ekle</button>");
            }
        }
        else {
            $(".clickedAddButton").remove();
            sticky.removeClass("is-sticky");
            stickyWrapper.height('auto');
        }
    };

    $('[data-toggle="sticky-onscroll"]').each(function () {
        var sticky = $(this);
        var stickyWrapper = $('<div>').addClass('sticky-wrapper');
        sticky.before(stickyWrapper);
        sticky.addClass('sticky');

        // Scroll & resize events
        $(window).on('scroll.sticky-onscroll resize.sticky-onscroll', function () {
            stickyToggle(sticky, stickyWrapper, $(this));
        });

        // On page load
        stickyToggle(sticky, stickyWrapper, $(window));
    });

});