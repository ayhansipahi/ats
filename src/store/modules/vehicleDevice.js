import ApiService from "../../common/api.service";

// action types
export const FETCH_VEHICLEDEVICE = "FETCH_VEHICLEDEVICE";
export const SAVE_VEHICLEDEVICE = "SAVE_VEHICLEDEVICE";
export const CREATE_VEHICLEDEVICE = "CREATE_VEHICLEDEVICE";
export const DELETE_VEHICLEDEVICE = "DELETE_VEHICLEDEVICE";

// mutation types
export const SET_VEHICLEDEVICE = "SET_VEHICLEDEVICE";
export const UPDATE_VEHICLEDEVICE = "UPDATE_VEHICLEDEVICE";
export const REMOVE_VEHICLEDEVICE = "REMOVE_VEHICLEDEVICE";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getVehicleDevices(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_VEHICLEDEVICE](context) {
    return ApiService.get("VehicleDevice", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_VEHICLEDEVICE, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_VEHICLEDEVICE](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("VehicleDevice/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_VEHICLEDEVICE, data.Data);
          context.dispatch(FETCH_VEHICLEDEVICE);
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
  [CREATE_VEHICLEDEVICE](context, payload) {
    return ApiService.post("VehicleDevice/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_VEHICLEDEVICE);
          //context.commit(UPDATE_VEHICLEDEVICE, data.Data);
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
  [DELETE_VEHICLEDEVICE](context, payload) {
    return ApiService.query("VehicleDevice/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_VEHICLEDEVICE, data.Data);
          context.dispatch(FETCH_VEHICLEDEVICE);
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
  [SET_VEHICLEDEVICE](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_VEHICLEDEVICE](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_VEHICLEDEVICE](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
