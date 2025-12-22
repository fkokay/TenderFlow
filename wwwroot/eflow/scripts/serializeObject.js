$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        var thisval = "";
        if ($("input[name='" + this.name + "']").hasClass('datetime')) {
            if ($("input[name='" + this.name + "']").val() != "") {
                var dateval = $("input[name='" + this.name + "']").datetimepicker('getDate');
                thisval = moment(dateval).format('L HH:mm')
            }
            else {
                thisval = "";
            }
        }
        else if ($("input[name='" + this.name + "']").hasClass("numeric")) {
            thisval = $("input[name='" + this.name + "']").attr("data-val");
        }
        else if ($("input[name='" + this.name + "']").hasClass("popupselecttext")) {
            thisval = $("input[name='" + this.name + "']").attr("data-itemval") + "[and]" + $("input[name='" + this.name + "']").val();
        }
        else if ($("textarea[name='" + this.name + "']").attr("type") == "memo") {
            thisval = $('<div/>').text(this.value).html();
        }
        else {
            thisval = this.value;
        }
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(thisval || '');
        } else {
            o[this.name] = thisval || '';
        }
    });
    $('#' + $(this).attr('id') + ' .file-uploader').each(function () {
        var nm = $(this).attr("name");
        var thisval = $(this).attr('filename') + "[and]" + $(this).attr('realfilename');
        if (o[nm]) {
            if (!o[nm].push) {
                o[nm] = [o[nm]];
            }
            o[nm].push(thisval || '');
        } else {
            o[nm] = thisval || '';
        }
    });

    $('#' + $(this).attr('id') + ' .gridelement').each(function () {
        var nm = $(this).attr("data-name");
        var tempval = [];


        $(this).find('tbody tr').each(function (i) {
            //if (!($(this).hasClass("template"))) {
                tempval.push('[<]Data row="' + i + '"[>]');
                $(this).find('td[role="gridcell"]').each(function (i) {

                    var etext = $(this).html();
                    //var eval = $(this).attr();
                    // for check box
                    if ($(this).attr('rtype') == "boolean") {
                        var eval = $(this).find('input').val();
                        var etext = eval;
                        if (eval == true)
                            etext = "true";
                        else
                            etext = "false";

                    }
                    if (eval == undefined) { eval = ""; }
                    tempval.push('[<]ColumnData datatext="' + etext.replace(/"/g, '&quot;') + '" id="' + $(this).attr("columnid") + '"[>]');
                    tempval.push(eval.replace(/"/g, '&quot;'));
                    tempval.push('[<]/ColumnData[>]');
                });
                tempval.push('[<]/Data[>]');
            //}
        });

        var thisval = tempval.join('');
        if (o[nm]) {
            if (!o[nm].push) {
                o[nm] = [o[nm]];
            }
            o[nm].push(thisval || '');
        } else {
            o[nm] = thisval || '';

        }
    });
    return o;
};