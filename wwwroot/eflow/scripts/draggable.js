"use strict";

var KTPortletDraggable = function () {

    return {
        //main function to initiate the module
        init: function () {
            $(".ktportlets_searchdetail").sortable({
                connectWith: ".kt-portlet__move",
                items: ".kt-portlet-drag",
                opacity: 0.8,
                handle: '.kt-portlet__move',
                coneHelperSize: true,
                placeholder: 'kt-portlet--sortable-placeholder',
                forcePlaceholderSize: true,
                tolerance: "pointer",
                helper: "clone",
                cancel: ".kt-portlet--sortable-empty", // cancel dragging if portlet is in fullscreen mode
                revert: 250, // animation in milliseconds
                update: function (b, c) {
                    if (c.item.prev().hasClass("kt-portlet--sortable-empty")) {
                        c.item.prev().before(c.item);
                    }

                    var positions = JSON.stringify($(".ktportlets_searchdetail").sortable('toArray'));
                    localStorage.setItem('sd_portlet_positions_v31', positions);

                }
            });
        },
        getLastOrder: function () {

            if (localStorage.sd_portlet_positions_v31) {

                var $sortable = $('.ktportlets_searchdetail');
                var positions = JSON.parse(localStorage.getItem('sd_portlet_positions_v31'));
                if (positions) {
                    $.each(positions, function (i, position) {
                        var $target = $sortable.find('#' + position);
                        $target.appendTo($sortable); // or prependTo for reverse
                    });
                }
            }

        }
    };
}();

jQuery(document).ready(function () {

    if (dragDropPortlets) {

        KTPortletDraggable.getLastOrder();

        KTPortletDraggable.init();

        $(".ktportlets_searchdetail").css("visibility", "")
        $(".loadingDiv").hide();
    }
});