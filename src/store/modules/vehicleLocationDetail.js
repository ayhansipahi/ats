// action types
export const FETCH_VEHICLELOCATIONDETAIL = "FETCH_VEHICLELOCATIONDETAIL";

// mutation types
export const SET_VEHICLELOCATIONDETAIL = "SET_VEHICLELOCATIONDETAIL";

const state = {
    errors: null,
    items: []
};

const getters = {
    getVehicleLocationDetail(state) {
        return state.items;
    }
};

const actions = {
    [FETCH_VEHICLELOCATIONDETAIL]({commit, state}, payload) {
        console.log('commit',commit);
        console.log('state',state);
        console.log(payload);
        commit('SET_VEHICLELOCATIONDETAIL', payload);

    },

};

const mutations = {
    [SET_VEHICLELOCATIONDETAIL](state, payload) {
        state.items = payload
        console.log(state)

    },

};

export default {
    state,
    actions,
    mutations,
    getters
};
