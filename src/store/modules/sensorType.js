import ApiService from "../../common/api.service";

// action types
export const FETCH_SENSORTYPE = "FETCH_SENSORTYPE";
export const SAVE_SENSORTYPE = "SAVE_SENSORTYPE";
export const CREATE_SENSORTYPE = "CREATE_SENSORTYPE";
export const DELETE_SENSORTYPE = "DELETE_SENSORTYPE";

// mutation types
export const SET_SENSORTYPE = "SET_SENSORTYPE";
export const UPDATE_SENSORTYPE = "UPDATE_SENSORTYPE";
export const REMOVE_SENSORTYPE = "REMOVE_SENSORTYPE";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getSensorTypes(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_SENSORTYPE](context) {
    return ApiService.get("SensorType", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_SENSORTYPE, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_SENSORTYPE](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("SensorType/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_SENSORTYPE, data.Data);
          context.dispatch(FETCH_SENSORTYPE);
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
  [CREATE_SENSORTYPE](context, payload) {
    return ApiService.post("SensorType/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_SENSORTYPE);
          //context.commit(UPDATE_SENSORTYPE, data.Data);
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
  [DELETE_SENSORTYPE](context, payload) {
    return ApiService.query("SensorType/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_SENSORTYPE, data.Data);
          context.dispatch(FETCH_SENSORTYPE);
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
  [SET_SENSORTYPE](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_SENSORTYPE](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_SENSORTYPE](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
