//<reference path="../jquery-1.7.2-vsdoc.js" />

var processStartMsg = "";
var processName = "";
var processAID = 0;
var processTimeOut = 0;
var treeViewItemCollection = Array();
var filterDataSource;
var treeViewObjectCollection;

$(document).ready(function () {
    SetLeftMenuActions();
    SetPopupActions();
});

var colcolor = false;

function SetLeftMenuActions() {
    $('.prgStart').bind('click', function (e) {
        e.preventDefault();
        var aid = $(this).attr('aid');
        var timeo = $(this).attr('timeout');
        ShowProgressPopup(aid, timeo, $.trim($(this).find("span").html()));
    });
}


function ShowFilter(aid) {

    window.location.href = '/Search/Advanced?Type=view&Fid=' + aid;

}


function StartCourse(aid, timeout) {
  
    var lastTimeout = parseInt(timeout) + 2000;
    $.ajax({
        url: "/Partials/StartCourse",
        type: "GET",
        data: { "AID": aid, "Timeout": timeout },     
        success: function (d) {
            var data = jQuery.parseJSON(JSON.stringify(d));
            if (data.Redirect == true) {
                window.location.href = '/Task/Detail?Type=work&TIID=' + data.TIID;
            }
            else {
                $('#start-process-modal').modal("hide");
            }
        },
        error: function () {
            $('#start-process-modal').modal("hide");
        },
        timeout: lastTimeout,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false
    });
}

function ShowProgressPopup(aid, timeout, progressName) {
    setFullMask();
    var winW = $(window).width();
    $('#ManuelPopup .popcontent label').html(EFlang.StartProcess.replace('{0}', progressName));
    $('#ManuelPopup').css('left', winW / 2 - $('#ManuelPopup').width() / 2);
    $('#ManuelPopup').attr('aid', aid);
    $('#ManuelPopup').attr('timeout', timeout);
    $('#ManuelPopup').slideDown(500)
}

function ClosePopup(el) {
    var zindex;
    $('#backmask').css('z-index', function (index, value) {
        zindex = value;
    });
    if (zindex > 1070) {
        $('#backmask').css('z-index', 1070);
        $(el).parents('.eflowpopup').remove();
    }
    else {
        $(el).parents('.eflowpopup').slideUp(600, function () {
            $('#backmask').fadeOut(300);
            $("#surecloadgif").hide();
        });

    }
}

function setFullMask() {
    $('#backmask').show();
}

function SetPopupActions() {
    $(document).on('click', '.closepop', function (e) {
        e.preventDefault();
        ClosePopup(this);
    });
    $('.eflowpopup #srcbaslat').bind('click', function (e) {
    
        e.preventDefault();
        $(this).addClass('disabled');
        $('#ManuelPopup').find('.closepop').addClass('disabled');
        $('#ManuelPopup').find('#popupclose').hide();
        $("#surecloadgif").show();
    
        StartCourse($('#ManuelPopup').attr('aid'), $('#ManuelPopup').attr('timeout'));
    });
}

$(document).on("click", ".StartProcessOK", function (event) {
    $('.StartProcessOK').button('loading');
    $('.StartProcessOK').fadeOut('fast');
    $('#surecload-animation').show();

    StartCourse(processAID, processTimeOut);
});

var be;
$(document).ready(function () {

    var cookieval = $.cookie('EFTREEVIEW');

    if (cookieval != undefined) {
        treeViewObjectCollection = JSON.parse(cookieval);
    }



    //Left menude arama eklentisi

    $("#src").on("input", function () {
        var query = this.value.toLowerCase();
        var dataSource = $("#process-treeview").data("kendoTreeView").dataSource;

        filter(dataSource, query);
    });

    var treeview = $("#process-treeview").kendoTreeView({
        dataSource: {
            data: dataSourceItem
        },
        loadOnDemand: false,
        select: onProcessSelect,
        dataBound: function (e) {
            if (cookieval != undefined) {
                var element = this;
                $.each(treeViewObjectCollection, function (i, item) {

                    var barDataItem = element.dataSource.get(item.id);

                    if (barDataItem != undefined) {
                        var barElement = element.findByUid(barDataItem.uid);
                        if (item.expanded) {
                            $("li[data-uid=" + barDataItem.uid + "]").find(".folder").addClass("folder-open");
                        }
                        else {
                            element.collapse(barElement);
                            $("li[data-uid=" + barDataItem.uid + "]").find(".folder").removeClass("folder-open");
                        }
                    }
                });
            } else {
                $("li[role=treeitem]").find(".folder").addClass("folder-open");
            }
            $("#process-treeview").removeClass("hidden");
        }
    }).data("kendoTreeView");
    var dataTree = $("#process-treeview").data("kendoTreeView").dataSource._data;

    function filter(dataSource, query) {
        var hasVisibleChildren = false;
        var data = dataSource instanceof kendo.data.HierarchicalDataSource && dataSource.data();

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var text = item.text.toLowerCase();
            var itemVisible =
                query === true // parent already matches
                || query === "" // query is empty
                || text.indexOf(query) >= 0; // item text matches query

            var anyVisibleChildren = filter(item.children, itemVisible || query); // pass true if parent matches

            hasVisibleChildren = hasVisibleChildren || anyVisibleChildren || itemVisible;

            item.hidden = !itemVisible && !anyVisibleChildren;
        }

        if (data) {
            // re-apply filter on children
            dataSource.filter({ field: "hidden", operator: "neq", value: true });
        }

        return hasVisibleChildren;
    }
    //-------------------------------

    var treeObject = {
        expanded: dataTree[0].expanded,
        id: dataTree[0].id,
        icon: dataTree[0].spriteCssClass,
        text: dataTree[0].text,
        mode: "parent",
        uid: dataTree[0].uid
    }


    function SetItemToCookie(dt) {
        $.each(dt, function (i, item) {

            if (item.hasChildren) {
                treeObject = {
                    expanded: item.expanded,
                    id: item.id,
                    icon: item.spriteCssClass,
                    text: item.text,
                    mode: "sub",
                    uid: item.uid
                }
                treeViewObjectCollection.push(treeObject);
                SetItemToCookie(item.items);
            } else {

                treeObject = {
                    expanded: item.expanded,
                    id: item.id,
                    icon: item.spriteCssClass,
                    text: item.text,
                    mode: "sub",
                    uid: item.uid
                }
                treeViewObjectCollection.push(treeObject);
            }
        });

    }
    if (cookieval == undefined) {
        treeViewObjectCollection = [];

        treeViewObjectCollection.push(treeObject);
        SetItemToCookie(dataTree[0].items);
        //$.each(dataTree[0].items, function (i, item) {

        //    if (item.hasChildren) {
        //        treeObject = {
        //            expanded: item.expanded,
        //            id: item.id,
        //            icon: item.spriteCssClass,
        //            text: item.text,
        //            mode: "sub",
        //            uid: item.uid
        //        }
        //        treeViewObjectCollection.push(treeObject);
        //    }
        //});
    }
    else {
        treeViewObjectCollection = JSON.parse(cookieval);
    }

    $("#process-treeview").on("click", "li .k-state-selected", function (e) {
        var treeview = $("#process-treeview").data("kendoTreeView"), node = $(this).closest("li")[0];

        treeview.trigger("select", { node: node });

    });

    //GetFavFilters();

    $("#filter-treeview").on("click", "li .k-state-selected", function (e) {
        var treeview = $("#filter-treeview").data("kendoTreeView"),
                node = $(this).closest("li")[0];
        treeview.trigger("select", { node: node });
    });

    treeview.bind("expand", treeExpand);
    treeview.bind("collapse", treeCollapse);

    treeview.bind("select", function (e) {
        var data = $('#process-treeview').data('kendoTreeView').dataItem(e.node);
        var barDataItem = treeview.dataSource.get(data.id);
        var barElement = treeview.findByUid(barDataItem.uid);
        treeview.collapse(barElement);
    });

    var treeview1 = $("#filter-treeview").kendoTreeView({
        dataSource: filterDataSource,
        loadOnDemand: false,
        select: onFilterSelect,
        dataBound: function (e) {
            if (cookieval != undefined) {
                var element = this;
                $.each(treeViewObjectCollection, function (i, item) {
                    var barDataItem = element.dataSource.get(item.id);
                    if (barDataItem != undefined) {
                        var barElement = element.findByUid(barDataItem.uid);
                        if (item.expanded) {
                            $("li[data-uid=" + barDataItem.uid + "]").find(".folder").addClass("folder-open");
                        }
                        else {
                            element.collapse(barElement);
                            $("li[data-uid=" + barDataItem.uid + "]").find(".folder").removeClass("folder-open");
                        }
                    }
                });
            } else {
                $("li[role=treeitem]").find(".folder").addClass("folder-open");
            }
        }
    }).data("kendoTreeView");


    var nodeCount = treeview1.dataSource.data()[0].children.data().length;
    if (nodeCount == 0) {
        $("#filter-treeview").hide();
    }

    if (cookieval == undefined) {

        dataTree = $("#filter-treeview").data("kendoTreeView").dataSource._data;

        treeObject = {
            expanded: dataTree[0].expanded,
            id: dataTree[0].id,
            icon: dataTree[0].spriteCssClass,
            text: dataTree[0].text,
            mode: "parent",
            uid: dataTree[0].uid
        }

        treeViewObjectCollection.push(treeObject);
    }

    treeview1.bind("expand", filterTreeExpand);
    treeview1.bind("collapse", filterTreeCollapse);
});


function changeStatus(id, mode) {
    $.each(treeViewObjectCollection, function (i, item) {
        if (id == item.id) {
            item.expanded = mode;
        }
    });
    $.cookie('EFTREEVIEW', JSON.stringify(treeViewObjectCollection));
}

function filterTreeCollapse(e) {

    var data = $('#filter-treeview').data('kendoTreeView').dataItem(e.node);

    changeStatus(data.id, false);
    $.cookie('EFTREEVIEW', JSON.stringify(treeViewObjectCollection));


    $(e.node.firstChild).find(".folder").removeClass("folder-open");
}
function filterTreeExpand(e) {

    var data = $('#filter-treeview').data('kendoTreeView').dataItem(e.node);

    changeStatus(data.id, true);

    $.cookie('EFTREEVIEW', JSON.stringify(treeViewObjectCollection));

    $(e.node.firstChild).find(".folder").addClass("folder-open");
}

function treeCollapse(e) {

    var data = $('#process-treeview').data('kendoTreeView').dataItem(e.node);

    changeStatus(data.id, false);
    $.cookie('EFTREEVIEW', JSON.stringify(treeViewObjectCollection));


    $(e.node.firstChild).find(".folder").removeClass("folder-open");
}
function treeExpand(e) {

    var data = $('#process-treeview').data('kendoTreeView').dataItem(e.node);

    changeStatus(data.id, true);

    $.cookie('EFTREEVIEW', JSON.stringify(treeViewObjectCollection));

    $(e.node.firstChild).find(".folder").addClass("folder-open");
}


function GetFavFilters() {
    var tmp;
    filterDataSource = function () {
        $.ajax({
            'url': '/Partials/GetFavFilter', 
            'async': false,
            'type': "POST",
            'global': false,
            'dataType': 'json',
            'success': function (dt1) {
                tmp = JSON.parse("[" + dt1 + "]");
            }
        });
    }();
    filterDataSource = tmp;
}



function RefreshFavFilters() {
    $.ajax({
        url: "/Partials/GetFavFilter", 
        success: function (data) {
            var dataSource = JSON.parse("[" + data + "]");

            if (dataSource[0].items.length > 0) {

                $("#filter-treeview").show();

                var treeview = $("#filter-treeview").data("kendoTreeView");

                treeview.setDataSource(new kendo.data.HierarchicalDataSource({
                    data: JSON.parse("[" + data + "]"),
                }));

                $("#left").getNiceScroll().resize();

            } else {
                $("#filter-treeview").hide();
            }
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false
    });
}

function onProcessSelect(e) {
   
    if (this.dataItem(e.node).spriteCssClass == "html") {
        var arr = this.dataItem(e.node).id.split('|');
        processAID = arr[0];
        processTimeOut = arr[1];
        processName = this.dataItem(e.node).text;

        $('#start-process-modal').find('.modal-body p').text(EFlang.StartProcess.replace('{0}', processName));

        if (processAID > 0) {
            $('.StartProcessOK').button('reset');
            $('.StartProcessOK').show();
            $('#surecload-animation').hide();
            $('#start-process-modal').modal("show");
        }
    }
}

function onFilterSelect(e) {
    var id = this.dataItem(e.node).id;
    if(id!=null)
        /*location.href = '/Filters/Add?Type=view&FilterId=' + id;*/
        location.href = '/Filter/Display?filterId=' + id;
        
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.turkishToUpper = function () {
    var string = this;
    var letters = { "i": "İ", "ş": "Ş", "ğ": "Ğ", "ü": "Ü", "ö": "Ö", "ç": "Ç", "ı": "I" };
    string = string.replace(/(([iışğüçö]))+/g, function (letter) { return letters[letter]; })
    return string.toUpperCase();
}

String.prototype.turkishToLower = function () {
    var string = this;
    var letters = { "İ": "i", "I": "ı", "Ş": "ş", "ı": "i", "Ğ": "ğ", "Ü": "ü", "Ö": "ö", "Ç": "ç" };
    string = string.replace(/(([İIŞĞÜÇÖ]))+/g, function (letter) {
        return letters[letter];
    });

    return string.toLowerCase();
}

unicodeLowerCase = function (value) {
    var string = value;
    var letters = { "İ": "i", "I": "i", "ı": "i", "Ş": "ş", "Ğ": "ğ", "Ü": "ü", "Ö": "ö", "Ç": "ç" };
    var invalid = /[\W_]+/g;

    var sArray = new Array();
    for (var i = 0; i < string.length; i++) {
        sArray.push(value[i]);
    }

    $.each(sArray, function (i, item) {
        if (!letters[sArray[i].toUpperCase()] && String(sArray[i]).match(invalid)) {
            string = string.replace(item, "");
        }
    });


    for (var i = 0; i < string.length; i++) {
        var item = string[i];
        var reg = RegExp(item, "i");

        var wc = letters[item] ? letters[item] : item;
        string = string.replace(reg, wc);
    }

    return string.toLowerCase();
}

String.prototype.contains = function (it) { return this.indexOf(it) != -1; };

function initCanvasLoader(options) {

    var defaultValues = {
        color: "#039aae",
        shape: "spiral",
        diameter: 37,
        density: 95,
        range: 1,
        speed: 5,
        fps: 27,
        mode: "show",
        top: 0,
        left: 0
    };

    if (options) {
        defaultValues = options;
    }

    var canvasLoader = new CanvasLoader('canvasloader-container');
    canvasLoader.setColor(defaultValues.color); // default is '#000000'
    canvasLoader.setShape(defaultValues.shape); // default is 'oval'
    canvasLoader.setDiameter(defaultValues.diameter); // default is 40
    canvasLoader.setDensity(defaultValues.density); // default is 40
    canvasLoader.setRange(defaultValues.range); // default is 1.3
    canvasLoader.setSpeed(defaultValues.speed); // default is 2
    canvasLoader.setFPS(defaultValues.fps); // default is 24
    canvasLoader.show();

    if (defaultValues.mode == "show") {
        canvasLoader.show();
        $("#canvasloader-container").removeClass("hidden");
    }
    else {
        $("#canvasloader-container").addClass("hidden");
        canvasLoader.kill();
    }

    var loaderObj = document.getElementById("canvasLoader");
    loaderObj.style.position = "absolute";
    loaderObj.style["margin-top"] = defaultValues.top + "px";
    loaderObj.style["margin-left"] = defaultValues.left + "px";

    $("#canvasLoader[style='display: none;']").remove();
    $("#canvasLoader[style='display: block;']").remove();
}

function htmlEncode(html) {
    return document.createElement('a').appendChild(
        document.createTextNode(html)).parentNode.innerHTML;
};

function htmlDecode(html) {
    var a = document.createElement('a'); a.innerHTML = html;
    return a.textContent;
};

function showAlert(msg) {
    if (msg != null && msg != "") {
        var alertHtml = '<div class="alert-original alert-warning-original alert-floating" style="display: none;">' +
            '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
                            '<strong>' + EFlang.Warning + '</strong> ' +
                            msg +
                        '</div>';
        $('.alert').remove();
        $('#main').prepend(alertHtml);
        $('.alert-floating').fadeIn('slow');
    }
}

function getLocalDateString(date, format) {
    var dateObj = new Date(date);
    return kendo.toString(dateObj, format);
}