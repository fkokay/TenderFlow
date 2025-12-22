var _pageSize = 20;
var grid;
var _columns;
var _datasource;
var _getData;
var _cbIndex;
var checks = [];
var _did;
var _columnId;
var jsonData = [];
var gridIndex = 0;
var masterObjectCollection = [];
var objectCollection = [];
var formulalist = [];
var dropdownObject;
var masterObjectSchemaCollection = [];
var _container;
var tableOptions = [];
var transporter = [];
var default_numeric_format = "##.#########";
var commandButton;
var savechange = "";
var sizelist = [];
//global değişkenler
var gEditable = true;
var gPageable = true;
var IsNewLine = false;
var FocusIndex = 0;
var btnclean;


$.fn.extend({
    getData: function (DID) {
        _getData = function () {
            $.ajax({
                'async': false,
                'type': "POST",
                'global': false,
                'dataType': 'json',
                'url': "/KendoGrid/GetData",
                'data': { "DID": DID, "TIID": TIID },
                'success': function (data) {
                    tmp = data;
                }
            });
        }();
    },
    collectRelatedFields: function (DID, index, tableName) {
        _getData = function () {
            $.ajax({
                'async': false,
                'type': "POST",
                'global': false,
                'dataType': 'json',
                'url': "/KendoGrid/collectRelatedFields",
                'data': { "DID": DID, "masterObjectCollection": JSON.stringify(masterObjectCollection[index][tableName][0]) },
                'success': function () {
                    //
                }
            });
        }();
    },
    getDataSource: function (DID) {
        _datasource = function () {
            var tmp = null;
            $.ajax({
                'async': false,
                'type': "POST",
                'global': false,
                'dataType': 'json',
                'url': "/KendoGrid/ReadDataSource",
                'data': { 'mode': 'datasource', "DID": DID, "TIID": TIID },
                'success': function (data) {
                    var obj = JSON.stringify(data).replace(/&quot;/g, '\\"');
                    tmp = JSON.parse(obj);
                },
                'error': function (e) {
                    console.log(e.error());
                }
            });
            return tmp;
        }();
    },
    getColumnsData: function (DID) {
        _columns = function () {
            var tmp = null;
            $.ajax({
                'async': false,
                'type': "POST",
                'global': false,
                'dataType': 'json',
                'url': "/KendoGrid/Read",
                'data': { 'mode': 'column', "DID": DID, "TIID": TIID },
                'success': function (data) {
                    var obj = data;
                    tmp = obj;
                }
            });
            return tmp;
        }();
    },
    xmlToMasterObjectCollection: function () {
        var DID = $(this).attr("did");
        var _objectCollection = function () {
            var tmp = null;
            $.ajax({
                'async': false,
                'type': "POST",
                'global': false,
                'dataType': 'json',
                'url': "/KendoGrid/XmlToMasterObjectCollection",
                'data': { "DID": DID, 'TIID': TIID },
                'success': function (data) {
                    var obj = data;
                    tmp = obj;
                },
                "error": function (e) {
                    console.log(e);
                }
            });
            return tmp;
        }();
    },
    dataSourceToXML: function (col) {
        $(".grid").each(function () {
            var DID = $(this).attr("did");

            var litmData = JSON.stringify($(".grid[did=" + DID + "]").data("kendoGrid").dataSource.data());
            var litmColumn = JSON.stringify($(".grid[did=" + DID + "]").data("kendoGrid").columns);
            var litmAggr = JSON.stringify($(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregate());


            var xml_data = function () {
                var tmp = null;
                $.ajax({
                    'async': false,
                    'type': "POST",
                    'global': false,
                    'dataType': 'json',
                    'url': "/KendoGrid/dataSourceToXML",
                    'data': { "litmColumn": litmColumn, "litmData": litmData, "litmAggr": litmAggr, "CIID": CIID, "DID": DID, "TIID": TIID },
                    'success': function (data) {
                        tmp = data;
                    }
                });
                return tmp;
            }();
        });
    },
    fillDropdown: function (col, gridIndex, column) {
        var colId = "";
        try {
            var lns = new Array();
            $.each(col, function (i, item) {
                var vc = new VIEWCOL(item.type, item.field, "");
                if (item.command == undefined)
                    lns[i] = vc;
            });

            colId = col.field;
            var Colvals = "";
            var DDQ = column.attributes.dataDdq;
            var FormHash = $("#taskform [name='taskhash']").val();

            _datasourceDD = function () {
                var tmp = null;
                $.ajax({
                    'async': false,
                    'type': "POST",
                    'global': false,
                    'dataType': 'json',
                    'url': "/Task/GetDropdownListCol",
                    'data': { 'FormHash': FormHash, "DDQ": DDQ, "Colvals": JSON.stringify(lns) },
                    'success': function (data) {
                    }
                });
                return tmp;
            }();

            return _datasourceDD;

        } catch (e) {

        }
    },
    getCurrentPage: function (DID, index) {
        var pageable;
        var grid;
        if (IsUndefinedOrEmpty(index)) {
            grid = $(".grid[did=" + DID + "]").data("kendoGrid");
            pageable = grid.options.pageable;
        }
        else {
            grid = $(".grid[index=" + index + "]").data("kendoGrid");
            pageable = grid.options.pageable;
        }

        if (pageable != false) {
            return grid.dataSource.page();
        }
        else {
            _pageSize = 1;
            return 1;
        }
    },
    MasterObjectCollectionToXML: function () {
     
        var devam;
        var devamEt = true;
        $(".grid").each(function () {

            var tableIndex = $(this).attr("index");
            var DID = $(this).attr("did");
            var name = $(this).attr("name");
            var ignore = $(this).hasClass("igr");

            var isReq = tableOptions[tableIndex].required;
            var recordSize = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.data().length;

            if (ignore) {
                devam = true;
                var litmObjectCollection = getRelatedObjectCollection(name, tableIndex);
                var litmColumn = JSON.stringify($(".grid[did=" + DID + "]").data("kendoGrid").columns);

                var _aggregates = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregate();

                var litmAggr = null;

                if (_aggregates != undefined)
                    litmAggr = JSON.stringify($(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregate());

                var columnCount = $(this).find("thead[role=rowgroup] tr[role=row] th[role=columnheader]").size();

                var xml_data = function () {
                    var tmp = null;
                    $.ajax({
                        'async': false,
                        'type': "POST",
                        'global': false,
                        'dataType': 'json',
                        'url': "/LineItemTable/SaveLineItemTable",
                        'data': { "masterObjectCollectionJSON": litmObjectCollection, "aggregateDataJSON": litmAggr, "CIID": CIID, "DID": DID },
                        'success': function (response) {

                            if (!response.result) {
                                devam = false;
                                $(".alert-grid[data-id=" + _did + "]").find("span").html(response.error);
                                $(".alert-grid[data-id=" + _did + "]").removeClass("hidden");
                                $(".alert-grid[data-id=" + _did + "]").show();
                            }
                        }
                    });
                    return tmp;
                }();
            } else {
                if (isReq == "True" && recordSize == 0) {
                    $(".alert-grid[data-id=" + DID + "]").find("span").html("Devam etmek için bu tabloya veri giriniz.");
                    $(".alert-grid[data-id=" + DID + "]").removeClass("hidden");
                    $(".alert-grid[data-id=" + DID + "]").show();

                    devam = false;
                    devamEt = false;
                } else {

                    devam = true;
                    var litmObjectCollection = getRelatedObjectCollection(name, tableIndex);
                    var litmColumn = JSON.stringify($(".grid[did=" + DID + "]").data("kendoGrid").columns);

                    var _aggregates = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregate();

                    var litmAggr = null;

                    if (_aggregates != undefined)
                        litmAggr = JSON.stringify($(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregate());

                    var columnCount = $(this).find("thead[role=rowgroup] tr[role=row] th[role=columnheader]").size();

                    var xml_data = function () {
                        var tmp = null;
                        $.ajax({
                            'async': false,
                            'type': "POST",
                            'global': false,
                            'dataType': 'json',
                            'url': "/LineItemTable/SaveLineItemTable",
                            'data': { "masterObjectCollectionJSON": litmObjectCollection, "aggregateDataJSON": litmAggr, "CIID": CIID, "DID": DID },
                            'success': function (response) {

                                if (!response.result) {
                                    devam = false;
                                    $(".alert-grid[data-id=" + _did + "]").find("span").html(response.error);
                                    $(".alert-grid[data-id=" + _did + "]").removeClass("hidden");
                                    $(".alert-grid[data-id=" + _did + "]").show();
                                }
                            }
                        });
                        return tmp;
                    }();

                }
            }

        });

        return devamEt == true ? devam : devamEt;

    },
    setRelatedFields: function (index, tableName, rowIndex, field) {
        var DID = $(".grid[index=" + index + "]").attr("did");
        var currentPage = $.fn.getCurrentPage("", index);
        rowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);

        //var _relData = $.ajax({
        //    'async': false,
        //    'type': "POST",
        //    'global': false,
        //    'dataType': 'json',
        //    'url': "/KendoGrid/setRelatedFields",
        //    'data': { "masterObjectCollection": JSON.stringify(masterObjectCollection[index][tableName][rowIndex]), "field": field, "TIID": TIID },
        //    'success': function (data) {
        //        tmp = data;
        //    }
        //});

        var _relData = $.ajax({
            'async': false,
            'type': "POST",
            'global': false,
            'dataType': 'json',
            'url': "/LineItemTable/SetRelatedFields",
            'data': { "masterObjectCollection": JSON.stringify(masterObjectCollection[index][tableName][rowIndex]), "field": field, "CIID": CIID },
            'success': function (data) {

            }
        });

        if (_relData.responseJSON.result == 1) {
            var masterObjectCollectionRow = _relData.responseJSON.data;
            masterObjectCollection[index][tableName][rowIndex] = masterObjectCollectionRow;

            fixBoolean(masterObjectCollection[index][tableName][rowIndex]);        
            //var lst = [];
            //var lookupList = GetLookup(field, lst);
            $.each(masterObjectCollectionRow, function (i, item) {
                if (item.columnField != field) {
                    WriteToGridCell(DID, rowIndex, item.columnField, item.dataText);
                }
            });
        } else {
            showLITErrorMessage(DID, _relData.responseJSON.errorMsg);
        }
    },
    getGridElement: function (DID, data) {
        if (!IsUndefinedOrEmpty(data)) {
            return $(".grid[did=" + DID + "]").data(data);
        }
        else {
            return $(".grid[did=" + DID + "]");
        }
    },
    initGrid: function (callback) {
       
        var isNew = false;

        $(".grid").each(function () {
         
            var DID = $(this).attr("did");
            var index = $(this).attr("index");
            var tableName = $(this).attr("name");

            //var grid = $.fn.getGridElement(index);

            var isEditable = true;

            if (gEditable && isFormEditable)
                tableOptions[index].readonly == "True" ? isEditable = false : isEditable = true;
            else
                isEditable = false;
            if (!isEditable) {
                $(this).removeClass("dropArea");
            }
            var _toolbar = (isEditable == true) ? [{ name: "my-create", text: AddNew }] : [];
            var _editable = (isEditable == true) ? { confirmation: false, mode: "incell" } : false;
            var _pageable = {
                page: 1, buttonCount: 10, pageSize: _pageSize, change: function (e) {
                    $('.k-grid-content').each(function () {
                        var sizelist = getInitialSize($(this).find("table"));
                        SetTableFrozen($(this).find("table"), 0, sizelist);
                    })
                }
            };

            var say = 0;
            var rowSayac = 0;

            var result = getTableData(CIID, DID, isEditable);
            var tableData = result.data;
            var editPopup = tableData.PopupEdit;
            var _addtoolbar = (tableData.HideAddButton == true) ? [] : _toolbar;
            IsNewLine = tableData.IsNewLine;
            FocusIndex = tableData.FocusIndex;
            if (result.result == 0) {
                showLITErrorMessage(DID, result.errorMsg);
            }

            masterObjectCollection.push(JSON.parse(tableData.MasterObjectCollection));
            masterObjectSchemaCollection.push(JSON.parse(tableData.MasterObjectSchemaCollection));

            //var separators = ['\\+', '\\-', '\\*', '\\/', '\\(', '\\)'];
            //var doubleletters = ["AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AR", "AQ", "AS", "AT", "AU", "AV", "AY", "AZ", "AW", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BR", "BQ", "BS", "BT", "BU", "BV", "BY", "BZ", "BW", "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "CR", "CQ", "CS", "CT", "CU", "CV", "CY", "CZ", "CW", "DA", "DB", "DC", "DD", "DE", "DF", "DG", "DH", "DI", "DJ", "DK", "DL", "DM", "DN", "DO", "DP", "DR", "DQ", "DS", "DT", "DU", "DV", "DY", "DZ"]
            //var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
            //letters = letters.concat(doubleletters);
            //$.each(masterObjectSchemaCollection[index][tableName][0], function (index, item) {
            //    if (item.lookup !== "") {
            //        var myObject = new Object();
            //        myObject.ID = item.columnField;
            //        myObject.formula = item.lookup;
            //        myObject.lookup = item.lookup.split(new RegExp(separators.join('|'), 'g')).filter(Boolean);
            //        formulalist.push(myObject);
            //    }
            //});


            grid = $(this).kendoGrid({
                columnResizeHandleWidth: 6,
                columns: JSON.parse(tableData.Columns),
                dataSource: JSON.parse(tableData.DataSource),

                resizable: false,
                reorderable: false,
                scrollable: true,
                sortable: false,
                toolbar: _addtoolbar,
                editable: _editable,
                navigatable: true,
                pageable: _pageable,
                dataBound: function (e) {
                    $.each($(".grid[did=" + DID + "]").find(".k-footer-template td"), function (i, item) {
                        if ($(item).html() == "" || $(item).html() == "&nbsp;") {
                            $(item).remove();
                        }
                    });

                    $.each($(".grid[did=" + DID + "]").find("th[role=columnheader]"), function (i, item) {
                        $(item).addClass('ellipsisClass');
                    });

                    var columns = e.sender.columns;
                    for (var i = 0; i < columns.length; i++) {
                        var columnType = columns[i].type;
                        switch (columnType) {
                            case "date":
                                {
                                    e.sender.columns[i].template = "#=kendo.toString(parseDate(" + e.sender.columns[i].field + "), '" + e.sender.columns[i].format + "')#";
                                    e.sender.columns[i].editor = function (container, options) {
                                        dateTimeEditor(container, options);
                                    }
                                    break;
                                }
                            case "Dropdown":
                                {
                                    e.sender.columns[i].editor = function (container, options) {
                                        dropDownEditor(container, options);
                                    }
                                    break;
                                }
                            case "PopupSelect":
                                {
                                    e.sender.columns[i].editor = function (container, options, colId, DID) {
                                        popUpSelectEditor(container, options, colId, DID, editPopup);
                                    }
                                    break;
                                }
                            case "number":
                                {
                                    _did = DID;

                                    var aggr = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregate();
                                    if (aggr != undefined) {
                                        var _field = aggr[0].field;
                                        if (e.sender.columns[i].field == _field)
                                            rowaggregates(_field, _did);
                                    }

                                    e.sender.columns[i].editor = function (container, options) {
                                        numericEditor(container, options);
                                    }
                                    break;
                                }
                            case "boolean":
                                {
                                    var data = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.data();
                                    if (data.length > 0) {
                                        var container;
                                        var tableIndex = $(".grid[did=" + DID + "]").attr("index");

                                        var itemSize = $(".grid[did=" + DID + "] tbody").eq(0).find('tr').length;
                                        var name = $(".grid[did=" + DID + "]").attr("name");

                                        for (var j = 0; j < itemSize; j++) {
                                            checkBoxActions(DID, e.container);
                                        }

                                    }
                                    break;
                                }
                            case "Document":
                                {

                                    e.sender.columns[i].editor = function (container, options) {
                                        documentEditor(container, options);
                                    }
                                    break;
                                }
                            case "Barcode":
                                {

                                    e.sender.columns[i].editor = function (container, options) {
                                        barcodeEditor(container, options);
                                    }
                                    break;
                                }

                        }

                    }

                    if (this.dataSource.aggregate()) {
                        var resultRow = this.dataSource.aggregate()[0].field;
                        rowaggregates(resultRow, DID);
                    }


                    rowSayac = rowSayac + 1;


                    //Popupselect clear button in LineItemTable
                    $(document).undelegate(".btnClearTable", "click").delegate(".btnClearTable", "click", function (e) {
                        var field = $(this).attr("name");

                        var DID = $(".grid").attr("did");
                        var rowIndex = $(this).parents("tr").index();
                        var gridId = $(this).parents(".grid").attr("did");
                        var tableIndex = $(this).parents(".grid").attr("index");
                        var columnSize = $(this).parents("tr").find("td[columnid]").size();

                        var name = $(".grid[index=" + tableIndex + "]").attr("name")
                        var tblId = $(this).parents(".grid").attr("id");
                        var targetinput = $(this).parents("tr");
                        var popup = targetinput.find("input[type=text]");
                        var cell = targetinput.find("#" + tblId + "_active_cell");
                        var cellIndex = targetinput.find(".k-edit-cell").index();
                        popup.val("");
                        cell.val("");
                        cell.text("");
                        targetinput.attr('etext', "");

                        setSingleValue(tableIndex, field, rowIndex, "dataValue", "", columnSize, name);
                        setSingleValue(tableIndex, field, rowIndex, "dataText", "", columnSize, name);
                        setSingleValue(tableIndex, field, rowIndex, "itemVal", "", columnSize, name);
                        saveChanges(DID, rowIndex, tableIndex, columnSize, field, cellIndex);
                        WriteToGridCell(DID, rowIndex, field, "");
                        _container = undefined;
                        $(document).undelegate('.popupselectbox .tablebody table tr', 'dblclick');

                    });

                    $(document).undelegate(".k-custom-delete-button", "click").delegate(".k-custom-delete-button", "click", function (e) {
                        
                        var rowIndex = $(this).parents("tr").index();
                        var gridId = $(this).parents(".grid").attr("did");
                        var tableIndex = $(this).parents(".grid").attr("index");
                        var columnSize = $(this).parents("tr").find("td[columnid]").size();

                        $('#deleteModal').attr("data-row", rowIndex);
                        $('#deleteModal').attr("data-did", gridId);
                        $('#deleteModal').attr("tableIndex", tableIndex);
                        $('#deleteModal').attr("col-size", columnSize);
                        
                        $('#deleteModal').modal('show');
                    });

                    $(document).undelegate(".deleteCorfirm", "click").delegate(".deleteCorfirm", "click", function (e) {
                        var rowIndex = $('#deleteModal').attr("data-row");
                        var gridId = $('#deleteModal').attr("data-did");
                        var tableIndex = $('#deleteModal').attr("tableIndex");
                        var columnSize = $('#deleteModal').attr("col-size");
                        var name = $(".grid[index=" + tableIndex + "]").attr("name")

                        var currentPage = $.fn.getCurrentPage("", tableIndex);
                        //var currentRowIndex = parseInt(_pageSize * (currentPage - 1)) + parseInt(rowIndex);
                        //var currentPage = $.fn.getCurrentPage(DID, "");

                        var currentRowIndex = parseInt(rowIndex);
                        if (gPageable == true)
                            currentRowIndex = parseInt(_pageSize * (currentPage - 1)) + parseInt(rowIndex);
                        else {
                            currentRowIndex = parseInt(rowIndex);
                        }

                        deleteSingleRow(tableIndex, currentRowIndex, columnSize, name);
                        $(".grid[did=" + DID + "]").find(".k-auto-scrollable").removeClass("first");
                        $(".grid[did=" + DID + "]").find(".k-auto-scrollable").addClass("first");
                        var leftAmount = $(".grid[did=" + DID + "]").find(".k-grid-content").scrollLeft();
                        $(".grid[did=" + gridId + "]").find(".k-grid-content").scrollLeft(leftAmount - 1);


                        $(".grid[did=" + gridId + "]").data("kendoGrid").removeRow($(".grid[did=" + gridId + "]").find("tbody[role=rowgroup] tr[role=row]:eq(" + rowIndex + ")"));
                        $('.TaskAction').prop("disabled", false);
                        $('#deleteModal').modal('hide');

                        if (currentPage > 1 && rowIndex == 0 && gPageable) {
                            $(".grid[did=" + gridId + "]").data("kendoGrid").dataSource.page(currentPage - 1);
                        }

                        //var currentPage = $(".grid[index=" + tableIndex + "]").data("kendoGrid").dataSource.page();
                        //var currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);



                        try {
                            var grid = $(".grid[index=" + tableIndex + "]").data("kendoGrid");
                            var resultRow = grid.dataSource.aggregate()[0].field;
                            rowaggregates(resultRow, DID);
                        }
                        catch (e) { }

                        $(".grid[did=" + gridId + "]").validateGrid();
                    });

                    modifyCheckbox();

                },
                save: function (e) {



                    _did = DID;

                    var grid = $.fn.getGridElement(DID, "");
                    var kendoGrid = $.fn.getGridElement(DID, "kendoGrid");

                    var cellIndex = e.container.index();
                    var columnSize = e.container.parents("tr").find("td[columnid]").size();

                    var currentColumnId = kendoGrid.columns[cellIndex].field;

                    if (e.container.attr("rtype") == "PopupSelect") {
                        var data = e.container.html();
                    }

                    var columnIndex = -1;
                    $.each(e.sender.columns, function (i, item) {
                        if (e.sender.columns[i].field == currentColumnId) {
                            columnIndex = i;
                        }
                    });

                    var rowIndex = e.container.parents("tr").index();

                    var tableIndex = grid.attr("index");
                    var name = grid.attr("name");

                    var currentPage = $.fn.getCurrentPage("", tableIndex);
                    //var currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
                    var currentRowIndex = parseInt(rowIndex);
                    if (gPageable == true)
                        currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
                    else {
                        currentRowIndex = parseInt(rowIndex);
                    }

                    var _type = getSingleValue(tableIndex, currentColumnId, currentRowIndex, "type", -1, name);
                    var _format = getSingleValue(tableIndex, currentColumnId, currentRowIndex, "format", -1, name);
                    var model = e.model;

                    var columSelect = model._Key + ":" + model._Value + ":" + rowIndex + ":" + cellIndex
                    if (_type == "Dropdown") {
                        if (savechange == columSelect)
                            return;
                    }
                    var dVal = e.values[currentColumnId];
                    var dText = e.values[currentColumnId];

                    if (_type.indexOf("Date") != -1) {
                        if (!IsUndefinedOrEmpty(dVal)) {
                            if (IsUndefinedOrEmpty(_format) == true) {
                                _format = DateFormatNormKendo;
                            }

                            dVal = kendo.toString(new Date(dVal), "MM/dd/yyyy HH:mm:ss")
                            dText = kendo.toString(new Date(dVal), _format)
                        } else {
                            dVal = "";
                            dText = "";
                        }
                    }
                    else if (IsUndefinedOrEmpty(_format) == false) {
                        dText = kendo.toString(dText, _format);
                    }
                    else if (IsUndefinedOrEmpty(_format) == true) {
                        dText = kendo.toString(dText, default_numeric_format);
                    }

                    if (_type == "Dropdown") {
                        dText = e.model["_Key"];
                        dVal = e.model["_Value"];

                        if (dVal == undefined && dText == undefined) {
                            dVal = e.values[e.container.attr("columnid")];
                            dText = e.model[e.container.attr("columnid")];
                        }
                    }

                    if (_type == "Numeric" && (dVal == null || dText == null)) {
                        dText = '';
                        dVal = 0;
                    }

                    var oObject = masterObjectCollection[tableIndex][name][currentRowIndex][cellIndex];
                    oObject.dataValue = dVal;
                    oObject.dataText = dText;

                    $.fn.setRelatedFields(tableIndex, name, rowIndex, currentColumnId);


                    if ($(".grid[did=" + DID + "]").data("kendoGrid").dataSource._aggregate != undefined) {
                        var aggrField = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource._aggregate[0].field;
                        rowaggregates(aggrField, DID);
                    }





                    if (_type == "Dropdown") {
                        savechange = columSelect;
                    }

                    $(".grid[did=" + DID + "]").find("tbody[role='rowgroup'] tr").css({ "background-color": "#FFF" });
                    $(".grid[did=" + DID + "]").find("tbody[role='rowgroup'] tr").find("td[data-role='editable']").attr("style", "");

                    var columnID = e.container.attr("columnid");
                    var colummnValue = e.values[columnID];
                    var required = e.container.attr("nrequired");

                    $('.grid').validateGrid();
                    try {

                        transporter["container"] = e.container;
                        transporter["rowIndex"] = rowIndex;
                        transporter["currentRowIndex"] = currentRowIndex;
                        transporter["columnSize"] = columnSize;
                        transporter["DID"] = DID;
                        calculateFormulaNew(DID, currentRowIndex);
                        $.fn.setRelatedFields(tableIndex, name, rowIndex, currentColumnId);

                    } catch (e) {

                    }
                    //var leftAmount = $(".grid[did=" + DID + "]").find(".k-grid-content").scrollLeft();
                    //SetTableFrozen($(".grid[did=" + DID + "]").find(".k-grid-content").find("table"), leftAmount, sizelist);
                    //$(".grid[did=" + DID + "]").find(".k-grid-content").scrollLeft(leftAmount - 1);


                },
                edit: function (e) {

                    var tableIndex = $(".grid[did=" + DID + "]").attr("index");
                    var name = $(".grid[index=" + tableIndex + "]").attr("name");

                    var formula = $(e.sender.current()).attr("formula");
                    var rType = $(e.sender.current()).attr("rType");

                    var rowIndex = e.container.parents("tr").index();
                    var currentPage = $.fn.getCurrentPage("", tableIndex);
                    //var currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
                    var currentRowIndex = parseInt(rowIndex);
                    if (gPageable == true)
                        currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
                    else {
                        currentRowIndex = parseInt(rowIndex);
                    }

                    $(".grid[did=" + DID + "]").find("tbody[role='rowgroup'] tr").css({ "background-color": "#FFF" });

                    var popupSize = $(".grid[did=" + DID + "]").find(".popupcolselector").size();


                    if (popupSize > 0) {

                        var cellWidth = $(e.container).width();
                        var textInput = $(".grid[did=" + DID + "]").find(".popupcolselector").parent().find("input[type=text]");

                        textInput.width(cellWidth - 43);
                    }

                    $("[data-role=datepicker]").on("focus", function () {
                        try {
                            var validation = getSingleValue(tableIndex, e.container.attr("columnid"), currentRowIndex, "validation", -1, name);
                            var pattern = validation.Pattern;

                            if (!IsUndefinedOrEmpty(pattern)) {
                                $(this).attr("required", "required");
                            }
                        }
                        catch (e) {

                        }
                    });
                    $("[data-role=datepicker]").on("blur", function () {
                        try {

                            var validation = getSingleValue(tableIndex, e.container.attr("columnid"), currentRowIndex, "validation", -1, name);
                            var pattern = validation.Pattern;

                            if (!IsUndefinedOrEmpty(pattern)) {
                                $(this).attr("required", "required");
                            }
                        }
                        catch (e) {

                        }
                    });

                    $("[data-role=numerictextbox]").on("focus", function () {

                        $(this).parents("span").find("input[type=text]").not("[data-role=numerictextbox]").remove();
                        try {
                            var validation = getSingleValue(tableIndex, e.container.attr("columnid"), currentRowIndex, "validation", -1, name);
                            var pattern = validation.Pattern;

                            if (!IsUndefinedOrEmpty(pattern)) {
                                var unescape_pattern = unescape(pattern);
                                $(this).attr("pattern", unescape_pattern);

                            }
                        }

                        catch (e) {
                        }
                    });

                    $("[data-role=numerictextbox]").on("blur", function () {
                        try {

                            var validation = getSingleValue(tableIndex, e.container.attr("columnid"), currentRowIndex, "validation", -1, name);
                            var pattern = validation.Pattern;

                            if (!IsUndefinedOrEmpty(pattern)) {
                                var unescape_pattern = unescape(pattern);
                                $(this).attr("pattern", unescape_pattern);

                            }
                        }

                        catch (e) {
                        }
                    });


                    $("td[data-role='editable'] [type=text]").on("blur", function () {

                        setTimeout(function () { $(".grid[did=" + DID + "]").validateGrid(); }, 100);
                        var isValid = $(".grid[did=" + DID + "]").kendoValidator().data("kendoValidator").validate();

                        if (!isValid) {

                            $('.TaskAction').prop("disabled", true);

                            var errorMessage = getSingleValue(tableIndex, e.container.attr("columnid"), currentRowIndex, "validation", -1, name);

                            var tooltip = $(this).kendoTooltip({
                                content: errorMessage.ValidationMessage,
                                width: 120,
                                autoHide: true,
                                position: "bottom",
                                callout: true
                            }).data("kendoTooltip");

                            $(this).attr("style", "background-color:inherit");

                            tooltip.show($(this));
                            $("div[role=tooltip]").addClass("fa");
                        }
                        else {
                            $('.TaskAction').prop("disabled", false);

                            var popUpSize = $(this).parents("td").find(".popupcolselector").size();

                            if (popupSize < 1)
                                $(this).removeAttr("style");
                        }

                    });


                    var time = setTimeout(function () {
                        var input = e.container.find("input");
                        input.select();

                        clearTimeout(time);
                    }, 0);

                    e.sender.editable.element.parent().css({ "background-color": "#F6F6F6" });
                    sizelist = getInitialSize($(".grid[did=" + DID + "]").find(".k-grid-content").find("table"));

                    var input = e.container.find("input");
                    var cellIndex = e.container.index();
                    if (input.hasClass("barcode")) {

                        input.keydown(function (c) {
                            if (c.ctrlKey) {
                                $("#barcodeModal :input#txtBarcode").val("");
                                $('#barcodeModal').attr("data-didId", DID);
                                $('#barcodeModal').attr("data-ciid", CIID);
                                $('#barcodeModal').attr("data-cell", cellIndex);
                                $('#barcodeModal').attr("data-editable", isEditable);

                                $('#barcodeModal').modal('show');

                            }
                        });
                    }
                }


            });

            setGridBindings(DID);
            savechange = "";

        });

        $(".k-grid-toolbar a").attr("href", "javascript:;");

        if (typeof callback == 'function') {
            callback.call(this);
        }
    },
    initGridSingle: function (grd, result) {

        var isNew = false;


        var DID = $(grd).attr("did");
        var index = $(grd).attr("index");
        var tableName = $(grd).attr("name");

        //var grid = $.fn.getGridElement(index);

        var isEditable = true;

        if (gEditable && isFormEditable)
            tableOptions[index].readonly == "True" ? isEditable = false : isEditable = true;
        else
            isEditable = false;

        var _toolbar = (isEditable == true) ? [{ name: "my-create", text: AddNew }] : [];
        var _editable = (isEditable == true) ? { confirmation: false, mode: "incell" } : false;
        var _pageable = {
            page: 1, buttonCount: 10, pageSize: _pageSize, change: function (e) {
                var kendoGrid = $.fn.getGridElement(DID, "kendoGrid");
                $.each(kendoGrid._data, function (ind, item) {
                    var currentPage = e.index;
                    indx = _pageSize * (currentPage - 1) + ind;
                    calculateFormulaNew(DID, indx);
                    $.fn.setRelatedFields(index, tableName, ind, 0);
                })
            }
        };

        var say = 0;
        var rowSayac = 0;

        //var result = getTableData(CIID, DID, isEditable);
        var tableData = result.data;
        var editPopup = tableData.PopupEdit;
        if (result.result == 0) {
            showLITErrorMessage(DID, result.errorMsg);
        }


        masterObjectCollection[index] = JSON.parse(tableData.MasterObjectCollection);
        masterObjectSchemaCollection[index] = JSON.parse(tableData.MasterObjectSchemaCollection);

        grid = $(grd).kendoGrid({
            columnResizeHandleWidth: 6,
            columns: JSON.parse(tableData.Columns),
            dataSource: JSON.parse(tableData.DataSource),
            resizable: false,
            reorderable: false,
            scrollable: true,
            sortable: false,
            toolbar: _toolbar,
            editable: _editable,
            navigatable: true,
            pageable: _pageable,
            dataBound: function (e) {
                $.each($(".grid[did=" + DID + "]").find(".k-footer-template td"), function (i, item) {
                    if ($(item).html() == "" || $(item).html() == "&nbsp;") {
                        $(item).remove();
                    }
                });

                $.each($(".grid[did=" + DID + "]").find("th[role=columnheader]"), function (i, item) {
                    $(item).addClass('ellipsisClass');
                });

                var columns = e.sender.columns;
                for (var i = 0; i < columns.length; i++) {
                    var columnType = columns[i].type;
                    switch (columnType) {
                        case "date":
                            {
                                e.sender.columns[i].template = "#=kendo.toString(parseDate(" + e.sender.columns[i].field + "), '" + e.sender.columns[i].format + "')#";
                                e.sender.columns[i].editor = function (container, options) {
                                    dateTimeEditor(container, options);
                                }
                                break;
                            }
                        case "Dropdown":
                            {
                                e.sender.columns[i].editor = function (container, options) {
                                    dropDownEditor(container, options);
                                }
                                break;
                            }
                        case "PopupSelect":
                            {
                                e.sender.columns[i].editor = function (container, options, colId, DID) {
                                    popUpSelectEditor(container, options, colId, DID, editPopup);
                                }
                                break;
                            }
                        case "number":
                            {
                                _did = DID;

                                var aggr = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregate();
                                if (aggr != undefined) {
                                    var _field = aggr[0].field;
                                    if (e.sender.columns[i].field == _field)
                                        rowaggregates(_field, _did);
                                }

                                e.sender.columns[i].editor = function (container, options) {
                                    numericEditor(container, options);
                                }
                                break;
                            }
                        case "boolean":
                            {
                                var data = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.data();
                                if (data.length > 0) {
                                    var container;
                                    var tableIndex = $(".grid[did=" + DID + "]").attr("index");

                                    var itemSize = $(".grid[did=" + DID + "] tbody").eq(0).find('tr').length;
                                    var name = $(".grid[did=" + DID + "]").attr("name");

                                    for (var j = 0; j < itemSize; j++) {
                                        checkBoxActions(DID, e.container);
                                    }

                                }
                                break;
                            }
                        case "Document":
                            {
                                e.sender.columns[i].editor = function (container, options) {
                                    documentEditor(container, options);
                                }
                                break;
                            }
                        case "Barcode":
                            {

                                e.sender.columns[i].editor = function (container, options) {
                                    barcodeEditor(container, options);
                                }
                                break;
                            }

                    }

                }

                if (this.dataSource.aggregate()) {
                    var resultRow = this.dataSource.aggregate()[0].field;
                    rowaggregates(resultRow, DID);
                }


                rowSayac = rowSayac + 1;


                //Popupselect clear button in LineItemTable
                $(document).undelegate(".btnClearTable", "click").delegate(".btnClearTable", "click", function (e) {

                    var field = $(this).attr("name");

                    var DID = $(".grid").attr("did");
                    var rowIndex = $(this).parents("tr").index();
                    var gridId = $(this).parents(".grid").attr("did");
                    var tableIndex = $(this).parents(".grid").attr("index");
                    var columnSize = $(this).parents("tr").find("td[columnid]").size();

                    var name = $(".grid[index=" + tableIndex + "]").attr("name")
                    var tblId = $(this).parents(".grid").attr("id");
                    var targetinput = $(this).parents("tr");
                    var popup = targetinput.find("input[type=text]");
                    var cell = targetinput.find("#" + tblId + "_active_cell");
                    var cellIndex = targetinput.find(".k-edit-cell").index();
                    popup.val("");
                    cell.val("");
                    cell.text("");
                    targetinput.attr('etext', "");

                    setSingleValue(tableIndex, field, rowIndex, "dataValue", "", columnSize, name);
                    setSingleValue(tableIndex, field, rowIndex, "dataText", "", columnSize, name);
                    setSingleValue(tableIndex, field, rowIndex, "itemVal", "", columnSize, name);
                    saveChanges(DID, rowIndex, tableIndex, columnSize, field, cellIndex);
                    WriteToGridCell(DID, rowIndex, field, "");
                    _container = undefined;
                    $(document).undelegate('.popupselectbox .tablebody table tr', 'dblclick');

                });

                $(document).undelegate(".k-custom-delete-button", "click").delegate(".k-custom-delete-button", "click", function (e) {
                    
                    var rowIndex = $(this).parents("tr").index();
                    var gridId = $(this).parents(".grid").attr("did");
                    var tableIndex = $(this).parents(".grid").attr("index");
                    var columnSize = $(this).parents("tr").find("td[columnid]").size();

                    $('#deleteModal').attr("data-row", rowIndex);
                    $('#deleteModal').attr("data-did", gridId);
                    $('#deleteModal').attr("tableIndex", tableIndex);
                    $('#deleteModal').attr("col-size", columnSize);
                    
                    $('#deleteModal').modal('show');
                });

                $(document).undelegate(".deleteCorfirm", "click").delegate(".deleteCorfirm", "click", function (e) {
                    var rowIndex = $('#deleteModal').attr("data-row");
                    var gridId = $('#deleteModal').attr("data-did");
                    var tableIndex = $('#deleteModal').attr("tableIndex");
                    var columnSize = $('#deleteModal').attr("col-size");
                    var name = $(".grid[index=" + tableIndex + "]").attr("name")

                    var currentPage = $.fn.getCurrentPage("", tableIndex);
                    //var currentRowIndex = parseInt(_pageSize * (currentPage - 1)) + parseInt(rowIndex);
                    //var currentPage = $.fn.getCurrentPage(DID, "");

                    var currentRowIndex = parseInt(rowIndex);
                    if (gPageable == true)
                        currentRowIndex = parseInt(_pageSize * (currentPage - 1)) + parseInt(rowIndex);
                    else {
                        currentRowIndex = parseInt(rowIndex);
                    }

                    deleteSingleRow(tableIndex, currentRowIndex, columnSize, name);
                    $(".grid[did=" + DID + "]").find(".k-auto-scrollable").removeClass("first");
                    $(".grid[did=" + DID + "]").find(".k-auto-scrollable").addClass("first");
                    var leftAmount = $(".grid[did=" + DID + "]").find(".k-grid-content").scrollLeft();
                    $(".grid[did=" + gridId + "]").find(".k-grid-content").scrollLeft(leftAmount - 1);


                    $(".grid[did=" + gridId + "]").data("kendoGrid").removeRow($(".grid[did=" + gridId + "]").find("tbody[role=rowgroup] tr[role=row]:eq(" + rowIndex + ")"));
                    $('.TaskAction').prop("disabled", false);
                    $('#deleteModal').modal('hide');

                    if (currentPage > 1 && rowIndex == 0 && gPageable) {
                        $(".grid[did=" + gridId + "]").data("kendoGrid").dataSource.page(currentPage - 1);
                    }

                    //var currentPage = $(".grid[index=" + tableIndex + "]").data("kendoGrid").dataSource.page();
                    //var currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);



                    try {
                        var grid = $(".grid[index=" + tableIndex + "]").data("kendoGrid");
                        var resultRow = grid.dataSource.aggregate()[0].field;
                        rowaggregates(resultRow, DID);
                    }
                    catch (e) { }

                    $(".grid[did=" + gridId + "]").validateGrid();
                });

                modifyCheckbox();

            },
            save: function (e) {



                _did = DID;

                var grid = $.fn.getGridElement(DID, "");
                var kendoGrid = $.fn.getGridElement(DID, "kendoGrid");

                var cellIndex = e.container.index();
                var columnSize = e.container.parents("tr").find("td[columnid]").size();

                var currentColumnId = kendoGrid.columns[cellIndex].field;

                if (e.container.attr("rtype") == "PopupSelect") {
                    var data = e.container.html();
                }

                var columnIndex = -1;
                $.each(e.sender.columns, function (i, item) {
                    if (e.sender.columns[i].field == currentColumnId) {
                        columnIndex = i;
                    }
                });

                var rowIndex = e.container.parents("tr").index();

                var tableIndex = grid.attr("index");
                var name = grid.attr("name");

                var currentPage = $.fn.getCurrentPage("", tableIndex);
                //var currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
                var currentRowIndex = parseInt(rowIndex);
                if (gPageable == true)
                    currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
                else {
                    currentRowIndex = parseInt(rowIndex);
                }

                var _type = getSingleValue(tableIndex, currentColumnId, currentRowIndex, "type", -1, name);
                var _format = getSingleValue(tableIndex, currentColumnId, currentRowIndex, "format", -1, name);
                var model = e.model;

                var columSelect = model._Key + ":" + model._Value + ":" + rowIndex + ":" + cellIndex
                if (_type == "Dropdown") {
                    if (savechange == columSelect)
                        return;
                }
                var dVal = e.values[currentColumnId];
                var dText = e.values[currentColumnId];

                if (_type.indexOf("Date") != -1) {
                    if (!IsUndefinedOrEmpty(dVal)) {
                        if (IsUndefinedOrEmpty(_format) == true) {
                            _format = DateFormatNormKendo;
                        }

                        dVal = kendo.toString(new Date(dVal), "MM/dd/yyyy HH:mm:ss")
                        dText = kendo.toString(new Date(dVal), _format)
                    } else {
                        dVal = "";
                        dText = "";
                    }
                }
                else if (IsUndefinedOrEmpty(_format) == false) {
                    dText = kendo.toString(dText, _format);
                }
                else if (IsUndefinedOrEmpty(_format) == true) {
                    dText = kendo.toString(dText, default_numeric_format);
                }

                if (_type == "Dropdown") {
                    dText = e.model["_Key"];
                    dVal = e.model["_Value"];

                    if (dVal == undefined && dText == undefined) {
                        dVal = e.values[e.container.attr("columnid")];
                        dText = e.model[e.container.attr("columnid")];
                    }
                }

                if (_type == "Numeric" && (dVal == null || dText == null)) {
                    dText = '';
                    dVal = 0;
                }

                var oObject = masterObjectCollection[tableIndex][name][currentRowIndex][cellIndex];
                oObject.dataValue = dVal;
                oObject.dataText = dText;

                //$.fn.setRelatedFields(tableIndex, name, rowIndex, currentColumnId);


                if ($(".grid[did=" + DID + "]").data("kendoGrid").dataSource._aggregate != undefined) {
                    var aggrField = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource._aggregate[0].field;
                    rowaggregates(aggrField, DID);
                }





                if (_type == "Dropdown") {
                    savechange = columSelect;
                }

                $(".grid[did=" + DID + "]").find("tbody[role='rowgroup'] tr").css({ "background-color": "#FFF" });
                $(".grid[did=" + DID + "]").find("tbody[role='rowgroup'] tr").find("td[data-role='editable']").attr("style", "");

                var columnID = e.container.attr("columnid");
                var colummnValue = e.values[columnID];
                var required = e.container.attr("nrequired");

                $('.grid').validateGrid();
                try {

                    transporter["container"] = e.container;
                    transporter["rowIndex"] = rowIndex;
                    transporter["currentRowIndex"] = currentRowIndex;
                    transporter["columnSize"] = columnSize;
                    transporter["DID"] = DID;
                    calculateFormulaNew(DID, currentRowIndex);
                    $.fn.setRelatedFields(tableIndex, name, rowIndex, currentColumnId);

                } catch (e) {

                }
                //var leftAmount = $(".grid[did=" + DID + "]").find(".k-grid-content").scrollLeft();
                //SetTableFrozen($(".grid[did=" + DID + "]").find(".k-grid-content").find("table"), leftAmount, sizelist);
                //$(".grid[did=" + DID + "]").find(".k-grid-content").scrollLeft(leftAmount - 1);

            },
            edit: function (e) {

                var tableIndex = $(".grid[did=" + DID + "]").attr("index");
                var name = $(".grid[index=" + tableIndex + "]").attr("name");

                var formula = $(e.sender.current()).attr("formula");
                var rType = $(e.sender.current()).attr("rType");

                var rowIndex = e.container.parents("tr").index();
                var currentPage = $.fn.getCurrentPage("", tableIndex);
                //var currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
                var currentRowIndex = parseInt(rowIndex);
                if (gPageable == true)
                    currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
                else {
                    currentRowIndex = parseInt(rowIndex);
                }

                $(".grid[did=" + DID + "]").find("tbody[role='rowgroup'] tr").css({ "background-color": "#FFF" });

                var popupSize = $(".grid[did=" + DID + "]").find(".popupcolselector").size();


                if (popupSize > 0) {

                    var cellWidth = $(e.container).width();
                    var textInput = $(".grid[did=" + DID + "]").find(".popupcolselector").parent().find("input[type=text]");

                    textInput.width(cellWidth - 43);
                }

                $("[data-role=datepicker]").on("focus", function () {
                    try {
                        var validation = getSingleValue(tableIndex, e.container.attr("columnid"), currentRowIndex, "validation", -1, name);
                        var pattern = validation.Pattern;

                        if (!IsUndefinedOrEmpty(pattern)) {
                            $(this).attr("required", "required");
                        }
                    }
                    catch (e) {

                    }
                });
                $("[data-role=datepicker]").on("blur", function () {
                    try {

                        var validation = getSingleValue(tableIndex, e.container.attr("columnid"), currentRowIndex, "validation", -1, name);
                        var pattern = validation.Pattern;

                        if (!IsUndefinedOrEmpty(pattern)) {
                            $(this).attr("required", "required");
                        }
                    }
                    catch (e) {

                    }
                });

                $("[data-role=numerictextbox]").on("focus", function () {
                    ;
                    $(this).parents("span").find("input[type=text]").not("[data-role=numerictextbox]").remove();
                    try {

                        var validation = getSingleValue(tableIndex, e.container.attr("columnid"), currentRowIndex, "validation", -1, name);
                        var pattern = validation.Pattern;

                        if (!IsUndefinedOrEmpty(pattern)) {
                            $(this).attr("required", "required");
                            $(this).attr("pattern", pattern);
                            $(this).attr("validationmessage", "aaa");
                        }
                    }
                    catch (e) {

                    }
                });

                $("[data-role=numerictextbox]").on("blur", function () {
                    try {

                        var validation = getSingleValue(tableIndex, e.container.attr("columnid"), currentRowIndex, "validation", -1, name);
                        var pattern = validation.Pattern;

                        if (!IsUndefinedOrEmpty(pattern)) {
                            $(this).attr("required", "required");
                            $(this).attr("pattern", pattern);
                            $(this).attr("validationmessage", "aaa");
                        }
                    }
                    catch (e) {
                    }
                });


                $("td[data-role='editable'] [type=text]").on("blur", function () {

                    setTimeout(function () { $(".grid[did=" + DID + "]").validateGrid(); }, 100);
                    var isValid = $(".grid[did=" + DID + "]").kendoValidator().data("kendoValidator").validate();

                    if (!isValid) {

                        $('.TaskAction').prop("disabled", true);

                        var errorMessage = getSingleValue(tableIndex, e.container.attr("columnid"), currentRowIndex, "validation", -1, name);

                        var tooltip = $(this).kendoTooltip({
                            content: errorMessage.ValidationMessage,
                            width: 120,
                            autoHide: true,
                            position: "bottom",
                            callout: true
                        }).data("kendoTooltip");

                        $(this).attr("style", "background-color:inherit");

                        tooltip.show($(this));
                        $("div[role=tooltip]").addClass("fa");
                    }
                    else {
                        $('.TaskAction').prop("disabled", false);

                        var popUpSize = $(this).parents("td").find(".popupcolselector").size();

                        if (popupSize < 1)
                            $(this).removeAttr("style");
                    }

                });


                var time = setTimeout(function () {
                    var input = e.container.find("input");
                    input.select();

                    clearTimeout(time);
                }, 0);

                e.sender.editable.element.parent().css({ "background-color": "#F6F6F6" });
                sizelist = getInitialSize($(".grid[did=" + DID + "]").find(".k-grid-content").find("table"));

                var input = e.container.find("input");
                var cellIndex = e.container.index();
                if (input.hasClass("barcode")) {

                    input.keydown(function (c) {
                        if (c.ctrlKey) {

                            $('#barcodeModal').attr("data-didId", DID);
                            $('#barcodeModal').attr("data-ciid", CIID);
                            $('#barcodeModal').attr("data-cell", cellIndex);
                            $('#barcodeModal').attr("data-editable", isEditable);
                            $("#barcodeModal :input#txtBarcode").val("");
                            $('#barcodeModal').modal('show');

                        }
                    });
                }
            }


        });
        var kendoGrid = $.fn.getGridElement(DID, "kendoGrid");
        $.each(kendoGrid._data, function (ind, item) {
            calculateFormulaNew(DID, ind);
            $.fn.setRelatedFields(index, tableName, ind, 0);
        })
        if ($(".grid[did=" + DID + "]").data("kendoGrid").dataSource._aggregate != undefined) {
            var aggrField = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource._aggregate[0].field;
            rowaggregatesSingle(aggrField, DID);
        }
        setGridBindings(DID);
        savechange = "";


    },
    _getTableName: function () {
        return $(this).attr("name");
    },
    _getGridIndex: function () {
        return $(this).attr("index");
    }

});


function parseDate(d) {
    if (!IsUndefinedOrEmpty(d)) {
        d = new Date(Date.parse(d));
    }
    return !IsUndefinedOrEmpty(d) ? d : "";
}

function FixNumericDotComma(value) {
    var firstCharacter = String(value).substring(0, 1);
    var len = String(value).length;
    var lastCharacter = String(value).substring(len - 1, len);

    if (firstCharacter == "," || firstCharacter == "." || lastCharacter == "," || lastCharacter == ".") {
        value = String(value).replace(/\,/g, ".");
        value = eval(value);

        if (firstCharacter == ",") {
            value = String(value).replace(/\./g, ",");
        }

        return value;
    }
    return value;
}

function IsUndefinedOrEmpty(deger) {
    if (deger == "" || deger == null || deger == undefined) {
        return true;
    }
    else {
        return false;
    }
}

/** MasterObjectColleciton fonksiyonları **/

function cloneEmptyObjectSchemeForNewRow(tableIndex) {

    var name = $(".grid[index=" + tableIndex + "]")._getTableName();
    var masterObjectCollectionRow = JSON.parse(JSON.stringify(masterObjectSchemaCollection[tableIndex][name][0]));
    masterObjectCollection[tableIndex][name].push(masterObjectCollectionRow);
}

function fixBoolean(row) {

    $.each(row, function (i, item) {

        if (item.type == "System.Boolean") {
            var tmpValText = false;
            switch (item.dataValue) {
                case "True":
                    {
                        tmpValText = true;
                        break;
                    }
                case "True":
                    {
                        tmpValText = true;
                        break;
                    }
                case "False":
                    {
                        tmpValText = false;
                        break;
                    }
                case "false":
                    {
                        tmpValText = false;
                        break;
                    }
                default: {
                    tmpValText = item.dataValue;
                    break;
                }
            }
        }
    });

}

function getRelatedObjectCollection(name, index) {
    return JSON.stringify(masterObjectCollection[index][name]);
}

function getSingleValue(index, columnField, rowIndex, field, columnSize, name) {

    rowIndex = parseInt(rowIndex);
    index = parseInt(index);

    var result = undefined;

    $.each(masterObjectCollection[index][name][rowIndex], function (i, item) {
        if (item.columnField == columnField) {
            result = item[field];
        }
    });
    return result;
}

function setSingleValue(index, columnField, rowIndex, field, value, columnSize, name) {

    rowIndex = parseInt(rowIndex);
    index = parseInt(index);

    $.each(masterObjectCollection[index][name][rowIndex], function (i, item) {
        if (item.columnField == columnField) {
            item[field] = value;
        }
    });
}


function deleteSingleRow(index, rowIndex, columnSize, name) {
    masterObjectCollection[index][name].splice(rowIndex, 1);
    if (masterObjectCollection[index][name].length == 0) {
        _container = undefined;
        $(document).undelegate('.popupselectbox .tablebody table tr', 'dblclick');
    }
    setPopupSelectListeners();
}


function registerObject(updatedObject, rowIndex, columnSize, name) {

    var sayac = 0;
    var index = updatedObject.index;

    var field = updatedObject.columnField;

    if (masterObjectCollection[index][name].length > 0) {

        $.each(masterObjectCollection[index][name][rowIndex], function (i, item) {

            if (item.columnField == field) {

                masterObjectCollection[index][name][rowIndex][i] = updatedObject;
                sayac = sayac + 1;
            }

        });

    }

    if (sayac == 0) {
        masterObjectCollection[index][name].push(updatedObject);
    }
}

/* # */

/** Grid Elemenlerine ait fonksiyonlar**/


function calculateFormula(container, rowIndex, currentRowIndex, columnSize, DID) {

    if (container == undefined)
        return false;

    var currentColumnId = container.attr("columnId");

    var currentTr = container.parents("tr");
    var resultRow = currentTr.find("[formula*=" + currentColumnId + "]");

    var resultRowColumnId = resultRow.attr("columnid");

    var evalFormulaList = [];
    $.each(resultRow, function (i, item) {
        evalFormulaList.push($(item).attr("columnid"))
    })

    $.each(evalFormulaList, function (i, item_result_row) {

        var formula = currentTr.find("[columnid=" + item_result_row + "]").attr("formula");
        var evalFormula = formula;
        var name = $(".grid[did=" + DID + "]").attr("name");

        if (evalFormula != undefined) {
            var arrayNumberField = [];

            $.each(currentTr.find("td"), function (i, item) {
                //var columnId = currentTr.find("td[formula]:eq(" + i + ")").attr("columnid");
                var columnId = $(item).attr("columnid");
                var gridIndex = $(".grid[did=" + DID + "]").attr("index");

                if (columnId != undefined) {
                    var cellValue = getSingleValue(gridIndex, columnId, currentRowIndex, "dataValue", columnSize, name);

                    if (cellValue == "") {
                        cellValue = getSingleValue(gridIndex, columnId, currentRowIndex, "dataText", columnSize, name);
                    }

                    if (cellValue == "")
                        cellValue = 0;

                    while (evalFormula.indexOf(columnId) != -1) {
                        var _format = getSingleValue(gridIndex, columnId, currentRowIndex, "format", -1, name);

                        evalFormula = evalFormula.replace(columnId, cellValue);
                    }
                }
            });

            //evalFormula = evalFormula.replace(/\./g, '.');
            evalFormula = evalFormula.replace(/,/g, '.');

            var sonuc = eval(evalFormula);

            if (isNaN(sonuc) || !isFinite(sonuc))
                sonuc = 0;

            if (sonuc != undefined) {
                var colSize = $(".grid[did=" + DID + "]").data("kendoGrid").columns.length;
                var tableIndex = $(".grid[did=" + DID + "]").attr("index");

                setSingleValue(tableIndex, item_result_row, currentRowIndex, "dataValue", sonuc, colSize, name);
                setSingleValue(tableIndex, item_result_row, currentRowIndex, "dataText", sonuc, colSize, name);

                WriteToGridCell(DID, rowIndex, item_result_row, sonuc);

                if ($(".grid[did=" + DID + "]").data("kendoGrid").dataSource._aggregate != undefined) {
                    var aggrField = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource._aggregate[0].field;
                    rowaggregates(aggrField, DID);
                }
            }

            return sonuc;

        }
    });
}

function WriteToGridCell(DID, rowIndex, resultRowColumnId, value) {
    var data = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.data();
    var index = $(".grid[did=" + DID + "]").attr("index");
    var name = $(".grid[did=" + DID + "]").attr("name");
    var dt = data[rowIndex];

    var deger = getSingleValue(index, resultRowColumnId, rowIndex, "dataText", -1, name);
    var format = getSingleValue(index, resultRowColumnId, rowIndex, "format", -1, name);
    var type = getSingleValue(index, resultRowColumnId, rowIndex, "type", -1, name);


    if (type.indexOf("Numeric") != -1) {
        var cellDataValue = getSingleValue(index, resultRowColumnId, rowIndex, "dataValue", -1, name);

        if (!isNaN(parseFloat(cellDataValue))) {
            deger = cellDataValue;

            if (IsUndefinedOrEmpty(format) == true)
                format = default_numeric_format;

            dt[resultRowColumnId] = kendo.toString(parseFloat(deger));
        } else {
            dt[resultRowColumnId] = '';
        }
    }
    else if (type.indexOf("Date") != -1) {
        deger = getSingleValue(index, resultRowColumnId, rowIndex, "dataValue", -1, name);
        if (!IsUndefinedOrEmpty(deger))
            dt[resultRowColumnId] = parseDate(deger);
    }
    else {
        dt[resultRowColumnId] = deger;
    }

    dt.dirty = true;
    $(".grid[did=" + DID + "]").data("kendoGrid")._modelChange({ field: resultRowColumnId, model: dt });

    modifyCheckbox();

    var container = $(".grid[DID=" + DID + "]").find("td[columnId=" + resultRowColumnId + "]");

    var tableIndex = $(".grid[did=" + DID + "]").attr("index");
    var currentPage = $.fn.getCurrentPage("", tableIndex);
    //var currentRowIndex = (_pageSize * (currentPage - 1)) + rowIndex;
    var currentRowIndex = parseInt(rowIndex);
    if (gPageable == true)
        currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
    else {
        currentRowIndex = parseInt(rowIndex);
    }


    var columnSize = $(".grid[index=0]").data("kendoGrid").columns.length - 1;

    //calculateFormula(container, rowIndex, currentRowIndex, columnSize, DID);

    var aggrObject = $(".grid[index=" + index + "]").data("kendoGrid").dataSource._aggregate;

    if (aggrObject != undefined)
        rowaggregates(aggrObject[0].field, DID);

}

function calculateFormulaNew(DID, rowIndex) {
    var grid = $('.grid[did=' + DID + ']');
    var elementName = $(grid).attr('name');
    var gridIndex = $(grid).attr('index');
    var masterObjectCollectionRow = masterObjectCollection[gridIndex][elementName][rowIndex];

    // Find all cells with formula
    var cellsWithFormula = Enumerable.From(masterObjectCollectionRow).Where(function (x) { return x.formula != "" }).ToArray();

    for (var i = 0; i < cellsWithFormula.length; i++) {
        calculateRecursively(cellsWithFormula[i], masterObjectCollectionRow)
    }

}

function calculateRecursively(cell, masterObjectCollectionRow) {
    //var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var separators = ['\\+', '\\-', '\\*', '\\/', '\\(', '\\)'];
    var doubleletters = ["AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AR", "AQ", "AS", "AT", "AU", "AV", "AY", "AZ", "AW", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BR", "BQ", "BS", "BT", "BU", "BV", "BY", "BZ", "BW", "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "CR", "CQ", "CS", "CT", "CU", "CV", "CY", "CZ", "CW", "DA", "DB", "DC", "DD", "DE", "DF", "DG", "DH", "DI", "DJ", "DK", "DL", "DM", "DN", "DO", "DP", "DR", "DQ", "DS", "DT", "DU", "DV", "DY", "DZ"]
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
    letters = letters.concat(doubleletters);
    var formula = cell.formula;
    var formulaArray = cell.formula.split(new RegExp(separators.join('|'), 'g')).filter(Boolean);

    var fieldsArray = Enumerable.From(formulaArray).Intersect(letters).ToArray();


    var arr = [];
    for (var i = 0; i < fieldsArray.length; i++) {
        var subCell = Enumerable.From(masterObjectCollectionRow).Where(function (x) { return x.columnField == fieldsArray[i] }).SingleOrDefault();
        if (!IsUndefinedOrEmpty(subCell.formula)) {
            calculateRecursively(subCell, masterObjectCollectionRow);
        }
        var obj = { "col": subCell.columnField, "val": subCell.dataValue };
        arr.push(obj);
        //formula = replaceAll(formula, subCell.columnField, "(" + subCell.dataValue + ")");
    }
    formula = replaceFormula(arr, formula);
    if (formula.indexOf("()") !== -1) {
        cell.dataValue = "";
    } else {
        cell.dataValue = kendo.parseFloat(kendo.toString(eval(formula), "#.000000000"));
    }

    cell.dataText = kendo.toString(cell.dataValue);


}
function replaceFormula(arr, formula) {
    var ret = arr.sort(function (a, b) { return b.col.length - a.col.length });
    $.each(ret, function (i, item) {
        var reg = new RegExp(escapeRegExp(item.col), 'g');
        var itemVal = "(" + item.val + ")"
        formula = formula.replace(reg, itemVal);
    });
    return formula;
}
function modifyCheckbox() {

    var icHeckElements = $("tbody[role=rowgroup] tr[role=row] .icheck-me");

    icHeckElements.iCheck({ checkboxClass: 'icheckbox_square' });

    icHeckElements.off('ifChanged').on('ifChanged', function () {
        $(this).trigger("change");
    });
}

function GetDropDownItemSelected(columnField, rowIndex, index, columnSize, mode, name) {

    var value = "";
    var text = "";
    $.each(masterObjectCollection[index][name][rowIndex], function (i, item) {
        if (item.columnField == columnField) {
            value = item.dataValue;
            text = item.dataText;
        }
    });

    switch (mode) {
        case "text":
            return text;
            break;
        case "value":
            return value;
            break;
        default:
            return value;
    }
}

function rowaggregates(_field, _didParam) {
    var DID = _didParam;
    var currentColumnId = _field;
    var name = $(".grid[did=" + DID + "]").attr("name");
    var tableIndex = $(".grid[did=" + DID + "]").attr("index");

    var _format = "";
    try {
        _format = getSingleValue(tableIndex, _field, 0, "format", -1, name);
        if (IsUndefinedOrEmpty(_format))
            _format = "";
    } catch (e) {

    }

    try {

        var aggr;
        var aggregates = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates();

        if (aggregates[currentColumnId] != null) {
            if ($(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates()[currentColumnId]["sum"] != undefined) {
                aggr = "sum";
            } else if ($(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates()[currentColumnId]["min"] != undefined) {
                aggr = "min";
            } else if ($(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates()[currentColumnId]["max"] != undefined) {
                aggr = "max";
            } else if ($(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates()[currentColumnId]["count"] != undefined) {
                aggr = "count";
            }
        }
        else {
            $(".grid[did=" + DID + "]").find(".k-footer-template").html("<td style='border-top: none;'></td>");
        }

        var gridIndex = $(".grid[did=" + DID + "]").attr("index");
        var sonuc = 0;
        switch (aggr) {
            case "min":
                {
                    var tempArr = [];

                    $.each(masterObjectCollection[gridIndex][name], function (i, item) {
                        var valueArr = Enumerable.From(masterObjectCollection[gridIndex][name][i])
                            .Where(function (x) { return x.columnField == _field })
                            .Select(function (x) { return (isNaN(parseFloat(x.dataValue))) ? 0 : parseFloat(x.dataValue) })
                            .ToArray();

                        if (!isNaN(valueArr[0])) {
                            tempArr.push(valueArr[0]);
                        }
                    });

                    sonuc = Enumerable.From(tempArr).Min();

                    $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates()[_field][aggr] = sonuc;
                    break;
                }
            case "max":
                {
                    var tempArr = [];

                    $.each(masterObjectCollection[gridIndex][name], function (i, item) {
                        var valueArr = Enumerable.From(masterObjectCollection[gridIndex][name][i])
                            .Where(function (x) { return x.columnField == _field })
                            .Select(function (x) { return (isNaN(parseFloat(x.dataValue))) ? 0 : parseFloat(x.dataValue) })
                            .ToArray();

                        if (!isNaN(valueArr[0])) {
                            tempArr.push(valueArr[0]);
                        }
                    });

                    sonuc = Enumerable.From(tempArr).Max();

                    $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates()[_field][aggr] = sonuc;
                    break;
                }
            case "count":
                {
                    sonuc = masterObjectCollection[gridIndex][name].length;

                    $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates()[_field][aggr] = sonuc;
                    break;
                }
            case "sum":
                {
                    var tempArr = [];

                    $.each(masterObjectCollection[gridIndex][name], function (i, item) {
                        var valueArr = Enumerable.From(masterObjectCollection[gridIndex][name][i])
                            .Where(function (x) { return x.columnField == _field })
                            .Select(function (x) { return x.dataValue })
                            .ToArray();

                        if (!isNaN(valueArr[0]) && !IsUndefinedOrEmpty(valueArr[0])) {
                            tempArr.push(parseFloat(valueArr[0]));
                        }
                    });

                    sonuc = Enumerable.From(tempArr).Sum();

                    $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates()[_field][aggr] = sonuc;
                    break;
                }
        }



        if (isNaN(sonuc) || !isFinite(sonuc))
            sonuc = 0;

        //sonuc = kendo.toString(sonuc, _format)

        if (IsUndefinedOrEmpty(_format)) {
            _format = default_numeric_format;
        }

        sonuc = kendo.toString(sonuc, _format);

        sonuc = FixNumericDotComma(sonuc);

        sonuc = String(sonuc).replace("{", "").replace("}", "");

        ChangeToAltRow(sonuc, DID);
    }
    catch (e) {
        console.log(e);
    }
}

function rowaggregatesSingle(_field, _didParam) {
    var DID = _didParam;
    var currentColumnId = _field;
    var name = $(".grid[did=" + DID + "]").attr("name");
    var tableIndex = $(".grid[did=" + DID + "]").attr("index");

    var _format = "";
    try {
        _format = getSingleValue(tableIndex, _field, 0, "format", -1, name);
        if (IsUndefinedOrEmpty(_format))
            _format = "";
    } catch (e) {

    }

    try {

        var aggr;
        var aggregates = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates();

        if (aggregates[currentColumnId] != null) {
            if ($(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates()[currentColumnId].hasOwnProperty("sum")) {
                aggr = "sum";
            } else if ($(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates()[currentColumnId].hasOwnProperty("min")) {
                aggr = "min";
            } else if ($(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates()[currentColumnId].hasOwnProperty("max")) {
                aggr = "max";
            } else if ($(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates()[currentColumnId].hasOwnProperty("count")) {
                aggr = "count";
            }
        }
        else {
            $(".grid[did=" + DID + "]").find(".k-footer-template").html("<td style='border-top: none;'></td>");
        }

        var gridIndex = $(".grid[did=" + DID + "]").attr("index");
        var sonuc = 0;
        switch (aggr) {
            case "min":
                {
                    var tempArr = [];

                    $.each(masterObjectCollection[gridIndex][name], function (i, item) {
                        var valueArr = Enumerable.From(masterObjectCollection[gridIndex][name][i])
                            .Where(function (x) { return x.columnField == _field })
                            .Select(function (x) { return (isNaN(parseFloat(x.dataValue))) ? 0 : parseFloat(x.dataValue) })
                            .ToArray();

                        if (!isNaN(valueArr[0])) {
                            tempArr.push(valueArr[0]);
                        }
                    });

                    sonuc = Enumerable.From(tempArr).Min();

                    $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates()[_field][aggr] = sonuc;
                    break;
                }
            case "max":
                {
                    var tempArr = [];

                    $.each(masterObjectCollection[gridIndex][name], function (i, item) {
                        var valueArr = Enumerable.From(masterObjectCollection[gridIndex][name][i])
                            .Where(function (x) { return x.columnField == _field })
                            .Select(function (x) { return (isNaN(parseFloat(x.dataValue))) ? 0 : parseFloat(x.dataValue) })
                            .ToArray();

                        if (!isNaN(valueArr[0])) {
                            tempArr.push(valueArr[0]);
                        }
                    });

                    sonuc = Enumerable.From(tempArr).Max();

                    $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates()[_field][aggr] = sonuc;
                    break;
                }
            case "count":
                {
                    sonuc = masterObjectCollection[gridIndex][name].length;

                    $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates()[_field][aggr] = sonuc;
                    break;
                }
            case "sum":
                {
                    var tempArr = [];

                    $.each(masterObjectCollection[gridIndex][name], function (i, item) {
                        var valueArr = Enumerable.From(masterObjectCollection[gridIndex][name][i])
                            .Where(function (x) { return x.columnField == _field })
                            .Select(function (x) { return x.dataValue })
                            .ToArray();

                        if (!isNaN(valueArr[0]) && !IsUndefinedOrEmpty(valueArr[0])) {
                            tempArr.push(parseFloat(valueArr[0]));
                        }
                    });

                    sonuc = Enumerable.From(tempArr).Sum();

                    $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregates()[_field][aggr] = sonuc;
                    break;
                }
        }



        if (isNaN(sonuc) || !isFinite(sonuc))
            sonuc = 0;

        //sonuc = kendo.toString(sonuc, _format)

        if (IsUndefinedOrEmpty(_format)) {
            _format = default_numeric_format;
        }

        sonuc = kendo.toString(sonuc, _format);

        sonuc = FixNumericDotComma(sonuc);

        sonuc = String(sonuc).replace("{", "").replace("}", "");

        ChangeToAltRow(sonuc, DID);
    }
    catch (e) {
        console.log(e);
    }
}

function addNewRowBottom() {
    $(".k-grid-my-create").click();
}

function setGridBindings(did) {
    var grid = $(".grid").data("kendoGrid");

    $(".k-grid-my-create").unbind().on("click", function (e) {

        var DID = $(this).parents(".grid").attr("did");
        $("#alertTable").hide();
        var isValid = $(".grid[did=" + DID + "]").validateGrid();
        if (!isValid) return false;

        grid = $(".grid[did=" + DID + "]").data("kendoGrid");
        var tableIndex = $(this).parents(".grid").attr("index");

        cloneEmptyObjectSchemeForNewRow(tableIndex);

        var kolons = new Object();
        $.each(grid.columns, function (i, item) {

            if (item.field == undefined)
                kolons[""] = "";
            else
                kolons[item.field] = "";
        });

        var dataSource = grid.dataSource;
        var total = dataSource.data().length;
        dataSource.add(kolons);
        dataSource.page(dataSource.totalPages());
        //grid.editRow(grid.tbody.children().last());

        $(".grid[did=" + DID + "]").find(".k-auto-scrollable").removeClass("first");
        $(".grid[did=" + DID + "]").find(".k-auto-scrollable").addClass("first");
        modifyCheckbox();

    });


}

function checkBoxActions(DID, container) {

    $(document).undelegate('input[type=checkbox]', 'change').delegate('input[type=checkbox]', 'change', function () {

        container = $(this).parents("td");

        var columnSize = $(this).parents("tr").find("td[columnid]").size();

        var tableIndex = container.parents(".grid").attr("index");
        var rowIndex = container.parents("tr").index();
        var colId = container.attr("columnid");

        DID = $(this).parents(".grid").attr("did");

        var currentPage = $.fn.getCurrentPage("", tableIndex);
        //var currentRowIndex = (_pageSize * (currentPage - 1)) + rowIndex;
        var currentRowIndex = parseInt(rowIndex);
        if (gPageable == true)
            currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
        else {
            currentRowIndex = parseInt(rowIndex);
        }

        var name = $(".grid[did=" + DID + "]").attr("name");

        setSingleValue(tableIndex, colId, currentRowIndex, "dataValue", $(this).is(":checked"), columnSize, name);
        setSingleValue(tableIndex, colId, currentRowIndex, "dataText", $(this).is(":checked"), columnSize, name);

        var data = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.data();
        var index = $(".grid[did=" + DID + "]").attr("index");
        var name = $(".grid[did=" + DID + "]").attr("name");
        var dt = data[currentRowIndex];
        dt[colId] = getSingleValue(tableIndex, colId, currentRowIndex, "dataValue", -1, name);
        dt.dirty = false;
        $(".grid[did=" + DID + "]").data("kendoGrid")._modelChange({ field: colId, model: dt });

        modifyCheckbox();
    });

}

function setDataSourceCell(DID, rowIndex, columnKey, newValue) {
    var data = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.data();
    var row = data[rowIndex];
    row.dirty = false;
    row[columnKey] = newValue;
    $(".grid[did=" + DID + "]").data("kendoGrid")._modelChange({ field: columnKey, model: row });
}

function GetDataSourceWithPaging(targetPage) {
    DID = $(this).parents(".grid").attr("did");

    _datasource = function () {
        var tmp = null;
        $.ajax({
            'async': false,
            'type': "POST",
            'global': false,
            'dataType': 'json',
            'url': "/LineItemTable/GetTableData",
            'data': { 'mode': 'datasource', "page": targetPage, "pageSize": _pageSize, "CIID": CIID, "DID": DID },
            'success': function (data) {
                tmp = data;
            }
        });
        return tmp;
    }();
}

function ChangeToAltRow(_result, DID) {

    var desc = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource._aggregate[0]["desc"];

    var colspan = $(".grid[did=" + DID + "]").data("kendoGrid").columns.length;

    if (_result == undefined)
        _result = "0";

    var aggregateObject = {
        aggregate: $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregate()[0].aggregate,
        desc: $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregate()[0].desc,
        field: $(".grid[did=" + DID + "]").data("kendoGrid").dataSource.aggregate()[0].field,
        result: _result
    }

    $(".grid[did=" + DID + "]").data("kendoGrid").dataSource._aggregate[0] = aggregateObject;

    if (desc != undefined && desc != "") {
        $(".grid[did=" + DID + "]").find(".k-footer-template").html("<td style='border-top: none;' colspan=" + colspan + ">" + desc + " : " + _result + "</td>");
    }
    else {
        $(".grid[did=" + DID + "]").find(".k-footer-template").html("<td style='border-top: none;' colspan=" + colspan + "></td>");
    }
}

function numericEditor(container, options) {
    $('<input data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            format: options.format,
            spinners: false,
            round: false,
            step: 0
        });
}

function dateTimeEditor(container, options) {

    var format = options.format.toLowerCase();
    if (format.indexOf("d") >= 0 && format.indexOf("h") >= 0) {

        $('<input data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" style="text-align:right;" />')
            .appendTo(container)
            .kendoDateTimePicker({
                value: options.field,
                format: options.format
            });
    }
    else if (format.indexOf("h") >= 0 && format.indexOf("d") <= 0) {

        $('<input data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" style="text-align:right;" />')
            .appendTo(container)
            .kendoTimePicker({
                value: options.field,
                format: options.format
            });
    }
    else {

        $('<input data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" style="text-align:right;" />')
            .appendTo(container)
            .kendoDatePicker({
                value: options.field,
                format: options.format
            });
    }
}


function documentEditor(container, options) {
    var colId = container.attr("columnid");
    var _did = container.parents(".grid").attr("did");
    var rowIndex = container.parents("tr").index();
    var name = $(".grid[did=" + _did + "]").attr("name");
    var tableIndex = $(".grid[did=" + _did + "]").attr("index");
    var val = options.model[colId];
    var url = "#";
    var rowUrl = getSingleValue(tableIndex, colId, rowIndex, "dataValue", -1, name);

    if (val !== "") {

        url = rowUrl
        if (rowUrl.toLowerCase().indexOf("upload") == -1) {
            url = "/Task/ShowDocumentLIT?DOC=" + rowUrl + "&amp;TYPE=V"
        }
        $('<a  href="' + url + '" target="_blank"><div style="float:left"><div >' + val + '</div></div></a><button type="button" class="btnDeleteDoc" style="float:left;border: none;background:none;padding-top: 7px;padding-right: 0;" data-col="' + colId + '" ><i class="icon-remove" ></i></button>').appendTo(container);
    }


    $('<input type="file" id="files" name="files" />')
        .appendTo(container)
        .kendoUpload({
            multiple: false,
            async: {
                saveUrl: '/Task/UploadFileLIT',
                autoUpload: true
            },
            upload: function (e) {
                e.data = { codeID: colId, dId: _did, ciid: CIID, cid: CID, rowId: rowIndex };
            },
            success: function (e) {
                var gridIndex = $(".grid[did=" + _did + "]").attr("index");
                var name = $(".grid[did=" + _did + "]").attr("name");
                var columnField = colId;

                var tableIndex = $(".grid[did=" + _did + "]").attr("index");

                var currentPage = $(".grid[index=" + tableIndex + "]").data("kendoGrid").dataSource.page();
                var currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);

                //var dataVal = window.location.origin + "/Upload/" + CID + "/" + CIID + "/" + _did + "/" + rowIndex +"/" + colId + "/" + e.files[0].name;
                var dataVal = e.response;
                var dataText = e.files[0].name;
                _gridIndex = gridIndex;
                var columnSize = $(".grid[did=" + _did + "]").find("thead[role=rowgroup] tr[role=row] th[role=columnheader]").size();
                var _ddq = getSingleValue(tableIndex, columnField, currentRowIndex, "ddQuery", -1, name);
                var _type = getSingleValue(tableIndex, columnField, currentRowIndex, "type", -1, name);
                var _format = getSingleValue(tableIndex, columnField, currentRowIndex, "format", -1, name);
                var _readonly = getSingleValue(tableIndex, columnField, currentRowIndex, "readonly", -1, name);
                var _validationMessage = getSingleValue(tableIndex, columnField, currentRowIndex, "validationMessage", -1, name);
                var _validation = getSingleValue(tableIndex, columnField, currentRowIndex, "validation", -1, name);
                var _require = getSingleValue(tableIndex, columnField, currentRowIndex, "required", -1, name);
                if (_type != undefined) {
                    var updatedObject = {
                        tableId: _did,
                        columnField: columnField,
                        rowIndex: currentRowIndex,
                        index: tableIndex,
                        dataValue: dataVal,
                        dataText: dataText,
                        formula: "",
                        required: _require,
                        format: _format,
                        ddQuery: _ddq,
                        type: _type,
                        readonly: _readonly,
                        validationMessage: _validationMessage,
                        validation: _validation
                    }

                    registerObject(updatedObject, currentRowIndex, columnSize, name);
                    WriteToGridCell(_did, currentRowIndex, columnField, dataVal);

                    $.fn.setRelatedFields(tableIndex, name, rowIndex, columnField);

                    $(".grid[did=" + _did + "]").data('kendoGrid').dataSource.sync();

                    _container = undefined;
                }


            }

        });

    $(".k-dropzone").find("em").remove();
    $(".k-upload-button").append('<i class="flaticon-file-1"></i>');
    $(".k-upload-button").find("span").remove();
    $(".btnDeleteDoc").click(function () {
        var con = confirm(ConfirmFileDelete);
        if (con)
            setDocumentColumnDelete(_did, colId, rowIndex)
    });


}

function barcodeEditor(container, options) {

    $('<input type="text" data-bind="value:' + options.field + '" class="barcode  k-input k-textbox k-valid"/>')
        .appendTo(container);


}

function setDocumentColumnDelete(_did, colId, rowIndex) {
    var gridIndex = $(".grid[did=" + _did + "]").attr("index");
    var name = $(".grid[did=" + _did + "]").attr("name");
    var columnField = colId;

    var tableIndex = $(".grid[did=" + _did + "]").attr("index");

    var currentPage = $(".grid[index=" + tableIndex + "]").data("kendoGrid").dataSource.page();
    var currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
    var itemVal = $(this).attr("itemVal");
    var dataText = "";
    var dataVal = "";
    _gridIndex = gridIndex;
    var columnSize = $(".grid[did=" + _did + "]").find("thead[role=rowgroup] tr[role=row] th[role=columnheader]").size();
    $(".grid[did=" + _did + "]").data("kendoGrid").dataSource.data()[currentRowIndex][columnField] = dataText;
    var _ddq = getSingleValue(tableIndex, columnField, currentRowIndex, "ddQuery", -1, name);
    var _type = getSingleValue(tableIndex, columnField, currentRowIndex, "type", -1, name);
    var _format = getSingleValue(tableIndex, columnField, currentRowIndex, "format", -1, name);
    var _readonly = getSingleValue(tableIndex, columnField, currentRowIndex, "readonly", -1, name);
    var _validationMessage = getSingleValue(tableIndex, columnField, currentRowIndex, "validationMessage", -1, name);
    var _validation = getSingleValue(tableIndex, columnField, currentRowIndex, "validation", -1, name);
    var _require = getSingleValue(tableIndex, columnField, currentRowIndex, "required", -1, name);
    if (_type != undefined) {
        var updatedObject = {
            tableId: _did,
            columnField: columnField,
            rowIndex: currentRowIndex,
            index: tableIndex,
            dataValue: dataVal,
            dataText: dataText,
            formula: "",
            required: _require,
            format: _format,
            itemVal: itemVal,
            ddQuery: _ddq,
            type: _type,
            readonly: _readonly,
            validationMessage: _validationMessage,
            validation: _validation
        }

        registerObject(updatedObject, currentRowIndex, columnSize, name);
        WriteToGridCell(_did, currentRowIndex, columnField, dataText);

        $.fn.setRelatedFields(tableIndex, name, rowIndex, columnField);

        $(".grid[did=" + _did + "]").data('kendoGrid').dataSource.sync();

        _container = undefined;
    }


}
var temp;

function kTemplate(Key, Value) {

}


function dropDownEditor(container, options) {
    if (container != undefined) {

        var DID = container.parents(".grid").attr("did");

        col = $(".grid[did=" + DID + "]").data("kendoGrid").columns;
        var lns;
        lns = new Array();
        $.each(col, function (i, item) {
            var vc = new VIEWCOL(item.type, item.field, "");
            if (item.command == undefined)
                lns[i] = vc;
        });

        var FormHash = $("#taskform [name='taskhash']").val();
        var DDQ = container.attr("dataddq");


        var rowIndex = container.parents("table tbody tr").index();
        var gridIndex = $(".grid[did=" + DID + "]").attr("index");
        var columnSize = container.parents("tr").find("td[columnid]").size();
        var tableIndex = container.parents(".grid").attr("index");
        var name = $(".grid[did=" + DID + "]").attr("name");

        $('<input id="DD' + options.field + '" data-text-field="Key" data-value-field="Value"  data-bind="value:' + options.field + '" />')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                optionLabel: " ",
                dataValueField: "Value",
                dataTextField: "Key",
                filter: "contains",
                valueTemplate: "#if (Key != 'null' && Key != '')  { # #=Key# # } else { # #=Value# # } #",
                //template :'<a  type="button" class="btn btnClearTable"   href="#" ><i class="icon-remove"></i></a>',
                dataSource: {
                    transport: {
                        read: function (options) {

                            var columnCount = $(".grid[did=" + DID + "] thead tr th[role=columnheader]").size();

                            var currentPage = $.fn.getCurrentPage("", tableIndex);

                            //var currentRowIndex = (_pageSize * (currentPage - 1)) + rowIndex;

                            var currentRowIndex = parseInt(rowIndex);
                            if (gPageable == true)
                                currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
                            else {
                                currentRowIndex = parseInt(rowIndex);
                            }

                            var willSendObj = [];
                            willSendObj.push(masterObjectCollection[gridIndex][name][currentRowIndex]);

                            $.ajax({
                                method: "Post",
                                url: "/Task/GetDropdownListCol",
                                data: { "FormHash": FormHash, "DDQ": DDQ, "Colvals": JSON.stringify(lns), "objectCollection": JSON.stringify(willSendObj), "DID": DID, "rowIndex": currentRowIndex, "columnIndex": container.index() },
                                dataType: "json",
                                success: function (result) {
                                    options.success(result);
                                },
                                error: function (result) {
                                    _did = container.parents(".grid").attr("did");

                                    $(".alert-grid[data-id=" + _did + "]").find("span").html(result.responseText);
                                    $(".alert-grid[data-id=" + _did + "]").removeClass("hidden");
                                    $(".alert-grid[data-id=" + _did + "]").show();
                                }
                            });

                            var b = "";
                        }
                    },
                    schema: {
                        model: {
                            fields: {
                                Value: { type: "int" },
                                Key: { type: "string" }
                            }
                        }
                    }
                },
                open: function (e) {

                },
                dataBound: function (e) {
                    var currentPage = $.fn.getCurrentPage("", tableIndex);

                    var currentRowIndex = parseInt(rowIndex);
                    if (gPageable == true)
                        currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
                    else {
                        currentRowIndex = parseInt(rowIndex);
                    }

                    var returnedValue = GetDropDownItemSelected(options.field, currentRowIndex, gridIndex, columnSize, "value", name);

                    if (returnedValue == "") {
                        returnedValue = GetDropDownItemSelected(options.field, currentRowIndex, gridIndex, columnSize, "text", name);
                        this.text(returnedValue);
                    }
                    else {
                        this.value(returnedValue);
                    }

                    options.model["_Key"] = undefined;
                    options.model["_Value"] = undefined;
                },
                select: function (e) {
                    var dataItem = this.dataItem(e.item.index() + 1);

                    if (dataItem.Key != undefined) {
                        options.model["_Key"] = dataItem.Key;
                        options.model["_Value"] = dataItem.Value;

                        options.model.set(options.field, dataItem.Key);

                    }

                    this.text(dataItem.Key);
                },
                change: function (e) {
                    var dataItem = this.dataItem(e.sender.selectedIndex);
                    if (dataItem.Key != undefined) {
                        options.model["_Key"] = dataItem.Key;
                        options.model["_Value"] = dataItem.Value;

                        options.model.set(options.field, dataItem.Key);

                    }

                    this.text(dataItem.Key);
                }
            });



    }
}

function popUpSelectEditor(container, options, colId, DID, editPopup) {
    try {
        colId = container.attr("columnid");

        var popupEdit = 'readonly="true"';
        if (editPopup === true) {
            popupEdit = 'editpopup =' + editPopup;
        }
    } catch (e) {
        return false;
    }

    _container = container;

    //$('<div class="input-append" height="28px"><input type="text" id="' + colId + '" class="popuptext popupselecttext"  ' + popupEdit + '  name="' + colId + '" autocomplete="off"   style="width: 65px;" /><a  type="button" class="btn btnClearTable" name="' + colId + '"  href="#" ><i class="icon-remove"></i></a><a class="btn" type="button" data-targetinput="' + colId + '" href="#" >...</a><input class="btn popupcolselector" style="min-height:20px" data-targetinput="' + colId + '" readonly="readonly" /></div>')
    //    .appendTo(container);

    //$('<div class="input-append" height="28px"><input style="width: 150px;" type="text" id="' + colId + '" class="popuptext popupselecttext"  ' + popupEdit + '  name="' + colId + '" autocomplete="off" /> <a class="btn popupcolselector" type="button" data-targetinput="' + colId + '" href="#" >...</a></div > ')
    //    .appendTo(container);

    $('<div class="input-group"><input id = "' + colId + '" type = "text" class= "form-control" ' + popupEdit + '  name = "' + colId + '" autocomplete = "off" ><div class="input-group-append"><button class="popupcolselector input-group-text" type="button" data-targetinput="' + colId + '"><i class="flaticon-more-1"></i></button></div></div>')
        .appendTo(container);

    var rowIndex = container.parents("tr").index();
    var gridIndex = $(".grid[did=" + DID + "]").attr("index");

    _gridIndex = gridIndex; //taskdetail.js de tanımlanıyor
    _rowIndex = rowIndex; //taskdetail.js de tanımlanıyor

    if (DID == undefined)
        DID = container.parents(".grid").attr("did");

    _did = DID;
    //  $(_container).find(".popupcolselector").css("z-index", 100);
}

function getTableData(CIID, DID, isEditable) {
    var retVal = "";

    $.ajax({
        'async': false,
        'type': "POST",
        'dataType': 'json',
        'url': "/LineItemTable/GetTableData",
        'data': { "CIID": CIID, "DID": DID, "isEditable": isEditable },
        'success': function (data) {
            retVal = data;
        }
    });

    return retVal;
}

function showLITErrorMessage(DID, errorMsg) {
    //var grid = $(".alert-grid[data-id=" + DID + "]");
    //$(grid).find("span").html(errorMsg);
    //$(grid).removeClass("hidden");
    //$(grid).show();
    toastr.error(errorMsg);
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

(function ($) {
    $.fn.validateGrid = function () {
        var retVal = true;
        var devamEt = true;
        $('.grid-validation-error').remove();
        $('.grid-invalid').remove();


        this.each(function (i, e) {
            var gridName = $(this).attr('name');
            var DID = $(this).attr('did');
            retVal = ValidateGridNew($(this).attr('did'));
            if (retVal === false) {
                var label = $('.control-label[did="' + $(this).attr('did') + '"]');
                label.parent().addClass('grid-validation-error-parent');
                devamEt = false;
            }
        });


        //this.each(function (i, e) {
        //    var gridName = $(this).attr('name');
        //    var DID = $(this).attr('did');

        //    var label = $('.control-label[did="' + DID + '"]');
        //    label.parent().removeClass('grid-validation-error-parent');
        //    $(this).parents('.control-group').find('.help-inline').remove();

        //    $(this).find('td[Nrequired="true"]').each(function (i, e) {
        //        if (IsUndefinedOrEmpty($(this).text()) && $(this).find('input').length == 0 && $(this).css("display") != 'none') {
        //            if ($(this).children('.grid-invalid').length == 0) {
        //                var width = $(this).outerWidth() - 4;
        //                var height = $(this).outerHeight() - 4;
        //                $(this).prepend('<div class="grid-invalid" style="width: ' + width + 'px; height:' + height + 'px;"></div>');
        //            }

        //            $(this).parents('.grid').before('<span for="' + gridName + '" class="help-inline error" style="display:none;"></span>');

        //            if (label.parent().find('.grid-validation-error').length == 0) {
        //                label.parent().addClass('grid-validation-error-parent');
        //                $(label).append('<div class="grid-validation-error">' + EFlang.GridRequiredError + '</div>');
        //            }

        //            retVal = false;
        //        }
        //    });
        //});

        return devamEt == true ? retVal : devamEt;
    }
}(jQuery));

function clearClick(e) {

    var targetinput = $(e).parents("tr");
    var popup = targetinput.find("input[type=text]");
    popup.val("");
    targetinput.attr('etext', "");

}



/**#**/

/** Grid burada başlatılır **/

$(function () {


    if ($(".grid").length == 0)
        return false;

    $(".grid").initGrid(function () {
        $(".k-grid-my-create").find("span").addClass("k-icon k-add");
        $(".k-grid-my-create").addClass("stickybutton");
        $(".k-grid-my-create").attr("data-toggle", "sticky-onscroll");

        var did = $(this).attr("did");

        $(".grid").kendoValidator({
            validate: function (e) {
                console.log(1);
            }
        });
    });


    $(".newBarcode").click(function (e) {


        var barcodeList = $("#barcodeModal :input#txtBarcode").val();
        if (barcodeList) {
            $buttonEl = $(this);
            $(this).attr('disabled', true);

            $buttonEl.attr("oldText", $buttonEl.html());
            $buttonEl.html('<span class="icon-refresh icon-spin"></span> ' + EFlang.PleaseWait);
            var ciid = $('#barcodeModal').attr("data-ciid");
            var cellIndex = $('#barcodeModal').attr("data-cell");
            var gridId = $('#barcodeModal').attr("data-didId");
            var isEditable = $('#barcodeModal').attr("data-editable");

            $.ajax({
                'type': "POST",
                'dataType': 'json',
                'url': "/LineItemTable/BarcodeInsert",
                'data': { "DID": gridId, "Barcode": barcodeList, "CIID": ciid, "cellIndex": cellIndex, "isEditable": isEditable },
                'success': function (data) {

                    var grid = $(".grid[did=" + gridId + "]")
                    $.fn.initGridSingle(grid, data);
                    $buttonEl.find('span').remove();
                    $buttonEl.text($buttonEl.attr("oldText"));
                    $buttonEl.attr('disabled', false);
                    $('#barcodeModal').modal("hide");
                    var grid = $('.grid[did=' + gridId + ']');
                    var elementName = $(grid).attr('name');
                    var gridIndex = $(grid).attr('index');


                    var kendoGrid = $.fn.getGridElement(gridId, "kendoGrid");
      
                    var currentColumnId = kendoGrid.columns[cellIndex].field;

                    var masterObjectCollectionRows = masterObjectCollection[gridIndex][elementName];

                    $.each(masterObjectCollectionRows, function (index, item) {
                        $.fn.setRelatedFields(gridIndex, elementName, index, currentColumnId);
                        //calculateFormulaNew(gridId, index);
                    });
                }
            });
        }

    });
});


function saveChanges(DID, rowIndex, tableIndex, columnSize, field) {
    
    _did = DID;

    var grid = $.fn.getGridElement(DID, "");
    var kendoGrid = $.fn.getGridElement(DID, "kendoGrid");

    var cellIndex = 0;
    var columnSize = columnSize;

    var currentColumnId = kendoGrid.columns[cellIndex].field;




    var columnIndex = 0;


    var rowIndex = rowIndex;

    var tableIndex = tableIndex;
    var name = grid.attr("name");

    var currentPage = $.fn.getCurrentPage("", tableIndex);
    //var currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
    var currentRowIndex = parseInt(rowIndex);
    if (gPageable == true)
        currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
    else {
        currentRowIndex = parseInt(rowIndex);
    }

    var _type = getSingleValue(tableIndex, currentColumnId, currentRowIndex, "type", -1, name);
    var _format = getSingleValue(tableIndex, currentColumnId, currentRowIndex, "format", -1, name);

    var dVal = "";
    var dText = "";


    var oObject = masterObjectCollection[tableIndex][name][currentRowIndex][cellIndex];
    oObject.dataValue = dVal;
    oObject.dataText = dText;

    try {

        transporter["container"] = e.container;
        transporter["rowIndex"] = rowIndex;
        transporter["currentRowIndex"] = currentRowIndex;
        transporter["columnSize"] = columnSize;
        transporter["DID"] = DID;

        calculateFormulaNew(DID, currentRowIndex);

    } catch (e) {

    }

    if ($(".grid[did=" + DID + "]").data("kendoGrid").dataSource._aggregate != undefined) {
        var aggrField = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource._aggregate[0].field;
        rowaggregates(aggrField, DID);
    }

    $.fn.setRelatedFields(tableIndex, name, rowIndex, currentColumnId);

    $(".grid[did=" + DID + "]").find("tbody[role='rowgroup'] tr").css({ "background-color": "#FFF" });
    $(".grid[did=" + DID + "]").find("tbody[role='rowgroup'] tr").find("td[data-role='editable']").attr("style", "");



    $('.grid').validateGrid();
}

function saveChanges(DID, rowIndex, tableIndex, columnSize, field, cellIndex) {
   

    _did = DID;

    var grid = $.fn.getGridElement(DID, "");
    var kendoGrid = $.fn.getGridElement(DID, "kendoGrid");
    var cellIndex = cellIndex;
    var columnSize = columnSize;
    var currentColumnId = kendoGrid.columns[cellIndex].field;
    var rowIndex = rowIndex;
    var tableIndex = tableIndex;
    var name = grid.attr("name");

    var currentPage = $.fn.getCurrentPage("", tableIndex);
    var currentRowIndex = parseInt(rowIndex);
    if (gPageable == true)
        currentRowIndex = (_pageSize * (currentPage - 1)) + parseInt(rowIndex);
    else {
        currentRowIndex = parseInt(rowIndex);
    }

    var _type = getSingleValue(tableIndex, currentColumnId, currentRowIndex, "type", -1, name);
    var _format = getSingleValue(tableIndex, currentColumnId, currentRowIndex, "format", -1, name);

    var dVal = "";
    var dText = "";


    var oObject = masterObjectCollection[tableIndex][name][currentRowIndex][cellIndex];
    oObject.dataValue = dVal;
    oObject.dataText = dText;


    try {

        transporter["container"] = e.container;
        transporter["rowIndex"] = rowIndex;
        transporter["currentRowIndex"] = currentRowIndex;
        transporter["columnSize"] = columnSize;
        transporter["DID"] = DID;

        calculateFormulaNew(DID, currentRowIndex);

    } catch (e) {

    }

    if ($(".grid[did=" + DID + "]").data("kendoGrid").dataSource._aggregate != undefined) {
        var aggrField = $(".grid[did=" + DID + "]").data("kendoGrid").dataSource._aggregate[0].field;
        rowaggregates(aggrField, DID);
    }

    $.fn.setRelatedFields(tableIndex, name, rowIndex, currentColumnId);

    $(".grid[did=" + DID + "]").find("tbody[role='rowgroup'] tr").css({ "background-color": "#FFF" });
    $(".grid[did=" + DID + "]").find("tbody[role='rowgroup'] tr").find("td[data-role='editable']").attr("style", "");
    $('.grid').validateGrid();

}

function ValidateGridNew(DID) {
    var grid = $('.grid[did=' + DID + ']');
    var name = $(grid).attr('name');
    var index = $(grid).attr('index');
    var retVal = true;
    var currentIndex = ($.fn.getCurrentPage("", index) - 1) * 20;


    $.each(masterObjectCollection[index][name], function (i, item) {
        $.each(item, function (j, it) {
            if (it.required === true && it.hidden !== true) {
                if (IsUndefinedOrEmpty(it.dataText)) {
                    var index = i + 1;

                    if (i > currentIndex)
                        index = i + 1 - currentIndex;

                    if (grid.find("tr:eq(" + index + ")").children('.grid-invalid').length == 0) {

                        var row = grid.find("tr:eq(" + index + ")");
                        var width = $(row).find("td:eq(" + j + ")").outerWidth() - 4;
                        var height = $(row).find("td:eq(" + j + ")").outerHeight() - 4;
                        var td = $(row).find("td:eq(" + j + ")");
                        $(td).prepend('<div class="grid-invalid" style="width: ' + width + 'px; height:' + height + 'px;"></div>');


                    }



                    retVal = false;
                }

            }
        });
    });

    return retVal;
}
function OpenRecordHistory(ciid, did) {

        $.ajax({
            type: 'GET',
            dataType: "html",
            cache: false,
            data: {
                CIID: ciid,
                DID: did,
                type: '5',
                partialId: 9
            },
            url: '/Search/DetailByType',
            success: function (data) {
                $('#kt-portlet__content_recordHistory').html('');
                $('#kt-portlet__content_recordHistory').html(data);
                $('#ProcessElementHistory').modal('show');
            }
        });
}
function GetLookup(field, lst) {
    var list = lst;
    $.each(formulalist, function (index, item) {
        if (item.lookup.indexOf(field) != -1) {
            if (list.indexOf(item.ID) == -1) {
                list.push(item.ID);
                list = GetLookup(item.ID, list);
                $.each(item.lookup, function (i, itm) {
                    if (list.indexOf(itm) == -1) {
                        list.push(itm);
                        list = GetLookup(itm, list);
                    }
                });
            }
        }
    });
    return list;
}
