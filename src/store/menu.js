const state = {
  menuItems: [],
  menuReport: [
    {
      title: "Rapor",
      root: true,
      icon: "",
      page: "dashboard",
      bullet: "dot"
    }
  ],
  menuDefinitions: [
    {
      title: "Tanımlamalar",
      root: true,
      bullet: "dot",
      icon: "",
      submenu: [
        {
          title: "Firmalar",
          root: true,
          icon: "",
          bullet: "dot",
          page: "company"
        },
        {
          title: "Bakım",
          root: true,
          icon: "",
          bullet: "dot",
          page: "maintenance"
        },
        {
          title: "Alarm Listesi",
          page: "alarm",
          root: true,
          icon: "",
          bullet: "dot"
        },
        {
          title: "Alarm Tipleri",
          page: "alarm-type",
          root: true,
          icon: "",
          bullet: "dot"
        },
        {
          title: "Şoförler",
          page: "driver",
          root: true,
          icon: "",
          bullet: "dot"
        },
        {
          title: "İstasyonlar",
          page: "station",
          root: true,
          icon: "",
          bullet: "dot"
        },
        {
          title: "Cihazlar",
          page: "device",
          root: true,
          icon: "",
          bullet: "dot"
        },
        {
          title: "Sensörler",
          page: "sensor",
          root: true,
          icon: "",
          bullet: "dot"
        },
        {
          title: "Sensör Tipleri",
          page: "sensor-type",
          root: true,
          icon: "",
          bullet: "dot"
        },
        {
          title: "Ürün Grupları",
          page: "product",
          root: true,
          icon: "",
          bullet: "dot"
        }
      ]
    }
  ],
  menuVehicles: [
    {
      title: "Araçlar",
      root: true,
      bullet: "dot",
      icon: "",
      submenu: [
        {
          title: "Araç Listesi",
          page: "vehicle"
        },
        {
          title: "Araç Hareketleri Listesi",
          page: "vehicle-track"
        },
        {
          title: "Araç Tipleri",
          page: "vehicle-type"
        },
        {
          title: "Araç Cihazları",
          page: "vehicle-devices"
        },
        {
          title: "Araç Ürün Grupları",
          page: "vehicle-product-group"
        },
        {
          title: "Harita",
          page: "map"
        }
      ]
    }
  ],
  menuSettings: [
    {
      title: "Kullanıcı Ayarları",
      root: true,
      icon: "",
      bullet: "dot",
      submenu: [
        {
          title: "Kullanıcılar",
          page: "user"
        },
        {
          title: "Roller",
          page: "role"
        }
      ]
    }
  ]
};
const getters = {
  getMenu(state, getters) {
    return [
      ...getters.getMenuCompanyTree,
      ...getters.getMenuReport,
      ...getters.getMenuVehicles,
      ...getters.getMenuDefinitions,
      ...getters.getMenuSettings
    ];
  },
  getMenuCompanyTree(state, getters, rootState) {
    if (rootState.company.items.length === 0) return [];
    let companies = [...rootState.company.items].map(item => {
      item.vehicles = [];
      return item;
    });
    const vehicles = [...rootState.vehicle.items];
    const masterCompany = companies.find(item => item.TopCompany === 0);
    vehicles.forEach(item => {
      companies
        .find(company => company.Id === item.CompanyId)
        .vehicles.push(item);
    });
    companies = companies.map(company => {
      company.subCompanies = [
        ...companies.filter(c2 => c2.TopCompany === company.Id)
      ];
      return company;
    });
    const getSubMenu = company => {
      return [
        ...company.vehicles.map(v => {
          return {
            title: v.Plaque,
            page: "map/?vehicleId="+v.Id,
          };
        }),

        ...company.subCompanies.map(c => {
          return {
            title: c.CompanyName,
            submenu: getSubMenu(c)
          };
        })
      ];
    };
    const menu = [
      {
        title: masterCompany.CompanyName,
        root: true,
        bullet: "dot",
        icon: "",
        submenu: getSubMenu(masterCompany)
      }
    ];
    return menu;
  },
  getMenuReport(state) {
    return state.menuReport;
  },
  getMenuDefinitions(state) {
    return state.menuDefinitions;
  },
  getMenuVehicles(state) {
    return state.menuVehicles;
  },
  getMenuSettings(state) {
    return state.menuSettings;
  }
};

module.exports = {
  state,
  getters
};
