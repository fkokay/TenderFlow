(function ($) {
	$.extend($.validator.messages, {
        required: "Ce champ est obligatoire.",
        remote: "Veuillez corriger ce champ.",
        email: "Veuillez fournir une adresse électronique valide.",
        url: "Veuillez fournir une adresse URL valide.",
        date: "Veuillez fournir une date valide.",
        dateISO: "Veuillez fournir une date valide (ISO).",
        number: "Veuillez fournir un numéro valide.",
        digits: "Veuillez fournir seulement des chiffres.",
        creditcard: "Veuillez fournir un numéro de carte de crédit valide.",
        equalTo: "Veuillez fournir encore la même valeur.",
        notEqualTo: "Veuillez fournir une valeur différente, les valeurs ne doivent pas être identiques.",
        extension: "Veuillez fournir une valeur avec une extension valide.",
        defaultStr: $.validator.format("Veuillez saisir une valeur autre que zéro.")
	});
}(jQuery));