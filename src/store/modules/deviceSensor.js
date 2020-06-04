import ApiService from "../../common/api.service";

// action types
export const FETCH_DEVICESENSOR = "FETCH_DEVICESENSOR";
export const SAVE_DEVICESENSOR = "SAVE_DEVICESENSOR";
export const CREATE_DEVICESENSOR = "CREATE_DEVICESENSOR";
export const DELETE_DEVICESENSOR = "DELETE_DEVICESENSOR";

// mutation types
export const SET_DEVICESENSOR = "SET_DEVICESENSOR";
export const UPDATE_DEVICESENSOR = "UPDATE_DEVICESENSOR";
export const REMOVE_DEVICESENSOR = "REMOVE_DEVICESENSOR";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getDeviceSensors(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_DEVICESENSOR](context) {
    return ApiService.get("DeviceSensor", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_DEVICESENSOR, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_DEVICESENSOR](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("DeviceSensor/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_DEVICESENSOR, data.Data);
          context.dispatch(FETCH_DEVICESENSOR);
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
  [CREATE_DEVICESENSOR](context, payload) {
    return ApiService.post("DeviceSensor/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_DEVICESENSOR);
          //context.commit(UPDATE_DEVICESENSOR, data.Data);
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
  [DELETE_DEVICESENSOR](context, payload) {
    return ApiService.query("DeviceSensor/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_DEVICESENSOR, data.Data);
          context.dispatch(FETCH_DEVICESENSOR);
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
  [SET_DEVICESENSOR](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_DEVICESENSOR](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_DEVICESENSOR](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
