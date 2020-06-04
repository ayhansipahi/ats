import ApiService from "../../common/api.service";

// action types
export const FETCH_SENSOR = "FETCH_SENSOR";
export const SAVE_SENSOR = "SAVE_SENSOR";
export const CREATE_SENSOR = "CREATE_SENSOR";
export const DELETE_SENSOR = "DELETE_SENSOR";

// mutation types
export const SET_SENSOR = "SET_SENSOR";
export const UPDATE_SENSOR = "UPDATE_SENSOR";
export const REMOVE_SENSOR = "REMOVE_SENSOR";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getSensors(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_SENSOR](context) {
    return ApiService.get("Sensor", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_SENSOR, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_SENSOR](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("Sensor/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_SENSOR, data.Data);
          context.dispatch(FETCH_SENSOR);
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
  [CREATE_SENSOR](context, payload) {
    return ApiService.post("Sensor/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_SENSOR);
          //context.commit(UPDATE_SENSOR, data.Data);
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
  [DELETE_SENSOR](context, payload) {
    return ApiService.query("Sensor/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_SENSOR, data.Data);
          context.dispatch(FETCH_SENSOR);
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
  [SET_SENSOR](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_SENSOR](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_SENSOR](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
