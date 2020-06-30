import ApiService from "../../common/api.service";

// action types
export const FETCH_VEHICLESTATUS = "FETCH_VEHICLESTATUS";
export const FETCH_VEHICLESTATUSBYVEHICLE = "FETCH_VEHICLESTATUSBYVEHICLE";
export const SAVE_VEHICLESTATUS = "SAVE_VEHICLESTATUS";
export const CREATE_VEHICLESTATUS = "CREATE_VEHICLESTATUS";
export const DELETE_VEHICLESTATUS = "DELETE_VEHICLESTATUS";

// mutation types
export const SET_VEHICLESTATUS = "SET_VEHICLESTATUS";
export const SET_VEHICLESTATUSBYVEHICLE = "SET_VEHICLESTATUSBYVEHICLE";
export const UPDATE_VEHICLESTATUS = "UPDATE_VEHICLESTATUS";
export const REMOVE_VEHICLESTATUS = "REMOVE_VEHICLESTATUS";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: [],
  statusByVehicle: []
};

const getters = {
  getVehicleStatuses(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_VEHICLESTATUS](context) {
    return ApiService.get("VehicleStatus", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_VEHICLESTATUS, data.Data);
        } else {
          context.commit(SET_ERROR, data.message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [FETCH_VEHICLESTATUSBYVEHICLE](context, payload) {
    return ApiService.query("VehicleStatus/get", {
      params: { id: payload }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_VEHICLESTATUSBYVEHICLE, data.Data);
        } else {
          context.commit(SET_ERROR, data.message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_VEHICLESTATUS](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("VehicleStatus/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_VEHICLE_TYPE, data.Data);
          context.dispatch(FETCH_VEHICLESTATUS);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [CREATE_VEHICLESTATUS](context, payload) {
    return ApiService.post("VehicleStatus/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_VEHICLESTATUS);
          //context.commit(UPDATE_VEHICLE_TYPE, data.Data);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [DELETE_VEHICLESTATUS](context, payload) {
    return ApiService.query("VehicleStatus/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_VEHICLE_TYPE, data.Data);
          context.dispatch(FETCH_VEHICLESTATUS);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  }
};

const mutations = {
  [SET_VEHICLESTATUS](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_VEHICLESTATUSBYVEHICLE](state, payload) {
    const index = state.statusByVehicle.findIndex(
      status => status.VehicleId === payload.VehicleId
    );
    if (index < 0) {
      state.statusByVehicle = [...state.statusByVehicle, payload];
    } else {
      state.statusByVehicle[index] = payload;
    }
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_VEHICLESTATUS](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_VEHICLESTATUS](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
