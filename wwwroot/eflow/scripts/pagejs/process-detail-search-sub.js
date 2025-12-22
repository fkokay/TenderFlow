var NetolojiSubFilter = (function (document, window, $) {

    //Module Init Properties
    var LocalStorageDataResultKey;
    var StoreInLocalStorage;
    var LocalStorageKey;
    var GetCourseNamesURL;
    var DataTableListID;
    var ProcessTypeId; //5=List
    var SelectedCourseCID;

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
        return "SelectedCourseNameValSub_strg_" + ProcessTypeId;
    }

    function GetSelectedAssignListStorageName() {
        return "AssignedToValSub_strg_" + ProcessTypeId;
    }

    function ClearSelectedCourseStorageName() {
        localStorage.setItem(GetSelectedCourseStorageName(), "");
    }

    function ClearSelectedAssignListStorageId() {
        localStorage.setItem(GetSelectedAssignListStorageName(), "");
    }

    function SetResultKeywordText() {

        ResultFilterKeyword = "ciids_";          
    }

    function SetInitVariables(initVariables) {

        LocalStorageDataResultKey = initVariables.LocalStorageDataResultKey;
        StoreInLocalStorage = initVariables.StoreInLocalStorage;
        LocalStorageKey = initVariables.LocalStorageKey;
        GetCourseNamesURL = initVariables.GetCourseNamesURL;
        DataTableListID = initVariables.DataTableListID;
        ProcessTypeId = initVariables.ProcessTypeId;
        SelectedCourseCID = initVariables.SelectedCourseCID;
    }

    function InitLastSelectedFilterFromStorage() {
        
        var retrievedObject = localStorage.getItem(LocalStorageKey);
        var stored = JSON.parse(retrievedObject);
        if (stored.length > 0) {

            BindCourseNames();

            SelectedCourseName = stored[0].SelectedCourseName;
            SelectedCourseId = stored[0].SelectedCourseId;

            $('#btnSpesificProcesses-sub').show();
            $("#btnSpesificProcesses-sub").html(EFlang.FilterProcessName + SelectedCourseName);
            $('#btnAllProcesses-sub').hide();
            GetCriteriaData(SelectedCourseId, false);
            $('#SelectedCourseId-sub').val(SelectedCourseId).trigger('change');

            SelectedFilterParams = stored;
            PushAllHtmlButtons(stored);
        }
    }

    function InitSelectedListCourseByUrl() {

        SetSelectedCourseNameAndIdForListInit();
        GetCriteriaData(SelectedCourseId, false);
        $('#SelectedCourseId-sub').val(SelectedCourseId).trigger('change');
    }

    function SetSelectedCourseNameAndIdForListInit() {

        if (SelectedFilterParams.length == 0) {
            try {
                SelectedCourseId = parseInt(SelectedCourseCID);
                var SelectedCourse = $.grep(CourseNames, function (e) { return e.id == SelectedCourseId; });
                SelectedCourseName = SelectedCourse[0].text;
            } catch (e) {

            }
        }
    }

    function InitLastFilterResultToStorage(result) {

        if (StoreInLocalStorage == true) {

            localStorage.removeItem(LocalStorageDataResultKey)
            localStorage.setItem(LocalStorageDataResultKey, result);
        }
    }

    function ClearFilterResultToStorageByCiid(ciid) {

        if (StoreInLocalStorage == true) {

            localStorage.removeItem("v309_sublist_rk_" + ciid)
            localStorage.setItem("v309_sublist_rk_" + ciid, '');
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

    function GetReturnResultFromStorageWithCiid(ciid) {

        var retrievedObject = localStorage.getItem("v309_sublist_rk_" + ciid);

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

    function GetParamCountFromLocalStorageIfExist() {
        var LS_SelectedFilterParams = [];

        if (HasFilterDataAtLocalStorage()) {
            var retrievedObject = localStorage.getItem(LocalStorageKey);
            var stored = JSON.parse(retrievedObject);

            if (stored.length > 0) {
                LS_SelectedFilterParams = stored;
            }
        }

        return LS_SelectedFilterParams.length;
    }

    function InitFilterDefault() {
        SelectedElementOrder = '-1';
        SelectedGridColumnSubType = '';
        SelectedFilterParams = [];
        DataElements = [];
        GridDataElements = [];
        ReOpenButtonClicked = false;
        $('#SearchAreaPanelTitle-sub').attr('last-reopen-param-index', 0);

        if (StoreInLocalStorage == true) {
            SelectedFilterParams = GetDataFromLocalStorageIfExist();
        }

        PushAllHtmlButtons(SelectedFilterParams);
        ClearAllProcessCriteriaSearchAreaInputs();

        if (ProcessTypeId != 5) {
            if (SelectedFilterParams.length == 0) {
                $('#btnAddFilter-sub').hide();
            }
        }

        //Select2 Init
        InitAllSelect2();

        //Select2 Panels Default Hide
        $('#select2-SelectedCourseId-sub-results').parents('.select2-container').hide();
        $('#select2-SelectedDataElementId-sub-results').parents('.select2-container').hide();
        $('#select2-SelectedGridDataElementId-sub-results').parents('.select2-container').hide();

        //Final Form, All Search Boxes Hidden
        $('#processCriteriaSearchArea-sub').hide();
    }

    //Select2 Open Mode
    function SetSelect2AlwaysOpen() {
        var list = $('.alwaysOpen-sub').select2({
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

                $.each(data.Courses, function (key, entry) {

                    var model = { id: entry.CID, text: GetCourseNameByType(entry) }

                    CourseNames.push(model);
                })

                if (SelectedFilterParams.length == 0)
                {
                    InitSelectedListCourseByUrl();
                }
            }
        });
    }

    function GetCourseNameByType(entry) {

        return entry.NAME;
    }

    function BindCourseNames() {

        let courseDropdown = $('#SelectedCourseId-sub');

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
                $("#btnAddFilter-sub").show();
            }
        });
    }

    function GetDefaultFilterData(CID, Type) {
        $.ajax({
            type: 'GET',
            dataType: "json",
            url: '/Partials/DefaultFilterOptionList?CID=' + CID + '&Type=' + Type,
            success: function (data) {
                
                let dropdown = $('#SelectedDefaultMatchId-sub');
                dropdown.empty();
                dropdown.append('<option value="">&nbsp;</option>');

                $.each(data, function (key, entry) {

                    dropdown.append('<option match-type="' + entry.Type + '" value="' + entry.UserId + '">' + entry.Text + '</option>');
                })

            }
        }).done(function () {
            setTimeout(
                function () {
                    $(".filter_loadingDiv-sub").hide();
                }, 1000);  
        });
    }

    //Bind Data Elements
    function BindCriteriaData() {
        let dropdown = $('#SelectedDataElementId-sub');

        dropdown.empty();
        dropdown.append('<option value="">&nbsp;</option>');

        $.each(DataElements, function (key, entry) {

            var typeNameString = GetTypeName(entry.type);

            dropdown.append($('<option type=' + entry.type + '></option>').attr('value', entry.DID).text('(' + typeNameString + ') ' + entry.DISPLAYNAME));
        })
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
        let dropdown = $('#SelectedGridDataElementId-sub');

        dropdown.empty();
        dropdown.append('<option value="">&nbsp;</option>');

        $.each(GridDataElements, function (key, entry) {

            var _colOrder = entry.ColonOrder;
            var _subType = entry.SubType;
            var _did = entry.DID;
            var _name = entry.Name;

            dropdown.append($('<option colOrder= ' + _colOrder + '  subtype=' + _subType + ' did=' + _did + '></option>').attr('value', _name).text('(' + _subType + ') ' + _name));
        })

        $('.kt-header__topbar-item-sub #p-search-process-criteria-grid-panel-sub').removeClass('hide');
        $('.kt-header__topbar-item-sub #p-search-process-criteria-grid-panel-sub').addClass('show');
        $('#SelectedGridDataElementId-sub').select2('open');

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

    function SetMatchTypeFilterItems(searchType) {

        if (searchType == "numeric-search-sub") {
            $('.match-number-item-sub').show();
            $('.match-date-item-sub').hide();
            $('.match-string-item-sub').hide();
            ChangeMatchType(2) //Default type
        }
        else if (searchType == "date-search-sub") {
            $('.match-date-item-sub').show();
            $('.match-number-item-sub').hide();
            $('.match-string-item-sub').hide();
            ChangeMatchType(2) //Default type
        }
        else {
            $('.match-date-item-sub').hide();
            $('.match-number-item-sub').hide();
            $('.match-string-item-sub').show();
            ChangeMatchType(0) //Default type
        }
    }

    //Show Hide Search Controls By Data Type
    function ShowHideSearchControls(selectedElementType, isRe0pen) {

        $('.pcs-input-group-sub').show();
        $('#dateFastSelect-sub').hide();
        $('#defaultSelect-sub').hide();
        $('.searchControl-sub').hide();

        if (SelectedElementType != 8) {
            $('#select2-SelectedGridDataElementId-sub-results').parents('.select2-container').hide();
        }

        if (selectedElementType == 1 || selectedElementType == 5
            || selectedElementType == 13 || selectedElementType == 4
            || selectedElementType == 6) {
            $('.string-search-sub').show();
            SetMatchTypeFilterItems("string-search-sub");

        }
        else if (selectedElementType == 0)
        {
            $('#defaultSelect-sub').show();
            $('.pcs-input-group-sub').hide();
        }
        else if (selectedElementType == 2) {
            $('.numeric-search-sub').show();
            SetMatchTypeFilterItems("numeric-search-sub");
        }
        else if (selectedElementType == 3) {
            $('.date-search-sub').show();
            SetMatchTypeFilterItems("date-search-sub");
        }
        else if (selectedElementType == 8) {

            if (SelectedGridColumnSubType == 'Date') {
                $('.date-search-sub').show();
                SetMatchTypeFilterItems('date-search-sub');
            }
            else if (SelectedGridColumnSubType == 'Numeric') {
                $('.numeric-search-sub').show();
                SetMatchTypeFilterItems('numeric-search-sub');
            }
            else {
                $('.string-search-sub').show();
                SetMatchTypeFilterItems('string-search-sub');
            }

            if (isRe0pen == false) {
                InitCriteriaGridSelect2();
                GetGridColumnNames(SelectedCourseId, SelectedElementId);
                $('#select2-SelectedGridDataElementId-sub-results').parents('.select2-container').show();
            }
        }
        else {
            $('#processCriteriaSearchArea-sub').hide();
        }

        if (SelectedElementName == "ProcessCreatedDate" || SelectedElementName == "ProcessCompletedDate") {
            $("#dateFastSelect-sub").hide();
        }
    }

    //Add Filter Clicked
    function StartAddFilter() {
        $('#btnAddFilter-sub').fadeToggle("slow");
        ReOpenButtonClicked = false;
        $('#SearchAreaPanelTitle-sub').attr('last-reopen-param-index', 0);
        InitCriteriaSelect2();
        BindCriteriaData();

        setTimeout(function () {
            $('#select2-SelectedDataElementId-sub-results').parents('.select2-container').show();
            $('.kt-header__topbar-item-sub #p-search-process-criteria-panel-sub').removeClass('hide');
            $('.kt-header__topbar-item-sub #p-search-process-criteria-panel-sub').addClass('show');
            $('#SelectedDataElementId-sub').select2('open');
        }, 250);
    }

    //Show Final Form
    function ShowSearchAreaBox() {
        $('.kt-header__topbar-item-sub #p-search-area-panel-sub').removeClass('hide');
        $('.kt-header__topbar-item-sub #p-search-area-panel-sub').addClass('show');
        $('#SearchAreaPanelTitle-sub').text(SelectedElementName + '" Değeri');
        $('#processCriteriaSearchArea-sub').show();
        $('#btnAddFilter-sub').hide();
        ClearCustomDateRangeSelect();
    }

    function CheckViewProcessSearchModal() {
        
        SelectAllProcesses();
    }

    function UnSelectSpesificView() {
        SetUserPref("LAST_VIEW", 0, function () { window.location.href = '/Task/List'; });
    }

    //Select All Processes - Step1
    function SelectAllProcesses() {
        InitFilterDefault();

        $('#btnAddFilter-sub').hide();
        $('#SelectAllProcessLink-sub').hide();

        BindCourseNames();

        $('#select2-SelectedCourseId-sub-results').parents('.select2-container').show();
        $('.kt-header__topbar-item-sub #p-processSelect-area-panel-sub').removeClass('hide');
        $('.kt-header__topbar-item-sub #p-processSelect-area-panel-sub').addClass('show');

        $('#SelectedCourseId-sub').select2('open');
    }

    function SelectSpesificProcessesSub() {
        $('#processFilterDefaultModalSub').modal('show');
    }

    function SelectSpesificProcessConfirmYesSub() {

        //FilterResultIdList = "";
        //InitLastFilterResultToStorage(FilterResultIdList);

        //if (StoreInLocalStorage == true) {
        //    localStorage.removeItem(LocalStorageKey)
        //    localStorage.setItem(LocalStorageKey, JSON.stringify([]));
        //}

        //BindCourseNames();

        //$('#processFilterDefaultModalSub').modal('hide');

        //SelectAllProcessesLinkClicked();

        //ClearSelectedCourseStorageName();
        //ClearSelectedAssignListStorageId();
    }

    function SelectSpesificProcessConfirmNoSub() {
        $('#processFilterDefaultModalSub').modal('hide');
    }

    function SelectSpesificProcessesApply() {

        InitFilterDefault();

        $('#btnAddFilter-sub').hide();

        $('#select2-SelectedCourseId-sub-results').parents('.select2-container').show();
        $('.kt-header__topbar-item-sub #p-processSelect-area-panel-sub').removeClass('hide');
        $('.kt-header__topbar-item-sub #p-processSelect-area-panel-sub').addClass('show');

        $('#SelectedCourseId-sub').select2('open');

        $('#SelectAllProcessLink-sub').show();

    }

    //Close All Process Box - Step-1
    function CloseProcessSelectAreaPanel() {

        //Süreçler select2 box hide
        $('#select2-SelectedCourseId-sub-results').parents('.select2-container').hide();
        $('.kt-header__topbar-item-sub #p-processSelect-area-panel-sub').removeClass('show');
        $('.kt-header__topbar-item-sub #p-processSelect-area-panel-sub').addClass('hide');

        //Atananlar select2 box hide
        $('#select2-SelectedAssignId-sub-results').parents('.select2-container').hide();
        $('.kt-header__topbar-item-sub #p-assignedSelect-area-panel-sub').removeClass('show');
        $('.kt-header__topbar-item-sub #p-assignedSelect-area-panel-sub').addClass('hide');
    }

    //Close Element Select Box
    function CloseCriteriaSelectAreaPanel() {

        $('#select2-SelectedDataElementId-sub-results').parents('.select2-container').hide();
        $('.kt-header__topbar-item-sub #p-search-process-criteria-panel-sub').removeClass('show');
        $('.kt-header__topbar-item-sub #p-search-process-criteria-panel-sub').addClass('hide');
        $('#btnAddFilter-sub').show();
    }

    //Close Final Search Box
    function CloseSearchAreaPanel() {

        ReOpenButtonClicked = false;
        $('#SearchAreaPanelTitle-sub').attr('last-reopen-param-index', 0);
        $('.kt-header__topbar-item-sub #p-search-area-panel-sub').removeClass('show');
        $('.kt-header__topbar-item-sub #p-search-area-panel-sub').addClass('hide');
        ClearAllProcessCriteriaSearchAreaInputs();
        $('#btnAddFilter-sub').show();
    }

    //Close Grid Column Select Panel
    function CloseGridCriteriaPanel() {
        $('#select2-SelectedGridDataElementId-sub-results').parents('.select2-container').hide();
        $('.kt-header__topbar-item-sub #p-search-process-criteria-grid-panel-sub').removeClass('show');
        $('.kt-header__topbar-item-sub #p-search-process-criteria-grid-panel-sub').addClass('hide');
    }

    //Filter Result
    function GetSearchResult(cid, did, type, subtype, colName, filterText, colOrder, matchType) {
    
        PreLoadSub('#sub-table-inline');

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
                MatchType: matchType
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

                        LoadSubListItemsDataOnlyList(ResultFilterKeyword + data.join(','))
                    }
                    else {
                        $('#efSublistsTableDiv tbody').html("");
                        $(".list-items-footer-sub").text("");
                        $("#sub-table-inline").html("");
                        $("#efSublistsTableDiv").hide();
                        $("#kt_process_detail_form-sub").show();
                        $(".no-data-div-sub").show();
                        FilterResultIdList = "";
                        InitLastFilterResultToStorage("");
                    }

                    InitLastFilterResultToStorage(FilterResultIdList);
                }
            });
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
            matchType: matchType
        };

        if (filter.searchParamVal.length > 0 || filter.searchParamVal == '') {

            if (filter.searchParamVal == '') {

            }
            else {

                //Hepsi param
                $('#SelectedAssignId-sub').val(-100);

                //Adds filter param to array
                SelectedFilterParams.push(filter)

                PushAllHtmlButtons(SelectedFilterParams);

                GetSearchResult(filter.SelectedCourseId, filter.SelectedElementId, filter.SelectedElementType, filter.SelectedGridColumnSubType,
                    filter.SelectedElementName, filter.searchParamVal, filter.SelectedElementOrder, filter.matchType)
            }

            $('.kt-header__topbar-item-sub #p-search-area-panel-sub').removeClass('show');
            $('.kt-header__topbar-item-sub #p-search-area-panel-sub').addClass('hide');
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
            matchType: matchType
        };

        if (filter.searchParamVal == '') {

        }
        else {

            var selectedParamIndex = $('#SearchAreaPanelTitle-sub').attr('last-reopen-param-index');

            SelectedFilterParams[selectedParamIndex] = filter;

            DismissSearchParam(-1);
        }

        if (searchParamVal.length > 0 || searchParamVal == '') {

            $('.kt-header__topbar-item-sub #p-search-area-panel-sub').removeClass('show');
            $('.kt-header__topbar-item-sub #p-search-area-panel-sub').addClass('hide');
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

    function ValidDecimalValSub(locale, numericVal) {

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
        
        $('#SelectedFilterParamsHtml-sub').html('');

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
                searchParamValText = ValidDecimalValSub(EFlang.localeCode, searchParamValText);
            }

            $('#SelectedFilterParamsHtml-sub').
                append('<button match-type="' + entry.matchType + '" style="margin-right:5px;margin-bottom: 3px;" id=btnfilterParam_' + key + ' type="button" class="btn btn-small btn-default paramButtons"><i onclick="NetolojiSubFilter.FilterParamButtonClicked(event, \'dissmiss\', ' + key + ')" class="fa fa-times"></i> <span class="textInsideParamButton" onclick="NetolojiSubFilter.FilterParamButtonClicked(event,  \'reOpen\',  ' + key + ')"> &nbsp;' + _selectedElementName + ': &nbsp;' + searchParamValText + _matchKeyword + '<span> </button>');
        })

        $('#SelectedFilterParamsHtml-sub').append('<button style="margin-left:5px;margin-top: 1px;" id="btnAddFilter-sub" onclick="NetolojiSubFilter.StartAddFilter()" type="button" class="btn btn-sm btn-clean btn-bold btn-upper">' + EFlang.AddFilter + '</button>');

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
                MatchType: paramItem.matchType
            };

            postModelArray.push(filterModel);
        }

        PreLoadSub('#sub-table-inline');

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
                            LoadSubListItemsDataOnlyList(ResultFilterKeyword + data.join(','));

                            FilterResultIdList = data.join(',');
                            InitLastFilterResultToStorage(FilterResultIdList);
                        }
                        else {
                            $('#efSublistsTableDiv tbody').html("");
                            $(".list-items-footer-sub").text("");
                            $("#sub-table-inline").html("");
                            $("#efSublistsTableDiv").hide();
                            $("#kt_process_detail_form-sub").show();
                            $(".no-data-div-sub").show();
                            InitLastFilterResultToStorage('');
                        }

                    }
                });
            }
            else {
                LoadSubListItemsDataOnlyList();

                FilterResultIdList = "";
            }

            //Set All Without Deleted Element
            PushAllHtmlButtons(SelectedFilterParams);
    }

    function ReOpenSearchAreaBox(index) {

        var selectedFilter = SelectedFilterParams[index];
        $('#SearchAreaPanelTitle-sub').attr('last-reopen-param-index', index);

        SelectedCourseId = selectedFilter.SelectedCourseId;
        SelectedCourseName = selectedFilter.SelectedCourseName;
        SelectedElementName = selectedFilter.SelectedElementName;
        SelectedElementType = selectedFilter.SelectedElementType;
        SelectedElementId = selectedFilter.SelectedElementId;
        SelectedGridColumnSubType = selectedFilter.SelectedGridColumnSubType;
        SelectedElementOrder = selectedFilter.SelectedElementOrder;

        ShowSearchAreaBox();

        ShowHideSearchControls(selectedFilter.SelectedElementType, true)

        $('.kt-header__topbar-item-sub #p-search-area-panel-sub').removeClass('hide');
        $('.kt-header__topbar-item-sub #p-search-area-panel-sub').addClass('show');
        $('#SearchAreaPanelTitle-sub').text(selectedFilter.SelectedElementName + '" Değeri');
        ChangeMatchType(selectedFilter.matchType);
        $('#processCriteriaSearchArea-sub').show();
        $('#btnAddFilter-sub').hide();
    }

    function ClearAllProcessCriteriaSearchAreaInputs() {
        $('#processCriteriaSearchArea-sub').find('input:text').val('');
        $('#SelectedDefaultMatchId-sub').val(1).trigger('change.select2');
    }

    function SelectAllProcessesLinkClicked() {

        InitFilterDefault();

        $('#btnSpesificProcesses-sub').hide();
        $('#btnAllProcesses-sub').show();

        if (ProcessTypeId != 5) {
            $('#btnAddFilter-sub').hide();
        }

        $('.kt-header__topbar-item-sub #p-processSelect-area-panel-sub').removeClass('show');
        $('.kt-header__topbar-item-sub #p-processSelect-area-panel-sub').addClass('hide');
    }

    function InitCriteriaSelect2() {
        $('.search-process-criteria-sub').select2({
            theme: 'defaulttheme',
            placeholder: {
                id: '',
                text: 'None Selected'
            },
            allowClear: true,
            language: EFlang.localeCode
        });
    }

    function InitCriteriaGridSelect2() {
        $('.search-process-criteria-grid-sub').select2({
            theme: 'defaulttheme',
            placeholder: {
                id: '',
                text: 'None Selected'
            },
            allowClear: true,
            language: EFlang.localeCode
        });
    }

    function InitAllSelect2() {

        $('.search-process-sub').select2({
            theme: 'defaulttheme',
            placeholder: {
                id: '',
                text: 'None Selected'
            },
            allowClear: true,
            language: EFlang.localeCode
        });

        $('.search-process-criteria-sub').select2({
            theme: 'defaulttheme',
            placeholder: {
                id: '',
                text: 'None Selected'
            },
            allowClear: true,
            language: EFlang.localeCode
        });

        $('.search-process-criteria-grid-sub').select2({
            theme: 'defaulttheme',
            placeholder: {
                id: '',
                text: 'None Selected'
            },
            allowClear: true,
            language: EFlang.localeCode
        });

        $('.search-process-defaultmatch-sub').select2({
            theme: 'default matchFilter',
            language: EFlang.localeCode
        });
    }

    function InitAssignSelect2() {

        $('.search-assigned-sub').select2({
            theme: 'defaulttheme',
            placeholder: {
                id: '',
                text: 'None Selected'
            },
            allowClear: true,
            language: EFlang.localeCode
        });
    }

    function Events() {
        //Course Selected Event
        $('#SelectedCourseId-sub').on('change', function () {

            $('.searchControl-sub').val('');

            $('#select2-SelectedGridDataElementId-sub-results').parents('.select2-container').hide();

            CloseProcessSelectAreaPanel();

            SetSelectedCourseNameAndIdForListInit();

            //Bind Elements By Selected Process
            GetCriteriaData(SelectedCourseId, true);
        });

        //Data Element Selected Event
        $('#SelectedDataElementId-sub').on('change', function () {

            $('#select2-SelectedCourseId-sub-results').parents('.select2-container').hide();
            $('.kt-header__topbar-item-sub #p-processSelect-area-panel-sub').addClass('hide');
            $('#select2-SelectedDataElementId-sub-results').parents('.select2-container').hide();

            CloseCriteriaSelectAreaPanel();

            SelectedElementType = $('option:selected', this).attr('type');

            SelectedElementId = this.value;

            var dataElementText = $("#SelectedDataElementId-sub :selected").text();
            SelectedElementName = dataElementText;

            if (SelectedElementName == 'TaskAssignedTo' || SelectedElementName == 'TaskCompletedBy' ||
                SelectedElementName == 'ProcessCreatedBy') {

                $(".filter_loadingDiv-sub").show();
                GetDefaultFilterData(SelectedCourseId, SelectedElementName);
            }

            ShowHideSearchControls(SelectedElementType, false);

            if (SelectedElementType != 8) {
                ShowSearchAreaBox();
            }

        });

        //Grid Column Selected Event
        $('#SelectedGridDataElementId-sub').on('change', function () {

            $('.searchControl-sub').hide();

            SelectedElementName = this.value;
            SelectedGridColumnSubType = $(this).find(':selected').attr('subtype');

            if (SelectedGridColumnSubType == 'Date') {
                $('.date-search-sub').show();
                SetMatchTypeFilterItems('date-search-sub');
            }
            else if (SelectedGridColumnSubType == 'Numeric') {
                $('.numeric-search-sub').show();
                SetMatchTypeFilterItems('numeric-search-sub');
            }
            else {
                $('.string-search-sub').show();
                SetMatchTypeFilterItems('string-search-sub');
            }

            SelectedElementOrder = $(this).find(':selected').attr('colorder');

            $('#select2-SelectedGridDataElementId-sub-results').parents('.select2-container').hide();

            CloseGridCriteriaPanel();

            ShowSearchAreaBox();
        });

        $("#btnSearchApply-sub").click(function () {

            var matchType = "";

            //TaskCompletedBy, TaskAssignedTo, ProcessCreatedBy
            var checkedMatchTypeDefaultItems = $("#SelectedDefaultMatchId-sub").val();

            //Today, ThisWeek, ThisMonth, ThisYear
            var checkedMatchType8 = $("input[name='rdiDateSelect-sub']:checked").attr("match-type");

            if (checkedMatchType8 !== undefined) {
                matchType = checkedMatchType8;
            }
            else if (checkedMatchTypeDefaultItems !== null &&
                checkedMatchTypeDefaultItems.length > 0)
            {
                var selectedMatchType = $("#SelectedDefaultMatchId-sub option:selected").attr("match-type");

                if (selectedMatchType != undefined && selectedMatchType.length > 0) {
                    matchType = selectedMatchType;
                }

            }
            else {
                matchType = $('#btnFilterMatchType-sub').attr("match-type");
            }

            var enteredInputVal = '';

            if (SelectedElementType == 1 || SelectedElementType == 5 ||
                SelectedElementType == 4 || SelectedElementType == 13 || SelectedElementType == 6) {
                enteredInputVal = $('.string-search-sub').val();
            }
            else if (SelectedElementType == 8) {
                if (SelectedGridColumnSubType == 'Date') {

                    if (matchType == 7) {

                        var date1 = $('.date-search-sub').val();
                        var date2 = $('.date-search-2-sub').val();

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
                        enteredInputVal = $('.date-search-sub').val();
                    }

                }
                else if (SelectedGridColumnSubType == 'Numeric') {
                    enteredInputVal = $('.numeric-search-sub').val();
                }
                else {
                    enteredInputVal = $('.string-search-sub').val();
                }
            }
            else if (SelectedElementType == 2) {
                enteredInputVal = $('.numeric-search-sub').val().replace(",", ".");
            }
            else if (SelectedElementType == 3) {

                if (matchType == 7) {

                    var date1 = $('.date-search-sub').val();
                    var date2 = $('.date-search-2-sub').val();

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
                    enteredInputVal = $('.date-search-sub').val();
                }
            }
            else if (SelectedElementType == 0) {
                //TaskCompletedBy, TaskAssignedTo, ProcessCreatedBy
                if (checkedMatchTypeDefaultItems !== undefined &&
                    checkedMatchTypeDefaultItems.length > 0) {

                    var selectedDefaultTypeText = $("#SelectedDefaultMatchId-sub option:selected").text() + "_";

                    enteredInputVal = selectedDefaultTypeText + checkedMatchTypeDefaultItems;
                }
            }

            if (ReOpenButtonClicked == true) {
                ApplyReOpenSearchAreaPanelForm(enteredInputVal, matchType);
            }
            else if (ReOpenButtonClicked == false) {
                ApplySearchAreaPanelForm(enteredInputVal, matchType);
            }

            $('#btnAddFilter-sub').show();
            ClearAllProcessCriteriaSearchAreaInputs();

            ReOpenButtonClicked = false;

            $('#SearchAreaPanelTitle-sub').attr('last-reopen-param-index', 0);
            $('#btnFilterMatchType-sub').text("İçeriyor").attr('match-type', 0);
            
        });

        $("input[name='rdiDateSelect-sub']").change(function () {
            $('.pcs-input-group-sub').addClass('disablePointer');
        });

        $("#processCriteriaSearchArea-sub").on('click', function (e) {
            ClearCustomDateRangeSelect();
        });

        //Assign Selected Event
        $('#SelectedAssignId-sub').on('change', function () {
            
            var selectedAssignId = this.value;
            var selectedAssign = $("#SelectedAssignId-sub :selected").text().replace("&nbsp;", '');

            //Tüm Atananlar Id değeri -100 olarak verildi, uygulama tarafında -100, 0 a atanıp tüm assign edilenler getiriliyor
            if (selectedAssignId == -100) {  AssignedToVal = -100;}

            AssignedToVal = selectedAssignId;

            //Son seçilen AssignId değeri storage a atılıyor
            localStorage.setItem(GetSelectedAssignListStorageName(), selectedAssignId);

            CloseAssignedSelectAreaPanel();

            $('#btnSpesificAssign-sub').show();
            $("#btnSpesificAssign-sub").html(EFlang.FilterAssigned + selectedAssign);
            $('#btnAllAssign-sub').hide();

            // Atanan seçilirken eğer seçilmiş bir süreç var ise onu da filtreye göndersin
            var courseStorageId = localStorage.getItem(GetSelectedCourseStorageName());

            if (courseStorageId != null && courseStorageId != "") {
                var filterText = "assignId_" + selectedAssignId + "|" + $.trim("SelectedCourseId_" + courseStorageId);
                $(DataTableListID).dataTable().fnFilter(filterText);
            }
            else {
                //Seçilmiş süreç yok ise sadece Atanan'ı filtrelesin
                $(DataTableListID).dataTable().fnFilter('assignId_' + selectedAssignId);
            }    

            if (selectedAssignId != null && selectedAssignId != "") {

                if (courseStorageId == '') { courseStorageId = -1;}
            }                    
        });
    }

    function ClearCustomDateRangeSelect() {
        $('.pcs-input-group-sub').removeClass('disablePointer');
        $("input[name='rdiDateSelect-sub']").prop('checked', false);
    }

    function ChangeMatchType(val) {

        var btnMatch = $('#btnFilterMatchType-sub');
        $('.date-search-2-sub').hide();

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
            $('.date-search-2-sub').show();
        }
    }

    function ApplyLastFilterAgain() {

        var params = GetDataFromLocalStorageIfExist();
        var isEmpty = jQuery.isEmptyObject(params);
        if (isEmpty == false) {
            DismissSearchParam(-1);
        }
        else {
            LoadSubListItemsDataOnlyList();
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

        let assignDropdown = $('#SelectedAssignId-sub');

        assignDropdown.empty();
        assignDropdown.append('<option value="">&nbsp;</option>');

        $.each(AssignNames, function (key, entry) {

            assignDropdown.append('<option type="assign" value="' + entry.id + '">' + entry.text + '</option>');
        })
    }

    function OpenAssignSelect() {

        InitAssignSelect2();

        $('#SelectAllAssignLink-sub').hide();

        BindAssignNames();

        $('#select2-SelectedAssignId-sub-results').parents('.select2-container').show();
        $('.kt-header__topbar-item-sub #p-assignedSelect-area-panel-sub').removeClass('hide');
        $('.kt-header__topbar-item-sub #p-assignedSelect-area-panel-sub').addClass('show');

        $('#SelectedAssignId-sub').select2('open');
    }

    function CloseAssignedSelectAreaPanel() {

        //Süreçler select2 box hide
        $('#select2-SelectedCourseId-sub-results').parents('.select2-container').hide();
        $('.kt-header__topbar-item-sub #p-processSelect-area-panel-sub').removeClass('show');
        $('.kt-header__topbar-item-sub #p-processSelect-area-panel-sub').addClass('hide');

        //Atananlar select2 box hide
        $('#select2-SelectedAssignId-sub-results').parents('.select2-container').hide();
        $('.kt-header__topbar-item-sub #p-assignedSelect-area-panel-sub').removeClass('show');
        $('.kt-header__topbar-item-sub #p-assignedSelect-area-panel-sub').addClass('hide');
    }

    function SelectSpesificAssigns() {
        OpenAssignSelect();
    }

    function CloseFilterForms() {
        try {
            CloseCriteriaSelectAreaPanel();
            CloseSearchAreaPanel();
        }
        catch{ }
    }

    //Assign Button End

    return {
        LocalStorageDataResultKey: LocalStorageDataResultKey,
        ClearFilterResultToStorageByCiid: ClearFilterResultToStorageByCiid,
        GetParamCountFromLocalStorageIfExist: GetParamCountFromLocalStorageIfExist,
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
        GetReturnResultFromStorageWithCiid: GetReturnResultFromStorageWithCiid,
        InitFilterDefault: InitFilterDefault,
        SetSelect2AlwaysOpen: SetSelect2AlwaysOpen,
        GetCourseNames: GetCourseNames,
        BindCourseNames: BindCourseNames,
        GetCriteriaData: GetCriteriaData,
        BindCriteriaData: BindCriteriaData,
        GetGridColumnNames: GetGridColumnNames,
        BindGridColumnNames: BindGridColumnNames,
        GetTypeName: GetTypeName,
        ShowHideSearchControls: ShowHideSearchControls,
        StartAddFilter: StartAddFilter,
        ShowSearchAreaBox: ShowSearchAreaBox,
        SelectAllProcesses: SelectAllProcesses,
        SelectSpesificProcessesApply: SelectSpesificProcessesApply,
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
        Events: Events,
        IsStoredInLocalStorage: IsStoredInLocalStorage,
        FilterParamButtonClicked: FilterParamButtonClicked,
        ReOpenSearchAreaBox: ReOpenSearchAreaBox,
        ReOpenButtonClicked: ReOpenButtonClicked,
        ChangeMatchType: ChangeMatchType,
        GetMatchKeyword: GetMatchKeyword,
        CheckViewProcessSearchModal: CheckViewProcessSearchModal,
        UnSelectSpesificView: UnSelectSpesificView,
        CloseAssignedSelectAreaPanel,
        SelectSpesificAssigns,
        GetAssignNames,
        BindAssignNames,
        CloseFilterForms,
        SelectSpesificProcessConfirmYesSub,
        SelectSpesificProcessConfirmNoSub,
        ValidDecimalValSub,
        SelectSpesificProcessesSub
    };

})(document, window, jQuery);