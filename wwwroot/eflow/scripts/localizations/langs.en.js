var EFlang = new function () {
    this.localeCode = "en";
    this.noRecordsFound = "No records found.";
    this.Save = "Save";
    this.Currency = "USD";
    this.UploadText = "Select File";
    this.CancelText = "Cancel";
    this.UploadFailText = "Upload Failed";
    this.RetryText = "Retry";
    this.waitingForResponseText = "Loading...";
    this.PleaseWait = "Please wait...";
    this.FileRequired = "You must select a file";
    this.StartProcess = 'Are you sure you wish to start the process {0}?';
    this.GridRequiredError = 'You must enter all the required fields before continue';
    this.Error = 'Error!';
    this.Warning = 'Warning';
    this.Required = "Please fill this field";
    this.MinLength = "Please, at least {0} characters are necessary";
    this.UnknownError = "Unknown Server Error";
    this.WrongUsernameOrPassword = "Wrong Username Or Password";
    this.CantConnectLdapServer = "Cant Connect Ldap Server";
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
    this.Close = "Close";

    this.F_Today = "Today";
    this.F_Yesterday = "Yesterday";
    this.F_ThisWeek = "This Week";
    this.F_ThisMonth = "This Month";
    this.F_ThisYear = "This Year";
    this.F_CurrentUser = "CurrentUser()";
    this.F_Days = "Day(s)";
    this.F_Hours = "Hours";
    this.F_Minutes = "Minute(s)"

    this.GeoLocation_PERMISSION_DENIED = "User Denied to share his geoLocation";
    this.GeoLocation_POSITION_UNAVAILABLE = "Info not available";
    this.GeoLocation_TIMEOUT = "Timeout";
    this.GeoLocation_UNKNOWN_ERROR = "Unknown error";
    this.GeoLocation_NOT_SUPPORTED = "Browser doesnt support";
    this.GeoLocation_ONLY_SECURE_ORIGINS = "Only secure origins are allowed (https)";
    this.Clean_Up_OCR_Filled_Fields = "Clean up OCR filled fields?";
    this.LoadingAndOcrParsing = "OCR analysis in progress";
    this.AddFilter = "ADD FILTER";
    this.ReportDetail = "Report";
    this.DashboardDetail = "Dashboard";
    this.DashboardName = "Dashboard Name";
    this.ReportName = "Report Name";

    this.Contains = "Contains";
    this.NotContains = "Not Contains";
    this.ThanBefore = "Than Before";
    this.LaterThan = "Later Than";
    this.DateRange = "Date Range";
    this.BiggerThan = "Bigger Than";
    this.SmallerThan = "Smaller Than";
    this.ExactMatch = "Exact Match";
    this.FilterProcessName = "Process: ";
    this.Savedsuccessfully = "Changes saved successfully.";

    this.FavouriteFilters = "Favourite Filters";
    this.LocationDataNotFound = "Location data not found";
    this.DeleteConfirm = "Are you sure you want to delete?"
    this.Previous = "Previous";
    this.Next = "Next";
    this.Total = "Total";
    this.RecordsOfListing = "";
    this.Loading = "Loading..";
    this.ShowMore = "Show More";
    this.QueryRunSucceed = "Query Succeed";
    this.SpParameterValidate = "Enter all parameters for Stored Precedure";
    this.QueryNotDefined = "Query Not Defined";
    this.FilterParameterVal = " Parameter value"

    this.FilterGroupNo = "Group No"
    this.FilterGroupName = "Group Name"
    this.FilterGroupMember = "Group Member"
    this.FilterGroupSpecCode = "Group Spec Code 1 ...5"

    this.FilterName = "Name"
    this.FilterSurname = "Surname"
    this.FilterUsername = "Username"
    this.FilterGroup = "Group"
    this.FilterStatus = "Status"

    this.ReportSuccessful = "Created successfully"
    this.ReportFailed = "A report with the identical name already exists."

    this.FilterAllAssigned = "All";
    this.FilterAllAssignedBtnHover = "Use the TaskAssignedTo data element to filter Assigned user who related to process";
    this.FilterProcesses = "PROCESSES";
    this.FilterTask = " task ";
    this.FilterTotalTask = "Total task";
    this.FilterAssigned = "Assigned: ";
    this.BarChartTitle = "ASSIGNED USERS & GROUPS";

    this.PanelUserGroupConfirm = "The {1} records of the assigned {0} will be listed, do you confirm?";

    this.PleaseSelect = "Select";

    this.EmptyStatusPieChart = "Empty status records will be listed, do you confirm?";
    this.CountStatusPieChart = "records will be listed, do you confirm?";

    this.Old = "Old";
    this.New = "New";
    this.Preview = "Preview";
    this.UnableToPreviewFile = "Unable to preview file";
    this.ItemsShowing = "Showing {0} items.";

    this.Next = 'Next';
    this.Prev = 'Previous';
    this.Done = 'Done';

    //Virtual Tour Base Items Start
    this.dashboardTitle = `Welcome to Your New Dashboard`;
    this.dashboardTitleDetail = `           
            <p>
               Your dashboard is designed to help you track your daily tasks and quickly access frequently used features. You can customize it according to your needs and instantly access the features you use most. On first use, you can explore all the features of the dashboard step by step with the introductory tour. During the tour:
            </p>
            <p>
            •	You will see brief descriptions of each feature. <br>
            •	You can navigate between steps using the "Previous" and "Next" buttons. <br>
            •	You can close the tour at any time and restart it later. 
            </p>
            <p>
            <h1 class="driver-title"> Working with Widgets </h1>
            •	Drag & Drop: You can move widgets anywhere on the page. <br>
            •	Resizing: You can resize each widget according to your needs. <br>
            •	Editing: You can add or remove widgets using the "+" button. 
            </p>
            `;

    this.condenseDashboard = `Compact View with Condensation`;
    this.condenseDashboardDetail = `<p>You can automatically arrange widgets in an organized manner. </p>`;
    this.undoDashboardChanges = `Return to Saved Layout`;
    this.undoDashboardChangesDetail = `<p>You can return to your saved layout with a single click. </p>`;
    this.saveCurrentDashboard = `Save the Layout`;
    this.saveCurrentDashboardDetail = `<p>You can save your current layout for later use. </p>`;
    this.addRemovePanel = `Customize Your Workspace with Add/Remove Button`;
    this.addRemovePanelDetail = `<p>You can add or remove widgets using the "+" button.  </p>`;
    //Virtual Tour Base Items End

    //Virtual Tour Widgets Start
    this.gridStack_998 = `Recently Used Processes`;
    this.gridStack_998Detail = `<p>
                               • View your most recently used processes. <br> 
                               • Click on the process name to start a new process. <br> 
                               • Customize icon colors.</p>`;

    this.gridStack_999 = `Recently Used Lists`;
    this.gridStack_999Detail = `<p> 
                               • Access your most frequently used processes with a single click. <br>  
                               • Easily distinguish processes with visual cards. <br> 
                               • Personalize process icons.</p>`;

    this.gridStack_1000 = `Pending Tasks`;
    this.gridStack_1000Detail = `<p>  
                                • List your assigned tasks.  <br> 
                                • Quickly access task forms.  <br> 
                                • Sort tasks by different criteria.</p>`;

    this.gridStack_1001 = `Daily Tasks`;
    this.gridStack_1001Detail = `<p>  
                                 • Track your daily tasks in a calendar view.  <br> 
                                 • Navigate between days using arrow keys.  <br>
                                 • Click on a date to view tasks for that day.</p>`;

    this.gridStack_1002 = `Frequently Used Processes`;
    this.gridStack_1002Detail = `<p> 
                                • View your most recently used processes. <br>
                                • Click on the process name to start a new process. <br>
                                • Customize icon colors.</p>`;

    this.gridStack_1003 = `Frequently Used Lists`;
    this.gridStack_1003Detail = `<p> 
                                • Your most frequently used lists are displayed with special icon and color designs. <br> 
                                • Custom visual designs for each list. <br> 
                                • Quick access to all lists via the "Lists" link.</p>`;

    this.gridStack_1004 = `Recently Used Documents`;
    this.gridStack_1004Detail = `<p> 
                                 • Instantly access your most recently accessed documents. <br> 
                                 • Click on a document to view its content. <br> 
                                 • Visual distinction by document type (DOCX, PDF, TXT).</p> </p>`;

    this.gridStack_1005 = `Favorite Documents`;
    this.gridStack_1005Detail = `<p> 
                                 • Add important documents to favorites. <br> 
                                 • Access your favorite documents with a single click. <br> 
                                 • Star icon to indicate favorite status.</p>`;

    this.gridStack_1006 = `Favorite Lists`;
    this.gridStack_1006Detail = `<p> 
                                • Add frequently used lists to favorites. <br> 
                                • Visual organization with special icon and color designs. <br> 
                                • Easy access to all lists via the "Lists" link. </p>`;

    this.gridStack_1007 = `Favorite Reports`;
    this.gridStack_1007Detail = `<p> 
                                • Save important reports in favorites. <br> 
                                • Access all reports via the "Reports" link. <br> 
                                • Quick access to frequently used reports.</p>`;

    this.gridStack_1008 = `Total Processes`;
    this.gridStack_1008Detail = `<p>     
                                 • Comprehensive view of the processes you have started. <br>
                                 • Track processes you are involved in and have completed. <br>
                                 • Daily/weekly/monthly/yearly filtering options. <br>
                                 • Single-click access to process details. <br>
                                 • Ability to customize icon colors.</p> </p>`;

    this.gridStack_1009 = `Activities`;
    this.gridStack_1009Detail = `<p> 
                                • Daily/weekly/monthly activity tracking. <br>
                                • Visual monitoring of your workflow. <br>
                                • Tools to increase your process efficiency.</p>`;

    this.gridStack_1010 = `Task Performance`;
    this.gridStack_1010Detail = `<p> 
                                 • Monthly tracking of assigned tasks. <br>
                                 • Hourly analysis of completed and pending tasks. <br>
                                 • Measure and evaluate your work efficiency.</p>`;

    this.gridStack_1011 = `Your Favorite Dashboards`;
    this.gridStack_1011Detail = `<p> 
                                • Add customized analysis dashboards to favorites. <br>
                                • Access all dashboards via the "Dashboards" link. <br>
                                • Quick access to frequently used dashboards.</p>`;
    //Virtual Tour Widgets End

    this.dateCompare = "The end date must be after the start date.";

    this.ESign_MobileSign = "E-Signature / Mobile Signature";

    this.Sign = "Sign";

    this.DataNotFound = "Record Not Found";

    this.Contains = "Contains";

    this.MissingCardNumber = 'Missing card number';
    this.InvalidCardNumber = 'Invalid card number';
    this.FullNameControlForCreditCard = 'Full name must be at least 4 characters';
    this.InvalidAmountFormat = 'Please enter a valid amount';
    this.MissingExpirationDate = 'Missing expiration date';
    this.InvalidDate = 'Invalid date';
    this.ExpiredDate = 'Expired date';
    this.MissingCvv = 'Missing CVV';

    this.userProfilePhotoBox = 'Drag and drop your photo or <span class="filepond--label-action">upload it</span>';
    this.loadProfileImage = '<i class="fa fa-file-image"></i><span>Your uploaded image</span>';
    this.avatarEdit = 'Avatar editing';
    this.delete = 'Delete';
    this.setYourPhoto = '<i class="fa fa-crop-alt"></i><span>Set your photo</span>';
    this.labelFileTypeNotAllowed = 'You can only upload JPG, JPEG, PNG files!';
    this.labelMaxFileSizeExceeded = 'File size must be at most 2MB.';
    this.uploadProfilePhotoError = 'Profile image could not be uploaded.';
    this.removeProfilePhotoError = 'Profile image could not be removed.';

    this.AskConfirm = "Are you sure?";
    this.ExcelConfirm = "Line Item data will be downloaded in Excel format.";
    this.ExcelConfirmButtonText = "Yes, download";
    this.Cancel = "Cancel";
    this.SelectUserOrGroup = "Please select a group or user";
}