import { FETCH_VEHICLELOCATIONDETAIL } from "./modules/vehicleLocationDetail";
import { FETCH_VEHICLE } from "./modules/vehicle";
// action types

export const CONNECT = "CONNECT";
// mutation types
export const SET_CONNECT = "SET_CONNECT";

const state = {
  isConnected: false
};

const getters = {};

const actions = {
  [CONNECT](context) {
    if (this._vm.$socket.socket !== false) return;
    this._vm.$socket.start().then(() => {
      context.commit(SET_CONNECT, true);
    });
    this._vm.$socket.listen("GetVehicleLocationDetail");
    this._vm.$socket.listen("GetLastCreatedData");
    this._vm.$socket.on("GetVehicleLocationDetail", data => {
      context.dispatch(FETCH_VEHICLELOCATIONDETAIL, data);
    });
    this._vm.$socket.on("GetLastCreatedData", data => {
      context.dispatch(FETCH_VEHICLELOCATIONDETAIL, data);
    });
    context.dispatch(FETCH_VEHICLE).then(data => {
      if (data.IsSuccess) {
        data.Data.forEach(vehicle => {
          this._vm.$socket.send("GetRealTimeData", vehicle.Id);
        });
      }
    });
  }
};

const mutations = {
  [SET_CONNECT](state, payload) {
    state.isConnected = payload;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
