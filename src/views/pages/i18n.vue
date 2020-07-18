<template>
  <div class="bg-white p-4">
    <el-form>
      <el-form-item label="Language" label-width="25%">
        <b-form-select
          v-model="selectedLang"
          :options="languageOptions"
          @input="onChangeLang"
        />
      </el-form-item>
    </el-form>

    <json-editor
      :key="selectedLang"
      ref="JsonEditor"
      :schema="schema"
      :value.sync="language"
    >
      <el-button type="primary" @click="submit">Submit</el-button>
    </json-editor>
  </div>
</template>

<script>
// import axios from "axios";
import i18nService from "../../common/i18n.service";
import { SET_BREADCRUMB } from "../../store/breadcrumbs.module";
import JsonEditor from "vue-json-ui-editor";
import { mapActions } from "vuex";
const SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema",
  type: "object",
  properties: {
    GENERAL: {
      type: "object",
      properties: {
        "404": {
          type: "string",
          title: "GENERAL.404",
          options: { class: "form-control" }
        },
        UNDER_CONSTRUCTION: {
          type: "string",
          title: "GENERAL.UNDER_CONSTRUCTION"
        },
        COPY: { type: "string", title: "GENERAL.COPY" },
        GREETING: { type: "string", title: "GENERAL.GREETING" },
        NO_PERMISSION: { type: "string", title: "GENERAL.NO_PERMISSION" }
      }
    },
    TRANSLATOR: {
      type: "object",
      properties: {
        SELECT: { type: "string", title: "TRANSLATOR.SELECT" }
      }
    },
    MENU: {
      type: "object",
      properties: {
        NEW: { type: "string", title: "MENU.NEW" },
        ACTIONS: { type: "string", title: "MENU.ACTIONS" },
        CREATE_POST: { type: "string", title: "MENU.CREATE_POST" },
        PAGES: { type: "string", title: "MENU.PAGES" },
        FEATURES: { type: "string", title: "MENU.FEATURES" },
        APPS: { type: "string", title: "MENU.APPS" },
        DASHBOARD: { type: "string", title: "MENU.DASHBOARDN" }
      }
    },
    AUTH: {
      type: "object",
      properties: {
        GENERAL: {
          type: "object",
          properties: {
            OR: { type: "string", title: "AUTH.GENERAL.OR" },
            SUBMIT_BUTTON: {
              type: "string",
              title: "AUTH.GENERAL.SUBMIT_BUTTON"
            },
            NO_ACCOUNT: { type: "string", title: "AUTH.GENERAL.NO_ACCOUNT" },
            SIGNUP_BUTTON: {
              type: "string",
              title: "AUTH.GENERAL.SIGNUP_BUTTON"
            },
            FORGOT_BUTTON: {
              type: "string",
              title: "AUTH.GENERAL.FORGOT_BUTTON"
            },
            BACK_BUTTON: { type: "string", title: "AUTH.GENERAL.BACK_BUTTON" },
            PRIVACY: { type: "string", title: "AUTH.GENERAL.PRIVACY" },
            LEGAL: { type: "string", title: "AUTH.GENERAL.LEGAL" },
            CONTACT: { type: "string", title: "AUTH.GENERAL.CONTACT" }
          }
        },
        LOGIN: {
          type: "object",
          properties: {
            TITLE: { type: "string", title: "AUTH.LOGIN.TITLE" },
            BUTTON: { type: "string", title: "AUTH.LOGIN.BUTTON" }
          }
        },
        LOGOUT: { type: "string", title: "AUTH.LOGOUT" },
        FORGOT: {
          type: "object",
          properties: {
            TITLE: { type: "string", title: "AUTH.FORGOT.TITLE" },
            DESC: { type: "string", title: "AUTH.FORGOT.DESC" },
            SUCCESS: { type: "string", title: "AUTH.FORGOT.SUCCESS" }
          }
        },
        REGISTER: {
          type: "object",
          properties: {
            TITLE: { type: "string", title: "AUTH.REGISTER.TITLE" },
            DESC: { type: "string", title: "AUTH.REGISTER.DESC" },
            SUCCESS: { type: "string", title: "AUTH.REGISTER.SUCCESS" }
          }
        },
        INPUT: {
          type: "object",
          properties: {
            EMAIL: { type: "string", title: "AUTH.INPUT.EMAIL" },
            FULLNAME: { type: "string", title: "AUTH.INPUT.FULLNAME" },
            PASSWORD: { type: "string", title: "AUTH.INPUT.PASSWORD" },
            CONFIRM_PASSWORD: {
              type: "string",
              title: "AUTH.INPUT.CONFIRM_PASSWORD"
            },
            USERNAME: { type: "string", title: "AUTH.INPUT.USERNAME" }
          }
        },
        VALIDATION: {
          type: "object",
          properties: {
            INVALID: { type: "string", title: "AUTH.VALIDATION.INVALID" },
            REQUIRED: { type: "string", title: "AUTH.VALIDATION.REQUIRED" },
            MIN_LENGTH: { type: "string", title: "AUTH.VALIDATION.MIN_LENGTH" },
            AGREEMENT_REQUIRED: {
              type: "string",
              title: "AUTH.VALIDATION.AGREEMENT_REQUIRED"
            },
            NOT_FOUND: { type: "string", title: "AUTH.VALIDATION.NOT_FOUND" },
            INVALID_LOGIN: {
              type: "string",
              title: "AUTH.VALIDATION.INVALID_LOGIN"
            },
            REQUIRED_FIELD: {
              type: "string",
              title: "AUTH.VALIDATION.REQUIRED_FIELD"
            },
            MIN_LENGTH_FIELD: {
              type: "string",
              title: "AUTH.VALIDATION.MIN_LENGTH_FIELD"
            },
            MAX_LENGTH_FIELD: {
              type: "string",
              title: "AUTH.VALIDATION.MAX_LENGTH_FIELD"
            },
            INVALID_FIELD: {
              type: "string",
              title: "AUTH.VALIDATION.INVALID_FIELD"
            }
          }
        }
      }
    },
    FORMS: {
      type: "object",
      properties: {
        SELECT_DEFAULT: { type: "string", title: "FORMS.SELECT_DEFAULT" },
        CREATE: { type: "string", title: "FORMS.CREATE" },
        DETAIL: { type: "string", title: "FORMS.DETAIL" },
        WATCH_LIVE: { type: "string", title: "FORMS.WATCH_LIVE" },
        CANCEL: { type: "string", title: "FORMS.CANCEL" },
        SAVE: { type: "string", title: "FORMS.SAVE" },
        CLOSE: { type: "string", title: "FORMS.CLOSE" },
        PERM_READ: { type: "string", title: "FORMS.PERM_READ" },
        PERM_CREATE: { type: "string", title: "FORMS.PERM_CREATE" },
        PERM_UPDATE: { type: "string", title: "FORMS.PERM_UPDATE" },
        PERM_DELETE: { type: "string", title: "FORMS.PERM_DELETE" }
      }
    },
    MESSAGES: {
      type: "object",
      properties: {
        DELETE_CONFIRM: { type: "string", title: "MESSAGES.DELETE_CONFIRM" },
        OK: { type: "string", title: "MESSAGES.OK" },
        CANCEL: { type: "string", title: "MESSAGES.CANCEL" },
        SUCCESS: { type: "string", title: "MESSAGES.SUCCESS" }
      }
    },
    TABLE: {
      type: "object",
      properties: {
        SEARCH_PLACEHOLDER: {
          type: "string",
          title: "TABLE.SEARCH_PLACEHOLDER"
        },
        NEW: { type: "string", title: "TABLE.NEW" },
        SEARCH_SCOPED: { type: "string", title: "TABLE.SEARCH_SCOPED" },
        ACTIONS: { type: "string", title: "TABLE.ACTIONS" }
      }
    },
    FIELDS: {
      type: "object",
      properties: {
        CreatedDate: { type: "string", title: "FIELDS.CreateDate" },
        role: {
          type: "object",
          properties: {
            Name: { type: "string", title: "FIELDS.role.Name" }
          }
        },
        product: {
          type: "object",
          properties: {
            ProductName: {
              type: "string",
              title: "FIELDS.product.ProductName"
            },
            ProductCode: {
              type: "string",
              title: "FIELDS.product.ProductCode"
            },
            Explanation: { type: "string", title: "FIELDS.product.Explanation" }
          }
        },
        maintenance: {
          type: "object",
          properties: {
            MaintenanceTitle: {
              type: "string",
              title: "FIELDS.maintenance.MaintenanceTitle"
            },
            KM: { type: "string", title: "FIELDS.maintenance.KM" },
            Explanation: {
              type: "string",
              title: "FIELDS.maintenance.Explanation"
            },
            MaintenanceStartDate: {
              type: "string",
              title: "FIELDS.maintenance.MaintenanceStartDate"
            },
            MaintenanceEndDate: {
              type: "string",
              title: "FIELDS.maintenance.MaintenanceEndDate"
            },
            VehicleId: {
              type: "string",
              title: "FIELDS.maintenance.VehicleId"
            },
            MaintenanceStatusId: {
              type: "string",
              title: "FIELDS.maintenance.MaintenanceStatusId"
            }
          }
        },
        driver: {
          type: "object",
          properties: {
            TCKN: { type: "string", title: "FIELDS.driver.TCKN" },
            DriverName: { type: "string", title: "FIELDS.driver.DriverName" },
            Phone: { type: "string", title: "FIELDS.driver.Phone" },
            Email: { type: "string", title: "FIELDS.driver.Email" },
            Address: { type: "string", title: "FIELDS.driver.Address" }
          }
        },
        company: {
          type: "object",
          properties: {
            CompanyName: {
              type: "string",
              title: "FIELDS.company.CompanyName"
            },
            CompanyTradeName: {
              type: "string",
              title: "FIELDS.company.CompanyTradeName"
            },
            CompanyEmail: {
              type: "string",
              title: "FIELDS.company.CompanyEmail"
            },
            Phone: { type: "string", title: "FIELDS.company.Phone" },
            AuthorizedPerson: {
              type: "string",
              title: "FIELDS.company.AuthorizedPerson"
            },
            AuthorizedPhone: {
              type: "string",
              title: "FIELDS.company.AuthorizedPhone"
            },
            AuthorizedEmail: {
              type: "string",
              title: "FIELDS.company.AuthorizedEmail"
            },
            LogoFilePath: {
              type: "string",
              title: "FIELDS.company.LogoFilePath"
            }
          }
        },
        device: {
          type: "object",
          properties: {
            DeviceCode: { type: "string", title: "FIELDS.device.DeviceCode" },
            DeviceName: { type: "string", title: "FIELDS.device.DeviceName" },
            Explanation: { type: "string", title: "FIELDS.device.Explanation" },
            SensorId: { type: "string", title: "FIELDS.device.SensorId" }
          }
        },
        station: {
          type: "object",
          properties: {
            StationCode: {
              type: "string",
              title: "FIELDS.station.StationCode"
            },
            StationName: {
              type: "string",
              title: "FIELDS.station.StationName"
            },
            StationType: {
              type: "string",
              title: "FIELDS.station.StationType"
            },
            Latitude: { type: "string", title: "FIELDS.station.Latitude" },
            Longitude: { type: "string", title: "FIELDS.station.Longitude" }
          }
        },
        smtp: {
          type: "object",
          properties: {
            Email: { type: "string", title: "FIELDS.smtp.Email" },
            Password: { type: "string", title: "FIELDS.smtp.Password" },
            Host: { type: "string", title: "FIELDS.smtp.Host" },
            Port: { type: "string", title: "FIELDS.smtp.Port" },
            EnableSsl: { type: "string", title: "FIELDS.smtp.EnableSsl" }
          }
        },
        sensorType: {
          type: "object",
          properties: {
            SensorTypeCode: {
              type: "string",
              title: "FIELDS.sensorType.SensorTypeCode"
            },
            SensorTypeName: {
              type: "string",
              title: "FIELDS.sensorType.SensorTypeName"
            }
          }
        },
        sensor: {
          type: "object",
          properties: {
            SensorCode: { type: "string", title: "FIELDS.sensor.SensorCode" },
            SensorName: { type: "string", title: "FIELDS.sensor.SensorName" },
            Explanation: { type: "string", title: "FIELDS.sensor.Explanation" }
          }
        },
        alarm: {
          type: "object",
          properties: {
            AlarmTypeId: { type: "string", title: "FIELDS.alarm.AlarmTypeId" },
            Plaque: { type: "string", title: "FIELDS.alarm.Plaque" },
            AlarmDetail: { type: "string", title: "FIELDS.alarm.AlarmDetail" },
            AlarmStatus: { type: "string", title: "FIELDS.alarm.AlarmStatus" }
          }
        },
        alarmType: {
          type: "object",
          properties: {
            AlarmDescription: {
              type: "string",
              title: "FIELDS.alarmType.AlarmDescription"
            }
          }
        },
        user: {
          type: "object",
          properties: {
            UserName: { type: "string", title: "FIELDS.user.UserName" },
            Email: { type: "string", title: "FIELDS.user.Email" },
            PhoneNumber: { type: "string", title: "FIELDS.user.PhoneNumber" },
            Password: { type: "string", title: "FIELDS.user.Password" },
            roles: { type: "string", title: "FIELDS.user.roles" }
          }
        },
        vehicle: {
          type: "object",
          properties: {
            Plaque: { type: "string", title: "FIELDS.vehicle.Plaque" },
            Capacity: { type: "string", title: "FIELDS.vehicle.Capacity" },
            VehicleTypeId: {
              type: "string",
              title: "FIELDS.vehicle.VehicleTypeId"
            },
            CompanyId: { type: "string", title: "FIELDS.vehicle.CompanyId" },
            VehicleProductGroupId: {
              type: "string",
              title: "FIELDS.vehicle.VehicleProductGroupId"
            },
            DriverId: { type: "string", title: "FIELDS.vehicle.DriverId" }
          }
        },
        vehicleDevice: {
          type: "object",
          properties: {
            VehicleId: {
              type: "string",
              title: "FIELDS.vehicleDevice.VehicleId"
            },
            DeviceId: { type: "string", title: "FIELDS.vehicleDevice.DeviceId" }
          }
        },
        vehicleType: {
          type: "object",
          properties: {
            TypeName: { type: "string", title: "FIELDS.vehicleType.TypeName" }
          }
        },
        vehicleTrack: {
          type: "object",
          properties: {
            VehicleId: {
              type: "string",
              title: "FIELDS.vehicleTrack.VehicleId"
            },
            DriverId: { type: "string", title: "FIELDS.vehicleTrack.DriverId" },
            Km: { type: "string", title: "FIELDS.vehicleTrack.Km" },
            Speed: { type: "string", title: "FIELDS.vehicleTrack.Speed" },
            Latitude: { type: "string", title: "FIELDS.vehicleTrack.Latitude" },
            Longitude: {
              type: "string",
              title: "FIELDS.vehicleTrack.Longitude"
            },
            Location: { type: "string", title: "FIELDS.vehicleTrack.Location" }
          }
        },
        vehicleProductGroup: {
          type: "object",
          properties: {
            VehicleProductCode: {
              type: "string",
              title: "FIELDS.vehicleProductGroup.VehicleProductCode"
            },
            VehicleProductName: {
              type: "string",
              title: "FIELDS.vehicleProductGroup.VehicleProductName"
            },
            Explanation: {
              type: "string",
              title: "FIELDS.vehicleProductGroup.Explanation"
            }
          }
        },
        log: {
          type: "object",
          properties: {
            table: { type: "string", title: "FIELDS.log.table" },
            method: { type: "string", title: "FIELDS.log.method" },
            user: { type: "string", title: "FIELDS.log.user" },
            requestJson: { type: "string", title: "FIELDS.log.requestJson" },
            responseJson: { type: "string", title: "FIELDS.log.responseJson" }
          }
        }
      }
    },
    TITLE: {
      type: "object",
      properties: {
        role: { type: "string", title: "FIELDS.TITLE.role" },
        product: { type: "string", title: "FIELDS.TITLE.product" },
        maintenance: { type: "string", title: "FIELDS.TITLE.maintenance" },
        driver: { type: "string", title: "FIELDS.TITLE.driver" },
        company: { type: "string", title: "FIELDS.TITLE.company" },
        device: { type: "string", title: "FIELDS.TITLE.device" },
        station: { type: "string", title: "FIELDS.TITLE.station" },
        smtp: { type: "string", title: "FIELDS.TITLE.smtp" },
        sensorType: { type: "string", title: "FIELDS.TITLE.sensorType" },
        sensor: { type: "string", title: "FIELDS.TITLE.sensor" },
        alarm: { type: "string", title: "FIELDS.TITLE.alarm" },
        alarmType: { type: "string", title: "FIELDS.TITLE.alarmType" },
        user: { type: "string", title: "FIELDS.TITLE.user" },
        vehicle: { type: "string", title: "FIELDS.TITLE.vehicle" },
        vehicleDevice: { type: "string", title: "FIELDS.TITLE.vehicleDevice" },
        vehicleType: { type: "string", title: "FIELDS.TITLE.vehicleType" },
        vehicleTrack: { type: "string", title: "FIELDS.TITLE.vehicleTrack" },
        vehicleProductGroup: {
          type: "string",
          title: "FIELDS.TITLE.vehicleProductGroup"
        },
        log: { type: "string", title: "FIELDS.TITLE.log" }
      }
    },
    ROLE_PAGE: {
      type: "object",
      properties: {
        "1": { type: "string", title: "FIELDS.ROLE_PAGE.1" },
        "2": { type: "string", title: "FIELDS.ROLE_PAGE.2" },
        "3": { type: "string", title: "FIELDS.ROLE_PAGE.3" },
        "4": { type: "string", title: "FIELDS.ROLE_PAGE.4" },
        "5": { type: "string", title: "FIELDS.ROLE_PAGE.5" },
        "6": { type: "string", title: "FIELDS.ROLE_PAGE.6" },
        "7": { type: "string", title: "FIELDS.ROLE_PAGE.7" },
        "8": { type: "string", title: "FIELDS.ROLE_PAGE.8" },
        "9": { type: "string", title: "FIELDS.ROLE_PAGE.9" },
        "10": { type: "string", title: "FIELDS.ROLE_PAGE.10" },
        "11": { type: "string", title: "FIELDS.ROLE_PAGE.11" },
        "12": { type: "string", title: "FIELDS.ROLE_PAGE.12" },
        "13": { type: "string", title: "FIELDS.ROLE_PAGE.13" },
        "14": { type: "string", title: "FIELDS.ROLE_PAGE.14" },
        "15": { type: "string", title: "FIELDS.ROLE_PAGE.15" },
        "16": { type: "string", title: "FIELDS.ROLE_PAGE.16" },
        "17": { type: "string", title: "FIELDS.ROLE_PAGE.17" },
        "18": { type: "string", title: "FIELDS.ROLE_PAGE.18" },
        "19": { type: "string", title: "FIELDS.ROLE_PAGE.19" },
        "20": { type: "string", title: "FIELDS.ROLE_PAGE.20" },
        "21": { type: "string", title: "FIELDS.ROLE_PAGE.21" }
      }
    },
    MAP: {
      type: "object",
      properties: {
        CAR_SELECT_PLACEHOLDER: {
          type: "string",
          title: "FIELDS.MAP.CAR_SELECT_PLACEHOLDER"
        },
        LOCATION: { type: "string", title: "FIELDS.MAP.LOCATION" },
        ROUTE: { type: "string", title: "FIELDS.MAP.ROUTE" },
        SEARCH: { type: "string", title: "FIELDS.MAP.SEARCH" },
        QUERY: { type: "string", title: "FIELDS.MAP.QUERY" },
        SPEED: { type: "string", title: "FIELDS.MAP.SPEED" }
      }
    }
  }
};

JsonEditor.setComponent("form", "el-form", ({ vm }) => {
  // vm is the JsonEditor VM

  const labelWidth = "25%";
  const model = vm.data;
  // returning the form props
  return { labelWidth, model };
});
JsonEditor.setComponent("label", "el-form-item", ({ field }) => ({
  prop: field.name
}));
JsonEditor.setComponent("email", "b-form-input");
JsonEditor.setComponent("url", "b-form-input");
JsonEditor.setComponent("number", "b-form-input");
JsonEditor.setComponent("text", "b-form-input");
JsonEditor.setComponent("textarea", "b-form-input");
JsonEditor.setComponent("checkbox", "b-form-checkbox");
JsonEditor.setComponent("checkboxgroup", "b-form-checkbox-group");
JsonEditor.setComponent("radio", "b-form-radio");
JsonEditor.setComponent("select", "b-form-select");
JsonEditor.setComponent("switch", "b-form-switch");
JsonEditor.setComponent("color", "b-form-color-picker");
JsonEditor.setComponent("rate", "b-form-rate");
// You can also use the component object
JsonEditor.setComponent("option", "b-form-select-option");
// By default `<h1/>` is used to render the form title.
// To override this, use the `title` type:
JsonEditor.setComponent("title", "h2");
// By default `<p/>` is used to render the form title.
// To override this, use the `description` type:
JsonEditor.setComponent("description", "small");
// By default `<div/>` is used to render the message error.
// To override this, use the `error` type:
JsonEditor.setComponent("error", "alert", ({ vm }) => ({
  type: "error",
  title: vm.error
}));

export default {
  name: "i18n",
  components: { JsonEditor },
  data() {
    return {
      schema: SCHEMA,
      selectedLang: "tr",
      languages: {},
      language: {}
    };
  },
  computed: {
    languageOptions() {
      return i18nService.languages.map(({ lang, name }) => {
        return { value: lang, text: name };
      });
    }
  },
  methods: {
    ...mapActions({
      setBreadCrumb: SET_BREADCRUMB
    }),
    onChangeLang(e) {
      this.language = this.languages[e];
    },
    submit() {
      alert(JSON.stringify(this.language));
    },
    reset() {
      this.$refs.JsonEditor.reset();
    }
  },
  beforeMount() {
    i18nService.languages.forEach(async ({ lang }) => {
      this.languages[lang] = {
        GENERAL: {
          "404": "Sayfa Bulunamadı!",
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
          "1": "Araç Listesi",
          "2": "Araç Hareketleri Listesi",
          "3": "Araç Tipleri",
          "4": "Araç Cihazlari",
          "5": "Harita",
          "6": "Firmalar",
          "7": "Bakım",
          "8": "Alarm Listesi",
          "9": "Soförler",
          "10": "İstasyonlar",
          "11": "Cihazlar",
          "12": "Sensörler",
          "13": "Ürün Gruplar",
          "14": "Kullanıcılar",
          "15": "Yetkiler",
          "16": "SMTP Ayarı",
          "17": "Kullanıcı Haraketleri",
          "18": "Rapor",
          "19": "Alarm Tipleri",
          "20": "Sensör Tipleri",
          "21": "Ürün Grupları"
        },
        MAP: {
          CAR_SELECT_PLACEHOLDER: "Bir Araç seçin",
          LOCATION: "Konum",
          ROUTE: "Rota",
          SEARCH: "Ara",
          QUERY: "Sorgula",
          SPEED: "Hız"
        }
      };
    });
    this.language = this.languages[this.selectedLang];
  },
  mounted() {
    this.setBreadCrumb([
      {
        title: "i18n",
        route: this.$router.route
      }
    ]);
  }
};
</script>

<style scoped></style>
