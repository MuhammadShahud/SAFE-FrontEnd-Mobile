/* eslint-disable prettier/prettier */
import { APIs } from '../../configs/APIs';
import { get, post } from '../../configs/AxiosConfig';
import { GeneralTypes } from '../ActionTypes/GeneralActionTypes';
import GeneralActions from '../Actions/GeneralActions';
import AlertAction from '../Actions/AlertActions';

export const GeneralMiddleware = {
    getContent: () => {
        return async dispatch => {
            try {
                let request = await get(APIs.Content);
                if (request) {
                    dispatch(GeneralActions.SetContent(request))
                    return;
                }
            } catch (error) {
                console.warn(error);
            }
        };
    },
    getContentPayment: () => {
        return async dispatch => {
            try {
                let request = await get(APIs.ContentPayment);
                if (request) {
                    dispatch(GeneralActions.SetContentPayment(request))
                    return;
                }
            } catch (error) {
                console.warn(error);
            }
        };
    },
    getRatings: (data) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading());
            try {
                let request = await get(data.next_page_url);
                console.warn(request)
                if (request) {
                    if (data.next_page_url == APIs.RatingAndReviews)
                        dispatch(GeneralActions.GetRatings(request))
                    else
                        dispatch(GeneralActions.GetMoreRatings(request))
                }
            } catch (error) {
                console.warn(error);
            }
            dispatch(GeneralActions.HideLoading());
        };
    },
    contactUs: (data) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading());
            try {
                let formData = new FormData();
                formData.append("type", data.type);
                formData.append("message", data.message);
                if (data.ride_id)
                    formData.append("ride_id", data.ride_id);
                let request = await post(APIs.ContactUs, formData);
                if (request) {
                    dispatch(AlertAction.ShowAlert({ title: "Contact Us", message: "Submission Successful. We will get back to you soon" }))
                }
            } catch (error) {
                console.warn(error);
            }
            dispatch(GeneralActions.HideLoading());
        };
    },
};

