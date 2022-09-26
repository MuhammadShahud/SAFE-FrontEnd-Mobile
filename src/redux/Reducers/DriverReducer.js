import React from "react";
import { DriverTypes } from '../ActionTypes/DriverActionsTypes';

let initialSate = {
    latestRide: null,
    reqeustedRides: [],
    lastRide: null,
    pastRides: null,
    confirmedRides: null,
};

const DriverReducer = (state = initialSate, action) => {
    switch (action.type) {
        case DriverTypes.GET_DRIVER_RIDE:
            state = { ...state, latestRide: action.payload };
            break;
        case DriverTypes.GET_REQUESTED_RIDES:
            state = { ...state, reqeustedRides: action.payload };
            break;
        case DriverTypes.GET_LAST_RIDE:
            state = { ...state, lastRide: action.payload };
            break;
        case DriverTypes.GET_CONFIRMED_RIDES:
            state = { ...state, confirmedRides: action.payload };
            break;
        case DriverTypes.GET_MORE_CONFIRMED_RIDES:
            state = { ...state, confirmedRides: { ...action.payload, data: [...state.confirmedRides.data, ...action.payload.data] } };
            break;
        case DriverTypes.GET_PAST_RIDES:
            state = { ...state, pastRides: action.payload };
            break;
        case DriverTypes.GET_MORE_PAST_RIDES:
            state = { ...state, pastRides: { ...action.payload, data: [...state.confirmedRides.data, ...action.payload.data] } };
            break;
        default:
            break;
    }
    return state;
};

export default DriverReducer;
