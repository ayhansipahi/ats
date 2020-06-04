import ApiService from "../../common/api.service";

// action types
export const FETCH_MAINTENANCE = "FETCH_MAINTENANCE";
export const SAVE_MAINTENANCE = "SAVE_MAINTENANCE";
export const CREATE_MAINTENANCE = "CREATE_MAINTENANCE";
export const DELETE_MAINTENANCE = "DELETE_MAINTENANCE";

// mutation types
export const SET_MAINTENANCE = "SET_MAINTENANCE";
export const UPDATE_MAINTENANCE = "UPDATE_MAINTENANCE";
export const REMOVE_MAINTENANCE = "REMOVE_MAINTENANCE";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getMaintenances(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_MAINTENANCE](context) {
    return ApiService.get("Maintenance", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_MAINTENANCE, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_MAINTENANCE](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("Maintenance/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_MAINTENANCE, data.Data);
          context.dispatch(FETCH_MAINTENANCE);
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
  [CREATE_MAINTENANCE](context, payload) {
    return ApiService.post("Maintenance/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_MAINTENANCE);
          //context.commit(UPDATE_MAINTENANCE, data.Data);
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
  [DELETE_MAINTENANCE](context, payload) {
    return ApiService.query("Maintenance/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_MAINTENANCE, data.Data);
          context.dispatch(FETCH_MAINTENANCE);
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
  [SET_MAINTENANCE](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_MAINTENANCE](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_MAINTENANCE](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
