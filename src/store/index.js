import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth.module";
import htmlClass from "./htmlclass.module";
import config from "./config.module";
import breadcrumbs from "./breadcrumbs.module";

import alarm from "./modules/alarm";
import company from "./modules/company";
import deviceSensor from "./modules/deviceSensor";
import maintenance from "./modules/maintenance";
import product from "./modules/product";
import sensorType from "./modules/sensorType";
import vehicle from "./modules/vehicle";
import vehicleDriver from "./modules/vehicleDriver";
import alarmType from "./modules/alarmType";
import device from "./modules/device";
import driver from "./modules/driver";
import maintenanceDetails from "./modules/maintenanceDetails";
import sensor from "./modules/sensor";
import station from "./modules/station";
import vehicleDetails from "./modules/vehicleDetails";
import vehicleDevice from "./modules/vehicleDevice";
import vehicleType from "./modules/vehicleType";
import vehicleProductGroup from "./modules/vehicleProductGroup";
import user from "./modules/user";
import role from "./modules/role";
import vehicleLocationDetail from "./modules/vehicleLocationDetail";
import socket from "./socket";
import smtp from "./modules/smtp";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    socket,
    auth,
    htmlClass,
    config,
    breadcrumbs,
    alarm,
    company,
    deviceSensor,
    maintenance,
    product,
    sensorType,
    vehicle,
    vehicleDriver,
    alarmType,
    device,
    driver,
    maintenanceDetails,
    sensor,
    station,
    vehicleDetails,
    vehicleDevice,
    vehicleType,
    vehicleProductGroup,
    user,
    role,
    vehicleLocationDetail,
    smtp
  }
});
