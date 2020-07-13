import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
// import SecureLS from "secure-ls";

import auth from "./auth.module";
import breadcrumbs from "./breadcrumbs.module";
import config from "./config.module";
import htmlClass from "./htmlclass.module";
import menu from "./menu";
import page from "./page";
import socket from "./socket";

const requireModules = require.context("./modules", false);

const modules = requireModules
  .keys()
  .map(fileName => {
    const moduleConfig = requireModules(fileName);
    moduleConfig._name = fileName.replace("./", "").replace(".js", "");
    return moduleConfig;
  })
  .reduce((m, el) => {
    m[el._name] = el.default;
    return m;
  }, {});

Vue.use(Vuex);

// const ls = new SecureLS({ encodingType: "aes" });

export default new Vuex.Store({
  modules: {
    socket,
    auth,
    htmlClass,
    config,
    breadcrumbs,
    menu,
    page,
    ...modules
  },
  plugins: [
    createPersistedState({
      paths: ["auth", "page", "user", "role", "menu"]
      // storage: {
      //   getItem: key => ls.get(key),
      //   setItem: (key, value) => ls.set(key, value),
      //   removeItem: key => ls.remove(key)
      // }
    })
  ]
});
