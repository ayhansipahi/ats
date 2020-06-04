import ApiService from "../../common/api.service";

// action types
export const FETCH_COMPANY = "FETCH_COMPANY";
export const SAVE_COMPANY = "SAVE_COMPANY";
export const CREATE_COMPANY = "CREATE_COMPANY";
export const DELETE_COMPANY = "DELETE_COMPANY";

// mutation types
export const SET_COMPANY = "SET_COMPANY";
export const UPDATE_COMPANY = "UPDATE_COMPANY";
export const REMOVE_COMPANY = "REMOVE_COMPANY";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getCompanies(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_COMPANY](context) {
    return ApiService.get("Company", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_COMPANY, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_COMPANY](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("Company/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_COMPANY, data.Data);
          context.dispatch(FETCH_COMPANY);
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
  [CREATE_COMPANY](context, payload) {
    return ApiService.post("Company/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_COMPANY);
          //context.commit(UPDATE_COMPANY, data.Data);
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
  [DELETE_COMPANY](context, payload) {
    return ApiService.query("Company/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_COMPANY, data.Data);
          context.dispatch(FETCH_COMPANY);
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
  [SET_COMPANY](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_COMPANY](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_COMPANY](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
