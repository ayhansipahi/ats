import ApiService from "../../common/api.service";

// action types
export const FETCH_VEHICLETYPE = "FETCH_VEHICLETYPE";
export const SAVE_VEHICLETYPE = "SAVE_VEHICLETYPE";
export const CREATE_VEHICLETYPE = "CREATE_VEHICLETYPE";
export const DELETE_VEHICLETYPE = "DELETE_VEHICLETYPE";

// mutation types
export const SET_VEHICLETYPE = "SET_VEHICLETYPE";
export const UPDATE_VEHICLETYPE = "UPDATE_VEHICLETYPE";
export const REMOVE_VEHICLETYPE = "REMOVE_VEHICLETYPE";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getVehicleTypes(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_VEHICLETYPE](context) {
    return ApiService.get("VehicleType", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_VEHICLETYPE, data.Data);
        } else {
          context.commit(SET_ERROR, data.Message );
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_VEHICLETYPE](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("VehicleType/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_VEHICLE_TYPE, data.Data);
          context.dispatch(FETCH_VEHICLETYPE);
        } else {
          context.commit(SET_ERROR, data.Message );
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [CREATE_VEHICLETYPE](context, payload) {
    return ApiService.post("VehicleType/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_VEHICLETYPE);
          //context.commit(UPDATE_VEHICLE_TYPE, data.Data);
        } else {
          context.commit(SET_ERROR, data.Message );
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [DELETE_VEHICLETYPE](context, payload) {
    return ApiService.query("VehicleType/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_VEHICLE_TYPE, data.Data);
          context.dispatch(FETCH_VEHICLETYPE);
        } else {
          context.commit(SET_ERROR, data.Message );
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  }
};

const mutations = {
  [SET_VEHICLETYPE](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_VEHICLETYPE](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_VEHICLETYPE](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
