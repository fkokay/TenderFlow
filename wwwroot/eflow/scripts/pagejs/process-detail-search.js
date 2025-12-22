var NetolojiFilter = (function (document, window, $) {

    //Module Init Properties
    var LocalStorageDataResultKey;
    var StoreInLocalStorage;
    var LocalStorageKey;
    var GetCourseNamesURL;
    var DataTableListID;
    var ProcessTypeId; //Where module will show, 1=CreatedByMe, 2=IncludedByMe, 3=ComplatedByMe, 4=Tasks, 5=List

    //Global Properties
    var FilterResultIdList = "";
    var CourseNames = [];
    var DataElements = [];
    var GridDataElements = [];
    var AssignNames = [];
    var SelectedCourseId;
    var SelectedCourseName;
    var SelectedElementId;
    var SelectedElementType;
    var SelectedGridColumnSubType;
    var SelectedElementName;
    var SelectedElementOrder;
    var SelectedFilterParams = [];
    var ResultFilterKeyword = "";
    var ReOpenButtonClicked;

    //Constructor
    function Init(initVariables) {
        SetInitVariables(initVariables);
        SetResultKeywordText();
        Events();
        GetCourseNames();
        GetAssignNames();
        InitAllSelect2();
        InitAssignSelect2();
        SetSelect2AlwaysOpen();
        InitFilterDefault();

        if (HasFilterDataAtLocalStorage && StoreInLocalStorage) {

            InitLastSelectedFilterFromStorage();

            if (SelectedFilterParams.length > 0) {
                SelectedCourseName = SelectedFilterParams[0].SelectedCourseName;
                SelectedCourseId = SelectedFilterParams[0].SelectedCourseId;
            }
        }

        ClearSelectedCourseStorageName();
        ClearSelectedAssignListStorageId();

        return this;
    }

    function GetSelectedCourseStorageName() {
        return "SelectedCourseNameVal_strg_" + ProcessTypeId;
    }

    function GetSelectedAssignListStorageName() {
        return "AssignedToVal_strg_" + ProcessTypeId;
    }

    function ClearSelectedCourseStorageName() {
        localStorage.setItem(GetSelectedCourseStorageName(), "");
    }

    function ClearSelectedAssignListStorageId() {
        localStorage.setItem(GetSelectedAssignListStorageName(), "");
    }

    function GetCurrentCourseStorageName() {
        return "CourseNameVal_current_" + ProcessTypeId;
    }

    function GetCurrentAssignListStorageName() {
        return "AssignedVal_current_" + ProcessTypeId;
    }

    function SetResultKeywordText() {

        if (ProcessTypeId == 4)
            ResultFilterKeyword = "tiids_";
        else
            ResultFilterKeyword = "ciids_";
    }

    function SetInitVariables(initVariables) {

        LocalStorageDataResultKey = initVariables.LocalStorageDataResultKey;
        StoreInLocalStorage = initVariables.StoreInLocalStorage;
        LocalStorageKey = initVariables.LocalStorageKey;
        GetCourseNamesURL = initVariables.GetCourseNamesURL;
        DataTableListID = initVariables.DataTableListID;
        ProcessTypeId = initVariables.ProcessTypeId;
    }

    function InitLastSelectedFilterFromStorage() {

        var retrievedObject = localStorage.getItem(LocalStorageKey);
        var stored = JSON.parse(retrievedObject);
        if (stored.length > 0) {

            BindCourseNames();

            SelectedCourseName = stored[0].SelectedCourseName;
            SelectedCourseId = stored[0].SelectedCourseId;

            $('#btnSpesificProcesses').show();
            $("#btnSpesificProcesses").html(EFlang.FilterProcessName + SelectedCourseName);
            $('#btnAllProcesses').hide();
            GetCriteriaData(SelectedCourseId, false);
            $('#SelectedCourseId').val(SelectedCourseId).trigger('change');

            SelectedFilterParams = stored;
            PushAllHtmlButtons(stored);
        }
    }

    function InitSelectedListCourseByUrl() {

        //if there is no SelectedFilterParams
        SetSelectedCourseNameAndIdForListInit();
        GetCriteriaData(SelectedCourseId, false);
        $('#SelectedCourseId').val(SelectedCourseId).trigger('change');
    }

    function SetSelectedCourseNameAndIdForListInit() {

        if (SelectedFilterParams.length == 0) {
            SelectedCourseId = parseInt(document.location.pathname.toLowerCase().replace('/lists/list/', ''));
            //SelectedCourseName = CourseNames.find(x => x.id === SelectedCourseId).text;
            var SelectedCourse = $.grep(CourseNames, function (e) { return e.id == SelectedCourseId; });
            SelectedCourseName = SelectedCourse[0].text;
        }
    }

    function InitLastFilterResultToStorage(result) {

        if (StoreInLocalStorage == true) {

            localStorage.removeItem(LocalStorageDataResultKey)
            localStorage.setItem(LocalStorageDataResultKey, result);
        }
    }

    function IsStoredInLocalStorage() {
        if (StoreInLocalStorage == true)
            return true;
        else return false;
    }

    function HasFilterDataAtLocalStorage() {

        var hasData = false;

        if (typeof localStorage.getItem(LocalStorageKey) === 'undefined'
            || localStorage.getItem(LocalStorageKey) === null) {
            hasData = false;
        }
        else {
            var retrievedObject = localStorage.getItem(LocalStorageKey);
            var stored = JSON.parse(retrievedObject);
            if (stored.length > 0) {
                hasData = true;
            }
            else {
                hasData = false;
            }
        }

        return hasData
    }

    function HasReturnResultAtLocalStorage() {

        var key = LocalStorageDataResultKey;
        var hasData = false;

        if (typeof localStorage.getItem(key) === 'undefined'
            || localStorage.getItem(key) === null) {
            hasData = false;
        }
        else {
            var retrievedObject = localStorage.getItem(key);

            if (retrievedObject) {
                hasData = true;
            }
            else {
                hasData = false;
            }
        }

        return hasData
    }

    function GetReturnResultFromStorage() {
        var retrievedObject = localStorage.getItem(LocalStorageDataResultKey);

        return retrievedObject;
    }

    function GetDataFromLocalStorageIfExist() {
        var LS_SelectedFilterParams = [];

        if (HasFilterDataAtLocalStorage()) {
            var retrievedObject = localStorage.getItem(LocalStorageKey);
            var stored = JSON.parse(retrievedObject);

            if (stored.length > 0) {
                LS_SelectedFilterParams = stored;
            }
        }

        return LS_SelectedFilterParams;
    }

    function IsKanban() {

        var result = false;

        try {

            if ($("#kanban").length > 0) {
                result = true;
            }

        } catch { }

        return result;
    }

    function InitFilterDefault() {
        SelectedElementOrder = '-1';
        SelectedGridColumnSubType = '';
        SelectedFilterParams = [];
        DataElements = [];
        GridDataElements = [];
        ReOpenButtonClicked = false;
        $('#SearchAreaPanelTitle').attr('last-reopen-param-index', 0);

        if (StoreInLocalStorage == true) {
            SelectedFilterParams = GetDataFromLocalStorageIfExist();
        }

        PushAllHtmlButtons(SelectedFilterParams);
        ClearAllProcessCriteriaSearchAreaInputs();

        if (ProcessTypeId != 5) {
            if (SelectedFilterParams.length == 0) {
                $('#btnAddFilter').hide();
            }
        }

        //Select2 Init
        InitAllSelect2();

        //Select2 Panels Default Hide
        $('#select2-SelectedCourseId-results').parents('.select2-container').hide();
        $('#select2-SelectedDataElementId-results').parents('.select2-container').hide();
        $('#select2-SelectedGridDataElementId-results').parents('.select2-container').hide();

        //Final Form, All Search Boxes Hidden
        $('#processCriteriaSearchArea').hide();
    }

    //Select2 Open Mode
    function SetSelect2AlwaysOpen() {
        var list = $('.alwaysOpen').select2({
            sorter: function (data) {
                return data.sort(function (a, b) {
                    if (a.text > b.text) {
                        return 1;
                    }
                    if (a.text < b.text) {
                        return -1;
                    }
                    return 0;
                });
            },
            closeOnSelect: false,
        }).on("select2:closing", function (e) {
            e.preventDefault();
        }).on("select2:closed", function (e) {
            list.select2("open");
        });
    }

    function GetCourseNames() {
        $.ajax({
            type: 'GET',
            dataType: "json",
            url: GetCourseNamesURL,
            success: function (data) {
                CourseNames = [];
                $.each(data.Courses, function (key, entry) {

                    var model = { id: entry.CID, text: GetCourseNameByType(entry) }

                    CourseNames.push(model);
                })

                if (ProcessTypeId == 5 && SelectedFilterParams.length == 0) {
                    InitSelectedListCourseByUrl();
                }
            }
        });
    }

    function GetCourseNameByType(entry) {

        if (ProcessTypeId == 5) {
            return entry.NAME;
        }
        else {
            return entry.CourseName;
        }
    }

    function BindCourseNames() {
        let courseDropdown = $('#SelectedCourseId');

        courseDropdown.empty();
        courseDropdown.append('<option value="">&nbsp;</option>');

        $.each(CourseNames, function (key, entry) {

            courseDropdown.append('<option type="process" value="' + entry.id + '">' + entry.text + '</option>');
        })
    }

    function GetCriteriaData(CID, showAddFilter) {
        $.ajax({
            type: 'GET',
            dataType: "json",
            url: '/Partials/ProcessesSearchCriteriaByCID?CID=' + CID,
            success: function (data) {

                DataElements = [];
                $.each(data, function (key, entry) {

                    //Except: Assignment = 7, ActionButton = 14, DynamicGroup= 10, İmza=15
                    if ((entry.TYPE != 7) && (entry.TYPE != 14)
                        && (entry.TYPE != 10 && (entry.TYPE != 15))) {

                        var model = { type: entry.TYPE, DID: entry.DID, DISPLAYNAME: entry.DISPLAYNAME }

                        DataElements.push(model);
                    }
                })
            }
        }).done(function () {

            BindCriteriaData();

            if (showAddFilter) {
                $("#btnAddFilter").show();
            }
        });
    }

    function GetDefaultFilterData(CID, Type) {
        $.ajax({
            type: 'GET',
            dataType: "json",
            url: '/Partials/DefaultFilterOptionList?CID=' + CID + '&Type=' + Type,
            success: function (data) {

                let dropdown = $('#SelectedDefaultMatchId');
                dropdown.empty();
                dropdown.append('<option value="">&nbsp;</option>');

                $.each(data, function (key, entry) {

                    dropdown.append('<option match-type="' + entry.Type + '" value="' + entry.UserId + '">' + entry.Text + '</option>');
                })

            }
        }).done(function () {
            setTimeout(
                function () {
                    $(".filter_loadingDiv").hide();
                }, 1000);
        });
    }

    //Bind Data Elements
    function BindCriteriaData() {
        let dropdown = $('#SelectedDataElementId');

        dropdown.empty();
        dropdown.append('<option value="">&nbsp;</option>');

        $.each(DataElements, function (key, entry) {

            var typeNameString = GetTypeName(entry.type);

            dropdown.append($('<option type=' + entry.type + '></option>').attr('value', entry.DID).text('(' + typeNameString + ') ' + entry.DISPLAYNAME));
        })

        //Default Elements
        SetDefaultElementsByProcessType(dropdown);
    }

    function SetDefaultElementsByProcessType(dropdown) {

        //1 = CreatedByMe, 2 = IncludedByMe, 3 = ComplatedByMe, 4 = Tasks, 5 = Lists

        if (ProcessTypeId == 1) {
            dropdown.append('<option type="3" value="5">ProcessCreatedDate</option>');
            dropdown.append('<option type="0" value="2">TaskAssignedTo</option>');
        }
        else if (ProcessTypeId == 2) {
            //dropdown.append('<option type="0" value="1">TaskCompletedBy</option>');
            dropdown.append('<option type="0" value="2">TaskAssignedTo</option>');
            dropdown.append('<option type="0" value="4">ProcessCreatedBy</option>');
            dropdown.append('<option type="3" value="5">ProcessCreatedDate</option>');
            dropdown.append('<option type="3" value="6">ProcessCompletedDate</option>');
        }
        else if (ProcessTypeId == 3) {
            //dropdown.append('<option type="0" value="4">ProcessCreatedBy</option>');
            //dropdown.append('<option type="3" value="5">ProcessCreatedDate</option>');
            dropdown.append('<option type="0" value="2">TaskAssignedTo</option>');
            dropdown.append('<option type="3" value="6">ProcessCompletedDate</option>');
        }
        else if (ProcessTypeId == 4) {
            //dropdown.append('<option type="0" value="1">TaskCompletedBy</option>');
            dropdown.append('<option type="0" value="2">TaskAssignedTo</option>');
            dropdown.append('<option type="0" value="4">ProcessCreatedBy</option>');
            dropdown.append('<option type="3" value="5">ProcessCreatedDate</option>');
        }
        else if (ProcessTypeId == 5) {

            //Is Kanban
            if (IsKanban() == true) {
                dropdown.append(`<option type="1001" value="1001">${labelsLocal}</option>`);
            }
        }
    }

    function GetGridColumnNames(cid, did) {
        GridDataElements = [];

        $.ajax({
            type: 'GET',
            dataType: "json",
            url: '/Partials/GetGridColumnNames?cid=' + cid + '&did=' + did,
            success: function (data) {

                $.each(data, function (key, entry) {

                    var model = { ColonOrder: entry.ColonOrder, SubType: entry.SubType, DID: entry.DID, Name: entry.Name }

                    GridDataElements.push(model);
                })

                BindGridColumnNames();
            }
        });
    }

    //Column Names Accourding to Grid
    function BindGridColumnNames() {
        let dropdown = $('#SelectedGridDataElementId');

        dropdown.empty();
        dropdown.append('<option value="">&nbsp;</option>');

        $.each(GridDataElements, function (key, entry) {

            var _colOrder = entry.ColonOrder;
            var _subType = entry.SubType;
            var _did = entry.DID;
            var _name = entry.Name;

            dropdown.append($('<option colOrder= ' + _colOrder + '  subtype=' + _subType + ' did=' + _did + '></option>').attr('value', _name).text('(' + _subType + ') ' + _name));
        })

        $('.kt-header__topbar-item #p-search-process-criteria-grid-panel').removeClass('hide');
        $('.kt-header__topbar-item #p-search-process-criteria-grid-panel').addClass('show');
        $('#SelectedGridDataElementId').select2('open');

    }

    //Reset to Default Data, Get All
    function GetAllData() {

        if (ProcessTypeId != 5) {
            $(DataTableListID).dataTable().fnFilter('clear');
        }
        else {
            LoadListItemsData('', '', GetUserViewTypeWithUrl());
        }
    }

    //Name of Data Types By ID
    function GetTypeName(typeId) {

        var typeString = "";

        if (typeId == 1)
            typeString = "String";
        else if (typeId == 2)
            typeString = "Numeric";
        else if (typeId == 3)
            typeString = "DateTime";
        else if (typeId == 4)
            typeString = "Document";
        else if (typeId == 5)
            typeString = "Memo";
        else if (typeId == 6)
            typeString = "Log";
        else if (typeId == 7)
            typeString = "Assignment";
        else if (typeId == 8)
            typeString = "Grid";
        else if (typeId == 13)
            typeString = "Label";
        else if (typeId == 14)
            typeString = "ActionButton";
        else if (typeId == 10)
            typeString = "Dynamic Group";
        else if (typeId == 15)
            typeString = "İmza";

        return typeString;
    }

    function GetExactMatch() {
        return $('.dropdown-menu.match-type-menu a.dropdown-item[match-type="2"]');
    }

    function ShowExactMatch(exactMatch) {
        exactMatch.show();
    }

    function HideExactMatch(exactMatch) {
        exactMatch.hide();
        const previousDivider = exactMatch.prevAll('div.dropdown-divider.match-string-item').first();
        if (previousDivider.length > 0) {
            previousDivider.hide();
        }
        $('#btnFilterMatchType').text(EFlang.Contains).attr('match-type', 0);
    }

    function SetMatchTypeFilterItems(searchType) {

        var em = GetExactMatch();
        ShowExactMatch(em);

        if (searchType == "numeric-search") {
            $('.match-number-item').show();
            $('.match-date-item').hide();
            $('.match-string-item').hide();
            $('.match-label-item').hide();
            ChangeMatchType(2) //Default type
        }
        else if (searchType == "date-search") {
            $('.match-date-item').show();
            $('.match-number-item').hide();
            $('.match-string-item').hide();
            $('.match-label-item').hide();
            ChangeMatchType(2) //Default type
        }
        else if (searchType == "label-search")
        {
            $('.select2-me-labels').val(null).trigger('change');
            $('.match-date-item').hide();
            $('.match-number-item').hide();
            $('.match-string-item').show();
            $('.match-label-item').show();
            ChangeMatchType(1001) //Default type 
            HideExactMatch(em);
        }
        else {
            $('.match-date-item').hide();
            $('.match-number-item').hide();
            $('.match-label-item').hide();
            $('.match-string-item').show();
            ChangeMatchType(0) //Default type
        }
    }

    //Show Hide Search Controls By Data Type
    function ShowHideSearchControls(selectedElementType, isRe0pen) {

        $('.pcs-input-group').show();
        $("#btnFilterMatchType").show();
        $('#dateFastSelect').hide();
        $('#labelFilter').hide();
        $('#defaultSelect').hide();
        $('.searchControl').hide();

        if (SelectedElementType != 8) {
            $('#select2-SelectedGridDataElementId-results').parents('.select2-container').hide();
        }

        if (selectedElementType == 1 || selectedElementType == 5
            || selectedElementType == 13 || selectedElementType == 4
            || selectedElementType == 6) {
            $('.string-search').show();
            SetMatchTypeFilterItems("string-search");
        }
        else if (selectedElementType == 0) {
            $('#defaultSelect').show();
            $('.pcs-input-group').hide();
        }
        else if (selectedElementType == 2) {
            $('.numeric-search').show();
            SetMatchTypeFilterItems("numeric-search");
        }
        else if (selectedElementType == 3) {
            $('.date-search').show();
            SetMatchTypeFilterItems("date-search");
        }
        else if (selectedElementType == 8) {

            if (SelectedGridColumnSubType == 'Date') {
                $('.date-search').show();
                SetMatchTypeFilterItems('date-search');
            }
            else if (SelectedGridColumnSubType == 'Numeric') {
                $('.numeric-search').show();
                SetMatchTypeFilterItems('numeric-search');
            }
            else {
                $('.string-search').show();
                SetMatchTypeFilterItems('string-search');
            }

            if (isRe0pen == false) {
                InitCriteriaGridSelect2();
                GetGridColumnNames(SelectedCourseId, SelectedElementId);
                $('#select2-SelectedGridDataElementId-results').parents('.select2-container').show();
            }
        }
        else if (selectedElementType == 1001) {
            $('.label-search').show();
            SetMatchTypeFilterItems("label-search");
        }
        else {
            $('#processCriteriaSearchArea').hide();
        }

        if (SelectedElementName == "ProcessCreatedDate" || SelectedElementName == "ProcessCompletedDate") {
            $("#dateFastSelect").hide();
        }
    }

    //Add Filter Clicked
    function StartAddFilter() {

        $('#btnAddFilter').fadeToggle("slow");
        ReOpenButtonClicked = false;
        $('#SearchAreaPanelTitle').attr('last-reopen-param-index', 0);
        InitCriteriaSelect2();
        BindCriteriaData();

        setTimeout(function () {
            $('#select2-SelectedDataElementId-results').parents('.select2-container').show();
            $('.kt-header__topbar-item #p-search-process-criteria-panel').removeClass('hide');
            $('.kt-header__topbar-item #p-search-process-criteria-panel').addClass('show');
            $('#SelectedDataElementId').select2('open');
        }, 250);
    }

    //Show Final Form
    function ShowSearchAreaBox() {
        $('.kt-header__topbar-item #p-search-area-panel').removeClass('hide');
        $('.kt-header__topbar-item #p-search-area-panel').addClass('show');
        $('#SearchAreaPanelTitle').text(SelectedCourseName + ' Sürecine Ait "' + SelectedElementName + '" Değeri');
        $('#processCriteriaSearchArea').show();
        $('#btnAddFilter').hide();
        ClearCustomDateRangeSelect();
    }

    function CheckViewProcessSearchModal() {

        if ($('#SelectedViewID').val() == "0" ||
            typeof $('#SelectedViewID').val() === 'undefined') {
            SelectAllProcesses();
        }
        else {
            $('#unselectViewProcessSearchModal').modal('show');
        }
    }

    function UnSelectSpesificView() {
        SetUserPref("LAST_VIEW", 0, function () { window.location.href = '/Task/List'; });
    }

    //Select All Processes - Step1
    function SelectAllProcesses() {
        InitFilterDefault();

        $('#btnAddFilter').hide();
        $('#SelectAllProcessLink').hide();

        BindCourseNames();

        //GetAllData();

        $('#select2-SelectedCourseId-results').parents('.select2-container').show();
        $('.kt-header__topbar-item #p-processSelect-area-panel').removeClass('hide');
        $('.kt-header__topbar-item #p-processSelect-area-panel').addClass('show');

        $('#SelectedCourseId').select2('open');
    }

    function SelectSpesificProcesses() {
        $('#processFilterDefaultModal').modal('show');
    }

    function SelectSpesificProcessesApply() {
        InitFilterDefault();

        $('#btnAddFilter').hide();

        if (ProcessTypeId != 5) {
            $(DataTableListID).dataTable().fnFilter(SelectedCourseName);
        }

        $('#select2-SelectedCourseId-results').parents('.select2-container').show();
        $('.kt-header__topbar-item #p-processSelect-area-panel').removeClass('hide');
        $('.kt-header__topbar-item #p-processSelect-area-panel').addClass('show');

        $('#SelectedCourseId').select2('open');

        $('#SelectAllProcessLink').show();

    }

    function SelectSpesificProcessConfirmYes() {

        FilterResultIdList = "";
        InitLastFilterResultToStorage(FilterResultIdList);

        if (StoreInLocalStorage == true) {
            localStorage.removeItem(LocalStorageKey)
            localStorage.setItem(LocalStorageKey, JSON.stringify([]));
        }

        BindCourseNames();

        //SelectSpesificProcessesApply();
        $('#processFilterDefaultModal').modal('hide');

        //Select all when canceled
        SelectAllProcessesLinkClicked();
        $('.dataTables_paginate').show();

        //Seçili süreç iptal edilme durumu
        $("#btnSpesificAssign").html(EFlang.FilterAssigned + EFlang.FilterAllAssigned);

        ClearSelectedCourseStorageName();
        ClearSelectedAssignListStorageId();

        localStorage.setItem(GetCurrentCourseStorageName(), '');
        localStorage.setItem(GetCurrentAssignListStorageName(), '');

        if (ProcessTypeId == 4) {
            CreateStatusCountRadialChart(0, EFlang.FilterAllAssigned, -1, '', '');
        }
    }

    function SelectSpesificProcessConfirmNo() {
        $('#processFilterDefaultModal').modal('hide');
    }

    //Close All Process Box - Step-1
    function CloseProcessSelectAreaPanel() {

        //Süreçler select2 box hide
        $('#select2-SelectedCourseId-results').parents('.select2-container').hide();
        $('.kt-header__topbar-item #p-processSelect-area-panel').removeClass('show');
        $('.kt-header__topbar-item #p-processSelect-area-panel').addClass('hide');

        //Atananlar select2 box hide
        $('#select2-SelectedAssignId-results').parents('.select2-container').hide();
        $('.kt-header__topbar-item #p-assignedSelect-area-panel').removeClass('show');
        $('.kt-header__topbar-item #p-assignedSelect-area-panel').addClass('hide');
    }

    //Close Element Select Box
    function CloseCriteriaSelectAreaPanel() {

        $('#select2-SelectedDataElementId-results').parents('.select2-container').hide();
        $('.kt-header__topbar-item #p-search-process-criteria-panel').removeClass('show');
        $('.kt-header__topbar-item #p-search-process-criteria-panel').addClass('hide');
        $('#btnAddFilter').show();
    }

    //Close Final Search Box
    function CloseSearchAreaPanel() {

        ReOpenButtonClicked = false;
        $('#SearchAreaPanelTitle').attr('last-reopen-param-index', 0);
        $('.kt-header__topbar-item #p-search-area-panel').removeClass('show');
        $('.kt-header__topbar-item #p-search-area-panel').addClass('hide');
        ClearAllProcessCriteriaSearchAreaInputs();
        $('#btnAddFilter').show();
    }

    //Close Grid Column Select Panel
    function CloseGridCriteriaPanel() {
        $('#select2-SelectedGridDataElementId-results').parents('.select2-container').hide();
        $('.kt-header__topbar-item #p-search-process-criteria-grid-panel').removeClass('show');
        $('.kt-header__topbar-item #p-search-process-criteria-grid-panel').addClass('hide');
    }

    //Filter Result
    function GetSearchResult(cid, did, type, subtype, colName, filterText, colOrder, matchType, labels) {

        var listType = "";
        if (ProcessTypeId == 5)
        {
            if (IsKanban() == true)
            {
                listType = "Kanban";
                displayKanbanLoading();
            }
            else {
                listType = "Table";
                displayTableLoading();
            }
        }

        var model = {
            ProcessType: ProcessTypeId,
            CID: cid,
            FilterText: filterText,
            DID: did,
            Type: type,
            ColName: colName,
            SubType: subtype,
            ColOrder: colOrder,
            FilterResultIdList: FilterResultIdList,
            MatchType: matchType,
            ListType: listType,
            Labels: labels
        };

        var filter = jQuery.parseJSON(JSON.stringify(model));

        $.ajax({
            type: 'GET',
            data: filter,
            url: '/Partials/ProcessesSearchResultIDsByCriteria',
            success: function (data) {

                var has = data.indexOf("DOCTYPE");
                if (has > -1) {
                    data = [];
                }

                FilterResultIdList = "";

                if (data.length > 0) {

                    FilterResultIdList = data.join(',');

                    if (ProcessTypeId != 5) {
                        $(DataTableListID).dataTable().fnFilter(ResultFilterKeyword + data.join(','));
                    }
                    else {
                        LoadListItemsData(ResultFilterKeyword + data.join(','), '', GetUserViewTypeWithUrl())
                    }
                }
                else {
                    if (ProcessTypeId != 5) {
                        $(DataTableListID).dataTable().fnFilter('$');
                    }
                    else {
                        LoadListItemsData('$', '', GetUserViewTypeWithUrl());
                    }
                    FilterResultIdList = "";
                    InitLastFilterResultToStorage("");
                }

                InitLastFilterResultToStorage(FilterResultIdList);

                try {
                    LoadPieChartByTiidResult(FilterResultIdList);
                } catch (e) { }
            }
        });
    }

    function GetLabels() {
        var labelsText = "";
        try {
            var hasKanbanLabels = (typeof dbLabelData !== 'undefined' && dbLabelData.List.length > 0);
            if (hasKanbanLabels) {
                labelsText = dbLabelData.List.map(item => `${item.Id}¿${item.Text}`).join(',');
            }
        } catch { }

        return labelsText;
    }

    function ApplySearchAreaPanelForm(searchParamVal, matchType) {

        var filter = {
            SelectedCourseId: SelectedCourseId,
            SelectedCourseName: SelectedCourseName,
            SelectedElementId: SelectedElementId,
            SelectedElementType: SelectedElementType,
            SelectedGridColumnSubType: SelectedGridColumnSubType,
            SelectedElementName: SelectedElementName,
            SelectedElementOrder: SelectedElementOrder,
            searchParamVal: searchParamVal,
            matchType: matchType,
            Labels: GetLabels()
        };

        if (filter.searchParamVal.length > 0 || filter.searchParamVal == '') {

            if (filter.searchParamVal == '') {

            }
            else {

                //Hepsi param
                $('#SelectedAssignId').val(-100);
                GetAssignNames();
                //Adds filter param to array
                SelectedFilterParams.push(filter)

                PushAllHtmlButtons(SelectedFilterParams);

                GetSearchResult(filter.SelectedCourseId, filter.SelectedElementId, filter.SelectedElementType, filter.SelectedGridColumnSubType,
                    filter.SelectedElementName, filter.searchParamVal, filter.SelectedElementOrder, filter.matchType, filter.Labels)
            }

            $('.kt-header__topbar-item #p-search-area-panel').removeClass('show');
            $('.kt-header__topbar-item #p-search-area-panel').addClass('hide');
        }
    }

    function ApplyReOpenSearchAreaPanelForm(searchParamVal, matchType) {

        var filter = {
            SelectedCourseId: SelectedCourseId,
            SelectedCourseName: SelectedCourseName,
            SelectedElementId: SelectedElementId,
            SelectedElementType: SelectedElementType,
            SelectedGridColumnSubType: SelectedGridColumnSubType,
            SelectedElementName: SelectedElementName,
            SelectedElementOrder: SelectedElementOrder,
            searchParamVal: searchParamVal,
            matchType: matchType,
            Labels: GetLabels()
        };

        if (filter.searchParamVal == '') {

        }
        else {

            var selectedParamIndex = $('#SearchAreaPanelTitle').attr('last-reopen-param-index');

            SelectedFilterParams[selectedParamIndex] = filter;

            DismissSearchParam(-1);
        }

        if (searchParamVal.length > 0 || searchParamVal == '') {

            $('.kt-header__topbar-item #p-search-area-panel').removeClass('show');
            $('.kt-header__topbar-item #p-search-area-panel').addClass('hide');
        }
    }

    function GetMatchKeyword(matchTypeId) {

        var keywordIcon = "";

        if (matchTypeId == 0) {
            keywordIcon = "&nbsp; <code>*-like</code>";
        }
        else if (matchTypeId == 1) {
            keywordIcon = "&nbsp; <code>*-not like</code>";
        }
        else if (matchTypeId == 2) {
            keywordIcon = "&nbsp; <code>*-equal</code>";
        }
        else if (matchTypeId == 5) {
            keywordIcon = "&nbsp; <code>*-bigger</code>";
        }
        else if (matchTypeId == 6) {
            keywordIcon = "&nbsp; <code>*-smaller</code>";
        }
        else if (matchTypeId == 3) {
            keywordIcon = "&nbsp; <code>*-before</code>";
        }
        else if (matchTypeId == 4) {
            keywordIcon = "&nbsp; <code>*-after</code>";
        }
        else if (matchTypeId == 7) {
            keywordIcon = "&nbsp; <code>*-between</code>";
        }
        else if (matchTypeId == 81) {
            keywordIcon = "&nbsp; <code>*-today</code>";
        }
        else if (matchTypeId == 82) {
            keywordIcon = "&nbsp; <code>*-this week</code>";
        }
        else if (matchTypeId == 83) {
            keywordIcon = "&nbsp; <code>*-this month</code>";
        }
        else if (matchTypeId == 84) {
            keywordIcon = "&nbsp; <code>*-this year</code>";
        }
        else if (matchTypeId == 85) {
            keywordIcon = "&nbsp; <code>*-last month</code>";
        }

        return keywordIcon;
    }

    function ValidDecimalVal(locale, numericVal) {

        const numberWithDecimalSeparator = 1.1;
        var sep = Intl.NumberFormat(locale)
            .formatToParts(numberWithDecimalSeparator)
            .find(part => part.type === 'decimal')
            .value;

        var returnVal = numericVal.replace(/[^0-9.,-]/g, '');

        var lastDot = returnVal.lastIndexOf('.');
        var lastComma = returnVal.lastIndexOf(',');

        if (lastDot > lastComma) {
            returnVal = returnVal.replace(/,/g, '');
            returnVal = returnVal.replace(/\./g, sep);
        } else {
            returnVal = returnVal.replace(/\./g, '');
            returnVal = returnVal.replace(/,/g, sep);
        }
        return returnVal;
    }

    function PushAllHtmlButtons(modelArray) {

        $('#SelectedFilterParamsHtml').html('');

        $.each(modelArray, function (key, entry) {

            var searchParamValText = entry.searchParamVal;

            var _selectedElementName = entry.SelectedElementName;

            if (entry.SelectedElementType == '8') {
                _selectedElementName = "(Grid) " + entry.SelectedElementName;
            }

            var _matchKeyword = GetMatchKeyword(entry.matchType);

            if (entry.searchParamVal != undefined &&
                entry.searchParamVal.indexOf("dateFastSelectMatchId_") >= 0) {
                entry.searchParamVal = '';
                searchParamValText = '';
            }

            //TaskCompletedBy, TaskAssignedTo, ProcessCreatedBy
            if (entry.searchParamVal != undefined &&
                entry.SelectedElementType == '0') {
                searchParamValText = entry.searchParamVal.split('_')[0];
            }

            if (entry.SelectedElementType == "2") {
                searchParamValText = ValidDecimalVal(EFlang.localeCode, searchParamValText);
            }

            $('#SelectedFilterParamsHtml').append('<button match-type="' + entry.matchType + '" style="margin-right:5px;margin-bottom: 3px;" id=btnfilterParam_' + key + ' type="button" class="btn btn-small btn-default paramButtons"><i onclick="NetolojiFilter.FilterParamButtonClicked(event, \'dissmiss\', ' + key + ')" class="fa fa-times"></i> <span class="textInsideParamButton" onclick="NetolojiFilter.FilterParamButtonClicked(event,  \'reOpen\',  ' + key + ')"> &nbsp;' + _selectedElementName + ': &nbsp;' + searchParamValText + _matchKeyword + '<span> </button>');
        })

        $('#SelectedFilterParamsHtml').append('<button style="margin-left:5px;margin-top: 1px;" id="btnAddFilter" onclick="NetolojiFilter.StartAddFilter()" type="button" class="btn btn-sm btn-clean btn-bold btn-upper">' + EFlang.AddFilter + '</button>');

        if (StoreInLocalStorage == true) {
            localStorage.removeItem(LocalStorageKey)
            localStorage.setItem(LocalStorageKey, JSON.stringify(modelArray));

            if (modelArray.length == 0) {
                InitLastFilterResultToStorage('');
            }

        }
    }

    //Handle Dissmiss and ReOpen events
    function FilterParamButtonClicked(e, type, key) {

        if (type == "dissmiss" || e.srcElement == 'ı.fa.fa-times') {

            DismissSearchParam(key);
        }
        else if (type == "reOpen" || e.srcElement == 'span.textInsideParamButton') {

            ReOpenButtonClicked = true;
            ReOpenSearchAreaBox(key);
            GetDefaultFilterData(SelectedCourseId, SelectedElementName);

        }
    }

    function DismissSearchParam(index) {

        if (index > -1) {
            var deletedParam = SelectedFilterParams.splice(index, 1);
        }

        var postModelArray = [];

        for (var i = 0; i < SelectedFilterParams.length; i++) {

            var paramItem = SelectedFilterParams[i];

            var filterModel = {
                ProcessType: ProcessTypeId,
                CID: paramItem.SelectedCourseId,
                FilterText: paramItem.searchParamVal,
                DID: paramItem.SelectedElementId,
                Type: paramItem.SelectedElementType,
                ColName: paramItem.SelectedElementName,
                SubType: paramItem.SelectedGridColumnSubType,
                ColOrder: paramItem.SelectedElementOrder,
                FilterResultIdList: '',
                MatchType: paramItem.matchType,
                Labels: GetLabels()
            };

            postModelArray.push(filterModel);
        }

        var listType = "";
        if (ProcessTypeId == 5) {
            if (IsKanban() == true) {
                listType = "Kanban";
                displayKanbanLoading();
            }
            else {
                listType = "Table";
                displayTableLoading();
            }
        }

        if (postModelArray.length > 0) {

            $.ajax({
                type: 'POST',
                contentType: "application/json;charset=utf-8",
                headers: { '__RequestVerificationToken': getAntiForgeryTokenId() },
                data: JSON.stringify({ filters: postModelArray }),
                traditional: true,
                url: '/Partials/DismissSearchParam',
                success: function (data) {

                    if (data.length > 0) {
                        if (ProcessTypeId != 5) {
                            $(DataTableListID).dataTable().fnFilter(ResultFilterKeyword + data.join(','));
                        }
                        else {
                            LoadListItemsData(ResultFilterKeyword + data.join(','), '', GetUserViewTypeWithUrl())
                        }

                        FilterResultIdList = data.join(',');
                        InitLastFilterResultToStorage(FilterResultIdList);

                        try {
                            LoadPieChartByTiidResult(FilterResultIdList);
                        } catch (e) { }
                    }
                    else {
                        if (ProcessTypeId != 5) {
                            $(DataTableListID).dataTable().fnFilter('$');
                            InitLastFilterResultToStorage("");
                        }
                        else {
                            InitLastFilterResultToStorage("");
                            LoadListItemsData('$', '', GetUserViewTypeWithUrl());
                        }
                    }

                }
            });
        }
        else {
            if (ProcessTypeId != 5) {
                $(DataTableListID).dataTable().fnFilter(SelectedCourseName);
            }
            else {
                LoadListItemsData('', '', GetUserViewTypeWithUrl());
            }

            FilterResultIdList = "";
        }

        //Set All Without Deleted Element
        PushAllHtmlButtons(SelectedFilterParams);
    }

    function ReOpenSearchAreaBox(index) {

        var selectedFilter = SelectedFilterParams[index];
        $('#SearchAreaPanelTitle').attr('last-reopen-param-index', index);

        SelectedCourseId = selectedFilter.SelectedCourseId;
        SelectedCourseName = selectedFilter.SelectedCourseName;
        SelectedElementName = selectedFilter.SelectedElementName;
        SelectedElementType = selectedFilter.SelectedElementType;
        SelectedElementId = selectedFilter.SelectedElementId;
        SelectedGridColumnSubType = selectedFilter.SelectedGridColumnSubType;
        SelectedElementOrder = selectedFilter.SelectedElementOrder;

        ShowSearchAreaBox();

        ShowHideSearchControls(selectedFilter.SelectedElementType, true)

        $('.kt-header__topbar-item #p-search-area-panel').removeClass('hide');
        $('.kt-header__topbar-item #p-search-area-panel').addClass('show');
        $('#SearchAreaPanelTitle').text(selectedFilter.SelectedCourseName + ' Sürecine Ait "' + selectedFilter.SelectedElementName + '" Değeri');
        ChangeMatchType(selectedFilter.matchType);
        $('#processCriteriaSearchArea').show();
        $('#btnAddFilter').hide();
    }

    function ClearAllProcessCriteriaSearchAreaInputs() {
        $('#processCriteriaSearchArea').find('input:text').val('');
        $('#SelectedDefaultMatchId').val(1).trigger('change.select2');
    }

    function SelectAllProcessesLinkClicked() {

        InitFilterDefault();

        $('#btnSpesificProcesses').hide();
        $('#btnAllProcesses').show();

        if (ProcessTypeId != 5) {
            $('#btnAddFilter').hide();
        }

        GetAllData();

        $('.kt-header__topbar-item #p-processSelect-area-panel').removeClass('show');
        $('.kt-header__topbar-item #p-processSelect-area-panel').addClass('hide');
    }

    function InitCriteriaSelect2() {
        $('.search-process-criteria').select2({
            theme: 'default defaultFilter',
            placeholder: {
                id: '',
                text: 'None Selected'
            },
            allowClear: true,
            language: EFlang.localeCode
        });
    }

    function InitCriteriaGridSelect2() {
        $('.search-process-criteria-grid').select2({
            theme: 'default defaultFilter',
            placeholder: {
                id: '',
                text: 'None Selected'
            },
            allowClear: true,
            language: EFlang.localeCode
        });
    }

    function InitAllSelect2() {

        $('.search-process').select2({
            theme: 'default defaultFilter',
            placeholder: {
                id: '',
                text: 'None Selected'
            },
            allowClear: true,
            language: EFlang.localeCode
        });

        $('.search-process-criteria').select2({
            theme: 'default defaultFilter',
            placeholder: {
                id: '',
                text: 'None Selected'
            },
            allowClear: true,
            language: EFlang.localeCode
        });

        $('.search-process-criteria-grid').select2({
            theme: 'default defaultFilter',
            placeholder: {
                id: '',
                text: 'None Selected'
            },
            allowClear: true,
            language: EFlang.localeCode
        });

        $('.search-process-defaultmatch').select2({
            theme: 'default matchFilter',
            language: EFlang.localeCode
        });
    }

    function InitAssignSelect2() {

        $('.search-assigned').select2({
            theme: 'default defaultFilter',
            placeholder: {
                id: '',
                text: 'None Selected'
            },
            allowClear: true,
            language: EFlang.localeCode
        });
    }

    function SendFilterTextToDatatablesNet(param) {

        if (ProcessTypeId != 5) { $(DataTableListID).dataTable().fnFilter(param); }
    }

    function Events() {
        //Course Selected Event
        $('#SelectedCourseId').on('change', function () {
            $('.searchControl').val('');

            $('#select2-SelectedGridDataElementId-results').parents('.select2-container').hide();

            CloseProcessSelectAreaPanel();

            if (ProcessTypeId != 5) {

                SelectedCourseId = this.value;

                SCID = SelectedCourseId;

                var selectedProcess = $("#SelectedCourseId :selected").text().replace("&nbsp;", '');
                SelectedCourseName = selectedProcess;

                //Check Selected Course is Empty
                if (selectedProcess.trim().length == 0) {

                    $('#SelectedDataElementId').next(".select2-container").hide();
                    $('#processCriteriaSearchArea').hide();
                    SelectedCourseId = 0;
                }

                if (selectedProcess.trim().length > 0) {
                    $('#btnSpesificProcesses').show();
                    $("#btnSpesificProcesses").html(EFlang.FilterProcessName + SelectedCourseName);
                    $('#btnAllProcesses').hide();

                    if (ProcessTypeId == 4) {
                        CreateStatusCountRadialChart(GetCurrentSelectedGroupId(),
                            GetCurrentSelectedGroupName(), SelectedCourseId, SelectedCourseName, GetReturnResultFromStorage());

                    }
                }

                //Seçili sürecin id'si storage'a kaydet
                localStorage.setItem(GetSelectedCourseStorageName(), SelectedCourseId);
                localStorage.setItem(GetCurrentCourseStorageName(), SelectedCourseId);
            }
            else {
                SetSelectedCourseNameAndIdForListInit();
            }

            //Filter Grid By Selected ProcessText
            if (ProcessTypeId != 5) {

                //Son seçilmiş ArananId değerini (varsa) filtreye gönder ki, Atanan'a göre de filtrelesin
                var retObject = localStorage.getItem(GetSelectedAssignListStorageName())
                if (retObject != null && retObject > 0 && retObject != "") {
                    var filterText = "assignId_" + retObject + "|" + "SelectedCourseId_" + SelectedCourseId;
                    $(DataTableListID).dataTable().fnFilter(filterText);
                }
                else {
                    //Atanan seçilmedi ise seçili süreci getirsin
                    $(DataTableListID).dataTable().fnFilter("SelectedCourseId_" + SelectedCourseId);
                }
            }

            SCID = SelectedCourseId;
            //Bind Elements By Selected Process
            GetCriteriaData(SelectedCourseId, true);
        });

        //Data Element Selected Event
        $('#SelectedDataElementId').on('change', function () {

            $('#select2-SelectedCourseId-results').parents('.select2-container').hide();
            $('.kt-header__topbar-item #p-processSelect-area-panel').addClass('hide');
            $('#select2-SelectedDataElementId-results').parents('.select2-container').hide();

            CloseCriteriaSelectAreaPanel();

            SelectedElementType = $('option:selected', this).attr('type');

            SelectedElementId = this.value;

            var dataElementText = $("#SelectedDataElementId :selected").text();
            SelectedElementName = dataElementText;

            if (SelectedElementName == 'TaskAssignedTo' || SelectedElementName == 'TaskCompletedBy' ||
                SelectedElementName == 'ProcessCreatedBy') {

                $(".filter_loadingDiv").show();
                GetDefaultFilterData(SelectedCourseId, SelectedElementName);
            }

            ShowHideSearchControls(SelectedElementType, false);

            if (SelectedElementType != 8) {
                ShowSearchAreaBox();
            }

        });

        //Grid Column Selected Event
        $('#SelectedGridDataElementId').on('change', function () {

            $('.searchControl').hide();

            SelectedElementName = this.value;
            SelectedGridColumnSubType = $(this).find(':selected').attr('subtype');

            if (SelectedGridColumnSubType == 'Date') {
                $('.date-search').show();
                SetMatchTypeFilterItems('date-search');
            }
            else if (SelectedGridColumnSubType == 'Numeric') {
                $('.numeric-search').show();
                SetMatchTypeFilterItems('numeric-search');
            }
            else {
                $('.string-search').show();
                SetMatchTypeFilterItems('string-search');
            }

            SelectedElementOrder = $(this).find(':selected').attr('colorder');

            $('#select2-SelectedGridDataElementId-results').parents('.select2-container').hide();

            CloseGridCriteriaPanel();

            ShowSearchAreaBox();
        });

        $("#btnSearchApply").click(function () {

            var matchType = "";

            //TaskCompletedBy, TaskAssignedTo, ProcessCreatedBy
            var checkedMatchTypeDefaultItems = $("#SelectedDefaultMatchId").val();

            //Today, ThisWeek, ThisMonth, LastMonth, ThisYear
            var checkedMatchType8 = $("input[name='rdiDateSelect']:checked").attr("match-type");

            if (checkedMatchType8 !== undefined) {
                matchType = checkedMatchType8;
            }
            else if (checkedMatchTypeDefaultItems !== null &&
                checkedMatchTypeDefaultItems.length > 0) {
                var selectedMatchType = $("#SelectedDefaultMatchId option:selected").attr("match-type");

                if (selectedMatchType != undefined && selectedMatchType.length > 0) {
                    matchType = selectedMatchType;
                }

            }
            else {
                matchType = $('#btnFilterMatchType').attr("match-type");
            }

            var enteredInputVal = '';

            if (SelectedElementType == 1 || SelectedElementType == 5 ||
                SelectedElementType == 4 || SelectedElementType == 13 || SelectedElementType == 6) {
                enteredInputVal = $('.string-search').val();
            }
            else if (SelectedElementType == 8) {
                if (SelectedGridColumnSubType == 'Date') {

                    if (matchType == 7) {

                        var date1 = $('.date-search').val();
                        var date2 = $('.date-search-2').val();

                        if (date1 && date2) {

                            enteredInputVal = date1 + "," + date2;

                        }
                        else {
                            enteredInputVal = "";
                        }
                    }
                    else if (matchType == 81 || matchType == 82 ||
                        matchType == 83 || matchType == 84 || matchType == 85) {
                        enteredInputVal = "dateFastSelectMatchId_" + matchType;
                    }
                    else {
                        enteredInputVal = $('.date-search').val();
                    }

                }
                else if (SelectedGridColumnSubType == 'Numeric') {
                    enteredInputVal = $('.numeric-search').val();
                    ;
                }
                else {
                    enteredInputVal = $('.string-search').val();
                }
            }
            else if (SelectedElementType == 2) {
                enteredInputVal = $('.numeric-search').val().replace(",", ".");
            }
            else if (SelectedElementType == 3) {

                if (matchType == 7) {

                    var date1 = $('.date-search').val();
                    var date2 = $('.date-search-2').val();

                    if (date1 && date2) {

                        enteredInputVal = date1 + "," + date2;

                    }
                    else {
                        enteredInputVal = "";
                    }

                }
                else if (matchType == 81 || matchType == 82 ||
                    matchType == 83 || matchType == 84 || matchType == 85) {

                    enteredInputVal = "dateFastSelectMatchId_" + matchType;
                }
                else {
                    enteredInputVal = $('.date-search').val();
                }
            }
            else if (SelectedElementType == 0) {
                //TaskCompletedBy, TaskAssignedTo, ProcessCreatedBy
                if (checkedMatchTypeDefaultItems !== undefined &&
                    checkedMatchTypeDefaultItems.length > 0) {

                    var selectedDefaultTypeText = $("#SelectedDefaultMatchId option:selected").text() + "_";

                    enteredInputVal = selectedDefaultTypeText + checkedMatchTypeDefaultItems;
                }
            }
            //Labels
            else if (SelectedElementType == 1001) {
                let selectedOptions = $('.select2-me-labels').find(':selected');
                let returnVal = selectedOptions.map(function () {
                    return $(this).text().trim();
                }).get();

                let resultString = returnVal.length > 0 ? returnVal.join(', ') : '';
                enteredInputVal = resultString;
            }

            if (ReOpenButtonClicked == true) {
                ApplyReOpenSearchAreaPanelForm(enteredInputVal, matchType);
            }
            else if (ReOpenButtonClicked == false) {
                ApplySearchAreaPanelForm(enteredInputVal, matchType);
            }

            $('#btnAddFilter').show();
            ClearAllProcessCriteriaSearchAreaInputs();

            ReOpenButtonClicked = false;

            $('#SearchAreaPanelTitle').attr('last-reopen-param-index', 0);
            $('#btnFilterMatchType').text(EFlang.Contains).attr('match-type', 0);

            localStorage.setItem(GetCurrentCourseStorageName(), '');
            localStorage.setItem(GetCurrentAssignListStorageName(), '');

        });

        $("input[name='rdiDateSelect']").change(function () {
            $('.pcs-input-group').addClass('disablePointer');
        });

        $("#processCriteriaSearchArea").on('click', function (e) {
            ClearCustomDateRangeSelect();
        });

        //Assign Selected Event
        $('#SelectedAssignId').on('change', function () {

            var selectedAssignId = this.value;
            var selectedAssign = $("#SelectedAssignId :selected").text().replace("&nbsp;", '');

            //Tüm Atananlar Id değeri -100 olarak verildi, uygulama tarafında -100, 0 a atanıp tüm assign edilenler getiriliyor
            if (selectedAssignId == -100) { AssignedToVal = -100; }

            AssignedToVal = selectedAssignId;

            //Son seçilen AssignId değeri storage a atılıyor
            localStorage.setItem(GetSelectedAssignListStorageName(), selectedAssignId);
            localStorage.setItem(GetCurrentAssignListStorageName(), selectedAssignId);

            CloseAssignedSelectAreaPanel();

            $('#btnSpesificAssign').show();
            $("#btnSpesificAssign").html(EFlang.FilterAssigned + selectedAssign);
            $('#btnAllAssign').hide();

            // Atanan seçilirken eğer seçilmiş bir süreç var ise onu da filtreye göndersin
            var courseStorageId = localStorage.getItem(GetSelectedCourseStorageName());

            if (courseStorageId != null && courseStorageId != "") {
                var filterText = "assignId_" + selectedAssignId + "|" + $.trim("SelectedCourseId_" + courseStorageId);
                $(DataTableListID).dataTable().fnFilter(filterText);
            }
            else {
                //Seçilmiş süreç yok ise sadece Atanan'ı filtrelesin
                $(DataTableListID).dataTable().fnFilter('assignId_' + selectedAssignId + "|" + $.trim("SelectedCourseId_" + 0));
            }

            if (selectedAssignId != null && selectedAssignId != "") {

                if (courseStorageId == '') { courseStorageId = -1; }

                CreateStatusCountRadialChart(selectedAssignId, selectedAssign,
                    courseStorageId, GetCurrentSelectedCourseName(), GetReturnResultFromStorage());
            }

        });
    }

    function ClearCustomDateRangeSelect() {
        $('.pcs-input-group').removeClass('disablePointer');
        $("input[name='rdiDateSelect']").prop('checked', false);
    }

    function PrintGlobalVariables() {

        var printVariables = [];

        var globalVariables = {
            LocalStorageDataResultKey: LocalStorageDataResultKey,
            StoreInLocalStorage: StoreInLocalStorage,
            FilterResultIdList: FilterResultIdList,
            LocalStorageKey: LocalStorageKey,
            CourseNames: JSON.stringify(CourseNames),
            DataElements: JSON.stringify(DataElements),
            GridDataElements: JSON.stringify(GridDataElements),
            SelectedCourseId: SelectedCourseId,
            SelectedCourseName: SelectedCourseName,
            SelectedElementId: SelectedElementId,
            SelectedElementType: SelectedElementType,
            SelectedGridColumnSubType: SelectedGridColumnSubType,
            SelectedElementName: SelectedElementName,
            SelectedElementOrder: SelectedElementOrder,
            SelectedFilterParams: JSON.stringify(SelectedFilterParams),
            ReOpenButtonClicked: ReOpenButtonClicked
        }

        printVariables.push(globalVariables);

        console.log(printVariables);
    }

    function ChangeMatchType(val) {

        var btnMatch = $('#btnFilterMatchType');
        $('.date-search-2').hide();

        if (val == 0) {
            btnMatch.text(EFlang.Contains).attr('match-type', 0);
        }
        else if (val == 1) {
            btnMatch.text(EFlang.NotContains).attr('match-type', 1);
        }
        else if (val == 2) {
            btnMatch.text(EFlang.ExactMatch).attr('match-type', 2);
        }
        else if (val == 3) {
            btnMatch.text(EFlang.ThanBefore).attr('match-type', 3);
        }
        else if (val == 4) {
            btnMatch.text(EFlang.LaterThan).attr('match-type', 4);
        }
        else if (val == 5) {
            btnMatch.text(EFlang.BiggerThan).attr('match-type', 5);
        }
        else if (val == 6) {
            btnMatch.text(EFlang.SmallerThan).attr('match-type', 6);
        }
        else if (val == 7) {
            btnMatch.text(EFlang.DateRange).attr('match-type', 7);
            $('.date-search-2').show();
        }
    }

    function ApplyLastFilterAgain() {

        var params = GetDataFromLocalStorageIfExist();
        var isEmpty = jQuery.isEmptyObject(params);
        if (isEmpty == false) {
            DismissSearchParam(-1);
        }
        else {
            if (ProcessTypeId == 5) {
                LoadListItemsData('', '', GetUserViewTypeWithUrl());
            }
        }
    }

    //Assign Button Start

    function GetAssignNames() {

        if (ProcessTypeId == 4) {
            $.ajax({
                type: 'GET',
                dataType: "json",
                url: '/Partials/GetAssignNamesTaskCountsProcessFilter',
                success: function (data) {
                    AssignNames = [];
                    $.each(data.AssignNames, function (key, entry) {

                        var model = { id: entry.Id, text: entry.Name }

                        AssignNames.push(model);
                    })
                }
            });
        }
    }

    function BindAssignNames() {

        let assignDropdown = $('#SelectedAssignId');

        assignDropdown.empty();
        assignDropdown.append('<option value="">&nbsp;</option>');

        $.each(AssignNames, function (key, entry) {

            assignDropdown.append('<option type="assign" value="' + entry.id + '">' + entry.text + '</option>');
        })
    }

    function OpenAssignSelect() {

        InitAssignSelect2();

        $('#SelectAllAssignLink').hide();

        BindAssignNames();

        $('#select2-SelectedAssignId-results').parents('.select2-container').show();
        $('.kt-header__topbar-item #p-assignedSelect-area-panel').removeClass('hide');
        $('.kt-header__topbar-item #p-assignedSelect-area-panel').addClass('show');

        $('#SelectedAssignId').select2('open');
    }

    function CloseAssignedSelectAreaPanel() {

        //Süreçler select2 box hide
        $('#select2-SelectedCourseId-results').parents('.select2-container').hide();
        $('.kt-header__topbar-item #p-processSelect-area-panel').removeClass('show');
        $('.kt-header__topbar-item #p-processSelect-area-panel').addClass('hide');

        //Atananlar select2 box hide
        $('#select2-SelectedAssignId-results').parents('.select2-container').hide();
        $('.kt-header__topbar-item #p-assignedSelect-area-panel').removeClass('show');
        $('.kt-header__topbar-item #p-assignedSelect-area-panel').addClass('hide');
    }

    function ClearAllFilter() {

        localStorage.setItem('AssignedVal_current_' + ProcessTypeId, '');
        localStorage.setItem('CourseNameVal_current_' + ProcessTypeId, '');

        FilterResultIdList = "";
        InitLastFilterResultToStorage(FilterResultIdList);
        if (StoreInLocalStorage == true) {
            localStorage.removeItem(LocalStorageKey)
            localStorage.setItem(LocalStorageKey, JSON.stringify([]));
        }
        InitFilterDefault();
        ClearSelectedCourseStorageName();
        ClearSelectedAssignListStorageId();

        $('#SelectAllProcessLink').show();
        $('#processFilterDefaultModal').modal('hide');
        $('#btnSpesificProcesses').hide();
        $('#btnAllProcesses').show();
        $('#btnAddFilter').hide();
        $('.kt-header__topbar-item #p-processSelect-area-panel').removeClass('show');
        $('.kt-header__topbar-item #p-processSelect-area-panel').addClass('hide');
        $('.dataTables_paginate').show();
        $("#btnSpesificAssign").html(EFlang.FilterAssigned + EFlang.FilterAllAssigned);
    }

    function SelectSpesificAssigns() {
        OpenAssignSelect();
    }

    function GetCurrentSelectedCourseId() {

        try {
            if (SelectedCourseId) {
                return parseInt(SelectedCourseId);
            }
            else {
                return -1;
            }
        } catch (e) {
            return -1;
        }
    }

    function GetCurrentSelectedCourseName() {

        try {
            if (SelectedCourseName) {
                return SelectedCourseName;
            }
            else {
                return '';
            }
        } catch (e) {
            return '';
        }
    }

    function GetCurrentSelectedGroupId() {
        var groupId = parseInt($("#SelectedAssignId :selected").val());
        if (groupId) {
            return groupId;
        }
        else {
            return 0;
        }
    }

    function GetCurrentSelectedGroupName() {
        var groupName = $("#SelectedAssignId :selected").text().trim();
        if (groupName != '') {
            return groupName;
        }
        else {
            return EFlang.FilterAllAssigned;
        }
    }

    function LoadPieChartByTiidResult(tiids) {

        var tiidResult = tiids;

        var groupName = GetCurrentSelectedGroupName();
        if (tiids != '') {
            groupName = EFlang.FilterAllAssigned;
        }

        CreateStatusCountRadialChart(GetCurrentSelectedGroupId(), groupName,
            GetCurrentSelectedCourseId(), GetCurrentSelectedCourseName(), tiidResult);
    }

    function ClearSelectedCourseName() {
        SelectedCourseName = "";
    }

    function CloseFilterForms() {
        try {
            CloseCriteriaSelectAreaPanel();
            CloseSearchAreaPanel();
        }
        catch { }
    }

    function BindStoredBaseFilter() {

        var assignId = localStorage.getItem(GetCurrentAssignListStorageName());
        var courseId = localStorage.getItem(GetCurrentCourseStorageName());

        if (assignId != '' && assignId != null && assignId != "0") {
            GetAssignNames();
            BindAssignNames();
            $('#SelectedAssignId').val(assignId).trigger('change');
        }

        if (courseId != '' && courseId != null && courseId != "0") {
            GetCourseNames();
            BindCourseNames();
            $('#SelectedCourseId').val(courseId).trigger('change');
        }
    }

    function SetGroupIDCourseId() {
        var assignId = localStorage.getItem('AssignedVal_current_4');
        var courseId = localStorage.getItem('CourseNameVal_current_4');

        if (assignId != '' && assignId != null && assignId != "0") {
            AssignedToVal = parseInt(assignId);
        }

        if (courseId != '' && courseId != null && courseId != "0") {
            SCID = parseInt(courseId);
        }
    }

    //Assign Button End

    return {
        BindStoredBaseFilter: BindStoredBaseFilter,
        SetGroupIDCourseId: SetGroupIDCourseId,
        LocalStorageDataResultKey: LocalStorageDataResultKey,
        StoreInLocalStorage: StoreInLocalStorage,
        FilterResultIdList: FilterResultIdList,
        LocalStorageKey: LocalStorageKey,
        CourseNames: CourseNames,
        DataElements: DataElements,
        GridDataElements: GridDataElements,
        SelectedCourseId: SelectedCourseId,
        SelectedCourseName: SelectedCourseName,
        SelectedElementId: SelectedElementId,
        SelectedElementType: SelectedElementType,
        SelectedGridColumnSubType: SelectedGridColumnSubType,
        SelectedElementName: SelectedElementName,
        SelectedElementOrder: SelectedElementOrder,
        SelectedFilterParams: SelectedFilterParams,
        Init: Init,
        InitLastSelectedFilterFromStorage: InitLastSelectedFilterFromStorage,
        InitLastFilterResultToStorage: InitLastFilterResultToStorage,
        HasFilterDataAtLocalStorage: HasFilterDataAtLocalStorage,
        HasReturnResultAtLocalStorage: HasReturnResultAtLocalStorage,
        GetReturnResultFromStorage: GetReturnResultFromStorage,
        GetDataFromLocalStorageIfExist: GetDataFromLocalStorageIfExist,
        InitFilterDefault: InitFilterDefault,
        SetSelect2AlwaysOpen: SetSelect2AlwaysOpen,
        GetCourseNames: GetCourseNames,
        BindCourseNames: BindCourseNames,
        GetCriteriaData: GetCriteriaData,
        BindCriteriaData: BindCriteriaData,
        GetGridColumnNames: GetGridColumnNames,
        BindGridColumnNames: BindGridColumnNames,
        GetAllData: GetAllData,
        GetTypeName: GetTypeName,
        ShowHideSearchControls: ShowHideSearchControls,
        StartAddFilter: StartAddFilter,
        ShowSearchAreaBox: ShowSearchAreaBox,
        SelectAllProcesses: SelectAllProcesses,
        SelectSpesificProcesses: SelectSpesificProcesses,
        SelectSpesificProcessesApply: SelectSpesificProcessesApply,
        SelectSpesificProcessConfirmYes: SelectSpesificProcessConfirmYes,
        SelectSpesificProcessConfirmNo: SelectSpesificProcessConfirmNo,
        CloseProcessSelectAreaPanel: CloseProcessSelectAreaPanel,
        CloseCriteriaSelectAreaPanel: CloseCriteriaSelectAreaPanel,
        CloseSearchAreaPanel: CloseSearchAreaPanel,
        CloseGridCriteriaPanel: CloseGridCriteriaPanel,
        GetSearchResult: GetSearchResult,
        ApplySearchAreaPanelForm: ApplySearchAreaPanelForm,
        ApplyLastFilterAgain: ApplyLastFilterAgain,
        PushAllHtmlButtons: PushAllHtmlButtons,
        DismissSearchParam: DismissSearchParam,
        ClearAllProcessCriteriaSearchAreaInputs: ClearAllProcessCriteriaSearchAreaInputs,
        SelectAllProcessesLinkClicked: SelectAllProcessesLinkClicked,
        InitCriteriaSelect2: InitCriteriaSelect2,
        InitCriteriaGridSelect2: InitCriteriaGridSelect2,
        InitAllSelect2: InitAllSelect2,
        SendFilterTextToDatatablesNet: SendFilterTextToDatatablesNet,
        Events: Events,
        IsStoredInLocalStorage: IsStoredInLocalStorage,
        FilterParamButtonClicked: FilterParamButtonClicked,
        PrintGlobalVariables: PrintGlobalVariables,
        ReOpenSearchAreaBox: ReOpenSearchAreaBox,
        ReOpenButtonClicked: ReOpenButtonClicked,
        ChangeMatchType: ChangeMatchType,
        GetMatchKeyword: GetMatchKeyword,
        CheckViewProcessSearchModal: CheckViewProcessSearchModal,
        UnSelectSpesificView: UnSelectSpesificView,
        IsKanban: IsKanban,
        CloseAssignedSelectAreaPanel,
        ClearAllFilter,
        SelectSpesificAssigns,
        GetAssignNames,
        BindAssignNames,
        GetCurrentSelectedCourseId,
        GetCurrentSelectedCourseName,
        GetCurrentSelectedGroupId,
        GetCurrentSelectedGroupName,
        LoadPieChartByTiidResult,
        ClearSelectedCourseName,
        ValidDecimalVal,
        CloseFilterForms
    };

})(document, window, jQuery);