import Axios from 'axios';
import { APIs } from '../../configs/APIs';
import { get, post } from '../../configs/AxiosConfig';
import GeneralActions from '../Actions/GeneralActions';
import AlertAction from '../Actions/AlertActions';
import LocationAction from '../Actions/LocationActions'
import RideActions from '../Actions/RideActions';

export const MapLocationMiddleware = {
    saveLocation: (data) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading());
            try {
                let formData = new FormData();
                formData.append("name", data.name);
                formData.append("place_name", data.place_name);
                formData.append("address", data.address);
                formData.append("longitude", data.longitude);
                formData.append("latitude", data.latitude);
                let request = await post(APIs.saveLocation, formData);
                if (request) {
                    dispatch(AlertAction.ShowAlert({ title: "Save location", message: "Location saved successfully." }))
                }
            } catch (error) {
                console.warn(error);
            }
            dispatch(GeneralActions.HideLoading());
        };
    },

    getLocation: () => {
        return async dispatch => {
            try {
                let request = await get(APIs.getLocation);
                if (request) {
                    dispatch(LocationAction.getLocations(request))
                    // dispatch(AlertAction.ShowAlert({ title: "Save location", message: "Location saved successfully." }))
                }
            } catch (error) {
                console.warn(error);
            }
        };
    },

    calculateDistance: (Locations) => {
        return async dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    for (const [index, item] of Locations.entries()) {
                        formData.append(`ride_locations[${index}][latitude]`, item?.lat)
                        formData.append(`ride_locations[${index}][longitude]`, item?.lng)
                        formData.append(`ride_locations[${index}][children_id]`, item?.child_id)
                        formData.append(`ride_locations[${index}][ride_order]`, index + 1)
                    }
                    let request = await post(APIs.calculateDistance, formData);
                    if (request) {
                        resolve(request)
                        dispatch(RideActions.getRideTypes(request))
                    }else{
                        resolve(request)
                    }
                } catch (error) {
                    reject(error);
                }
            });
        };
    }

};

