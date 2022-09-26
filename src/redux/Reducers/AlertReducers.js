import React from "react";
import { AlertTypes } from "../ActionTypes/AlertActions";

let initialSate = {
    showAlert: false,
    alertOptions: null
};

const AlertReducer = (state = initialSate, action) => {
    switch (action.type) {
        case AlertTypes.SHOW_ALERT:
            state = { alertOptions: action.payload, showAlert: true };
            break;
        case AlertTypes.HIDE_ALERT:
            state = { ...state, showAlert: false };
            break;
        default:
            break;
    }
    return state;
};

export default AlertReducer;
