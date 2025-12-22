$(function () {

    $('#taskSummaryContainer').getTaskSummary();
});

(function ($) {
    $.fn.getTaskSummary = function (options) {

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
            $(plugin).append('<div class="loading-container">' + EFlang.Loading + '</div>');
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
                url: "/Search/GetTaskSummary",
                type: "GET",
                dataType: "json",
                data: { CIID: CIID, page: page, pageSize: settings.pageSize },
                cache: false,
                success: function (data) {
                    plugin.hideLoading();
                   
                    if (data.result = 'success') {
                       
                        if (data.content.TotalPageCount >
                            settings.pageSize) {
                            $("#taskSummaryContainer").addClass("taskOverflow");
                        }

                        if (data.content.TotalPageCount > page)
                            plugin.showLoadButton();

                        var container = $(plugin).find('table tbody');

                        plugin.listSize += data.content.list.length;

                        if (plugin.listSize > 0) {

                            $("#taskSummaryContainerTable").show();
                            $("#emptyTaskSummaryInfo").hide();

                            for (var i = 0; i < data.content.list.length; i++) {
                                var latitude = 0;
                                var longitude = 0;
                                var geoLocationLink = '';

                                if (data.content.list[i].GeoLocation != '') {
                                    try {
                                        latitude = parseFloat(data.content.list[i].GeoLocation.split('&')[0]);
                                        longitude = parseFloat(data.content.list[i].GeoLocation.split('&')[1]);
                                        if (!isNaN(latitude) && !isNaN(longitude)) {
                                            geoLocationLink = '<a href="javascript:;" class="map-icon-24 show-map" lat=' + latitude + ' long=' + longitude + '><div class="kt-demo-icon__preview"><i style="color:green;" class="flaticon2-map"></i></div></a>';
                                        } else {
                                            geoLocationLink = '<a href="javascript:;" class="map-icon-24 map-parse-error" title="Error: Wrong latitude or longitude"><div class="kt-demo-icon__preview"><i class="flaticon2-map"></i></div></a>';
                                        }
                                    }
                                    catch (err) {
                                        geoLocationLink = '<a href="javascript:;" class="map-icon-24 map-parse-error" title="Error: ' + err + '"><div class="kt-demo-icon__preview"><i style="color:#e1e1ef;" class="flaticon2-map"></i></div></a>';
                                    }
                                } else {
                                    geoLocationLink = '<a href="javascript:;" class="map-icon-24 map-no-data" title="' + EFlang.LocationDataNotFound + '"><div class="kt-demo-icon__preview"><i style="color:#e1e1ef;" class="flaticon2-map"></i></div></a>';
                                }

                                container.append('<tr>' +
                                                     '<td>' + data.content.list[i].Title + '</td>' +
                                                     '<td>' + data.content.list[i].Status + '</td>' +
                                                     '<td>' + data.content.list[i].DueDateStr + '</td>' +
                                                     '<td>' + data.content.list[i].AssignedTo + '</td>' +
                                                     '<td>' + (data.content.list[i].CompletedBy != null ? data.content.list[i].CompletedBy : '') + '</td>' +
                                                     '<td>' + (data.content.list[i].CompletedAction != null ? data.content.list[i].CompletedAction : '') + '</td>' +
                                                     '<td>' + data.content.list[i].TotalTaskTime + '</td>' +
                                                     (isGeoLocationEnabled ? '<td class="geoLocationRow">' + geoLocationLink + '</td>' : '') +
                                                 '</tr>');
                            }

                            // If it's first page then show content with fadeIn animation
                            if (page == 1)
                                $(plugin).find('table').css('visibility', 'visible').hide().fadeIn();

                            $(plugin).find('a.showProcessVariable').off('click').on('click', function () {
                                var ID = $(this).attr('id');
                                var CIID = $(this).attr('ciid');
                                getVariableDetail(ID, CIID);
                            });
                        } else {
                            container.parents('.box').hide();
                            $("#taskSummaryContainerTable").hide();
                            $("#emptyTaskSummaryInfo").show();
                        }

                        if (data.content.list.length == 0) {
                            plugin.hideLoadButton();
                        }
                    } else {
                        alert('Log listesi alınamadı.');
                    }

                    $('.show-map').on('click', function () {                     
                        $('#mapModal .modal-body .map-details .latitude').text($(this).attr('lat'));
                        $('#mapModal .modal-body .map-details .longitude').text($(this).attr('long'));
                        $('#mapModal').modal('show');
                    });

                    $('#mapModal').on('shown.bs.modal', function (e) {
                        var latitude = parseFloat($('#mapModal .modal-body .map-details .latitude').text());
                        var longitude = parseFloat($('#mapModal .modal-body .map-details .longitude').text());

                        var mapProp = {
                            center: new google.maps.LatLng(latitude, longitude),
                            zoom: 15,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };
                        var map = new google.maps.Map(document.getElementById("map-container"), mapProp);

                        var myLatLng = {
                            lat: latitude, lng: longitude
                        };
                        var marker = new google.maps.Marker({
                            position: myLatLng,
                            map: map
                        });
                    });

                    $('#mapModal').on('hidden.bs.modal', function () {
                        $('#map-container').empty();
                    })
                }
            });
        }

        plugin.init();
    }

    function getDateString(date, format) {
        var dueDate = moment(date).format(format);
        return dueDate;
    }

}(jQuery));