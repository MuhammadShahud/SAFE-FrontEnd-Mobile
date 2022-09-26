import React from "react";

import { GeneralTypes } from '../ActionTypes/GeneralActionTypes';
import { SheduleTypes } from "../ActionTypes/SheduleTypes";

let initialSate = {
    loading: false,
    doNotify: true,
    content: null,
    payment_content: null,
    shedules: {
        data: []
    },
    pastRides: {
        data: []
    },
    cancelledRides: {
        data: []
    },
};

const SheduleReducer = (state = initialSate, action) => {
    switch (action.type) {
        case SheduleTypes.GET_SHEDULES:
            state = { ...state, shedules: action.payload };
            break;
        case SheduleTypes.GET_MORE_SHEDULES:
            state = { ...state, shedules: { ...action.payload, data: [...state.shedules.data, ...action.payload.data] } };
            break;
        case SheduleTypes.GET_PAST_RIDES:
            state = { ...state, pastRides: action.payload };
            break;
        case SheduleTypes.GET_MORE_PAST_RIDES:
            state = { ...state, pastRides: { ...action.payload, data: [...state.pastRides.data, ...action.payload.data] } };
            break;
        case SheduleTypes.GET_CANCELLED_RIDES:
            state = { ...state, cancelledRides: action.payload };
            break;
        case SheduleTypes.GET_MORE_CANCELLED_RIDES:
            state = { ...state, cancelledRides: { ...action.payload, data: [...state.cancelledRides.data, ...action.payload.data] } };
            break;
        default:
            break;
    }
    return state;
};

export default SheduleReducer;
