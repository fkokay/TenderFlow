$(function () {
    var dropdownTriggers = document.querySelectorAll('.suggestions-trigger');
    // progress bar template
    var progressBarTemplate = `
        <div class="d-flex flex-grow-1 align-items-center">
            <div class="progress progress-sm flex-grow-1">
                <div class="progress-bar suggestion-progress" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
            </div>
        </div>`;

    var ntlRobotUrl = window.location.protocol + '//' + window.location.host + '/Img/NTL-Robot.json';
    var loadingTemplate = `
        <div class="loading d-flex flex-column">
            <lottie-player src="`+ ntlRobotUrl + `" background="transparent" loop autoplay style="width: 225; height: 225;"></lottie-player>
        </div>`;
    // insert loading spinner
    function insertLoadingSpinner(dropdownMenu) {
        dropdownMenu.insertAdjacentHTML('afterbegin', loadingTemplate);
    }

    // remove loading spinner
    function removeLoadingSpinner(dropdownMenu) {
        var loadingElement = dropdownMenu.querySelector('.loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    // apply widest user name and apply to all
    function applyFixedUserWidth(dropdownMenu) {
        var suggestedUsers = dropdownMenu.querySelectorAll('.suggested-user');
        let _mmaxWidth = 0;
        suggestedUsers.forEach(user => {
            user.style.width = 'auto';
            var _wwidth = user.offsetWidth;
            if (_wwidth > _mmaxWidth) {
                _mmaxWidth = _wwidth;
            }
        });
        suggestedUsers.forEach(user => {
            user.style.width = (_mmaxWidth + 2) + 'px';
        });
    }

    // insert progress bar template and update
    function insertProgressBarAndUpdate(dropdownMenu, predictAssignmentId, predictReferenceId) {
        var suggestion_inner = $('#suggestion_inner_' + predictAssignmentId);
        var _trainingData = $("[data-did|=" + predictReferenceId + "]").val();        
        try {
            $.ajax({
                type: "GET", url: "/Task/Predict", dataType: "json", async: true,
                data: { 'assignmentDid': predictAssignmentId, 'trainingData': _trainingData },
                success: function (result) {
                    $('#btnPredAssn_' + predictAssignmentId).attr('disabled', false);
                    if (result.IsSuccess) {
                        if (result.Model != null) {
                            var elem = "";
                            for (var i = 0; i < result.Model.length; i++) {
                                elem += `<div class="d-flex suggestion-item" onclick="selectUserFromPredict(${predictAssignmentId},${result.Model[i].UserId})">
                                                    <div class="d-flex suggested-user mr-2">${result.Model[i].UserName}</div>
                                                    <div class="d-flex mr-2 kt-font-bold suggestion-percentage">${result.Model[i].Rate}%</div>
                                                </div>`;
                            }
                            suggestion_inner.html(elem);
                            var suggestionItems = dropdownMenu.querySelectorAll('.suggestion-item');
                            suggestionItems.forEach(item => {
                                // avoid duplicates
                                if (!item.querySelector('.suggestion-progress')) {
                                    item.insertAdjacentHTML('beforeend', progressBarTemplate);
                                }

                                // Update attributes
                                var percentageText = item.querySelector('.suggestion-percentage').innerText.trim();
                                var percentageValue = parseInt(percentageText.replace('%', ''), 10);
                                var progressBar = item.querySelector('.suggestion-progress');

                                if (!isNaN(percentageValue)) {
                                    progressBar.setAttribute('role', 'progressbar');
                                    progressBar.setAttribute('aria-valuenow', percentageValue);
                                    progressBar.style.width = percentageValue + '%';
                                }
                            });

                            applyFixedUserWidth(dropdownMenu);
                        }
                    }
                    else {
                        suggestion_inner.html(`<div style="display: flex; justify-content: center; align-items: center; height: 100%;"><span>${EFlang.DataNotFound}</span></div>`);
                        $('#btnPredAssn_' + predictAssignmentId).attr('disabled', false);
                    }
                    removeLoadingSpinner(dropdownMenu);                   
                },
                error: function (err) {
                    suggestion_inner.html(`<div style="display: flex; justify-content: center; align-items: center; height: 100%;"><span>${EFlang.DataNotFound}</span></div>`);
                    console.log(err);
                    $('#btnPredAssn_' + predictAssignmentId).attr('disabled', false);
                    removeLoadingSpinner(dropdownMenu);                   
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    // reset progress bars and remove the template
    function resetProgressBars(dropdownMenu) {
        var suggestionItems = dropdownMenu.querySelectorAll('.suggestion-item');
        suggestionItems.forEach(item => {
            var progressBarContainer = item.querySelector('.d-flex.flex-grow-1.align-items-center');
            if (progressBarContainer) {
                progressBarContainer.remove();
            }
        });

        var suggestedUsers = dropdownMenu.querySelectorAll('.suggested-user');
        suggestedUsers.forEach(user => {
            user.style.width = '';
        });
    }

    // Observe the dropdown showing and hiding
    dropdownTriggers.forEach(trigger => {
        var dropdownMenu = trigger.nextElementSibling;

        var observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                if (mutation.attributeName === 'class') {
                    var isShown = dropdownMenu.classList.contains('show');
                    if (isShown) {
                        var predAssId = $(dropdownMenu).data('predassid');
                        var predRefId = $(dropdownMenu).data('predrefid');
                        $('#btnPredAssn_' + predAssId).attr('disabled', true);
                        insertLoadingSpinner(dropdownMenu);
                        setTimeout(() => {
                            //removeLoadingSpinner(dropdownMenu);
                            insertProgressBarAndUpdate(dropdownMenu, predAssId, predRefId);
                        }, 2500);
                    } else {
                        resetProgressBars(dropdownMenu);
                    }
                    return;
                }
            });
        });
        observer.observe(dropdownMenu, { attributes: true });
    });
});

function selectUserFromPredict(assingmentId, selectedUserId) {
    $("[data-did|=" + assingmentId + "]").val(selectedUserId).trigger('change');
}
