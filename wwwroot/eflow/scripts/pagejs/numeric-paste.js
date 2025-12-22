$('.numpaste').on('paste', function (event) {
    try {
        var validateNumData = event.originalEvent.clipboardData.getData('Text');

        validateNumData = validateNumData.replaceAllPaste(',', '').replaceAllPaste('.', '').replaceAllPaste('-', '')
            .replaceAllPaste('$', '').replaceAllPaste('TL', '').replaceAllPaste('€', '').replaceAllPaste('₺', '')
            .replaceAllPaste('£', '').replaceAllPaste('¥', '').replaceAllPaste(' ', '');

        if (validateNumData.match(/[^\d]/)) {
            event.preventDefault();
        }
    } catch (e) {

    }
});

String.prototype.replaceAllPaste = function (target, replacement) {
    return this.split(target).join(replacement);
};