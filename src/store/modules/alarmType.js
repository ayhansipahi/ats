import ApiService from "../../common/api.service";

// action types
export const FETCH_ALARMTYPE = "FETCH_ALARMTYPE";
export const SAVE_ALARMTYPE = "SAVE_ALARMTYPE";
export const CREATE_ALARMTYPE = "CREATE_ALARMTYPE";
export const DELETE_ALARMTYPE = "DELETE_ALARMTYPE";

// mutation types
export const SET_ALARMTYPE = "SET_ALARMTYPE";
export const UPDATE_ALARMTYPE = "UPDATE_ALARMTYPE";
export const REMOVE_ALARMTYPE = "REMOVE_ALARMTYPE";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getAlarmTypes(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_ALARMTYPE](context) {
    return ApiService.get("AlarmType", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          console.log('asd', JSON.stringify(data));
          context.commit(SET_ALARMTYPE, data.Data);
        } else {
          console.log('asd', JSON.stringify(data));
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_ALARMTYPE](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("AlarmType/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_ALARMTYPE, data.Data);
          context.dispatch(FETCH_ALARMTYPE);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [CREATE_ALARMTYPE](context, payload) {
    return ApiService.post("AlarmType/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_ALARMTYPE);
          //context.commit(UPDATE_ALARMTYPE, data.Data);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [DELETE_ALARMTYPE](context, payload) {
    return ApiService.query("AlarmType/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_ALARMTYPE, data.Data);
          context.dispatch(FETCH_ALARMTYPE);
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
  [SET_ALARMTYPE](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_ALARMTYPE](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_ALARMTYPE](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
