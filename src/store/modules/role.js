import ApiService from "../../common/api.service";

// action types
export const FETCH_ROLE = "FETCH_ROLE";
export const SAVE_ROLE = "SAVE_ROLE";
export const CREATE_ROLE = "CREATE_ROLE";
export const DELETE_ROLE = "DELETE_ROLE";

export const FETCH_PAGE = "FETCH_PAGE";

export const FETCH_ROLEPAGE = "FETCH_ROLEPAGE";
export const SAVE_ROLEPAGE = "SAVE_ROLEPAGE";
export const CREATE_ROLEPAGE = "CREATE_ROLEPAGE";

// mutation types
export const SET_ROLE = "SET_ROLE";
export const UPDATE_ROLE = "UPDATE_ROLE";
export const REMOVE_ROLE = "REMOVE_ROLE";
export const SET_ERROR = "SET_ERROR";
export const SET_PAGE = "SET_PAGE";
export const SET_ROLEPAGE = "SET_ROLEPAGE";
export const SET_ROLEPAGEBYID = "SET_ROLEPAGEBYID";
export const FETCH_ROLEPAGEBYROLE = "FETCH_ROLEPAGEBYROLE";

const state = {
  errors: null,
  roles: [],
  pages: [],
  rolePages: []
};

const getters = {
  getRoles(state) {
    return state.roles;
  },
  getPages(state) {
    state.pages;
  }
};

const actions = {
  [FETCH_ROLE](context) {
    return ApiService.get("User", "get-roles")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_ROLE, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [FETCH_PAGE](context) {
    return ApiService.get("User", "get-pages")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_PAGE, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [FETCH_ROLEPAGE](context) {
    return ApiService.get("User", "get-role-pages")
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_ROLEPAGE, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [FETCH_ROLEPAGEBYROLE](context, payload) {
    return ApiService.query("User/get-role-pages", {
      params: {
        roleId: payload
      }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          context.commit(SET_ROLEPAGEBYID, data.Data);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_ROLE](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("User/update-role", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_ROLE, data.Data);
          context.dispatch(FETCH_ROLE);
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
  [CREATE_ROLE](context, payload) {
    return ApiService.post("User/create-role", `"${payload.Name}"`, {
      headers: {
        "Content-Type": "text/json"
      }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          context
            .dispatch(FETCH_ROLE)
            .then(() => context.dispatch(CREATE_ROLEPAGE, payload.Name));
          //context.commit(UPDATE_ROLE, data.Data);
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
  [DELETE_ROLE](context, payload) {
    return ApiService.query("User/delete-role", {
      params: { id: payload.Id }
    })
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(REMOVE_ROLE, data.Data);
          context.dispatch(FETCH_ROLE);
        } else {
          context.commit(SET_ERROR, data.Message);
        }
        return data;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
      });
  },
  [SAVE_ROLEPAGE](context, payload) {
    delete payload.CreatedDate;
    return ApiService.post("User/update-role-pages", payload)
      .then(({ data }) => {
        if (data.IsSuccess) {
          //context.commit(UPDATE_ROLE, data.Data);
          context.dispatch(FETCH_ROLEPAGE);
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
  [CREATE_ROLEPAGE](context, payload) {
    const roleId = context.state.roles.find(role => role.Name === payload).Id;
    return Promise.all(
      context.state.pages.map(page => {
        const request = {
          roleId: roleId,
          read: false,
          write: false,
          update: false,
          delete: false,
          pageId: page.Id
        };
        return ApiService.post("User/create-role-pages", request);
      })
    )
      .then(responses => {
        if (responses.map(res => res.data).every(data => data.IsSuccess)) {
          //context.commit(UPDATE_ROLE, data.Data);
          context.dispatch(FETCH_ROLEPAGE);
        } else {
          context.commit(
            SET_ERROR,
            responses.map(res => res.data).map(data => data.Message)
          );
        }
        return responses;
      })
      .catch(err => {
        context.commit(SET_ERROR, err.response.data.errors);
        throw new Error(err);
      });
  }
};

const mutations = {
  [SET_ROLE](state, payload) {
    state.roles = payload;
  },
  [SET_PAGE](state, payload) {
    state.pages = payload;
  },
  [SET_ROLEPAGE](state, payload) {
    state.rolePages = payload;
  },
  [SET_ROLEPAGEBYID](state, payload) {
    state.rolePages = payload;
  },

  [SET_ERROR](state, payload) {
    state.errors = payload;
  },
  [UPDATE_ROLE](state, payload) {
    state.roles = state.roles.map(item => {
      return item.Id === payload.Id ? payload : item;
    });
  },
  [REMOVE_ROLE](state, payload) {
    state.roles = state.roles.filter(item => item.Id !== payload.Id);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
