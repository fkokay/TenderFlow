var today = new Date();
var todayString;
today.setDate(today.getDate());
todayString = ('0' + today.getDate()).slice(-2) + '.'
    + ('0' + (today.getMonth() + 1)).slice(-2) + '.'
    + today.getFullYear();

function GetPortletByCompany(compId) {
    $.ajax({
        type: 'GET',
        dataType: "json",
        data: { 'companyID': compId },
        traditional: true,
        url: '/Log/TodayLogCount',
        success: function (data) {
            $("#tdyLogCount_" + compId).text(data);
        }
    }).done(function (data) {
    }).fail(function (jqXHR, textStatus) {
    });

    $.ajax({
        type: 'GET',
        dataType: "json",
        data: { 'companyID': compId },
        traditional: true,
        url: '/Log/ActiveTaskCount',
        success: function (data) {
            $("#ttlTaskCount_" + compId).text(data);
        }
    });
}

function SearchByCompany(compId) {
    window.location = "/Log/Detail?companyID=" + compId + "&date=" + $("#logtimepicker_filter").val();
}

function SearchTodayLogs(compId) {
    window.location = "/Log/Detail?companyID=" + compId + "&date=" + todayString;
}

function GetActiveTasks(compId) {
    window.location = "/Task/Index?companyID=" + compId;
}