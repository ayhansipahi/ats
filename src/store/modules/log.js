import ApiService from "../../common/api.service";

// action types
export const FETCH_LOG = "FETCH_LOG";
export const DELETE_LOG = "DELETE_LOG";

// mutation types
export const SET_LOG = "SET_LOG";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getLogs: state => state.items
};

const actions = {
  [FETCH_LOG](context) {
    return ApiService.query("Log/get-all", {
      params: {
        pageNumber: 1,
        pageSize: 100
      }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_LOG, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [DELETE_LOG](context, payload) {
    return ApiService.query("Log/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_LOG, data.Data);
          context.dispatch(FETCH_LOG);
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
  [SET_LOG](state, payload) {
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
