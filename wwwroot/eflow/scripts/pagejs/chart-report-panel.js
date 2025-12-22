//Pie Chart

var StatusRadialChartData = [];
var StatusRadialChartSeries = [];
var StatusRadialChartLabels = [];
var StatusRadialChartLabels_StatusNames = [];
var StatusRadialChartLabels_Colors = [];

function CreateStatusCountRadialChart(grupId, selectedGroupName, cid, selectedCourseName, resultTiids) {
    
    $.ajax({
        dataType: "json",
        async: false,
        url: '/Task/GetStatusNamesAndCountsForRadialChart',
        type: "POST",
        data: {
            "assignedTo": grupId,
            "cid": cid,
            "tiids": resultTiids
        },
        beforeSend: function () {

        },
        complete: function () {

        },
        success: function (data) {

            StatusRadialChartData = [];
            StatusRadialChartSeries = [];
            StatusRadialChartLabels = [];
            StatusRadialChartLabels_StatusNames = [];
            StatusRadialChartLabels_Colors = [];

            $.each(data, function (key, entry) {
               
                if (entry.TotalTaskCount > 0) {

                    var model = { text: entry.StatusName, count: entry.TotalTaskCount, color: entry.BackColor }

                    StatusRadialChartData.push(model);
                    StatusRadialChartSeries.push(entry.TotalTaskCount);

                    var statusText = entry.StatusName;
                    if (statusText == " ") {
                        statusText = "-";
                    }

                    StatusRadialChartLabels.push(entry.TotalTaskCount + EFlang.FilterTask + statusText);

                    StatusRadialChartLabels_StatusNames.push(entry.StatusName);

                    if (entry.BackColor == 'FFFFFF') {
                        entry.BackColor = '#A9A9A9';
                    }
                    else {
                        entry.BackColor = entry.BackColor;
                    }

                    StatusRadialChartLabels_Colors.push(entry.BackColor);
                }

            })
        }
    }).done(function () {
        
        var _seriesArry = [];

        for (var i = 0; i < StatusRadialChartSeries.length; i++) {
            _seriesArry.push((StatusRadialChartSeries[i] * 100 / (eval(StatusRadialChartSeries.join("+")))).toFixed(2));
        }

        if (_seriesArry.length == 0) { $("#radial_chart").hide(); } else { $("#radial_chart").show(); }
        $("#radial_chart").html('');

        var groupName = selectedGroupName;
        var courseName = selectedCourseName;
        var titleText = "";

        if (groupName && courseName) {
            if (courseName.length > 20) { courseName = courseName.substr(0, 20) + ' ..';}
            titleText = " / " + groupName + " / " + courseName;
        }
        else if (groupName != '' && courseName == '') { titleText = " / " + groupName;  }
        else { groupName = ""; courseName = "";   titleText = ""; }

        var options = {
            title: {
                text: EFlang.FilterProcesses + titleText.substr(0, 50),
                align: 'center',
                margin: 10,
                offsetX: 0,
                offsetY: 0,
                floating: false,
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    fontFamily: undefined,
                    color: '#263238'
                },
            },
            series: _seriesArry,
            colors: StatusRadialChartLabels_Colors,
            chart: {
                id: 'radial_chart',
                height: 450,
                type: 'radialBar',
                fontFamily: 'Poppins',
                events: {
                    animationEnd: function (chartContext, options) {

                    },
                    dataPointSelection: function (event, chartContext, config) {

                        var selectedStatusName = StatusRadialChartLabels_StatusNames[config.dataPointIndex];

                        if (selectedStatusName == " ") {
                            $('#confirmationProcessFilterModal .confirmationProcessLabel').html(EFlang.EmptyStatusPieChart);
                        }
                        else {
                            $('#confirmationProcessFilterModal .confirmationProcessLabel').html("<b>" + selectedStatusName + " </b> " + EFlang.CountStatusPieChart);
                        }
                       
                        const modal = new Promise(function (resolve, reject) {
                            $('#confirmationProcessFilterModal').modal('show');
                            $('#confirmationProcessFilterModal .btn-ok').click(function () {
                                resolve();
                            });
                            $('#confirmationProcessFilterModal .btn-calcel').click(function () {
                                reject();
                            });
                        }).then(function (val) {

                            //user clicked yes
                            var _statusName = selectedStatusName;
                            var _cid = NetolojiFilter.GetCurrentSelectedCourseId();
                            var _groupId = NetolojiFilter.GetCurrentSelectedGroupId();
                            $('#kt_table_1').dataTable().fnFilter("assignId_" + _groupId + "|" + "status_filter¿" + _statusName
                                + "|" + "SelectedCid_" + _cid); 
                          
                        }).catch(function (err) {
                            //user clicked cancel                           
                        });

                    }
                }
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '14px',
                        },
                        value: {
                            fontSize: '14px',
                        },
                        total: {
                            show: true,
                            label: EFlang.FilterTotalTask,
                            formatter: function (w) {
                                return (eval(StatusRadialChartSeries.join("+")))
                            }
                        }
                    }
                }
            },
            labels: StatusRadialChartLabels,
        };

        var chart = new ApexCharts(document.querySelector("#radial_chart"), options);
        chart.render();

    });
}

//Bar Chart

var AreaChartData;
var AreaChartSeries = [];
var AreaChartCategories = [];
var AreaChartCategories_GroupIds = [];

function CreateUserGroupAreaChart(grupId, cid) {

    $.ajax({
        type: 'GET',
        dataType: "json",
        async: false,
        url: '/Task/GetUserGroupNamesAndTaskCountsForAreaChart?assignedTo=' + grupId + '&cid=' + cid,
        success: function (data) {
           
            AreaChartData = data;
            AreaChartSeries = [];
            AreaChartCategories = [];
            AreaChartCategories_GroupIds = [];
            AreaChartCategories.push(EFlang.FilterAllAssigned);
            var total = 0;
            for (var i = 0; i < AreaChartData.length; i++) { total += AreaChartData[i].TaskCount << 0; }
            AreaChartSeries.push(total);
            AreaChartCategories_GroupIds.push(-100);

            for (var i = 0; i < AreaChartData.length; i++) {

                if (data[i].GroupId != 0) {
                    AreaChartSeries.push(data[i].TaskCount);
                    AreaChartCategories.push(data[i].GroupName);
                    AreaChartCategories_GroupIds.push(data[i].GroupId);
                }
            }
        }
    }).done(function () {

        $('#area_chart').html('');

        var options = {
            title: {
                text: EFlang.BarChartTitle,
                align: 'center',
                margin: 10,
                offsetX: 0,
                offsetY: 0,
                floating: false,
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    fontFamily: undefined,
                    color: '#263238'
                },
            },
            series: [{
                data: AreaChartSeries
            }],
            colors: ['#4c81d1'],
            chart: {
                id: 'area_chart',
                type: 'bar',
                height: 550,
                fontFamily: 'Poppins',
                events: {
                    animationEnd: function (chartContext, options) {

                    },
                    dataPointSelection: function (event, chartContext, config) {
                        
                        var selectedGroupName = AreaChartCategories[config.dataPointIndex];
                        var taskCount = AreaChartSeries[config.dataPointIndex];

                        var modalTextLang = EFlang.PanelUserGroupConfirm.replace("{1}", taskCount).replace("{0}", selectedGroupName);
                        var modalText = modalTextLang;

                        $('#confirmationProcessFilterModal .confirmationProcessLabel').html(modalText);

                        const modal = new Promise(function (resolve, reject) {
                            $('#confirmationProcessFilterModal').modal('show');
                            $('#confirmationProcessFilterModal .btn-ok').click(function () {
                                resolve();
                            });
                            $('#confirmationProcessFilterModal .btn-calcel').click(function () {
                                reject();
                            });
                        }).then(function (val) {
                            //user clicked yes
                            //var seriesPercent = config.w.config.series[config.dataPointIndex];                              
                            var selectedIndex = config.dataPointIndex;
                            var selectedGroupId = AreaChartCategories_GroupIds[selectedIndex];
                            var selectedGroupName = AreaChartCategories[selectedIndex];

                            NetolojiFilter.ClearAllFilter();
                            NetolojiFilter.ClearSelectedCourseName();

                            if ($('#SelectedAssignId option').length < 2) {
                                NetolojiFilter.GetAssignNames();
                                NetolojiFilter.BindAssignNames();
                            }

                            $('#SelectedAssignId').val(selectedGroupId).trigger('change');
                           
                        }).catch(function (err) {
                            //user clicked cancel                           
                        });

                    }
                }
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val, opt) {
                    return val;
                },
                //dropShadow: {
                //    enabled: true,
                //    left: 2,
                //    top: 2,
                //    opacity: 0.5
                //},
            },
            xaxis: {
                categories: AreaChartCategories,
            },
            tooltip: {
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    return '<div style="font-size:10px; color:#4c81d1;" class="btn btn-label-primary">' +
                        '<span>' + series[seriesIndex][dataPointIndex] + ' ' + EFlang.FilterTask + ' </span>' +
                        '</div>'
                }
            },
            states: {
                normal: {
                    filter: {
                        type: 'none',
                        value: 0,
                    }
                },
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    }
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: 'none',
                        value: 0.35,
                    }
                },
            },
            //fill: {
            //    colors: [function ({ value, seriesIndex, w }) {
            //        if (value > 10) {
            //            return '#7E36AF'
            //        }else {
            //            return '#D9534F'
            //        }
            //    }]
            //}
        };

        var chart = new ApexCharts(document.querySelector("#area_chart"), options);
        chart.render();

    });
}

setInterval(function () {

    if (!($('.kt-demo-panel').is('.kt-demo-panel--on'))) {

        $('#task-index-wrapper').css("width", "100%");
        $('#kt_content_filter').css("width", "100%");

        $('.kt-demo-panel').attr('style', 'width: 23%');
        $('.kt-demo-panel__body').attr('style', 'display: none');
    }
    else {
        $('#task-index-wrapper').css("width", "55%");
        $('#kt_content_filter').css("width", "55%");

        $('.kt-demo-panel').attr('style', 'width: 43% !important');
        $('.kt-demo-panel__body').attr('style', 'display: unset');
    }

}, 200);