document.addEventListener('DOMContentLoaded', function () {

    initProfileFilePond('UploadProfileFile', 'HeaderAvatar');
});

function validateAvatarClient() {

    const MAX_BYTES = 2 * 1024 * 1024;
    const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png'];
    const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/pjpeg'];

    const input = document.getElementById('UploadProfileFile');
    const errorEl = document.getElementById('UploadProfileFileError');
    if (errorEl) { errorEl.style.display = 'none'; errorEl.textContent = ''; }

    let file = null;
    const pond = window.FilePond ? FilePond.find(input) : null;
    if (pond && pond.getFiles && pond.getFiles().length) {
        file = pond.getFiles()[0].file || null;
    } else if (input && input.files && input.files.length) {
        file = input.files[0];
    }

    if (!file) return { ok: true };

    if (file.size > MAX_BYTES) {
        const msg = 'Max 2MB.';
        if (errorEl) { errorEl.textContent = msg; errorEl.style.display = 'inline'; }
        return { ok: false, msg };
    }

    const name = (file.name || '').toLowerCase();
    const mime = (file.type || '').toLowerCase();
    const hasAllowedExt = ALLOWED_EXTS.some(ext => name.endsWith(ext));
    const hasAllowedMime = ALLOWED_MIMES.includes(mime);

    if (!hasAllowedExt || !hasAllowedMime) {
        const msg = 'Sadece jpeg, jpg, png';
        if (errorEl) { errorEl.textContent = msg; errorEl.style.display = 'inline'; }
        return { ok: false, msg };
    }

    return { ok: true };
}

function appendInputToForm(inputId, formIds) {

    var container = document.getElementById(inputId);
    if (!container) {
        return null;
    }

    var fileInput = container.querySelector('input[name="UploadProfileFile"]');
    if (!fileInput) {
        return null;
    }
    var targetForm = null;
    for (var i = 0; i < formIds.length; i++) {
        var form = document.getElementById(formIds[i]);
        if (form) {
            targetForm = form;
            break;
        }
    }

    if (!targetForm) {
        return null;
    }

    if (fileInput.getAttribute('form') !== targetForm.id) {
        fileInput.setAttribute('form', targetForm.id);
    } 

    return targetForm;
}

function initProfileFilePond(inputId, headerImgId, extraOptions) {

    var input = document.getElementById(inputId);
    var headerImg = document.getElementById(headerImgId);
    if (!input) return null;

    var existingUrl = input.getAttribute('data-existing-url') || "";

    if (window.FilePond) {

        FilePond.autoDiscover = false;

        var pond = FilePond.create(input, Object.assign({
            storeAsFile: true,
            allowMultiple: false,
            credits: false,
            stylePanelAspectRatio: 1,
            allowFileTypeValidation: true,
            acceptedFileTypes: ['image/jpeg', 'image/jpg', 'image/png'],
            labelFileTypeNotAllowed: EFlang.labelFileTypeNotAllowed,
            fileValidateTypeLabelExpectedTypes: EFlang.labelFileTypeNotAllowed, // hidden
            allowFileSizeValidation: true,
            maxFileSize: '2MB',
            labelMaxFileSizeExceeded: EFlang.labelMaxFileSizeExceeded,
            labelMaxFileSize: 'Maksimum dosya boyutu: {filesize}',
            labelIdle: EFlang.userProfilePhotoBox,
            files: existingUrl ? [{ source: existingUrl, options: { type: 'local' } }] : [],
            server: {
                load: (source, load, error) => {
                    const controller = new AbortController();
                    const url = '/Account/GetProfileImage?file=' + encodeURIComponent(source);
                    fetch(url, { credentials: 'include', signal: controller.signal })
                        .then(res => { if (!res.ok) throw new Error('load ' + res.status); return res.blob(); })
                        .then(load)
                        .catch(error);
                    return { abort: () => controller.abort() };
                }
            }
        }, extraOptions || {}));

        input.addEventListener('FilePond:addfile', function (e) {
            var file = e.detail.file && e.detail.file.file;
            if (!file) return;
            var url = URL.createObjectURL(file);
            headerImg.src = url;
            headerImg.classList.remove('kt-hidden');
        });

        input.addEventListener('FilePond:removefile', function () {
            if (existingUrl) {
                headerImg.src = existingUrl;
            } else {
                headerImg.removeAttribute('src');
                headerImg.classList.add('kt-hidden');
            }
        });

        return pond;
    }
    return null;
}
