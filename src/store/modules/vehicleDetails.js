import ApiService from "../../common/api.service";

// action types
export const FETCH_VEHICLEDETAILS = "FETCH_VEHICLEDETAILS";
export const SAVE_VEHICLEDETAILS = "SAVE_VEHICLEDETAILS";
export const CREATE_VEHICLEDETAILS = "CREATE_VEHICLEDETAILS";
export const DELETE_VEHICLEDETAILS = "DELETE_VEHICLEDETAILS";

// mutation types
export const SET_VEHICLEDETAILS = "SET_VEHICLEDETAILS";
export const UPDATE_VEHICLEDETAILS = "UPDATE_VEHICLEDETAILS";
export const REMOVE_VEHICLEDETAILS = "REMOVE_VEHICLEDETAILS";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getVehicleDetails(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_VEHICLEDETAILS](context) {
    return ApiService.get("VehicleDetails", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_VEHICLEDETAILS, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_VEHICLEDETAILS](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("VehicleDetails/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_VEHICLEDETAILS, data.Data);
          context.dispatch(FETCH_VEHICLEDETAILS);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
        throw new Error(err);
      });
  },
  [CREATE_VEHICLEDETAILS](context, payload) {
    return ApiService.post("VehicleDetails/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_VEHICLEDETAILS);
          //context.commit(UPDATE_VEHICLEDETAILS, data.Data);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
        throw new Error(err);
      });
  },
  [DELETE_VEHICLEDETAILS](context, payload) {
    return ApiService.query("VehicleDetails/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_VEHICLEDETAILS, data.Data);
          context.dispatch(FETCH_VEHICLEDETAILS);
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
  [SET_VEHICLEDETAILS](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_VEHICLEDETAILS](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_VEHICLEDETAILS](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
