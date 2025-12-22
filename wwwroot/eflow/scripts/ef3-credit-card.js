(function ($) {
    const onlyDigits = (v) => (v || '').replace(/\D/g, '');
    const clamp2 = (v) => (v + '').slice(0, 2);
    const clamp2Month = (v, clamp) => {
        if (clamp) {
            return v.length === 1 ? '0' + v : v.slice(0, 2);
        } else {
            return (v + '').slice(0, 2);
        }
    };

    function luhnCheck(num) {
        const s = onlyDigits(num);
        if (!s) return false;
        let sum = 0, shouldDouble = false;
        for (let i = s.length - 1; i >= 0; i--) {
            let digit = parseInt(s.charAt(i), 10);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return sum % 10 === 0;
    }

    function detectBrand(num) {
        const s = onlyDigits(num);
        if (!s) return null;
        if (/^4/.test(s)) return 'visa';
        if (/^(5[1-5]|2(2[2-9]\d|[3-6]\d{2}|7[01]\d|720))/.test(s)) return 'mastercard';
        if (/^3[47]/.test(s)) return 'amex';
        if (/^(6011|65|64[4-9])/.test(s)) return 'discover';
        if (/^(30[0-5]|3095|36|3[89])/.test(s)) return 'dinersclub';
        if (/^35(2[89]|[3-8]\d)/.test(s)) return 'jcb';
        if (/^62/.test(s)) return 'unionpay';
        if (/^9792/.test(s)) return 'troy';
        return null;
    }

    function brandMaxLength(brand) {
        switch (brand) {
            case 'amex': return 15;
            case 'dinersclub': return 14;
            case 'unionpay': return 19;
            case 'jcb': return 16;
            case 'troy': return 16;
            default: return 16;
        }
    }

    function cvvLengthForBrand(brand) {
        return brand === 'amex' ? 4 : 3;
    }

    function formatCardNumberForPreview(num, brand) {
        const s = onlyDigits(num);
        if (!s) return 'XXXX XXXX XXXX XXXX';
        if (brand === 'amex') {
            return s.replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*$/, (_m, g1, g2, g3) => [g1, g2, g3].filter(Boolean).join(' ').trim());
        }
        return s.replace(/(.{4})/g, '$1 ').trim();
    }

    function formatCardNumberInputKeepingCaret(inputEl, brand) {
        const prev = inputEl.value;
        const caret = inputEl.selectionStart;
        const digitsLeft = (prev.slice(0, caret).match(/\d/g) || []).length;
        let raw = (prev.match(/\d/g) || []).join('');
        const maxDigits = brandMaxLength(brand);
        raw = raw.slice(0, maxDigits);

        let formatted = brand === 'amex'
            ? raw.replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*$/, (_m, g1, g2, g3) => [g1, g2, g3].filter(Boolean).join(' ').trim())
            : raw.replace(/(.{4})/g, '$1 ').trim();

        inputEl.value = formatted;

        let digitsSeen = 0, newCaret = formatted.length;
        for (let i = 0; i < formatted.length; i++) {
            if (/\d/.test(formatted[i])) digitsSeen++;
            if (digitsSeen >= digitsLeft) { newCaret = i + 1; break; }
        }
        try { inputEl.setSelectionRange(newCaret, newCaret); } catch (e) { }
    }

    function isFutureOrCurrent(mm, yy) {
        if (!mm || !yy) return false;
        const now = new Date();
        const y2 = now.getFullYear() % 100;
        const m2 = now.getMonth() + 1;
        const m = parseInt(mm, 10);
        const y = parseInt(yy, 10);
        if (!(m >= 1 && m <= 12)) return false;
        return y > y2 || (y === y2 && m >= m2);
    }

    function updateLogo(brand, id) {
        const $logoImg = $(`#ef3CardLogo${id} img`);
        const map = {
            visa: '../Assets/theme/default/dist/default/assets/media/icons/credit-card-logos/logo-visa.svg',
            mastercard: '../Assets/theme/default/dist/default/assets/media/icons/credit-card-logos/logo-mastercard.svg',
            amex: '../Assets/theme/default/dist/default/assets/media/icons/credit-card-logos/logo-amex.svg',
            unionpay: '../Assets/theme/default/dist/default/assets/media/icons/credit-card-logos/logo-unionpay.svg',
            troy: '../Assets/theme/default/dist/default/assets/media/icons/credit-card-logos/logo-troy.svg',
            discover: '../Assets/theme/default/dist/default/assets/media/icons/credit-card-logos/logo-discover.svg',
            dinersclub: '../Assets/theme/default/dist/default/assets/media/icons/credit-card-logos/logo-dinersclub.svg',
            jcb: '../Assets/theme/default/dist/default/assets/media/icons/credit-card-logos/logo-jcb.svg',
            fallback: '../Assets/theme/default/dist/default/assets/media/icons/credit-card-logos/anyothercard.svg'
        };
        const src = map[brand] || map.fallback;
        if ($logoImg.length) $logoImg.attr('src', src);
    }

    window.initCreditCardForm = function (id) {
        const sel = (suffix) => `#${suffix}${id}`;
        const $group = (suffix) => $(sel(suffix)).closest('.ef3-form-group');

        function showError($g, msg) {
            const $input = $g.find('.ef3-input');
            const $msg = $g.find('.ef3-input-error');
            $input.addClass('input-error');
            $msg.text(msg || '').show();
            toggleClearIcon($g);
        }

        function clearError($g) {
            const $input = $g.find('.ef3-input');
            const $msg = $g.find('.ef3-input-error');
            $input.removeClass('input-error');
            $msg.text('').hide();
            toggleClearIcon($g);
        }

        function toggleClearIcon($g) {
            const $input = $g.find('.ef3-input');
            const $red = $g.find('.clear-input-error');
            const $grey = $g.find('.clear-input');
            const hasError = $input.hasClass('input-error');
            const hasValue = ($input.val() || '').length > 0;
            $red.toggle(hasError);
            $grey.toggle(!hasError && hasValue);
        }

        function setPreview() {
            const num = $(sel('cardNumber')).val();
            const name = $(sel('cardName')).val();
            const mm = $(sel('cardExpiryMonth')).val();
            const yy = $(sel('cardExpiryYear')).val();
            const cvv = $(sel('cardCVV')).val();
            const brand = detectBrand(num);

            $(sel('ef3DisplayCardNumber')).text(formatCardNumberForPreview(num, brand));
            $(sel('ef3DisplayCardName')).text((name || '').toLocaleUpperCase('en-US') || creditCardFullName.toLocaleUpperCase('en-US'));
            const expText = (mm && yy) ? `${mm.padStart(2, '0')}/${yy.padStart(2, '0')}` : 'XX/XX';
            $(sel('ef3DisplayCardExpiry')).text(expText);
            $(sel('ef3DisplayCardCVV')).text(cvv || '***');
            updateLogo(brand, id);
            $(sel('cardCVV')).attr('maxlength', cvvLengthForBrand(brand));
        }

        function validateNumber(show = true) {
            const $g = $group('cardNumber');
            const raw = onlyDigits($(sel('cardNumber')).val());
            const brand = detectBrand(raw);
            const need = brandMaxLength(brand);
            const empty = !raw;
            const tooShort = raw.length > 0 && raw.length < need;
            const badLuhn = raw.length >= need && !luhnCheck(raw);
            const valid = !empty && !tooShort && !badLuhn;
            if (!show) return valid;
            if (empty || tooShort) return showError($g, EFlang.MissingCardNumber), false;
            if (badLuhn) return showError($g, EFlang.InvalidCardNumber), false;
            clearError($g); return true;
        }

        function validateName(show = true) {
            const $g = $group('cardName');
            const val = ($(sel('cardName')).val() || '').trim();
            const valid = val.length >= 4;
            if (!show) return valid;
            if (!valid) return showError($g, EFlang.FullNameControlForCreditCard), false;
            clearError($g); return true;
        }

        function validatePayAmount(show = true) {
            const $g = $group('payAmount');
            const val = ($(sel('payAmount')).val() || '').trim();
            const numericValue = parseFloat(val);
            const payvalid = numericValue >= 1;

            if (!show) return payvalid;
            if (!payvalid) return showError($g, EFlang.InvalidAmountFormat), false;
            clearError($g); return true;
        }

        function validateExpiry(show = true, clamp = true) {
            const $gMonth = $group('cardExpiryMonth');
            const $gYear = $group('cardExpiryYear');
            const mm = clamp2Month(onlyDigits($(sel('cardExpiryMonth')).val()), clamp);
            const yy = clamp2(onlyDigits($(sel('cardExpiryYear')).val()));

            $(sel('cardExpiryMonth')).val(mm);
            $(sel('cardExpiryYear')).val(yy);

            const missing = !mm || !yy;
            const m = parseInt(mm, 10);
            const invalidMonth = isNaN(m) || m < 1 || m > 12;
            const past = !missing && !invalidMonth && !isFutureOrCurrent(mm, yy);
            const valid = !missing && !invalidMonth && !past;

            if (!show) return valid;

            if (missing) {
                showError($gMonth, EFlang.MissingExpirationDate);
                showError($gYear, EFlang.MissingExpirationDate);
                return false;
            }
            if (invalidMonth) {
                showError($gMonth, EFlang.InvalidDate);
                showError($gYear, EFlang.InvalidDate);
                return false;
            }
            if (past) {
                showError($gMonth, EFlang.ExpiredDate);
                showError($gYear, EFlang.ExpiredDate);
                return false;
            }

            clearError($gMonth);
            clearError($gYear);
            return true;
        }

        function validateCVV(show = true) {
            const $g = $group('cardCVV');
            const brand = detectBrand($(sel('cardNumber')).val());
            const need = cvvLengthForBrand(brand);
            const raw = onlyDigits($(sel('cardCVV')).val());
            const valid = !!raw && raw.length >= need;
            if (!show) return valid;
            if (!valid) { showError($g, EFlang.MissingCvv); return false; }
            clearError($g); return true;
        }

        function updateSubmitState() {
            const allOk = validateNumber(false) && validateName(false) && validatePayAmount(false) && validateExpiry(false, false) && validateCVV(false);
            $(sel('ef3SubmitBtn')).prop('disabled', !allOk);
        }

        function attachClearHandlers() {
            const handleClear = function (e) {
                e.preventDefault();
                const $group = $(this).closest('.ef3-form-group');
                const $input = $group.find('.ef3-input');
                $input.val('');
                clearError($group);
                setPreview();
                updateSubmitState();
                $input.trigger('focus');
            };
            $(`${sel('dvCreditCard')} .clear-input-error`).off('click').on('click', handleClear);
            $(`${sel('dvCreditCard')} .clear-input`).off('click').on('click', handleClear);
        }

        function restrictNumericInputs() {
            $(sel('cardExpiryMonth') + ',' + sel('cardExpiryYear') + ',' + sel('cardCVV')).on('input', function () {
                const $t = $(this);
                const v = ($t.val() || '').replace(/\D/g, '');
                $t.val(v);
            });
        }

        function restrictNameInput() {
            $(sel('cardName')).on('input', function () {
                let val = $(this).val();
                val = val.replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ\s'-]/g, '');
                $(this).val(val);
            });
        }

        function autoAdvance() {
            $(sel('cardExpiryMonth')).on('input', function () {
                const v = onlyDigits(this.value).slice(0, 2);
                this.value = v;
                if (v.length === 2) $(sel('cardExpiryYear')).focus();
            });
        }

        function bindFlipOnCVV() {
            const $card = $(sel('ef3Card'));
            $(sel('cardCVV')).on('focus', () => $card.addClass('flipped'));
            $(sel('cardCVV')).on('blur', () => $card.removeClass('flipped'));
        }

        function bindReset() {
            $(sel('ef3ResetBtn')).on('click', function () {
                $(sel('cardNumber') + ',' + sel('cardName') + ',' + sel('payAmount') + ',' + sel('cardExpiryMonth') + ',' + sel('cardExpiryYear') + ',' + sel('cardCVV')).val('');
                $(`${sel('dvCreditCard')} .ef3-form-group`).each(function () {
                    clearError($(this));
                    toggleClearIcon($(this));
                });
                setPreview();
                updateSubmitState();
            });
        }

        // Initial setup
        $(`${sel('dvCreditCard')} .ef3-form-group`).each(function () {
            toggleClearIcon($(this));
        });

        setPreview();
        restrictNumericInputs();
        restrictNameInput();
        autoAdvance();
        attachClearHandlers();
        bindFlipOnCVV();
        bindReset();

        // Live validation
        $(sel('cardNumber') + ',' + sel('cardName') + ',' + sel('cardExpiryMonth') + ',' + sel('payAmount') + ',' + sel('cardExpiryYear') + ',' + sel('cardCVV'))
            .on('input blur', function (e) {
                const $group = $(this).closest('.ef3-form-group');
                const id = this.id.replace(/\d+$/, ''); // remove numeric suffix
                const isBlur = e.type === 'blur';
                setPreview();
                if (isBlur) $(this).data('touched', true);

                const silent = {
                    cardNumber: () => validateNumber(false),
                    cardName: () => validateName(false),
                    cardExpiry: () => validateExpiry(false, false),
                    cardCVV: () => validateCVV(false),
                    payAmount: () => validatePayAmount(false),
                };
                const loud = {
                    cardNumber: () => validateNumber(true),
                    cardName: () => validateName(true),
                    cardExpiry: () => validateExpiry(true, true),
                    cardCVV: () => validateCVV(true),
                    payAmount: () => validatePayAmount(true),
                };

                let shouldShow = false;
                let isValidNow = false;

                switch (id) {
                    case 'cardNumber': {
                        const raw = onlyDigits($(this).val());
                        const need = brandMaxLength(detectBrand(raw));
                        isValidNow = silent.cardNumber();
                        shouldShow = isBlur || (raw.length >= need);
                        break;
                    }
                    case 'cardName': {
                        isValidNow = silent.cardName();
                        shouldShow = isBlur;
                        break;
                    }
                    case 'cardExpiryMonth':
                    case 'cardExpiryYear': {
                        const mm = ($(sel('cardExpiryMonth')).val() || '').slice(0, 2);
                        const yy = ($(sel('cardExpiryYear')).val() || '').slice(0, 2);
                        isValidNow = silent.cardExpiry();
                        shouldShow = isBlur || (mm.length === 2 && yy.length === 2);
                        break;
                    }
                    case 'cardCVV': {
                        const raw = onlyDigits($(this).val());
                        const need = cvvLengthForBrand(detectBrand($(sel('cardNumber')).val()));
                        isValidNow = silent.cardCVV();
                        shouldShow = isBlur || (raw.length >= need);
                        break;
                    }
                    case 'payAmount': {
                        isValidNow = silent.payAmount();
                        shouldShow = isBlur;
                        break;
                    }
                }

                if (!shouldShow) {
                    if (isValidNow) clearError($group);
                } else {
                    switch (id) {
                        case 'cardNumber': loud.cardNumber(); break;
                        case 'cardName': loud.cardName(); break;
                        case 'cardExpiryMonth':
                        case 'cardExpiryYear': loud.cardExpiry(); break;
                        case 'cardCVV': loud.cardCVV(); break;
                        case 'payAmount': loud.payAmount(); break;
                    }
                }

                toggleClearIcon($group);
                updateSubmitState();
            });
        $(sel('ef3SubmitBtn')).on('click', function (e) {
            const payAmount = $(sel('payAmount')).val();
            var _payAmount = parseLocalizedNumber(payAmount, langMinStringVar);
            const isValidFormat = /^\d+\.\d{2}$/.test(_payAmount);
            const isValidAmount = !isNaN(_payAmount) && _payAmount >= 1;
            const $btn = $(this);
            paymentButtonText = $btn.text().trim();
            if (!isValidFormat || !isValidAmount) {
                toastr.warning(`${EFlang.InvalidAmountFormat}`);
                $btn.prop('disabled', true).text(paymentButtonText);
                return;
            }

            const loadingHtml = `<span class="spinner-border" role="status" aria-hidden="true" style="width: 1rem;height: 1rem;"></span><span style="margin-left:10px;">${EFlang.PleaseWait}</span>`;
            // Butonu devre dışı bırak ve loading göster
            $btn.prop('disabled', true).html(loadingHtml);
            const cardNumber = $(sel('cardNumber')).val();
            const cardName = $(sel('cardName')).val();
            const cardExpiryMonth = $(sel('cardExpiryMonth')).val();
            const cardExpiryYear = $(sel('cardExpiryYear')).val();
            const cardCVV = $(sel('cardCVV')).val();
            let errors = [];
            if (!cardName || cardName.length < 4) {
                errors.push(EFlang.FullNameControlForCreditCard);
            }

            const now = new Date();
            const currentMonth = now.getMonth() + 1; // 0-indexed
            const currentYear = now.getFullYear() % 100; // Son iki hane

            const expiryMonth = parseInt(cardExpiryMonth, 10);
            const expiryYear = parseInt(cardExpiryYear, 10);

            // Format kontrolü
            if (!cardExpiryMonth || cardExpiryMonth.length !== 2 || isNaN(expiryMonth) || expiryMonth < 1 || expiryMonth > 12) {
                errors.push(EFlang.InvalidDate);
            }

            if (!cardExpiryYear || cardExpiryYear.length !== 2 || isNaN(expiryYear)) {
                errors.push(EFlang.InvalidDate);
            }

            // Geçmiş tarih kontrolü
            if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
                errors.push(EFlang.ExpiredDate);
            }

            if (!cardCVV || cardCVV.length < 3) {
                errors.push(EFlang.MissingCvv);
            }
            if (!cardNumber || cardNumber.replace(/\s+/g, '').length < 16) {
                errors.push(EFlang.InvalidCardNumber);
            }

            if (errors.length > 0) {
                errors.forEach(msg => toastr.warning(msg));
                $btn.prop('disabled', true).text(paymentButtonText);
                return false;
            }
            var installmentName = this.dataset.instname;
            var instCount = "";
            if (installmentName != "") {
                var instValue = $("#taskform").getValueInstallment(installmentName);
                var isValidInteger = /^\d+$/.test(instValue);
                if (isValidInteger) {
                    instCount = String(parseInt(instValue, 10));
                } else {
                    toastr.warning(`Taksit sayısı hatalı : ${instValue}`);
                }
            }
            var hash = toBinary(`${cardNumber}|${cardName}|${cardExpiryMonth}|${cardExpiryYear}|${cardCVV}`);
            var installmentIframeUrl = `/task/Render3DForm?cardInfoHash=${hash}&did=${this.dataset.cdid}&ciid=${this.dataset.ciid}&amount=${_payAmount}`;
            if (instCount !== "") {
                installmentIframeUrl += "&instCount=" + encodeURIComponent(instCount);
            }
            var iframeCard = document.createElement('iframe');
            iframeCard.src = installmentIframeUrl;
            iframeCard.id = 'credit-card-iframe';
            iframeCard.name = 'credit-card-iframe';
            iframeCard.style.border = '0';
            iframeCard.style.width = '100%';
            iframeCard.style.height = '100%';
            iframeCard.setAttribute('scrolling', 'yes');
            $('#installment_modalbody').html('').append(iframeCard);
        });

        $(`${sel('dvCreditCard')} .ef3-card-form`).on('submit', function (e) { e.preventDefault(); });

        // Format card number on input
        $(sel('cardNumber')).on('input', function () {
            const digits = onlyDigits(this.value);
            const brand = detectBrand(digits);
            formatCardNumberInputKeepingCaret(this, brand);
            let formattedMax = 19;
            if (brand === 'amex') formattedMax = 17;
            else if (brand === 'unionpay') formattedMax = 23;
            $(this).attr('maxlength', formattedMax);
        });

        $('.cvv-tooltip').tooltip({ container: '#controlContainer' });
    };

})(jQuery);
function closeInstallmentModal() {
    $('#paymentModal').modal('hide');
    $('#installment_modalbody').html('');
}
var paymentButtonText = '';
window.addEventListener("message", function (event) {
    const $btn = $('[id^="ef3SubmitBtn"]');
    if (event.data.status === "card_success") {
        setTimeout(function () {
            closeInstallmentModal();
            $('#ef3ResetBtn' + event.data.btnId).click();
        }, 2000);
    } else if (event.data.status === "card_fail") {
        /*closeInstallmentModal();*/
    }
    else if (event.data.status === "pay_modal_height") {
        const ccIframeHeights = { AKBANK: '645px', GARANTI: '700px', QNB: '450px', YAPIKREDI: '483px' };
        $('#installment_modalbody').css('height', ccIframeHeights[event.data.message] || '450px');
        setTimeout(function () {
            $btn.prop('disabled', false).text(paymentButtonText);
            $('#paymentModal').modal('show');
        }, 2000);
    }
});
function isValidPayAmount(value) {
    return /^\d+\.\d{2}$/.test(value) && parseFloat(value) > 0;
}

$.fn.getValueInstallment = function (instname) {
    try {
        var a = this.serializeArray();
        var taskForm = this;
        var thisval = "";
        $.each(a, function () {
            if (this.name === instname) {
                var $input = $(taskForm).find("[name='" + this.name + "']");
                if ($input.hasClass("numeric")) {
                    thisval = $input.val();
                } else if ($input.attr("type") === "radio" || $input.attr("type") === "checkbox") {
                    thisval = this.value;
                } else {
                    thisval = $input.val();
                }
                return false;
            }
        });
        return thisval;
    } catch (e) {
        return "";
    }
};
function parseLocalizedNumber(str, culture) {
    if (!str) return "";

    const decimalSep = getValidDecimalSeparator(culture); 
    const groupSep = getValidNumberGroupSeparator(culture);

    // Grup ayırıcıları kaldırılır (boşluk dahil tüm özel karakterler güvenli şekilde işlenir)
    const escapedGroupSep = groupSep.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const groupSepRegex = new RegExp(escapedGroupSep, 'g');
    str = str.replace(groupSepRegex, '');

    // Bazı dillerde boşluk karakteri normal değil (non-breaking space gibi), onları da temizle
    str = str.replace(/[\u00A0\u202F]/g, '');

    // Ondalık ayırıcı normalize edilir (örn: "," → ".")
    if (decimalSep !== '.') {
        const escapedDecimalSep = decimalSep.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const decimalSepRegex = new RegExp(escapedDecimalSep, 'g');
        str = str.replace(decimalSepRegex, '.');
    }

    // Sayıya çevir ve 2 basamaklı hale getir
    const num = parseFloat(str);
    return isNaN(num) ? "" : num.toFixed(2);
}