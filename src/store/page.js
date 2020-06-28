const state = () => ({
  pages: [
    {
      Id: 1,
      Page: "Araç Listesi",
      path: "vehicle"
    },
    {
      Id: 2,
      Page: "Araç Hareketleri Listesi",
      path: "vehicle-track"
    },
    {
      Id: 3,
      Page: "Araç Tipleri",
      path: "vehicle-type"
    },
    {
      Id: 4,
      Page: "Araç Cihazlari",
      path: "vehicle-devices"
    },
    {
      Id: 5,
      Page: "Harita",
      path: "map"
    },
    {
      Id: 6,
      Page: "Firmalar",
      path: "company"
    },
    {
      Id: 7,
      Page: "Bakim",
      path: "maintenance"
    },
    {
      Id: 8,
      Page: "Alarm Listesi",
      path: "alarm"
    },
    {
      Id: 9,
      Page: "Soförler",
      path: "driver"
    },
    {
      Id: 10,
      Page: "Istasyonlar",
      path: "station"
    },
    {
      Id: 11,
      Page: "Cihazlar",
      path: "device"
    },
    {
      Id: 12,
      Page: "Sensörler",
      path: "sensor"
    },
    {
      Id: 13,
      Page: "Ürün Gruplar",
      path: "vehicle-product-group"
    },
    {
      Id: 14,
      Page: "Kullanicilar",
      path: "user"
    },
    {
      Id: 15,
      Page: "Yetkiler",
      path: "role"
    },
    {
      Id: 16,
      Page: "SMTP Ayari",
      path: "smtp"
    },
    {
      Id: 17,
      Page: "RisePage",
      path: ""
    },
    {
      Id: 18,
      Page: "Rapor",
      path: "report"
    },
    {
      Id: 19,
      Page: "Alarm Tipleri",
      path: "alarm-type"
    },
    {
      Id: 20,
      Page: "Sensör Tipleri",
      path: "sensor-type"
    },
    {
      Id: 21,
      Page: "Ürün Grupları",
      path: "product"
    }
  ]
});
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
