import ApiService from "../../common/api.service";
import { FETCH_ROLE, SAVE_USERROLE } from "./role";

// action types
export const FETCH_USER = "FETCH_USER";
export const FETCH_USERROLE = "FETCH_USERROLE";
export const CREATE_USER = "CREATE_USER";
export const SAVE_USER = "SAVE_USER";
export const DELETE_USER = "DELETE_USER";

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
      .then(async ({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_USER, data.Data);
          await context.dispatch(FETCH_ROLE);
          await context.dispatch(FETCH_USERROLE);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  async [FETCH_USERROLE](context) {
    await Promise.all([
      ...context.state.items.map(item =>
        ApiService.query("User/get-roles-from-user", {
          params: { userId: item.Id }
        })
          .then(({ data }) => {
            if (data.IsSuccess) {
              context.commit(SET_USERROLE, {
                user: item,
                roles: data.Data,
                roleList: context.rootState.role.roles
              });
            } else {
              context.commit(SET_ERROR, data.Message);
            }
            return data;
          })
          .catch(err => {
            context.commit(SET_ERROR, err.response.data.errors);
          })
      )
    ]);
  },
  [SAVE_USER](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("User/update", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_USER, data.Data);
          context.dispatch(FETCH_USER);
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
  [CREATE_USER](context, payload) {
    return ApiService.post("User/register", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          payload.roles.forEach(role => {
            context.dispatch(SAVE_USERROLE, {
              userId: payload.UserId,
              roleId: role
            });
          });

          context.dispatch(FETCH_USER);
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
  [DELETE_USER](context, payload) {
    return ApiService.query("User/remove-user", {
      params: { userName: payload.UserName }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_USER, data.Data);
          context.dispatch(FETCH_USER);
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
  [SET_USER](state, payload) {
    state.items = payload.map(item => {
      item.CreatedDate = new Date(item.CreatedDate);
      item.roles = [];
      return item;
    });
  },
  [SET_USERROLE](state, { user, roles, roleList }) {
    state.roles = roles;
    state.items = state.items.map(item => {
      if (item.Id === user.Id) {
        item.roles = roles.map(
          role => roleList.find(listItem => listItem.Name === role).Id
        );
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
