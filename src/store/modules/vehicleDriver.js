import ApiService from "../../common/api.service";

// action types
export const FETCH_VEHICLEDRIVER = "FETCH_VEHICLEDRIVER";
export const SAVE_VEHICLEDRIVER = "SAVE_VEHICLEDRIVER";
export const CREATE_VEHICLEDRIVER = "CREATE_VEHICLEDRIVER";
export const DELETE_VEHICLEDRIVER = "DELETE_VEHICLEDRIVER";

// mutation types
export const SET_VEHICLEDRIVER = "SET_VEHICLEDRIVER";
export const UPDATE_VEHICLEDRIVER = "UPDATE_VEHICLEDRIVER";
export const REMOVE_VEHICLEDRIVER = "REMOVE_VEHICLEDRIVER";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getVehicleDrivers(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_VEHICLEDRIVER](context) {
    return ApiService.get("VehicleDriver", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_VEHICLEDRIVER, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_VEHICLEDRIVER](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("VehicleDriver/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_VEHICLEDRIVER, data.Data);
          context.dispatch(FETCH_VEHICLEDRIVER);
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
  [CREATE_VEHICLEDRIVER](context, payload) {
    return ApiService.post("VehicleDriver/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_VEHICLEDRIVER);
          //context.commit(UPDATE_VEHICLEDRIVER, data.Data);
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
  [DELETE_VEHICLEDRIVER](context, payload) {
    return ApiService.query("VehicleDriver/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_VEHICLEDRIVER, data.Data);
          context.dispatch(FETCH_VEHICLEDRIVER);
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
  [SET_VEHICLEDRIVER](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_VEHICLEDRIVER](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_VEHICLEDRIVER](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
