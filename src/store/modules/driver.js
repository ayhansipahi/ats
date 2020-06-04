import ApiService from "../../common/api.service";

// action types
export const FETCH_DRIVER = "FETCH_DRIVER";
export const SAVE_DRIVER = "SAVE_DRIVER";
export const CREATE_DRIVER = "CREATE_DRIVER";
export const DELETE_DRIVER = "DELETE_DRIVER";

// mutation types
export const SET_DRIVER = "SET_DRIVER";
export const UPDATE_DRIVER = "UPDATE_DRIVER";
export const REMOVE_DRIVER = "REMOVE_DRIVER";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getDrivers(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_DRIVER](context) {
    return ApiService.get("Driver", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_DRIVER, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_DRIVER](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("Driver/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_DRIVER, data.Data);
          context.dispatch(FETCH_DRIVER);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [CREATE_DRIVER](context, payload) {
    return ApiService.post("Driver/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_DRIVER);
          //context.commit(UPDATE_DRIVER, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [DELETE_DRIVER](context, payload) {
    return ApiService.query("Driver/delete", { params: { id: payload.Id } })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_DRIVER, data.Data);
          context.dispatch(FETCH_DRIVER);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  }
};

const mutations = {
  [SET_DRIVER](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_DRIVER](state, payload) {
    state.items = state.items.map(d => {
      return d.Id === payload.Id ? payload : d;
    });
  },
  [REMOVE_DRIVER](state, payload) {
    state.items = state.items.filter(d => d.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
