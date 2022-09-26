/* eslint-disable prettier/prettier */
import { APIs } from '../../configs/APIs';
import { get, post } from '../../configs/AxiosConfig';
import { GeneralTypes } from '../ActionTypes/GeneralActionTypes';
import GeneralActions from '../Actions/GeneralActions';
import AlertAction from '../Actions/AlertActions';
import SheduleActions from '../Actions/SheduleActions';

export const SheduleMiddleware = {

    getShedules: (data) => {
        return async dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let request = await get(data.next_page_url);
                    if (request) {
                        resolve(request)
                        if (data.next_page_url == APIs.scheduleRides)
                            dispatch(SheduleActions.GetShedules(request))
                        else
                            dispatch(SheduleActions.GetMoreShedules(request))
                        return;
                    }
                } catch (error) {
                    reject(error)
                    console.warn(error);
                }
            });
        };
    },
    getPastRides: (data) => {
        return async dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let request = await get(data.next_page_url);
                    if (request) {
                        resolve(request)
                        if (data.next_page_url == APIs.pastRides)
                            dispatch(SheduleActions.GetPastRides(request))
                        else
                            dispatch(SheduleActions.GetMorePastRides(request))
                        return;
                    }
                } catch (error) {
                    console.warn(error);
                    reject(error)
                }
            });
        };
    },
    getCancelledRides: (data) => {
        return async dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let request = await get(data.next_page_url);
                    if (request) {
                        resolve(request)
                        if (data.next_page_url == APIs.canceledRides)
                            dispatch(SheduleActions.GetCancelledRides(request))
                        else
                            dispatch(SheduleActions.GetMoreCancelledRides(request))
                        return;
                    }
                } catch (error) {
                    console.warn(error);
                    reject(error)
                }
            });
        };
    },

};

