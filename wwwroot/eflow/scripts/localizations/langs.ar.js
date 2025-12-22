var EFlang = new function () {
    this.localeCode = "ar";
    this.noRecordsFound = "لم يتم العثور على سجلات";
    this.Save = "يحفظ";
    this.Currency = "EGP";
    this.UploadText = "حدد ملفًا";
    this.CancelText = "إلغاء";
    this.UploadFailText = "فشل التحميل";
    this.RetryText = "إعادة المحاولة";
    this.waitingForResponseText = "جارٍ المعالجة ...";
    this.PleaseWait = "الرجاء الانتظار ...";
    this.FileRequired = "يجب عليك تحديد ملف";
    this.StartProcess = 'هل أنت متأكد أنك تريد بدء العملية {0}؟';
    this.GridRequiredError = 'يجب عليك إدخال جميع الحقول المطلوبة قبل المتابعة';
    this.Error = 'خطأ';
    this.Warning = 'تحذير';
    this.Required = "الرجاء ملء هذا الحقل";
    this.MinLength = "من فضلك ، {0} من الأحرف على الأقل ضرورية";
    this.UnknownError = "خطأ غير معروف في الخادم";
    this.WrongUsernameOrPassword = "اسم مستخدم أو كلمة مرور خاطئة";
    this.CantConnectLdapServer = "غير قادر على الاتصال بخادم Ldap";
    this.DateError = 'تنسيق التاريخ غير صالح. يجب أن يكون تنسيق التاريخ مثل mm.dd.yyyy أو قيمة محددة مسبقًا (مثال: 08.14.2016، اليوم ..). ';
    this.Required = "لا يمكن أن يكون هذا الحقل فارغًا.";
    this.InvalidDate = "الرجاء إدخال تاريخ صالح.";
    this.InvalidNumber = "الرجاء إدخال رقم صالح.";
    this.Days = "أيام";
    this.Minutes = "الدقائق";
    this.Hours = "ساعات";
    this.MoreThanDays = "أيام";
    this.MoreThanMinutes = "دقائق";
    this.MoreThanHours = "ساعات";
    this.MoreThan = "أكثر من";
    this.LessThan = "أقل من";
    this.Close = "يغلق";

    this.F_Today = "اليوم";
    this.F_Yesterday = "أمس";
    this.F_ThisWeek = "هذا الأسبوع";
    this.F_ThisMonth = "هذا الشهر";
    this.F_ThisYear = "هذا العام";
    this.F_CurrentUser = "CurrentUser ()";
    this.F_Days = "يوم (أيام)";
    this.F_Hours = "ساعات";
    this.F_Minutes = "دقيقة (دقائق)";

    this.GeoLocation_PERMISSION_DENIED = "رفض المستخدم مشاركة موقعه الجغرافي";
    this.GeoLocation_POSITION_UNAVAILABLE = "المعلومات غير متوفرة";
    this.GeoLocation_TIMEOUT = "مهلة";
    this.GeoLocation_UNKNOWN_ERROR = "خطأ غير معروف";
    this.GeoLocation_NOT_SUPPORTED = "المتصفح لا يدعم";
    this.GeoLocation_ONLY_SECURE_ORIGINS = "يُسمح فقط بالأصول الآمنة (https)";
    this.Clean_Up_OCR_Filled_Fields = "مسح الحقول المملوءة بتقنية التعرف الضوئي على الحروف؟";
    this.LoadingAndOcrParsing = "تحليل OCR قيد التقدم";
    this.AddFilter = "أضف الفلتر";
    this.ReportDetail = "تقرير";
    this.DashboardDetail = "لوحة القيادة";
    this.DashboardName = "اسم لوحة القيادة";
    this.ReportName = "اسم التقرير";

    this.Contains = "يحتوي على";
    this.NotContains = "لا تحتوي على";
    this.ThanBefore = "من قبل";
    this.LaterThan = "لاحقًا";
    this.DateRange = "نطاق التاريخ";
    this.BiggerThan = "أكبر من";
    this.SmallerThan = "أصغر من";
    this.ExactMatch = "مطابقة تامة";
    this.FilterProcessName = "معالجة: ";
    this.Savedsuccessfully = "التغييرات التي تم حفظها بنجاح";

    this.FavouriteFilters = "عوامل التصفية المفضلة";
    this.LocationDataNotFound = "بيانات الموقع غير موجودة";
    this.DeleteConfirm = "هل أنت متأكد من أنك تريد الحذف؟";
    this.Previous = "السابق";
    this.Next = "التالي";
    this.Total = "مجموع";
    this.RecordsOfListing = "";
    this.Loading = "جارٍ التحميل ..";
    this.ShowMore = "إظهار المزيد";
    this.QueryRunSucceed = "نجاح الاستعلام";
    this.SpParameterValidate = "أدخل كافة المعلمات للدفعة المخزنة";
    this.QueryNotDefined = "الاستعلام غير معرّف";
    this.FilterParameterVal = " قيمة المعلمة"

    this.FilterGroupNo = "Group No"
    this.FilterGroupName = "Group Name"
    this.FilterGroupMember = "Group Member"
    this.FilterGroupSpecCode = "Group Spec Code 1 ...5"

    this.FilterName = "Name"
    this.FilterSurname = "Surname"
    this.FilterUsername = "Username"
    this.FilterGroup = "Group"
    this.FilterStatus = "Status"

    this.ReportSuccessful = "تم إنشاؤه بنجاح"
    this.ReportFailed = "يوجد تقرير بنفس الاسم بالفعل."

    this.FilterAllAssigned = "الجميع";
    this.FilterAllAssignedBtnHover = "استخدم عنصر البيانات TaskAssignedTo لتصفية المستخدم المعين المرتبط بالعملية";
    this.FilterProcesses = "العمليات";
    this.FilterTask = " مهمة ";
    this.FilterTotalTask = "إجمالي المهمة";
    this.FilterAssigned = "مكلف: ";
    this.BarChartTitle = "المستخدمون والمجموعات المعينة";

    this.PanelUserGroupConfirm = "سيتم سرد {1} سجلات {0} المعينة ، هل تؤكد؟";

    this.PleaseSelect = "يختار";

    this.EmptyStatusPieChart = "سيتم سرد سجلات الحالة الفارغة ، هل تؤكد؟";
    this.CountStatusPieChart = "سيتم سرد السجلات ، هل تؤكد؟";

    this.Old = "قديم";
    this.New = "جديد";
    this.Preview = "معاينة";
    this.UnableToPreviewFile = "لا يمكن فتح هذا الملف";
    this.ItemsShowing = "جارٍ عرض {0} عنصر.";

    this.Next = 'التالي';
    this.Prev = 'السابق';
    this.Done = 'تم';

    //Virtual Tour Base Items Start
    this.dashboardTitle = `مرحبًا بكم في لوحة التحكم الجديدة الخاصة بكم`;
    this.dashboardTitleDetail = `           
        <p>
           تم تصميم لوحة التحكم الخاصة بكم لتتبع أعمالكم اليومية والوصول السريع إلى الميزات التي تستخدمونها بشكل متكرر. يمكنكم تخصيصها وفقًا لاحتياجاتكم والوصول الفوري إلى الميزات التي تستخدمونها بكثرة. في الاستخدام الأول، ستظهر لكم جولة تعليمية تمكنكم من استكشاف جميع ميزات لوحة التحكم خطوة بخطوة. خلال الجولة:
        </p>
        <p>
        •	 سترى شرحًا موجزًا عن كل ميزة. <br>
        •	 يمكنك التنقل بين الخطوات باستخدام أزرار "السابق" و "التالي". <br>
        •	 يمكنك إغلاق الجولة في أي وقت وإعادة تشغيلها لاحقًا. 
        </p>
        <p>
        <h1 class="driver-title"> العمل مع الويدجات </h1>
        •	 السحب والإفلات: يمكنك نقل الويدجات إلى أي مكان على الصفحة. <br>
        •	 تغيير الحجم: يمكنك تكبير أو تصغير كل ويدجت حسب احتياجاتك. <br>
        •	 التعديل: يمكنك إضافة أو إزالة ويدجات جديدة باستخدام زر "+". 
        </p>
        `;

    this.condenseDashboard = `عرض مضغوط مع عملية التكثيف`;
    this.condenseDashboardDetail = `<p>  يمكنك تنظيم الويدجات تلقائيًا بشكل مرتب. </p>`;
    this.undoDashboardChanges = `العودة إلى التصميم المحفوظ`;
    this.undoDashboardChangesDetail = `<p>  يمكنك العودة إلى التصميم المحفوظ بنقرة واحدة. </p>`;
    this.saveCurrentDashboard = `حفظ التصميم الحالي`;
    this.saveCurrentDashboardDetail = `<p>  يمكنك حفظ التصميم الحالي واستخدامه لاحقًا. </p>`;
    this.addRemovePanel = `تخصيص مساحة العمل باستخدام زر الإضافة/الإزالة`;
    this.addRemovePanelDetail = `<p>  يمكنك إضافة أو إزالة ويدجات جديدة باستخدام زر "+".  </p>`;
    //Virtual Tour Base Items End

    //Virtual Tour Widgets Start
    this.gridStack_998 = `العمليات الأخيرة`;
    this.gridStack_998Detail = `<p> 
                           • عرض آخر العمليات التي عملت عليها. <br> 
                           • انقر على اسم العملية لبدء عملية جديدة. <br> 
                           • تخصيص ألوان الأيقونات.  </p>`;

    this.gridStack_999 = `القوائم الأخيرة`;
    this.gridStack_999Detail = `<p>   
                           • الوصول إلى العمليات الأكثر استخدامًا بنقرة واحدة. <br>  
                           • تمييز العمليات بسهولة باستخدام البطاقات المرئية. <br> 
                           • تخصيص أيقونات العمليات.  </p>`;

    this.gridStack_1000 = `المهام المعلقة`;
    this.gridStack_1000Detail = `<p>    
                            • عرض المهام المخصصة لك.  <br> 
                            • الوصول السريع إلى نموذج المهمة.  <br> 
                            • ترتيب المهام وفقًا لمعايير مختلفة.  </p>`;

    this.gridStack_1001 = `المهام اليومية`;
    this.gridStack_1001Detail = `<p>    
                             •  تتبع المهام اليومية في عرض التقويم.  <br> 
                             •  التنقل بين الأيام باستخدام أزرار الأسهم.  <br>
                             •  انقر على التاريخ لعرض المهام الخاصة بذلك اليوم.  </p>`;

    this.gridStack_1002 = `العمليات الأكثر استخدامًا`;
    this.gridStack_1002Detail = `<p>   
                            • عرض آخر العمليات التي عملت عليها. <br>
                            • انقر على اسم العملية لبدء عملية جديدة. <br>
                            • تخصيص ألوان الأيقونات.  </p>`;

    this.gridStack_1003 = `القوائم الأكثر استخدامًا`;
    this.gridStack_1003Detail = `<p>   
                            • عرض القوائم الأكثر استخدامًا مع أيقونات وألوان مخصصة. <br> 
                            • تصميمات مرئية مخصصة لكل قائمة. <br> 
                            • الوصول السريع إلى جميع القوائم عبر رابط "القوائم".  </p>`;

    this.gridStack_1004 = `المستندات الأخيرة`;
    this.gridStack_1004Detail = `<p>   
                             • الوصول الفوري إلى آخر المستندات التي قمت بالوصول إليها. <br> 
                             • انقر على المستند لعرض محتواه. <br> 
                             • تمييز نوع المستند (DOCX, PDF, TXT) بشكل مرئي.  </p> </p>`;

    this.gridStack_1005 = `المستندات المفضلة`;
    this.gridStack_1005Detail = `<p>   
                             • إضافة المستندات المهمة إلى المفضلة. <br> 
                             • الوصول إلى المستندات المفضلة بنقرة واحدة. <br> 
                             • عرض حالة المفضلة باستخدام رمز النجمة.  </p>`;

    this.gridStack_1006 = `القوائم المفضلة`;
    this.gridStack_1006Detail = `<p>   
                            • إضافة القوائم الأكثر استخدامًا إلى المفضلة. <br> 
                            • تنظيم مرئي مع أيقونات وألوان مخصصة. <br> 
                            • الوصول السريع إلى جميع القوائم عبر رابط "القوائم".   </p>`;

    this.gridStack_1007 = `التقارير المفضلة`;
    this.gridStack_1007Detail = `<p>   
                            • حفظ التقارير المهمة في المفضلة. <br> 
                            • الوصول إلى جميع التقارير عبر رابط "التقارير". <br> 
                            • الوصول السريع إلى التقارير الأكثر استخدامًا.  </p>`;

    this.gridStack_1008 = `إجمالي العمليات`;
    this.gridStack_1008Detail = `<p>       
                             • عرض شامل للعمليات التي بدأتها. <br>
                             • تتبع العمليات التي شاركت فيها وأكملتها. <br>
                             • خيارات التصفية اليومية/الأسبوعية/الشهرية/السنوية. <br>
                             • الوصول إلى تفاصيل العملية بنقرة واحدة. <br>
                             • إمكانية تخصيص ألوان الأيقونات.  </p> </p>`;

    this.gridStack_1009 = `الأنشطة`;
    this.gridStack_1009Detail = `<p>   
                            • تتبع الأنشطة اليومية/الأسبوعية/الشهرية. <br>
                            • مراقبة سير عملك بشكل مرئي. <br>
                            • أدوات لزيادة كفاءة العمليات.  </p>`;

    this.gridStack_1010 = `أداء المهام`;
    this.gridStack_1010Detail = `<p>   
                             • تتبع المهام المخصصة لك شهريًا. <br>
                             • تحليل المهام المكتملة والمعلقة على أساس الساعة. <br>
                             • قياس وتقييم كفاءة عملك.  </p>`;

    this.gridStack_1011 = `لوحات التحكم المفضلة`;
    this.gridStack_1011Detail = `<p>   
                            • إضافة لوحات التحكم المخصصة إلى المفضلة. <br>
                            • الوصول إلى جميع لوحات التحكم عبر رابط "اللوحات". <br>
                            • الوصول السريع إلى لوحات التحكم الأكثر استخدامًا.  </p>`;
//Virtual Tour Widgets End

    this.dateCompare = "يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء.";

    this.ESign_MobileSign = "توقيع إلكتروني / توقيع متنقل";

    this.Sign = "وقّع";

    this.DataNotFound = "لم يتم العثور على السجل";

    this.Contains = "يحتوي";

    this.MissingCardNumber = 'رقم البطاقة مفقود';
    this.InvalidCardNumber = 'رقم البطاقة غير صالح';
    this.FullNameControlForCreditCard = 'يجب أن يكون الاسم الكامل 4 أحرف على الأقل';
    this.InvalidAmountFormat = 'الرجاء إدخال مبلغ صالح';
    this.MissingExpirationDate = 'تاريخ انتهاء الصلاحية مفقود';
    this.InvalidDate = 'تاريخ غير صالح';
    this.ExpiredDate = 'تاريخ منتهي';
    this.MissingCvv = 'رمز CVV مفقود';

    this.userProfilePhotoBox = 'اسحب الصورة وأفلتها أو <span class="filepond--label-action">قم بالتحميل</span>';
    this.loadProfileImage = '<i class="fa fa-file-image"></i><span>الصورة التي قمت بتحميلها</span>';
    this.avatarEdit = 'تعديل الصورة الرمزية';
    this.delete = 'حذف';
    this.setYourPhoto = '<i class="fa fa-crop-alt"></i><span>اضبط صورتك</span>';
    this.labelFileTypeNotAllowed = 'يمكنك تحميل ملفات JPG, JPEG, PNG فقط!';
    this.labelMaxFileSizeExceeded = 'يجب أن يكون حجم الملف 2MB كحد أقصى.';
    this.uploadProfilePhotoError = 'تعذر تحميل صورة الملف الشخصي.';
    this.removeProfilePhotoError = 'تعذر إزالة صورة الملف الشخصي.';

    this.AskConfirm = "هل أنت متأكد؟";
    this.ExcelConfirm = "سيتم تنزيل بيانات العناصر بتنسيق Excel.";
    this.ExcelConfirmButtonText = "نعم، تنزيل";
    this.Cancel = "إلغاء";
    this.SelectUserOrGroup = "يرجى اختيار مجموعة أو مستخدم";
}