import {
    GeneralTypes
} from '../ActionTypes/GeneralActionTypes';
import { SheduleTypes } from '../ActionTypes/SheduleTypes';

class SheduleActions {

    static GetShedules = (payload) => {
        return {
            type: SheduleTypes.GET_SHEDULES,
            payload: payload,
        };
    };
    static GetMoreShedules = (payload) => {
        return {
            type: SheduleTypes.GET_MORE_SHEDULES,
            payload: payload,
        };
    };
    static GetPastRides = (payload) => {
        return {
            type: SheduleTypes.GET_PAST_RIDES,
            payload: payload,
        };
    };
    static GetMorePastRides = (payload) => {
        return {
            type: SheduleTypes.GET_MORE_PAST_RIDES,
            payload: payload,
        };
    };
    static GetCancelledRides = (payload) => {
        return {
            type: SheduleTypes.GET_CANCELLED_RIDES,
            payload: payload,
        };
    };
    static GetMoreCancelledRides = (payload) => {
        return {
            type: SheduleTypes.GET_MORE_CANCELLED_RIDES,
            payload: payload,
        };
    };
}

export default SheduleActions;
