$(function () {
    $('#systemLogContainer').getSystemLogs();

    $('#variableDetailsModal').on('shown.bs.modal', function () {
        getSystemLogDetail(variableID, CIID);
    });

    $('#variableDetailsModal').on('hidden.bs.modal', function () {
        $(this).find(".modal-body").empty();
    });
});

(function ($) {
    $.fn.getSystemLogs = function (options) {

        var plugin = this;

        plugin.listSize = 0;

        var settings = $.extend({
            page: 1,
            pageSize: 30
        }, options);

        plugin.init = function () {
            plugin.getData(1);
        }

        plugin.showLoading = function () {
            $(plugin).find('.loading-container').remove();
            $(plugin).append('<div class="loading-container"><span>' + EFlang.Loading + '</span></div>');
        }

        plugin.hideLoading = function () {
            $(plugin).find('.loading-container').remove();
        }

        plugin.showLoadButton = function () {
            $(plugin).find('.loading-container').remove();
            $(plugin).append('<div class="loading-container loading-button"><a href="javascript:;" class="loadMore">' + EFlang.ShowMore + '</a></div>');

            $(plugin).find('.loading-container a.loadMore').off('click').on('click', function () {
                settings.page++;
                plugin.getData(settings.page);
            });
        }

        plugin.hideLoadButton = function () {
            $(plugin).find('.loadMore').hide();
        }

        plugin.getData = function (page) {
            plugin.showLoading();

            $.ajax({
                url: "/Search/GetSystemLogs",
                type: "GET",
                dataType: "json",
                data: { CIID: CIID, page: page, pageSize: settings.pageSize },
                cache: false,
                success: function (data) {
                    plugin.hideLoading();

                    if (data.result = 'success') {

                        if (data.content.TotalPageCount > settings.pageSize) {
                            $("#systemLogContainer").addClass("taskOverflow");
                        }

                        if (data.content.TotalPageCount > page)
                            plugin.showLoadButton();

                        var container = $(plugin).find('table tbody');

                        plugin.listSize += data.content.list.length;

                        if (plugin.listSize > 0) {
                            $("#systemLogContainer").show();
                            $("#emptyLogInfo").hide();

                            for (var i = 0; i < data.content.list.length; i++) {
                                container.append('<tr>' +
                                    '    <td>' + data.content.list[i].EVENTTEXT + (data.content.list[i].EVENTDESC != '' ? ' (' + data.content.list[i].EVENTDESC + ')' : '') + '</td>' +
                                    '    <td width="20%">' + data.content.list[i].UserFullName + '</td>' +
                                    '    <td width="20%">' + data.content.list[i].EventTimeStr + '</td>' +
                                    '</tr>');
                            }

                            $(plugin).find('a.showProcessVariable').off('click').on('click', function () {
                                var ID = $(this).attr('id');
                                var CIID = $(this).attr('ciid');
                                getVariableDetail(ID, CIID);
                            });
                        } else {
                            container.parents('.box').hide();
                            $("#systemLogContainer").hide();
                            $("#emptyLogInfo").show();
                        }

                        if (data.content.list.length == 0) {
                            plugin.hideLoadButton();
                        }
                    } else {
                        alert('Log listesi alınamadı.');
                    }
                }
            });
        }

        plugin.init();
    }
}(jQuery));

function getSystemLogDetail(variableID, CIID) {
    $(this).find(".modal-body").empty().html('<div style="text-align: center;">Yükleniyor...</div>');

    $.ajax({
        method: "GET",
        url: "/Search/GetSystemLogVariable",
        data: { ID: variableID, CIID: CIID },
        dataType: "json"
    }).success(function (response) {
        
        if (response.result == "success") {

            if (response.data.Type == surecDataTipi.Grid) {
                $('#variableDetailsModal').find(".modal-body").html('<div id="gridInModal"></div>');
  
                $.ajax({
                    type: "GET",
                    url: "/Partials/TablePartial",
                    data: { CIID: CIID, DID: response.DID},
                    contentType: "application/json; charset=utf-8",
                    dataType: "html",
                    success: function (resp) {
                        $('#variableDetailsModal').find(".modal-body").html(resp);
                     
                    },
                    failure: function (response) {
                        alert(response.responseText);
                    },
                    error: function (response) {
                        alert(response.responseText);
                    }
                });
               
                
            } else if (response.data.Type == surecDataTipi.Memo) {
                $('#variableDetailsModal').find(".modal-body").html(response.data.DataValue.replaceAll('\r', '<br/>'));
            } else if (response.data.Type == surecDataTipi.Log) {
                var htmlString = '<ul class="messages">';
                for (var i = 0; i < response.data.DataValue.length; i++) {
                    htmlString += '<li class="">';
                    htmlString += '    <div class="message">';
                    htmlString += '        <p>' + response.data.DataValue[i].Value + '</p>';
                    htmlString += '        <span class="name">' + response.data.DataValue[i].Kaydeden + '</span> - <span class="time">' + getDateString(response.data.DataValue[i].Zaman, DateFormatLongKendo) + '</span>';
                    htmlString += '    </div>';
                    htmlString += '</li>';
                }
                htmlString += '</ul>';
                $('#variableDetailsModal').find(".modal-body").html(htmlString);
            }
        } else {
            $('#variableDetailsModal').find(".modal-body").html(response.errorMsg);
        }
    });
}

function getVariableDetail(ID, CIID) {
    variableID = ID;
    $('#variableDetailsModal').modal('show');
}

function getDateString(date, format) {
    var dueDate = moment(date).format(format);
    return dueDate;
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};