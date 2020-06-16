import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      component: () => import("@/views/theme/Base"),
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
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
          path: "/user",
          component: () => import("./views/pages/user.vue")
        },
        {
          path: "/role",
          component: () => import("./views/pages/role.vue")
        },
        {
          name: "map",
          path: "/map",
          component: () => import("./views/pages/mapView.vue"),
          props: true
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
        ]
    },
    {
      path: "/",
      component: () => import("@/views/pages/auth/Auth"),
      children: [
        {
          name: "login",
          path: "/login",
          component: () => import("@/views/pages/auth/Login")
        },
        {
          name: "register",
          path: "/register",
          component: () => import("@/views/pages/auth/Register")
        }
      ]
    },
    {
      path: "*",
      redirect: "/404"
    },
    {
      // the 404 route, when none of the above matches
      path: "/404",
      name: "404",
      component: () => import("@/views/pages/error.vue")
    }
  ]
});
