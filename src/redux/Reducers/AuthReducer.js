import React from "react";

import { AuthTypes } from '../ActionTypes/AuthTypes';

let initialSate = {
    isLogin: undefined,
    user: null,
    otherUserInfo: null,
    childrenData: []
};

const AuthReducer = (state = initialSate, action) => {
    switch (action.type) {
        case AuthTypes.LOGIN:
            state = { ...state, user: action.payload, isLogin: true };
            break;
        case AuthTypes.SIGNUP:
            state = { ...state, user: action.payload, isLogin: false };
            break;
        case AuthTypes.UPDATE_USER_PROFILE:
            state = { ...state, user: { ...state.user, user: action.payload }, isLogin: action.isLogin };
            break;
        case AuthTypes.UPDATE_USER:
            state = { ...state, user: { ...state.user, user: action.payload } };
            break;
        case AuthTypes.GET_OTHER_USER_INFO:
            state = { ...state, otherUserInfo: action.payload };
            break;
        case AuthTypes.CHILDREN_DATA:
            state = { ...state, childrenData: action.payload };
            break;
        case AuthTypes.LOGOUT:
            state = {
                user: null,
                isLogin: false
            };
            break;
        default:
            break;
    }
    return state;
};

export default AuthReducer;
