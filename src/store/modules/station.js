import ApiService from "../../common/api.service";

// action types
export const FETCH_STATION = "FETCH_STATION";
export const SAVE_STATION = "SAVE_STATION";
export const CREATE_STATION = "CREATE_STATION";
export const DELETE_STATION = "DELETE_STATION";

// mutation types
export const SET_STATION = "SET_STATION";
export const UPDATE_STATION = "UPDATE_STATION";
export const REMOVE_STATION = "REMOVE_STATION";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getStations(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_STATION](context) {
    return ApiService.get("Station", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_STATION, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_STATION](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("Station/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_STATION, data.Data);
          context.dispatch(FETCH_STATION);
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
  [CREATE_STATION](context, payload) {
    return ApiService.post("Station/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_STATION);
          //context.commit(UPDATE_STATION, data.Data);
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
  [DELETE_STATION](context, payload) {
    return ApiService.query("Station/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_STATION, data.Data);
          context.dispatch(FETCH_STATION);
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
  [SET_STATION](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_STATION](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_STATION](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
