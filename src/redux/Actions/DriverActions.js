import {
    DriverTypes
} from '../ActionTypes/DriverActionsTypes';

class DriverActions {
    static GetRequestedRides = (payload) => {
        return {
            type: DriverTypes.GET_REQUESTED_RIDES,
            payload: payload,
        };
    };
    static GetLatestRide = (payload) => {
        return {
            type: DriverTypes.GET_DRIVER_RIDE,
            payload: payload,
        };
    };
    static GetConfirmedRides = (payload) => {
        return {
            type: DriverTypes.GET_CONFIRMED_RIDES,
            payload: payload,
        };
    };
    static GetMoreConfirmedRides = (payload) => {
        return {
            type: DriverTypes.GET_MORE_CONFIRMED_RIDES,
            payload: payload,
        };
    };
    static GetPastRides = (payload) => {
        return {
            type: DriverTypes.GET_PAST_RIDES,
            payload: payload,
        };
    };
    static GetMorePastRides = (payload) => {
        return {
            type: DriverTypes.GET_MORE_PAST_RIDES,
            payload: payload,
        };
    };
    static GetLastRide = (payload) => {
        return {
            type: DriverTypes.GET_LAST_RIDE,
            payload: payload,
        };
    };
}

export default DriverActions;
