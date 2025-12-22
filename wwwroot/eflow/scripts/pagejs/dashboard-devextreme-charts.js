//Pie Chart Start
var FilterStatus = null;
var FilterSearchText = "";
var FilterAssigneTo = 0;
var FilterAssigneToText = 0;

var dt = [];

function GetFilters() {

    if (FilterStatus != null && $("#filterboble").hide()) {
        $("#filterText").text(wrapText(FilterStatus));
        StatusVal = FilterStatus;
        $("#filterboble").show();
    } else {
        $("#filterText").html("");
        StatusVal = '';
        $("#filterboble").hide();
    }
    if (FilterAssigneTo != 0 && $("#filterbobleAssign").hide()) {
        $("#filterAssign").text(wrapText(FilterAssigneToText));
        $("#filterbobleAssign").show();
    } else {
        $("#filterAssign").text("");
        $("#filterbobleAssign").hide();
    }
}

GetFilters();

function CreatePieChart() {

    $.ajax({
        url: '/Task/GetStatusChart/',
        type: 'Get',
        contentType: "application/json",
        dataType: "json",
        data: { "FilterText": FilterSearchText, "AssignedTo": FilterAssigneTo, "Status": FilterStatus },
        success: function (response) {

            dt = response;
            $.each(dt, function (i, item) {

                this.explode = false;
                if (item.status == FilterStatus)
                    this.explode = true;
            });

            var pieSource = JSON.stringify(dt);

            $(function () {
                $("#pie").dxPieChart({
                    palette: "Carmine",
                    paletteExtensionMode: "Extrapolate",
                    dataSource: JSON.parse(pieSource),
                    title: statusText,

                    tooltip: {
                        enabled: true,
                        customizeTooltip: function () {
                            return {
                                text: this.valueText + ' ' + taskText
                            };
                        }
                    },

                    legend: {
                        orientation: "horizontal",
                        itemTextPosition: "right",
                        horizontalAlignment: "center",
                        verticalAlignment: "bottom",
                        columnCount: 4
                    },
                    "export": {
                        enabled: true,
                        formats: ["PNG"],
                    },

                    onPointClick: function (e) {
                       
                        FilterStatus = e.target.argument;

                        if (FilterStatus == "") {
                            FilterStatus = "-";
                        }

                        GetFilters();
                        CreateBarChart();
                        KTDatatablesDataSourceAjaxServer.init();
                        
                    },

                    series: [{
                        argumentField: "status",
                        valueField: "value",
                        label: {
                            visible: true,
                            font: {
                                size: 16
                            },
                            connector: {
                                visible: true,
                                width: 0.5
                            },
                            position: "columns",
                            customizeText: function (arg) {
                                return arg.argumentText + " (" + arg.valueText + ")";
                            }
                        }
                    }]
                });
            });
        }
    });
}
//Pie Chart End

//Bar Chart Start
var count = 1;
var obj = [];
function CreateBarChart() {

    var result = $.ajax({
        url: '/Task/GetAssignedToChart/',
        type: 'Get',
        contentType: "application/json",
        dataType: "json",

        data: { "FilterText": FilterSearchText, "AssignedTo": FilterAssigneTo, "Status": FilterStatus },
        success: function (response) {

            $(function () {
                $("#chart").dxChart({
                    palette: "Carmine",
                    paletteExtensionMode: "Extrapolate",
                    dataSource: JSON.parse(JSON.stringify(response)),
                    tooltip: {
                        enabled: true,
                        customizeTooltip: function () {
                            return {
                                text: this.valueText +' '+ taskText
                            };
                        }
                    },

                    legend: {
                        visible: false
                    },

                    rotated: true,

                    series: {
                        type: "bar",
                        tagField: "userId",
                        argumentField: "text",
                        valueField: "value",                        
                    },

                    onPointClick: function (e) {

                        console.log(e.target);

                        FilterAssigneTo = e.target.tag;
                        FilterAssigneToText = e.target.argument;
                        GetFilters();
                        CreatePieChart();

                        AssignedToVal = FilterAssigneTo;                       
                        KTDatatablesDataSourceAjaxServer.init();

                    },

                    argumentAxis: {
                        tickInterval: 10,
                        label: {
                            format: {
                                type: "decimal"
                            }
                        }
                    },
                    title: usersText
                });
            });

        }
    });
}
//Bar Chart End

var delayChart = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

function dismiss(b) {
    if (b) {
        FilterStatus = null;
        StatusVal = '';
        CreatePieChart();
        CreateBarChart();

    } else {
        FilterAssigneTo = 0;
        AssignedToVal = 0;
        FilterAssigneToText = "";
        CreatePieChart();
        CreateBarChart();
    }

    GetFilters();
    KTDatatablesDataSourceAjaxServer.init();
}

function wrapText(value) {
    if (value.length > 24) {
        value = value.substring(0, 30) + "...";
    };
    return value;
};

function InitCharts(searchText) {
    delayChart(function () {
        FilterSearchText = searchText;
        CreatePieChart();
        CreateBarChart();
    }, 800);
}