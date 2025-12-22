var EFlang = new function () {
    this.localeCode = "ru";
    this.noRecordsFound = "Записи не найдены";
    this.Save = "Сохранять";
    this.Currency = "RUB";
    this.UploadText = "Select File";
    this.CancelText = "Cancel";
    this.UploadFailText = "Upload Failed";
    this.RetryText = "Retry";
    this.waitingForResponseText = "Loading...";
    this.PleaseWait = "Please wait...";
    this.FileRequired = "You must select a file";
    this.StartProcess = 'Вы уверены, что хотите запустить процесс: {0}?';
    this.GridRequiredError = 'You must enter all the required fields before continue';
    this.Error = 'Error!';
    this.Warning = 'Warning';
    this.DateError = 'Invalid date format. Date format must be like mm.dd.yyyy or predefined value (ex: 08.14.2016, Today..).';
    this.Required = "This field cannot be empty.",
    this.InvalidDate = "Please insert a valid date.",
    this.InvalidNumber = "Please insert a valid number.",
    this.Days = "Days",
    this.Minutes = "Minutes",
    this.Hours = "Hours",
    this.MoreThanDays = "Days",
    this.MoreThanMinutes = "Minutes",
    this.MoreThanHours = "Hours",
    this.MoreThan = "More Than"
    this.LessThan = "Less Than";
    this.Close = "Закрывать";

    this.F_Today = "Today";
    this.F_Yesterday = "Yesterday";
    this.F_ThisWeek = "This Week";
    this.F_ThisMonth = "This Month";
    this.F_ThisYear = "This Year";
    this.F_CurrentUser = "CurrentUser()";
    this.F_Days = "Day(s)";
    this.F_Hours = "Часы";
    this.F_Minutes = "Minute(s)";
    this.Required = "Please fill this field";
    this.MinLength = "Please, at least {0} characters are necessary";
    this.UnknownError = "Unknown Server Error";
    this.WrongUsernameOrPassword = "Wrong Username Or Password";
    this.CantConnectLdapServer = "Cant Connect Ldap Server";

    this.GeoLocation_PERMISSION_DENIED = "User Denied to share his geoLocation";
    this.GeoLocation_POSITION_UNAVAILABLE = "Info not available";
    this.GeoLocation_TIMEOUT = "Timeout";
    this.GeoLocation_UNKNOWN_ERROR = "Unknown error";
    this.GeoLocation_NOT_SUPPORTED = "Browser doesnt support";
    this.GeoLocation_ONLY_SECURE_ORIGINS = "Only secure origins are allowed (https)";
    this.Clean_Up_OCR_Filled_Fields = "Очистить поля, заполненные OCR?";
    this.LoadingAndOcrParsing = "Анализ OCR продолжается";
    this.AddFilter = "ДОБАВИТЬ ФИЛЬТР";
    this.ReportDetail = "Деталь отчета";
    this.DashboardDetail = "Панель";
    this.DashboardName = "Название приборной панели";
    this.ReportName = "Имя отчета";

    this.Contains = "Содержит";
    this.NotContains = "Не содержит";
    this.ThanBefore = "Чем до";
    this.LaterThan = "Позже чем";
    this.DateRange = "Диапазон дат";
    this.BiggerThan = "Больше чем";
    this.SmallerThan = "Меньше чем";
    this.ExactMatch = "Точное совпадение";
    this.FilterProcessName = "Обработать: ";
    this.Savedsuccessfully = "Изменения успешно сохранены";

    this.FavouriteFilters = "Избранные фильтры";
    this.LocationDataNotFound = "Данные о местоположении не найдены";
    this.DeleteConfirm = "Вы уверены, что хотите удалить?"
    this.Previous = "Əvvəlki";
    this.Next = "Sonrakı";
    this.Total = "Всего записей";
    this.RecordsOfListing = "";
    this.Loading = "загрузка..";
    this.ShowMore = "Показать больше";
    this.QueryRunSucceed = "Добиться успеха";
    this.SpParameterValidate = "Введите все параметры";
    this.QueryNotDefined = "Не определено";
    this.FilterParameterVal = " Значение параметра"

    this.FilterGroupNo = "Group No"
    this.FilterGroupName = "Group Name"
    this.FilterGroupMember = "Group Member"
    this.FilterGroupSpecCode = "Group Spec Code 1 ...5"

    this.FilterName = "название"
    this.FilterSurname = "Фамилия"
    this.FilterUsername = "Имя пользователя"
    this.FilterGroup = "Группа"
    this.FilterStatus = "Положение дел"

    this.ReportSuccessful = "Создано успешно"
    this.ReportFailed = "Отчет с таким именем уже существует."

    this.FilterAllAssigned = "Все";
    this.FilterAllAssignedBtnHover = "Используйте элемент данных TaskAssignedTo для фильтрации Назначенного пользователя, связанного с процессом";
    this.FilterProcesses = "ПРОЦЕССЫ";
    this.FilterTask = " задача ";
    this.FilterTotalTask = "Общая задача";
    this.FilterAssigned = "Назначенный: ";
    this.BarChartTitle = "НАЗНАЧЕННЫЕ ПОЛЬЗОВАТЕЛИ И ГРУППА";

    this.PanelUserGroupConfirm = "Будет отображено {1} записей назначенного {0}, вы подтверждаете?";

    this.PleaseSelect = "Выбирать";

    this.EmptyStatusPieChart = "Будут перечислены пустые записи статуса, вы подтверждаете?";
    this.CountStatusPieChart = "записи будут перечислены, вы подтверждаете?";

    this.Old = "Старый";
    this.New = "Новый";
    this.Preview = "Превью";
    this.UnableToPreviewFile = "Невозможно просмотреть файл";
    this.ItemsShowing = "Показаны {0} элементов.";

    this.Next = 'Следующий';
    this.Prev = 'Предыдущий';
    this.Done = 'Завершить';

    //Virtual Tour Base Items Start
    this.dashboardTitle = `Добро пожаловать в вашу новую панель управления`;
    this.dashboardTitleDetail = `           
            <p>
               Ваша панель управления предназначена для отслеживания ваших ежедневных задач и быстрого доступа к часто используемым функциям. Вы можете настроить её под свои нужды и мгновенно получить доступ к самым важным функциям. При первом использовании появится интерактивное руководство, которое познакомит вас со всеми возможностями панели управления. Во время тура:
            </p>
            <p>
            • Вы увидите краткие описания каждой функции. <br>
            • Используйте кнопки "Назад" и "Далее" для перехода между шагами. <br>
            • Вы можете закрыть тур в любой момент и запустить его снова позже. 
            </p>
            <p>
            <h1 class="driver-title"> Работа с виджетами </h1>
            • Перетаскивание: перемещайте виджеты в любое место на странице. <br>
            • Изменение размера: настраивайте размеры виджетов по вашему усмотрению. <br>
            • Редактирование: добавляйте или удаляйте виджеты с помощью кнопки "+". 
            </p>
            `;

    this.condenseDashboard = `Компактный вид с автоматическим уплотнением`;
    this.condenseDashboardDetail = `<p> Автоматически организуйте виджеты в аккуратный порядок. </p>`;
    this.undoDashboardChanges = `Вернуться к сохранённому дизайну`;
    this.undoDashboardChangesDetail = `<p> Верните сохранённый макет одним нажатием. </p>`;
    this.saveCurrentDashboard = `Сохранить дизайн`;
    this.saveCurrentDashboardDetail = `<p> Сохраните текущий макет для последующего использования. </p>`;
    this.addRemovePanel = `Настройте рабочее пространство с помощью кнопки "Добавить/Удалить"`;
    this.addRemovePanelDetail = `<p> Добавляйте или удаляйте виджеты с помощью кнопки "+".  </p>`;
    //Virtual Tour Base Items End

    //Virtual Tour Widgets Start
    this.gridStack_998 = `Последние процессы`;
    this.gridStack_998Detail = `<p> 
                               • Просматривайте недавно использованные процессы. <br> 
                               • Нажмите на название процесса, чтобы начать новый. <br> 
                               • Настройте цвета значков. </p>`;

    this.gridStack_999 = `Последние списки`;
    this.gridStack_999Detail = `<p>  
                               • Быстро переходите к наиболее часто используемым процессам. <br>  
                               • Легко различайте процессы с помощью визуальных карточек. <br> 
                               • Персонализируйте значки процессов. </p>`;

    this.gridStack_1000 = `Ожидающие задачи`;
    this.gridStack_1000Detail = `<p>   
                                • Просматривайте список назначенных вам задач.  <br> 
                                • Быстро переходите к форме задачи.  <br> 
                                • Сортируйте задачи по различным критериям. </p>`;

    this.gridStack_1001 = `Ежедневные задачи`;
    this.gridStack_1001Detail = `<p>   
                                 • Отслеживайте свои ежедневные задачи в виде календаря.  <br> 
                                 • Переключайтесь между днями с помощью стрелок.  <br>
                                 • Нажмите на дату, чтобы увидеть задачи на этот день. </p>`;

    this.gridStack_1002 = `Избранные процессы`;
    this.gridStack_1002Detail = `<p>  
                                • Просматривайте часто используемые процессы. <br>
                                • Нажмите на название процесса, чтобы начать новый. <br>
                                • Настройте цвета значков. </p>`;

    this.gridStack_1003 = `Избранные списки`;
    this.gridStack_1003Detail = `<p>  
                                • Просматривайте ваши самые часто используемые списки с индивидуальными значками и цветами. <br> 
                                • Используйте визуальный дизайн для удобства. <br> 
                                • Быстро переходите ко всем спискам через ссылку "Списки". </p>`;

    this.gridStack_1004 = `Последние документы`;
    this.gridStack_1004Detail = `<p>  
                                 • Быстро получайте доступ к недавно открытым документам. <br> 
                                 • Нажмите на документ, чтобы просмотреть его содержимое. <br> 
                                 • Различайте документы по типу (DOCX, PDF, TXT). </p> </p>`;

    this.gridStack_1005 = `Избранные документы`;
    this.gridStack_1005Detail = `<p>  
                                 • Добавляйте важные документы в избранное. <br> 
                                 • Быстро получайте доступ к избранным документам одним кликом. <br> 
                                 • Отмечайте избранные документы звёздочкой. </p>`;

    this.gridStack_1006 = `Избранные списки`;
    this.gridStack_1006Detail = `<p>  
                                • Добавляйте часто используемые списки в избранное. <br> 
                                • Организуйте их визуально с помощью значков и цветов. <br> 
                                • Быстро переходите ко всем спискам через ссылку "Списки".  </p>`;

    this.gridStack_1007 = `Избранные отчёты`;
    this.gridStack_1007Detail = `<p>  
                                • Сохраните важные отчёты в избранное. <br> 
                                • Доступ ко всем отчётам через ссылку "Отчёты". <br> 
                                • Быстро находите наиболее часто используемые отчёты. </p>`;


    this.gridStack_1008 = `Общие Процессы`;
    this.gridStack_1008Detail = `<p>      
                             • Полный обзор запущенных вами процессов. <br>
                             • Отслеживание процессов, в которых вы участвуете и которые завершили. <br>
                             • Опции фильтрации по дням/неделям/месяцам/годам. <br>
                             • Доступ к деталям процесса одним щелчком. <br>
                             • Возможность настройки цветов иконок. </p>`;

    this.gridStack_1009 = `Активности`;
    this.gridStack_1009Detail = `<p>  
                            • Ежедневное/еженедельное/ежемесячное отслеживание активностей. <br>
                            • Визуальное отслеживание вашего рабочего процесса. <br>
                            • Инструменты для повышения эффективности процессов. </p>`;

    this.gridStack_1010 = `Производительность Задач`;
    this.gridStack_1010Detail = `<p>  
                             • Ежемесячное отслеживание назначенных задач. <br>
                             • Анализ завершенных и ожидающих задач с почасовой разбивкой. <br>
                             • Измерение и оценка вашей рабочей эффективности. </p>`;

    this.gridStack_1011 = `Ваши Избранные Панели`;
    this.gridStack_1011Detail = `<p>  
                            • Добавление пользовательских аналитических панелей в избранное. <br>
                            • Доступ ко всем панелям через ссылку "Панели". <br>
                            • Быстрый доступ к часто используемым панелям. </p>`;
    //Virtual Tour Widgets End

    this.dateCompare = "Дата окончания должна быть позже даты начала.";

    this.ESign_MobileSign = "Электронная подпись / Мобильная подпись";

    this.Sign = "Подпишите";

    this.DataNotFound = "Запись Не Найдена";

    this.Contains = "Содержит";

    this.MissingCardNumber = 'Отсутствует номер карты';
    this.InvalidCardNumber = 'Неверный номер карты';
    this.FullNameControlForCreditCard = 'Имя и фамилия должны содержать минимум 4 символа';
    this.InvalidAmountFormat = 'Пожалуйста, введите допустимую сумму';
    this.MissingExpirationDate = 'Отсутствует срок действия';
    this.InvalidDate = 'Неверная дата';
    this.ExpiredDate = 'Истекший срок';
    this.MissingCvv = 'Отсутствует CVV';

    this.userProfilePhotoBox = 'Перетащите ваше фото или <span class="filepond--label-action">загрузите его</span>';
    this.loadProfileImage = '<i class="fa fa-file-image"></i><span>Ваше загруженное изображение</span>';
    this.avatarEdit = 'Редактирование аватара';
    this.delete = 'Удалить';
    this.setYourPhoto = '<i class="fa fa-crop-alt"></i><span>Установите ваше фото</span>';
    this.labelFileTypeNotAllowed = 'Вы можете загружать только файлы JPG, JPEG, PNG!';
    this.labelMaxFileSizeExceeded = 'Размер файла должен быть не более 2MB.';
    this.uploadProfilePhotoError = 'Не удалось загрузить изображение профиля.';
    this.removeProfilePhotoError = 'Не удалось удалить изображение профиля.';

    this.AskConfirm = "Вы уверены?";
    this.ExcelConfirm = "Данные Line Item будут загружены в формате Excel.";
    this.ExcelConfirmButtonText = "Да, загрузить";
    this.Cancel = "Отмена";
    this.SelectUserOrGroup = "Пожалуйста, выберите группу или пользователя";
}

