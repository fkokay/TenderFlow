var EFlang = new function () {
    this.localeCode = "pl";
    this.noRecordsFound = "Nie znaleziono rekordów.";
    this.Save = "Ratować";
    this.Currency = "PLN";
    this.UploadText = "Wybierz plik";
    this.CancelText = "Anuluj";
    this.UploadFailText = "Błąd przesyłania";
    this.RetryText = "Retry";
    this.waitingForResponseText = "Przetwarzanie ...";
    this.PleaseWait = "Proszę czekać ...";
    this.FileRequired = "Musisz wybrać plik";
    this.StartProcess = 'Czy na pewno chcesz rozpocząć proces {0}?';
    this.GridRequiredError = 'Przed kontynuowaniem musisz wprowadzić wszystkie wymagane pola';
    this.Error = 'Błąd!';
    this.Warning = 'Ostrzeżenie';
    this.Required = "Proszę wypełnić to pole";
    this.MinLength = "Proszę, przynajmniej {0} znaków jest wymaganych";
    this.UnknownError = "Nieznany błąd serwera";
    this.WrongUsernameOrPassword = "Zła nazwa użytkownika lub hasło";
    this.CantConnectLdapServer = "Nie można połączyć się z serwerem Ldap";
    this.DateError = 'Niepoprawny format daty. Format daty musi być podobny do mm.dd.rrrr lub wstępnie zdefiniowanej wartości (np .: 08.14.2016, dziś ..)';
    this.Required = "To pole nie może być puste.",
    this.InvalidDate = "Proszę wprowadzić poprawną datę.",
    this.InvalidNumber = "Proszę wprowadzić poprawny numer.",
    this.Days = "Dni",
    this.Minutes = "Minuty",
    this.Hours = "Godziny",
    this.MoreThanDays = "Dni",
    this.MoreThanMinutes = "Minuty",
    this.MoreThanHours = "Godziny",
    this.MoreThan = "Więcej niż"
    this.LessThan = "Mniej niż";
    this.Close = "Zamknąć";

    this.F_Today = "Dzisiaj";
    this.F_Yesterday = "Wczoraj";
    this.F_ThisWeek = "Ten tydzień";
    this.F_ThisMonth = "W tym miesiącu";
    this.F_ThisYear = "Ten rok";
    this.F_CurrentUser = "CurrentUser()";
    this.F_Days = "Dni";
    this.F_Hours = "Godziny";
    this.F_Minutes = "Minuty"

    this.GeoLocation_PERMISSION_DENIED = "Użytkownik odmówił udostępnienia swojej geolokalizacji";
    this.GeoLocation_POSITION_UNAVAILABLE = "Informacje niedostępne";
    this.GeoLocation_TIMEOUT = "Limit czasu";
    this.GeoLocation_UNKNOWN_ERROR = 'Nieznany błąd';
    this.GeoLocation_NOT_SUPPORTED = "Przeglądarka nie obsługuje";
    this.GeoLocation_ONLY_SECURE_ORIGINS = "Dozwolone są tylko bezpieczne źródła (https)";
    this.Clean_Up_OCR_Filled_Fields = "Velden gevuld met OCR wissen?";
    this.LoadingAndOcrParsing = "OCR-analyse is bezig";
    this.AddFilter = "DODAJ FİLTER";
    this.ReportDetail = "Zgłoś";
    this.DashboardDetail = "Pulpit nawigacyjny";
    this.DashboardName = "Nazwa panelu";
    this.ReportName = "Nazwa raportu";

    this.Contains = "Zawiera";
    this.NotContains = "Nie zawiera";
    this.ThanBefore = "Niż przed";
    this.LaterThan = "Później niż";
    this.DateRange = "Zakres dat";
    this.BiggerThan = "Większy niż";
    this.SmallerThan = "Mniejsze niż";
    this.ExactMatch = "Dokładne dopasowanie";
    this.FilterProcessName = "Proces: ";
    this.Savedsuccessfully = "Zmiany zostały zapisane pomyślnie";

    this.FavouriteFilters = "Ulubione filtry";
    this.LocationDataNotFound = "Nie znaleziono danych lokalizacji";
    this.DeleteConfirm = "Czy na pewno chcesz usunąć?"
    this.Previous = "Poprzedni";
    this.Next = "Next";
    this.Total = 'Całkowity';
    this.RecordsOfListing = "";
    this.Loading = "Ładowanie ..";
    this.ShowMore = "Pokaż więcej";
    this.QueryRunSucceed = "Zapytanie zakończyło się pomyślnie";
    this.SpParameterValidate = "Wprowadź wszystkie parametry dla Stored Precedure";
    this.QueryNotDefined = "Nie zdefiniowano zapytania";
    this.FilterParameterVal = " Wartość parametru"

    this.FilterGroupNo = "Group No"
    this.FilterGroupName = "Group Name"
    this.FilterGroupMember = "Group Member"
    this.FilterGroupSpecCode = "Group Spec Code 1 ...5"

    this.FilterName = "Name"
    this.FilterSurname = "Surname"
    this.FilterUsername = "Username"
    this.FilterGroup = "Group"
    this.FilterStatus = "Status"

    this.ReportSuccessful = "Utworzono pomyślnie"
    this.ReportFailed = "Raport o identycznej nazwie już istnieje."

    this.FilterAllAssigned = "Wszystko";
    this.FilterAllAssignedBtnHover = "Użyj elementu danych TaskAssignedTo do filtrowania przypisanego użytkownika, który jest powiązany z procesem";
    this.FilterProcesses = "PROCESY";
    this.FilterTask = " zadanie ";
    this.FilterTotalTask = "Całkowite zadanie";
    this.FilterAssigned = "Przydzielony: ";
    this.BarChartTitle = "PRZYPISOWANI UŻYTKOWNICY I GRUPY";

    this.PanelUserGroupConfirm = "Rekordy {1} przypisanego {0} zostaną wyświetlone, czy potwierdzasz?";

    this.PleaseSelect = "Wybierz";

    this.EmptyStatusPieChart = "Zostaną wyświetlone puste rekordy statusu, czy potwierdzasz?";
    this.CountStatusPieChart = "rekordy zostaną wymienione, czy potwierdzasz?";

    this.Old = "Velho";
    this.New = "Novo";
    this.Preview = "Voorvertoning";
    this.UnableToPreviewFile = "Kan geen voorbeeld van bestand bekijken";
    this.ItemsShowing = "Wyświetlanie {0} elementów.";

    this.Next = 'Następny';
    this.Prev = 'Poprzedni';
    this.Done = 'Zakończ';

    //Virtual Tour Base Items Start
    this.dashboardTitle = `Witamy w Twoim nowym panelu`;
    this.dashboardTitleDetail = `           
            <p>
               Twój panel został zaprojektowany, aby pomóc Ci śledzić codzienne zadania i szybko uzyskać dostęp do najczęściej używanych funkcji. Możesz dostosować go do swoich potrzeb i natychmiast uzyskać dostęp do najczęściej używanych funkcji. Podczas pierwszego użycia możesz odkrywać wszystkie funkcje panelu krok po kroku dzięki przewodnikowi. Podczas wycieczki:
            </p>
            <p>
            • Zobaczysz krótkie opisy każdej funkcji. <br>
            • Możesz przechodzić między krokami za pomocą przycisków "Poprzedni" i "Następny". <br>
            • Możesz zamknąć wycieczkę w dowolnym momencie i uruchomić ją ponownie później. 
            </p>
            <p>
            <h1 class="driver-title"> Praca z widżetami </h1>
            • Przeciągnij i upuść: Możesz przenieść widżety w dowolne miejsce na stronie. <br>
            • Skalowanie: Możesz dostosować rozmiar każdego widżetu do swoich potrzeb. <br>
            • Edycja: Możesz dodać lub usunąć widżety za pomocą przycisku "+". 
            </p>
            `;

    this.condenseDashboard = `Widok kompaktowy po uporządkowaniu`;
    this.condenseDashboardDetail = `<p> Możesz automatycznie uporządkować widżety. </p>`;
    this.undoDashboardChanges = `Powrót do zapisanej wersji`;
    this.undoDashboardChangesDetail = `<p> Możesz jednym kliknięciem wrócić do zapisanej wersji układu. </p>`;
    this.saveCurrentDashboard = `Zapisz układ`;
    this.saveCurrentDashboardDetail = `<p> Zapisz swój obecny układ, aby móc go użyć później. </p>`;
    this.addRemovePanel = `Dostosuj obszar roboczy za pomocą przycisku Dodaj/Usuń`;
    this.addRemovePanelDetail = `<p> Możesz dodawać lub usuwać widżety za pomocą przycisku "+". </p>`;
    //Virtual Tour Base Items End

    //Virtual Tour Widgets Start
    this.gridStack_998 = `Ostatnie procesy`;
    this.gridStack_998Detail = `<p>
                               • Zobacz ostatnio używane procesy. <br> 
                               • Kliknij nazwę procesu, aby rozpocząć nowy. <br> 
                               • Dostosuj kolory ikon. </p>`;

    this.gridStack_999 = `Ostatnie listy`;
    this.gridStack_999Detail = `<p> 
                               • Uzyskaj szybki dostęp do najczęściej używanych procesów. <br>  
                               • Łatwo odróżniaj procesy dzięki wizualnym kartom. <br> 
                               • Personalizuj ikony procesów. </p>`;

    this.gridStack_1000 = `Oczekujące zadania`;
    this.gridStack_1000Detail = `<p>  
                                • Przeglądaj przypisane zadania.  <br> 
                                • Szybki dostęp do formularza zadania.  <br> 
                                • Sortuj zadania według różnych kryteriów. </p>`;

    this.gridStack_1001 = `Codzienne zadania`;
    this.gridStack_1001Detail = `<p>  
                                 • Śledź swoje codzienne zadania w widoku kalendarza.  <br> 
                                 • Nawiguj między dniami za pomocą strzałek.  <br>
                                 • Kliknij datę, aby zobaczyć zadania na ten dzień. </p>`;

    this.gridStack_1002 = `Najczęściej używane procesy`;
    this.gridStack_1002Detail = `<p> 
                                • Zobacz ostatnio używane procesy. <br>
                                • Kliknij nazwę procesu, aby rozpocząć nowy. <br>
                                • Dostosuj kolory ikon. </p>`;

    this.gridStack_1003 = `Najczęściej używane listy`;
    this.gridStack_1003Detail = `<p> 
                                • Najczęściej używane listy są wyświetlane ze specjalnymi ikonami i kolorami. <br> 
                                • Wizualne projekty dostosowane do każdej listy. <br> 
                                • Szybki dostęp do wszystkich list za pomocą linku "Listy". </p>`;

    this.gridStack_1004 = `Ostatnie dokumenty`;
    this.gridStack_1004Detail = `<p>  
                                 • Natychmiastowy dostęp do ostatnio otwieranych dokumentów. <br> 
                                 • Kliknij dokument, aby zobaczyć jego zawartość. <br> 
                                 • Różnicowanie dokumentów według typu (DOCX, PDF, TXT). </p>`;

    this.gridStack_1005 = `Ulubione dokumenty`;
    this.gridStack_1005Detail = `<p> 
                                 • Dodaj ważne dokumenty do ulubionych. <br> 
                                 • Szybki dostęp do ulubionych dokumentów jednym kliknięciem. <br> 
                                 • Oznaczanie ulubionych dokumentów za pomocą gwiazdek. </p>`;

    this.gridStack_1006 = `Listy ulubionych`;
    this.gridStack_1006Detail = `<p> 
                                 • Dodaj swoje ulubione listy do ulubionych. <br>
                                 • Organizacja wizualna dzięki specjalnym ikonom i projektom kolorów. <br>
                                 • Łatwy dostęp do wszystkich list dzięki linkowi Listy”. </p>`;

    this.gridStack_1007 = `Ulubione raporty`;
    this.gridStack_1007Detail = `<p> 
                                 • Zapisz ważne raporty w ulubionych. <br>
                                 • Dostęp do wszystkich raportów poprzez link „Raporty”. <br>
                                 • Szybki dostęp do często wykorzystywanych raportów. </p>`;

    this.gridStack_1008 = `Całkowita liczba procesów`;
    this.gridStack_1008Detail = `<p> 
                                 • Całościowy obraz zainicjowanych przez Ciebie procesów. <br>
                                 • Śledzenie procesów, w których brałeś udział i które ukończyłeś. <br>
                                 • Opcje filtrowania dziennego / tygodniowego / miesięcznego / rocznego. <br>
                                 • Dostęp do szczegółów procesu za pomocą jednego kliknięcia. <br>
                                 • Możliwość dostosowania kolorów ikon. </p> </p>`;

    this.gridStack_1009 = `Aktywności`;
    this.gridStack_1009Detail = `<p> 
                                 • Śledzenie aktywności dziennej/tygodniowej/miesięcznej. <br>
                                 • Wizualnie monitoruj swój przepływ pracy. <br>
                                 • Narzędzia zwiększające efektywność procesów. </p>`;

    this.gridStack_1010 = `Wydajność zadania`;
    this.gridStack_1010Detail = `<p> 
                                 • Miesięczna kontrola realizacji powierzonych zadań. <br>
                                 • Analiza zadań zakończonych i oczekujących na realizację w ujęciu godzinowym. <br>
                                 • Pomiar i ocena efektywności swojej pracy. </p>`;

    this.gridStack_1011 = `Ulubione panele`;
    this.gridStack_1011Detail = `<p> 
                                • Dodaj ulubione panele analizy do swojej listy. <br>
                                • Szybki dostęp do wszystkich paneli za pomocą linku "Panele". <br>
                                • Szybkie przejście do często używanych paneli. </p>`;
    //Virtual Tour Widgets End

    this.dateCompare = "Data zakończenia musi być późniejsza niż data rozpoczęcia.";

    this.ESign_MobileSign = "Podpis Elektroniczny / Podpis Mobilny";

    this.Sign = "Podpisz";

    this.DataNotFound = "Brak Rekordu";

    this.Contains = "Zawiera";

    this.MissingCardNumber = 'Brak numeru karty';
    this.InvalidCardNumber = 'Nieprawidłowy numer karty';
    this.FullNameControlForCreditCard = 'Imię i nazwisko musi mieć co najmniej 4 znaki';
    this.InvalidAmountFormat = 'Proszę wprowadzić prawidłową kwotę';
    this.MissingExpirationDate = 'Brak daty ważności';
    this.InvalidDate = 'Nieprawidłowa data';
    this.ExpiredDate = 'Przeterminowana data';
    this.MissingCvv = 'Brak CVV';

    this.userProfilePhotoBox = 'Przeciągnij i upuść swoje zdjęcie lub <span class="filepond--label-action">prześlij je</span>';
    this.loadProfileImage = '<i class="fa fa-file-image"></i><span>Twój przesłany obraz</span>';
    this.avatarEdit = 'Edycja awatara';
    this.delete = 'Usuń';
    this.setYourPhoto = '<i class="fa fa-crop-alt"></i><span>Ustaw swoje zdjęcie</span>';
    this.labelFileTypeNotAllowed = 'Możesz przesyłać tylko pliki JPG, JPEG, PNG!';
    this.labelMaxFileSizeExceeded = 'Rozmiar pliku musi wynosić co najwyżej 2MB.';
    this.uploadProfilePhotoError = 'Nie udało się przesłać obrazu profilowego.';
    this.removeProfilePhotoError = 'Nie udało się usunąć obrazu profilowego.';

    this.AskConfirm = "Czy jesteś pewien?";
    this.ExcelConfirm = "Dane Line Item zostaną pobrane w formacie Excel.";
    this.ExcelConfirmButtonText = "Tak, pobierz";
    this.Cancel = "Anuluj";
    this.SelectUserOrGroup = "Proszę wybrać grupę lub użytkownikl";
}