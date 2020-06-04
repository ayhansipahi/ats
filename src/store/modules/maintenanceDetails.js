import ApiService from "../../common/api.service";

// action types
export const FETCH_MAINTENANCEDETAILS = "FETCH_MAINTENANCEDETAILS";
export const SAVE_MAINTENANCEDETAILS = "SAVE_MAINTENANCEDETAILS";
export const CREATE_MAINTENANCEDETAILS = "CREATE_MAINTENANCEDETAILS";
export const DELETE_MAINTENANCEDETAILS = "DELETE_MAINTENANCEDETAILS";

// mutation types
export const SET_MAINTENANCEDETAILS = "SET_MAINTENANCEDETAILS";
export const UPDATE_MAINTENANCEDETAILS = "UPDATE_MAINTENANCEDETAILS";
export const REMOVE_MAINTENANCEDETAILS = "REMOVE_MAINTENANCEDETAILS";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getMaintenanceDetailss(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_MAINTENANCEDETAILS](context) {
    return ApiService.get("MaintenanceDetails", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_MAINTENANCEDETAILS, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_MAINTENANCEDETAILS](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("MaintenanceDetails/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_MAINTENANCEDETAILS, data.Data);
          context.dispatch(FETCH_MAINTENANCEDETAILS);
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
  [CREATE_MAINTENANCEDETAILS](context, payload) {
    return ApiService.post("MaintenanceDetails/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_MAINTENANCEDETAILS);
          //context.commit(UPDATE_MAINTENANCEDETAILS, data.Data);
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
  [DELETE_MAINTENANCEDETAILS](context, payload) {
    return ApiService.query("MaintenanceDetails/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_MAINTENANCEDETAILS, data.Data);
          context.dispatch(FETCH_MAINTENANCEDETAILS);
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
  [SET_MAINTENANCEDETAILS](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_MAINTENANCEDETAILS](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_MAINTENANCEDETAILS](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
