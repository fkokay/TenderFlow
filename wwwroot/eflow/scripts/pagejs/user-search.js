var UserFilter = (function (document, window, $) {

    //Module Init Properties
    var LocalStorageDataResultKey;
    var StoreInLocalStorage;
    var LocalStorageKey;
    var DataTableListID;

    //Global Properties
    var FilterResultIdList = "";
    var SelectedElementId;
    var SelectedElementType;
    var SelectedElementName;
    var SelectedFilterParams = [];
    var DataGroups = [];
    var ResultFilterKeyword = "";
    var ReOpenButtonClicked;

    //Constructor
    function Init(initVariables) {

        SetInitVariables(initVariables);
        SetResultKeywordText();
        Events();
        InitAllSelect2();
        SetSelect2AlwaysOpen();
        InitFilterDefault();
        BindCriteriaData();
        GetGroupsData();

        if (HasFilterDataAtLocalStorage && StoreInLocalStorage) {

            InitLastSelectedFilterFromStorage();
        }

        return this;
    }

    function PrintGlobalVariables() {

        var printVariables = [];

        var globalVariables = {
            LocalStorageDataResultKey: LocalStorageDataResultKey,
            StoreInLocalStorage: StoreInLocalStorage,
            FilterResultIdList: FilterResultIdList,
            LocalStorageKey: LocalStorageKey,
            DataGroups: JSON.stringify(DataGroups),
            SelectedElementId: SelectedElementId,
            SelectedElementType: SelectedElementType,
            SelectedElementName: SelectedElementName,
            SelectedFilterParams: JSON.stringify(SelectedFilterParams),
            ReOpenButtonClicked: ReOpenButtonClicked
        }

        printVariables.push(globalVariables);

        console.log(printVariables);
    }

    function GetGroupsData() {
        $.ajax({
            type: 'GET',
            dataType: "json",
            url: '/Group/GetAllGroups',
            success: function (data) {

                $.each(data.data, function (key, entry) {

                    var model = { ID: entry.GID, DISPLAYNAME: entry.GroupName }

                    DataGroups.push(model);
                })
            }
        }).done(function () {

            BindGroupData();
        });
    }

    function BindGroupData() {

        let dropdown = $('#SelectedDefaultMatchId');

        dropdown.empty();
        dropdown.append('<option value="">&nbsp;</option>');

        $.each(DataGroups, function (key, entry) {

            dropdown.append($('<option></option>').attr('value', entry.ID).text(entry.DISPLAYNAME));
        })
    }

    function BindStatusData() {

        let dropdown = $('#SelectedDefaultMatchId');

        dropdown.empty();
        dropdown.append('<option value="">&nbsp;</option>');

        dropdown.append($('<option></option>').attr('value', 1).text('Aktif'));
        dropdown.append($('<option></option>').attr('value', 0).text('Pasif'));
    }

    function SetResultKeywordText() {

        ResultFilterKeyword = "uids_";
    }

    function SetInitVariables(initVariables) {

        LocalStorageDataResultKey = initVariables.LocalStorageDataResultKey;
        StoreInLocalStorage = initVariables.StoreInLocalStorage;
        LocalStorageKey = initVariables.LocalStorageKey;
        DataTableListID = initVariables.DataTableListID;
    }

    function InitLastSelectedFilterFromStorage() {

        var retrievedObject = localStorage.getItem(LocalStorageKey);
        var stored = JSON.parse(retrievedObject);

        if (stored) {
            SelectedFilterParams = stored;
            PushAllHtmlButtons(stored);
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

    function InitFilterDefault() {

        SelectedFilterParams = [];
        ReOpenButtonClicked = false;
        $('#SearchAreaPanelTitle').attr('last-reopen-param-index', 0);

        if (StoreInLocalStorage == true) {
            SelectedFilterParams = GetDataFromLocalStorageIfExist();
        }

        PushAllHtmlButtons(SelectedFilterParams);
        ClearAllProcessCriteriaSearchAreaInputs();

        if (SelectedFilterParams.length == 0) {
            $('#btnAddFilter').hide();
        }

        //Select2 Init
        InitAllSelect2();

        //Select2 Panels Default Hide
        $('#select2-SelectedUserElementId-results').parents('.select2-container').hide();

        //Final Form, All Search Boxes Hidden
        $('#userCriteriaSearchArea').hide();
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

    function BindCriteriaData() {

        let dropdown = $('#SelectedUserElementId');

        dropdown.empty();
        dropdown.append('<option value="">&nbsp;</option>');

        dropdown.append($('<option type=' + 'name' + '></option>').attr('value', 1).text(EFlang.FilterName));
        dropdown.append($('<option type=' + 'sur_name' + '></option>').attr('value', 2).text(EFlang.FilterSurname));
        dropdown.append($('<option type=' + 'user_name' + '></option>').attr('value', 3).text(EFlang.FilterUsername));
        dropdown.append($('<option type=' + 'groups' + '></option>').attr('value', 4).text(EFlang.FilterGroup));
        dropdown.append($('<option type=' + 'spec_code' + '></option>').attr('value', 5).text(EFlang.FilterGroupSpecCode));
        dropdown.append($('<option type=' + 'status' + '></option>').attr('value', 6).text(EFlang.FilterStatus));
    }

    //Reset to Default Data, Get All
    function GetAllData() {

        $(DataTableListID).dataTable().fnFilter('');
    }

    function SetMatchTypeFilterItems(searchType) {

        if (searchType == "numeric-search") {
            $('.match-number-item').show();
            $('.match-string-item').hide();
            ChangeMatchType(2) //Default type
        }
        else {
            $('.match-number-item').hide();
            $('.match-string-item').show();
            ChangeMatchType(0) //Default type
        }
    }

    //Show Hide Search Controls By Data Type
    function ShowHideSearchControls(selectedElementType, isRe0pen) {

        $('.pcs-input-group').show();
        $('#defaultSelect').hide();
        $('.searchControl').hide();

        if (selectedElementType == 1 || selectedElementType == 2 || selectedElementType == 3 || selectedElementType == 5) {
            $('.string-search').show();
            SetMatchTypeFilterItems("string-search");
        }
        else if (selectedElementType == 4 || selectedElementType == 6) {

            if (selectedElementType == 4) {
                BindGroupData();
            }
            else if (selectedElementType == 6) {
                BindStatusData();
            }

            $('#defaultSelect').show();
            $('.pcs-input-group').hide();
        }
        else {
            $('#userCriteriaSearchArea').hide();
        }
    }

    function StartAddFilter() {

        $('#btnAddFilter').fadeToggle("slow");
        InitCriteriaSelect2();
        BindCriteriaData();

        setTimeout(function () {
            $('#select2-SelectedUserElementId-results').parents('.select2-container').show();
            $('.kt-header__topbar-item #p-search-user-criteria-panel').removeClass('hide');
            $('.kt-header__topbar-item #p-search-user-criteria-panel').addClass('show');
            $('#SelectedUserElementId').select2('open');
        }, 250);
    }

    //Show Final Form
    function ShowSearchAreaBox() {

        $('.kt-header__topbar-item #p-search-area-panel').removeClass('hide');
        $('.kt-header__topbar-item #p-search-area-panel').addClass('show');
        $('#SearchAreaPanelTitle').text(SelectedElementName + EFlang.FilterParameterVal);
        $('#userCriteriaSearchArea').show();
        $('#btnAddFilter').hide();
        ClearCustomDateRangeSelect();
    }

    //Close Element Select Box
    function CloseCriteriaSelectAreaPanel() {

        $('#select2-SelectedUserElementId-results').parents('.select2-container').hide();
        $('.kt-header__topbar-item #p-search-user-criteria-panel').removeClass('show');
        $('.kt-header__topbar-item #p-search-user-criteria-panel').addClass('hide');
        $('#btnAddFilter').show();
    }

    function CloseSearchAreaPanel() {

        ReOpenButtonClicked = false;
        $('#SearchAreaPanelTitle').attr('last-reopen-param-index', 0);
        $('.kt-header__topbar-item #p-search-area-panel').removeClass('show');
        $('.kt-header__topbar-item #p-search-area-panel').addClass('hide');
        ClearAllProcessCriteriaSearchAreaInputs();
        $('#btnAddFilter').show();
    }

    //Filter Result
    function GetSearchResult(id, type, filterText, matchType) {

        var model = {
            FilterType: type,
            FilterText: filterText,
            MatchType: matchType,
            ElementTypeId: id,
            FilterResultIdList: FilterResultIdList
        };

        var filter = jQuery.parseJSON(JSON.stringify(model));

        $.ajax({
            type: 'GET',
            data: filter,
            url: '/Admin/UserSearchResultIDsByCriteria',
            success: function (data) {

                var has = data.indexOf("DOCTYPE");
                if (has > -1) {
                    data = [];
                }

                FilterResultIdList = "";

                if (data.length > 0) {

                    FilterResultIdList = data.join(',');

                    $(DataTableListID).dataTable().fnFilter(ResultFilterKeyword + data.join(','));
                }
                else {
                    $(DataTableListID).dataTable().fnFilter('$');
                    FilterResultIdList = "";
                    InitLastFilterResultToStorage("");
                }

                InitLastFilterResultToStorage(FilterResultIdList);
            }
        });
    }

    function ApplySearchAreaPanelForm(searchParamVal, matchType) {

        var filter = {

            SelectedElementId: SelectedElementId,
            SelectedElementType: SelectedElementType,
            SelectedElementName: SelectedElementName,
            searchParamVal: searchParamVal,
            matchType: matchType
        };

        if (filter.searchParamVal.length > 0 || filter.searchParamVal == '') {

            if (filter.searchParamVal == '') {

            }
            else {

                //Adds filter param to array
                SelectedFilterParams.push(filter)

                PushAllHtmlButtons(SelectedFilterParams);

                GetSearchResult(filter.SelectedElementId, filter.SelectedElementType, filter.searchParamVal, filter.matchType)
            }

            $('.kt-header__topbar-item #p-search-area-panel').removeClass('show');
            $('.kt-header__topbar-item #p-search-area-panel').addClass('hide');
        }
    }

    function ApplyReOpenSearchAreaPanelForm(searchParamVal, matchType) {

        var filter = {
            SelectedElementId: SelectedElementId,
            SelectedElementType: SelectedElementType,
            SelectedElementName: SelectedElementName,
            searchParamVal: searchParamVal,
            matchType: matchType
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

        return keywordIcon;
    }

    function PushAllHtmlButtons(modelArray) {

        $('#SelectedFilterParamsHtml').html('');

        $.each(modelArray, function (key, entry) {

            var searchParamValText = entry.searchParamVal;

            var _matchKeyword = GetMatchKeyword(entry.matchType);

            _selectedElementName = entry.SelectedElementName;

            if (entry.searchParamVal != undefined &&
                (entry.SelectedElementId == '4' || entry.SelectedElementId == '6')) {
                searchParamValText = entry.searchParamVal.split('_')[0];
            }

            $('#SelectedFilterParamsHtml').
                append('<button match-type="' + entry.matchType + '" style="margin-right:5px;margin-bottom: 3px;" id=btnfilterParam_' + key + ' type="button" class="btn btn-small btn-default paramButtons"><i onclick="UserFilter.FilterParamButtonClicked(event, \'dissmiss\', ' + key + ')" class="fa fa-times"></i> <span class="textInsideParamButton" onclick="UserFilter.FilterParamButtonClicked(event,  \'reOpen\',  ' + key + ')"> &nbsp;' + _selectedElementName + ': &nbsp;' + searchParamValText + _matchKeyword + '<span> </button>');
        })

        $('#SelectedFilterParamsHtml').append('<button style="margin-left:5px;margin-top: 1px;" id="btnAddFilter" onclick="UserFilter.StartAddFilter()" type="button" class="btn btn-sm btn-clean btn-bold btn-upper">' + EFlang.AddFilter + '</button>');

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
                FilterType: paramItem.SelectedElementType,
                FilterText: paramItem.searchParamVal,
                MatchType: paramItem.matchType,
                ElementTypeId: paramItem.SelectedElementId,
                FilterResultIdList: ''
            };

            postModelArray.push(filterModel);
        }

        if (postModelArray.length > 0) {

            $.ajax({
                type: 'POST',
                contentType: "application/json;charset=utf-8",
                headers: { '__RequestVerificationToken': getAntiForgeryTokenId() },
                data: JSON.stringify({ filters: postModelArray }),
                traditional: true,
                url: '/Admin/UserFilterDismissSearchParam',
                success: function (data) {

                    if (data.length > 0) {
                        $(DataTableListID).dataTable().fnFilter(ResultFilterKeyword + data.join(','));

                        FilterResultIdList = data.join(',');
                        InitLastFilterResultToStorage(FilterResultIdList);
                    }
                    else {
                        $(DataTableListID).dataTable().fnFilter('$');
                    }

                }
            });
        }
        else {
            $(DataTableListID).dataTable().fnFilter('');

            FilterResultIdList = "";
        }

        //Set All Without Deleted Element
        PushAllHtmlButtons(SelectedFilterParams);
    }

    function ReOpenSearchAreaBox(index) {

        var selectedFilter = SelectedFilterParams[index];
        $('#SearchAreaPanelTitle').attr('last-reopen-param-index', index);

        SelectedElementName = selectedFilter.SelectedElementName;
        SelectedElementType = selectedFilter.SelectedElementType;
        SelectedElementId = selectedFilter.SelectedElementId;

        ShowSearchAreaBox();

        ShowHideSearchControls(selectedFilter.SelectedElementId, true)

        $('.kt-header__topbar-item #p-search-area-panel').removeClass('hide');
        $('.kt-header__topbar-item #p-search-area-panel').addClass('show');
        $('#SearchAreaPanelTitle').text(SelectedElementName + EFlang.FilterParameterVal);
        ChangeMatchType(selectedFilter.matchType);
        $('#userCriteriaSearchArea').show();
        $('#btnAddFilter').hide();
    }

    function ClearAllProcessCriteriaSearchAreaInputs() {
        $('#userCriteriaSearchArea').find('input:text').val('');
        $('#SelectedDefaultMatchId').val(1).trigger('change.select2');
    }

    function InitCriteriaSelect2() {
        $('.search-group-criteria').select2({
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

        $('.search-group-criteria').select2({
            theme: 'default defaultFilter',
            placeholder: {
                id: '',
                text: 'None Selected'
            },
            allowClear: true,
            language: EFlang.localeCode
        });

        $('.search-group-defaultmatch').select2({
            theme: 'default matchFilter',
            language: EFlang.localeCode
        });
    }

    function SendFilterTextToDatatablesNet(param) {

        $(DataTableListID).dataTable().fnFilter(param);
    }

    function Events() {

        //Data Element Selected Event
        $('#SelectedUserElementId').on('change', function () {

            $('#select2-SelectedUserElementId-results').parents('.select2-container').hide();

            CloseCriteriaSelectAreaPanel();

            SelectedElementType = $('option:selected', this).attr('type');

            SelectedElementId = this.value;

            var dataElementText = $("#SelectedUserElementId :selected").text();
            SelectedElementName = dataElementText;

            ShowHideSearchControls(SelectedElementId, false);

            ShowSearchAreaBox();

        });

        $("#btnSearchApply").click(function () {

            var matchType = "";

            var checkedMatchTypeDefaultItems = $("#SelectedDefaultMatchId").val();

            if (checkedMatchTypeDefaultItems !== null &&
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

            if (SelectedElementId == 1 || SelectedElementId == 2 || SelectedElementId == 3 || SelectedElementId == 5) {
                enteredInputVal = $('.string-search').val();
            }
            else if (SelectedElementId == 4 || SelectedElementId == 6) {

                if (checkedMatchTypeDefaultItems !== undefined &&
                    checkedMatchTypeDefaultItems.length > 0) {

                    var selectedDefaultTypeText = $("#SelectedDefaultMatchId option:selected").text() + "_";

                    enteredInputVal = selectedDefaultTypeText + checkedMatchTypeDefaultItems;
                }
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
            $('#btnFilterMatchType').text("İçeriyor").attr('match-type', 0);

        });

    }

    function ChangeMatchType(val) {

        var btnMatch = $('#btnFilterMatchType');

        if (val == 0) {
            btnMatch.text(EFlang.Contains).attr('match-type', 0);
        }
        else if (val == 1) {
            btnMatch.text(EFlang.NotContains).attr('match-type', 1);
        }
        else if (val == 2) {
            btnMatch.text(EFlang.ExactMatch).attr('match-type', 2);
        }
        else if (val == 5) {
            btnMatch.text(EFlang.BiggerThan).attr('match-type', 5);
        }
        else if (val == 6) {
            btnMatch.text(EFlang.SmallerThan).attr('match-type', 6);
        }
    }

    function ClearCustomDateRangeSelect() {
        $('.pcs-input-group').removeClass('disablePointer');
    }

    function ApplyLastFilterAgain() {

        var params = GetDataFromLocalStorageIfExist();
        var isEmpty = jQuery.isEmptyObject(params);
        if (isEmpty == false) {
            DismissSearchParam(-1);
        }
    }

    return {
        Init: Init,
        StartAddFilter: StartAddFilter,
        SetInitVariables: SetInitVariables,
        CloseSearchAreaPanel: CloseSearchAreaPanel,
        ChangeMatchType: ChangeMatchType,
        CloseCriteriaSelectAreaPanel: CloseCriteriaSelectAreaPanel,
        IsStoredInLocalStorage: IsStoredInLocalStorage,
        HasFilterDataAtLocalStorage: HasFilterDataAtLocalStorage,
        HasReturnResultAtLocalStorage: HasReturnResultAtLocalStorage,
        SendFilterTextToDatatablesNet: SendFilterTextToDatatablesNet,
        GetReturnResultFromStorage: GetReturnResultFromStorage,
        FilterParamButtonClicked: FilterParamButtonClicked,
        PrintGlobalVariables: PrintGlobalVariables,
        GetDataFromLocalStorageIfExist: GetDataFromLocalStorageIfExist
    };

})(document, window, jQuery);