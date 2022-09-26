import React from "react";

import { LocationActions } from '../ActionTypes/LocationActions';

let initialSate = {
    savedLocations: null,
    currentLocation: null
};

const LocationReducer = (state = initialSate, action) => {
    switch (action.type) {
        case LocationActions.GET_LOCATION:
            state = {
                ...state,
                savedLocations: action.payload,
            };
            break;
        case LocationActions.RESET_LOCATION:
            state = {
                ...state,
                savedLocations: null,
            };
            break;
        case LocationActions.CURRENT_LOCATION:
            state = {
                ...state,
                currentLocation: action.payload,
            };
            break;
        default:
            break;
    }
    return state;
};

export default LocationReducer;
