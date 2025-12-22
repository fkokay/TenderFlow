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
                    document.getElementById('widgetSearch').focus();
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
        var alertBox = document.querySelector('.empty-widget');
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
        var alertBox = document.querySelector('.empty-widget');
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

});


document.addEventListener('DOMContentLoaded', function () {

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

    // Needs fix:  CCP positioning issues
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
                widgetShape.className = `widget-card__shape ${gradientClass} customizing`;
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
        grid.compact();
    });


    // Close dropdown with close button
    closeButton.addEventListener('click', function () {
        dropdown.classList.remove('show');
        if (widgetSelectors) {
            widgetSelectors.classList.remove('show');
        }
    });

    function showSaveAndUndoButtons() {
        // Show save and undo buttons when changes occur
        compactButton.style.display = 'block';
        saveButton.style.display = 'block';
        undoButton.style.display = 'block';
        saveButton.className = 'btn btn-warning btn-icon';
        saveButton.querySelector('i').className = 'fa fa-save';
        saveButton.title = 'Kaydet';

        // Enable update button
        updateButton.disabled = false;

        if (saveButton) {
            saveButton.style.display = 'block';
            undoButton.style.display = 'block';
            saveButton.className = 'btn btn-warning btn-icon';
            saveButton.querySelector('i').className = 'fa fa-save';
            saveButton.title = 'Kaydet';

            // Re-enable if changed
            updateButton.disabled = false;
        }
    }


    // save and undo button unified 
    function handleSave() {
        saveButton.className = 'btn btn-warning btn-icon kt-spinner kt-spinner--center kt-spinner--sm kt-spinner--light';
        saveButton.querySelector('i').className = '';
        saveButton.title = 'Kaydedildi';
        updateButton.disabled = true;

        setTimeout(() => {
            compactButton.style.display = 'none'; // Hide compact button: fix handleVisibilityofCompactBtn();
            saveButton.style.display = 'none';  // Hide save button 
            undoButton.style.display = 'none';  // Hide undo button 
            toastr.success("Dashboard kaydedildi."); // Trigger toastr 
            dropdown.classList.remove('show');

            // Close widget selector dropdown
            if (widgetSelectors) {
                widgetSelectors.classList.remove('show');
            }
        }, 1500);
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

    // Performance!!! listening for clicks at the document level
    // Buradaki 'exception'ların sonu gelmez :)
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
            event.stopPropagation();
        }

    }, true);

    // Keep dropdown shown on internal clicks
    dropdown.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    // Click event listener for all 'widget-icon-name' class elements
    document.querySelectorAll('.widget-icon-name').forEach(item => {
        item.addEventListener('click', function () {

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
                title: 'Geri yüklemekten emin misin?',
                text: "Dashboard'un kaydedilmiş son hali geri yüklenecek. Kaydedilmeyen değişiklikleri kaybedeceksiniz.",
                showCancelButton: true,
                confirmButtonColor: '#0abb87',
                cancelButtonColor: '#fd397a',
                confirmButtonText: 'Geri Yükle',
                cancelButtonColor: '#fd397a',
                cancelButtonText: 'İptal'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Geri yüklendi',
                        'Dashboard en son kaydedilmiş haliyle geri yüklendi',
                        'success'
                    )
                    // Your actual 're-load last saved dashboard wigdet config' codes
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

    // Gridstack options
    var options = {
        float: false,
        cellHeight: 65,
        cellWidth: 100,
        verticalMargin: 0,
        horizontalMargin: 0,
        acceptWidgets: false,
        disableOneColumnMode: false,
        responsive: true
    };

    var grid = GridStack.init(options);

    // Function to check if gridstack is empty
    function checkGridAndToggleAlert() {
        var gridStackElement = document.querySelector('.grid-stack');
        var gridStackWidgets = gridStackElement.children.length;
        var alertBox = document.querySelector('.alert.empty-dashboard');

        if (!alertBox && gridStackWidgets === 0) {
            compactButton.style.display = 'none';
            // If no widgets and no alert box > insert the alert
            var alertHTML = `
            <div class="alert empty-dashboard fade show" role="alert">
                <div class="alert-icon">
                    <i class="flaticon-warning"></i>
                </div>
                <div class="alert-text">Henüz widget eklemedniz. Eklemek için artıya tıklayın</div>
            </div>`;

            gridStackElement.insertAdjacentHTML('beforebegin', alertHTML);

        } else if (alertBox && gridStackWidgets > 0) {
            alertBox.parentNode.removeChild(alertBox);
        }
    }

    // Event listener to handle changes
    grid.on('added removed change dragstart resize', function (e, items) {

        showSaveAndUndoButtons();

        let str = '';

        if (Array.isArray(items)) {
            items.forEach(function (item) {
                str += ' (x,y)=' + item.x + ',' + item.y;
            });
        } else if (items && items.node) {
            str += ' (x,y)=' + items.node.x + ',' + items.node.y;
        }
        console.log(e.type + ' ' + (Array.isArray(items) ? items.length : '1') + ' items:' + str);

    });

    grid.on('added removed', function (e, items) {
        checkGridAndToggleAlert();
    });


    // Store each widget size first
    const widgetSizes = new Map();

    grid.on('change', function (event, items) {
        items.forEach((item) => {
            const el = item.el;
            const widgetBaseId = el.getAttribute('id');
            const contentDiv = el.querySelector('.isTasksUrgentDeadlines');

            // is it tasksUrgentDeadlines widget
            if (widgetBaseId === 'widget_tasksUrgentDeadlines' && contentDiv) {
                const width = el.offsetWidth;
                const height = el.offsetHeight;
                const prevSize = widgetSizes.get(widgetBaseId);

                // run these functions on actual resize
                if (!prevSize || prevSize.width !== width || prevSize.height !== height) {
                    // Update stored size and reset/initialize components
                    widgetSizes.set(widgetBaseId, { width, height });
                    initializeDayPills(contentDiv);
                    resetScrollOffset(taskDaysListing);
                    tabNavBtnBadgeCounts(el);

                    resetPerfectScrollbarOnTabSwitch();

                    addNoTasksDataClass(el);
                    handleNoTasksDataTabFallback();
                    handleNoTaskDayTab();
                }
            }
        });
    });


    // Maintain readablity of widget titles with dropdown
    function handleWidgetTitleWidth(widgetElement, widgetBaseId) {
        const widgetsRequiringTitleWidth = ['widget_tasksAwaitingApproval', 'widget_batchProcesses', 'widget_wActivities', 'widget_taskPerformance'];

        if (!widgetsRequiringTitleWidth.includes(widgetBaseId)) return;
        if (!widgetElement) return;

        const widgetHead = widgetElement.querySelector('.widget-card__head');
        if (!widgetHead) return;

        const widgetHeadWidth = widgetHead.offsetWidth;

        if (widgetHeadWidth < 388) {
            widgetHead.classList.add('narrow-widget-title');
            const removeButton = widgetElement.querySelector('[id^="remove_"]');
            const widgetHeadLabel = widgetElement.querySelector('.widget-card__head-label');
            if (removeButton && widgetHeadLabel && !widgetHeadLabel.contains(removeButton)) {
                widgetHeadLabel.appendChild(removeButton);
            }
        } else {
            widgetHead.classList.remove('narrow-widget-title');
            const widgetHeadToolbar = widgetElement.querySelector('.widget-card__head-toolbar');
            const removeButton = widgetElement.querySelector('[id^="remove_"]');
            if (removeButton && widgetHeadToolbar && !widgetHeadToolbar.contains(removeButton)) {
                widgetHeadToolbar.appendChild(removeButton);
            }
        }
    }
    grid.on('resize', function (event, el) {
        const widgetBaseId = el.getAttribute('id');
        handleWidgetTitleWidth(el, widgetBaseId);
    });

    grid.on('added', function (event, items) {
        items.forEach(item => {
            const widgetBaseId = item.el.getAttribute('id');
            setTimeout(() => {
                handleWidgetTitleWidth(item.el, widgetBaseId);
            }, 1065); // run after 1065ms delay
        });
    });

    // Initial check on page load
    checkGridAndToggleAlert();

    // Mapping of checkbox IDs to HTML file URLs
    const widgetFiles = {
        "checkbox_tasksAwaitingApproval": "tasksAwaitingApproval.html",
        "checkbox_tasksUrgentDeadlines": "tasksUrgentDeadlines.html",
        "checkbox_batchProcesses": "batchProcesses.html",
        "checkbox_frequentProcesses": "frequentProcesses.html",
        "checkbox_frequentLists": "frequentLists.html",
        "checkbox_recentProcesses": "recentProcesses.html",
        "checkbox_recentLists": "recentLists.html",
        "checkbox_recentDocuments": "recentDocuments.html",
        "checkbox_favoriteDocuments": "favoriteDocuments.html",
        "checkbox_favoriteLists": "favoriteLists.html",
        "checkbox_favoriteReports": "favoriteReports.html",
        "checkbox_favoritePanes": "favoritePanes.html",
        "checkbox_wActivities": "wActivities.html",
        "checkbox_taskPerformance": "taskPerformance.html"
        // ----
    };

    document.querySelectorAll('#dashboardWidgetsDropDown input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {

            var widgetBaseId = this.id.replace('checkbox_', '');
            var widgetId = `widget_${widgetBaseId}`;

            if (this.checked) {

                // Create a new div that's gonna be a widget
                var widget = document.createElement('div');
                widget.classList.add('grid-stack-item');
                widget.id = widgetId;

                // Get size based on widget ID
                let size = getWidgetSize(widgetId);

                // Set widget attributes
                widget.setAttribute('gs-y', '0');
                widget.setAttribute('gs-w', size.width.toString());
                widget.setAttribute('gs-h', size.height.toString());

                // Set minimum size
                widget.setAttribute('gs-min-w', '2');
                widget.setAttribute('gs-min-h', '3');

                // Create a div for content that initially shows a loading spinner
                var contentDiv = document.createElement('div');
                contentDiv.classList.add('grid-stack-item-content');
                contentDiv.innerHTML = '<div class="loading-gridstack-widget-content"><div class="kt-spinner kt-spinner--sm kt-spinner--brand"></div></div>';

                // Append the content div to the widget
                widget.appendChild(contentDiv);

                // Add the widget to the grid
                grid.addWidget(widget);

                // Simulate widget content loading with delay
                setTimeout(() => {
                    fetch(widgetFiles[this.id])
                        .then(response => response.text())
                        .then(html => {

                            // Replace the 'loading' with the actual content
                            contentDiv.innerHTML = html;

                            KTApp.init(); // Re-initialize KT App
                            applyBorderColorToPseudoElements(); //assign border-left-color to its pseudo element
                            applyBorderColorToNumber(); // assign border-left-color to its span.__number as color
                            // reset kt-scroll Y position for tabbed contents ??
                            buttonForColorPalette(); // Calls functions of custom color palette
                            trimFileNamesInsertAsTitle();

                            setTimeout(() => {
                                handleWidgetTitleWidth(widget, widgetBaseId);
                            }, 1065); // Delay for rendering and replacing the remove_ button


                            if (widgetBaseId === 'tasksUrgentDeadlines') {

                                initializeDayPills(contentDiv);
                                resetScrollOffset(taskDaysListing);
                                tabNavBtnBadgeCounts(widget);

                                addNoTasksDataClass(widget);
                                handleNoTasksDataTabFallback();
                                handleNoTaskDayTab();

                                contentDiv.querySelector('#scrollDaysRight').addEventListener('click', () => scrollDayPills('right'));
                                contentDiv.querySelector('#scrollDaysLeft').addEventListener('click', () => scrollDayPills('left'));
                                resetPerfectScrollbarOnTabSwitch();
                            }

                            if (widgetBaseId === 'taskPerformance') {
                                initializeTaskPerformanceChart(widgetBaseId);
                            }

                            // Set up the removal button 
                            var removeButton = contentDiv.querySelector(`#remove_${widgetBaseId}`);

                            if (removeButton) {
                                removeButton.addEventListener('click', function (event) {

                                    event.stopPropagation(); // eventin roota kadar kaynatma

                                    if (chartInstances[widgetBaseId]) {
                                        chartInstances[widgetBaseId].destroy();  // destroy chart
                                        delete chartInstances[widgetBaseId];  // Remove reference
                                    }

                                    // Handle removing the widget from Gridstack
                                    var widget = document.getElementById(widgetId);
                                    if (widget) {
                                        grid.removeWidget(widget);

                                        var checkbox = document.getElementById(`checkbox_${widgetBaseId}`);
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

                                                // ** Add your ApexChart function call here

                                            } else {
                                                console.error('.widget-card-dropdown buton bulunamadı');
                                            }
                                        } else {
                                            console.error('Closest.widget-card-dropdown bulunamadı');
                                        }
                                    });
                                });
                            } 
                        })

                        .catch(error => {
                            console.error('Widget yüklenirken hata oluştu:', error);
                            contentDiv.innerHTML = '<p>İçerik yüklenirken hata oluştu</p>';
                        });

                }, 1000);

                var chartInstances = {};

                function initializeTaskPerformanceChart(widgetBaseId) {
                    var chartElement = document.querySelector(`#chart_${widgetBaseId}`);
                    if (chartElement) {
                        var options = {
                            chart: {
                                width: '100%',
                                height: '370',
                                type: 'line',
                                toolbar: {
                                    show: false
                                }
                                /* sparkline: {
                                    enabled: true
                                }, */
                            },
                            series: [
                                {
                                    name: 'Eylül',
                                    type: 'area',
                                    data: [100, 118, 118, 104, 104, 106, 106, 100, 100, 122, 122, 105, 105, 118, 118, 98, 98, 84, 84]
                                },
                                {
                                    name: 'Kubilay',
                                    type: 'area',
                                    data: [90, 108, 108, 94, 94, 86, 86, 93, 93, 112, 112, 98, 98, 110, 110, 90, 90, 72, 72]
                                }
                            ],

                            stroke: {
                                curve: 'smooth',
                                show: true,
                                width: 3,

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
                            labels: ['09:00', '09:00', '10:00', '10:00', '11:00', '11:00', '12:00', '12:00', '13:00', '13:00', '14:00', '14:00', '15:00', '15:00', '16:00', '16:00', '17:00', '17:00', '18:00', '18:00'],
                            markers: {
                                size: 0
                            },
                            tooltip: {
                                shared: true,
                                intersect: false,
                                y: {
                                    formatter: function (y) {
                                        if (typeof y !== "undefined") {
                                            return y.toFixed(0) + " görev";
                                        }
                                        return y;
                                    }
                                }
                            }
                        };
                        var chart = new ApexCharts(chartElement, options);
                        chart.render();

                        // Store the chart instance 
                        chartInstances[widgetBaseId] = chart;
                    } else {
                        console.error(widgetBaseId, 'grafiği bulunamadı.');
                    }
                }
            } else {
                var widget = document.getElementById(widgetId);
                if (widget) {
                    grid.removeWidget(widget);
                }
            }
        });
    });
});

function getWidgetSize(widgetId) {
    let sizes = {
        'widget_tasksAwaitingApproval': { width: 3, height: 8 },
        'widget_tasksUrgentDeadlines': { width: 3, height: 8 },
        'widget_batchProcesses': { width: 4, height: 4 },
        'widget_frequentProcesses': { width: 4, height: 8 },
        "widget_frequentLists": { width: 4, height: 8 },
        "widget_recentProcesses": { width: 4, height: 7 },
        "widget_recentLists": { width: 4, height: 8 },
        "widget_recentDocuments": { width: 3, height: 8 },
        "widget_favoriteDocuments": { width: 3, height: 6 },
        "widget_favoriteLists": { width: 4, height: 7 },
        "widget_favoriteReports": { width: 4, height: 7 },
        "widget_wActivities": { width: 2, height: 10 },
        "widget_taskPerformance": { width: 3, height: 8 }
    };
    return sizes[widgetId] || { width: 3, height: 8 }; // ??? Default size
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

// Initialize the day pills when #widget_tasksUrgentDeadlines is loaded
function initializeDayPills(contentDiv) {
    const widget = document.getElementById('widget_tasksUrgentDeadlines');
    const taskDaysListing = contentDiv.querySelector('#taskDaysListing');
    const activeDateTabPane = contentDiv.querySelector('#activeDateTabPane');
    const language = document.documentElement.lang;

    moment.locale(language === 'tr' ? 'tr' : 'en'); // Set locale

    const currentDate = moment();

    // format date for div#activeDateTabPane
    const formattedDate = currentDate.format("D MMMM YYYY"); // Full date
    const displayDate = currentDate.format("DD.MM.YYYY");    // Shortened date

    // Set the title attribute of div#activeDateTabPane
    activeDateTabPane.title = language === 'tr'
        ? `${formattedDate} tarihli görevleriniz görüntüleniyor`
        : `Showing tasks for ${formattedDate}`;

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
            activeDateTabPane.title = language === 'tr'
                ? `${formattedSelectedDate} tarihli görevleriniz`
                : `Tasks for ${formattedSelectedDate}`;

            activeDateTabPane.textContent = displaySelectedDate;

            activeDateTabPane.classList.add('transitioning');

            setTimeout(() => {
                activeDateTabPane.classList.remove('transitioning');
            }, 1000);
        }
    });
    // Simulate calculation of loaded tasks then replace with actual tasks count
    // If returned '0' or null bagde is hidden
    setTimeout(() => {
        tabNavBtnBadgeCounts(widget);
        const buttons = taskDaysListing.querySelectorAll('.nav-link.has-badge');
        buttons.forEach(button => button.classList.remove('calculating'));
    }, 400);
}

// Function to create each day button
function createDayButton(date, isToday = false) {
    const todayAttribute = isToday ? 'data-current="today"' : '';

    const isWeekend = date.day() === 6 || date.day() === 0;
    const weekendClass = isWeekend ? 'isWeekend' : '';

    return `
        <li class="nav-item">
            <button class="nav-link has-badge calculating ${weekendClass}" data-toggle="tab" data-task="${date.format("DDMMYYYY")}" href="#tasks_for_${date.format("DDMMYYYY")}" role="tab" ${todayAttribute}>
                <span class="dayPill_dayName">${date.format("dd")}</span>
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

// Scroll and add day pill button based on right or left buttons
function scrollDayPills(direction) {
    const taskDaysListing = document.querySelector('#taskDaysListing');
    const widget = document.getElementById('widget_tasksUrgentDeadlines');
    if (direction === 'right') {
        // Check the right
        if (!isOverflowing(taskDaysListing, 'right')) {
            const lastDate = moment(taskDaysListing.lastElementChild.querySelector('button').dataset.task, "DDMMYYYY").add(1, 'days');
            taskDaysListing.insertAdjacentHTML('beforeend', createDayButton(lastDate));
        }
        // Move all items to the left by updating the translateX
        currentScrollOffset -= scrollIncrement;
        Array.from(taskDaysListing.children).forEach((li) => {
            li.style.transform = `translateX(${currentScrollOffset}px)`;
        });
    } else if (direction === 'left') {
        // Check the left for hidden day buttons
        if (!isOverflowing(taskDaysListing, 'left')) {
            const firstDate = moment(taskDaysListing.firstElementChild.querySelector('button').dataset.task, "DDMMYYYY").subtract(1, 'days');
            taskDaysListing.insertAdjacentHTML('afterbegin', createDayButton(firstDate));
        }

        // Adjust translateX only while scrolling to the right
        if (currentScrollOffset < 0) {
            currentScrollOffset += scrollIncrement;
            Array.from(taskDaysListing.children).forEach((li) => {
                li.style.transform = `translateX(${currentScrollOffset}px)`;
            });
        }
    }
    // Simulate calculating added days tasks with scroll
    setTimeout(() => {
        tabNavBtnBadgeCounts(widget);
        addNoTasksDataClass(widget);
        const buttons = taskDaysListing.querySelectorAll('.nav-link.has-badge');
        buttons.forEach(button => button.classList.remove('calculating'));
    }, 400);

    handleNoTasksDataTabFallback();
}

function tabNavBtnBadgeCounts(widget) {
    if (typeof widget === 'string') {
        widget = document.getElementById(widget);
    } else if (!(widget instanceof HTMLElement)) {
        //console.error('Hatalı widget tanımlandı.');
        return;
    }
    if (!widget) {
        //console.error(`${widget} ID'li widget bulunamadı.`);
        return;
    }

    const navItems = widget.querySelectorAll('.nav-item .nav-link.has-badge');

    navItems.forEach(navLink => {
        const tabPaneSelector = navLink.getAttribute('href');
        if (!tabPaneSelector) return;

        const tabPane = widget.querySelector(tabPaneSelector);

        // If tabPane doesn't exist or has no items, set count to "0"
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
        console.error('Invalid widget specified!');
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
                    noTaskDayAlert.innerHTML = `
                        <div class="alert-icon">
                            <i class="flaticon-like"></i>
                        </div>
                        <div class="alert-text">Bu güne ait göreviniz bulunmamakta.</div>
                    `;
                    targetTabPane.appendChild(noTaskDayAlert);
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
                    fallbackTabPane.innerHTML = `
                        <div class="alert no-tasks-data-alert kt-margin-t-10">
                            <div class="alert-icon">
                                <i class="flaticon-warning"></i>
                            </div>
                            <div class="alert-text">Günün görev bilgileri yüklenemedi.</div>
                        </div>
                    `;
                    widgetCardBody.appendChild(fallbackTabPane);
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