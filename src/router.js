import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      component: () => import("./views/pages/dashboard.vue")
    },
    {
      path: "/vehicle",
      component: () => import("./views/pages/vehicle.vue")
    },
    {
      path: "/driver",
      component: () => import("./views/pages/driver.vue")
    },
    {
      path: "/vehicle-type",
      component: () => import("./views/pages/vehicle-type.vue")
    },
    {
      path: "/station",
      component: () => import("./views/pages/station.vue")
    },
    {
      path: "/sensor",
      component: () => import("./views/pages/sensor.vue")
    },
    {
      path: "/device",
      component: () => import("./views/pages/device.vue")
    },
    {
      path: "/product",
      component: () => import("./views/pages/product.vue")
    },
    {
      path: "/maintenance",
      component: () => import("./views/pages/maintenance.vue")
    },
    {
      path: "/vehicle-track",
      component: () => import("./views/pages/vehicle-track.vue")
    },
    {
      path: "/vehicle-devices",
      component: () => import("./views/pages/vehicle-devices.vue")
    },
    {
      path: "/map",
      component: () => import("./views/pages/map.vue")
    },
    {
      path: "/list/:page",
      component: () => import("./views/pages/list.vue")
    },
    {
      path: "/list/:page/:detail",
      component: () => import("./views/pages/list.vue")
    },
    {
      path: "/arac-hareketleri",
      component: () => import("./views/pages/hareketler.vue")
    },
    {
      path: "/company",
      component: () => import("./views/pages/company.vue")
    },
    {
      path: "/alarm",
      component: () => import("./views/pages/alarm.vue")
    },
    {
      path: "/harita/:type",
      component: () => import("./views/pages/harita.vue")
    },
    {
      path: "/login",
      component: () => import("./views/pages/login.vue")
    },
    {
      path: "*",
      redirect: "/404"
    },
    {
      path: "/404",
      component: () => import("./views/pages/error.vue")
    }
  ]
});
