$(function () {

    $('.k-grid-content').each(function () {
        var sizelist = getInitialSize($(this).find("table"));
        SetTableFrozen($(this).find("table"), 0, sizelist);
    })

    $('.k-auto-scrollable').scroll(function () {

        var browser = detectIE();
        if (browser) {
            var freeze = $('.k-auto-scrollable').find("td").attr("freeze");
            if (freeze === "true") {
                var leftAmount = $(this).scrollLeft()
                var sizelist = getInitialSize($(this).find("table"));
                SetTableFrozen($(this).find("table"), leftAmount, sizelist);
            }
        } else {
            var freeze = $('.k-auto-scrollable').find("td").attr("freeze");
            var first = $('.k-auto-scrollable').hasClass("first");
            
            if (freeze === "true" && first === true) {
                var leftAmount = $(this).scrollLeft()
                var sizelist = getInitialSize($(this).find("table"));
                SetTableFrozen($(this).find("table"), leftAmount, sizelist);
                $('.k-auto-scrollable').removeClass("first");
            }
        }
    });
});

function getInitialSize(grid) {
    var sizeList = [];
    grid.find('tbody > tr').each(function () {
        $(this).find('td').each(function () {
            var object = { id: $(this).attr("columnid"), width: $(this).width(), maxwidth: $(this).outerWidth() };
            sizeList.push(object);
        })
    })
    return sizeList;
}

function SetTableFrozen(grid, leftAmount, sizelist) {
    var list = [];
    var listTest = [];
    var object = {};
    var leftOffset = leftAmount;

    var msie = detectIE();
    grid.find('tbody > tr').each(function () {
        var size = 0;
        var iesize = 0;
        var lastitem = 0;
        var isSet = true;
        var frozeCellWidth = 0;
        var lastieItem = object;
        $(this).find('td').each(function () {

            var item = $(this);
            if ($(this).attr("freeze") === "true") {

                var width = $(this).width();
                var innerwidth = $(this).outerWidth();
                lastieItem = $(this);
                $(this).css("z-index", 8000);
                $(this).css("background-color", "#f5f5f5");

                var ieItem = getObjects(sizelist, "id", item.attr("columnid"))

                if (msie > 0) {
                    $(this).css("position", "absolute");
                    $(this).css("left", size + leftOffset);

                    $(this).css("max-width", ieItem[0].maxwidth);
                    $(this).css("width", ieItem[0].width);
                    lastitem = ieItem[0].maxwidth;

                    size = size + ieItem[0].maxwidth;
                    object = { id: $(this).attr("columnid"), width: ieItem[0].width, maxwidth: ieItem[0].maxwidth };
                    listTest.push(object);
                } else {
                    $(this).css("position", "sticky");
                    $(this).css("position", "-webkit-sticky");
                    $(this).css("min-width", innerwidth);
                    $(this).css("max-width", innerwidth);
                    $(this).css("margin-left", 0);
                    $(this).css("left", size);
                    lastitem = innerwidth;

                    size = size + innerwidth;
                    object = { id: $(this).attr("columnid"), width: innerwidth, maxwidth: ieItem[0].maxwidth };
                    listTest.push(object);
                }


            } else {
                if (msie > 0) {

                    $(this).css("left", size - lastitem);
                    $(this).css("position", "relative");

                }
            }
        })
        //lastieItem.css("width", lastieItem.maxwidth);
    })
    var headGrid = grid.parent().prev();
    headGrid.find("table").find('thead > tr').each(function () {
        var size = 0;
        iesize = 0;
        var lastitem = 0;
        var isSet = true;
        var lastieItem = object;
        $(this).find('th').each(function () {
            var items = getObjects(listTest, "id", $(this).attr("data-field"));

            if (items.length > 0) {
                lastieItem = $(this);
                $(this).css("position", "sticky");
                $(this).css("z-index", 8000);
                $(this).css("background-color", "#f5f5f5");


                if (msie > 0) {
                    $(this).css("position", "absolute");
                    $(this).css("width", items[0].width + 5);
                    $(this).css("max-width", items[0].maxwidth);
                    $(this).css("left", size + leftOffset);
                    lastitem = items[0].maxwidth;
                    size = size + items[0].maxwidth;

                } else {
                    $(this).css("position", "sticky");
                    $(this).css("left", size);
                    $(this).css("position", "-webkit-sticky");
                    $(this).css("width", items[0].maxwidth);
                    $(this).css("max-width", items[0].maxwidth);
                    lastitem = items[0].width;
                    size = size + items[0].width;
                }



            } else {
                if (msie > 0) {

                    $(this).css("left", size - lastitem);
                    $(this).css("position", "relative");

                }
            }

        })
    })

    var footer = grid.parent().next();
    var table = footer.find("table");
    table.css("position", "inherit");
    table.css("z-index", 8000);
    table.css("left", leftAmount);
};

function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    var fire = ua.indexOf('Firefox/');
    if (fire > 0) {
        return 2;
    }
    var saf = ua.indexOf('safari/');
    if (saf > 0) {
        return 2;
    }
    // other browser
    return false;
}

function getObjects(obj, key, val) {

    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] === 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else
            //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
            if (i === key && obj[i] === val || i === key && val === '') { //
                objects.push(obj);
            } else if (obj[i] === val && key === '') {
                //only add if the object is not already in the array
                if (objects.lastIndexOf(obj) == -1) {
                    objects.push(obj);
                }
            }
    }

    return objects;
}