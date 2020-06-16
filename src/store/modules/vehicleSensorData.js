import ApiService from "../../common/api.service";

// action types
export const FETCH_VEHICLESENSORDATA = "FETCH_VEHICLESENSORDATA";
export const SAVE_VEHICLESENSORDATA = "SAVE_VEHICLESENSORDATA";
export const CREATE_VEHICLESENSORDATA = "CREATE_VEHICLESENSORDATA";
export const DELETE_VEHICLESENSORDATA = "DELETE_VEHICLESENSORDATA";

// mutation types
export const SET_VEHICLESENSORDATA = "SET_VEHICLESENSORDATA";
export const UPDATE_VEHICLESENSORDATA = "UPDATE_VEHICLESENSORDATA";
export const REMOVE_VEHICLESENSORDATA = "REMOVE_VEHICLESENSORDATA";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getVehicleSensorData(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_VEHICLESENSORDATA](context) {
    return ApiService.get("VehicleSensorData", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_VEHICLESENSORDATA, data.Data);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_VEHICLESENSORDATA](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("VehicleSensorData/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_VEHICLE_TYPE, data.Data);
          context.dispatch(FETCH_VEHICLESENSORDATA);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [CREATE_VEHICLESENSORDATA](context, payload) {
    return ApiService.post("VehicleSensorData/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_VEHICLESENSORDATA);
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
  [DELETE_VEHICLESENSORDATA](context, payload) {
    return ApiService.query("VehicleSensorData/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_VEHICLE_TYPE, data.Data);
          context.dispatch(FETCH_VEHICLESENSORDATA);
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
  [SET_VEHICLESENSORDATA](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_VEHICLESENSORDATA](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_VEHICLESENSORDATA](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
