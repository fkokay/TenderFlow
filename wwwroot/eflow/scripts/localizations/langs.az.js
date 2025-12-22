var EFlang = new function () {
    this.localeCode = "az";
    this.noRecordsFound = "Qeyd tapılmadı.";
    this.Save = "Saxla";
    this.Currency = "AZN";
    this.UploadText = "Faylı seçin";
    this.CancelText = "Ləğv et";
    this.UploadFailText = "Quraşdırma uğursuz oldu";
    this.RetryText = "Yenidən cəhd elə";
    this.waitingForResponseText = "Emal edilir...";
    this.PleaseWait = "Zəhmət olmasa, gözləyin...";
    this.FileRequired = "Siz Fayl Seçməlisiniz";
    this.StartProcess = '"{0}" adlı prosesi başlamaq istədiyinizə əminsiniz?';
    this.GridRequiredError = 'Davam etməzdən əvvəl cədvəldə tələb olunan bütün sahələri daxil etməlisiniz.';
    this.Error = 'Səhv!';
    this.Warning = 'Xəbərdarlıq';
    this.DateError = 'Tarix formatı səhvdir. Tarix formatı mm.gg.yyyy və ya defolt dəyər olmalıdır (məsələn: 08.14.2016, Bu gün...).';
    this.Required = "Bu sahə boş ola bilməz.",
    this.InvalidDate = "Lütfən, etibarlı tarix daxil edin.",
    this.InvalidNumber = "Etibarlı nömrə daxil edin.",
    this.Days = "Günlər",
    this.Minutes = "Dəqiqə",
    this.Hours = "Saatlar",
    this.MoreThanDays = "Günlər",
    this.MoreThanMinutes = "Dəqiqə",
    this.MoreThanHours = "Saatlar",
    this.MoreThan = "Daha çox"
    this.LessThan = "Daha az";
    this.Close = "Bağla";

    this.F_Today = "Bu gün";
    this.F_Yesterday = "Dünən";
    this.F_ThisWeek = "Bu həftə";
    this.F_ThisMonth = "Bu Ay";
    this.F_ThisYear = "Bu il";
    this.F_CurrentUser = "Cariİstifadəçi()";
    this.F_Days = "Gün(lər)";
    this.F_Hours = "Saat";
    this.F_Minutes = "Dəqiqə(lər)";
    this.Required = "Bu sahəni doldurun";
    this.MinLength = "Ən azı {0} simvol daxil edin";
    this.UnknownError = "Naməlum Xəta";
    this.WrongUsernameOrPassword = "Yanlış istifadəçi adı və ya parol";
    this.CantConnectLdapServer = "Ldap serverinə qoşulmaq mümkün olmadı";


    this.GeoLocation_PERMISSION_DENIED = "İstifadəçi məlumatı paylaşmaqdan imtina edib.";
    this.GeoLocation_POSITION_UNAVAILABLE = "Məlumat mövcud deyil.";
    this.GeoLocation_TIMEOUT = "Vaxt";
    this.GeoLocation_UNKNOWN_ERROR = "Naməlum Xəta";
    this.GeoLocation_NOT_SUPPORTED = "İstifadə olunan brauzer bu funksiyanı dəstəkləmir.";
    this.GeoLocation_ONLY_SECURE_ORIGINS = "Təhlükəsiz əlaqə tələb edir.(https)";
    this.Clean_Up_OCR_Filled_Fields = "OCR ilə doldurulmuş sahələr silinsin?";
    this.LoadingAndOcrParsing = "OCR təhlili davam edir";
    this.AddFilter = "FİLTRƏ ƏLAVƏ EDİN";
    this.ReportDetail = "Hesabat Təfərrüatı";
    this.DashboardDetail = "İdarə Heyəti Təfərrüatı";
    this.DashboardName = "İdarə Heyətinin Adı";
    this.ReportName = "Hesabatın Adı";

    this.Contains = "Ehtiva edir";
    this.NotContains = "Daxil deyil";
    this.ThanBefore = "Əvvəl";
    this.LaterThan = "Sonra";
    this.DateRange = "Tarix aralığı";
    this.BiggerThan = "dən böyükdür";
    this.SmallerThan = "Kiçikdən";
    this.ExactMatch = "Dəqiq Uyğunluq";
    this.FilterProcessName = "Proses: ";
    this.Savedsuccessfully = "Dəyişikliklər uğurla yadda saxlanıldı.";

    this.FavouriteFilters = "Sevimli Filtrlər";
    this.LocationDataNotFound = "Məkan məlumatını tapmaq mümkün deyil";
    this.DeleteConfirm = "Sıranı silmək istədiyinizə əminsiniz?";
    this.Previous = "Əvvəlki";
    this.Next = "Sonrakı";
    this.Total = "Ümumi";
    this.RecordsOfListing = "Siyahı qeydləri";
    this.Loading = "Yüklənir..";
    this.ShowMore = "Daha çox göstər";
    this.QueryRunSucceed = "Sorğu Uğurla İcra olundu"
    this.SpParameterValidate = "Saxlanılan prosedurun bütün parametrlərini daxil edin"
    this.QueryNotDefined = "Sorğu Müəyyən edilməyib"
    this.FilterParameterVal = "Parametr Dəyəri"

    this.FilterGroupNo = "Qrup №"
    this.FilterGroupName = "Qrup adı"
    this.FilterGroupMember = "Qrup üzvü"
    this.FilterGroupSpecCode = "Xüsusi Kod 1 ...5"

    this.FilterName = "Ad"
    this.FilterSurname = "Soyad"
    this.FilterUsername = "İstifadəçi Adı"
    this.FilterGroup = "Qrup"
    this.FilterStatus = "Status"

    this.ReportSuccessful = "Uğurlu"
    this.ReportFailed = "Eyni ada malik hesabat artıq mövcuddur."

    this.FilterAllAssigned = "Hamısı";
    this.FilterAllAssignedBtnHover = "Proseslə əlaqəli təyin olunmuş istifadəçini süzmək üçün TaskAssignedTo məlumat elementindən istifadə edin";
    this.FilterProcesses = "PROSESLƏR";
    this.FilterTask = " tapşırıq ";
    this.FilterTotalTask = "Ümumi tapşırıq";
    this.FilterAssigned = "Təyin edildi: ";
    this.BarChartTitle = "TƏDBİRLƏRİ İSTİFADƏÇİLƏR VƏ QRUPLAR";

    this.PanelUserGroupConfirm = "{1} Təyin edilmiş {0} qeydləri siyahıya alınacaq, təsdiqləyirsiniz?";

    this.PleaseSelect = "Seçin";

    this.EmptyStatusPieChart = "Boş status qeydləri siyahıya salınacaq, təsdiq edirsiniz?";
    this.CountStatusPieChart = "qeydlər siyahıya alınacaq, təsdiq edirsiniz?";

    this.Old = "Köhnə";
    this.New = "Yeni";
    this.Preview = "Önizləmə";
    this.UnableToPreviewFile = "Faylı önizləmək mümkün deyil";
    this.ItemsShowing = "{0} element göstərilir.";

    this.Next = 'Növbəti';
    this.Prev = 'Əvvəlki';
    this.Done = 'Tamamla';

    //Virtual Tour Base Items Start
    this.dashboardTitle = `Yeni Dashboard'unuza Xoş Gəlmisiniz`;
    this.dashboardTitleDetail = `           
            <p>
               Dashboard'unuz, gündəlik işlərinizi izləmək və tez-tez istifadə etdiyiniz xüsusiyyətlərə sürətli çıxış üçün nəzərdə tutulub. Ehtiyaclarınıza uyğun fərdiləşdirə və ən çox istifadə etdiyiniz xüsusiyyətlərə dərhal çıxış əldə edə bilərsiniz. İlk istifadə zamanı qarşınıza çıxan təlim turu ilə dashboard'un bütün xüsusiyyətlərini addım-addım kəşf edə bilərsiniz. Tur zamanı:
            </p>
            <p>
            •	Hər xüsusiyyət haqqında qısa açıqlamalar görəcəksiniz. <br>
            •	"Əvvəlki" və "Sonrakı" düymələri ilə addımlar arasında irəliləyə bilərsiniz. <br>
            •	İstədiyiniz zaman turu bağlayıb daha sonra yenidən başlada bilərsiniz. 
            </p>
            <p>
            <h1 class="driver-title"> Widget'larla İş </h1>
            •	Sürüklə & Burax: Widget'ları səhifədə istədiyiniz yerə daşıya bilərsiniz. <br>
            •	Ölçüləndirmə: Hər widget'ı ehtiyacınıza uyğun böyüdüb kiçildə bilərsiniz. <br>
            •	Redaktə: "+" düyməsi ilə yeni widget'lar əlavə edə və ya çıxara bilərsiniz. 
            </p>
            `;

    this.condenseDashboard = `Sıxlaşdırma Əməliyyatı İlə Kompakt Görünüş`;
    this.condenseDashboardDetail = `<p>Widget'ları avtomatik olaraq nizamlı şəkildə yerləşdirə bilərsiniz. </p>`;
    this.undoDashboardChanges = `Qeyd Edilmiş Dizayna Geri Dön`;
    this.undoDashboardChangesDetail = `<p>Qeyd edilmiş düzəninizə bir kliklə qayıda bilərsiniz. </p>`;
    this.saveCurrentDashboard = `Dizaynı Qeyd Edin`;
    this.saveCurrentDashboardDetail = `<p>Hazırkı düzəninizi qeyd edərək daha sonra istifadə edə bilərsiniz. </p>`;
    this.addRemovePanel = `Əlavə Et/Çıxar Düyməsi ilə İş Sahəsini Fərdiləşdirin`;
    this.addRemovePanelDetail = `<p>"+" düyməsi ilə yeni widget'lar əlavə edə və ya çıxara bilərsiniz.  </p>`;
    //Virtual Tour Base Items End

    //Virtual Tour Widgets Start
    this.gridStack_998 = `Son İstifadə Edilən Proseslər`;
    this.gridStack_998Detail = `<p>
                               • Ən son işlədiyiniz prosesləri görüntüləyin. <br> 
                               • Proses adına klikləyərək yeni proses başladın. <br> 
                               • İkon rənglərini fərdiləşdirin.</p>`;

    this.gridStack_999 = `Son İstifadə Edilən Siyahılar`;
    this.gridStack_999Detail = `<p> 
                               • Ən çox istifadə etdiyiniz proseslərə bir kliklə çıxış əldə edin. <br>  
                               • Vizual kartlar ilə prosesləri asanlıqla fərqləndirin. <br> 
                               • Proses ikonlarını fərdiləşdirin.</p>`;

    this.gridStack_1000 = `Gözləyən Tapşırıqlar`;
    this.gridStack_1000Detail = `<p>  
                                • Təyin edilmiş tapşırıqlarınızı siyahılayın.  <br> 
                                • Tapşırıq formasına sürətli çıxış əldə edin.  <br> 
                                • Tapşırıqları müxtəlif meyarlara görə sıralayın.</p>`;

    this.gridStack_1001 = `Gündəlik Tapşırıqlar`;
    this.gridStack_1001Detail = `<p>  
                                 •  Təqvim görünüşündə gündəlik tapşırıqlarınızı izləyin.  <br> 
                                 •  Ox düymələri ilə günlər arasında hərəkət edin.  <br>
                                 •  Tarixə klikləyərək həmin günə aid tapşırıqları görüntüləyin.</p>`;

    this.gridStack_1002 = `Tez-tez İstifadə Edilən Proseslər`;
    this.gridStack_1002Detail = `<p> 
                                • Ən son işlədiyiniz prosesləri görüntüləyin. <br>
                                • Proses adına klikləyərək yeni proses başladın. <br>
                                • İkon rənglərini fərdiləşdirin.</p>`;

    this.gridStack_1003 = `Tez-tez İstifadə Edilən Siyahılar`;
    this.gridStack_1003Detail = `<p> 
                                • Ən çox istifadə etdiyiniz siyahılar xüsusi ikon və rəng dizaynları ilə görüntülənir. <br> 
                                • Hər siyahı üçün fərdiləşdirilmiş vizual dizaynlar. <br> 
                                • "Siyahılar" keçidi ilə bütün siyahılara sürətli çıxış.</p>`;

    this.gridStack_1004 = `Son İstifadə Edilən Sənədlər`;
    this.gridStack_1004Detail = `<p> 
                                 • Ən son çıxış etdiyiniz sənədlərə dərhal çıxış. <br> 
                                 • Sənədə klikləyərək məzmunu görüntüləyin. <br> 
                                 • Sənəd növünə görə (DOCX, PDF, TXT) vizual ayrım.</p> </p>`;

    this.gridStack_1005 = `Sevimli Sənədlər`;
    this.gridStack_1005Detail = `<p> 
                                 • Vacib sənədlərinizi sevimlilərə əlavə edin. <br> 
                                 • Sevimli sənədlərinizə bir kliklə çıxış əldə edin. <br> 
                                 • Ulduz işarəsi ilə sevimli statusu göstərin.</p>`;

    this.gridStack_1006 = `Sevimli Siyahılar`;
    this.gridStack_1006Detail = `<p> 
                                • Tez-tez istifadə etdiyiniz siyahıları sevimlilərə əlavə edin. <br> 
                                • Xüsusi ikon və rəng dizaynları ilə vizual təşkilat. <br> 
                                • "Siyahılar" keçidi ilə bütün siyahılara asan çıxış. </p>`;

    this.gridStack_1007 = `Sevimli Hesabatlar`;
    this.gridStack_1007Detail = `<p> 
                                •	Vacib hesabatlarınızı sevimlilərdə saxlayın. <br> 
                                •   "Hesabatlar" keçidi ilə bütün hesabatlara çıxış. <br> 
                                •	Tez-tez istifadə edilən hesabatlara sürətli çıxış.</p>`;

    this.gridStack_1008 = `Ümumi Proseslər`;
    this.gridStack_1008Detail = `<p>     
                                 • Başlatdığınız proseslərin əhatəli görünüşü. <br>
                                 • Daxil olduğunuz və tamamladığınız proseslərin izlənməsi. <br>
                                 • Gündəlik/həftəlik/aylıq/illik filtrləmə seçimləri. <br>
                                 • Proses detallarına bir kliklə çıxış. <br>
                                 • İkon rənglərini fərdiləşdirmə imkanı.</p> </p>`;

    this.gridStack_1009 = `Fəaliyyətlər`;
    this.gridStack_1009Detail = `<p> 
                                • Gündəlik/həftəlik/aylıq fəaliyyət izləmə. <br>
                                • İş axınızı vizual olaraq izləyin. <br>
                                • Proses effektivliyinizi artırma vasitələri.</p>`;

    this.gridStack_1010 = `Tapşırıq Performansı`;
    this.gridStack_1010Detail = `<p> 
                                 • Təyin edilmiş tapşırıqların aylıq izlənməsi. <br>
                                 • Tamamlanan və gözləyən tapşırıqların saat əsasında təhlili. <br>
                                 • İş effektivliyinizi ölçmə və qiymətləndirmə.</p>`;

    this.gridStack_1011 = `Sevimli Panelləriniz`;
    this.gridStack_1011Detail = `<p> 
                                • Fərdiləşdirilmiş təhlil panellərinizi sevimlilərə əlavə edin. <br>
                                • "Panellər" keçidi ilə bütün panellərə çıxış. <br>
                                • Tez-tez istifadə edilən panellərə sürətli çıxış.</p>`;
    //Virtual Tour Widgets End

    this.dateCompare = "Bitmə tarixi, başlama tarixindən sonra olmalıdır.";

    this.ESign_MobileSign = "Elektron İmza / Mobil İmza";
 
    this.Sign = "İmzala";

    this.DataNotFound = "Qeyd Tapılmadı";

    this.Contains = "Daxildir";

    this.MissingCardNumber = 'Kart nömrəsi daxil edilməyib';
    this.InvalidCardNumber = 'Kart nömrəsi yanlışdır';
    this.FullNameControlForCreditCard = 'Ad və soyad ən azı 4 simvol olmalıdır';
    this.InvalidAmountFormat = 'Zəhmət olmasa, düzgün məbləğ daxil edin';
    this.MissingExpirationDate = 'Son etibarlılıq tarixi daxil edilməyib';
    this.InvalidDate = 'Yanlış tarix';
    this.ExpiredDate = 'Keçmiş tarix';
    this.MissingCvv = 'CVV daxil edilməyib';

    this.userProfilePhotoBox = 'Şəklinizi sürüşdürün və buraxın və ya <span class="filepond--label-action">yükləyin</span>';
    this.loadProfileImage = '<i class="fa fa-file-image"></i><span>Yüklədiyiniz şəkil</span>';
    this.avatarEdit = 'Avatar redaktəsi';
    this.delete = 'Sil';
    this.setYourPhoto = '<i class="fa fa-crop-alt"></i><span>Şəklinizi təyin edin</span>';
    this.labelFileTypeNotAllowed = 'Yalnız JPG, JPEG, PNG fayllarını yükləyə bilərsiniz!';
    this.labelMaxFileSizeExceeded = 'Fayl ölçüsü maksimum 2MB olmalıdır.';
    this.uploadProfilePhotoError = 'Profil şəkli yüklənə bilmədi.';
    this.removeProfilePhotoError = 'Profil şəkli silinə bilmədi.';

    this.AskConfirm = "Əminsiniz?";
    this.ExcelConfirm = "Line Item məlumatları Excel formatında endiriləcək.";
    this.ExcelConfirmButtonText = "Bəli, endir";
    this.Cancel = "Ləğv et";
    this.SelectUserOrGroup = "Zəhmət olmasa, qrup və ya istifadəçi seçin";
}