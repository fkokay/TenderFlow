var EFlang = new function () {
    this.localeCode = "es";
    this.noRecordsFound = "No se encontraron registros.";
    this.Save = "Ahorrar";
    this.Currency = "EUR";
    this.UploadText = "Elegir archivo";
    this.CancelText = "cancelación";
    this.UploadFailText = "Carga fallida";
    this.RetryText = "Intenta nuevamente";
    this.waitingForResponseText = "cargando...";
    this.PleaseWait = "Por favor espera ...";
    this.FileRequired = "Seleccione Archivo";
    this.StartProcess = '¿Está seguro de que desea iniciar el proceso denominado "{0}"?';
    this.GridRequiredError = 'ingrese todos los campos obligatorios';
    this.Error = 'error!';
    this.Warning = 'advertencia';
    this.DateError = 'El formato de fecha es incorrecto';
    this.Required = "Este campo es obligatorio.",
    this.InvalidDate = "Por favor, introduzca una fecha válida.",
    this.InvalidNumber = "Por favor ingrese un número válido",
    this.Days = "día",
    this.Minutes = "minuto",
    this.Hours = "hora",
    this.MoreThanDays = "Dias",
    this.MoreThanMinutes = "Minutos",
    this.MoreThanHours = "Horas",
    this.MoreThan = "Mas que"
    this.LessThan = "Menos que";
    this.Close = "Cerca";

    this.F_Today = "hoy";
    this.F_Yesterday = "ayer";
    this.F_ThisWeek = "Esta semana";
    this.F_ThisMonth = "Este mes";
    this.F_ThisYear = "Este año";
    this.F_CurrentUser = "CurrentUser()";
    this.F_Days = "día";
    this.F_Hours = "Horas";
    this.F_Minutes = "minuto";
    this.Required = "Debes completar este campo";
    this.MinLength = "Ingrese al menos {0} caracteres";
    this.UnknownError = "Error desconocido";
    this.WrongUsernameOrPassword = "Nombre de usuario o contraseña incorrectos";
    this.CantConnectLdapServer = "No se pudo conectar con el servidor Ldap";

    this.GeoLocation_PERMISSION_DENIED = "El usuario se negó a compartir información.";
    this.GeoLocation_POSITION_UNAVAILABLE = "la información no está disponible.";
    this.GeoLocation_TIMEOUT = "Se acabó el tiempo";
    this.GeoLocation_UNKNOWN_ERROR = "Un error desconocido";
    this.GeoLocation_NOT_SUPPORTED = "El navegador utilizado no admite esta función.";
    this.GeoLocation_ONLY_SECURE_ORIGINS = "Requiere una conexión segura. (HTTPS)";
    this.Clean_Up_OCR_Filled_Fields = "¿Borrar campos llenos de OCR?";
    this.LoadingAndOcrParsing = "El análisis de OCR está en curso";
    this.AddFilter = "AÑADIR FILTRO";
    this.ReportDetail = "Detención de Rapor";
    this.DashboardDetail = "Detalle del tablero";
    this.DashboardName = "Nombre del tablero";
    this.ReportName = "Nombre de Reporte";

    this.Contains = "Contiene";
    this.NotContains = "No contiene";
    this.ThanBefore = "Than Before";
    this.LaterThan = "Más tarde que";
    this.DateRange = "Rango de fechas";
    this.BiggerThan = "Más grande que";
    this.SmallerThan = "Más pequeño que";
    this.ExactMatch = "Exact Match";
    this.FilterProcessName = "Proceso: ";
    this.Savedsuccessfully = "Los cambios se guardaron exitosamente";

    this.FavouriteFilters = "Filtros favoritos";
    this.LocationDataNotFound = "Datos de ubicación no encontrados";
    this.DeleteConfirm = "¿Está seguro de que desea eliminar?"
    this.Previous = "Previous";
    this.Next = "Siguiente";
    this.Total = "Total";
    this.RecordsOfListing = "";
    this.Loading = "Cargando..";
    this.ShowMore = "Mostrar más";
    this.QueryRunSucceed = "Consulta exitosa";
    this.SpParameterValidate = "Ingrese todos los parámetros para el procedimiento almacenado";
    this.QueryNotDefined = "Consulta no definida";
    this.FilterParameterVal = " Valor de parámetro"

    this.FilterGroupNo = "Group No"
    this.FilterGroupName = "Group Name"
    this.FilterGroupMember = "Group Member"
    this.FilterGroupSpecCode = "Group Spec Code 1 ...5"

    this.FilterName = "Nombre"
    this.FilterSurname = "Apellido"
    this.FilterUsername = "Nombre de usuario"
    this.FilterGroup = "Grupo"
    this.FilterStatus = "Estado"

    this.ReportSuccessful = "Creado con éxito"
    this.ReportFailed = "Ya existe un informe con el mismo nombre."

    this.FilterAllAssigned = "Todas";
    this.FilterAllAssignedBtnHover = "Utilice el elemento de datos TaskAssignedTo para filtrar el usuario asignado que se relacionó con el proceso";
    this.FilterProcesses = "PROCESOS";
    this.FilterTask = " tarea ";
    this.FilterTotalTask = "Tarea total";
    this.FilterAssigned = "Asignada: ";
    this.BarChartTitle = "USUARIOS Y GRUPOS ASIGNADOS";

    this.PanelUserGroupConfirm = "Se enumerarán los {1} registros del {0} asignado, ¿lo confirma?";

    this.PleaseSelect = "Seleccione";

    this.EmptyStatusPieChart = "Se enumerarán los registros de estado vacíos, ¿lo confirma?";
    this.CountStatusPieChart = "se enumerarán los registros, ¿lo confirma?";

    this.Old = "Antiguo";
    this.New = "Nuevo";
    this.Preview = "Avance";
    this.UnableToPreviewFile = "No se puede obtener una vista previa del archivo";
    this.ItemsShowing = "Mostrando {0} elementos.";

    this.Next = 'Siguiente';
    this.Prev = 'Anterior';
    this.Done = 'Completado';

    //Virtual Tour Base Items Start
    this.dashboardTitle = `Bienvenido a su nuevo panel de control`;
    this.dashboardTitleDetail = `           
            <p>
               Su panel de control está diseñado para realizar un seguimiento de sus tareas diarias y acceder rápidamente a las funciones que usa con frecuencia. Puede personalizarlo según sus necesidades y acceder instantáneamente a sus funciones favoritas. En el primer uso, un tutorial interactivo lo guiará a través de todas las funciones del panel de control. Durante el tutorial:
            </p>
            <p>
            •Verá breves descripciones de cada función. <br>
            •Utilice los botones "Anterior" y "Siguiente" para navegar entre los pasos. <br>
            •Puede cerrar el tutorial en cualquier momento y volver a iniciarlo más tarde. 
            </p>
            <p>
            <h1 class="driver-title"> Trabajando con widgets </h1>
            •Arrastrar y soltar: Mueva los widgets donde desee en la página. <br>
            •Redimensionar: Ajuste el tamaño de cada widget según sus necesidades. <br>
            •Edición: Agregue o elimine widgets con el botón "+". 
            </p>
            `;

    this.condenseDashboard = `Vista compacta con condensación`;
    this.condenseDashboardDetail = `<p>Organice automáticamente sus widgets de manera ordenada. </p>`;
    this.undoDashboardChanges = `Volver al diseño guardado`;
    this.undoDashboardChangesDetail = `<p>Vuelva a su diseño guardado con un solo clic. </p>`;
    this.saveCurrentDashboard = `Guardar diseño`;
    this.saveCurrentDashboardDetail = `<p>Guarde su diseño actual para usarlo más tarde. </p>`;
    this.addRemovePanel = `Personalice su espacio de trabajo con el botón Agregar/Eliminar`;
    this.addRemovePanelDetail = `<p>Agregue o elimine nuevos widgets con el botón "+".  </p>`;
    //Virtual Tour Base Items End

    //Virtual Tour Widgets Start
    this.gridStack_998 = `Procesos recientes`;
    this.gridStack_998Detail = `<p>
                               • Vea los procesos que ha utilizado recientemente. <br> 
                               • Haga clic en un nombre de proceso para iniciar uno nuevo. <br> 
                               • Personalice los colores de los iconos.</p>`;

    this.gridStack_999 = `Listas recientes`;
    this.gridStack_999Detail = `<p> 
                               • Acceda rápidamente a sus procesos más utilizados. <br>  
                               • Distinga fácilmente los procesos mediante tarjetas visuales. <br> 
                               • Personalice los iconos de los procesos.</p>`;

    this.gridStack_1000 = `Tareas pendientes`;
    this.gridStack_1000Detail = `<p>  
                                • Consulte la lista de sus tareas asignadas.  <br> 
                                • Acceda rápidamente a los formularios de tareas.  <br> 
                                • Ordene las tareas según diferentes criterios.</p>`;

    this.gridStack_1001 = `Tareas diarias`;
    this.gridStack_1001Detail = `<p>  
                                 • Siga sus tareas diarias en vista de calendario.  <br> 
                                 • Navegue entre los días con las flechas direccionales.  <br>
                                 • Haga clic en una fecha para ver las tareas asociadas.</p>`;

    this.gridStack_1002 = `Procesos favoritos`;
    this.gridStack_1002Detail = `<p> 
                                • Consulte los procesos que usa con más frecuencia. <br>
                                • Haga clic en un nombre de proceso para iniciar uno nuevo. <br>
                                • Personalice los colores de los iconos.</p>`;

    this.gridStack_1003 = `Listas favoritas`;
    this.gridStack_1003Detail = `<p> 
                                • Vea sus listas más utilizadas con iconos y colores personalizados. <br> 
                                • Disfrute de un diseño visual adaptado a cada lista. <br> 
                                • Acceda rápidamente a todas sus listas a través del enlace "Listas".</p>`;

    this.gridStack_1004 = `Documentos recientes`;
    this.gridStack_1004Detail = `<p> 
                                 • Acceda inmediatamente a los documentos consultados recientemente. <br> 
                                 • Haga clic en un documento para ver su contenido. <br> 
                                 • Diferencie los documentos por tipo (DOCX, PDF, TXT).</p> </p>`;

    this.gridStack_1005 = `Documentos favoritos`;
    this.gridStack_1005Detail = `<p> 
                                 • Agregue documentos importantes a sus favoritos. <br> 
                                 • Acceda a sus documentos favoritos con un solo clic. <br> 
                                 • Indique los documentos favoritos con una estrella.</p>`;

    this.gridStack_1006 = `Listas favoritas`;
    this.gridStack_1006Detail = `<p> 
                                • Agregue sus listas más utilizadas a favoritos. <br> 
                                • Organícelas visualmente con iconos y colores personalizados. <br> 
                                • Acceda fácilmente a todas sus listas a través del enlace "Listas". </p>`;

    this.gridStack_1007 = `Informes favoritos`;
    this.gridStack_1007Detail = `<p> 
                                • Guarde sus informes importantes en favoritos. <br> 
                                • Acceda a todos sus informes a través del enlace "Informes". <br> 
                                • Consulte rápidamente sus informes más utilizados.</p>`;

    this.gridStack_1008 = `Procesos globales`;
    this.gridStack_1008Detail = `<p>     
                                 • Obtenga una vista general de los procesos que ha iniciado. <br>
                                 • Siga los procesos en los que participa y los que ha completado. <br>
                                 • Filtre por día/semana/mes/año. <br>
                                 • Acceda a los detalles del proceso con un solo clic. <br>
                                 • Personalice los colores de los iconos.</p> </p>`;

    this.gridStack_1009 = `Actividades`;
    this.gridStack_1009Detail = `<p> 
                                • Siga sus actividades diarias, semanales y mensuales. <br>
                                • Visualice su flujo de trabajo. <br>
                                • Mejore su eficiencia con herramientas de análisis.</p>`;

    this.gridStack_1010 = `Desempeño de tareas`;
    this.gridStack_1010Detail = `<p> 
                                 • Siga mensualmente sus tareas asignadas. <br>
                                 • Analice las tareas completadas y pendientes por hora. <br>
                                 • Evalúe su productividad.</p>`;

    this.gridStack_1011 = `Tus Paneles Favoritos`;
    this.gridStack_1011Detail = `<p> 
                            • Añade tus paneles de análisis personalizados a favoritos. <br>
                            • Accede a todos los paneles a través del enlace "Paneles". <br>
                            • Acceso rápido a los paneles más utilizados.</p>`;
   //Virtual Tour Widgets End

    this.dateCompare = "La fecha de finalización debe ser posterior a la fecha de inicio.";

    this.ESign_MobileSign = "Firma Electrónica / Firma Móvil";

    this.Sign = "Firmar";

    this.DataNotFound = "Registro No Encontrado";

    this.Contains = "Contiene";

    this.MissingCardNumber = 'Número de tarjeta faltante';
    this.InvalidCardNumber = 'Número de tarjeta inválido';
    this.FullNameControlForCreditCard = 'El nombre completo debe tener al menos 4 caracteres';
    this.InvalidAmountFormat = 'Por favor, introduzca una cantidad válida';
    this.MissingExpirationDate = 'Fecha de expiración faltante';
    this.InvalidDate = 'Fecha inválida';
    this.ExpiredDate = 'Fecha caducada';
    this.MissingCvv = 'CVV faltante';

    this.userProfilePhotoBox = 'Arrastra y suelta tu foto o <span class="filepond--label-action">cárgala</span>';
    this.loadProfileImage = '<i class="fa fa-file-image"></i><span>Tu imagen subida</span>';
    this.avatarEdit = 'Edición de avatar';
    this.delete = 'Eliminar';
    this.setYourPhoto = '<i class="fa fa-crop-alt"></i><span>Establece tu foto</span>';
    this.labelFileTypeNotAllowed = '¡Solo puedes subir archivos JPG, JPEG, PNG!';
    this.labelMaxFileSizeExceeded = 'El tamaño del archivo debe ser como máximo 2MB.';
    this.uploadProfilePhotoError = 'No se pudo subir la imagen de perfil.';
    this.removeProfilePhotoError = 'No se pudo eliminar la imagen de perfil.';

    this.AskConfirm = "¿Está seguro?";
    this.ExcelConfirm = "Los datos de Line Item se descargarán en formato Excel.";
    this.ExcelConfirmButtonText = "Sí, descargar";
    this.Cancel = "Cancelar";
    this.SelectUserOrGroup = "Por favor, seleccione un grupo o un usuario";
}