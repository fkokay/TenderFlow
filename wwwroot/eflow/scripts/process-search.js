if (window.location.href.indexOf("Partial") > -1) { $("#btnAllAssign").hide(); $("#btnSpesificAssign").hide() }

$('.select2-me-labels').select2({
    templateResult: formatOption,
    templateSelection: formatOption
});

function formatOption(option) {

    if (!option.id) {
        return option.text;
    }
    return $('<span style="font-weight: 600; color: ' + $(option.element).data('color') + '">' + option.text + '</span>');
}