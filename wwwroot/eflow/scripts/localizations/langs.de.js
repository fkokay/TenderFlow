var EFlang = new function () {
    this.localeCode = "de";
    this.noRecordsFound = "Kein Eintrag gefunden.";
    this.Save = "Speichern";
    this.Currency = "EUR";
    this.UploadText = "Datei aussuchen";
    this.CancelText = "Stornieren";
    this.UploadFailText = "Upload fehlgeschlagen";
    this.RetryText = "Wiederholen";
    this.waitingForResponseText = "wird bearbeitet...";
    this.PleaseWait = "Warten Sie mal...";
    this.FileRequired = "Sie müssen eine Datei auswählen";
    this.StartProcess = 'Sind Sie sicher, dass Sie den Prozess starten möchten {0}?';
    this.GridRequiredError = 'Sie müssen alle erforderlichen Felder eingeben, bevor Sie fortfahren können';
    this.Error = 'Error!';
    this.Warning = 'Warnung';
    this.Required = "Bitte füllen Sie dieses Feld aus";
    this.MinLength = "Bitte, es sind mindestens {0} Zeichen erforderlich";
    this.UnknownError = "Unbekannter Serverfehler";
    this.WrongUsernameOrPassword = "Benutzername oder Passwort falsch";
    this.CantConnectLdapServer = "Ldap Server kann nicht verbunden werden";
    this.DateError = 'ungültiges Datumsformat (ex: 08.14.2016, Today..).';
    this.Required = "Dieses Feld kann nicht leer sein.",
    this.InvalidDate = "Bitte geben Sie ein gültiges Datum ein.",
    this.InvalidNumber = "Bitte geben Sie eine gültige Nummer ein.",
    this.Days = "Tage",
    this.Minutes = "Protokoll",
    this.Hours = "Std",
    this.MoreThanDays = "Tage",
    this.MoreThanMinutes = "Protokoll",
    this.MoreThanHours = "Std",
    this.MoreThan = "Mehr als"
    this.LessThan = "Weniger als";
    this.Close = "Schließen";

    this.F_Today = "Heute";
    this.F_Yesterday = "Gestern";
    this.F_ThisWeek = "Diese Woche";
    this.F_ThisMonth = "Diesen Monat";
    this.F_ThisYear = "Dieses Jahr";
    this.F_CurrentUser = "CurrentUser()";
    this.F_Days = "Day(s)";
    this.F_Hours = "Std";
    this.F_Minutes = "Minute(s)"

    this.GeoLocation_PERMISSION_DENIED = "Benutzer verweigert, seinen geoLocation zu teilen";
    this.GeoLocation_POSITION_UNAVAILABLE = "Info nicht verfügbar";
    this.GeoLocation_TIMEOUT = "Auszeit";
    this.GeoLocation_UNKNOWN_ERROR = "Unbekannter Fehler";
    this.GeoLocation_NOT_SUPPORTED = "Browser unterstützt nicht";
    this.GeoLocation_ONLY_SECURE_ORIGINS = "Es sind nur sichere Ursprünge zulässig (https).";
    this.Clean_Up_OCR_Filled_Fields = "Mit OCR gefüllte Felder löschen?";
    this.LoadingAndOcrParsing = "Die OCR-Analyse wird durchgeführt";
    this.AddFilter = "FÄLTER HINZUFÜGEN";
    this.ReportDetail = "Bericht";
    this.DashboardDetail = "Instrumententafel";
    this.DashboardName = "Dashboard Name";
    this.ReportName = "Berichtsname";

    this.Contains = "Enthält";
    this.NotContains = "Enthält nicht";
    this.ThanBefore = "Als vorher";
    this.LaterThan = "Später als";
    this.DateRange = "Datumsbereich";
    this.BiggerThan = "Größer als";
    this.SmallerThan = "Kleiner als";
    this.ExactMatch = "Genaue Übereinstimmung";
    this.FilterProcessName = "Prozess: ";
    this.Savedsuccessfully = "Änderungen erfolgreich gespeichert";

    this.FavouriteFilters = "Lieblingsfilter";
    this.LocationDataNotFound = "Standortdaten nicht gefunden";
    this.DeleteConfirm = "Sind Sie sicher, dass Sie löschen möchten?"
    this.Previous = "Bisherige";
    this.Next = "Nächster";
    this.Total = "Gesamt";
    this.RecordsOfListing = "";
    this.Loading = "Wird geladen..";
    this.ShowMore = "Zeig mehr";
    this.QueryRunSucceed = "Abfrage erfolgreich";
    this.SpParameterValidate = "Geben Sie alle Parameter für die gespeicherte Prozedur ein";
    this.QueryNotDefined = "Abfrage nicht definiert";
    this.FilterParameterVal = " Parameterwert"

    this.FilterGroupNo = "Group No"
    this.FilterGroupName = "Group Name"
    this.FilterGroupMember = "Group Member"
    this.FilterGroupSpecCode = "Group Spec Code 1 ...5"

    this.FilterName = "Name"
    this.FilterSurname = "Nachname"
    this.FilterUsername = "Nutzername"
    this.FilterGroup = "Gruppe"
    this.FilterStatus = "Status"

    this.ReportSuccessful = "Erfolgreich erstellt"
    this.ReportFailed = "Ein Bericht mit demselben Namen existiert bereits."

    this.FilterAllAssigned = "Alle";
    this.FilterAllAssignedBtnHover = "Verwenden Sie das Datenelement TaskAssignedTo, um Zugewiesene Benutzer zu filtern, die sich auf den Prozess beziehen";
    this.FilterProcesses = "PROZESSE";
    this.FilterTask = " Aufgabe ";
    this.FilterTotalTask = "Gesamtaufgabe";
    this.FilterAssigned = "Zugewiesen: ";
    this.BarChartTitle = "ZUGEWIESENE BENUTZER & GRUPPEN";

    this.PanelUserGroupConfirm = "Die {1} Datensätze des zugewiesenen {0} werden aufgelistet, bestätigen Sie?";

    this.PleaseSelect = "Wählen";

    this.EmptyStatusPieChart = "Leere Statusdatensätze werden aufgelistet, bestätigen Sie?";
    this.CountStatusPieChart = "Aufzeichnungen werden aufgelistet, bestätigen Sie?";

    this.Old = "Alt";
    this.New = "Neu";
    this.Preview = "Vorschau";
    this.UnableToPreviewFile = "Datei kann nicht in der Vorschau angezeigt werden";
    this.ItemsShowing = "{0} Artikel werden angezeigt.";

    this.Next = 'Nächster';
    this.Prev = 'Vorheriger';
    this.Done = 'Erledigt';

    //Virtual Tour Base Items Start
    this.dashboardTitle = `Willkommen in Ihrem neuen Dashboard`;
    this.dashboardTitleDetail = `           
            <p>
               Ihr Dashboard wurde entwickelt, um Ihre täglichen Aufgaben zu verfolgen und schnell auf häufig genutzte Funktionen zuzugreifen. Sie können es nach Ihren Bedürfnissen anpassen und sofort auf die am häufigsten verwendeten Funktionen zugreifen. Bei der ersten Nutzung können Sie alle Funktionen des Dashboards Schritt für Schritt mit der Einführungstour erkunden. Während der Tour:
            </p>
            <p>
            •	Sie sehen kurze Beschreibungen jeder Funktion. <br>
            •	Sie können zwischen den Schritten mit den Buttons "Zurück" und "Weiter" navigieren. <br>
            •	Sie können die Tour jederzeit schließen und später neu starten. 
            </p>
            <p>
            <h1 class="driver-title"> Arbeiten mit Widgets </h1>
            •	Drag & Drop: Sie können Widgets überall auf der Seite verschieben. <br>
            •	Größenanpassung: Sie können die Größe jedes Widgets nach Ihren Bedürfnissen ändern. <br>
            •	Bearbeiten: Sie können Widgets mit dem "+" Button hinzufügen oder entfernen. 
            </p>
            `;

    this.condenseDashboard = `Kompakte Ansicht mit Verdichtung`;
    this.condenseDashboardDetail = `<p>Sie können Widgets automatisch organisiert anordnen. </p>`;
    this.undoDashboardChanges = `Zur gespeicherten Ansicht zurückkehren`;
    this.undoDashboardChangesDetail = `<p>Sie können mit einem Klick zu Ihrer gespeicherten Ansicht zurückkehren. </p>`;
    this.saveCurrentDashboard = `Aktuelle Ansicht speichern`;
    this.saveCurrentDashboardDetail = `<p>Sie können Ihre aktuelle Ansicht für die spätere Verwendung speichern. </p>`;
    this.addRemovePanel = `Passen Sie Ihren Arbeitsbereich mit dem Hinzufügen/Entfernen-Button an`;
    this.addRemovePanelDetail = `<p>Sie können Widgets mit dem "+" Button hinzufügen oder entfernen.  </p>`;
    //Virtual Tour Base Items End

    //Virtual Tour Widgets Start
    this.gridStack_998 = `Zuletzt verwendete Prozesse`;
    this.gridStack_998Detail = `<p>
                               • Zeigen Sie Ihre zuletzt verwendeten Prozesse an. <br> 
                               • Klicken Sie auf den Prozessnamen, um einen neuen Prozess zu starten. <br> 
                               • Passen Sie die Symbolfarben an.</p>`;

    this.gridStack_999 = `Zuletzt verwendete Listen`;
    this.gridStack_999Detail = `<p> 
                               • Greifen Sie mit einem Klick auf Ihre am häufigsten verwendeten Prozesse zu. <br>  
                               • Unterscheiden Sie Prozesse leicht mit visuellen Karten. <br> 
                               • Personalisieren Sie Prozesssymbole.</p>`;

    this.gridStack_1000 = `Ausstehende Aufgaben`;
    this.gridStack_1000Detail = `<p>  
                                • Listen Sie Ihre zugewiesenen Aufgaben auf.  <br> 
                                • Greifen Sie schnell auf Aufgabenformulare zu.  <br> 
                                • Sortieren Sie Aufgaben nach verschiedenen Kriterien.</p>`;

    this.gridStack_1001 = `Tägliche Aufgaben`;
    this.gridStack_1001Detail = `<p>  
                                 • Verfolgen Sie Ihre täglichen Aufgaben in einer Kalenderansicht.  <br> 
                                 • Navigieren Sie mit den Pfeiltasten zwischen den Tagen.  <br>
                                 • Klicken Sie auf ein Datum, um die Aufgaben für diesen Tag anzuzeigen.</p>`;

    this.gridStack_1002 = `Häufig verwendete Prozesse`;
    this.gridStack_1002Detail = `<p> 
                                • Zeigen Sie Ihre zuletzt verwendeten Prozesse an. <br>
                                • Klicken Sie auf den Prozessnamen, um einen neuen Prozess zu starten. <br>
                                • Passen Sie die Symbolfarben an.</p>`;

    this.gridStack_1003 = `Häufig verwendete Listen`;
    this.gridStack_1003Detail = `<p> 
                                • Ihre am häufigsten verwendeten Listen werden mit speziellen Symbol- und Farbdesigns angezeigt. <br> 
                                • Benutzerdefinierte visuelle Designs für jede Liste. <br> 
                                • Schneller Zugriff auf alle Listen über den "Listen"-Link.</p>`;

    this.gridStack_1004 = `Zuletzt verwendete Dokumente`;
    this.gridStack_1004Detail = `<p> 
                                 • Greifen Sie sofort auf Ihre zuletzt geöffneten Dokumente zu. <br> 
                                 • Klicken Sie auf ein Dokument, um dessen Inhalt anzuzeigen. <br> 
                                 • Visuelle Unterscheidung nach Dokumenttyp (DOCX, PDF, TXT).</p> </p>`;

    this.gridStack_1005 = `Favorisierte Dokumente`;
    this.gridStack_1005Detail = `<p> 
                                 • Fügen Sie wichtige Dokumente zu Favoriten hinzu. <br> 
                                 • Greifen Sie mit einem Klick auf Ihre favorisierten Dokumente zu. <br> 
                                 • Sternsymbol, um den Favoritenstatus anzuzeigen.</p>`;

    this.gridStack_1006 = `Favorisierte Listen`;
    this.gridStack_1006Detail = `<p> 
                                • Fügen Sie häufig verwendete Listen zu Favoriten hinzu. <br> 
                                • Visuelle Organisation mit speziellen Symbol- und Farbdesigns. <br> 
                                • Einfacher Zugriff auf alle Listen über den "Listen"-Link. </p>`;

    this.gridStack_1007 = `Favorisierte Berichte`;
    this.gridStack_1007Detail = `<p> 
                                • Speichern Sie wichtige Berichte in Favoriten. <br> 
                                • Greifen Sie über den "Berichte"-Link auf alle Berichte zu. <br> 
                                • Schneller Zugriff auf häufig verwendete Berichte.</p>`;

    this.gridStack_1008 = `Gesamtprozesse`;
    this.gridStack_1008Detail = `<p>     
                                 • Umfassende Übersicht über die von Ihnen gestarteten Prozesse. <br>
                                 • Verfolgen Sie Prozesse, an denen Sie beteiligt sind und die Sie abgeschlossen haben. <br>
                                 • Tägliche / wöchentliche / monatliche / jährliche Filteroptionen. <br>
                                 • Ein-Klick-Zugriff auf Prozessdetails. <br>
                                 • Möglichkeit, die Symbolfarben anzupassen.</p> </p>`;

    this.gridStack_1009 = `Aktivitäten`;
    this.gridStack_1009Detail = `<p> 
                                • Tägliche/wöchentliche/monatliche Aktivitätsverfolgung. <br>
                                • Visuelle Überwachung Ihres Workflows. <br>
                                • Tools zur Steigerung Ihrer Prozesseffizienz.</p>`;

    this.gridStack_1010 = `Aufgabenleistung`;
    this.gridStack_1010Detail = `<p> 
                                 • Monatliche Verfolgung zugewiesener Aufgaben. <br>
                                 • Stündliche Analyse abgeschlossener und ausstehender Aufgaben. <br>
                                 • Messen und bewerten Sie Ihre Arbeitseffizienz.</p>`;

    this.gridStack_1011 = `Ihre favorisierten Dashboards`;
    this.gridStack_1011Detail = `<p> 
                                • Fügen Sie angepasste Analyse-Dashboards zu Favoriten hinzu. <br>
                                • Greifen Sie über den "Dashboards"-Link auf alle Dashboards zu. <br>
                                • Schneller Zugriff auf häufig verwendete Dashboards.</p>`;
    //Virtual Tour Widgets End

    this.dateCompare = "Das Enddatum muss nach dem Startdatum liegen.";

    this.ESign_MobileSign = "Elektronische Signatur / Mobile Signatur";

    this.Sign = "Unterschreiben";

    this.DataNotFound = "Kein Eintrag Gefunden";

    this.Contains = "Enthält";

    this.MissingCardNumber = 'Fehlende Kartennummer';
    this.InvalidCardNumber = 'Ungültige Kartennummer';
    this.FullNameControlForCreditCard = 'Vor Nachname müssen min. 4 Zeichen enthalten';
    this.InvalidAmountFormat = 'Bitte geben Sie einen gültigen Betrag ein';
    this.MissingExpirationDate = 'Fehlendes Ablaufdatum';
    this.InvalidDate = 'Ungültiges Datum';
    this.ExpiredDate = 'Abgelaufenes Datum';
    this.MissingCvv = 'Fehlender CVV';

    this.userProfilePhotoBox = 'Ziehen Sie Ihr Foto per Drag & Drop hierher oder <span class="filepond--label-action">laden Sie es hoch</span>';
    this.loadProfileImage = '<i class="fa fa-file-image"></i><span>Ihr hochgeladenes Bild</span>';
    this.avatarEdit = 'Avatar bearbeiten';
    this.delete = 'Löschen';
    this.setYourPhoto = '<i class="fa fa-crop-alt"></i><span>Legen Sie Ihr Bild fest</span>';
    this.labelFileTypeNotAllowed = 'Sie können nur JPG, JPEG, PNG Dateien hochladen!';
    this.labelMaxFileSizeExceeded = 'Die Dateigröße darf maximal 2MB betragen.';
    this.uploadProfilePhotoError = 'Profilbild konnte nicht hochgeladen werden.';
    this.removeProfilePhotoError = 'Profilbild konnte nicht entfernt werden.';

    this.AskConfirm = "Sind Sie sicher?";
    this.ExcelConfirm = "Line Item-Daten werden im Excel-Format heruntergeladen.";
    this.ExcelConfirmButtonText = "Ja, herunterladen";
    this.Cancel = "Abbrechen";
    this.SelectUserOrGroup = "Bitte wählen Sie eine Gruppe oder einen Benutzer aus";
}

