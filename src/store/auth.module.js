import ApiService from "../common/api.service";
import JwtService from "../common/jwt.service";
import { CONNECT } from "./socket";
import { FETCH_VEHICLE_ALL} from "./modules/vehicle";
import {FETCH_COMPANY} from "./modules/company";

// action types
export const VERIFY_AUTH = "verifyAuth";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const REGISTER = "register";
export const UPDATE_USER = "updateUser";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setUser";
export const SET_ERROR = "setError";

const state = {
  errors: [],
  user: {},
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
        .then(({ data }) => {
          if (data.IsSuccess) {
            context.commit(SET_AUTH, data.Data);
            context.dispatch(CONNECT);
            context.dispatch(FETCH_COMPANY);
            context.dispatch(FETCH_VEHICLE_ALL);
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
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = [];
    JwtService.destroyToken();
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
