var selectedDays = ["0", "1", "2", "3", "4"];
var TASKREMINDERDAYS;
var TASKREMINDERTIME;
var ldapObjectList = [];
var emailObjectList;
var isDirty = false;
var dayzString;
var domainInput;
var userNameInput;
var passwordInput;
var autoLoginIsActiveInput;

var saveModeEnum = {
    Add: "Add",
    UpdateOrDelete: "UpdateOrDelete"
}
var saveMode;
var errorsEnum = {
    UnknownError: 0,
    WrongUsernameOrPassword: 1,
    CantConnectLdapServer: 2
}

var LdapLoginType = {
    SamAccountName: 1,
    Email: 2
}
$(function () {

    $.getScript('/Scripts/jquery.mask.js', function () {
        $("#TASKREMINDERTIME").mask("99:99");
    });
    TASKREMINDERDAYS = $("#TASKREMINDERDAYS");
    TASKREMINDERTIME = $("#TASKREMINDERTIME");

    if (TASKREMINDERDAYS.val() != ""
        && TASKREMINDERDAYS.val() != null
        && TASKREMINDERDAYS.val() != undefined) {

        SplitToArray(TASKREMINDERDAYS.val());
    }

    makeChecked();
    BindEvents();

    $(".label_pass").html(GeneratePassword("basic"));

    domainInput = $("#domain");
    userNameInput = $("#userName");
    passwordInput = $("#password");
    loginTypeInput = $("#loginType");
    autoLoginIsActiveInput = $("#autoLoginIsActive");

    getLdapServers(true);
    getSamlActors();
    getCompanyEmails(true);

})

/////////////////////////////////////////////
function makeChecked() {
    $('.checkb').prop("checked", false);
    for (var i = 0; i < selectedDays.length; i++) {
        $(".checkb[data-id=" + selectedDays[i] + "]").prop("checked", true);
    }
}

function addSAML(samlModel) {

    $.ajax({
        url: "/Account/AddNewSaml",
        type: "POST",
        data: samlModel,
        processData: false,
        contentType: false
    }).done(function (result) {
        if (result.Success) {
            $(".checking").addClass("hidden");
            samlsJson = result.LastSamlList;
            getSamlActors();
        }
        else {
            $(".checking").addClass("hidden");
            $(".inValidIDP").removeClass("hidden");
        }
    });
}


function DeleteSaml(id) {

    $.ajax({
        url: "/Account/DeleteSaml",
        type: "POST",
        data: { samlId: id, companyId: parseInt(companyId) },
    }).done(function (isSuccess) {
        if (isSuccess) {
            getSamlActors();
        }
    }).catch(function (e) {
        console.log(e);
    });
}

function UpdateSaml(samlData) {
    $.ajax({
        url: "/Account/UpdateSamlMetadata",
        type: "POST",
        data: samlData,
        contentType: false,
        processData: false
    }).done(function (data) {
        if (data) {
            samlsJson = data;
            getSamlActors();
        }
    }).catch(function (e) {
        console.log(e);
    });

}

var fromBinary = function (encoded) {
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
}


function LoginLdap(mode) {
    $(".checking").removeClass("hidden");

    var ldapModel = {
        CompanyId: companyId,
        Id: saveMode == saveModeEnum.Add ? guid() : $("#addLdap").attr("data-value"),
        Domain: domainInput.val(),
        UserName: userNameInput.val(),
        Password: toBinary(passwordInput.val()),
        LoginType: loginTypeInput.val(),
        AutoLoginIsActive: autoLoginIsActiveInput.is(":checked")
    }

    var item = $.grep(ldapObjectList, function (item) {
        return item.Domain == ldapModel.Domain && item.Id != ldapModel.Id && item.Domain == ldapModel.Domain;
    });

    if (item.length > 0) {
        $(".checking").addClass("hidden");
        $(".invalidLdapUsername").removeClass("hidden");
        return false;
    }

    $.each(ldapObjectList, function (i, item) {
        item.Password = toBinary(item.Password);
    });

    switch (saveMode) {
        case saveModeEnum.Add: {
            ldapObjectList.push(ldapModel);
            break;
        }
        case saveModeEnum.UpdateOrDelete: {

            var dataValue = $("#addLdap").attr("data-value");

            $.each(ldapObjectList, function (i, item) {
                if (item.Id == dataValue) {

                    var oldGuid = item.Id;
                    ldapModel.Id = oldGuid;

                    ldapObjectList[i] = ldapModel;
                }
            });

            break;
        }
    }

    $.post("/Account/LoginLdapServer", { ldapServers: JSON.stringify(ldapObjectList), ldapUnique: ldapModel.Id, companyId: companyId }, function (data) {

        $.each(ldapObjectList, function (i, item) {

            item.Password = fromBinary(item.Password);
        });

        if (JSON.parse(data).isSuccessful) {
            $(".invalidLdap").addClass("hidden");
            $('#addLdap').modal("toggle");
            $(".checking").addClass("hidden");
            $(".invalidLdapUsername").addClass("hidden");

            ldapJson = ldapObjectList;
            getLdapServers();

            return true;
        }
        else {

            if (saveMode == saveModeEnum.Add) {
                ldapObjectList = $.grep(ldapObjectList, function (item) {
                    return item.Id != ldapModel.Id
                });
            }

            switch (JSON.parse(data).LdapResponseTypes) {
                case errorsEnum.UnknownError: {
                    $(".invalidLdap").html(EFlang["UnknownError"]);
                    break;
                }
                case errorsEnum.WrongUsernameOrPassword: {
                    $(".invalidLdap").html(EFlang["WrongUsernameOrPassword"]);
                    break;
                }
                case errorsEnum.CantConnectLdapServer: {
                    $(".invalidLdap").html(EFlang["CantConnectLdapServer"]);
                    break;
                }
            }

            $(".checking").addClass("hidden");
            $(".invalidLdap").removeClass("hidden");

            return false;
        }
    });
}

function saveLdapServers() {
    $.post("/Account/UpdateLdapServers", { ldapServersObject: JSON.stringify(ldapJson), companyId: companyId }, function () {
        $(".ldapAlert .message").html(saveMessage);

        if (isNewCompany == "False")
            $(".ldapAlert").removeClass("hidden");
        else
            $("#LDAP_SERVERS").val(JSON.stringify(ldapJson));
    });
}

function isValidTime() {
    var time = TASKREMINDERTIME.val();
    var hour = time.split(":")[0];
    var minutes = time.split(":")[1];

    if (hour.length == 2 && minutes.length == 2) {
        //
    }
    else {
        TASKREMINDERTIME.val("08:00");
        return false;
    }

    if ((hour >= 0 && hour <= 24) && (minutes >= 0 && minutes <= 60)) {
        //return true;
    }
    else {
        TASKREMINDERTIME.val("08:00");
        return false;
    }

}

function SaveEmail(formData) {

    $.ajax({
        url: "/Account/AddCompanyEmail",
        type: "POST",
        data: formData,
        dataType: 'json',
        async: true,
        contentType: false,
        processData: false,
        success: function (data) {
            emailLst = data;
            getCompanyEmails();
            $('#addEmail').modal("toggle");
            clearModal();

        }, error: function (d) {
            $(".invalidEmail").removeClass("hidden");

        }
    });
}

function SaveParameters(companyId, isHtmlFormChecked, isGlobalLogsChecked, showDocsFromMobile, fileToFolder, columnDesignType, processMenuViewClose,
    removeListFromDb, lineItemColumnReq, disableCache, lineItemColumnEditableReadOnly, deleteFileLocal, documentInitialVersion, eSignatureDocType, chatGPTModel, chatGPTKey, parameters) {
    var params = {
        companyId: companyId, useCustomHtmlInTaskForm: isHtmlFormChecked, enableGlobalLogs: isGlobalLogsChecked, ShowDocsFromMobile: showDocsFromMobile,
        FileToFolder: fileToFolder, ProcessMenuViewClose: processMenuViewClose, ColumnDesignType: columnDesignType, removeListFromDb: removeListFromDb,
        lineItemColumnReq: lineItemColumnReq, disableCache: disableCache, lineItemColumnEditableReadOnly: lineItemColumnEditableReadOnly, deleteFileLocal: deleteFileLocal,
        documentInitialVersion: documentInitialVersion, eSignatureDocType: eSignatureDocType, chatGPTModel: chatGPTModel, chatGPTKey: chatGPTKey, parameters: parameters
    };
    $.ajax({
        url: "/Admin/UpdateParameters",
        type: "POST",
        data: JSON.stringify(params),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            if (data.IsSuccess) {
                location.href = '/Admin/CompanyList';
            } else {
                swal({ type: 'error', text: data.Message, confirmButtonText: EFlang.Close, showConfirmButton: true, showCancelButton: false });
            }
        }
    });
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function DeleteEmail(userName) {
    var companyId = $("#companyId").val();

    $.ajax({
        url: "/Account/DeleteCompanyEmail",
        type: "GET",
        data: {
            "userName": userName,
            "companyId": companyId
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        success: function (data) {
            emailLst = data;
            getCompanyEmails();
        }
    });
}

function getLdapServers(isBoot) {
    if (!isBoot)
        isDirty = true;

    var tableBody = $(".ldapServerList tbody");

    tableBody.html("");

    ldapObjectList = ldapJson;

    if (ldapObjectList) {
        $.each(ldapObjectList, function (i, item) {
            tableBody.append("<tr><td style='display:none;'>" + item.Id + "</td><td><a href=\"#addLdap\" class='ldapDetail' data-toggle=\"modal\" data-id=\"" + item.Id + "\">" + item.Domain + "</a></td><td>" + item.UserName + "</td><td style=\"width:10px;\"><a style='' href=\"#deleteLdap\" class=\"delete_ldapItem showHide\" data-toggle=\"modal\" data-id=\"" + item.Id + "\"><div><i style='font-size: 19px; color: #fd27eb;' class=\"la la-trash-o\"></i></div></a></td></tr>")
        });
    }

    if (ldapObjectList.length < 1) {
        tableBody.append("<tr><td colspan='4' style='text-align: center'>" + notRecordFound + "</td></tr>")
    }

    $("#LDAP_SERVERS").val(JSON.stringify(ldapJson));
}

function getSamlActors() {

    var tableBody = $(".samlServerList tbody");

    tableBody.html("");
    if (typeof (samlsJson) !== 'undefined') {
        samlObjectList = samlsJson;

        if (samlObjectList) {
            $.each(samlObjectList, function (i, item) {
                tableBody.append("<tr><td style='display:none;'>" + item.Id + "</td><td><a href=\"#addSaml\" class='samlDetail' data-toggle=\"modal\" data-id=\"" + item.Id + "\">" + item.SamlActorName + "</a></td><td style=\"width:10px;\"><a style='' href=\"#deleteSaml\" class=\"delete_samlItem showHide\" data-toggle=\"modal\" data-id=\"" + item.Id + "\"><div><i style='font-size: 19px; color: #fd27eb;' class=\"la la-trash-o\"></i></div></a></td></tr>")
            });
        }

        if (samlObjectList.length < 1) {
            tableBody.append("<tr><td colspan='4' style='text-align: center'>" + notRecordFound + "</td></tr>")
        }
        $("#SAML_ACTORS").val(JSON.stringify(samlObjectList));

    }

}

function SplitToArray(tempData) {
    selectedDays = String(tempData).split("|");
}

function ArraySerializeString() {
    dayzString = "";

    for (var i = 0; i < selectedDays.length; i++) {
        dayzString += selectedDays[i] + "|";
    }

    dayzString = String(dayzString).substring(0, dayzString.length - 1);
    TASKREMINDERDAYS.val(dayzString);
}

function DecPass(eStrPass) {

    $.ajax({
        type: 'GET',
        dataType: "json",
        data: {
            encryptedStr: eStrPass
        },
        url: '/Partials/Decrypt',
        success: function (data) {

            GetDecPass(data);
            return data;
        }
    });
}

function GetDecPass(data) {
    passwordInput.val(data);
}

function GeneratePassword(mode) {
    var complex = ["e", "r", "t", "y", "u", "Q", "W", "E", "!", "^", "+", "R", "T", "Y", "U", "I", "O", "P", "p", "a", "s", "\\", "/", "@", "{", "d", "f", "A", "S", "D", "2", "3", "4", "5", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M", "%", "&", "*", "?", "=", "-", "_", "$", "#", "[", "]", "}", "~", ";", "q", "w", "i", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", "0", "1", "6", "7", "8", "9"];
    var basic = ["q", "w", "e", "r", "t", "y", "u", "i", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    var pass = "";
    switch (mode) {
        case "basic":
            {
                for (var i = 0; i < 8; i++) {
                    var ch = Math.floor(Math.random() * (basic.length - 0 + 1)) + 0;
                    var character = basic[ch];

                    if (character != undefined)
                        pass += character;
                }
                break;
            }
        case "complex":
            {
                for (var i = 0; i < 8; i++) {
                    var ch = Math.floor(Math.random() * (complex.length - 0 + 1)) + 0;
                    var character = complex[ch];

                    if (character != undefined)
                        pass += character;
                }
                break;
            }
    }

    return pass;
}

function getCompanyEmails() {
    if ($(".emailList tbody").length > 0) {
        var tableBody = $(".emailList tbody");
        tableBody.html("");
        emailObjectList = emailLst;

        var array = [];
        emailObjectList = emailObjectList.replaceAll("&quot;", "\"");

        if (emailObjectList != "")
            array = JSON.parse(emailObjectList);

        if (EMailKullanici != "" && !array.some(e => e.EMailKullanici == EMailKullanici))
            array.unshift({ Username: EMailKullanici, Password: EMailSifre, Smtp: SmtpSunucu, Ssl: EMailSSL, Port: SmtpPort, UseDefaultCredentials: EMailUseDefaultCredentials, DefaultAccount: false, DefaultMailConfig: false, EMailKullanici: EMailKullanici })

        if ((array.length > 0)) {
            $.each(array, function (i, item) {
                if (array[i].EMailKullanici === EMailKullanici)
                    tableBody.append("<tr><td><a href=\"#\" class=\"edit_emailItem\" data-toggle=\"modal\" data-value=\"" + JSON.stringify(array[i]).replace(/"/g, "'") + "\">" + array[i].EMailKullanici + "</a></td><td style=\"width:10px;\"> &nbsp;</td><td style=\"width:10px;\"></td></tr>")
                else
                    tableBody.append("<tr><td><a href=\"#\" class=\"edit_emailItem\" data-toggle=\"modal\" data-value=\"" + JSON.stringify(array[i]).replace(/"/g, "'") + "\">" + array[i].EMailKullanici + "</a></td><td style=\"width:10px;\"> &nbsp;</td><td style=\"width:10px;\"><a href=\"#deleteEmail\" class=\"delete_emailItem showHide\" data-toggle=\"modal\" style='' data-id=\"" + array[i].Username + "\"><i style='font-size: 19px; color: #fd27eb;' class=\"la la-trash-o\"></i></a></td></tr>")
            });
        }
        else {
            tableBody.append("<tr><td colspan='3' style='text-align: center'>" + notRecordFound + "</td></tr>")
        }
    }
}

function clearModal() {
    $("#form-edit-company").resetForm();
    $(".invalidEmail").addClass("hidden");
    $("#emailNew").val("");
    $("#Password").val("");
    $("#Smtp").val("");
    $("#Ssl").prop("checked", false);
    $("#Port").val("");
    $('input').prop("checked", false);
    $("#Credential").prop("checked", false);
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function bindShowHide() {
    $.fn.invisible = function () {
        return this.each(function () {
            $(this).css("visibility", "hidden");
        });
    };
    $.fn.visible = function () {
        return this.each(function () {
            $(this).css("visibility", "visible");
        });
    };

    $('.ldapServerList tr, .emailList tr, samlServerList tr').hover(function () {
        $(this).find('.showHide').visible();
    }, function () {
        $(this).find('.showHide').invisible();
    });
}

/////////////////////////////////////////////

function BindEvents() {
    TASKREMINDERTIME.on("blur", function () {
        isValidTime();
    });

    $(".checkb").change(function () {
        if (this.checked) {
            selectedDays.push($(this).attr("data-id"));
            ArraySerializeString();
        }
        else {
            var dataId = $(this).attr("data-id");
            for (var i = 0; i < selectedDays.length; i++) {
                if (selectedDays[i] == dataId) {
                    selectedDays.splice(i, 1);
                    ArraySerializeString();
                }
            }
        }
    });

    $(".SaveSaml").on("click", function (e) {

        $(".checking").removeClass("hidden");

        var metadataInput = document.getElementById("idpMetadata").files[0];

        if (!metadataInput) {
            $(".checking").addClass("hidden");
            $(".inValidIDP").removeClass("hidden");
        }
        else {
            var formData = new FormData();
            formData.append("MetadataFile", metadataInput);
            formData.append("CompanyID", companyId);

            var dataValue = $("#addSaml").attr("data-value");

            if (dataValue) {
                formData.append("SamlId", dataValue);

                UpdateSaml(formData);
            } else {
                addSAML(formData);
            }


        }
    });

    $(".PasswordPolicy")
        .change(function () {
            if ($(this).is(":checked")) {
                var val = $(this).val();

                if (val == 0) {
                    $(".label_pass").html(GeneratePassword("basic"));
                }
                if (val == 1) {
                    $(".label_pass").html(GeneratePassword("complex"));
                }
            }
        });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

        if ($(e.target).attr("aria-controls") == "ldap") {
            $(".ldapButton").removeClass("hidden");
        }
        else {
            $(".ldapButton").addClass("hidden");
        }
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

        if ($(e.target).attr("aria-controls") == "email") {
            $(".emailButton").removeClass("hidden");
        }
        else {
            $(".emailButton").addClass("hidden");
        }
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

        if ($(e.target).attr("aria-controls") == "saml") {
            $(".samlButton").removeClass("hidden");
        }
        else {
            $(".samlButton").addClass("hidden");
        }
    });

    $("#addLdapBtn").on("click", function () {
        $("#addLdap").attr("data-value", "-1");
    });

    $(".SaveLdap").on("click", function (e) {

        $(".invalidLdap").addClass("hidden");
        $(".checking").addClass("hidden");
        $(".invalidLdapUsername").addClass("hidden");

        e.preventDefault();

        $(this).prop("disabled", true);

        $(".invalidLdap").addClass("hidden");
        $(".checking").addClass("hidden");

        $(".newLdapForm").validate({
            rules: {
                domain: {
                    required: true
                },
                userName: {
                    required: true
                },
                password: {
                    required: true
                }
            },
            messages: {
                domain: {
                    required: EFlang["Required"]
                },
                userName: {
                    required: EFlang["Required"]
                },
                password: {
                    required: EFlang["Required"]
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        });

        if ($(".newLdapForm").valid()) {
            LoginLdap(saveMode);
        }

        $(this).prop("disabled", false);

    });

    $(".SaveEMail").on("click", function (e) {
        var formData = new FormData();
        formData.append('Email', $("#emailNew").val());
        formData.append('Username', $("#emailUsername").val());
        formData.append('Password', $("#Password").val());
        formData.append('Smtp', $("#Smtp").val());
        formData.append('Ssl', $("#Ssl")[0].checked);
        formData.append('Default', $("#Default")[0].checked);
        formData.append('DefaultMailConfig', $("#DefaultMailConfig")[0].checked);
        formData.append('Credential', $("#Credential")[0].checked);
        formData.append('CompanyId', $("#companyId").val());
        formData.append('Port', $("#Port").val());
        if (isEmail($("#emailNew").val())) {
            SaveEmail(formData);
        } else {
            $(".invalidEmail").removeClass("hidden");
        }

    });

    $(".DeleteEmailOk").on("click", function (e) {
        e.preventDefault();
        var userName = $("#deleteEmail").attr("data-value");
        DeleteEmail(userName);
        $('#deleteEmail').modal("toggle");
    });

    $(".DeleteOk").on("click", function (e) {
        e.preventDefault();

        uniqueId = $("#deleteLdap").attr("data-value");

        var ldapData = $.grep(ldapObjectList, function (item) {
            return item.Id !== uniqueId;
        });

        ldapJson = ldapData;

        if (isNewCompany == "False")
            saveLdapServers();

        getLdapServers();

        $(".ldapAlert .message").html(deleteMessage);

        if (isNewCompany == "False")
            $(".ldapAlert").removeClass("hidden");

        $('#deleteLdap').modal("toggle");
    });

    $(".deleteSamlOk").on("click", function (e) {
        e.preventDefault();

        var samlId = $("#deleteSaml").attr("data-value");

        var samlData = $.grep(samlObjectList, function (item) {
            return item.Id !== samlId;
        });

        samlsJson = samlData;
        DeleteSaml(samlId);
        $("#deleteSaml").modal("toggle");

    });

    $('#addLdap').on('show.bs.modal', function () {

        $("label.error").hide();
        $(".error").removeClass("error");
        $(".invalidLdap").addClass("hidden");
        $(".invalidLdapUsername").addClass("hidden");
        $("#domain-error, #userName-error, #password-error").addClass("hidden");


        $(this).find("input").css({ "background-color": "#FFF !important" });

        var dataValue = $("#addLdap").attr("data-value");
        if (dataValue == -1) {
            $("#addLdap .modal-info").html(newInfo);
            $(this).find("input:not([type=submit])").val("");
            saveMode = saveModeEnum.Add;
        }
        else {
            $("#addLdap .modal-info").html(editInfo);
            saveMode = saveModeEnum.UpdateOrDelete;
        }

    });

    $('#deleteLdap').on('show.bs.modal', function () {

    });

    $('#addLdap').on('hidden.bs.modal', function () {
        $("#addLdap").attr("data-value", "");
    });

    $('#btn-ok').click(function () {
        location.href = '/Admin/CompanyList';
    });

    $('#addEmailBtn').on("click", function () {
        clearModal();
    });

    $('#FileToFolder').click(function () {
        if ($(this).is(':checked')) {

            var val = confirm(question);
            if (val == false) {
                $("#FileToFolder").prop("checked", false);
            }
        }
    });

    $(document).delegate(".delete_emailItem", "click", function (event) {
        var $element = event.currentTarget;

        var userName = $($element).attr("data-id");

        $("#deleteEmail").attr("data-value", userName);
    });

    $(document).delegate(".ldapDetail", "click", function (event) {

        var $element = event.currentTarget;

        var uniqueId = $($element).attr("data-id");

        $("#addLdap").attr("data-value", uniqueId);

        var ldapData = $.grep(ldapObjectList, function (item) {
            return item.Id === uniqueId;
        });

        domainInput.val(ldapData[0].Domain);
        userNameInput.val(ldapData[0].UserName);

        var passVal = ldapData[0].Password;
        passwordInput.val(passVal);

        var loginType = ldapData[0].LoginType;
        loginTypeInput.val(loginType).trigger("change");

        var autoLoginIsActive = ldapData[0].AutoLoginIsActive;
        autoLoginIsActiveInput.val(autoLoginIsActive);

        if (autoLoginIsActive == true)
            autoLoginIsActiveInput.attr("checked", true);
    });

    $(document).delegate(".samlDetail", "click", function (event) {

        var $element = event.currentTarget;

        var uniqueId = $($element).attr("data-id");

        $("#addSaml").attr("data-value", uniqueId);


    });

    $(document).delegate(".edit_emailItem", "click", function (event) {
        $(".invalidEmail").addClass("hidden");
        var data = $(this).data('value')
        var json = JSON.parse(data.replace(/'/g, '"'));
        $("#emailNew").val(json.EMailKullanici);
        $("#emailUsername").val(json.Username)
        $("#Password").val(json.Password);
        $("#Smtp").val(json.Smtp);
        $("#Ssl").prop("checked", json.Ssl);
        if (json.Ssl)
            $("#Ssl").parent('[class*="icheckbox"]').addClass("checked");
        $("#Port").val(json.Port);

        $("#Default").prop("checked", json.DefaultAccount);
        if (json.DefaultAccount)
            $("#Default").parent('[class*="icheckbox"]').addClass("checked");

        $("#DefaultMailConfig").prop("checked", json.DefaultMailConfig);
        if (json.DefaultMailConfig)
            $("#DefaultMailConfig").parent('[class*="icheckbox"]').addClass("checked");

        $("#Credential").prop("checked", json.UseDefaultCredentials);
        if (json.UseDefaultCredentials)
            $("#Credential").parent('[class*="icheckbox"]').addClass("checked");
        var companyId = $("#companyId").val();
        $('#addEmail').modal('show');
    })

    $(document).delegate(".delete_ldapItem", "click", function (event) {
        var $element = event.currentTarget;

        var uniqueId = $($element).attr("data-id");

        $("#deleteLdap").attr("data-value", uniqueId);
    });

    $(document).delegate(".delete_samlItem", "click", function (event) {
        var element = event.currentTarget;
        var uniqueSamlId = $(element).attr("data-id");
        $("#deleteSaml").attr("data-value", uniqueSamlId);
    });

    $("#form-company").on("submit", function () {

        if ($(this).valid()) {
            isDirty = false;
        }
    });

    $(window).bind('beforeunload', function (e) {

        if (isNewCompany == "True" && isDirty) {
            return "Firma bilgilerini kaydetmediniz.\nDevam ederseniz girmiş olduğunuz veriler kaybolacaktır.";
        }
    });

    $('#editCompanyParam').on("click", function () {

        var companyId = $("#companyId").val();
        var isHtmlFormChecked = $('#UseCustomHtmlInTaskForm').prop('checked');
        var isGlobalLogsChecked = $('#EnableGlobalLogs').prop('checked');
        var showDocsFromMobile = $("#ShowDocsAtMobile").prop('checked');
        var columnDesignType = $("#SelectedTableColumnID").val();
        var fileToFolder = $("#FileToFolder").prop('checked');
        var processMenuViewClose = $("#ProcessMenuViewClose").prop('checked');
        var removeListFromDB = $("#RemoveListFromDB").prop('checked');
        var lineItemColumnReq = $("#LineItemColumnReq").prop('checked');
        var disableCache = $("#DisableCache").prop('checked');
        var lineItemColumnEditableReadOnly = $("#LineItemColumnEditableReadOnly").prop('checked');
        var deleteFileLocal = $("#DeleteFileLocal").prop('checked');
        var documentInitialVersion = $("#InitialVersionNumber").val();
        var chatGPTModel = $("#InitialVersionNumber").val();
        var documentInitialVersion = $("#InitialVersionNumber").val();
        var eSignatureDocType = $("#eSignatureDocType").val().join(',');
        var chatGPTModel = $("#ChatGPTModel").val();
        var chatGPTKey = $("#ChatGPTKey").val();

        var useFtpForDocument = $("#Parameters_UseFtpForDocument").prop('checked');
        useFtpForDocument = useFtpForDocument == undefined ? false : useFtpForDocument;
        var documentFtpAddress = $("#DocumentFtpAddress").val();
        var documentFtpUserName = $("#DocumentFtpUserName").val();
        var documentFtpPassword = $("#DocumentFtpPassword").val();
        var documentFtpPort = $("#DocumentFtpPort").val();

        var useFtpForLog = $("#Parameters_UseFtpForLog").prop('checked');
        useFtpForLog = useFtpForLog == undefined ? false : useFtpForLog;
        var logFtpAddress = $("#LogFtpAddress").val();
        var logFtpUserName = $("#LogFtpUserName").val();
        var logFtpPassword = $("#LogFtpPassword").val();
        var logFtpPort = $("#LogFtpPort").val();

        var eSignFontSize = $("#Parameters_ESignFontSize").val();
        var eSignColor = $("#Parameters_ESignColor").val();

        var selectedESignTextOptions = [];
        $('[id^="SelectedTextOptions"]:checked').each(function () {
            selectedESignTextOptions.push(parseInt($(this).val()));
        });

        var parameters = {
            UseFtpForDocument: useFtpForDocument,
            DocumentFtpAddress: documentFtpAddress,
            DocumentFtpUserName: documentFtpUserName,
            DocumentFtpPassword: documentFtpPassword,
            DocumentFtpPort: documentFtpPort,

            UseFtpForLog: useFtpForLog,
            LogFtpAddress: logFtpAddress,
            LogFtpUserName: logFtpUserName,
            LogFtpPassword: logFtpPassword,
            LogFtpPort: logFtpPort,

            ESignFontSize: parseInt(eSignFontSize),
            ESignColor: eSignColor,
            SelectedOptions: selectedESignTextOptions
        };
        SaveParameters(companyId, isHtmlFormChecked, isGlobalLogsChecked, showDocsFromMobile, fileToFolder, columnDesignType,
            processMenuViewClose, removeListFromDB, lineItemColumnReq, disableCache, lineItemColumnEditableReadOnly, deleteFileLocal, documentInitialVersion,
            eSignatureDocType, chatGPTModel, chatGPTKey, JSON.stringify(parameters));
    });

    $("#SaveSmsAuth").on("click", function () {

    });

    $("#IsSmsAuth").change(function () {
        if (this.checked) {
            $("#smsAuthInfoEdit").show();
        }
        else
            $("#smsAuthInfoEdit").hide();
    })

    $("#smsAuthInfoEdit").click(function () {
        $('#SmsAuthInfoModal').modal('show');
    });
    $("#SaveSmsAuthInfo").click(function () {
        $('#SmsAuthInfoModal').modal('hide');
    });
    $("#Parameters_UseFtpForDocument").change(function () {
        if (this.checked) {
            $("#documentFtpParameterEdit").show();
        }
        else
            $("#documentFtpParameterEdit").hide();
    });
    $("#documentFtpParameterEdit").click(function () {
        $('#DocumentFtpParameterModal').modal('show');
    });


    $("#Parameters_UseFtpForLog").change(function () {
        if (this.checked) {
            $("#logFtpParameterEdit").show();
        }
        else
            $("#logFtpParameterEdit").hide();
    });
    $("#logFtpParameterEdit").click(function () {
        $('#LogFtpParameterModal').modal('show');
    });
}

function allowNumberOnly(e) {
    var ascii = (e.which) ? e.which : e.keyCode
    if (ascii > 31 && (ascii < 48 || ascii > 57))
        return false;
}
$.loading = function (btn, action) {
    if (action && !btn.data('old-html')) {
        btn.data('old-html', btn.html()).prop("disabled", true).html(btn.data('loading-text'));
        return
    }
    if (!btn.data('old-html')) return;
    btn.prop("disabled", false).html(btn.data('old-html')).data('old-html', false);
}
function ftpParameterTest(v, type) {
    var $btn = $(v);
    $.loading($btn, true);
    var ftpAddress = type == "document" ? $('#DocumentFtpAddress').val() : $('#LogFtpAddress').val();
    var userName = type == "document" ? $('#DocumentFtpUserName').val() : $('#LogFtpUserName').val();
    var password = type == "document" ? $('#DocumentFtpPassword').val() : $('#LogFtpPassword').val();
    var port = type == "document" ? $('#DocumentFtpPort').val() : $('#LogFtpPort').val();
    $.ajax({
        url: "/Admin/ControlConnectionFtp",
        type: "POST",
        data: { 'FtpAddress': ftpAddress, 'UserName': userName, 'Password': password, 'Port': port, 'Type': type == "document" ? 0 : 1 },
        dataType: "json",
        success: function (result) {
            if (result.IsSuccess)
                swal({ type: 'success', text: result.Message, showConfirmButton: false, timer: 3000 });
            else
                swal({ type: 'info', text: result.Message, confirmButtonText: EFlang.Close, showConfirmButton: true });
        },
        error: function (result) {
            swal({ type: 'error', text: result.Message, confirmButtonText: EFlang.Close, showConfirmButton: true });
        }
    }).then(function () {
        $.loading($btn, false);
    });
}