var isFiltered = false;
var filterAllDataStr = "";
let previousScrollY = 0;
function lockPreviewScroll() {
    previousScrollY = $(window).scrollTop();
    $('.kt-grid').css({ 'overflow': 'hidden' });
}

function unlockPreviewScroll() {
    $('.kt-grid').css({ 'overflow': '' });
    $(window).scrollTop(previousScrollY);
}
function FillDefaultFormDataParam(formData) {

    var _popGridId = $("#netoloji-modal").attr("pop-grid-id");
    var _popRowId = $("#netoloji-modal").attr("pop-row");
    var _popColId = $("#netoloji-modal").attr("pop-colId");
    var _popQuery = $("#netoloji-modal").attr("pop-query");
    var _infoData = $("#tempInfo-" + _popGridId).html();
    formData.append("gridId", _popGridId);
    formData.append("row", _popRowId);
    formData.append("colId", _popColId);
    formData.append("query", _popQuery);
    formData.append("Info", _infoData);
    return formData;
}

function BindDataWithPage(pageNum) {
    var formData = new FormData();
    formData = FillDefaultFormDataParam(formData);

    var filterdata = {};
    $(".poptext-filter").each(function () {
        var filterText = $(this).val();

        if (filterText) {
            var columnName = $(this).attr("name");
            filterdata[columnName] = filterText;
        }
    });


    formData.append("filter", filterAllDataStr);
    formData.append("filterdict", JSON.stringify(filterdata));

    //Eğer 2. sayfadaysak önceki butonuna bastığımzda bu function(BindDataWithPage) iki kere çalıştığı için page number 0'a düşüyor ve verileri çekemiyordu.
    formData.append("pageNum", pageNum = pageNum == 0 ? 1 : pageNum)

    var selectedVals = GetAllSelectedElementValues();
    if (selectedVals.length > 0) {
        formData.append("selectedItems", JSON.stringify(selectedVals));
    }

    Promise.all([GetPopUpData(formData)]).then(function () {

        var totalCount = $(".popup-table-bordered").attr("total-count");
        $('.poptext-filter:first').focus();
    });
}

$('#pagination-popup').on('am.pagination.change', function (e) {
    if (e.target.innerHTML != "") {
        var prevPage = $("ul#pagination-popup").find('li.active a').text();

        if (prevPage != e.page) {
            e.preventDefault();
            $("#pagination-popup .page-link").css("color", "#22b9ff;").css("background", "white")
            $(this).css("color", "white").css("background", "#4c81d1");
            BindDataWithPage(e.page);
        }
    }
});

$('.select2-cme').select2({
    dropdownParent: $('#netoloji-modal'),
    language: EFlang.localeCode
});

function FilterToPopupColumn(e, input) {

    var enteredText = $(input).val();

    if (((enteredText.length >= 1) || enteredText == '') && (e.which == 13 || e.keyCode == 13)) {

        var filteredColumns = [];
        var filterdata = {};
        $(".poptext-filter").each(function () {

            var filterText = $(this).val();

            if (filterText) {
                var columnName = $(this).attr("name");
                var filterFormData = "[" + columnName + "]" + "$" + "'%" + filterText + "%'";
                filteredColumns.push(filterFormData);
                filterdata[columnName] = filterText;
            }

        });

        if (filteredColumns.length == 0) {
            isFiltered = false;
            filterAllDataStr = "";
        }
        else {
            isFiltered = true;
        }

        if (isFiltered == true) {

            var formData = new FormData();
            formData = FillDefaultFormDataParam(formData);

            var commaSeperatedArry = filteredColumns.join(", ")
            filterAllDataStr = commaSeperatedArry;

            formData.append("filter", commaSeperatedArry);
            formData.append("filterdict", JSON.stringify(filterdata));
            formData.append("pageNum", "1");

            var selectedVals = GetAllSelectedElementValues();
            if (selectedVals.length > 0) {
                formData.append("selectedItems", JSON.stringify(selectedVals));
            }

            Promise.all([GetPopUpData(formData)]).then(function () {
                var totalCount = $(".popup-table-bordered").attr("total-count");
                if (totalCount) {
                    $('#pagination-popup').pagination({
                        maxSize: 7, totals: totalCount, page: 1, pageSize: 20, prevText: EFlang.Previous, nextText: EFlang.Next
                    });
                    $("#netoloji-modal .nm-total-count-pps").html(EFlang.Total + " " + totalCount + " " + EFlang.RecordsOfListing)
                }
                else {
                    //Arama sonucu dönen sonuç empty
                }
            });
        }
        else {
            //Tüm filtreler boş gönderildi
            filterAllDataStr = "";
            GetEmptyFilterResult();
        }
    }

}

function GetEmptyFilterResult() {
    var formData = new FormData();
    formData = FillDefaultFormDataParam(formData);
    formData.append("filter", "");
    formData.append("pageNum", "1")
    var selectedVals = GetAllSelectedElementValues();
    if (selectedVals.length > 0) {
        formData.append("selectedItems", JSON.stringify(selectedVals));
    }

    Promise.all([GetPopUpData(formData)]).then(function () {

        var totalCount = $(".popup-table-bordered").attr("total-count");
        if (totalCount) {
            $('#pagination-popup').pagination({
                maxSize: 7, totals: totalCount, page: 1, pageSize: 20, prevText: EFlang.Previous, nextText: EFlang.Next
            });
            $("#netoloji-modal .nm-total-count-pps").html(EFlang.Total + " " + totalCount + " " + EFlang.RecordsOfListing)
        }
    });
}

//Paging
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        root.amPagination = factory(root.jQuery);
    }
}(this, function ($) {
    var Pager = function (ele, opts) {
        var options = $.extend({}, $.fn.pagination.default, opts);
        this.ele = ele;

        this.container = function (self) {
            if (self.checkTag(self.ele, 'UL')) {
                return self.ele;
            } else {
                var hasul = self.ele.find('ul');
                if (hasul.length > 0) {
                    hasul.empty();
                    return hasul;
                } else {
                    var ctr = $('<ul  />');
                    self.ele.append(ctr);
                    return ctr
                }
            }
        };
        this.onChangePage = function (fn) {
            if (fn && typeof fn === 'function') {
                this.ele.on('am.pagination.change', fn);
            }
            return this;
        };
        this.maxSize = options.maxSize || this.ele.data('maxSize');
        this._page = -1;
        this.totals = options.totals;
        this.currPage = function () {
            return this._page + 1;
        };
        if (options.page && options.page > 0) {
            this._page = options.page - 1;
        } else if (this.ele.data('page')) {
            this._page = parseInt(this.ele.data('page'));
        }

        this.pageSize = options.pageSize;
        this.selectPage = function (selpage) {
            options.page = selpage;
            this.ele.trigger({
                type: 'am.pagination.change',
                page: selpage,
                pageSize: this.pageSize,
                totals: this.totals
            });
            this._page = selpage - 1;
            this.fill();
            this.ele.trigger('am.context.change');
        };
        this.context = function () {
            return options;
        };
        this.render = function (rdopts) {

            if (rdopts.hasOwnProperty("totals")) {
                this.totals = options.totals = rdopts["totals"];
                if (this.totals === 0) {
                    this.totals = options.totals = 1;
                }
            }
            if (rdopts.hasOwnProperty("pageSize")) {
                this.pageSize = options.pageSize = rdopts["pageSize"];
            }
            if (rdopts.hasOwnProperty("page")) {
                var rpage = options.page = rdopts["page"];
                this._page = options.page - 1;
            }
            this.selectPage(this.currPage());
        };
        this.changeContext = function () {
            this.ele.attr('data-pagination', JSON.stringify(this.context()));
        };
        this.ele.on('am.context.change', $.proxy(this.changeContext, this));
        this.click = function (e) {
            e.preventDefault();
            var currpage = '';
            var $self = $(e.target);
            var $p = $self.parent('li');
            if ($p.hasClass('am-disabled') || $p.hasClass('disabled')) { return; }
            if ($p.hasClass('pager-first')) {
                this.selectPage(1);
            }
            else if ($p.hasClass('pager-prev')) {
                currpage = this.currPage() - 1;
                this.selectPage(currpage);
            }
            else if ($p.hasClass('pager-next')) {
                currpage = this.currPage() + 1;
                this.selectPage(currpage);
            }
            else if ($p.hasClass('pager-last')) {
                var pageCount = Math.ceil(this.totals / this.pageSize);
                this.selectPage(pageCount);
            }
            else {
                if ($p.hasClass('am-active') || $p.hasClass('active')) { return; }
                this.selectPage(parseInt($self.text()));
            }
        };

        this.fill = function () {
            if (this.pageSize <= 0) throw Error('pageSize invalid!');
            if (this.totals <= 0) {
                console.warn('totals :' + this.totals);
            }
            var pageCount = Math.ceil(this.totals / this.pageSize);
            if (this._page < 0) {
                this._page = 0;
            }
            if (this._page > pageCount - 1) {
                this._page = pageCount - 1;
            }
            var spage = -1, epage = -1;
            if (options.rotate === true) {
                if (this.maxSize % 2 !== 0) {
                    var ps = Math.floor(this.maxSize / 2);

                    if (this._page - ps >= 0) {
                        spage = this._page - ps;
                        if (this._page + ps > pageCount - 1) {
                            epage = pageCount - 1;
                        } else {
                            epage = this._page + ps;
                        }

                    } else {
                        spage = 0;
                        epage = this.maxSize - 1;
                    }
                } else {
                    var m = this.maxSize / 2;

                    if (this._page - m >= 0) {
                        spage = this._page - m;
                        if (this._page + (m - 1) < pageCount) {
                            epage = this._page + (m - 1);
                        } else {
                            epage = pageCount - 1;
                        }
                    } else {
                        epage = this.maxSize - 1;
                        spage = 0;
                    }


                }
                epage = epage + 1;
            } else {
                spage = this._page - this._page % this.maxSize;
                epage = spage + this.maxSize;
            }

            epage = epage > pageCount ? pageCount : epage;

            this.createUITmp({
                cpgidx: this._page,
                ctotals: this.totals,
                cboundaryLinks: options.boundaryLinks,
                cfirstText: options.firstText,
                cpageCount: pageCount,
                clastText: options.lastText,
                cprevText: options.prevText,
                cnextText: options.nextText,
                cuiType: options.theme,
                cbtnSize: options.btnSize,
                cdirectionLinks: options.directionLinks,
                cspage: spage,
                cepage: epage

            }, this.container(this));


        };
        this.container(this).on('click', 'li>a', $.proxy(this.click, this));
        this.selectPage(options.page);
    };

    Pager.Global = {
        checkDom: function (obj) {
            return typeof HTMLElement === 'object' ? function (obj) { return obj instanceof HTMLElement; } : function (obj) { return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'; };
        },
        check$: function (obj) {
            if (!obj) return false;
            return obj instanceof $;
        },
        addClassOnce: function (elem, classname) {
            if (!elem.hasClass(classname)) {
                elem.addClass(classname);
            }

        }
    };
    Pager.prototype = {
        constructor: Pager,
        checkTag: function ($obj, htmtag) {
            if ($obj instanceof $) {
                return $obj.get(0).tagName === htmtag;
            } else if (Pager.Global["checkDom"]($obj)) {
                return $obj.tagName === htmtag;
            } else if (typeof $obj === 'string') {
                return $($obj).get(0).tagName === htmtag;
            }
            return false;
        },
        createUITmp: function (copts, celem) {

            var htm = [];
            if (copts.cuiType === 'amazeui') {
                Pager.Global["addClassOnce"](celem, 'am-pagination');
                if (copts.cbtnSize === "sm") {
                    Pager.Global["addClassOnce"](celem, 'am-pagination-sm');
                } else if (copts.cbtnSize === "lg") {
                    Pager.Global["addClassOnce"](celem, 'am-pagination-lg');
                }

                if (copts.cboundaryLinks === true) {
                    htm.push('<li  class=" pager-first ' + (copts.cpgidx === 0 || copts.ctotals <= 0 ? 'am-disabled' : '') + '" ><a href="#">' + copts.cfirstText + '</a></li>');
                }

                if (copts.cdirectionLinks === true) {
                    htm.push('<li  class=" pager-prev   ' + (copts.cpgidx === 0 || copts.ctotals <= 0 ? 'am-disabled' : '') + '  "><a href="#">' + copts.cprevText + '</a></li>');
                }

                if (copts.cspage !== 0) {
                    htm.push('<li><span>...</span></li>');
                }
                for (var i = copts.cspage; i < copts.cepage; i++) {
                    htm.push('<li ' + (copts.cpgidx === i ? 'class="am-active"' : "") + '><a href="#">' + (i + 1) + '</a></li>');
                }
                if (copts.cepage !== copts.cpageCount) {
                    htm.push('<li><span>...</span></li>');
                }
                if (copts.cdirectionLinks === true) {
                    htm.push(' <li class="pager-next ' + (copts.cpgidx === copts.cpageCount - 1 || copts.ctotals <= 0 ? 'am-disabled ' : '') + '"><a href="#">' + copts.cnextText + '</a></li>');
                }
                if (copts.cboundaryLinks === true) {
                    htm.push(' <li class=" pager-last ' + (copts.cpgidx === copts.cpageCount - 1 || copts.ctotals <= 0 ? 'am-disabled' : '') + '"><a href="#">' + copts.clastText + '</a></li>');
                }
            } else if (copts.cuiType === 'bootstrap') {
                Pager.Global["addClassOnce"](celem, 'pagination');
                if (copts.cbtnSize === "sm") {
                    Pager.Global["addClassOnce"](celem, 'pagination-sm');
                } else if (copts.cbtnSize === "lg") {
                    Pager.Global["addClassOnce"](celem, 'pagination-lg');
                }
                if (!celem.hasClass('pagination')) {
                    celem.addClass('pagination');
                }
                if (copts.cboundaryLinks === true) {
                    htm.push('<li  class=" pager-first ' + (copts.cpgidx === 0 || copts.ctotals <= 0 ? 'disabled' : '') + '" ><a href="#">' + copts.cfirstText + '</a></li>');
                }

                if (copts.cdirectionLinks === true) {
                    htm.push('<li  class=" pager-prev   ' + (copts.cpgidx === 0 || copts.ctotals <= 0 ? 'disabled' : '') + '  "><a href="#">' + copts.cprevText + '</a></li>');
                }

                if (copts.cspage !== 0) {
                    htm.push('<li><span>...</span></li>');
                }
                for (var i = copts.cspage; i < copts.cepage; i++) {
                    htm.push('<li ' + (copts.cpgidx === i ? 'class="active"' : "") + '><a href="#">' + (i + 1) + '</a></li>');
                }
                if (copts.cepage !== copts.cpageCount) {
                    htm.push('<li><span>...</span></li>');
                }
                if (copts.cdirectionLinks === true) {
                    htm.push(' <li class="pager-next ' + (copts.cpgidx === copts.cpageCount - 1 || copts.ctotals <= 0 ? 'disabled ' : '') + '"><a href="#">' + copts.cnextText + '</a></li>');
                }
                if (copts.cboundaryLinks === true) {
                    htm.push(' <li class=" pager-last ' + (copts.cpgidx === copts.cpageCount - 1 || copts.ctotals <= 0 ? 'disabled' : '') + '"><a href="#">' + copts.clastText + '</a></li>');
                }
            } else {
                Pager.Global["addClassOnce"](celem, 'am-pagination-default');
                if (copts.cbtnSize === "sm") {
                    Pager.Global["addClassOnce"](celem, 'am-pagination-default-sm');
                } else if (copts.cbtnSize === "lg") {
                    Pager.Global["addClassOnce"](celem, 'am-pagination-default-lg');
                }

                if (copts.cboundaryLinks === true) {
                    htm.push('<li  class=" pager-first ' + (copts.cpgidx === 0 || copts.ctotals <= 0 ? 'disabled' : '') + '" ><a href="#">' + copts.cfirstText + '</a></li>');
                }

                if (copts.cdirectionLinks === true) {
                    htm.push('<li  class=" pager-prev   ' + (copts.cpgidx === 0 || copts.ctotals <= 0 ? 'disabled' : '') + '  "><a href="#">' + copts.cprevText + '</a></li>');
                }

                if (copts.cspage !== 0) {
                    htm.push('<li><span>...</span></li>');
                }
                for (var i = copts.cspage; i < copts.cepage; i++) {
                    htm.push('<li ' + (copts.cpgidx === i ? 'class="active"' : "") + '><a href="#">' + (i + 1) + '</a></li>');
                }
                if (copts.cepage !== copts.cpageCount) {
                    htm.push('<li><span>...</span></li>');
                }
                if (copts.cdirectionLinks === true) {
                    htm.push(' <li class="pager-next ' + (copts.cpgidx === copts.cpageCount - 1 || copts.ctotals <= 0 ? 'disabled ' : '') + '"><a href="#">' + copts.cnextText + '</a></li>');
                }
                if (copts.cboundaryLinks === true) {
                    htm.push(' <li class=" pager-last ' + (copts.cpgidx === copts.cpageCount - 1 || copts.ctotals <= 0 ? 'disabled' : '') + '"><a href="#">' + copts.clastText + '</a></li>');
                }
            }
            this.container(this).empty();
            this.container(this).append($(htm.join('')));

        }
    };
    $.fn.pagination = function (popts) {
        var pger = {};
        args = arguments;
        if (!this.attr('data-pagination')) {
            pger = new Pager(this, popts);
            var jstr = JSON.stringify(pger.context());
            this.attr('data-pagination', jstr);
        } else {
            var pgeropts = this.attr('data-pagination');
            var pgch = JSON.parse(pgeropts);
            var newOpts = (function () { return args.length !== 0; })() && $.extend({}, pgch, popts);
            pger = new Pager(this, newOpts === false ? pgch : newOpts);
        }
        return pger;
    };

    $.fn.pagination.default = {
        maxSize: 7,
        totals: 100,
        page: 1,
        pageSize: 10,
        lastText: '&raquo;&raquo;',
        firstText: '&laquo;&laquo;',
        prevText: '&laquo;',
        nextText: '&raquo;',
        rotate: true,
        directionLinks: true,
        boundaryLinks: true,
        theme: '',
        btnSize: ''
    };

    var gpger = function (selector, pots) {
        var $sel = {};
        if (selector instanceof $) {
            $sel = selector;
        } else if (Pager.Global["checkDom"](selector)) {
            $sel = $(selector);
        } else if (typeof selector === 'string') {
            $sel = $(selector);
        }
        return $.fn.pagination.call($sel, pots);
    };
    return gpger;
}));