import Vue from "vue";
import Router from "vue-router";
import store from "./store";
import { VERIFY_AUTH } from "./store/auth.module";
import {
  ADD_BODY_CLASSNAME,
  REMOVE_BODY_CLASSNAME
} from "./store/htmlclass.module";
import { loadLanguageAsync } from "./common/plugins/vue-i18n";
Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/map",
      component: () => import("@/views/theme/Base"),
      children: [
        {
          path: "/report",
          name: "report",
          component: () => import("./views/pages/report.vue")
        },
        {
          path: "/vehicle",
          component: () => import("./views/pages/vehicle.vue")
        },
        {
          path: "/vehicle/:vehicleId",
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
          path: "/smtp",
          component: () => import("./views/pages/smtp.vue")
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
          path: "/log",
          component: () => import("./views/pages/log.vue")
        },
        {
          path: "/i18n",
          component: () => import("./views/pages/i18n.vue")
        },
        {
          name: "map",
          path: "/map",
          component: () => import("./views/pages/mapView.vue"),
          props: route => ({
            vehicleId: route.query.vehicleId || null,
            companyId: route.query.companyId || null,
            maptype: route.query.maptype || "location"
          })
        },
        {
          name: "mapDetail",
          path: "/map/:companyId/:vehicleId/:maptype",
          component: () => import("./views/pages/mapView.vue")
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
          path: "/alarm-type",
          component: () => import("./views/pages/alarm-type.vue")
        },
        {
          path: "/sensor-type",
          component: () => import("./views/pages/sensor-type.vue")
        },
        {
          path: "/vehicle-product-group",
          component: () => import("./views/pages/vehicle-product-group.vue")
        }
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

// Ensure we checked auth before each page load.
router.beforeEach(async (to, from, next) => {
  store.dispatch(ADD_BODY_CLASSNAME, "kt-page--loading");
  await loadLanguageAsync();
  if (to.name === "login") next();
  else
    store.dispatch(VERIFY_AUTH).then(res => {
      if (res) next();
      else next("/login");
    });

  // Scroll page to top on every route change
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

router.afterEach(() => {
  store.dispatch(REMOVE_BODY_CLASSNAME, "kt-page--loading");
});
export default router;
