import ApiService from "../../common/api.service";

// action types
export const FETCH_SMTP = "FETCH_SMTP";
export const SAVE_SMTP = "SAVE_SMTP";
export const CREATE_SMTP = "CREATE_SMTP";
export const DELETE_SMTP = "DELETE_SMTP";

// mutation types
export const SET_SMTP = "SET_SMTP";
export const UPDATE_SMTP = "UPDATE_SMTP";
export const REMOVE_SMTP = "REMOVE_SMTP";
export const SET_ERROR = "SET_ERROR";

const state = {
    errors: null,
    items: []
};

const getters = {
    getSmtp(state) {
        return state.items;
    }
};

const actions = {
    [FETCH_SMTP](context) {
        return ApiService.get("SMTPSetting", "get-all")
            .then(({ data }) => {
                console.log('blablabla',data)
                if (data.IsSuccess) {
                    context.commit(SET_SMTP, data.Data);
                }
                return data;
            })
            .catch(err => {
                context.commit(SET_ERROR, err.response.data.errors);
            });
    },
    [SAVE_SMTP](context, payload) {
        delete payload.CreatedDate;
        return ApiService.post("SMTPSetting/update", payload)
            .then(({ data }) => {
                console.log(data)
                if (data.IsSuccess) {
                    //context.commit(UPDATE_SMTP, data.Data);
                    context.dispatch(FETCH_SMTP);
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
    [CREATE_SMTP](context, payload) {
        return ApiService.post("SMTPSetting/create", payload)
            .then(({ data }) => {
                console.log(data)
                if (data.IsSuccess) {
                    context.dispatch(FETCH_SMTP);
                    //context.commit(UPDATE_SMTP, data.Data);
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
    [DELETE_SMTP](context, payload) {
        return ApiService.query("SMTPSetting/delete", {
            params: { id: payload.Id }
        })
            .then(({ data }) => {
                if (data.IsSuccess) {
                    //context.commit(REMOVE_SMTP, data.Data);
                    context.dispatch(FETCH_SMTP);
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
    [SET_SMTP](state, payload) {
        state.items = payload.map(item => {
            item.CreatedDate = new Date(item.CreatedDate);
            return item;
        });
    },
    [SET_ERROR](state, payload) {
        state.errors = payload;
    },
    [UPDATE_SMTP](state, payload) {
        state.items = state.items.map(item => {
            return item.Id === payload.Id ? payload : item;
        });
    },
    [REMOVE_SMTP](state, payload) {
        state.items = state.items.filter(item => item.Id !== payload.Id);
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};
