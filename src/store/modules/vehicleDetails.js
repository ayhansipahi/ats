import ApiService from "../../common/api.service";

// action types
export const FETCH_VEHICLEDETAILS = "FETCH_VEHICLEDETAILS";
export const CREATE_VEHICLEDETAILS = "CREATE_VEHICLEDETAILS";
export const DELETE_VEHICLEDETAILS = "DELETE_VEHICLEDETAILS";

// mutation types
export const SET_VEHICLEDETAILS = "SET_VEHICLEDETAILS";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getVehicleDetails(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_VEHICLEDETAILS](
    context,
    { StartDate, EndDate, CompanyId, VehicleId }
  ) {
    let base = "VehicleDetails/";
    let route = base + "get-all";
    if (CompanyId) {
      route = base + "get-details-by-company";
    }
    if (VehicleId) {
      route = base + "get-details-by-vehicle";
    }

    return ApiService.query(route, {
      params: { StartDate, EndDate, CompanyId, VehicleId }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_VEHICLEDETAILS, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  }
};

const mutations = {
  [SET_VEHICLEDETAILS](state, payload) {
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
