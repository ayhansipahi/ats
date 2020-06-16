import ApiService from "../../common/api.service";

// action types
export const FETCH_USER = "FETCH_USER";
export const FETCH_USERROLE = "FETCH_USERROLE";

// mutation types
export const SET_USER = "SET_USER";
export const SET_USERROLE = "SET_USERROLE";
export const SET_ERROR = "SET_ERROR";

const state = {
  errors: null,
  items: []
};

const getters = {
  getUsers(state) {
    return state.items;
  }
};

const actions = {
  [FETCH_USER](context) {
    return ApiService.get("User", "get-users")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_USER, data.Data);
          context.dispatch(FETCH_USERROLE);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [FETCH_USERROLE](context) {
    context.state.items.map(item =>
      ApiService.query("User/get-roles-from-user", {
        params: { userId: item.Id }
      })
        .then(({ data }) => {
          if (data.IsSuccess) {
            context.commit(SET_USERROLE, { user: item, roles: data.Data });
          } else {
            context.commit(SET_ERROR, data.Message);
          }
          return data;
        })
        .catch(err => {
          context.commit(SET_ERROR, err.response.data.errors);
        })
    );
  }
};

const mutations = {
  [SET_USER](state, payload) {
    state.items = payload; /*.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      return item;
    });*/
  },
  [SET_USERROLE](state, { user, roles }) {
    state.items = state.items.map(item => {
      if (item.Id === user.Id) {
        item.roles = roles.join(", ");
      }
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
