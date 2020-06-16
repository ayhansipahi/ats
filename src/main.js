import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import store from "./store";

// import VueSignalR from "@latelier/vue-signalr";

import VueToastr2 from "vue-toastr-2";
import "vue-toastr-2/dist/vue-toastr-2.min.css";
import * as VueGoogleMaps from "vue2-google-maps";
import ApiService from "./common/api.service";
//import MockService from "./common/mock/mock.service";
import { VERIFY_AUTH } from "./store/auth.module";

Vue.config.productionTip = false;

window.$ = require("jquery");
window.JQuery = require("jquery");
window.toastr = require("toastr");

Vue.use(VueToastr2);

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAhJg3hOUR4QqA_SsYyyen139UNZ4WSn8A",
    libraries: "places,drawing,visualization",
    language: "tr"
  }
});

Vue.prototype.$axios = axios.create({
  baseURL: "https://tupras-test.azurewebsites.net/"
});

//Vue.use(VueSignalR, "https://tupras-test.azurewebsites.net/realtimedatahub");
Vue.use(require("vue-moment"));

var VueScrollTo = require("vue-scrollto");

Vue.use(VueScrollTo, {
  container: "body",
  duration: 500,
  easing: "ease",
  offset: window.innerWidth < 1025 ? -38 : -115,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true
});

// Global 3rd party plugins
import "bootstrap";
import "popper.js";
import "tooltip.js";
import "perfect-scrollbar";

// Vue 3rd party plugins
import i18n from "./common/plugins/vue-i18n";
import vuetify from "./common/plugins/vuetify";
import "./common/plugins/bootstrap-vue";
import "./common/plugins/perfect-scrollbar";
import "./common/plugins/highlight-js";
import "@babel/polyfill";
import "@mdi/font/css/materialdesignicons.css";

// API service init
ApiService.init();

// Remove this to disable mock API
//MockService.init();

// Ensure we checked auth before each page load.
router.beforeEach((to, from, next) => {
  Promise.all([store.dispatch(VERIFY_AUTH)]).then(next);

  // Scroll page to top on every route change
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App),
  created() {
    /*this.$socket.start({
      log: true // Active only in development for debugging.
    });*/
  }
}).$mount("#app");
