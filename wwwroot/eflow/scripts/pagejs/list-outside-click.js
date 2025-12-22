$(document).on("click", function (event) {

    //except modal div 
    if (!$(event.target).closest('#kt_label_modal').length) {

        var ModalShoved = $('#netoloji-modal').hasClass('show');
        if (!ModalShoved) {
            var isESignModalClick = document.getElementById("task_modal_sign_location") && (document.getElementById("task_modal_sign_location").contains(event.target) || event.target.id === 'eSignTskImg') || (event.target.classList != null && event.target.classList.contains('swal2-container'));
            if ($(event.target).closest("#right-1").length === 0 && event.target.type != "button"
                && $(event.target).closest(".page-link").length === 0 && !isESignModalClick) {

                var openedFormCount = $('.multiple-form[is-open="true"]').size();
                var firstFormOpened = $('#right-1').attr("is-open");
                //console.error($(event.target).attr('class'));
                if (openedFormCount == 1 && firstFormOpened == "true"
                    && $(event.target).hasClass('flaticon-more-1') == false
                    && $(event.target).hasClass('popupselectbox') == false
                    && $(event.target.offsetParent).hasClass("popup-table-bordered") == false
                    && $(event.target.offsetParent).hasClass("pps-modal-content") == false
                    && event.target.type != "document"
                    && event.target.tagName != "TH"
                    && event.target.tagName != "IMG"
                    && $(event.target).hasClass('text-ellipsis500') == false
                    && $(event.target).hasClass('mega') == false
                    && $(event.target).hasClass('dms-modals') == false
                    && $(event.target).hasClass('list-icon') == false
                    && $(event.target).hasClass('list-icon-wrap') == false
                    && $(event.target).hasClass('list-icon-filter') == false
                    && $(event.target).hasClass('fileDel') == false
                    && $(event.target).hasClass('tdDocumentDel') == false
                    && $(event.target).hasClass('fa-times') == false
                    && $(event.target).hasClass('kt-header--fixed') == false
                    && $(event.target).hasClass('tdItemval') == false
                    && $(event.target).hasClass('kt-grid--ver') == false
                    && $(event.target).hasClass('kt-portlet') == false
                    && $(event.target).hasClass('select2-selection__choice__remove') == false
                    && $(event.target).hasClass('thefilter') == false
                    && $(event.target).hasClass('form-control') == false
                    && $(event.target).hasClass('btn') == false
                    && $(event.target).hasClass('select2-search__field') == false
                    && $(event.target).hasClass('select2-search') == false
                    && $(event.target).hasClass('select2-results__group') == false
                    && $(event.target).hasClass('modal-header') == false
                    && $(event.target).hasClass('modal-body') == false
                    && $(event.target).hasClass('modal') == false
                    && $(event.target).hasClass('modal-footer') == false
                    && $(event.target).hasClass('canvasBground') == false
                    && $(event.target).hasClass('qq-upload-cancel') == false
                ) {

                    try {
                        NetolojiFilter.CloseFilterForms();
                    }
                    catch{ }

                    var currentCiid = $("#taskform").attr("ciid");

                    if (true == IsFormDataChanged()) {
                        $("#addlistorcancel").modal('show');
                    }
                    else {

                        $.ajax({
                            url: "/Lists/RemoveDraftRecord",
                            type: "GET",
                            data: { "CIID": currentCiid },
                            cache: false,
                            success: function (d) { }
                        });
                        OutsideClick('right-1');
                    }
                }
            }
        }
    }
});