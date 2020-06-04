import ApiService from "../../common/api.service";

// action types
export const FETCH_ALARM = "FETCH_ALARM";
export const SAVE_ALARM = "SAVE_ALARM";
export const CREATE_ALARM = "CREATE_ALARM";
export const DELETE_ALARM = "DELETE_ALARM";

// mutation types
export const SET_ALARM = "SET_ALARM";
export const UPDATE_ALARM = "UPDATE_ALARM";
export const REMOVE_ALARM = "REMOVE_ALARM";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getAlarms(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_ALARM](context) {
    return ApiService.get("Alarm", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_ALARM, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_ALARM](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("Alarm/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_ALARM, data.Data);
          context.dispatch(FETCH_ALARM);
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
  [CREATE_ALARM](context, payload) {
    return ApiService.post("Alarm/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_ALARM);
          //context.commit(UPDATE_ALARM, data.Data);
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
  [DELETE_ALARM](context, payload) {
    return ApiService.query("Alarm/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_ALARM, data.Data);
          context.dispatch(FETCH_ALARM);
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
  [SET_ALARM](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_ALARM](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_ALARM](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
