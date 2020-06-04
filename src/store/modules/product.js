import ApiService from "../../common/api.service";

// action types
export const FETCH_PRODUCT = "FETCH_PRODUCT";
export const SAVE_PRODUCT = "SAVE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";

// mutation types
export const SET_PRODUCT = "SET_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const REMOVE_PRODUCT = "REMOVE_PRODUCT";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getProducts(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_PRODUCT](context) {
    return ApiService.get("Product", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_PRODUCT, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_PRODUCT](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("Product/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_PRODUCT, data.Data);
          context.dispatch(FETCH_PRODUCT);
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
  [CREATE_PRODUCT](context, payload) {
    return ApiService.post("Product/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_PRODUCT);
          //context.commit(UPDATE_PRODUCT, data.Data);
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
  [DELETE_PRODUCT](context, payload) {
    return ApiService.query("Product/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_PRODUCT, data.Data);
          context.dispatch(FETCH_PRODUCT);
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
  [SET_PRODUCT](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_PRODUCT](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_PRODUCT](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
