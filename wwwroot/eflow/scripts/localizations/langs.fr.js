var EFlang = new function () {
    this.localeCode = "fr";
    this.noRecordsFound = "Aucun enregistrement trouvé.";
    this.Save = "Sauvegarder";
    this.Currency = "EUR";
    this.UploadText = "Sélectionner un fichier";
    this.CancelText = "Annuler";
    this.UploadFailText = "Échec du téléchargement";
    this.RetryText = "Réessayer";
    this.waitingForResponseText = "Traitement en cours ...";
    this.PleaseWait = "Veuillez patienter ...";
    this.FileRequired = "Vous devez sélectionner un fichier";
    this.StartProcess = 'Êtes-vous sûr de vouloir démarrer le processus {0}?';
    this.GridRequiredError = 'Vous devez entrer tous les champs obligatoires avant de continuer';
    this.Error = 'Erreur!';
    this.Warning = 'Avertissement';
    this.Required = "Veuillez remplir ce champ";
    this.MinLength = "S'il vous plaît, au moins {0} caractères sont nécessaires";
    this.UnknownError = "Erreur de serveur inconnue";
    this.WrongUsernameOrPassword = "Nom d'utilisateur ou mot de passe incorrect";
    this.CantConnectLdapServer = "Cant Connect Ldap Server";
    this.DateError = 'Format de date non valide. Le format de la date doit être comme mm.dd.yyyy ou une valeur prédéfinie (ex: 08.14.2016, Today ..). ';
    this.Required = "Ce champ ne peut pas être vide.",
    this.InvalidDate = "Veuillez insérer une date valide.",
    this.InvalidNumber = "Veuillez insérer un numéro valide.",
    this.Days = "Days",
    this.Minutes = "Minutes",
    this.Hours = "Heures",
    this.MoreThanDays = "Days",
    this.MoreThanMinutes = "Minutes",
    this.MoreThanHours = "Heures",
    this.MoreThan = "Plus que"
    this.LessThan = "Inférieur à";
    this.Close = "Fermer";

    this.F_Today = "Aujourd'hui";
    this.F_Yesterday = "Hier";
    this.F_ThisWeek = "Cette semaine";
    this.F_ThisMonth = "Ce mois-ci";
    this.F_ThisYear = "Cette année";
    this.F_CurrentUser = "CurrentUser ()";
    this.F_Days = "Jour (s)";
    this.F_Hours = "Heures";
    this.F_Minutes = "Minute (s)"

    this.GeoLocation_PERMISSION_DENIED = "L'utilisateur a refusé de partager sa géolocalisation";
    this.GeoLocation_POSITION_UNAVAILABLE = "Info non disponible";
    this.GeoLocation_TIMEOUT = "Délai d'attente";
    this.GeoLocation_UNKNOWN_ERROR = "Erreur inconnue";
    this.GeoLocation_NOT_SUPPORTED = "Le navigateur ne prend pas en charge";
    this.GeoLocation_ONLY_SECURE_ORIGINS = "Seules les origines sécurisées sont autorisées (https)";
    this.Clean_Up_OCR_Filled_Fields = "Effacer les champs remplis avec OCR ?";
    this.LoadingAndOcrParsing = "L'analyse OCR est en cours";
    this.AddFilter = "AJOUTER FİLTER";
    this.ReportDetail = "Rapport";
    this.DashboardDetail = "Dashboard";
    this.DashboardName = "Nom du tableau de bord";
    this.ReportName = "Rapport";

    this.Contains = "Contains";
    this.NotContains = "Ne contient pas";
    this.ThanBefore = "Qu'avant";
    this.LaterThan = "Plus tard que";
    this.DateRange = "Plage de dates";
    this.BiggerThan = "Plus grand que";
    this.SmallerThan = "Plus petit que";
    this.ExactMatch = "Correspondance exacte";
    this.FilterProcessName = "Processus: ";
    this.Savedsuccessfully = "Changements sauvegardés avec succès";

    this.FavouriteFilters = "Filtres favoris";
    this.LocationDataNotFound = "Données de localisation non trouvées";
    this.DeleteConfirm = "Êtes-vous sûr de vouloir supprimer?"
    this.Previous = "Précédent";
    this.Next = "Next";
    this.Total = "Total";
    this.RecordsOfListing = "";
    this.Loading = "Chargement ..";
    this.ShowMore = "Afficher plus";
    this.QueryRunSucceed = "Query Succeed";
    this.SpParameterValidate = "Entrez tous les paramètres de la procédure stockée";
    this.QueryNotDefined = "Requête non définie";
    this.FilterParameterVal = " Valeur du paramètre"

    this.FilterGroupNo = "Group No"
    this.FilterGroupName = "Group Name"
    this.FilterGroupMember = "Group Member"
    this.FilterGroupSpecCode = "Group Spec Code 1 ...5"

    this.FilterName = "Nom"
    this.FilterSurname = "Nom de famille"
    this.FilterUsername = "Nom d'utilisateur"
    this.FilterGroup = "Groupe"
    this.FilterStatus = "Statut"

    this.ReportSuccessful = "Créé avec succès"
    this.ReportFailed = "Un rapport portant le même nom existe déjà."

    this.FilterAllAssigned = "Toute";
    this.FilterAllAssignedBtnHover = "Utilisez l'élément de données TaskAssignedTo pour filtrer l'utilisateur affecté lié au processus";
    this.FilterProcesses = "PROCESSUS";
    this.FilterTask = " tâche ";
    this.FilterTotalTask = "Tâche totale";
    this.FilterAssigned = "Attribué: ";
    this.BarChartTitle = "UTILISATEURS ET GROUPES ASSIGNÉS";

    this.PanelUserGroupConfirm = "Les {1} enregistrements des {0} attribués seront répertoriés, confirmez-vous ?";

    this.PleaseSelect = "Sélectionner";

    this.EmptyStatusPieChart = "Les enregistrements d'état vides seront répertoriés, confirmez-vous ?";
    this.CountStatusPieChart = "les enregistrements seront répertoriés, confirmez-vous ?";

    this.Old = "Agé de";
    this.New = "Nouveau";
    this.Preview = "Aperçu";
    this.UnableToPreviewFile = "Impossible de prévisualiser le fichier";
    this.ItemsShowing = "Affichage de {0} éléments.";

    this.Next = 'Suivant';
    this.Prev = 'Précédent';
    this.Done = 'Terminé';

    //Virtual Tour Base Items Start
    this.dashboardTitle = `Bienvenue sur votre nouveau tableau de bord`;
    this.dashboardTitleDetail = `           
            <p>
               Votre tableau de bord est conçu pour suivre vos tâches quotidiennes et accéder rapidement aux fonctionnalités que vous utilisez fréquemment. Vous pouvez le personnaliser selon vos besoins et accéder instantanément à vos fonctionnalités préférées. Lors de la première utilisation, un tutoriel interactif vous guidera à travers toutes les fonctionnalités du tableau de bord. Pendant le tutoriel :
            </p>
            <p>
            • Vous verrez de courtes descriptions pour chaque fonctionnalité. <br>
            • Utilisez les boutons "Précédent" et "Suivant" pour naviguer entre les étapes. <br>
            • Vous pouvez fermer le tutoriel à tout moment et le relancer plus tard. 
            </p>
            <p>
            <h1 class="driver-title"> Travailler avec les widgets </h1>
            • Glisser & Déposer : Déplacez les widgets où vous le souhaitez sur la page. <br>
            • Redimensionnement : Ajustez la taille de chaque widget selon vos besoins. <br>
            • Modification : Ajoutez ou supprimez des widgets avec le bouton "+". 
            </p>
            `;

    this.condenseDashboard = `Affichage compact avec la condensation`;
    this.condenseDashboardDetail = `<p> Organisez automatiquement vos widgets de manière ordonnée. </p>`;
    this.undoDashboardChanges = `Revenir à la mise en page enregistrée`;
    this.undoDashboardChangesDetail = `<p> Revenez à votre mise en page enregistrée en un clic. </p>`;
    this.saveCurrentDashboard = `Enregistrer la mise en page`;
    this.saveCurrentDashboardDetail = `<p> Enregistrez votre mise en page actuelle pour une utilisation ultérieure. </p>`;
    this.addRemovePanel = `Personnalisez votre espace de travail avec le bouton Ajouter/Supprimer`;
    this.addRemovePanelDetail = `<p> Ajoutez ou supprimez de nouveaux widgets avec le bouton "+".  </p>`;
    //Virtual Tour Base Items End

    //Virtual Tour Widgets Start
    this.gridStack_998 = `Processus récents`;
    this.gridStack_998Detail = `<p>
                               • Consultez les processus que vous avez récemment utilisés. <br> 
                               • Cliquez sur un nom de processus pour en démarrer un nouveau. <br> 
                               • Personnalisez les couleurs des icônes. </p>`;

    this.gridStack_999 = `Listes récentes`;
    this.gridStack_999Detail = `<p>  
                               • Accédez rapidement à vos processus les plus utilisés. <br>  
                               • Distinguez facilement les processus grâce aux cartes visuelles. <br> 
                               • Personnalisez les icônes des processus. </p>`;

    this.gridStack_1000 = `Tâches en attente`;
    this.gridStack_1000Detail = `<p>   
                                • Consultez la liste de vos tâches assignées.  <br> 
                                • Accédez rapidement aux formulaires de tâches.  <br> 
                                • Triez les tâches selon différents critères. </p>`;

    this.gridStack_1001 = `Tâches quotidiennes`;
    this.gridStack_1001Detail = `<p>   
                                 • Suivez vos tâches quotidiennes en vue calendrier.  <br> 
                                 • Naviguez entre les jours avec les flèches directionnelles.  <br>
                                 • Cliquez sur une date pour voir les tâches associées. </p>`;

    this.gridStack_1002 = `Processus favoris`;
    this.gridStack_1002Detail = `<p>  
                                • Consultez les processus que vous utilisez le plus souvent. <br>
                                • Cliquez sur un nom de processus pour en démarrer un nouveau. <br>
                                • Personnalisez les couleurs des icônes. </p>`;

    this.gridStack_1003 = `Listes favorites`;
    this.gridStack_1003Detail = `<p>  
                                • Affichez vos listes les plus utilisées avec des icônes et couleurs personnalisées. <br> 
                                • Profitez d'une conception visuelle adaptée à chaque liste. <br> 
                                • Accédez rapidement à toutes vos listes via le lien "Listes". </p>`;

    this.gridStack_1004 = `Documents récents`;
    this.gridStack_1004Detail = `<p>  
                                 • Accédez immédiatement aux documents récemment consultés. <br> 
                                 • Cliquez sur un document pour en afficher le contenu. <br> 
                                 • Différenciez les documents par type (DOCX, PDF, TXT). </p> </p>`;

    this.gridStack_1005 = `Documents favoris`;
    this.gridStack_1005Detail = `<p>  
                                 • Ajoutez des documents importants à vos favoris. <br> 
                                 • Accédez à vos documents favoris en un clic. <br> 
                                 • Indiquez les documents favoris avec une étoile. </p>`;

    this.gridStack_1006 = `Listes favorites`;
    this.gridStack_1006Detail = `<p>  
                                • Ajoutez vos listes les plus utilisées aux favoris. <br> 
                                • Organisez-les visuellement avec des icônes et couleurs personnalisées. <br> 
                                • Accédez facilement à toutes vos listes via le lien "Listes".  </p>`;

    this.gridStack_1007 = `Rapports favoris`;
    this.gridStack_1007Detail = `<p>  
                                • Sauvegardez vos rapports importants dans vos favoris. <br> 
                                • Accédez à tous vos rapports via le lien "Rapports". <br> 
                                • Consultez rapidement vos rapports les plus utilisés. </p>`;

    this.gridStack_1008 = `Processus globaux`;
    this.gridStack_1008Detail = `<p>      
                                 • Obtenez une vue d'ensemble des processus que vous avez lancés. <br>
                                 • Suivez les processus auxquels vous participez et ceux que vous avez terminés. <br>
                                 • Filtrez par jour/semaine/mois/année. <br>
                                 • Accédez aux détails des processus en un clic. <br>
                                 • Personnalisez les couleurs des icônes. </p> </p>`;

    this.gridStack_1009 = `Activités`;
    this.gridStack_1009Detail = `<p>  
                                • Suivez vos activités quotidiennes, hebdomadaires et mensuelles. <br>
                                • Visualisez votre flux de travail. <br>
                                • Améliorez votre efficacité avec des outils d'analyse. </p>`;

    this.gridStack_1010 = `Performance des tâches`;
    this.gridStack_1010Detail = `<p>  
                                 • Suivez mensuellement vos tâches assignées. <br>
                                 • Analysez les tâches complétées et en attente par heure. <br>
                                 • Évaluez votre productivité. </p>`;

    this.gridStack_1011 = `Vos Tableaux de Bord Favoris`;
    this.gridStack_1011Detail = `<p>  
                            • Ajoutez vos tableaux de bord d'analyse personnalisés aux favoris. <br>
                            • Accédez à tous les tableaux de bord via le lien "Tableaux de bord". <br>
                            • Accès rapide aux tableaux de bord fréquemment utilisés. </p>`;
    //Virtual Tour Widgets End

    this.dateCompare = "La date de fin doit être postérieure à la date de début.";

    this.ESign_MobileSign = "Signature Électronique / Signature Mobile";

    this.Sign = "Signer";

    this.DataNotFound = "Enregistrement Introuvable";

    this.Contains = "Contient";

    this.MissingCardNumber = 'Numéro de carte manquant';
    this.InvalidCardNumber = 'Numéro de carte invalide';
    this.FullNameControlForCreditCard = 'Le nom complet doit comporter au moins 4 caractères';
    this.InvalidAmountFormat = 'Veuillez saisir un montant valide';
    this.MissingExpirationDate = 'Date d’expiration manquante';
    this.InvalidDate = 'Date invalide';
    this.ExpiredDate = 'Date expirée';
    this.MissingCvv = 'CVV manquant';

    this.userProfilePhotoBox = 'Glissez-déposez votre photo ou <span class="filepond--label-action">téléchargez-la</span>';
    this.loadProfileImage = '<i class="fa fa-file-image"></i><span>Votre image téléchargée</span>';
    this.avatarEdit = 'Modification d\'avatar';
    this.delete = 'Supprimer';
    this.setYourPhoto = '<i class="fa fa-crop-alt"></i><span>Définir votre photo</span>';
    this.labelFileTypeNotAllowed = 'Vous ne pouvez télécharger que des fichiers JPG, JPEG, PNG!';
    this.labelMaxFileSizeExceeded = 'La taille du fichier doit être au maximum de 2MB.';
    this.uploadProfilePhotoError = 'L\'image de profil n\'a pas pu être téléchargée.';
    this.removeProfilePhotoError = 'L\'image de profil n\'a pas pu être supprimée.';

    this.AskConfirm = "Êtes-vous sûr ?";
    this.ExcelConfirm = "Les données Line Item seront téléchargées au format Excel.";
    this.ExcelConfirmButtonText = "Oui, télécharger";
    this.Cancel = "Annuler";
    this.SelectUserOrGroup = "Veuillez sélectionner un groupe ou un utilisateur";
}