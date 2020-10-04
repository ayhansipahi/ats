import ApiService from "../../common/api.service";

// action types
export const FETCH_REPORT = "FETCH_REPORT";
export const SAVE_REPORT = "SAVE_REPORT";
export const CREATE_REPORT = "CREATE_REPORT";
export const DELETE_REPORT = "DELETE_REPORT";

// mutation types
export const SET_REPORT = "SET_REPORT";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getReports(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_REPORT](context) {
    const userId = context.rootState.auth.detail.Id;
    return ApiService.query("User/get-user-reports", {
      params: { userId }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_REPORT, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  }
};

const mutations = {
  [SET_REPORT](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
