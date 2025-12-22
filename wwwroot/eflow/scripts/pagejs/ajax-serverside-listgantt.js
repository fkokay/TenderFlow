$(() => {

    getGantt();

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

    function getTaskTooltipContentTemplate(task) {

        var userName = task.progress.split("-")[0];

        const $customTooltip = $(document.createElement('div'))
            .addClass('custom-task-edit-tooltip');

        $(document.createElement('div'))
            .addClass('custom-tooltip-title')
            .text(task.title)
            .appendTo($customTooltip);

        $(document.createElement('div'))
            .addClass('custom-tooltip-row').addClass('custom-tooltip-row-bg')
            .html(`<b> ${startDateLocal}: </b> <span> ${moment(new Date(task.start)).format('DD-MM-YYYY HH:mm')} </span>`)
            .appendTo($customTooltip);

        $(document.createElement('div'))
            .addClass('custom-tooltip-row').addClass('custom-tooltip-row-bg')
            .html(`<b> ${endDateLocal}: </b> <span> ${moment(new Date(task.end)).format('DD-MM-YYYY HH:mm')} </span>`)
            .appendTo($customTooltip);

        $(document.createElement('div'))
            .addClass('custom-tooltip-row').addClass('custom-tooltip-row-bg')
            .html(`<b> ${initiatedByLocal}: </b> <span> ${userName} </span>`)
            .appendTo($customTooltip);

        return $customTooltip;
    }

    function getTaskContentTemplate(item) {

        const color = item.taskData.color;
        const taskWidth = `${item.taskSize.width}px;`;

        var display = "";
        if (item.taskData.id < 0) {
            display = "none;";
        }
        console.log(item.taskData.progress)
        var userName = item.taskData.progress.split("-")[1];

        //console.log(item)
        const $customContainer = $(document.createElement('div'))
            .addClass('custom-task')
            .attr('style', `width:${taskWidth}; display:${display} !important; background-color: ${color};`)
            .addClass(`custom-task-color-${color}`);

        const $imgWrapper = $(document.createElement('div'))
            .addClass('custom-task-img-wrapper')
            .appendTo($customContainer);

        $(document.createElement('div'))
            .addClass('profile-image')
            .text(userName)
            .appendTo($imgWrapper);

        const $wrapper = $(document.createElement('div'))
            .addClass('custom-task-wrapper')
            .appendTo($customContainer);

        $(document.createElement('div'))
            .addClass('custom-task-title')
            .text(item.taskData.title)
            .appendTo($wrapper);

        $(document.createElement('div'))
            .addClass('custom-task-row')
            .text('')
            .appendTo($wrapper);

        $(document.createElement('div'))
            .addClass('custom-task-progress')
            .attr('style', `width:0%;`)
            .appendTo($customContainer);

        return $customContainer;
    }

    function addDependency(predecessorID, successorID, type) {

        $.ajax({
            url: "/Lists/AddGantLink",
            data: {
                "cid": cidJsVal,
                "predecessorID": predecessorID,
                "successorID": successorID,
                "type": type
            },
            success: function () { },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false
        });
    }

    function removeDependency(predecessorID, successorID, type) {

        $.ajax({
            url: "/Lists/RemoveGantLink",
            data: {
                "cid": cidJsVal,
                "predecessorID": predecessorID,
                "successorID": successorID,
                "type": type
            },
            success: function () { },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false
        });
    }

    function getGantt() {

        $.ajax({
            url: '/Lists/GetGantt/',
            type: 'Get',
            contentType: "application/json",
            dataType: "json",
            data: { "cid": cidJsVal },
            success: function (response) {

                var tasksJson = response.data;

                var dependencies = response.dependencies;
                var dateformat = response.format;
                var delGid = response.delGid;

                var items = [
                    'collapseAll',
                    'expandAll',
                    'separator',
                    'deleteTask',
                    'separator',
                    'zoomIn',
                    'zoomOut'];

                //console.log(delGid)
                if (delGid == false) {

                    items.splice(3, 1);
                    items.splice(2, 1);
                }

                const gantt = $('#gantt').dxGantt({

                    contextMenu: {
                        items: [
                            "deleteDependency"
                        ]
                    },
                    onScaleCellPrepared: function (e) {
                        var scaleElement = e.scaleElement[0];
                        if (e.scaleIndex === 0) {
                            scaleElement.style.backgroundColor = "#8eafdf";
                            scaleElement.style.color = "white";
                        }
                    },
                    onDependencyInserted: function (e) {

                        var predecessorId = e.values.predecessorId;
                        var successorId = e.values.successorId;
                        var type = e.values.type;

                        addDependency(predecessorId, successorId, type);
                    },
                    onDependencyDeleted: function (e) {

                        var predecessorId = e.values.predecessorId;
                        var successorId = e.values.successorId;
                        var type = e.values.type;

                        removeDependency(predecessorId, successorId, type);
                    },
                    onContentReady: (e) => {
                        e.component._showDialog({});
                        e.component._dialogInstance.infoMap.TaskEdit = undefined;
                        li_loading.style.display = 'none';
                        li_loading.innerHTML = '';
                    },
                    onTaskDblClick: function (e) {

                        var selectedRowKey = e.component.option('selectedRowKey');
                        var task = e.component.getTaskData(selectedRowKey);

                        if (task.id > 0) {
                            ToggleEditListItemClick(task.id);
                        }
                    },
                    onTaskDeleting: function (e) {

                        if (e.key != 0 && e.key > 0) {

                            deleteListRecords(e.key);
                            //e.cancel = true;
                        }
                    },
                    onTaskUpdating: function (e) {

                        if (e.key != 0 && e.key > 0) {

                            var taskId = e.key;
                            var startDateStr = "";
                            var endDateStr = "";

                            var start = e.newValues.start;
                            var end = e.newValues.end;

                            if (start != null) {
                                startDateStr = moment(start).format('YYYY-MM-DD HH:mm:ss');
                            }

                            if (end != null) {
                                endDateStr = moment(end).format('YYYY-MM-DD HH:mm:ss');
                            }

                            scrollToDate(taskId, startDateStr, endDateStr);
                            //e.cancel = true;
                        }
                    },
                    tasks: {
                        dataSource: tasksJson,
                    },
                    dependencies: {
                        dataSource: dependencies,
                    },
                    editing: {
                        enabled: true,
                        allowDependencyAdding: true,
                        allowDependencyDeleting: true,
                    },
                    validation: {
                        autoUpdateParentTasks: false,
                    },
                    toolbar: {
                        items: items,
                    },
                    columns: [{
                        dataField: 'title',
                        caption: subjectLocal,
                        width: 300,
                    }, {
                        dataField: 'start',
                        dataType: 'date',
                        format: dateformat,
                        caption: startDateLocal,
                    }, {
                        dataField: 'end',
                        dataType: 'date',
                        format: dateformat,  
                        caption: endDateLocal,
                    }],
                    scaleType: 'months',
                    taskListWidth: 500,

                    taskTooltipContentTemplate: getTaskTooltipContentTemplate,
                    taskContentTemplate: getTaskContentTemplate

                }).dxGantt('instance');

                gantt.option('scaleType', 'days');
            }
        });
    }
});

