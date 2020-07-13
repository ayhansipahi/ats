// Turkey
export const locale = {
  GENERAL: {
    404: "Sayfa Bulunamadı!",
    UNDER_CONSTRUCTION: "Yapım Aşamasında!",
    COPY: "Telif",
    GREETING: "Merhaba",
    NO_PERMISSION: "Bu sayfayı görme yetkiniz bulunmuyor."
  },
  TRANSLATOR: {
    SELECT: "Dil Seçimi"
  },
  MENU: {
    NEW: "Yeni",
    ACTIONS: "Aksiyonlar",
    CREATE_POST: "Yeni İleti",
    PAGES: "Sayfalar",
    FEATURES: "Özellikler",
    APPS: "Uygulamalar",
    DASHBOARD: "Panel"
  },
  AUTH: {
    GENERAL: {
      OR: "yada",
      SUBMIT_BUTTON: "Gönder",
      NO_ACCOUNT: "Hesabınız yok mu?",
      SIGNUP_BUTTON: "Kayıt ol",
      FORGOT_BUTTON: "Parolamı Unuttum",
      BACK_BUTTON: "Geri",
      PRIVACY: "Gizlilik",
      LEGAL: "Yasal",
      CONTACT: "İletişim"
    },
    LOGIN: {
      TITLE: "Tüpraş Araç Takip Sistemi",
      BUTTON: "Giriş Yap"
    },
    LOGOUT: "Çıkış yap",
    FORGOT: {
      TITLE: "Şifremi unuttum.",
      DESC: "Şifre sıfırlamak için email adresinizi girin.",
      SUCCESS: "Şifre sıfırlama işlemi başarılı şekilde tamamlandı."
    },
    REGISTER: {
      TITLE: "Üye ol",
      DESC: "Üyelik için bilgilerinizi giriniz.",
      SUCCESS: "Hesabınız başarılı şekilde oluşturulmuştur."
    },
    INPUT: {
      EMAIL: "Email",
      FULLNAME: "Ad Soyad",
      PASSWORD: "Şifre",
      CONFIRM_PASSWORD: "Şifre Tekrar",
      USERNAME: "Kullanıcı Adı"
    },
    VALIDATION: {
      INVALID: "{name} geçersiz",
      REQUIRED: "{name} gerekli",
      MIN_LENGTH: "{name} için en az uzunluk {min}",
      AGREEMENT_REQUIRED: "Şertlar ve koşulları onaylamak zorunlu",
      NOT_FOUND: "İstenilen {name} bulunamadı",
      INVALID_LOGIN: "Geçersiz giriş",
      REQUIRED_FIELD: "Gerekli alanlar eksik",
      MIN_LENGTH_FIELD: "En az uzunluk:",
      MAX_LENGTH_FIELD: "En fazla uzunluk:",
      INVALID_FIELD: "Giriş geçersiz"
    }
  },
  FORMS: {
    SELECT_DEFAULT: "Bir {name} seçin",
    CREATE: "Oluştur",
    DETAIL: "Detayı",
    WATCH_LIVE: "Canlı İzle",
    CANCEL: "İptal",
    SAVE: "Kaydet",
    CLOSE: "Kapat",

    PERM_READ: "Görüntüleme",
    PERM_CREATE: "Ekleme",
    PERM_UPDATE: "Güncelleme",
    PERM_DELETE: "Silme"
  },
  MESSAGES: {
    DELETE_CONFIRM: "{name} silinsin mi?",
    OK: "Evet",
    CANCEL: "Hayır",
    SUCCESS: "İşlem Başarılı"
  },
  TABLE: {
    SEARCH_PLACEHOLDER: "Arama...",
    NEW: "Yeni",
    SEARCH_SCOPED: "Filtrele ({name})",
    ACTIONS: "Aksiyonlar"
  },
  FIELDS: {
    CreatedDate: "Oluşturma Tarihi",
    role: {
      Name: "Rol Adı"
    },
    product: {
      ProductName: "Ürün Adı",
      ProductCode: "Ürün Kodu",
      Explanation: "Açıklama"
    },
    maintenance: {
      MaintenanceTitle: "Bakım Başlığı",
      KM: "Araç KM",
      Explanation: "Açıklama",
      MaintenanceStartDate: "Başlangiç Tarihi",
      MaintenanceEndDate: "Bitiş Tarihi",
      VehicleId: "Araç Plakası",
      MaintenanceStatusId: "Bakım Durumu"
    },
    driver: {
      TCKN: "TC",
      DriverName: "Adı",
      Phone: "Telefon",
      Email: "E-Posta",
      Address: "Adres"
    },
    company: {
      CompanyName: "Firma Adı",
      CompanyTradeName: "Firma Ticari Adı",
      CompanyEmail: "E-Mail",
      Phone: "Telefon",
      AuthorizedPerson: "Yetkili Kişi",
      AuthorizedPhone: "Yetkili Telefon",
      AuthorizedEmail: "Yetkili E-mail",
      LogoFilePath: "Logo"
    },
    device: {
      DeviceCode: "Cihaz Kodu",
      DeviceName: "Cihaz Adı",
      Explanation: "Açıklama",
      SensorId: "Sensör"
    },
    station: {
      StationCode: "İstasyon Kodu",
      StationName: "İstasyon Adı",
      StationType: "İstasyon Tipi",
      Latitude: "Enlem",
      Longitude: "Boylam"
    },
    smtp: {
      Email: "Smtp E-posta",
      Password: "Parola",
      Host: "Smtp Host",
      Port: "Smtp Port",
      EnableSsl: "SMTP güvenli bağlantı ile mi çalışıyor (SSL)"
    },
    sensorType: {
      SensorTypeCode: "Sensör Kodu",
      SensorTypeName: "Sensör Adı"
    },
    sensor: {
      SensorCode: "Sensör Kodu",
      SensorName: "Sensör Adı",
      Explanation: "Açıklama"
    },
    alarm: {
      AlarmTypeId: "Alarm Tipi",
      Plaque: "Plaka",
      AlarmDetail: "Alarm Detayı",
      AlarmStatus: "Alarm Durumu"
    },
    alarmType: {
      AlarmDescription: "Alarm Açıklaması"
    },
    user: {
      UserName: "Kullanıcı Adı",
      Email: "Email",
      PhoneNumber: "Cep Telefonu",
      Password: "Şifre",
      roles: "Rol"
    },
    vehicle: {
      Plaque: "Plaka",
      Capacity: "Kapasite",
      VehicleTypeId: "Araç Tipi",
      CompanyId: "Firma",
      VehicleProductGroupId: "Ürün Grubu",
      DriverId: "Şoför"
    },
    vehicleDevice: {
      VehicleId: "Araç",
      DeviceId: "Cihaz"
    },
    vehicleType: {
      TypeName: "Tip ismi"
    },
    vehicleTrack: {
      VehicleId: "Plaka",
      DriverId: "Şöför",
      Km: "KM",
      Speed: "Hız",
      Latitude: "Enlem",
      Longitude: "Boylam",
      Location: "Konum"
    },
    vehicleProductGroup: {
      VehicleProductCode: "Araç Ürün Kodu",
      VehicleProductName: "Araç Ürün Adı",
      Explanation: "Açıklama"
    },
    log: {
      table: "Table",
      method: "Metod",
      user: "Kullanıcı",
      requestJson: "İstek",
      responseJson: "Yanıt"
    }
  },
  TITLE: {
    role: "Rol",
    product: "Ürün Grubu",
    maintenance: "Bakım",
    driver: "Şöför",
    company: "Firmalar",
    device: "Cihaz",
    station: "İstasyon",
    smtp: "SMTP",
    sensorType: "Sensör tipi",
    sensor: "Sensör",
    alarm: "Alarm",
    alarmType: "Alarm tipi",
    user: "Kullanıcı",
    vehicle: "Araç",
    vehicleDevice: "Araç Cihazı",
    vehicleType: "Araç tipi",
    vehicleTrack: "Araç Hareketi",
    vehicleProductGroup: "Araç Ürün Grubu",
    log: "Kullanıcı Haraketleri"
  },
  ROLE_PAGE: {
    1: "Araç Listesi",
    2: "Araç Hareketleri Listesi",
    3: "Araç Tipleri",
    4: "Araç Cihazlari",
    5: "Harita",
    6: "Firmalar",
    7: "Bakım",
    8: "Alarm Listesi",
    9: "Soförler",
    10: "İstasyonlar",
    11: "Cihazlar",
    12: "Sensörler",
    13: "Ürün Gruplar",
    14: "Kullanıcılar",
    15: "Yetkiler",
    16: "SMTP Ayarı",
    17: "Kullanıcı Haraketleri",
    18: "Rapor",
    19: "Alarm Tipleri",
    20: "Sensör Tipleri",
    21: "Ürün Grupları"
  }
};
