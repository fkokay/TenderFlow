"use strict";

var KTDropzoneDemo =
{
    init: function () {
        Dropzone.options.kDropzoneOne =
            {
                paramName: "file", maxFiles: 1, maxFilesize: 5, addRemoveLinks: !0, accept: function (e, o) { "justinbieber.jpg" == e.name ? o("Naha, you don't.") : o() }
    }
    }
}; KTDropzoneDemo.init();