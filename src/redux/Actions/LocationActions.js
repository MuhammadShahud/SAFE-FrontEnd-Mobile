import { LocationActions } from "../ActionTypes/LocationActions";


class LocationAction {
    static getLocations = payload => {
        return {
            type: LocationActions.GET_LOCATION,
            payload: payload,
        };
    };
    static resetLocation = () => {
        return {
            type: LocationActions.RESET_LOCATION,
        };
    };
    static currentLocation = payload => {
        return {
            type: LocationActions.CURRENT_LOCATION,
            payload: payload,
        };
    };
}

export default LocationAction;
