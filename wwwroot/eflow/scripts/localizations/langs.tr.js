var EFlang = new function () {
    this.localeCode = "tr";
    this.noRecordsFound = "Kayıt Bulunamadı.";
    this.Save = "Kaydet";
    this.Currency = "TRY";
    this.UploadText = "Dosya Seçin";
    this.CancelText = "İptal";
    this.UploadFailText = "Yükleme başarısız";
    this.RetryText = "Tekrar deneyiniz";
    this.waitingForResponseText = "Yükleniyor...";
    this.PleaseWait = "Lütfen Bekleyiniz...";
    this.FileRequired = "Dosya Seçmelisiniz";
    this.StartProcess = '"{0}" adlı süreci başlatmak istediğinize emin misiniz?';
    this.GridRequiredError = 'Devam etmeden önce tablodaki tüm zorunlu alanları girmelisiniz.';
    this.Error = 'Hata!';
    this.Warning = 'Uyarı';
    this.DateError = 'Tarih formatı hatalı. Tarih formatı aa.gg.yyyy yada öntanımlı bir değer olmalı (ör: 08.14.2016, Today..).';
    this.Required = "Bu alanın doldurulması zorunludur.",
    this.InvalidDate = "Lütfen geçerli bir tarih giriniz.",
    this.InvalidNumber = "Lütfen geçerli bir rakam giriniz.",
    this.Days = "Gün",
    this.Minutes = "Dakika",
    this.Hours = "Saat",
    this.MoreThanDays = "Günden",
    this.MoreThanMinutes = "Dakikadan",
    this.MoreThanHours = "Saatten",
    this.LessThan = "Az";
    this.MoreThan = "Fazla";
    this.Close = "Kapat";

    this.F_Today = "Bugün";
    this.F_Yesterday = "Dün";
    this.F_ThisWeek = "Bu Hafta";
    this.F_ThisMonth = "Bu Ay";
    this.F_ThisYear = "Bu Yıl";
    this.F_CurrentUser = "CurrentUser()";
    this.F_Days = "Gün";
    this.F_Hours = "Saat";
    this.F_Minutes = "Dakika";
    this.Required = "Bu alanı doldurmalısınız";
    this.MinLength = "Lütfen, en az {0} karakter giriniz";
    this.UnknownError = "Bilinmeyen Hata";
    this.WrongUsernameOrPassword = "Hatalı kullanıcı adı yada şifre";
    this.CantConnectLdapServer = "Ldap sunucusuna bağlanamadı";

    this.GeoLocation_PERMISSION_DENIED = "Kullanıcı bilgiyi paylaşmayı reddetti.";
    this.GeoLocation_POSITION_UNAVAILABLE = "bilgiye ulaşılamıyor.";
    this.GeoLocation_TIMEOUT = "Timeout";
    this.GeoLocation_UNKNOWN_ERROR = "Bilinmeyen bir hata";
    this.GeoLocation_NOT_SUPPORTED = "Kullanılan tarayıcı bu özelliği desteklemiyor.";
    this.GeoLocation_ONLY_SECURE_ORIGINS = "Güvenli bir bağlantı gerektiriyor. (https)";
    this.Clean_Up_OCR_Filled_Fields = "OCR ile doldurulan alanlar temizlensin mi?";
    this.LoadingAndOcrParsing = "OCR analizi yapılıyor";
    this.AddFilter = "FİLTRE EKLE";
    this.ReportDetail = "Rapor Detay";
    this.DashboardDetail = "Pano Detay";
    this.DashboardName = "Pano Adı";
    this.ReportName = "Rapor Adı";

    this.Contains = "İçeriyor";
    this.NotContains = "İçermiyor";
    this.ThanBefore = "Den Önce";
    this.LaterThan = "Den Sonra";
    this.DateRange = "Tarih Aralığı";
    this.BiggerThan = "Den Büyük";
    this.SmallerThan = "Den Küçük";
    this.ExactMatch = "Tam Eşleşme";
    this.FilterProcessName = "Süreç: ";
    this.Savedsuccessfully = "Değişiklikler başarıyla kaydedildi.";

    this.FavouriteFilters = "Favori Filtreler";
    this.LocationDataNotFound = "Lokasyon verisi bulunamıyor";
    this.DeleteConfirm = "Satırı Silmek İstediğinizden Emin Misiniz?";
    this.Previous = "Önceki";
    this.Next = "Sonraki";
    this.Total = "Toplam";
    this.RecordsOfListing = "Kayıt Listeleniyor";
    this.Loading = "Yükleniyor..";
    this.ShowMore = "Daha Fazla Göster";
    this.QueryRunSucceed = "Sorgu Başarı İle Çalıştırıldı"
    this.SpParameterValidate = "Saklı Yordama Ait Tüm Parametreleri Giriniz"
    this.QueryNotDefined = "Sorgu Tanımlanmadı"
    this.FilterParameterVal = " Parametre Değeri"

    this.FilterGroupNo = "Grup No"
    this.FilterGroupName = "Grup Adı"
    this.FilterGroupMember = "Grup Üyesi"
    this.FilterGroupSpecCode = "Özel Kod 1 ...5"

    this.FilterName = "Ad"
    this.FilterSurname = "Soyad"
    this.FilterUsername = "Kullanıcı Adı"
    this.FilterGroup = "Grup"
    this.FilterStatus = "Status"

    this.ReportSuccessful = "Başarılı"
    this.ReportFailed = "Aynı ada sahip bir rapor zaten var."

    this.FilterAllAssigned = "Hepsi";
    this.FilterAllAssignedBtnHover = "Sürecin altından Atanan filtrelemek için TaskAssignedTo veri elementini kullanın.";
    this.FilterProcesses = "SÜREÇLER";
    this.FilterTask = " görev ";
    this.FilterTotalTask = "Toplam görev";
    this.FilterAssigned = "Atanan: ";
    this.BarChartTitle = "GÖREV ATANAN KULLANICILAR & GRUPLAR";

    this.PanelUserGroupConfirm = "Seçtiğiniz {0} isimli atanana ait {1} kayıt listelenecek, onaylıyor musunuz?";
    this.PleaseSelect = "Seçiniz";

    this.EmptyStatusPieChart = "Status girilmemiş kayıtlar listelenecek onaylıyor musunuz?";
    this.CountStatusPieChart = "listelenecek onaylıyor musunuz?";

    this.Old = "Eski";
    this.New = "Yeni";
    this.Preview = "Ön İzleme";
    this.UnableToPreviewFile = "Dosya önizlemesi yapılamıyor";
    this.ItemsShowing = "{0} öğe gösteriliyor.";

    this.Next = 'Sonraki';
    this.Prev = 'Önceki';
    this.Done = 'Tamamla';

    //Virtual Tour Base Items Start
    this.dashboardTitle = `Yeni Dashboard'unuza Hoş Geldiniz`;
    this.dashboardTitleDetail = `           
            <p>
               Dashboard'unuz, günlük işlerinizi takip etmeniz ve sık kullandığınız özelliklere hızlıca erişmeniz için tasarlandı. İhtiyaçlarınıza göre özelleştirebilir ve en sık kullandığınız özelliklere anında erişebilirsiniz. İlk kullanımda karşınıza çıkan öğretici tur ile dashboard'un tüm özelliklerini adım adım keşfedebilirsiniz. Tur sırasında:
            </p>
            <p>
            •	Her özellik hakkında kısa açıklamalar göreceksiniz. <br>
            •	"Önceki" ve "Sonraki" butonları ile adımlar arasında ilerleyebilirsiniz. <br>
            •	Dilediğiniz zaman turu kapatıp daha sonra tekrar başlatabilirsiniz. 
            </p>
            <p>
            <h1 class="driver-title"> Widget'larla Çalışma </h1>
            •	Sürükle & Bırak: Widget'ları sayfada istediğiniz yere taşıyabilirsiniz. <br>
            •	Boyutlandırma: Her widget'ı ihtiyacınıza göre büyütüp küçültebilirsiniz. <br>
            •	Düzenleme: "+" butonu ile yeni widget'lar ekleyebilir veya çıkarabilirsiniz. 
            </p>
            `;

    this.condenseDashboard = `Sıkılaştırma İşlemi İle Kompakt Görünüm`;
    this.condenseDashboardDetail = `<p> Widget'ları otomatik olarak düzenli bir şekilde yerleştirebilirsiniz. </p>`;
    this.undoDashboardChanges = `Kayıtlı Tasarıma Geri Dön`;
    this.undoDashboardChangesDetail = `<p> Kaydedilmiş düzeninize tek tıkla dönebilirsiniz. </p>`;
    this.saveCurrentDashboard = `Tasarımı Kayıt Edin`;
    this.saveCurrentDashboardDetail = `<p> Mevcut düzeninizi kaydederek daha sonra kullanabilirsiniz. </p>`;
    this.addRemovePanel = `Ekle/Çıkar Butonu ile Çalışma Alanını Kişileştirin`;
    this.addRemovePanelDetail = `<p> "+" butonu ile yeni widget'lar ekleyebilir veya çıkarabilirsiniz.  </p>`;
    //Virtual Tour Base Items End

    //Virtual Tour Widgets Start
    this.gridStack_998 = `Son Kullanılan Süreçler`;
    this.gridStack_998Detail = `<p>
                               • En son çalıştığınız süreçleri görüntüleyin. <br> 
                               • Süreç adına tıklayarak yeni süreç başlatın. <br> 
                               • İkon renklerini özelleştirin. </p>`;

    this.gridStack_999 = `Son Kullanılan Listeler`;
    this.gridStack_999Detail = `<p>  
                               • En çok kullandığınız süreçlere tek tıkla erişin. <br>  
                               • Görsel kartlar ile süreçleri kolayca ayırt edin. <br> 
                               • Süreç ikonlarını kişiselleştirin. </p>`;

    this.gridStack_1000 = `Bekleyen Görevler`;
    this.gridStack_1000Detail = `<p>   
                                • Atanmış görevlerinizi listeleyin.  <br> 
                                • Görev formuna hızlıca erişin.  <br> 
                                • Görevleri farklı kriterlere göre sıralayın. </p>`;

    this.gridStack_1001 = `Günlük Görevler`;
    this.gridStack_1001Detail = `<p>   
                                 •  Takvim görünümünde günlük görevlerinizi takip edin.  <br> 
                                 •  Ok tuşlarıyla günler arasında gezinin.  <br>
                                 •  Tarihe tıklayarak o güne ait görevleri görüntüleyin. </p>`;

    this.gridStack_1002 = `Sık Kullanılan Süreçler`;
    this.gridStack_1002Detail = `<p>  
                                • En son çalıştığınız süreçleri görüntüleyin. <br>
                                • Süreç adına tıklayarak yeni süreç başlatın. <br>
                                • İkon renklerini özelleştirin. </p>`;

    this.gridStack_1003 = `Sık Kullanılan Listeler`;
    this.gridStack_1003Detail = `<p>  
                                • En çok kullandığınız listeler özel ikon ve renk tasarımlarıyla görüntülenir. <br> 
                                • Her liste için özelleştirilmiş görsel tasarımlar. <br> 
                                • "Listeler" bağlantısı üzerinden tüm listelere hızlı erişim. </p>`;

    this.gridStack_1004 = `Son Kullanılan Dokümanlar`;
    this.gridStack_1004Detail = `<p>  
                                 • En son eriştiğiniz dokümanlara anında ulaşım. <br> 
                                 • Dokümana tıklayarak içeriği görüntüleme. <br> 
                                 • Doküman tipine göre (DOCX, PDF, TXT) görsel ayrım. </p> </p>`;

    this.gridStack_1005 = `Favori Dokümanlar`;
    this.gridStack_1005Detail = `<p>  
                                 • Önemli dokümanlarınızı favorilere ekleme. <br> 
                                 • Favori dokümanlarınıza tek tıkla erişim. <br> 
                                 • Yıldız işareti ile favori durumu gösterimi. </p>`;

    this.gridStack_1006 = `Favori Listeler`;
    this.gridStack_1006Detail = `<p>  
                                • Sık kullandığınız listeleri favorilere ekleme. <br> 
                                • Özel ikon ve renk tasarımları ile görsel organizasyon. <br> 
                                • "Listeler" bağlantısı ile tüm listelere kolay erişim.  </p>`;

    this.gridStack_1007 = `Favori Raporlar`;
    this.gridStack_1007Detail = `<p>  
                                •	Önemli raporlarınızı favorilerde saklama. <br> 
                                •   "Raporlar" bağlantısı ile tüm raporlara erişim. <br> 
                                •	Sık kullanılan raporlara hızlı ulaşım. </p>`;

    this.gridStack_1008 = `Toplam Süreçler`;
    this.gridStack_1008Detail = `<p>      
                                 • Başlattığınız süreçlerin kapsamlı görünümü. <br>
                                 • Dahil olduğunuz ve tamamladığınız süreçlerin takibi. <br>
                                 • Günlük/haftalık/aylık/yıllık filtreleme seçenekleri. <br>
                                 • Süreç detaylarına tek tıkla erişim. <br>
                                 • İkon renklerini özelleştirme imkanı. </p> </p>`;

    this.gridStack_1009 = `Aktiviteler`;
    this.gridStack_1009Detail = `<p>  
                                • Günlük/haftalık/aylık aktivite takibi. <br>
                                • Çalışma akışınızı görsel olarak izleme. <br>
                                • Süreç verimliliğinizi artırma araçları. </p>`;

    this.gridStack_1010 = `Görev Performansı`;
    this.gridStack_1010Detail = `<p>  
                                 • Atanmış görevlerin aylık takibi. <br>
                                 • Tamamlanan ve bekleyen görevlerin saat bazında analizi. <br>
                                 • Çalışma verimliliğinizi ölçme ve değerlendirme. </p>`;

    this.gridStack_1011 = `Favori Panolarınız`;
    this.gridStack_1011Detail = `<p>  
                                • Özelleştirilmiş analiz panolarınızı favorilere ekleme. <br>
                                • "Panolar" bağlantısı ile tüm panolara erişim. <br>
                                • Sık kullanılan panolara hızlı ulaşım. </p>`;
    //Virtual Tour Widgets End

    this.dateCompare = "Bitiş tarihi, başlangıç tarihinden sonra olmalıdır.";

    this.ESign_MobileSign = "E-İmza / Mobil İmza";

    this.Sign = "İmzala";

    this.DataNotFound = "Kayıt Bulunamadı";

    this.Contains = "İçeriyor";

    this.MissingCardNumber = 'Eksik kart numarası';
    this.InvalidCardNumber = 'Hatalı kart numarası';
    this.FullNameControlForCreditCard = 'Ad Soyad en az 4 karakter olmalı';
    this.InvalidAmountFormat = 'Lütfen geçerli bir tutar giriniz';
    this.MissingExpirationDate = 'Eksik son geçerlilik tarihi';
    this.InvalidDate = 'Yanlış tarih';
    this.ExpiredDate = 'Geçmiş tarih';
    this.MissingCvv = 'Eksik CVV';

    this.userProfilePhotoBox = 'Fotoğrafınızı sürükleyip bırakın veya <span class="filepond--label-action">yükleyin</span>';

    this.loadProfileImage = '<i class="fa fa-file-image"></i><span>Yüklediğiniz resim</span>';
    this.avatarEdit = 'Avatar düzenleme';
    this.delete = 'Sil';
    this.setYourPhoto = '<i class="fa fa-crop-alt"></i><span>Resminizi ayarlayın</span>';
    this.labelFileTypeNotAllowed = 'Sadece JPG, JPEG, PNG dosyaları yükleyebilirsiniz!'
    this.labelMaxFileSizeExceeded = 'Dosya boyutu en fazla 2MB olmalı.';
    this.uploadProfilePhotoError = 'Profil görseli yüklenemedi.';
    this.removeProfilePhotoError = 'Profil görseli kaldırılamadı.';

    this.AskConfirm = "Emin misiniz?";
    this.ExcelConfirm = "Line Item verileri Excel formatında indirilecek.";
    this.ExcelConfirmButtonText = "Evet, indir";
    this.Cancel = "Vazgeç";
    this.SelectUserOrGroup = "Grup veya kullanıcı seçimi yapınız";
}


