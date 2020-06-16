import ApiService from "../../common/api.service";

// action types
export const FETCH_VEHICLESTATUSTYPE = "FETCH_VEHICLESTATUSTYPE";
export const SAVE_VEHICLESTATUSTYPE = "SAVE_VEHICLESTATUSTYPE";
export const CREATE_VEHICLESTATUSTYPE = "CREATE_VEHICLESTATUSTYPE";
export const DELETE_VEHICLESTATUSTYPE = "DELETE_VEHICLESTATUSTYPE";

// mutation types
export const SET_VEHICLESTATUSTYPE = "SET_VEHICLESTATUSTYPE";
export const UPDATE_VEHICLESTATUSTYPE = "UPDATE_VEHICLESTATUSTYPE";
export const REMOVE_VEHICLESTATUSTYPE = "REMOVE_VEHICLESTATUSTYPE";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getVehicleStatusTypes(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_VEHICLESTATUSTYPE](context) {
    return ApiService.get("VehicleStatusType", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_VEHICLESTATUSTYPE, data.Data);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_VEHICLESTATUSTYPE](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("VehicleStatusType/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_VEHICLE_TYPE, data.Data);
          context.dispatch(FETCH_VEHICLESTATUSTYPE);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [CREATE_VEHICLESTATUSTYPE](context, payload) {
    return ApiService.post("VehicleStatusType/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_VEHICLESTATUSTYPE);
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
  [DELETE_VEHICLESTATUSTYPE](context, payload) {
    return ApiService.query("VehicleStatusType/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_VEHICLE_TYPE, data.Data);
          context.dispatch(FETCH_VEHICLESTATUSTYPE);
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
  [SET_VEHICLESTATUSTYPE](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_VEHICLESTATUSTYPE](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_VEHICLESTATUSTYPE](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
