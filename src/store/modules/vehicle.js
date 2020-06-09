import ApiService from "../../common/api.service";

// action types
export const FETCH_VEHICLE = "FETCH_VEHICLE";
export const SAVE_VEHICLE = "SAVE_VEHICLE";
export const CREATE_VEHICLE = "CREATE_VEHICLE";
export const DELETE_VEHICLE = "DELETE_VEHICLE";

// mutation types
export const SET_VEHICLE = "SET_VEHICLE";
export const UPDATE_VEHICLE = "UPDATE_VEHICLE";
export const REMOVE_VEHICLE = "REMOVE_VEHICLE";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getVehicles: state => state.items,
  getVehicleByCompanyId: state => companyId =>
    state.items.filter(item => item.CompanyId === companyId)
};

const actions = {
  [FETCH_VEHICLE](context) {
    return ApiService.get("Vehicle", "get-all")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_VEHICLE, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_VEHICLE](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("Vehicle/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_VEHICLE, data.Data);
          context.dispatch(FETCH_VEHICLE);
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
  [CREATE_VEHICLE](context, payload) {
    return ApiService.post("Vehicle/create", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.dispatch(FETCH_VEHICLE);
          //context.commit(UPDATE_VEHICLE, data.Data);
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
  [DELETE_VEHICLE](context, payload) {
    return ApiService.query("Vehicle/delete", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_VEHICLE, data.Data);
          context.dispatch(FETCH_VEHICLE);
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
  [SET_VEHICLE](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });
  },
  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_VEHICLE](state, payload) {
    state.items = state.items.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_VEHICLE](state, payload) {
    state.items = state.items.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
