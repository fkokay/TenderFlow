$(() => {

    geTimeline();

    function scrollToDate(ciid, start, end) {

        $.ajax({
            url: "/Lists/ScrollToDate",
            data: {
                "cid": cidJsVal,
                "ciid": ciid,
                "startDate": start,
                "endDate": end
            },
            success: function () { },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false
        });
    }

    function deleteListRecords(idVal) {

        $.ajax({
            url: "/Lists/DeleteListRecords",
            data: { "CIIDs": idVal },
            success: function () { },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false
        });
    }

    function geTimeline() {

        $.ajax({
            url: '/Lists/GetTimeline/',
            type: 'Get',
            contentType: "application/json",
            dataType: "json",
            data: { "cid": cidJsVal },
            success: function (response) {

                var tasksJson = response.data;
                var isDefaultAction = true;

                const scheduler = $("#scheduler").dxScheduler({
                    dataSource: tasksJson,
                    views: ["day", "week", "month"],
                    currentView: "day",
                    currentDate: new Date(),
                    allDayPanelMode: 'all',
                    firstDayOfWeek: 0,
                    startDayHour: 7,
                    endDayHour: 24,
                    //editing: {
                    //    allowDragging: false
                    //},
                    onContentReady: (e) => {
                        li_loading.style.display = 'none';
                        li_loading.innerHTML = '';
                    },
                    onAppointmentFormOpening: function (e) {
                        e.cancel = true;
                    },
                    onAppointmentUpdated: function (e) {

                        if (e.appointmentData.id != 0 && e.appointmentData.id > 0) {

                            var taskId = e.appointmentData.id;
                            var startDateStr = "";
                            var endDateStr = "";

                            var start = e.appointmentData.startDate;
                            var end = e.appointmentData.endDate;

                            if (start != null) {
                                startDateStr = moment(start).format('YYYY-MM-DD HH:mm:ss');
                            }

                            if (end != null) {
                                endDateStr = moment(end).format('YYYY-MM-DD HH:mm:ss');
                            }

                            scrollToDate(taskId, startDateStr, endDateStr);
                        }
                    },
                    onAppointmentDeleting: function (e) {

                        if (isDefaultAction) {
                            e.cancel = true;
                            Swal.fire({
                                text: delTextLocal,
                                showCancelButton: true,
                                confirmButtonColor: '#4c81d1',
                                cancelButtonColor: '#fd397a',
                                confirmButtonText: deleteLocal,
                                cancelButtonColor: '#d3cacc',
                                cancelButtonText: calcelLocal
                            }).then((result) => {

                                if (result.value) {
                                    if (e.appointmentData.id != 0 && e.appointmentData.id > 0) {
                                        var taskId = e.appointmentData.id;
                                        isDefaultAction = false;
                                        scheduler.deleteAppointment(e.appointmentData);
                                        deleteListRecords(taskId);
                                    }
                                }
                                else {
                                    isDefaultAction = true;
                                }
                            });
                        }
                        else {
                            isDefaultAction = true;
                        }
                    },
                    onAppointmentDblClick: function (e) {
                        var clickedItem = e.appointmentData;
                        var taskId = clickedItem.id;
                        if (taskId > 0) {
                            ToggleEditListItemClick(taskId);
                        }
                    },
                    appointmentTooltipTemplate(data, cell) {

                        //console.log(data.appointmentData)
                        const tooltip = $('<div class="dx-tooltip-appointment-item">');
                        const markerColor = '#337ab7';
                        const markerBody = $('<div class="dx-tooltip-appointment-item-marker-body">').css('background', markerColor);
                        const marker = $('<div class="dx-tooltip-appointment-item-marker">').append(markerBody);
                        const content = $('<div class="dx-tooltip-appointment-item-content custom-tooltip-row-tbg">')
                            .append($('<div class="dx-tooltip-appointment-item-content-subject">').text(data.appointmentData.text))
                            .append($('<div class="dx-tooltip-appointment-item-content-date">')
                                .html(`<b class="tooltip-text-color">Başlangıç Tarihi:</b> <span class="tooltip-text-color">${moment(new Date(data.appointmentData.startDate)).format('DD-MM-YYYY HH:mm')} </span> <br>` +
                                    `<b class="tooltip-text-color">Bitiş Tarihi:</b> <span class="tooltip-text-color">${moment(new Date(data.appointmentData.endDate)).format('DD-MM-YYYY HH:mm')} </span> <br>`
                                ));

                        tooltip.append(marker);
                        tooltip.append(content);

                        const isAppointmentDisabled = data.appointmentData.disabled;
                        const isDeleteAllowed = true;

                        if (!isAppointmentDisabled && isDeleteAllowed) {
                            const buttonContainer = $('<div class="dx-tooltip-appointment-item-delete-button-container">');
                            const button = $('<div class="dx-tooltip-appointment-item-delete-button">').dxButton({
                                icon: 'trash',
                                stylingMode: 'text',
                                onClick(e) {
                                    //scheduler.hideAppointmentTooltip();
                                    scheduler.deleteAppointment(data.appointmentData);
                                }
                            });

                            buttonContainer.append(button);
                            tooltip.append(buttonContainer);
                        }

                        return tooltip;
                    }

                }).dxScheduler("instance");
            }
        });
    }
});