var TenderFlow = TenderFlow || {};
TenderFlow.DateFilter = (function () {

    function clearStart() {
        $("#filterStart").val("").trigger("change");
        reloadTableIfExists();
    }

    function clearEnd() {
        $("#filterEnd").val("").trigger("change");
        reloadTableIfExists();
    }

    function clearAll() {
        $("#filterStart, #filterEnd").val("").trigger("change");
        reloadTableIfExists();
    }

    function reloadTableIfExists() {
        if (window.table && $.fn.DataTable.isDataTable('#Table')) {
            table.ajax.reload();
        }
    }

    return {
        clearStart,
        clearEnd,
        clearAll
    };

})();
