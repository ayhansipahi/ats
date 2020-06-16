import ApiService from "../../common/api.service";

// action types
export const FETCH_VEHICLESTATIONDISTANCE = "FETCH_VEHICLESTATIONDISTANCE";
export const SAVE_VEHICLESTATIONDISTANCE = "SAVE_VEHICLESTATIONDISTANCE";
export const CREATE_VEHICLESTATIONDISTANCE = "CREATE_VEHICLESTATIONDISTANCE";
export const DELETE_VEHICLESTATIONDISTANCE = "DELETE_VEHICLESTATIONDISTANCE";

// mutation types
export const SET_VEHICLESTATIONDISTANCE = "SET_VEHICLESTATIONDISTANCE";
export const UPDATE_VEHICLESTATIONDISTANCE = "UPDATE_VEHICLESTATIONDISTANCE";
export const REMOVE_VEHICLESTATIONDISTANCE = "REMOVE_VEHICLESTATIONDISTANCE";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getVehicleStationDistances(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_VEHICLESTATIONDISTANCE](context) {
    return ApiService.get("VehicleStationDistance", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_VEHICLESTATIONDISTANCE, data.Data);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_VEHICLESTATIONDISTANCE](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("VehicleStationDistance/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_VEHICLE_TYPE, data.Data);
          context.dispatch(FETCH_VEHICLESTATIONDISTANCE);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [CREATE_VEHICLESTATIONDISTANCE](context, payload) {
    return ApiService.post("VehicleStationDistance/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_VEHICLESTATIONDISTANCE);
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
  [DELETE_VEHICLESTATIONDISTANCE](context, payload) {
    return ApiService.query("VehicleStationDistance/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_VEHICLE_TYPE, data.Data);
          context.dispatch(FETCH_VEHICLESTATIONDISTANCE);
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
  [SET_VEHICLESTATIONDISTANCE](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_VEHICLESTATIONDISTANCE](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_VEHICLESTATIONDISTANCE](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
