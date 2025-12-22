'use strict'

// toggle forms, handle SSO countdown, and manage SSO OTP inputs
document.addEventListener('DOMContentLoaded', () => {

    const loginContainer = document.querySelector('.kt-login__container.login-with__email');
    const ssoContainer = document.querySelector('.kt-login__container.sso-login');
    const loginWithSSOTrigger = document.querySelector('#loginWithSSO');
    const digitErrorMsg = document.querySelector('#ssoDigitError');;
    const ssoCounterValue = ssoContainer ? ssoContainer.querySelector('[data-countdown-value]') : null;
    const ssoCounterProgress = ssoContainer ? ssoContainer.querySelector('.circular-counter__progress') : null;
    const ssoDigitWrapper = ssoContainer ? ssoContainer.querySelector('.sso-digit-wrapper') : null;
    const ssoDigitInputs = ssoContainer ? [...ssoContainer.querySelectorAll('.sso-digit-wrapper input')] : [];
    const ssoHiddenInput = ssoContainer ? ssoContainer.querySelector('#ssoCodeValue') : null;
    const ssoSubmitButton = ssoContainer ? ssoContainer.querySelector('#submitSSO') : null;
    const ssoRefreshButton = ssoContainer ? ssoContainer.querySelector('#refreshSSO') : null;
    const ssoTimeoutWarning = ssoContainer ? ssoContainer.querySelector('.sso-timeout-warning') : null;
    const loginLottiePlayer = document.querySelector('.login-lottie-player');
    const toggleAnimationButton = document.querySelector('#pausePlayLoginAnimation');

    const formSwitcher = document.querySelector('.kt-login__form-switcher');
    const ACTIVE_CLASS = 'is-active';
    const LEAVING_CLASS = 'is-leaving';
    const TRANSITION_DURATION = 350;
    const SSO_COUNTDOWN_SECONDS = parseInt(smsTimePeriod);
    const SSO_CIRCLE_RADIUS = 20;
    const SSO_CIRCLE_CIRCUMFERENCE = 2 * Math.PI * SSO_CIRCLE_RADIUS;
    const SSO_COLOR_DEFAULT = '#4c81d1';
    const SSO_COLOR_30 = '#fbb03b';
    const SSO_COLOR_20 = '#f76a4d';
    const SSO_COLOR_10 = '#d80000ff';
    const ANIMATION_COOKIE_KEY = 'eflowAnimationEnabled';
    const ANIMATION_COOKIE_MAX_AGE_DAYS = 30;

    if (ssoCounterProgress) {
        ssoCounterProgress.style.strokeDasharray = SSO_CIRCLE_CIRCUMFERENCE.toFixed(2);
    }
    ssoDigitInputs.forEach((input) => {
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('pattern', '\\d*');
        input.setAttribute('autocomplete', 'one-time-code');
    });

    let activeContainer = formSwitcher.querySelector(`.kt-login__container.${ACTIVE_CLASS}`) || null;
    if (!activeContainer) {
        activeContainer = loginContainer;
        loginContainer.classList.add(ACTIVE_CLASS);
    }

    let ssoCountdownTimer = null;
    let ssoSecondsRemaining = SSO_COUNTDOWN_SECONDS;
    let ssoCountdownExpired = false;

    const clearPendingTimeout = (element) => {
        if (!element || !element.dataset.leaveTimeout) {
            return;
        }
        window.clearTimeout(Number(element.dataset.leaveTimeout));
        delete element.dataset.leaveTimeout;
    };

    const markAsLeaving = (element) => {
        if (!element) {
            return;
        }
        element.classList.remove(ACTIVE_CLASS);
        element.classList.add(LEAVING_CLASS);
        clearPendingTimeout(element);
        const timeoutId = window.setTimeout(() => {
            element.classList.remove(LEAVING_CLASS);
            delete element.dataset.leaveTimeout;
        }, TRANSITION_DURATION);
        element.dataset.leaveTimeout = String(timeoutId);
    };

    const isSsoContainer = (element) => !!ssoContainer && element === ssoContainer;

    const setSsoCountdownColor = (color) => {
        if (ssoCounterProgress) {
            ssoCounterProgress.style.stroke = color;
        }
        if (ssoCounterValue) {
            ssoCounterValue.style.color = color;
        }
    };

    const showSsoTimeoutWarning = () => {
        if (ssoTimeoutWarning) {
            ssoTimeoutWarning.classList.remove('d-none');
            ssoTimeoutWarning.classList.add('d-block');
            digitErrorMsg.classList.add('d-none');
        }
    };

    const hideSsoTimeoutWarning = () => {
        if (ssoDigitWrapper) {
            ssoDigitWrapper.classList.remove('sso-error');
        }
        if (ssoTimeoutWarning) {
            ssoTimeoutWarning.classList.remove('d-block');
            ssoTimeoutWarning.classList.add('d-none');
        }
    };

    const updateSsoSubmitButtonState = () => {
        if (ssoSubmitButton) {
            const hasCompleteCode = Boolean(
                ssoHiddenInput &&
                ssoDigitInputs.length > 0 &&
                ssoHiddenInput.value.length === ssoDigitInputs.length
            );
            const shouldEnable = hasCompleteCode && !ssoCountdownExpired;
            ssoSubmitButton.disabled = !shouldEnable;
        }
        if (ssoRefreshButton) {
            ssoRefreshButton.disabled = !ssoCountdownExpired;
        }
    };

    const triggerShakeAnimation = (element) => {
        if (!element) {
            return;
        }
        element.classList.remove('shake-it');
        element.offsetWidth;
        element.classList.add('shake-it');
        window.setTimeout(() => {
            element.classList.remove('shake-it');
        }, 700);
    };

    const syncSsoHiddenInput = () => {
        if (!ssoHiddenInput) {
            return;
        }
        const digits = ssoDigitInputs
            .map((input) => input.value.replace(/\D/g, '').charAt(0) || '')
            .join('');
        ssoHiddenInput.value = digits;
        updateSsoSubmitButtonState();
    };

    const clearSsoDigits = () => {
        ssoDigitInputs.forEach((input) => {
            input.value = '';
        });
        if (ssoHiddenInput) {
            ssoHiddenInput.value = '';
        }
        updateSsoSubmitButtonState();
    };

    const focusNextInput = (startIndex = 0) => {
        for (let index = startIndex; index < ssoDigitInputs.length; index += 1) {
            if (!ssoDigitInputs[index].value) {
                ssoDigitInputs[index].focus();
                ssoDigitInputs[index].select();
                return;
            }
        }
        const lastInput = ssoDigitInputs[ssoDigitInputs.length - 1];
        if (lastInput) {
            lastInput.focus();
            lastInput.select();
        }
    };

    const focusPreviousInput = (startIndex) => {
        for (let index = startIndex; index >= 0; index -= 1) {
            if (ssoDigitInputs[index]) {
                ssoDigitInputs[index].focus();
                ssoDigitInputs[index].select();
                return;
            }
        }
    };

    const clearDigitsFrom = (startIndex) => {
        for (let index = startIndex; index < ssoDigitInputs.length; index += 1) {
            ssoDigitInputs[index].value = '';
        }
    };

    const fillDigitsFrom = (startIndex, digits) => {
        let pointer = startIndex;
        for (let i = 0; i < digits.length && pointer < ssoDigitInputs.length; i += 1, pointer += 1) {
            ssoDigitInputs[pointer].value = digits.charAt(i);
        }
        return pointer;
    };

    const updateSsoCountdownDisplay = () => {
        if (!ssoCounterValue) {
            return;
        }
        ssoCounterValue.textContent = String(ssoSecondsRemaining).padStart(2, '0');
        if (ssoCounterProgress) {
            const progressFraction = Math.max(0, Math.min(1, ssoSecondsRemaining / SSO_COUNTDOWN_SECONDS));
            const offset = SSO_CIRCLE_CIRCUMFERENCE * (1 - progressFraction);
            ssoCounterProgress.style.strokeDashoffset = offset.toFixed(2);
        }

        let strokeColor = SSO_COLOR_DEFAULT;
        if (ssoSecondsRemaining <= 10) {
            strokeColor = SSO_COLOR_10;
        } else if (ssoSecondsRemaining <= 20) {
            strokeColor = SSO_COLOR_20;
        } else if (ssoSecondsRemaining <= 30) {
            strokeColor = SSO_COLOR_30;
        }
        setSsoCountdownColor(strokeColor);
    };

    const stopSsoCountdown = () => {
        if (ssoCountdownTimer) {
            window.clearInterval(ssoCountdownTimer);
            ssoCountdownTimer = null;
        }
    };

    const resetSsoCountdown = () => {
        ssoCountdownExpired = false;
        ssoSecondsRemaining = SSO_COUNTDOWN_SECONDS;
        setSsoCountdownColor(SSO_COLOR_DEFAULT);
        clearSsoDigits();
        updateSsoCountdownDisplay();
        hideSsoTimeoutWarning();
    };

    const startSsoCountdown = () => {
        if (!ssoContainer || !ssoCounterValue) {
            return;
        }

        stopSsoCountdown();
        resetSsoCountdown();
        const firstInput = ssoDigitInputs[0];
        if (firstInput) {
            firstInput.focus();
        }
        ssoCountdownTimer = window.setInterval(() => {
            ssoSecondsRemaining = Math.max(0, ssoSecondsRemaining - 1);
            updateSsoCountdownDisplay();
            if (ssoSecondsRemaining <= 0) {
                ssoCountdownExpired = true;
                showSsoTimeoutWarning();
                clearSsoDigits();
                updateSsoSubmitButtonState();
                stopSsoCountdown();
                setSsoCountdownColor(SSO_COLOR_DEFAULT);
                if (ssoRefreshButton) {
                    ssoRefreshButton.focus();
                }
                triggerShakeAnimation(ssoRefreshButton);
            }
        }, 1000);
    };

    const handleDigitInput = (event, index) => {
        const digitsOnly = event.target.value.replace(/\D/g, '');
        if (!digitsOnly) {
            event.target.value = '';
            syncSsoHiddenInput();
            return;
        }

        event.target.value = digitsOnly.charAt(0);
        const remaining = digitsOnly.slice(1);
        let nextIndex = index + 1;
        if (remaining) {
            clearDigitsFrom(index + 1);
            nextIndex = fillDigitsFrom(index + 1, remaining);
        }
        syncSsoHiddenInput();
        focusNextInput(nextIndex);
    };

    const handleDigitKeyDown = (event, index) => {
        const { key } = event;

        if (key === 'Backspace') {
            if (event.target.value) {
                event.preventDefault();
                event.target.value = '';
                syncSsoHiddenInput();
                return;
            }
            if (index > 0) {
                event.preventDefault();
                ssoDigitInputs[index - 1].value = '';
                syncSsoHiddenInput();
                focusPreviousInput(index - 1);
            }
            return;
        }

        if (key === 'Delete') {
            event.preventDefault();
            event.target.value = '';
            syncSsoHiddenInput();
            focusNextInput(index);
            return;
        }

        if (key === 'ArrowLeft') {
            if (index > 0) {
                event.preventDefault();
                focusPreviousInput(index - 1);
            }
            return;
        }

        if (key === 'ArrowRight') {
            if (index < ssoDigitInputs.length - 1) {
                event.preventDefault();
                focusNextInput(index + 1);
            }
        }
    };

    const handleDigitPaste = (event, index) => {
        event.preventDefault();
        const clipboard = event.clipboardData || window.clipboardData;
        if (!clipboard) {
            return;
        }
        const digits = (clipboard.getData('text') || '').replace(/\D/g, '');
        if (!digits) {
            return;
        }

        clearDigitsFrom(index);
        const nextIndex = fillDigitsFrom(index, digits);
        syncSsoHiddenInput();
        focusNextInput(nextIndex);
    };

    ssoDigitInputs.forEach((input, index) => {
        input.addEventListener('focus', () => {
            input.select();
        });
        input.addEventListener('input', (event) => handleDigitInput(event, index));
        input.addEventListener('keydown', (event) => handleDigitKeyDown(event, index));
        input.addEventListener('paste', (event) => handleDigitPaste(event, index));
    });

    const activateContainer = (target) => {
        if (!target || target === activeContainer) {
            return;
        }

        target.classList.remove(LEAVING_CLASS);
        target.classList.add(ACTIVE_CLASS);

        if (isSsoContainer(activeContainer)) {
            stopSsoCountdown();
            resetSsoCountdown();
        }

        markAsLeaving(activeContainer);
        activeContainer = target;

        if (isSsoContainer(activeContainer)) {
            startSsoCountdown();
        }
    };

    const showSSOForm = (event) => {
        if (event) {
            event.preventDefault();
        }
        if (ssoContainer) {
            activateContainer(ssoContainer);
        }
    };

    const showLoginForm = (event) => {
        window.location.href = '/Account/Login';
    };

    if (loginWithSSOTrigger && ssoContainer) {
        loginWithSSOTrigger.addEventListener('click', showSSOForm);
    }

    if (ssoRefreshButton) {
        ssoRefreshButton.addEventListener('click', (event) => {
            event.preventDefault();
            hideSsoTimeoutWarning();
            startSsoCountdown();
        });
    }

    const setCookie = (name, value, days) => {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/;SameSite=Lax`;
    };

    const getCookie = (name) => {
        const nameEq = `${encodeURIComponent(name)}=`;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i += 1) {
            const cookie = cookies[i].trim();
            if (cookie.indexOf(nameEq) === 0) {
                return decodeURIComponent(cookie.substring(nameEq.length));
            }
        }
        return '';
    };

    const getAnimationPreference = () => {
        const value = getCookie(ANIMATION_COOKIE_KEY);
        if (value === '') {
            return true;
        }
        return value !== 'false';
    };

    const setAnimationPreference = (enabled) => {
        setCookie(ANIMATION_COOKIE_KEY, enabled ? 'true' : 'false', ANIMATION_COOKIE_MAX_AGE_DAYS);
    };

    let animationEnabled = getAnimationPreference();

    if (loginLottiePlayer) {
        const updateAnimationToggleButton = (isPlaying) => {
            if (!toggleAnimationButton) {
                return;
            }
            if (isPlaying) {
                toggleAnimationButton.title = stopStringVar;
                toggleAnimationButton.innerHTML = '<i class="fa fa-pause"></i> ' + stopStringVar;
            } else {
                toggleAnimationButton.title = playStringVar;
                toggleAnimationButton.innerHTML = '<i class="fa fa-play"></i> ' + playStringVar;
            }
        };

        const applyAnimationPreference = () => {
            animationEnabled = getAnimationPreference();
            if (!loginLottiePlayer) {
                return;
            }
            if (animationEnabled) {
                if (typeof loginLottiePlayer.play === 'function') {
                    loginLottiePlayer.play();
                }
            } else if (typeof loginLottiePlayer.pause === 'function') {
                loginLottiePlayer.pause();
            } else if (typeof loginLottiePlayer.stop === 'function') {
                loginLottiePlayer.stop();
            }
            updateAnimationToggleButton(animationEnabled);
        };

        if (toggleAnimationButton) {
            toggleAnimationButton.addEventListener('click', (event) => {
                event.preventDefault();
                animationEnabled = !animationEnabled;
                setAnimationPreference(animationEnabled);
                applyAnimationPreference();
            });
            updateAnimationToggleButton(animationEnabled);
        }

        loginLottiePlayer.addEventListener('load', applyAnimationPreference, { once: true });
        applyAnimationPreference();
    }

    if (ssoCounterValue) {
        resetSsoCountdown();
    }
    if (ssoContainer && ssoContainer.classList.contains('is-active')) {
        startSsoCountdown();
    } else if (ssoContainer && !loginWithSSOTrigger) {
        startSsoCountdown();
    }
});

function isDoubleClicked(element) {
    if (element.data("isclicked")) return true;
    element.data("isclicked", true);
    setTimeout(function () {
        element.removeData("isclicked");
    }, 3000);
    return false;
}

function setConvertPasswordToEncodedValBinds() {
    var convertedPassword = "";

    $('#Password').on('keyup', function () {
        var password = $('#Password').val();
        convertedPassword = toBinary(password);
    });

    $('#kt_login_signin_submit').on('click', function (e) {
        if (isDoubleClicked($(this))) {
            e.preventDefault();
        }
        var password = $('#Password').val();
        if (convertedPassword == "" && password.trim() != "")
            convertedPassword = toBinary(password);

        $('#PasswordHash').val(convertedPassword);
        $('#Password').val('');
    });
};

var toBinary = function (string) {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
        codeUnits[i] = string.charCodeAt(i);
    }
    return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
};

$(function () {
    setConvertPasswordToEncodedValBinds();
})