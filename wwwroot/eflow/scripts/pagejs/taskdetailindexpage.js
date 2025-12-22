var SearchTimer;
var SearchTimerInterval = 400;
var SearchFilter = "";
var CountFormat = '';
var PageNumbers = [{ id: 0, text: "1" }];
var usermessage = "";
var PageNum = 1;


function BindTaskAction() {


    $(document).on('click.bs.dropdown.data-api', '.dropdown.keep-inside-clicks-open', function (e) {
        e.stopPropagation();
    });
    $(".dropdown-toggle").click(function () {
        if ($(this).next().find("li").length < 1) {
            return false;
        }
    });
    $('.TaskActionIn').unbind().bind('click', function (e) {

        e.preventDefault();
        $buttonEl = $(this);
        $buttonEl.attr('disabled', true);
        $buttonEl.attr("oldText", $buttonEl.html());
        $buttonEl.html('<span class="icon-refresh icon-spin"></span> ' + EFlang.PleaseWait);

      
        var arroyOfTiid = new Array();
    

        var tiId = $(this).attr("data-tiid");
        arroyOfTiid.push(tiId);
        var targetId = $(this).attr("targetId");
        var buttonId = $(this).attr("Id");
        var locHash = location.hash === "" ? "#1" : location.hash;
        var PageNum = parseInt(locHash.slice(1));
       
        $.ajax(
            {
                url: "/Task/RunTaskAction",
                data: { TIID: arroyOfTiid, ButtonID: buttonId },
                traditional: true,
                type: "GET",
                success: function (data) {                      
                    if (data.Exeption === null) {
                      
                        if (window.location.href.indexOf("Details") > -1) {
                            window.location.href = data.RedirectUrl.replace("Detail", "Details");
                        }
                        else {                           
                            FinalizeTask(data.RedirectUrl);
                        }
                    } else {
                        window.location.href = "/Task/Details?Type=work&TIID=" + tiId + "&TaskPage=" + PageNum + "&ButtonId=" + buttonId;                                             
                    }
                    $buttonEl.find('span').remove();
                    $buttonEl.text($buttonEl.attr("oldText"));
                    $buttonEl.attr('disabled', false);
                },
                error: function (err) {
                    alert(data.ExceptionMessage);
                    $buttonEl.find('span').remove();
                    $buttonEl.text($buttonEl.attr("oldText"));
                    $buttonEl.attr('disabled', false);
                }

            }
        );

    });
   
}