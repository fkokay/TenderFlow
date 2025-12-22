document.addEventListener('DOMContentLoaded', function () {
    var userBar = document.querySelector('.kt-header__topbar-item--user');
    if (!userBar) return;

    var topbarWrapper = userBar.querySelector('.kt-header__topbar-wrapper');
    var avatarWrapper = userBar.querySelector('.kt-user-card__avatar');
    var userCard = userBar.querySelector('.kt-user-card');

    var topbarImg = topbarWrapper ? topbarWrapper.querySelector('img') : null;
    var dropdownAvatar = avatarWrapper ? avatarWrapper.querySelector('img') : null;

    var topbarSpan = topbarWrapper ? topbarWrapper.querySelector('.kt-header__topbar-icon') : null;
    var dropdownBadge = userBar.querySelector('.kt-badge--username');

    var userNameSpan = userBar.querySelector('.kt-user-card__name .kt-user__name');

    function computeInitials(name) {
        if (!name) return '';
        var parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return '';
        if (parts.length === 1) {
            var w = parts[0].toUpperCase();
            return (w[0] || '');
        }
        if (parts.length === 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    var initials = computeInitials(userNameSpan && userNameSpan.textContent);

    function hasSrc(img) {
        return !!(img && typeof img.getAttribute === 'function' && img.getAttribute('src') && img.getAttribute('src').trim() !== '');
    }

    function ensureAvatarsSynced() {
        var topHas = hasSrc(topbarImg);
        var dropHas = hasSrc(dropdownAvatar);

        if (topHas && !dropHas && avatarWrapper) {
            if (!dropdownAvatar) {
                dropdownAvatar = document.createElement('img');
                dropdownAvatar.setAttribute('alt', 'Pic');
                avatarWrapper.insertBefore(dropdownAvatar, avatarWrapper.firstChild);
            }
            dropdownAvatar.setAttribute('src', topbarImg.getAttribute('src'));
        } else if (dropHas && !topHas && topbarWrapper) {
            if (!topbarImg) {
                topbarImg = document.createElement('img');
                topbarImg.setAttribute('alt', 'Pic');
                topbarWrapper.insertBefore(topbarImg, topbarWrapper.firstChild);
            }
            topbarImg.setAttribute('src', dropdownAvatar.getAttribute('src'));
        }
    }

    function ensureTopbarInitials() {
        if (hasSrc(topbarImg)) {
            if (topbarSpan && topbarSpan.parentNode) { topbarSpan.parentNode.removeChild(topbarSpan); topbarSpan = null; }
            if (topbarImg) topbarImg.classList.remove('kt-hidden');
            return;
        }
        if (topbarImg) topbarImg.classList.add('kt-hidden');
        if (!topbarSpan || !topbarSpan.isConnected) {
            topbarSpan = document.createElement('span');
            topbarSpan.className = 'kt-header__topbar-icon';
            topbarSpan.textContent = initials;
            topbarWrapper.appendChild(topbarSpan);
        } else {
            topbarSpan.textContent = initials;
        }
    }

    function ensureDropdownInitials() {
        if (hasSrc(dropdownAvatar)) {
            if (dropdownBadge && dropdownBadge.parentNode) { dropdownBadge.parentNode.removeChild(dropdownBadge); dropdownBadge = null; }
            if (dropdownAvatar) dropdownAvatar.classList.remove('kt-hidden');
            updateOverlayVisibility();
            return;
        }
        if (dropdownAvatar) dropdownAvatar.classList.add('kt-hidden');
        if (!dropdownBadge || !dropdownBadge.isConnected) {
            dropdownBadge = document.createElement('span');
            dropdownBadge.className = 'kt-badge kt-badge--username kt-badge--lg kt-badge--rounded';
            dropdownBadge.textContent = initials;
            if (avatarWrapper) avatarWrapper.appendChild(dropdownBadge);
        } else {
            dropdownBadge.textContent = initials;
        }
        updateOverlayVisibility();
    }

    function updateOverlayVisibility() {
        var removeBtn = userBar.querySelector('.js-avatar-remove');
        if (removeBtn) {
            var hasImage = hasSrc(dropdownAvatar) || hasSrc(topbarImg);
            removeBtn.classList.toggle('d-none', !hasImage);
        }
    }

    ensureAvatarsSynced();
    ensureTopbarInitials();
    ensureDropdownInitials();

    window.setAvatarSrc = function setAvatarSrc(src) {
        if (src && typeof src === 'string') {
            if (!topbarImg && topbarWrapper) {
                topbarImg = document.createElement('img');
                topbarImg.setAttribute('alt', 'Pic');
                topbarWrapper.insertBefore(topbarImg, topbarWrapper.firstChild);
            }
            if (!dropdownAvatar && avatarWrapper) {
                dropdownAvatar = document.createElement('img');
                dropdownAvatar.setAttribute('alt', 'Pic');
                avatarWrapper.insertBefore(dropdownAvatar, avatarWrapper.firstChild);
            }
            if (topbarImg) topbarImg.setAttribute('src', src);
            if (dropdownAvatar) dropdownAvatar.setAttribute('src', src);
        }
        ensureTopbarInitials();
        ensureDropdownInitials();
        updateOverlayVisibility();
    };

    window.clearAvatarSrc = function clearAvatarSrc() {
        if (topbarImg) topbarImg.removeAttribute('src');
        if (dropdownAvatar) dropdownAvatar.removeAttribute('src');
        ensureTopbarInitials();
        ensureDropdownInitials();
        updateOverlayVisibility();
    };

    function initInlineAvatarEditor() {
        var editBtn = userBar.querySelector('.js-avatar-edit');
        var triggerEl = editBtn || avatarWrapper;
        if (!triggerEl) return;
        var removeBtnOverlay = userBar.querySelector('.js-avatar-remove');
        var isEditing = false;

        if (editBtn) {
            editBtn.removeAttribute('data-toggle');
            editBtn.removeAttribute('data-target');
        }

        var editorHost;
        var pond;
        var btnSave, btnCancel, btnRemove;
        var cropperBox, cropperImg, cropper;
        var cropperObjectUrl = null;
        var labelUploaded = null;
        var labelAdjust = null;
        var uploadedInfoDiv = null;
        var uploadedNameSpan = null;
        var uploadedSizeSpan = null;
        var lastAvatarBlob = null;
        var lastAvatarName = 'avatar.png';

        function ensureHost() {
            if (!editorHost) {
                editorHost = document.createElement('div');
                editorHost.className = 'avatar-edit-inline d-none';
                labelUploaded = document.createElement('div');
                labelUploaded.className = 'user-avatar-section-text user-avatar-section-text--uploaded d-none';
                labelUploaded.innerHTML = EFlang.loadProfileImage;
                editorHost.appendChild(labelUploaded);
                var input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/png,image/jpeg';
                input.className = 'js-pond-avatar-input';
                editorHost.appendChild(input);


                uploadedInfoDiv = document.createElement('div');
                uploadedInfoDiv.className = 'uploaded-file__info d-none';
                uploadedNameSpan = document.createElement('span');
                uploadedNameSpan.className = 'uploaded-file__name';
                uploadedSizeSpan = document.createElement('span');
                uploadedSizeSpan.className = 'uploaded-file__size';
                uploadedInfoDiv.appendChild(uploadedNameSpan);
                uploadedInfoDiv.appendChild(uploadedSizeSpan);

                var actions = document.createElement('div');
                actions.className = 'avatar-edit-actions';
                actions.setAttribute('role', 'toolbar');
                actions.setAttribute('aria-label', 'Avatar düzenleme');
                btnSave = document.createElement('button');
                btnSave.type = 'button';
                btnSave.className = 'btn btn-info btn-sm btn-icon';
                btnSave.setAttribute('aria-label', EFlang.Save);
                btnSave.setAttribute('title', EFlang.Save);
                btnSave.innerHTML = '<i class="fa fa-save"></i>';
                btnSave.disabled = true;
                btnCancel = document.createElement('button');
                btnCancel.type = 'button';
                btnCancel.className = 'btn btn-warning btn-sm btn-icon';
                btnCancel.setAttribute('aria-label', EFlang.CancelText);
                btnCancel.setAttribute('title', EFlang.CancelText);
                btnCancel.innerHTML = '<i class="fa fa-times"></i>';
                btnRemove = document.createElement('button');
                btnRemove.type = 'button';
                btnRemove.className = 'btn btn-danger btn-sm btn-icon';
                btnRemove.setAttribute('aria-label', EFlang.delete);
                btnRemove.setAttribute('title', EFlang.delete);
                btnRemove.innerHTML = '<i class="fa fa-trash"></i>';
                btnRemove.disabled = true;
                actions.appendChild(btnSave);
                actions.appendChild(btnCancel);
                actions.appendChild(btnRemove);

                editorHost.appendChild(uploadedInfoDiv);

                labelAdjust = document.createElement('div');
                labelAdjust.className = 'user-avatar-section-text user-avatar-section-text--adjust d-none';
                labelAdjust.innerHTML = EFlang.setYourPhoto;
                editorHost.appendChild(labelAdjust);

                cropperBox = document.createElement('div');
                cropperBox.className = 'avatar-cropper';
                cropperImg = document.createElement('img');
                cropperImg.alt = '';
                cropperBox.appendChild(cropperImg);
                editorHost.appendChild(cropperBox);
                editorHost.appendChild(actions);

                if (avatarWrapper) {
                    avatarWrapper.appendChild(editorHost);
                }
            }
            return editorHost;
        }

        function showEditor() {
            var host = ensureHost();
            host.classList.remove('d-none');
            isEditing = true;
            if (userCard) userCard.classList.add('editing-on');

            if (!pond && window.FilePond) {
                try {
                    var input = host.querySelector('.js-pond-avatar-input');
                    pond = window.FilePond.create(input, {
                        stylePanelAspectRatio: 1,
                        allowFileTypeValidation: true,
                        acceptedFileTypes: ['image/jpeg', 'image/jpg', 'image/png'],
                        labelFileTypeNotAllowed: EFlang.labelFileTypeNotAllowed,
                        fileValidateTypeLabelExpectedTypes: EFlang.labelFileTypeNotAllowed, // hidden
                        labelIdle: EFlang.userProfilePhotoBox,
                        allowFileSizeValidation: true,
                        maxFileSize: '2MB',
                        labelMaxFileSizeExceeded: EFlang.labelMaxFileSizeExceeded,
                        labelMaxFileSize: 'Maksimum dosya boyutu: {filesize}' // hidden
                    });

                    pond.on('addfile', function (err) {
                        if (err) return;
                        if (btnSave) btnSave.disabled = false;
                        if (btnRemove) btnRemove.disabled = false;
                        (function () {
                            try {
                                var files = pond.getFiles();
                                if (!files || !files.length) return;
                                var f = files[0];
                                var fileObj = f && (f.file || (f.source && f.source.file));
                                if (!fileObj) return;
                                if (uploadedNameSpan) uploadedNameSpan.textContent = fileObj.name || '';
                                if (uploadedSizeSpan) {
                                    var bytes = fileObj.size || 0;
                                    var units = ['B', 'KB', 'MB', 'GB'];
                                    var i = 0, v = bytes;
                                    while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
                                    uploadedSizeSpan.textContent = ' • ' + (Math.round(v * 10) / 10) + ' ' + units[i];
                                }
                                if (uploadedInfoDiv) uploadedInfoDiv.classList.remove('d-none');
                            } catch (e) { }
                        })();
                        if (window.Cropper && cropperBox && cropperImg) {
                            cropperBox.style.display = 'block';

                            var fileItem = pond.getFiles()[0];
                            var fileObj = fileItem && (fileItem.file || (fileItem.source && fileItem.source.file));
                            if (!fileObj) return;
                            if (cropperObjectUrl) { try { URL.revokeObjectURL(cropperObjectUrl); } catch (_) { } }
                            cropperObjectUrl = URL.createObjectURL(fileObj);
                            cropperImg.src = cropperObjectUrl;

                            if (cropper && typeof cropper.destroy === 'function') cropper.destroy();
                            cropper = new window.Cropper(cropperImg, {
                                aspectRatio: 1,
                                viewMode: 1,
                                dragMode: 'move',
                                autoCropArea: 1,
                                background: false,
                                movable: true,
                                zoomable: true,
                                responsive: true
                            });
                        }
                        if (labelUploaded) labelUploaded.classList.remove('d-none');
                        if (labelAdjust) labelAdjust.classList.remove('d-none');
                    });
                    pond.on('removefile', function () {
                        if (btnSave) btnSave.disabled = true;
                        if (btnRemove) btnRemove.disabled = true;
                        if (cropperBox) cropperBox.style.display = 'none';
                        if (cropper && typeof cropper.destroy === 'function') { cropper.destroy(); cropper = null; }
                        if (cropperObjectUrl) { try { URL.revokeObjectURL(cropperObjectUrl); } catch (_) { } cropperObjectUrl = null; }
                        var inputEl = host.querySelector('.js-pond-avatar-input');
                        var root = inputEl && inputEl.closest('.filepond--root');
                        if (root) root.classList.remove('d-none');
                        if (uploadedInfoDiv) {
                            uploadedInfoDiv.classList.add('d-none');
                            if (uploadedNameSpan) uploadedNameSpan.textContent = '';
                            if (uploadedSizeSpan) uploadedSizeSpan.textContent = '';
                        }
                        if (labelUploaded) labelUploaded.classList.add('d-none');
                        if (labelAdjust) labelAdjust.classList.add('d-none');
                    });

                    if (btnSave) {
                        btnSave.addEventListener('click', function () {
                            var files = pond.getFiles();
                            if (!files.length) { hideEditor(); return; }
                            var fileItem = files[0];

                            if (cropper && cropper.getCroppedCanvas) {
                                var canvas = cropper.getCroppedCanvas({ width: 256, height: 256, imageSmoothingQuality: 'high' });
                                if (!canvas) return;
                                canvas.toBlob(function (blob) {
                                    if (!blob) return;
                                    lastAvatarBlob = blob;
                                    try {
                                        var original = fileItem && (fileItem.file || (fileItem.source && fileItem.source.file));
                                        lastAvatarName = (original && original.name) ? original.name : 'avatar.png';
                                    } catch (e) { lastAvatarName = 'avatar.png'; }
                                    var url = URL.createObjectURL(blob);
                                    window.setAvatarSrc(url);
                                    hideEditor();

                                    uploadProfileFile(blob, lastAvatarName);

                                }, 'image/png', 0.92);
                                return;
                            }
                            function uploadProfileFile(_blob, _lastAvatarName) {
                                if (btnSave) btnSave.disabled = true; // çift tıklama koruması
                                var fd = new FormData();
                                fd.append('UploadProfileFile', _blob, _lastAvatarName || 'avatar.png');

                                fetch('/Account/UploadProfilePhoto', {
                                    method: 'POST',
                                    body: fd,
                                    credentials: 'same-origin'
                                })
                                    .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
                                    .then(function (res) {
                                        if (res && res.success) {
                                            window.setAvatarSrc(res.url);
                                        } else {
                                            console.log((res && res.message) || EFlang.uploadProfilePhotoError);
                                        }
                                    })
                                    .catch(function () {
                                        console.log(EFlang.uploadProfilePhotoError);
                                    })
                                    .finally(function () {
                                        if (btnSave) btnSave.disabled = false;
                                    });
                            }


                            function fallbackUseOriginal() {
                                var original = fileItem && (fileItem.file || (fileItem.source && fileItem.source.file));
                                if (!original) return;
                                lastAvatarBlob = original;
                                try { lastAvatarName = original.name || 'avatar.png'; } catch (e) { lastAvatarName = 'avatar.png'; }
                                var url = URL.createObjectURL(original);
                                window.setAvatarSrc(url);
                                hideEditor();

                                uploadProfileFile(original, lastAvatarName);
                            }

                            try {
                                var prep = pond.prepareFile && pond.prepareFile(fileItem.id);
                                if (prep && typeof prep.then === 'function') {
                                    prep.then(function (output) {
                                        var blob = output && (output instanceof Blob ? output : output.file);
                                        if (!(blob instanceof Blob)) return fallbackUseOriginal();
                                        var url = URL.createObjectURL(blob);
                                        window.setAvatarSrc(url);
                                        hideEditor();
                                        setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
                                    }).catch(function (error) {
                                        console.error('FilePond prepareFile failed:', error);
                                        fallbackUseOriginal();
                                    });
                                } else {
                                    fallbackUseOriginal();
                                }
                            } catch (e) {
                                console.error('FilePond prepareFile exception:', e);
                                fallbackUseOriginal();
                            }
                        });
                    }
                    if (btnCancel) {
                        btnCancel.addEventListener('click', function () {
                            try { pond.removeFiles(); } catch (e) { }
                            hideEditor();
                        });
                    }
                    if (btnRemove) {
                        btnRemove.addEventListener('click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            try { pond.removeFiles(); } catch (e) { }
                        });
                    }
                } catch (e) {
                    setupPlainInput(host.querySelector('.js-pond-avatar-input'));
                }
            } else if (!pond) {
                setupPlainInput(host.querySelector('.js-pond-avatar-input'));
            }
            if (pond && lastAvatarBlob && !pond.getFiles().length) {
                try {
                    var preloadFile = new File([lastAvatarBlob], lastAvatarName || 'avatar.png', { type: lastAvatarBlob.type || 'image/png' });
                    pond.addFile(preloadFile);
                } catch (e) { }
            }
            if (pond && !pond.getFiles().length) {
                try {
                    var existingSrc = (hasSrc(dropdownAvatar) && dropdownAvatar.getAttribute('src')) || (hasSrc(topbarImg) && topbarImg.getAttribute('src'));
                    if (existingSrc && typeof existingSrc === 'string' && !existingSrc.startsWith('data:')) {
                        fetch(existingSrc, { cache: 'no-store' }).then(function (res) {
                            if (!res || !res.ok) return null;
                            return res.blob();
                        }).then(function (blob) {
                            if (!blob) return;
                            var inferredName = (existingSrc.split('/').pop() || 'avatar').split('?')[0] || 'avatar';
                            if (!/\.(png|jpg|jpeg)$/i.test(inferredName)) inferredName += '.png';
                            var f = new File([blob], inferredName, { type: blob.type || 'image/png' });
                            pond.addFile(f);
                        }).catch(function () { });
                    }
                } catch (e) { }
            }
        }

        function hideEditor() {
            if (editorHost) editorHost.classList.add('d-none');
            if (pond) {
                try { pond.removeFiles(); } catch (e) { }
            }
            if (cropper && typeof cropper.destroy === 'function') { cropper.destroy(); cropper = null; }
            if (cropperBox) cropperBox.style.display = 'none';
            if (cropperObjectUrl) { try { URL.revokeObjectURL(cropperObjectUrl); } catch (_) { } cropperObjectUrl = null; }
            var inputEl = editorHost && editorHost.querySelector('.js-pond-avatar-input');
            var root = inputEl && inputEl.closest('.filepond--root');
            if (root) root.classList.remove('d-none');
            if (uploadedInfoDiv) {
                uploadedInfoDiv.classList.add('d-none');
                if (uploadedNameSpan) uploadedNameSpan.textContent = '';
                if (uploadedSizeSpan) uploadedSizeSpan.textContent = '';
            }
            if (labelUploaded) labelUploaded.classList.add('d-none');
            if (labelAdjust) labelAdjust.classList.add('d-none');
            isEditing = false;
            if (userCard) userCard.classList.remove('editing-on');
        }

        function setupPlainInput(input) {
            if (!input) return;
            input.addEventListener('change', function () {
                var file = input.files && input.files[0];
                if (!file) return;
                if (!/^image\/(jpeg|jpg|png)$/i.test(file.type)) {
                    input.value = '';
                    return;
                }
                var url = URL.createObjectURL(file);
                window.setAvatarSrc(url);
                hideEditor();
                setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
            }, { once: true });
        }

        triggerEl.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            showEditor();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && editorHost && !editorHost.classList.contains('d-none')) {
                hideEditor();
            }
        });

        if (removeBtnOverlay) {
            removeBtnOverlay.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                try { if (pond) pond.removeFiles(); } catch (err) { }
                window.clearAvatarSrc();

                fetch('/Account/RemoveProfilePhoto', {
                    method: 'POST',
                    credentials: 'same-origin'
                })
                    .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
                    .then(function (res) {
                        if (!(res && res.success)) {
                            console.log((res && res.message) || EFlang.removeProfilePhotoError);
                        }
                    })
                    .catch(function () { console.log(EFlang.removeProfilePhotoError); });


                lastAvatarBlob = null;
                lastAvatarName = 'avatar.png';
                hideEditor();
            });
        }

        if (window.jQuery) {
            var $ = window.jQuery;
            var $dropdown = $(userBar);
            $dropdown.on('hide.bs.dropdown', function (ev) {
                if (isEditing) {
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                    return false;
                }
            });
        }
    }
    initInlineAvatarEditor();
});