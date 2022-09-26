/* eslint-disable prettier/prettier */
import { APIs } from '../../configs/APIs';
import { get, post } from '../../configs/AxiosConfig';
import { GeneralTypes } from '../ActionTypes/GeneralActionTypes';
import GeneralActions from '../Actions/GeneralActions';
import DriverActions from '../Actions/DriverActions';
import AlertAction from '../Actions/AlertActions';

export const DriverMiddleware = {
    getRequestedRides: () => {
        return async dispatch => {
            try {
                let request = await get(APIs.RequestedRides);
                if (request) {
                    dispatch(DriverActions.GetRequestedRides(request))
                    return;
                }
            } catch (error) {
                console.warn(error);
            }
        };
    },
    getLatestDriver: ({
        onSuccess
    }) => {
        return async dispatch => {
            try {
                let request = await get(APIs.LatestRide);
                if (request) {
                    dispatch(DriverActions.GetLatestRide(request))
                    onSuccess(true)
                    return;
                }
                onSuccess(false)
            } catch (error) {
                onSuccess(false)
                console.warn(error);
            }
        };
    },
    AcceptRide: (data) => {
        return async dispatch => {
            try {
                dispatch(GeneralActions.ShowLoading())
                let formData = new FormData();
                formData.append("ride_id", data.rideId)
                let request = await post(APIs.AcceptRide, formData);
                if (request) {
                    data?.onSuccess();
                    //dispatch(DriverActions.GetLatestRide(request))
                }
            } catch (error) {
                console.warn(error);
            }
            dispatch(GeneralActions.HideLoading())
        };
    },
    CancelRide: (data) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading())
            try {
                let formData = new FormData();
                formData.append("ride_id", data.rideId)
                let request = await post(APIs.CancelRide, formData);
                if (request) {
                    dispatch(DriverActions.GetRequestedRides(data.array))
                }
            } catch (error) {
                console.warn(error);
            }
            dispatch(GeneralActions.HideLoading())
        };
    },
    DropLocation: (data) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading())
            try {
                let formData = new FormData();
                formData.append("ride_id", data.rideId)
                formData.append("location_id", data.locationId)
                let request = await post(APIs.DropLocation, formData);
                if (request) {
                    dispatch(DriverActions.GetLatestRide(request))
                }
            } catch (error) {
                console.warn(error);
            }
            dispatch(GeneralActions.HideLoading())
        };
    },
    CompleteRide: (data) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading())
            try {
                let formData = new FormData();
                formData.append("ride_id", data.rideId)
                let request = await post(APIs.CompleteRide, formData);
                if (request) {
                    dispatch(AlertAction.ShowAlert({
                        title: "Message",
                        message: "Ride has been completed."
                    }))
                    data?.onSuccess(true)
                    // dispatch(DriverActions.GetLatestRide(null))
                }
            } catch (error) {
                console.warn(error);
            }
            dispatch(GeneralActions.HideLoading())
        };
    },
    getComfirmedRides: ({ next_url }) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading())
            try {

                let request = await get(next_url);
                if (request) {
                    if (next_url == APIs.ScheduleRidesDriver) {
                        dispatch(DriverActions.GetConfirmedRides(request))
                    }
                    else
                        dispatch(DriverActions.GetMoreConfirmedRides(request))
                }
            } catch (error) {
                console.warn(error);
            }
            dispatch(GeneralActions.HideLoading())
        };
    },
    getPastRides: ({ next_url }) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading())
            try {
                let request = await get(APIs.PastRidesDriver);
                if (request) {
                    if (next_url == APIs.PastRidesDriver) {
                        dispatch(DriverActions.GetPastRides(request))
                    }
                    else
                        dispatch(DriverActions.GetMorePastRides(request))
                }
            } catch (error) {
                console.warn(error);
            }
            dispatch(GeneralActions.HideLoading())
        };
    },
    getLastRides: () => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading())
            try {
                let request = await get(APIs.LastRideDriver);
                if (request) {
                    dispatch(DriverActions.GetLastRide(request))
                }
            } catch (error) {
                console.warn(error);
            }
            dispatch(GeneralActions.HideLoading())
        };
    },
    updateLatLng: (data) => {
        return async dispatch => {
            try {
                let formData = new FormData();
                formData.append("latitude", data.latitude)
                formData.append("longitude", data.longitude)
                formData.append("user_id", data.id)
                let request = await post(APIs.UpdateLatLng, formData);
                console.warn(request)
                if (request) {

                }
            } catch (error) {
                console.warn(error);
            }
        };
    },
    driversLocation: (data) => {
        return async dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append("lat", data.latitude)
                    formData.append("long", data.longitude)
                    let request = await post(APIs.availableDrivers, formData);
                    if (request) {
                        resolve(request)
                    }
                } catch (error) {
                    reject(error)
                    console.warn(error);
                }
            })

        };
    }

};

