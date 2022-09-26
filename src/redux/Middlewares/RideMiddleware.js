/* eslint-disable prettier/prettier */
import { APIs } from '../../configs/APIs';
import { get, post } from '../../configs/AxiosConfig';
import GeneralActions from '../Actions/GeneralActions';
import RideActions from '../Actions/RideActions';

export const RideMiddleware = {
    getNotifications: (data) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading());
            try {
                let request = await get(data.next_page_url);
                if (request) {
                    if (data.next_page_url == APIs.Notification)
                        dispatch(RideActions.getNotifications(request))
                    else
                        dispatch(RideActions.getMoreNotifications(request))
                }
            } catch (error) {
                console.warn(error);
            }
            dispatch(GeneralActions.HideLoading());
        };
    },

    rideBooking: (data) => {
        return async dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('ride_for', data.type)
                    formData.append('vehicle_type', data.vehicle_type)
                    formData.append('pickUpLong', data.Locations[0].lng)
                    formData.append('pickUpLat', data.Locations[0].lat)
                    formData.append('type', data.scheduletype)
                    formData.append('total_distance', data.total_distance)
                    formData.append('total_time', data.total_time)
                    formData.append('total_price', data.total_price)
                    if (data.scheduletype == 'schedule') {
                        formData.append('schedule_start_time', data.schedule_start_time)
                    }

                    for (const [index, item] of data.Locations.entries()) {
                        formData.append(`ride_locations[${index}][latitude]`, item?.lat)
                        formData.append(`ride_locations[${index}][longitude]`, item?.lng)
                        formData.append(`ride_locations[${index}][address]`, item?.Address)
                        formData.append(`ride_locations[${index}][children_id]`, item?.child_id)
                        formData.append(`ride_locations[${index}][ride_order]`, index + 1)
                    }
                    let request = await post(APIs.bookRide, formData);
                    if (request) {
                        resolve(request)
                    } else {
                        reject(request)
                    }
                } catch (error) {
                    reject(error)
                }
            });
        };

    },

    confirmBooking: (data) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading());
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    if (data?.payment_method_id)
                        formData.append('payment_method_id', data.payment_method_id)
                    formData.append('ride_id', data.ride_id)
                    formData.append('confirm', data.confirm)
                    let request = await post(APIs.confirmRide, formData);
                    if (request) {
                        resolve(request)
                    } else {
                        reject(request)
                    }
                } catch (error) {
                    reject(error)
                }
                dispatch(GeneralActions.HideLoading());
            });
        };
    },

    startRide: (data) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading());
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('ride_id', data.ride_id)
                    let request = await post(APIs.startRide, formData);
                    if (request) {
                        resolve(request)
                    } else {
                        reject(request)
                    }
                } catch (error) {
                    reject(error)
                }
                dispatch(GeneralActions.HideLoading());
            });
        };
    },

    cancelRide: (ride_id) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading());
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('ride_id', ride_id)
                    let request = await post(APIs.cancelRide, formData);
                    if (request) {
                        resolve(request)
                    } else {
                        reject(request)
                    }
                } catch (error) {
                    reject(error)
                }
                dispatch(GeneralActions.HideLoading());
            });
        };
    },

    getRiderLatestRide: () => {
        return async dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let request = await get(APIs.LatestRide);
                    if (request) {
                        resolve(request)
                    } else {

                    }
                } catch (error) {
                    reject(error)
                }
            });
        };
    },

    rateDriver: (data) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading());
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('ride_id', data.ride_id)
                    formData.append('user_id', data.user_id)
                    formData.append('rating', data.rating)
                    formData.append('review', data.review)

                    let request = await post(APIs.driverReview, formData);
                    console.log(request)
                    if (request) {
                        resolve(request)
                    } else {
                        reject(request)
                    }
                } catch (error) {
                    reject(error)
                }
                dispatch(GeneralActions.HideLoading());
            });
        };
    },

};
