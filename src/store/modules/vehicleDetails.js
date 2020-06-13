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
    {
      StartDate,
      EndDate,
      CompanyId,
      VehicleId,
      type = "detail",
      pageNumber,
      pageSize
    }
  ) {
    let base = "VehicleDetails/";
    let route = base + "get-all";
    if (type === "detail") {
      if (CompanyId) {
        route = base + "get-details-by-company";
      }
      if (VehicleId) {
        route = base + "get-details-by-vehicle";
      }

      pageNumber = 1;
      pageSize = 100;
    } else if (type === "location") {
      if (CompanyId) {
        route = base + "get-location-by-company";
      }
      if (VehicleId) {
        route = base + "get-last-location-by-vehicle";
      }
    } else if (type === "route") {
      if (CompanyId) {
        route = base + "get-location-by-company";
      }
      if (VehicleId) {
        route = base + "get-location-by-vehicle-and-date";
      }
    } else if (type === "circle") {
      route = base + "get-location-by-circle";
    } else {
      context.commit(SET_ERROR, ["Invalid type"]);
      return Promise.reject();
    }

    return ApiService.query(route, {
      params: {
        StartDate,
        EndDate,
        VehicleId,
        pageNumber,
        pageSize,
        CompanyId,
        companyId: CompanyId
      }
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
  [SET_VEHICLEDETAILS](state, payload = []) {
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
