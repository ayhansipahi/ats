// action types
export const FETCH_VEHICLELOCATIONDETAIL = "FETCH_VEHICLELOCATIONDETAIL";

// mutation types
export const SET_VEHICLELOCATIONDETAIL = "SET_VEHICLELOCATIONDETAIL";

const state = {
  errors: null,
  items: []
};

const getters = {
  getVehicleLocationsDetailsById(state) {
    console.log;
    return id => state.items.find(item => item.vehicleId === id);
  }
};

const actions = {
  [FETCH_VEHICLELOCATIONDETAIL](context, payload) {
    context.commit(SET_VEHICLELOCATIONDETAIL, payload);
  }
};

const mutations = {
  [SET_VEHICLELOCATIONDETAIL](state, payload) {
    let isExisting = state.items.findIndex(
      x => x.vehicleId === payload.vehicleId
    );
    if (isExisting !== -1) {
      state.items[isExisting] = payload;
    } else {
      state.items.push(payload);
    }
    console.log(state);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
