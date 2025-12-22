"use strict";

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('widgetSearch').addEventListener('input', handleWidgetSearch);
    document.getElementById('clearWidgetSearch').addEventListener('click', resetWidgetItems);

    // Dropdown visibility changes and focus input
    var dropdownElement = document.getElementById('dashboardWidgetsDropDown');
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.attributeName === 'class') {
                var targetElement = mutation.target;

                // Reset items if dropdown is not shown
                if (!targetElement.classList.contains('show')) {
                    resetWidgetItems();
                } else {
                    // Focus on the search input 
                    //document.getElementById('widgetSearch').focus({ preventScroll: true });
                }
            }
        });
    });

    observer.observe(dropdownElement, { attributes: true });

    function handleWidgetSearch() {
        var filter = this.value.toLowerCase();
        var items = document.querySelectorAll('#dashboardWidgetsDropDown .widget__item');
        var allHidden = true; // all are hidden initially

        items.forEach(function (item) {
            var title = item.querySelector('.widget__item-title').textContent.toLowerCase();
            var subtitleElement = item.querySelector('.widget__item-subtitle');
            var subtitle = subtitleElement ? subtitleElement.textContent.toLowerCase() : '';

            if (title.includes(filter) || subtitle.includes(filter)) {
                if (filter.length >= 3) {
                    item.style.display = '';
                    allHidden = false;
                }
            } else {
                item.style.display = 'none';
            }
        });

        // Check if all items are hidden and the filter length is at least 3 characters
        if (allHidden && filter.length >= 3) {
            showEmptyWidgetAlert(); // Show alert 
        } else {
            removeEmptyWidgetAlert(); // Remove alert
        }
    }

    function showEmptyWidgetAlert() {
        var alertBox = document.querySelector('#dashboardWidgetsDropDown .empty-widget');
        if (!alertBox) { // the alert existance checker
            var alertHTML = `
            <div class="alert empty-widget fade show" role="alert">
                <div class="alert-icon"><i class="flaticon-search"></i></div>
                <div class="alert-text">Aramanızla eşleşen widget bulunamadı.</div>
            </div>`;
            document.querySelector('#dashboardWidgetsDropDown .dashboard-widget-wrapper').insertAdjacentHTML('beforeend', alertHTML);
        }
    }

    function removeEmptyWidgetAlert() {
        var alertBox = document.querySelector('#dashboardWidgetsDropDown .empty-widget');
        if (alertBox) {
            alertBox.remove(); // Remove the alert
        }
    }

    function resetWidgetItems() {
        var items = document.querySelectorAll('#dashboardWidgetsDropDown .widget__item');
        items.forEach(item => item.style.display = ''); // Show all widget items
        document.getElementById('widgetSearch').value = ''; // Clear the search input

        removeEmptyWidgetAlert();
    }

    // Custom gradient color palette popover for customizing widget card
    // CCP - Custom Color Palette
    function createCustomColorPalette() {
        const paletteHTML = `
        <div class="customColorPalette" style="position: absolute;">
            <div class="ccp_head">
                <div class="ccp_title">
                    <i class="fa fa-paint-brush"></i> Renk seçin
                </div>
                <div class="ccp_close">
                    <i class="la la-times"></i>
                </div>
            </div>
            <div class="ccp_body">
                <div class="loading-ccp"><div class="kt-spinner kt-spinner--sm kt-spinner--brand"></div></div>
            </div>
        </div>`;

        const paletteElement = document.createElement('div');
        paletteElement.innerHTML = paletteHTML;
        return paletteElement.firstElementChild;
    }

    function showCustomColorPalette(event, widgetShape) {
        // Remove any existing palette
        const existingPalette = document.querySelector('.customColorPalette');
        if (existingPalette) {
            existingPalette.remove();
        }

        // Create the palette with the loading spinner 
        const palette = createCustomColorPalette();
        document.body.appendChild(palette);

        // Position the palette 
        positionPalette(palette, event);

        // Replace the loading spinner with the actual color options after the delay
        setTimeout(() => {
            const ccpBody = palette.querySelector('.ccp_body');
            ccpBody.innerHTML = `
                <div class="ccp__grid">
                    <span class="ccp_option gradient00"></span>
                    <span class="ccp_option gradient01"></span>
                    <span class="ccp_option gradient02"></span>
                    <span class="ccp_option gradient10"></span>
                    <span class="ccp_option gradient07"></span>
                    <span class="ccp_option gradient37"></span>
                    <span class="ccp_option gradient11"></span>
                    <span class="ccp_option gradient14"></span>
                    <span class="ccp_option gradient12"></span>
                    <span class="ccp_option gradient23"></span>
                    <span class="ccp_option gradient41"></span>
                    <span class="ccp_option gradient03"></span>
                    <span class="ccp_option gradient29"></span>
                    <span class="ccp_option gradient21"></span>
                    <span class="ccp_option gradient40"></span>
                    <span class="ccp_option gradient13"></span>
                    <span class="ccp_option gradient30"></span>
                    <span class="ccp_option gradient18"></span>
                    <span class="ccp_option gradient15"></span>
                    <span class="ccp_option gradient08"></span>
                    <span class="ccp_option gradient04"></span>
                    <span class="ccp_option gradient17"></span>
                    <span class="ccp_option gradient27"></span>
                    <span class="ccp_option gradient34"></span>
                    <span class="ccp_option gradient35"></span>
                    <span class="ccp_option gradient39"></span>
                    <span class="ccp_option gradient05"></span>
                    <span class="ccp_option gradient31"></span>
                    <span class="ccp_option gradient33"></span>
                    <span class="ccp_option gradient26"></span>
                    <span class="ccp_option gradient25"></span>
                    <span class="ccp_option gradient06"></span>
                    <span class="ccp_option gradient22"></span>
                    <span class="ccp_option gradient19"></span>
                    <span class="ccp_option gradient16"></span>
                    <span class="ccp_option gradient09"></span>
                    <span class="ccp_option gradient36"></span>
                    <span class="ccp_option gradient24"></span>
                    <span class="ccp_option gradient28"></span>
                    <span class="ccp_option gradient32"></span>
                    <span class="ccp_option gradient20"></span>
                    <span class="ccp_option gradient38"></span>
                </div>
            `;
            setupPaletteInteractions(palette, widgetShape);
            updateCurrentClass(widgetShape, palette);
        }, 300);
    }

    // CCP positioning issues
    function positionPalette(palette, event) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        if (screenWidth < 1280 || screenHeight < 900) {
            palette.style.position = 'fixed';
            palette.style.top = '50%';
            palette.style.left = '50%';
            palette.style.transform = 'translate(-50%, -50%)';
        } else {
            let top = event.clientY + 15;
            let left = event.clientX - 15;
            const paletteWidth = palette.offsetWidth;
            const paletteHeight = palette.offsetHeight;

            if (left + paletteWidth > screenWidth) {
                left = screenWidth - paletteWidth - 115;
            }

            if (top + paletteHeight > screenHeight) {
                top = screenHeight - paletteHeight - 140;
            }

            palette.style.top = `${top}px`;
            palette.style.left = `${left}px`;
            palette.style.transform = 'none';
        }
    }

    function setupPaletteInteractions(palette, widgetShape) {
        palette.style.display = 'flex';

        palette.querySelector('.ccp_close').addEventListener('click', function () {
            palette.remove();
            widgetShape.classList.remove('customizing');
        });

        palette.querySelectorAll('.ccp_option').forEach(option => {
            option.addEventListener('click', function () {
                const gradientClass = option.classList[1];
                widgetShape.className = `scolor-shape widget-card__shape ${gradientClass} customizing`;
                updateCurrentClass(widgetShape, palette);
                showSaveAndUndoButtons();
            });
        });

        document.addEventListener('click', function handleClickOutside(event) {
            if (!palette.contains(event.target) && !widgetShape.contains(event.target)) {
                palette.remove();
                widgetShape.classList.remove('customizing');
                document.removeEventListener('click', handleClickOutside);
            }
        }, true);
    }

    // buttonForColorPalette called after HTML fetching, inside setTimeOut
    function buttonForColorPalette() {
        document.addEventListener('click', function (event) {
            const button = event.target.closest('.btnCustomizeCard');
            if (button) {
                event.stopPropagation();
                event.preventDefault();

                const widgetShape = button.closest('.widget-card__shape');
                widgetShape.classList.add('customizing');  // Add 'customizing' class immediately

                //console.log('btnCustomizeCard clicked, showing palette...');
                showCustomColorPalette(event, widgetShape);
            }
        });
    }

    function updateCurrentClass(widgetShape, palette) {
        palette.querySelectorAll('.ccp_option').forEach(function (option) {
            option.classList.remove('current');
        });

        const currentClass = Array.from(widgetShape.classList).find(cls => cls.startsWith('gradient'));

        if (currentClass) {
            const matchingOption = palette.querySelector(`.${currentClass}`);
            if (matchingOption) {
                matchingOption.classList.add('current');
            }
        } else {
            const firstOption = palette.querySelector('.ccp_option');
            if (firstOption) {
                firstOption.classList.add('current');
            }
        }
    }

    // Function to check if grid-stack is empty
    function checkGridAndToggleAlert() {
        var gridStackElement = document.querySelector('.grid-stack');
        var gridStackWidgets = gridStackElement.children.length;
        var alertBox = document.querySelector('.alert.empty-dashboard');

        var alertBox = document.querySelector('.alert.empty-dashboard');
        if (!alertBox && gridStackWidgets === 0) {
            compactButton.style.display = 'none';
            // If no widgets and no alert box > insert the alert
            var alertHTML = `
            <div class="alert empty-dashboard fade show" role="alert">
                <div class="alert-icon">
                    <i class="flaticon-warning"></i>
                </div>
                <div class="alert-text">${emptyDashboard}</div>
            </div>`;

            gridStackElement.insertAdjacentHTML('beforebegin', alertHTML);

        } else if (alertBox && gridStackWidgets > 0) {

            alertBox.parentNode.removeChild(alertBox);
        }
    }

    function getWidgetSize(widgetId) {
        let sizes = {
            '998': { width: 4, height: 8 },
            '999': { width: 4, height: 8 },
            '1000': { width: 4, height: 8 },
            '1001': { width: 4, height: 8 },
            "1002": { width: 4, height: 8 },
            "1003": { width: 4, height: 8 },
            "1004": { width: 4, height: 8 },
            "1005": { width: 4, height: 8 },
            "1006": { width: 4, height: 8 },
            "1007": { width: 4, height: 8 },
            "1008": { width: 4, height: 8 },
            "1009": { width: 4, height: 8 },
            "1010": { width: 4, height: 8 },
            "1011": { width: 4, height: 8 },
        };
        return sizes[widgetId] || { width: 4, height: 8 };
    }

    // handleNoTaskDayTab()
    // inserts a 'no-task-day-alert' message if a 'tab-pane' with the given date ID exists 
    // but contains no '<ul class="widget-row-wrapper">' list items.
    // This indicates that tasks data are available for this day but can be completed or none are active.
    function handleNoTaskDayTab() {
        const dayPillButtons = document.querySelectorAll('button.nav-link.has-badge');

        dayPillButtons.forEach(button => {

            button.addEventListener('click', function () {
                const tabPaneId = button.getAttribute('data-task');
                const targetPaneId = `tasks_for_${tabPaneId}`;
                const widgetCardBody = button.closest('.widget-card').querySelector('.widget-card__body .tab-content');

                if (!widgetCardBody) return;

                // Remove 'active' class from all tab panes and any fallback if present
                const allTabPanes = widgetCardBody.querySelectorAll('.tab-pane');
                allTabPanes.forEach(tabPane => {
                    tabPane.classList.remove('active');
                    const noTaskDayAlert = tabPane.querySelector('.no-task-day-alert');
                    if (noTaskDayAlert) {
                        noTaskDayAlert.remove();
                    }
                });

                const targetTabPane = widgetCardBody.querySelector(`#${targetPaneId}`);
                if (targetTabPane) {
                    targetTabPane.classList.add('active');
                    targetTabPane.style.display = 'block';

                    // Insert alert only if `tab-pane` is empty and alert does not already exist
                    if (button.classList.contains('noTaskDay') &&
                        !targetTabPane.querySelector('.widget-row-wrapper') &&
                        !targetTabPane.querySelector('.no-task-day-alert')) {

                        const noTaskDayAlert = document.createElement('div');
                        noTaskDayAlert.className = 'alert no-task-day-alert kt-margin-t-10';
                        noTaskDayAlert.innerHTML = `Göreviniz Bulunmamaktadır`;
                        //targetTabPane.appendChild(noTaskDayAlert);

                    }
                }
            });
        });
    }

    // handleNoTasksDataTabFallback()
    // Inserts a 'no-tasks-data-alert' message as a fallback if no 'tab-pane' with the required date ID 
    // is found in the DOM. This is used to indicate that no data was fetched for the specified date
    function handleNoTasksDataTabFallback() {
        const dayPillButtons = document.querySelectorAll('button.nav-link.has-badge');

        dayPillButtons.forEach(button => {

            button.addEventListener('click', function () {
                const widgetCardBody = button.closest('.widget-card').querySelector('.widget-card__body .tab-content');
                const tabPaneId = button.getAttribute('data-task');
                const targetPaneId = `tasks_for_${tabPaneId}`;

                if (!widgetCardBody) return;

                const allTabPanes = widgetCardBody.querySelectorAll('.tab-pane');
                allTabPanes.forEach(tabPane => {
                    tabPane.classList.remove('active');
                    tabPane.style.display = 'none';
                });

                const targetTabPane = widgetCardBody.querySelector(`#${targetPaneId}`);
                if (!targetTabPane && button.classList.contains('noTasksData')) {

                    let fallbackTabPane = widgetCardBody.querySelector('#noTasksFallback');
                    if (!fallbackTabPane) {
                        fallbackTabPane = document.createElement('div');
                        fallbackTabPane.classList.add('tab-pane');
                        fallbackTabPane.id = 'noTasksFallback';
                        fallbackTabPane.role = 'tabpanel';
                        fallbackTabPane.innerHTML = `Günün görev bilgileri yüklenemedi.`;
                        //widgetCardBody.appendChild(fallbackTabPane);
                    }
                    fallbackTabPane.style.display = 'block';
                } else {
                    // Hide the fallback pane if an existing `tab-pane` is clicked
                    const fallbackTabPane = widgetCardBody.querySelector('#noTasksFallback');
                    if (fallbackTabPane) {
                        fallbackTabPane.classList.remove('active');
                        fallbackTabPane.style.display = 'none';
                    }
                    if (targetTabPane) {
                        targetTabPane.classList.add('active');
                        targetTabPane.style.display = 'block';
                    }
                }
            });
        });
    }

    function getWeekendByLang(lang) {

        var weekendDays = ['Ct', 'Pa'];

        if (lang == "en") {
            weekendDays = ['Sa', 'Su'];
        }
        else if (lang == "ru") {
            weekendDays = ['Сб', 'Вс'];
        }
        else if (lang == "de") {
            weekendDays = ['Sa', 'So'];
        }
        else if (lang == "es") {
            weekendDays = ['S', 'D'];
        }
        else if (lang == "fr") {
            weekendDays = ['sa', 'di'];
        }
        else if (lang == "az") {
            weekendDays = ['Ş.', 'B.'];
        }
        else if (lang == "pl") {
            weekendDays = ['sob', 'nie'];
        }
        else if (lang == "ar") {
            weekendDays = ['س', 'ح'];
        }

        return weekendDays;
    }

    function getColorCodes(widgetId, colorShapes) {

        var items = [];

        try {

            $.each(colorShapes, function (index, value) {

                if (widgetId == 1008 || widgetId == 1002 || widgetId == 998) {

                    var color_id = value.getAttribute('color-id');
                    var colorClasss = $(value).attr("class").match(/[\w-]*gradient[\w-]*/g);

                    if (colorClasss) {

                        var isDefault_1008 = (widgetId == 1008 && colorClasss != "gradient00");
                        var isDefault_1002 = (widgetId == 1002 && colorClasss != "gradient32");
                        var isDefault_998 = (widgetId == 998 && colorClasss != "gradient32");

                        if (isDefault_1008 == true || isDefault_1002 == true || isDefault_998 == true) {

                            items.push({
                                wId: widgetId,
                                id: color_id,
                                color: colorClasss[0]
                            });
                        }

                    }
                }
            });

        } catch (e) { }

        return items;
    }

    function getDefaultSelects(widgetId, defaultSelect) {

        var items = [];

        try {

            if (widgetId == 1000 || widgetId == 1008 || widgetId == 1009) {

                items.push({
                    wId: widgetId,
                    select: defaultSelect
                });
            }

        } catch (e) { }

        return items;
    }

    function saveData() {

        var items = [];
        var colors = [];
        var selects = [];

        $('.grid-stack .grid-stack-item').each(function () {

            var $this = $(this);

            var widgetId = $this.attr('gs-id');

            if (widgetId == 1008 || widgetId == 1002 || widgetId == 998) {

                var colorShapes = $('#' + widgetId + ' .scolor-shape');
                var colorCodes = getColorCodes(widgetId, colorShapes);
                if (colorCodes.length > 0) {
                    colors = $.merge(colors, colorCodes);
                }
            }

            if (widgetId == 1000 || widgetId == 1008 || widgetId == 1009) {

                //Get filter type value of selected dropdown
                var defaultSelect = $('#filter_' + widgetId).attr('filter-type');
                var selectBox = getDefaultSelects(widgetId, defaultSelect);
                if (selectBox.length == 1) {
                    selects = $.merge(selects, selectBox);
                }
            }

            items.push({
                x: $this.attr('gs-x'),
                y: $this.attr('gs-y'),
                w: $this.attr('gs-w'),
                h: $this.attr('gs-h'),
                id: $this.attr('gs-id'),
                content: $this.attr('gs-id')
            });
        });

        $.ajax({
            url: "/DashboardPanel/UpdateCoordinateData",
            data: {
                "jsonData": JSON.stringify(items),
                "jsonColor": JSON.stringify(colors),
                "jsonDefaultSelect": JSON.stringify(selects)
            },
            success: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false
        });
    }

    function getData(gridstack) {

        $.ajax({
            url: '/DashboardPanel/GetCoordinateData/',
            type: 'Get',
            contentType: "application/json",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {

                //Clear all checkboxes
                $('#dashboardWidgetsDropDown input:checkbox').prop('checked', false);

                if (response.items == "") {

                    var gridStackElement = document.querySelector('.grid-stack');

                    // If no widgets and no alert box > insert the alert
                    var alertHTML = `
            <div class="alert empty-dashboard fade show" role="alert">
                <div class="alert-icon">
                    <i class="flaticon-warning"></i>
                </div>
                <div class="alert-text">${emptyDashboard}</div>
            </div>`;

                    if ($("#kt_content .empty-dashboard").length == 0) {
                        gridStackElement.insertAdjacentHTML('beforebegin', alertHTML);
                    }
                }
                else {

                    var alertBox = document.querySelector('.alert.empty-dashboard');
                    if (alertBox) {
                        alertBox.parentNode.removeChild(alertBox);
                    }

                    var resColor = [];
                    var resDefaultSelects = [];

                    var resData = $.parseJSON(response.items);

                    if (response.colors) {
                        var resColor = $.parseJSON(response.colors);
                    }

                    if (response.defaultSelects) {
                        var resDefaultSelects = $.parseJSON(response.defaultSelects);
                    }

                    var showedItems = 0;
                    var totalItems = Object.keys(resData).length;

                    Object.keys(resData).forEach(key => {

                        var url = widgetFiles[("modallabel_" + resData[key].id)];
                        var moduleId = parseInt(resData[key].id);
                        var allColors = resColor;
                        var allSelects = resDefaultSelects;

                        var moduleColors = $.grep(allColors, function (v) {
                            return v.wId === moduleId.toString();
                        });

                        var moduleSelects = $.grep(allSelects, function (v) {
                            return v.wId === moduleId.toString();
                        });

                        $.ajax({
                            type: 'GET',
                            dataType: "html",
                            cache: false,
                            url: '/DashboardPanel/' + url,
                            success: function (data) {

                                var widget = {
                                    x: parseInt(resData[key].x),
                                    y: parseInt(resData[key].y),
                                    w: parseInt(resData[key].w),
                                    h: parseInt(resData[key].h),
                                    id: parseInt(resData[key].id),
                                    content: data
                                };

                                var dataFilter = -1;

                                try {
                                    if (moduleSelects[0]) {
                                        dataFilter = moduleSelects[0].select;
                                    }
                                } catch { }

                                addWidget(gridstack, widget.id, widget.w.toString(), widget.h.toString(), widget.x.toString(), widget.y.toString(), false, dataFilter, moduleColors);

                                $("#modallabel_" + resData[key].id).prop('checked', true);

                                showedItems = showedItems + 1;

                                //GridStack loaded
                                if (showedItems == totalItems) {
                                    $("#startVirtualTour").show();

                                    if (!localStorage.getItem("virtualTourfeatureSeen")) {
                                        startVirtualTour();
                                    }
                                }
                            }
                        });

                    });
                }
            }
        });
    }

    function addWidget(gridstack, widgetId, width, height, x, y, delBefore = false, dataFilter = -1, colors = []) {

        if (delBefore == true) {
            var widget = document.getElementById(widgetId);
            gridDash.removeWidget(widget);
        }

        // Create a new div that's gonna be a widget
        var widget = document.createElement('div');
        widget.classList.add('grid-stack-item');
        widget.id = widgetId;

        //Default filter types
        if (dataFilter == -1 && widgetId == 1009) {
            dataFilter = 1;
        }
        else if (dataFilter == -1 && widgetId == 1008) {
            dataFilter = 0;
        }
        else if (dataFilter == -1 && widgetId == 1000) {
            dataFilter = 6;
        }

        // Set widget attributes      
        widget.setAttribute('gs-id', widgetId);
        widget.setAttribute('gs-w', width);
        widget.setAttribute('gs-h', height);

        if (x) {
            widget.setAttribute('gs-x', x);
        }

        if (y) {
            widget.setAttribute('gs-y', y);
        }
        else {
            widget.setAttribute('gs-y', '0');
        }

        //if (widgetId == 1010) {
        //    widget.setAttribute('gs-min-w', '4');
        //    widget.setAttribute('gs-min-h', '8');
        //    widget.setAttribute('gs-max-h', '8');
        //}
        //else {
        // Set minimum size
        widget.setAttribute('gs-min-w', '2');
        widget.setAttribute('gs-min-h', '3');
        //}

        // Create a div for content that initially shows a loading spinner
        var contentDiv = document.createElement('div');
        contentDiv.classList.add('grid-stack-item-content');
        contentDiv.classList.add('grid-stack-item-content_' + widgetId);
        contentDiv.innerHTML = '<div class="loading-gridstack-widget-content"><div class="kt-spinner kt-spinner--sm kt-spinner--brand"></div></div>';

        // Append the content div to the widget
        widget.appendChild(contentDiv);

        // Add the widget to the grid
        gridstack.addWidget(widget);

        var url = widgetFiles["modallabel_" + widgetId];

        setTimeout(() => {

            $.ajax({
                type: 'GET',
                dataType: "html",
                cache: false,
                data: {
                    dataFilter: dataFilter,
                    colors: JSON.stringify(colors).replace('[]', '')
                },
                url: '/DashboardPanel/' + url,
                success: function (data) {

                    // Replace the loading with the actual content
                    contentDiv.innerHTML = data;

                    if (parseInt(widgetId) === 1010) {
                        initializeChart(widgetId);
                    }

                    KTApp.init(); // Re-initialize KTApp
                    applyBorderColorToPseudoElements(); //assign border-left-color to its pseudo element
                    applyBorderColorToNumber(); // assign border-left-color to its span.__number as color

                    buttonForColorPalette(); // Calls functions of custom color palette
                    trimFileNamesInsertAsTitle();


                    setTimeout(() => {
                        handleWidgetTitleWidth(widget, widgetId.toString());
                    }, 1065); // Delay for rendering and replacing the remove_ button

                    if (parseInt(widgetId) === 1001) {

                        initializeDayPills(contentDiv);
                        resetScrollOffset(taskDaysListing);

                        contentDiv.querySelector('#scrollDaysRight').addEventListener('click', () => scrollDayPills('right'));
                        contentDiv.querySelector('#scrollDaysLeft').addEventListener('click', () => scrollDayPills('left'));
                        resetPerfectScrollbarOnTabSwitch();
                    }

                    // Set up the removal button inside the fetched content
                    var removeButton = contentDiv.querySelector(`#remove_${widgetId}`);
                    if (removeButton) {
                        removeButton.addEventListener('click', function (event) {

                            event.stopPropagation();

                            if (chartInstances[widgetId]) {
                                chartInstances[widgetId].destroy();  // destroy chart
                                delete chartInstances[widgetId];  // Remove reference
                            }
                            // handle removing the widget from Gridstack
                            var widget = document.getElementById(widgetId);
                            if (widget) {
                                gridDash.removeWidget(widget);
                                var checkbox = document.getElementById(`modallabel_${widgetId}`);
                                if (checkbox) {
                                    checkbox.checked = false;
                                    var widgetItem = checkbox.closest('.widget__item');
                                    if (widgetItem) {
                                        widgetItem.classList.remove('widget-selected');
                                    }
                                    checkbox.dispatchEvent(new Event('change'));
                                }
                            }
                        });
                    }

                    // Make dropdown act like a select element
                    const dropdownItems = contentDiv.querySelectorAll('.widget-card-dropdown .dropdown-item');
                    //console.log('Dropdown items found:', dropdownItems);

                    if (dropdownItems.length > 0) {
                        dropdownItems.forEach(item => {
                            item.addEventListener('click', function (e) {

                                e.preventDefault();

                                const dropdown = e.currentTarget.closest('.widget-card-dropdown');
                                if (dropdown) {

                                    const button = dropdown.querySelector('.widget-btn');
                                    if (button) {

                                        button.innerHTML = `<i class="la la-calendar"></i> ${e.currentTarget.textContent}`;
                                        console.log('Button text set to:', button.innerHTML);

                                        //Refresh widget by dropdown
                                        var targetElement = e.target || e.srcElement;
                                        var dataFilter = $(targetElement).attr("drop-val");
                                        var moduleId = $(targetElement).attr("module-id");
                                        var currentW = $("#" + moduleId).attr("gs-w");
                                        var currentH = $("#" + moduleId).attr("gs-h");
                                        var currentX = $("#" + moduleId).attr("gs-x");
                                        var currentY = $("#" + moduleId).attr("gs-y");

                                        addWidget(gridDash, moduleId, currentW, currentH, currentX, currentY, true, dataFilter, colors);

                                    } else {
                                        console.error('.widget-card-dropdown buton bulunamadı');
                                    }
                                } else {
                                    console.error('Closest.widget-card-dropdown bulunamadı');
                                }
                            });
                        });
                    } 
                },
                error: function (xhr, ajaxOptions, error) {
                    console.error('Widget yüklenirken hata oluştu:', error);
                    contentDiv.innerHTML = '<p>İçerik yüklenirken hata oluştu</p>';
                }
            });

        }, 300);
    }

    var chartInstances = {};

    function initializeChart(widgetId) {

        $.ajax({
            type: 'GET',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            cache: false,
            url: '/DashboardPanel/InitPerformanceChart',
            success: function (response) {

                var chartElement = document.querySelector(`#chart_taskCompletionTime`);
                if (chartElement && response.performData.length > 0) {

                    var series = [];
                    var labels = response.performData[0].labels;

                    for (var i = 0; i < response.performData.length; i++) {

                        series.push({
                            name: response.performData[i].performName,
                            type: 'area',
                            data: response.performData[i].series
                        });
                    }

                    var options = {
                        chart: {
                            width: '100%',
                            height: '100%',
                            type: 'line',
                            toolbar: {
                                show: false
                            }
                        },
                        series: series,

                        stroke: {
                            curve: 'smooth',
                            show: true,
                            width: 2,

                        },
                        fill: {
                            type: 'gradient',
                            gradient: {
                                type: "vertical",
                                shade: "light",
                                shadeIntensity: 1,
                                inverseColors: false,
                                opacityFrom: 0.40,
                                opacityTo: 0.00,
                                stops: [0, 100]
                            },
                        },
                        labels: labels,
                        markers: {
                            size: 0
                        },
                        tooltip: {
                            shared: true,
                            intersect: false,
                            y: {
                                formatter: function (y) {
                                    if (typeof y !== "undefined") {
                                        return y.toFixed(0) + " " + EFlang.F_Hours;
                                    }
                                    return y;
                                }
                            }
                        }
                    };
                    var chart = new ApexCharts(chartElement, options);
                    chart.render();

                    // Store the chart instance 
                    chartInstances[widgetId] = chart;
                    apexChartFillContainer();
                } else {
                    //console.error(widgetId, 'grafiği bulunamadı.');
                }
            }
        });
    }

    function apexChartFillContainer() {

        var chartElement = document.querySelector('#chart_taskCompletionTime');

        if (!chartElement) {
            return;
        }

        var widgetContainer = document.querySelector(`[gs-id="1010" ]`);

        if (!widgetContainer) {
            return;
        }

        // Find the header element
        var headerElement = widgetContainer.querySelector('.widget-card__head');

        if (!headerElement) {
            console.warn("#widget_taskPerformance header'i bulunamadı.");
            return;
        }

        setTimeout(() => {

            var widgetHeight = widgetContainer.offsetHeight;

            // Check if narrow-widget-title header
            var isNarrow = headerElement.classList.contains('narrow-widget-title');
            var headerHeight = isNarrow ? 91 : 61;
            var padding = 50;

            // new chart height
            var newHeight = widgetHeight - (headerHeight + padding);

            if (typeof chartInstances !== 'undefined' && chartInstances[1010]) {
                let chartInstance = chartInstances[1010];

                // Apply calculated height
                chartInstance.updateOptions({
                    chart: {
                        height: newHeight
                    }
                });

                // chart container and SVG takes correct height
                chartElement.style.height = `${newHeight}px`;
                chartElement.style.minHeight = '0px';

                var chartSVG = chartElement.querySelector('svg');
                if (chartSVG) {
                    chartSVG.style.height = `${newHeight}px`; // SVG height update
                }
            }
        }, 100);
    }

    // Using transform translateX for offset
    // Reset scroll offset
    function resetScrollOffset(taskDaysListing) {

        currentScrollOffset = 0;
        Array.from(taskDaysListing.children).forEach((li) => {
            li.style.transform = 'translateX(0px)';
        });
    }

    // moment.js locale based on HTML 'lang'
    function setMomentLocaleFromHTML() {
        const language = document.documentElement.lang;
        moment.locale(language === 'tr' ? 'tr' : 'en');
    }

    let currentScrollOffset = 0;
    const daysToAddPerScroll = 1; // add 1 day pill button per scroll
    const scrollIncrement = 50 * daysToAddPerScroll; // Width of each day pill button
    let visibleButtonCount;
    var lastPillCount = 0;

    function isPillChanged() {

        //Page load
        if (lastPillCount == 0)
            return true;

        var result = false;

        var pills = taskDaysListing.querySelectorAll('.nav-link.has-badge');

        if (pills.length != lastPillCount) {
            result = true;
        }

        return result;
    }

    // Initialize the day pills when #widget_tasksUrgentDeadlines is loaded
    function initializeDayPills(contentDiv) {

        const widget = document.getElementById('1001');
        const taskDaysListing = contentDiv.querySelector('#taskDaysListing');
        const activeDateTabPane = contentDiv.querySelector('#activeDateTabPane');
        var langStr = EFlang.localeCode;

        if (langStr == "ar") {
            langStr = "en";
        }
        moment.locale(langStr); // Set locale

        const currentDate = moment();

        // format date for div#activeDateTabPane
        const formattedDate = currentDate.format("D MMMM YYYY"); // Full date
        const displayDate = currentDate.format("DD.MM.YYYY");    // Shortened date

        // Set the title attribute of div#activeDateTabPane
        //activeDateTabPane.title = `${formattedDate} tarihli görevleriniz görüntüleniyor`;

        // Set shortened date of div#activeDateTabPane as text
        activeDateTabPane.textContent = displayDate;

        // Clear existing day pills after setting locale
        taskDaysListing.innerHTML = '';


        // recalculate day pills based on the new width
        const taskDaysListingWidth = taskDaysListing.clientWidth;
        const buttonWidth = 50; // Width of each day pill button
        const visibleButtonCount = Math.floor(taskDaysListingWidth / buttonWidth);

        const daysToShowAroundCurrent = Math.floor((visibleButtonCount + 1) / 2);

        // Add past days
        for (let i = daysToShowAroundCurrent; i > 0; i--) {
            const pastDay = moment(currentDate).subtract(i, 'days');
            taskDaysListing.insertAdjacentHTML('beforeend', createDayButton(pastDay));
        }

        // Add urrent day button
        const currentDayButton = createDayButton(currentDate, true);
        taskDaysListing.insertAdjacentHTML('beforeend', currentDayButton);
        taskDaysListing.lastElementChild.querySelector('button').classList.add('active');

        // Add future days
        for (let i = 1; i <= daysToShowAroundCurrent; i++) {
            const futureDay = moment(currentDate).add(i, 'days');
            taskDaysListing.insertAdjacentHTML('beforeend', createDayButton(futureDay));
        }

        // Click event to each day button
        taskDaysListing.addEventListener('click', (event) => {
            const target = event.target.closest('.nav-link.has-badge');
            if (target) {
                const date = target.getAttribute('data-task');
                const selectedDate = moment(date, "DDMMYYYY");
                const formattedSelectedDate = selectedDate.format("D MMMM YYYY");
                const displaySelectedDate = selectedDate.format("DD.MM.YYYY");

                // Update title and text for div#activeDateTabPane
                activeDateTabPane.title = `${formattedSelectedDate} tarihli görevleriniz`;

                activeDateTabPane.textContent = displaySelectedDate;

                activeDateTabPane.classList.add('transitioning');

                setTimeout(() => {
                    activeDateTabPane.classList.remove('transitioning');
                }, 1000);
            }
        });

        setTimeout(() => {
            const buttons = taskDaysListing.querySelectorAll('.nav-link.has-badge');
            setDayPillCounts(buttons);
        }, 1);
    }

    function formatNumber(num) {
        return num < 10 ? "0" + num : num.toString();
    }

    function setDayPillCounts(buttonList) {

        var isChanged = isPillChanged();

        if (isChanged == true) {
            setTimeout(() => {

                var items = [];

                lastPillCount = buttonList.length;

                $.each(buttonList, function (key, button) {

                    var $this = $(this);

                    var day = parseInt($this.attr('day'));
                    var month = parseInt($this.attr('month'));
                    var year = parseInt($this.attr('year'));
                    var ddmmyyyy = formatNumber(day) + '.' + formatNumber(month) + '.' + year;

                    items.push({
                        ddmmyyyy: ddmmyyyy
                    });
                });

                $.ajax({
                    url: "/DashboardPanel/GetTasksByCompletionDateTaskCounts",
                    data: {
                        "jsonData": JSON.stringify(items)
                    },
                    success: function (data) {

                        $.each(buttonList, function (key, button) {

                            var taskCount = 0;

                            var buttonId = button.id.replace("btn_for_", "");

                            var res = data.countData.filter(function (o) {
                                return o.Date == buttonId
                            }).pop();

                            if (res) {
                                taskCount = res.TaskCount;
                            }

                            button.setAttribute('data-total-items', taskCount.toString());

                            if (taskCount == 0) {
                                button.classList.add('noTasksData');
                            }

                        });

                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    cache: false
                });

            }, 100);
        }
    }

    function getDayNameByCulture(dName) {

        var name = dName;

        if (EFlang.localeCode == "ar") {
            if (dName == "Mo") {
                name = "ن";
            }
            else if (dName == "Tu") {
                name = "ث";
            }
            else if (dName == "We") {
                name = "ر";
            }
            else if (dName == "Th") {
                name = "خ";
            }
            else if (dName == "Fr") {
                name = "ج";
            }
            else if (dName == "Sa") {
                name = "س";
            }
            else if (dName == "Su") {
                name = "ح";
            }
        }

        return name;
    }

    // Function to create each day button
    function createDayButton(date, isToday = false) {

        const todayAttribute = isToday ? 'data-current="today"' : '';
        const isWeekend = date.day() === 6 || date.day() === 0;
        const weekendClass = isWeekend ? 'isWeekend' : '';
        var day = date.format('DD');
        var month = date.format('MM');
        var year = date.format('YYYY');
        var dayName = getDayNameByCulture(date.format("dd"));

        return `
        <li class="nav-item">
            <button id="btn_for_${date.format("DDMMYYYY")}" day="${day}" month="${month}" year="${year}" onclick="ChangeTasksByCompletionPane(${day}, ${month}, ${year}, '${date.format("DDMMYYYY")}')" class="nav-link has-badge ${weekendClass}" data-toggle="tab" data-task="${date.format("DDMMYYYY")}" href="#tasks_for_${date.format("DDMMYYYY")}" role="tab" ${todayAttribute}>
                <span class="dayPill_dayName">${dayName}</span>
                <span class="dayPill_dayDigit">${date.format("DD")}</span>
                <span class="dayPill_monthYearDigit">${date.format("MM/YY")}</span>
            </button>
        </li>`;
    }

    // Check if there are hidden `li.nav-item`s 
    function isOverflowing(taskDaysListing, direction) {

        const visibleWidth = taskDaysListing.parentElement.clientWidth;
        const totalContentWidth = Array.from(taskDaysListing.children).reduce((acc, li) => acc + li.offsetWidth, 0);

        if (direction === 'right') {
            return totalContentWidth + currentScrollOffset > visibleWidth;
        } else if (direction === 'left') {
            return currentScrollOffset < 0;
        }
        return false;
    }

    function createDayButtonWithDirection(date, taskDays, insertAdjStr) {

        $.ajax({
            url: "/DashboardPanel/GetTasksByCompletionDateTaskCounts",
            async: false,
            data: {
                "jsonData": JSON.stringify([{
                    ddmmyyyy: (
                        formatNumber(parseInt(date.format('DD'))) + '.'
                        + formatNumber(parseInt(date.format('MM')))
                        + '.' + formatNumber(parseInt(date.format('YYYY')))
                    )
                }])
            },
            success: function (data) {

                const isWeekend = date.day() === 6 || date.day() === 0;
                const weekendClass = isWeekend ? 'isWeekend' : '';
                var day = parseInt(date.format('DD'));
                var dayName = getDayNameByCulture(date.format("dd"));
                var month = parseInt(date.format('MM'));
                var year = parseInt(date.format('YYYY'));
                var buttonVal = (day + '' + month + '' + year);

                var noTaskCss = "";
                var taskCount = 0;

                var res = data.countData.filter(function (o) {
                    return o.Date == buttonVal
                }).pop();

                if (res) {
                    taskCount = res.TaskCount;
                }

                if (taskCount == 0) {
                    noTaskCss = 'noTasksData';
                }

                taskDays.insertAdjacentHTML(insertAdjStr, `
        <li class="nav-item">
            <button id="btn_for_${date.format("DDMMYYYY")}" day="${day}" month="${month}" year="${year}" 
            onclick="ChangeTasksByCompletionPane(${day}, ${month}, ${year}, '${date.format("DDMMYYYY")}')" class="nav-link has-badge ${weekendClass} ${noTaskCss}" 
            data-toggle="tab" data-task="${date.format("DDMMYYYY")}" href="#tasks_for_${date.format("DDMMYYYY")}" role="tab" data-total-items = "${taskCount}">
                <span class="dayPill_dayName">${dayName}</span>
                <span class="dayPill_dayDigit">${date.format("DD")}</span>
                <span class="dayPill_monthYearDigit">${date.format("MM/YY")}</span>
            </button>
        </li>`);

            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false
        });
    }

    // Scroll and add day pill button based on right or left buttons
    function scrollDayPills(direction) {

        const taskDaysListing = document.querySelector('#taskDaysListing');
        const widget = document.getElementById('1001');
        if (direction === 'right') {
            // Check the right
            if (!isOverflowing(taskDaysListing, 'right')) {
                var rightButton = taskDaysListing.lastElementChild.querySelector('button');
                const lastDate = moment(rightButton.dataset.task, "DDMMYYYY").add(1, 'days');
                createDayButtonWithDirection(lastDate, taskDaysListing, 'beforeend');
            }
            // Move all items to the left by updating the translateX
            currentScrollOffset -= scrollIncrement;
            Array.from(taskDaysListing.children).forEach((li) => {
                li.style.transform = `translateX(${currentScrollOffset}px)`;
            });
        } else if (direction === 'left') {
            // Check the left for hidden day buttons
            if (!isOverflowing(taskDaysListing, 'left')) {
                var leftButton = taskDaysListing.firstElementChild.querySelector('button');
                const firstDate = moment(leftButton.dataset.task, "DDMMYYYY").subtract(1, 'days');
                createDayButtonWithDirection(firstDate, taskDaysListing, 'afterbegin');
            }

            // Adjust translateX only while scrolling to the right
            if (currentScrollOffset < 0) {
                currentScrollOffset += scrollIncrement;
                Array.from(taskDaysListing.children).forEach((li) => {
                    li.style.transform = `translateX(${currentScrollOffset}px)`;
                });
            }
        }
    }

    function tabNavBtnBadgeCounts(widget) {

        if (typeof widget === 'string') {
            widget = document.getElementById(widget);
        } else if (!(widget instanceof HTMLElement)) {
            return;
        }
        if (!widget) {
            return;
        }

        const navItems = widget.querySelectorAll('.nav-item .nav-link.has-badge');

        navItems.forEach(navLink => {

            const tabPaneSelector = navLink.getAttribute('href');
            if (!tabPaneSelector) return;

            const tabPane = widget.querySelector(tabPaneSelector);


            if (!tabPane) {
                navLink.setAttribute('data-total-items', '0');
            } else {
                const wrapper = tabPane.querySelector('.widget-row-wrapper');
                const itemCount = wrapper ? wrapper.querySelectorAll('li').length : 0;
                navLink.setAttribute('data-total-items', itemCount.toString());
            }
        });
    }

    // Handle adding-removing 'noTasksData' and 'noTaskDay' of day pill buttons
    function addNoTasksDataClass(widget) {

        if (typeof widget === 'string') {
            widget = document.getElementById(widget);
        } else if (!(widget instanceof HTMLElement)) {
            return;
        }
        if (!widget) {
            console.error(`Widget not found.`);
            return;
        }

        const navItems = widget.querySelectorAll('.nav-item .nav-link.has-badge');

        navItems.forEach(navLink => {
            const tabPaneSelector = navLink.getAttribute('href');
            if (!tabPaneSelector) return;

            const tabPane = widget.querySelector(tabPaneSelector);

            if (tabPane) {
                const hasTaskItems = tabPane.querySelector('.widget-row-wrapper li') !== null;
                const hasNoTaskAlert = tabPane.querySelector('.alert.no-task') !== null;
                const isTabPaneEmpty = !hasTaskItems && !hasNoTaskAlert;

                if (isTabPaneEmpty) {
                    navLink.classList.add('noTaskDay');
                    navLink.classList.remove('noTasksData');
                } else if (!hasTaskItems && hasNoTaskAlert) {
                    navLink.classList.add('noTaskDay');
                    navLink.classList.remove('noTasksData');
                } else if (hasTaskItems) {
                    navLink.classList.remove('noTasksData', 'noTaskDay');
                }
            } else {
                navLink.classList.add('noTasksData');
                navLink.classList.remove('noTaskDay');
            }
        });
    }

    // handleNoTaskDayTab()
    // inserts a 'no-task-day-alert' message if a 'tab-pane' with the given date ID exists 
    // but contains no '<ul class="widget-row-wrapper">' list items.
    // This indicates that tasks data are available for this day but can be completed or none are active.
    function handleNoTaskDayTab() {
        const dayPillButtons = document.querySelectorAll('button.nav-link.has-badge');

        dayPillButtons.forEach(button => {
            button.addEventListener('click', function () {

                const tabPaneId = button.getAttribute('data-task');
                const targetPaneId = `tasks_for_${tabPaneId}`;
                const widgetCardBody = button.closest('.widget-card').querySelector('.widget-card__body .tab-content');

                if (!widgetCardBody) return;

                // Remove 'active' class from all tab panes and any fallback if present
                const allTabPanes = widgetCardBody.querySelectorAll('.tab-pane');
                allTabPanes.forEach(tabPane => {
                    tabPane.classList.remove('active');
                    const noTaskDayAlert = tabPane.querySelector('.no-task-day-alert');
                    if (noTaskDayAlert) {
                        noTaskDayAlert.remove();
                    }
                });

                const targetTabPane = widgetCardBody.querySelector(`#${targetPaneId}`);
                if (targetTabPane) {
                    targetTabPane.classList.add('active');
                    targetTabPane.style.display = 'block';

                    // Insert alert only if `tab-pane` is empty and alert does not already exist
                    if (button.classList.contains('noTaskDay') &&
                        !targetTabPane.querySelector('.widget-row-wrapper') &&
                        !targetTabPane.querySelector('.no-task-day-alert')) {
                        const noTaskDayAlert = document.createElement('div');
                        noTaskDayAlert.className = 'alert no-task-day-alert kt-margin-t-10';
                        noTaskDayAlert.innerHTML = `Güne ait göreviniz bulunmamaktadır.`;
                        //targetTabPane.appendChild(noTaskDayAlert);
                    }
                }
            });
        });
    }

    // handleNoTasksDataTabFallback()
    // Inserts a 'no-tasks-data-alert' message as a fallback if no 'tab-pane' with the required date ID 
    // is found in the DOM. This is used to indicate that no data was fetched for the specified date
    function handleNoTasksDataTabFallback() {
        const dayPillButtons = document.querySelectorAll('button.nav-link.has-badge');

        dayPillButtons.forEach(button => {
            button.addEventListener('click', function () {

                const widgetCardBody = button.closest('.widget-card').querySelector('.widget-card__body .tab-content');
                const tabPaneId = button.getAttribute('data-task');
                const targetPaneId = `tasks_for_${tabPaneId}`;

                if (!widgetCardBody) return;

                const allTabPanes = widgetCardBody.querySelectorAll('.tab-pane');
                allTabPanes.forEach(tabPane => {
                    tabPane.classList.remove('active');
                    tabPane.style.display = 'none';
                });

                const targetTabPane = widgetCardBody.querySelector(`#${targetPaneId}`);
                if (!targetTabPane && button.classList.contains('noTasksData')) {

                    let fallbackTabPane = widgetCardBody.querySelector('#noTasksFallback');
                    if (!fallbackTabPane) {
                        fallbackTabPane = document.createElement('div');
                        fallbackTabPane.classList.add('tab-pane');
                        fallbackTabPane.id = 'noTasksFallback';
                        fallbackTabPane.role = 'tabpanel';
                        fallbackTabPane.innerHTML = `Günün görev bilgileri yüklenemedi.`;
                        //widgetCardBody.appendChild(fallbackTabPane);
                    }
                    fallbackTabPane.style.display = 'block';
                } else {
                    // Hide the fallback pane if an existing `tab-pane` is clicked
                    const fallbackTabPane = widgetCardBody.querySelector('#noTasksFallback');
                    if (fallbackTabPane) {
                        fallbackTabPane.classList.remove('active');
                        fallbackTabPane.style.display = 'none';
                    }
                    if (targetTabPane) {
                        targetTabPane.classList.add('active');
                        targetTabPane.style.display = 'block';
                    }
                }
            });
        });
    }

    // Border-left-color > pseudo-element bg color
    function applyBorderColorToPseudoElements() {
        document.querySelectorAll('.widget-row__wrapper').forEach(function (borderInk) {

            var borderColor = borderInk.style.borderLeftColor;
            borderInk.style.setProperty('--border-color', borderColor);
        });
    }

    // Apply the border-left-color to the span color
    function applyBorderColorToNumber() {
        document.querySelectorAll('.widget-row__wrapper').forEach(function (link) {

            var borderColor = link.style.borderLeftColor;

            var descSpan = link.querySelector('.widget-row__desc span');
            if (descSpan) {
                descSpan.style.color = borderColor;
            }
        });
    }

    // function destroyRailY() removed, use this instead
    function resetPerfectScrollbarOnTabSwitch() {
        // select our day pill buttons
        const dayPillButtons = document.querySelectorAll('button.nav-link.has-badge');

        dayPillButtons.forEach(button => {
            button.addEventListener('click', function () {

                // Find the scrollable widget card body within the widget
                const widgetCardBody = button.closest('.widget-card').querySelector('.widget-card__body.under-oval');

                if (widgetCardBody) {
                    // reset ps to top
                    widgetCardBody.scrollTop = 0;

                    // is ps updated?
                    if (widgetCardBody._ps) {
                        widgetCardBody._ps.update(); // Refresh Perfect Scrollbar instance if available
                    } else {
                        // Initialize ps if not initialized
                        widgetCardBody._ps = new PerfectScrollbar(widgetCardBody);
                        widgetCardBody._ps.update();
                    }

                    //console.log('ps reset and updated for:', widgetCardBody);
                }
            });
        });
    }

    function trimFileNamesInsertAsTitle() {
        const maxLength = 32;

        const fileNames = document.querySelectorAll('.trimToMiddle');
        //console.log(`Kırpılacak ${fileNames.length} dosya adı bulundu`);

        fileNames.forEach(fileName => {
            const text = fileName.textContent.trim();
            //console.log(`Kırpılmamış dosya adı: ${text}`);

            // Set full text as the title to '.widget-card-wrap'
            const widgetCardWrap = fileName.closest('.widget-card-wrap');
            if (widgetCardWrap) {
                widgetCardWrap.setAttribute('title', text);
                //console.log(`Title attr. set to: ${text}`);
            }

            if (text.length > maxLength) {
                const start = text.substring(0, Math.ceil(maxLength / 2) - 1);
                const end = text.substring(text.length - Math.floor(maxLength / 2) + 1);
                const trimmedText = `${start}...${end}`;

                //console.log(`Kırpılmamış hali: ${text}`);
                //console.log(`Kırpılmış hali: ${trimmedText}`);

                fileName.textContent = trimmedText;
            }
        });
    }

    function setCurrentDayText() {
        var cDate = moment();
        var cday = cDate.format('DD');
        var cmonth = cDate.format('MM');
        var cyear = cDate.format('YYYY');
        ChangeTasksByCompletionPane(cday, cmonth, cyear, `${cDate.format("DDMMYYYY")}`);
    }

    var checkboxes = document.querySelectorAll('#dashboardWidgetsDropDown input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            updateButton.disabled = false;
        });
    });

    var dropdown = document.getElementById('dashboardWidgetsDropDown');
    var widgetSelectors = document.getElementById('widgetSelectors');
    var widgetsContainer = document.querySelector('.grid-stack');
    var closeButton = document.getElementById('closeDashboardWidgetsDropDown');
    var updateButton = document.getElementById('updateDashboardWidgetsConfig');
    var saveButton = document.getElementById('saveCurrentDashboard');
    var undoButton = document.getElementById('undoDashboardChanges');
    var compactButton = document.getElementById('condenseDashboard');

    compactButton.addEventListener('click', function () {
        gridDash.compact();
    });

    // Close dropdown with close button
    closeButton.addEventListener('click', function () {
        dropdown.classList.remove('show');
        if (widgetSelectors) {
            widgetSelectors.classList.remove('show');
        }
    });

    // Performance!!! listening for clicks at the document level
    document.addEventListener('click', function (event) {
        var insideDropdown = dropdown.contains(event.target);
        var insideWidgets = widgetsContainer && widgetsContainer.contains(event.target);
        var isCloseButtonClick = event.target.closest('[id^="remove_"]');
        var isWidgetDropdownButton = event.target.closest('.widget-btn');
        var isInsideWidgetCardDropdown = event.target.closest('.widget-card-dropdown');
        var isTabLink = event.target.closest('[data-toggle="tab"]');
        var isButtonForColorPalette = event.target.closest('.btnCustomizeCard');

        // Check if the clicked element is .scroll-days-left or .scroll-days-right
        var isPrevDaysButton = event.target.closest('.scroll-days-left');
        var isFutureDaysButton = event.target.closest('.scroll-days-right');

        if (!insideDropdown && !insideWidgets && !isWidgetDropdownButton && !isInsideWidgetCardDropdown && !isTabLink && !isButtonForColorPalette && !isPrevDaysButton && !isFutureDaysButton) {
            dropdown.classList.remove('show');
            if (widgetSelectors) {
                widgetSelectors.classList.remove('show');
            }
        } else if (insideWidgets && !isCloseButtonClick && !isWidgetDropdownButton && !isInsideWidgetCardDropdown && !isTabLink && !isButtonForColorPalette && !isPrevDaysButton && !isFutureDaysButton) {
            //event.stopPropagation();
        }
    }, true);

    // Keep dropdown shown on internal clicks
    dropdown.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    // Click event listener for all 'widget-icon-name' class elements
    document.querySelectorAll('.widget-icon-name').forEach(item => {
        item.addEventListener('click', function () {
            // Find the checkbox within the parent .widget__item
            var checkbox = this.parentNode.querySelector('input[type="checkbox"]');
            if (checkbox) {
                // Toggle the checkbox state
                checkbox.checked = !checkbox.checked;

                // Toggle the 'widget-selected' class 
                if (checkbox.checked) {
                    this.parentNode.classList.add('widget-selected');
                } else {
                    this.parentNode.classList.remove('widget-selected');
                }

                checkbox.dispatchEvent(new Event('change'));
            }
        });
    });

    // load last saved dashboard config button
    var loadButton = document.getElementById('undoDashboardChanges');
    if (loadButton) {
        loadButton.addEventListener('click', function () {
            Swal.fire({
                title: `${loadLastSaveConfirm}`,
                text: `${loadLastSaveText}`,
                showCancelButton: true,
                confirmButtonColor: '#0abb87',
                cancelButtonColor: '#fd397a',
                confirmButtonText: loadBack,
                cancelButtonColor: '#fd397a',
                cancelButtonText: cancelText
            }).then((result) => {

                if (result.value) {

                    gridDash.removeAll();
                    $('.dashboard-widget-wrapper .widget-selected').remove();
                    getData(gridDash);

                    setTimeout(() => {

                        Swal.fire(
                            loadBackText,
                            loadLastSaveSuccess,
                            'success'
                        )
                    }, 1000);

                }
            });
        });
    } else {
        console.error('Button bulunamadı!');
    }

    // Simulate enabling save/update buttons and state of the checkboxes
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    var updateButton = document.getElementById('updateDashboardWidgetsConfig');
    var saveButton = document.getElementById('saveCurrentDashboard');
    var undoButton = document.getElementById('undoDashboardChanges');

    function showSaveAndUndoButtons() {
        // Show save and undo buttons when changes occur
        compactButton.style.display = 'block';
        saveButton.style.display = 'block';
        undoButton.style.display = 'block';
        saveButton.className = 'btn-dash btn btn-warning btn-icon saveCurrentDashboard';
        saveButton.querySelector('i').className = 'fa fa-save';
        saveButton.title = EFlang.Save;
        compactButton.classList.add("condenseDashboard");

        // Enable update button
        updateButton.disabled = false;

        if (saveButton) {
            saveButton.style.display = 'block';
            undoButton.style.display = 'block';
            saveButton.className = 'btn-dash btn btn-warning btn-icon saveCurrentDashboard';
            saveButton.querySelector('i').className = 'fa fa-save';
            saveButton.title = EFlang.Save;

            // Re-enable if changed
            updateButton.disabled = false;
        }
    }

    // save and undo button unified 
    function handleSave() {

        saveButton.className = 'btn-dash btn btn-warning btn-icon kt-spinner kt-spinner--center kt-spinner--sm kt-spinner--light';
        saveButton.querySelector('i').className = '';
        saveButton.title = 'Kaydedildi';
        updateButton.disabled = true;

        setTimeout(() => {

            compactButton.style.display = 'none'; // Hide compact button          
            undoButton.style.display = 'none';  // Hide undo button 
            saveButton.style.display = 'none';  // Hide save button 
            toastr.success(dashboardSaved); // Trigger toastr 
            dropdown.classList.remove('show');
            compactButton.classList.remove("condenseDashboard");

            // Close widget selector dropdown
            if (widgetSelectors) {
                widgetSelectors.classList.remove('show');
            }

            saveData();

        }, 350);
    }

    // Save button event listener
    if (saveButton) {
        saveButton.addEventListener('click', handleSave);
    } else {
        console.error('Kaydet butonu bulunamadı!');
    }

    // Update button performing same operation
    if (updateButton) {
        updateButton.addEventListener('click', function () {
            handleSave();
            // Additional code if needed
        });
    } else {
        console.error('Update butonu bulunamadı!');
    }

    getData(gridDash);

    gridDash.on('added removed', function (e, items) {
        checkGridAndToggleAlert();
    });

    // Maintain readablity of widget titles with dropdown
    function handleWidgetTitleWidth(widgetElement, widgetBaseId) {
        var widgetsRequiringTitleWidth = ['1000', '1008', '1009', '1010'];

        if (!widgetsRequiringTitleWidth.includes(widgetBaseId)) return;
        if (!widgetElement) return;

        var widgetHead = widgetElement.querySelector('.widget-card__head');
        if (!widgetHead) return;

        var widgetHeadWidth = widgetHead.offsetWidth;

        if (widgetHeadWidth < 388) {
            widgetHead.classList.add('narrow-widget-title');
            var removeButton = widgetElement.querySelector('[id^="remove_"]');
            var widgetHeadLabel = widgetElement.querySelector('.widget-card__head-label');
            if (removeButton && widgetHeadLabel && !widgetHeadLabel.contains(removeButton)) {
                widgetHeadLabel.appendChild(removeButton);
            }
        } else {
            widgetHead.classList.remove('narrow-widget-title');
            var widgetHeadToolbar = widgetElement.querySelector('.widget-card__head-toolbar');
            var removeButton = widgetElement.querySelector('[id^="remove_"]');
            if (removeButton && widgetHeadToolbar && !widgetHeadToolbar.contains(removeButton)) {
                widgetHeadToolbar.appendChild(removeButton);
            }
        }
    }

    gridDash.on('resize', function (event, el) {
        var widgetBaseId = el.getAttribute('id');
        handleWidgetTitleWidth(el, widgetBaseId.toString());
    });

    gridDash.on('added', function (event, items) {
        items.forEach(item => {
            var widgetBaseId = item.el.getAttribute('id');
            setTimeout(() => {
                handleWidgetTitleWidth(item.el, widgetBaseId.toString());
            }, 1065);
        });
    });

    // Initial check on page load
    checkGridAndToggleAlert();

    gridDash.on('added removed change dragstart resize', function (e, items) {
        showSaveAndUndoButtons();
    });

    // Store each widget size first
    var widgetSizes = new Map();

    gridDash.on('change', function (event, items) {
        items.forEach((item) => {

            setTimeout(() => {

                const el = item.el;
                if (!el) return;

                const widgetBaseId = el.getAttribute('id');
                const contentDiv = el.querySelector('.isTasksUrgentDeadlines');

                // is it tasksUrgentDeadlines widget
                if (widgetBaseId === '1001' && contentDiv) {

                    const width = el.offsetWidth;
                    const height = el.offsetHeight;
                    const prevSize = widgetSizes.get(widgetBaseId);

                    // run these functions on actual resize
                    if (!prevSize || prevSize.width !== width || prevSize.height !== height) {
                        // Update stored size and reset/initialize components
                        widgetSizes.set(widgetBaseId, { width, height });
                        resetScrollOffset(taskDaysListing);
                        resetPerfectScrollbarOnTabSwitch();
                        setCurrentDayText();
                        initializeDayPills(contentDiv);
                    }
                }

                if (widgetBaseId === '1010') {
                    apexChartFillContainer();// force ApexCharts to fit
                }

            }, 300);
        });
    });

    // hide chart when resizing starts
    gridDash.on('resizestart', function (event, el) {

        var widgetBaseId = el.getAttribute('id');

        if (widgetBaseId === '1010') {
            var chartElement = document.querySelector(`#chart_taskCompletionTime`);
            if (chartElement) {
                chartElement.classList.add('d-none');
            }
        }
    });

    // show chart again on resize stop & update height
    gridDash.on('resizestop', function (event, el) {

        var widgetBaseId = el.getAttribute('id');

        if (widgetBaseId === '1010') {
            var chartElement = document.querySelector(`#chart_taskCompletionTime`);
            if (chartElement) {
                setTimeout(() => {
                    chartElement.classList.remove('d-none');
                }, 200);
            }
            apexChartFillContainer();
        }
    }); 

    document.querySelectorAll('#dashboardWidgetsDropDown input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {

            var widgetId = this.id.replace('modallabel_', '');

            if (this.checked) {

                // Get size based on widget ID
                let size = getWidgetSize(widgetId);

                addWidget(gridDash, widgetId, size.width.toString(), size.height.toString());

            } else {
                var widget = document.getElementById(widgetId);

                if (widget) {
                    gridDash.removeWidget(widget);
                }
            }
        });
    });

});

// Mapping of checkbox IDs to HTML file URLs
var widgetFiles = {
    "modallabel_998": "GetLastUsedCourses",
    "modallabel_999": "GetLastUsedLists",
    "modallabel_1000": "GetPendingTasksByApproval",
    "modallabel_1001": "GetTasksByCompletionDate",
    "modallabel_1002": "GetFrequentlyUsedCourses",
    "modallabel_1003": "GetFrequentlyUsedLists",
    "modallabel_1004": "GetLastUsedDocuments",
    "modallabel_1005": "GetFavoriteDocs",
    "modallabel_1006": "GetFavoriteLists",
    "modallabel_1007": "GetFavoriteReports",
    "modallabel_1011": "GetFavoritePanelReports",
    "modallabel_1008": "GetCoursesByStartCounts",
    "modallabel_1009": "GetActivities",
    "modallabel_1010": "GetTaskCompletionDates"
};

function startVirtualTour() {

    // 1 kerelik otomatik başlatılır.
    localStorage.setItem("virtualTourfeatureSeen", "true");

    const driver = window.driver.js.driver;

    var baseSteps = [
        {
            element: '#dashboard-title', popover: {
                side: 'bottom', title: `<h1 class="driver-title">${EFlang.dashboardTitle}</h1>`, description: `${EFlang.dashboardTitleDetail}`, popoverClass: 'longPopover'
            }
        },
        {
            element: '#condenseDashboard', popover: {
                title: `<h1 class="driver-title">${EFlang.condenseDashboard}</h1>`, description: `${EFlang.condenseDashboardDetail}`
            }
        },
        {
            element: `#undoDashboardChanges`, popover: {
                title: `<h1 class="driver-title">${EFlang.undoDashboardChanges}</h1>`, description: `${EFlang.undoDashboardChangesDetail}`
            }
        },
        {
            element: `#saveCurrentDashboard`, popover: {
                title: `<h1 class="driver-title"> ${EFlang.saveCurrentDashboard} </h1>`, description: `${EFlang.saveCurrentDashboardDetail}`
            }
        },
        {
            element: `#addRemovePanel .btn-dash`, popover: {
                title: `<h1 class="driver-title"> ${EFlang.addRemovePanel} </h1>`, description: `${EFlang.addRemovePanelDetail}`
            }
        }
    ];

    var allWidgets = [
        {
            element: `.grid-stack-item-content_998`, popover: {
                title: `<h1 class="driver-title">${EFlang.gridStack_998} </h1>`, description: `${EFlang.gridStack_998Detail}`
            }
        },
        {
            element: `.grid-stack-item-content_999`, popover: {
                title: `<h1 class="driver-title"> ${EFlang.gridStack_999} </h1>`, description: `${EFlang.gridStack_999Detail}`
            }
        },
        {
            element: `.grid-stack-item-content_1000`, popover: {
                title: `<h1 class="driver-title"> ${EFlang.gridStack_1000}  </h1>`, description: `${EFlang.gridStack_1000Detail}`
            }
        },
        {
            element: `.grid-stack-item-content_1001`, popover: {
                title: `<h1 class="driver-title"> ${EFlang.gridStack_1001} </h1>`, description: `${EFlang.gridStack_1001Detail}`
            }
        },
        {
            element: `.grid-stack-item-content_1002`, popover: {
                title: `<h1 class="driver-title"> ${EFlang.gridStack_1002} </h1>`, description: `${EFlang.gridStack_1002Detail}`
            }
        },
        {
            element: `.grid-stack-item-content_1003`, popover: {
                title: `<h1 class="driver-title"> ${EFlang.gridStack_1003} </h1>`, description: `${EFlang.gridStack_1003Detail}`
            }
        },
        {
            element: `.grid-stack-item-content_1004`, popover: {
                title: `<h1 class="driver-title"> ${EFlang.gridStack_1004} </h1>`, description: `${EFlang.gridStack_1004Detail}`
            }
        },
        {
            element: `.grid-stack-item-content_1005`, popover: {
                title: `<h1 class="driver-title"> ${EFlang.gridStack_1005}  </h1>`, description: `${EFlang.gridStack_1005Detail}`
            }
        },
        {
            element: `.grid-stack-item-content_1006`, popover: {
                title: `<h1 class="driver-title"> ${EFlang.gridStack_1006} </h1>`, description: `${EFlang.gridStack_1006Detail}`
            }
        },
        {
            element: `.grid-stack-item-content_1007`, popover: {
                title: `<h1 class="driver-title"> ${EFlang.gridStack_1007} </h1>`, description: `${EFlang.gridStack_1007Detail}`
            }
        },
        {
            element: `.grid-stack-item-content_1008`, popover: {
                title: `<h1 class="driver-title"> ${EFlang.gridStack_1008} </h1>`, description: `${EFlang.gridStack_1008Detail}`
            }
        },
        {
            element: `.grid-stack-item-content_1009`, popover: {
                title: `<h1 class="driver-title"> ${EFlang.gridStack_1009} </h1>`, description: `${EFlang.gridStack_1009Detail}`
            }
        },
        {
            element: `.grid-stack-item-content_1010`, popover: {
                title: `<h1 class="driver-title"> ${EFlang.gridStack_1010} </h1>`, description: `${EFlang.gridStack_1010Detail}`
            }
        },
        {
            element: `.grid-stack-item-content_1011`, popover: {
                title: `<h1 class="driver-title"> ${EFlang.gridStack_1011} </h1>`, description: `${EFlang.gridStack_1011Detail}`
            }
        }
    ];

    var currentSteps = [];

    $('.grid-stack .grid-stack-item').each(function () {

        var $this = $(this);

        var widgetId = $this.attr('gs-id');

        let item = allWidgets.find(item => item.element == `.grid-stack-item-content_${widgetId}`);

        currentSteps.push(item);

    });

    if ($("#undoDashboardChanges").hasClass("saveCurrentDashboard") == false) {

        let indexUndo = baseSteps.findIndex(item => item.element === "#saveCurrentDashboard");
        if (indexUndo != -1) {
            baseSteps.splice(indexUndo, 1);
        }
    }

    if ($("#condenseDashboard").hasClass("condenseDashboard") == false) {

        let indexCondense = baseSteps.findIndex(item => item.element === "#condenseDashboard");
        if (indexCondense != -1) {
            baseSteps.splice(indexCondense, 1);
        }
    }

    var stepsArry = $.merge($.merge([], baseSteps), currentSteps);

    const driverObj = driver({
        showProgress: true,
        progressText: '{{current}}/{{total}}',
        nextBtnText: EFlang.Next,
        prevBtnText: EFlang.Prev,
        doneBtnText: EFlang.Done,
        overlayColor: '#b3bdc7',
        steps: stepsArry
    });

    driverObj.drive();
}


