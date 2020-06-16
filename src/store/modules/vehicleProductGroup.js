import ApiService from "../../common/api.service";

// action types
export const FETCH_VEHICLEPRODUCTGROUP = "FETCH_VEHICLEPRODUCTGROUP";
export const SAVE_VEHICLEPRODUCTGROUP = "SAVE_VEHICLEPRODUCTGROUP";
export const CREATE_VEHICLEPRODUCTGROUP = "CREATE_VEHICLEPRODUCTGROUP";
export const DELETE_VEHICLEPRODUCTGROUP = "DELETE_VEHICLEPRODUCTGROUP";

// mutation types
export const SET_VEHICLEPRODUCTGROUP = "SET_VEHICLEPRODUCTGROUP";
export const UPDATE_VEHICLEPRODUCTGROUP = "UPDATE_VEHICLEPRODUCTGROUP";
export const REMOVE_VEHICLEPRODUCTGROUP = "REMOVE_VEHICLEPRODUCTGROUP";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getVehicleProductGroups(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_VEHICLEPRODUCTGROUP](context) {
    return ApiService.get("VehicleProductGroup", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_VEHICLEPRODUCTGROUP, data.Data);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_VEHICLEPRODUCTGROUP](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("VehicleProductGroup/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_VEHICLE_TYPE, data.Data);
          context.dispatch(FETCH_VEHICLEPRODUCTGROUP);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [CREATE_VEHICLEPRODUCTGROUP](context, payload) {
    return ApiService.post("VehicleProductGroup/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_VEHICLEPRODUCTGROUP);
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
  [DELETE_VEHICLEPRODUCTGROUP](context, payload) {
    return ApiService.query("VehicleProductGroup/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_VEHICLE_TYPE, data.Data);
          context.dispatch(FETCH_VEHICLEPRODUCTGROUP);
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
  [SET_VEHICLEPRODUCTGROUP](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_VEHICLEPRODUCTGROUP](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_VEHICLEPRODUCTGROUP](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
