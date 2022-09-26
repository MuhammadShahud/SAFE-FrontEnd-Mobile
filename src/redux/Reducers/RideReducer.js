import React from "react";

import { RideTypes } from '../ActionTypes/RideActions';

let initialState = {
    notifications: {
        data: []
    },
    ridestypes: null,
    rideDetails: null,
    scheduleRide: null
};

const RideReducer = (state = initialState, action) => {
    switch (action.type) {
        case RideTypes.GET_NOTIFICATIONS:
            state = { ...state, notifications: action.payload };
            break;
        case RideTypes.GET_MORE_NOTIFICATIONS:
            state = { ...state, notifications: { ...action.payload, data: [...state.notifications.data, ...action.payload.data] } };
            break;

        case RideTypes.RIDE_TYPES:
            state = { ...state, ridestypes: action.payload };
            break;

        case RideTypes.RIDE_DETAILS:
            state = { ...state, rideDetails: action.payload };
            break;
        case RideTypes.SCHEDULE_RIDE:
            state = { ...state, scheduleRide: action.payload };
            break;
        default:
            break;
    }
    return state;
};

export default RideReducer;
