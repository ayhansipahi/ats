const state = {
  pages: [
    {
      Id: 1,
      Page: "Araç Listesi",
      path: "vehicle",
      siteName: "vehicle"
    },
    {
      Id: 2,
      Page: "Araç Hareketleri Listesi",
      path: "vehicle-track",
      siteName: "vehicleTrack"
    },
    {
      Id: 3,
      Page: "Araç Tipleri",
      path: "vehicle-type",
      siteName: "vehicleType"
    },
    {
      Id: 4,
      Page: "Araç Cihazlari",
      path: "vehicle-devices",
      siteName: "vehicleDevice"
    },
    {
      Id: 5,
      Page: "Harita",
      path: "map",
      siteName: "mapView"
    },
    {
      Id: 6,
      Page: "Firmalar",
      path: "company",
      siteName: "company"
    },
    {
      Id: 7,
      Page: "Bakim",
      path: "maintenance",
      siteName: "maintenance"
    },
    {
      Id: 8,
      Page: "Alarm Listesi",
      path: "alarm",
      siteName: "alarm"
    },
    {
      Id: 9,
      Page: "Soförler",
      path: "driver",
      siteName: "driver"
    },
    {
      Id: 10,
      Page: "Istasyonlar",
      path: "station",
      siteName: "station"
    },
    {
      Id: 11,
      Page: "Cihazlar",
      path: "devices",
      siteName: "devices"
    },
    {
      Id: 12,
      Page: "Sensörler",
      path: "sensor",
      siteName: "sensor"
    },
    {
      Id: 13,
      Page: "Ürün Gruplar",
      path: "vehicle-product-group",
      siteName: "vehicleProductGroup"
    },
    {
      Id: 14,
      Page: "Kullanicilar",
      path: "user",
      siteName: "user"
    },
    {
      Id: 15,
      Page: "Yetkiler",
      path: "role",
      siteName: "role"
    },
    {
      Id: 16,
      Page: "SMTP Ayari",
      path: "smtp",
      siteName: "smtp"
    },
    {
      Id: 17,
      Page: "RisePage",
      path: "",
      siteName: ""
    },
    {
      Id: 18,
      Page: "Rapor",
      path: "report",
      siteName: "report"
    }
  ]
};
const getters = {
  getPageByPath(state) {
    return path => {
      return state.pages.find(page => page.path === path);
    };
  }
};

export default {
  state,
  getters
};
