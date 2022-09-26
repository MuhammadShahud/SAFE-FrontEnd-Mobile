import React from "react";

import { GeneralTypes } from '../ActionTypes/GeneralActionTypes';

let initialSate = {
    loading: false,
    doNotify: true,
    content: null,
    payment_content: null,
    ratings: {
        data: []
    }
};

const GeneralReducer = (state = initialSate, action) => {
    switch (action.type) {
        case GeneralTypes.SET_LOADING:
            state = { ...state, loading: action.payload };
            break;
        case GeneralTypes.GET_CONTENT:
            state = { ...state, content: action.payload };
            break;
        case GeneralTypes.GET_PAYMENT_CONTENT:
            state = { ...state, payment_content: action.payload };
            break;
        case GeneralTypes.SET_NOTIFY:
            state = { ...state, doNotify: action.payload };
            break;
        case GeneralTypes.GET_RATINGS:
            state = { ...state, ratings: action.payload };
            break;
        case GeneralTypes.GET_MORE_RATINGS:
            state = { ...state, ratings: { ...action.payload, data: [...state.ratings.data, ...action.payload.data] } };
            break;
        default:
            break;
    }
    return state;
};

export default GeneralReducer;
