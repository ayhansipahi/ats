import ApiService from "../common/api.service";
import JwtService from "../common/jwt.service";
import { CONNECT } from "./socket";
import { FETCH_COMPANY } from "./modules/company";
import { FETCH_USER } from "./modules/user";
import { FETCH_PAGE, FETCH_ROLEPAGEBYROLE } from "./modules/role";

// action types
export const VERIFY_AUTH = "verifyAuth";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const REGISTER = "register";
export const UPDATE_USER = "updateUser";
export const FETCH_USERPERMISSIONS = "FETCH_USERPERMISSIONS";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setUser";
export const SET_ERROR = "setError";
export const SET_DETAIL = "SET_DETAIL";
export const SET_PERMISSIONS = "SET_PERMISSIONS";

const state = {
  errors: [],
  user: {},
  permissions: {},
  isAuthenticated: !!JwtService.getToken()
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  }
};

const actions = {
  [LOGIN](context, credentials) {
    return new Promise(resolve => {
      ApiService.post("User/login", credentials)
        .then(({ data }) => {
          if (data.IsSuccess) {
            context.commit(SET_AUTH, data.Data);
          } else {
            context.commit(SET_ERROR, [data.Message]);
          }
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.errors);
        });
    });
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
  [REGISTER](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.post("User/register", { user: credentials })
        .then(({ data }) => {
          if (data.IsSuccess) {
            context.commit(SET_AUTH, data.Data);
          } else {
            context.commit(SET_ERROR, [data.Message]);
          }
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.errors);
          reject(response);
        });
    });
  },
  [VERIFY_AUTH](context) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      return ApiService.query("User/verify", {
        params: { token: JwtService.getToken() }
      })
        .then(async ({ data }) => {
          if (data.IsSuccess) {
            context.commit(SET_AUTH, data.Data);
            context.dispatch(CONNECT);
            context.dispatch(FETCH_COMPANY);
            await context.dispatch(FETCH_USERPERMISSIONS);
          } else {
            context.commit(SET_ERROR, [data.Message]);
          }
          return data.IsSuccess;
        })
        .catch(({ message }) => {
          context.commit(SET_ERROR, [message]);
        });
    } else {
      context.commit(PURGE_AUTH);
      return false;
    }
  },
  [UPDATE_USER](context, payload) {
    const { email, username, password, image, bio } = payload;
    const user = { email, username, bio, image };
    if (password) {
      user.password = password;
    }

    return ApiService.put("user", user).then(({ data }) => {
      context.commit(SET_AUTH, data);
      return data;
    });
  },
  async [FETCH_USERPERMISSIONS](context) {
    const { Data: pages } = await context.dispatch(FETCH_PAGE);
    const { Data: users } = await context.dispatch(FETCH_USER);
    const currentUser = users.find(
      user => user.UserName === context.state.user.UserName
    );
    context.commit(SET_DETAIL, currentUser);
    await Promise.all([
      ...currentUser.roles.map(role =>
        context.dispatch(FETCH_ROLEPAGEBYROLE, role)
      )
    ]);
    const permissions = pages
      .map(page => {
        return {
          ...page,
          read: false,
          write: false,
          update: false,
          delete: false
        };
      })
      .reduce((p, n) => {
        p[n.Id] = n;
        return p;
      }, {});

    context.commit(SET_PERMISSIONS, permissions);

    debugger;
  }
};

const mutations = {
  [SET_ERROR](state, error) {
    state.isAuthenticated = false;
    state.errors = error;
  },
  [SET_AUTH](state, data) {
    state.isAuthenticated = true;
    state.user = data;
    state.errors = [];
    JwtService.saveToken(state.user.Token);
  },
  [SET_DETAIL](state, data) {
    state.detail = data;
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = [];
    JwtService.destroyToken();
  },
  [SET_PERMISSIONS](state, payload) {
    state.permissions = payload;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
