import {
    GeneralTypes
} from '../ActionTypes/GeneralActionTypes';

class GeneralActions {
    static ShowLoading = () => {
        return {
            type: GeneralTypes.SET_LOADING,
            payload: true,
        };
    };
    static HideLoading = () => {
        return {
            type: GeneralTypes.SET_LOADING,
            payload: false,
        };
    };
    static SetContent = (payload) => {
        return {
            type: GeneralTypes.GET_CONTENT,
            payload: payload,
        };
    };
    static SetContentPayment = (payload) => {
        return {
            type: GeneralTypes.GET_PAYMENT_CONTENT,
            payload: payload,
        };
    };
    static SetNotify = (payload) => {
        return {
            type: GeneralTypes.SET_NOTIFY,
            payload: payload,
        };
    };
    static GetRatings = (payload) => {
        return {
            type: GeneralTypes.GET_RATINGS,
            payload: payload,
        };
    };
    static GetMoreRatings = (payload) => {
        return {
            type: GeneralTypes.GET_MORE_RATINGS,
            payload: payload,
        };
    };
}

export default GeneralActions;
