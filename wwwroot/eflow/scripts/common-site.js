var toBinary = function (string) {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
        codeUnits[i] = string.charCodeAt(i);
    }
    return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
};
window.addEventListener("load", function () {
    history.pushState({ modalLayer: true }, "", location.href);
});

window.addEventListener("popstate", function (event) {
    let modalClosed = false;

    if ($('#course_document_modal_preview').hasClass('show')) {
        $('#course_document_modal_preview').modal('hide');
        modalClosed = true;
    }

    if ($('#dash_dms_modal_preview').hasClass('show')) {
        $('#dash_dms_modal_preview').modal('hide');
        modalClosed = true;
    }

    if ($('#dash_modal_document_form_element').hasClass('show')) {
        $('#dash_modal_document_form_element').modal('hide');
        modalClosed = true;
    }

    if ($('#courseMapModal').hasClass('show')) {
        $('#courseMapModal').modal('hide');
        modalClosed = true;

    }
    if (modalClosed) {
        unlockPreviewScroll();
        history.pushState(null, null, location.href);       
    }
});