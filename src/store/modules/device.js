import ApiService from "../../common/api.service";

// action types
export const FETCH_DEVICE = "FETCH_DEVICE";
export const SAVE_DEVICE = "SAVE_DEVICE";
export const CREATE_DEVICE = "CREATE_DEVICE";
export const DELETE_DEVICE = "DELETE_DEVICE";

// mutation types
export const SET_DEVICE = "SET_DEVICE";
export const UPDATE_DEVICE = "UPDATE_DEVICE";
export const REMOVE_DEVICE = "REMOVE_DEVICE";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getDevices(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_DEVICE](context) {
    return ApiService.get("Device", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_DEVICE, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_DEVICE](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("Device/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_DEVICE, data.Data);
          context.dispatch(FETCH_DEVICE);
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
  [CREATE_DEVICE](context, payload) {
    return ApiService.post("Device/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_DEVICE);
          //context.commit(UPDATE_DEVICE, data.Data);
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
  [DELETE_DEVICE](context, payload) {
    return ApiService.query("Device/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_DEVICE, data.Data);
          context.dispatch(FETCH_DEVICE);
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
  [SET_DEVICE](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_DEVICE](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_DEVICE](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
