import ApiService from "../common/api.service";
import JwtService from "../common/jwt.service";
import { FETCH_COMPANY } from "./modules/company";
import { FETCH_USER } from "./modules/user";
import {
  FETCH_PAGE,
  FETCH_ROLEPAGEBYROLE,
  FETCH_USERPAGE
} from "./modules/role";
import { CONNECT } from "./socket";
import { FETCH_VEHICLE } from "./modules/vehicle";
import { FETCH_VEHICLESTATUSBYVEHICLE } from "./modules/vehicleStatus";
import { FETCH_VEHICLESTATUSTYPE } from "./modules/vehicleStatusType";

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
  },
  getPermissionsByPage: state => page => state.permissions[page]
};

const actions = {
  [LOGIN](context, credentials) {
    return new Promise(resolve => {
      ApiService.post("User/login", credentials)
        .then(async ({ data }) => {
          if (data.IsSuccess) {
            context.commit(SET_AUTH, data.Data);
            await context.dispatch(FETCH_VEHICLESTATUSTYPE);
            await context.dispatch(FETCH_COMPANY);
            await context.dispatch(FETCH_VEHICLE);
            await Promise.all([
              ...context.rootState.vehicle.items.map(item => {
                return context.dispatch(FETCH_VEHICLESTATUSBYVEHICLE, item.Id);
              })
            ]);
            await context.dispatch(FETCH_USERPERMISSIONS);
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
      return ApiService.query("User/verify", {
        params: { token: JwtService.getToken() }
      })
        .then(async ({ data }) => {
          if (data.IsSuccess) {
            context.commit(SET_AUTH, data.Data);
            context.dispatch(CONNECT);
            //await context.dispatch(FETCH_USERPERMISSIONS);
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
    await context.dispatch(FETCH_USERPAGE);
    const currentUser = users.find(
      user => user.UserName === context.state.user.UserName
    );
    context.commit(SET_DETAIL, currentUser);
    await Promise.all([
      ...currentUser.roles.map(role =>
        context.dispatch(FETCH_ROLEPAGEBYROLE, role)
      )
    ]);
    const currentUserRolesPages = currentUser.roles.map(role => {
      return context.rootState.role.rolePagesByRole[role];
    });
    const userPage = context.rootState.role.userPagesByUser[currentUser.Id];
    const permissions = pages
      .map(page => {
        const currentUserPage = userPage.find(u => u.PageId === page.Id);
        const currentRolePages = currentUserRolesPages.map(c =>
          c.find(u => u.PageId === page.Id)
        );
        const getPermfFor = rule => {
          return [
            currentUserPage[rule],
            ...currentRolePages.map(c => c[rule])
          ].some(el => el === true);
        };
        const res = {
          ...page,
          read: getPermfFor("Read"),
          write: getPermfFor("Write"),
          update: getPermfFor("Update"),
          delete: getPermfFor("Delete")
        };
        return res;
      })
      .reduce((p, n) => {
        p[n.Id] = n;
        return p;
      }, {});

    context.commit(SET_PERMISSIONS, permissions);
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
