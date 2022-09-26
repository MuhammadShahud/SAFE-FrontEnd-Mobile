import {
    RideTypes
} from '../ActionTypes/RideActions';

class RideActions {
    static getNotifications = (payload) => {
        return {
            type: RideTypes.GET_NOTIFICATIONS,
            payload: payload,
        };
    };
    static getMoreNotifications = (payload) => {
        return {
            type: RideTypes.GET_MORE_NOTIFICATIONS,
            payload: payload,
        };
    };
    static getRideTypes = (payload) => {
        return {
            type: RideTypes.RIDE_TYPES,
            payload: payload,
        };
    };
    static getRideDetails = (payload) => {
        return {
            type: RideTypes.RIDE_DETAILS,
            payload: payload,
        };
    };
    static getScheduleRide = (payload) => {
        return {
            type: RideTypes.SCHEDULE_RIDE,
            payload: payload,
        };
    };
}

export default RideActions;
