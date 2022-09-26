import {
    AuthTypes
} from '../ActionTypes/AuthTypes';

class AuthAction {
    static UpdateUserProfile = (payload, isLogin) => {
        return {
            type: AuthTypes.UPDATE_USER_PROFILE,
            payload,
            isLogin
        };
    };
    static UpdateUser = (payload) => {
        return {
            type: AuthTypes.UPDATE_USER,
            payload,
        };
    };
    static getUserInfo = (payload) => {
        return {
            type: AuthTypes.GET_OTHER_USER_INFO,
            payload,
        };
    };
    static Logout = payload => {
        return {
            type: AuthTypes.LOGOUT,
            payload: payload,
        };
    };
    static Login = payload => {
        return {
            type: AuthTypes.LOGIN,
            payload: payload,
        };
    };
    static Signup = payload => {
        return {
            type: AuthTypes.SIGNUP,
            payload: payload,
        };
    };
    static getChilds = payload => {
        return {
            type: AuthTypes.CHILDREN_DATA,
            payload: payload,
        };
    };
}

export default AuthAction;
