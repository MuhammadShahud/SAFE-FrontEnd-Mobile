/* eslint-disable prettier/prettier */
import { APIs } from '../../configs/APIs';
import { get, post } from '../../configs/AxiosConfig';
import AuthAction from '../Actions/AuthActions';
import GeneralActions from '../Actions/GeneralActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    LoginManager,
    Profile,
    GraphRequest,
    AccessToken,
    GraphRequestManager,
} from 'react-native-fbsdk-next';

export const AuthMiddleware = {
    Login: (data) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading())
            try {
                let formData = new FormData();
                formData.append("email", data.email);
                formData.append("password", data.password);
                formData.append("device_id", data.token);
                let request = await post(APIs.Login, formData);
                if (request) {
                    await AsyncStorage.setItem('@user', JSON.stringify(request))
                    dispatch(AuthAction.Login(request))
                }
            } catch (error) {
                console.warn(error);
            }
            dispatch(GeneralActions.HideLoading())
        };
    },
    SocialLogin: (data) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading())
            try {
                let formData = new FormData();
                formData.append("email", data.email);
                formData.append("username", data.username);
                formData.append("device_id", data.token);
                let request = await post(APIs.SocialLogin, formData);
                if (request) {
                    await AsyncStorage.setItem('@user', JSON.stringify(request))
                    dispatch(AuthAction.Login(request))
                }
            } catch (error) {
                console.warn(error);
            }
            dispatch(GeneralActions.HideLoading())
        };
    },
    facebookLogin: () => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
                        result => {
                            if (result.isCancelled) {
                                console.log('Login cancelled');
                            } else {
                                Profile.getCurrentProfile().then(currentProfile => {
                                    AccessToken.getCurrentAccessToken().then(token => {
                                        console.log(token)
                                        new GraphRequestManager()
                                            .addRequest(
                                                new GraphRequest(
                                                    '/me',
                                                    {
                                                        accessToken: token?.accessToken,
                                                        parameters: {
                                                            fields: {
                                                                string: 'name , email',
                                                                // string: 'email',
                                                            },
                                                        },
                                                    },
                                                    (err, res) => {
                                                        resolve(res);
                                                        if (err) {
                                                            alert('Something went wrong');
                                                            reject(null);
                                                        } else {
                                                        }
                                                    },
                                                ),
                                            )
                                            .start();
                                    });
                                });
                            }
                        },
                        function (error) {
                            reject(null);
                            console.log('Login fail with error: ' + error);
                        },
                    );


                } catch (error) {
                    alert('Network Error');
                    reject(error);

                    console.log('error', error);
                }
            });
        };
    },
    ForgotPassword: (data) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading())
            try {
                let formData = new FormData();
                formData.append("email", data.email);
                let request = await post(APIs.sendForgotEmail, formData);
                if (request) {
                    data.callback(request);
                }
            } catch (error) {
                console.warn(error);
            }
            dispatch(GeneralActions.HideLoading())
        };
    },
    ResetPassword: (data) => {
        return async dispatch => {
            try {
                dispatch(GeneralActions.ShowLoading())
                let formData = new FormData();
                formData.append("email", data.email);
                formData.append("password", data.password);
                let request = await post(APIs.ResetPassword, formData);
                if (request) {
                    data.callback();
                }
            } catch (error) {
                console.warn(error);
            }
            dispatch(GeneralActions.HideLoading())
        };
    },
    SignUp: (data) => {
        return async dispatch => {
            try {
                dispatch(GeneralActions.ShowLoading())
                let formData = new FormData();
                formData.append("username", data.firstname + " " + data.lastname);
                formData.append("first_name", data.firstname);
                formData.append("last_name", data.lastname);
                formData.append("email", data.email);
                formData.append("phone", data.phone);
                formData.append("address", data.address);
                formData.append("gender", data.gender);
                formData.append("device_id", data.token);
                formData.append("password", data.password);
                formData.append("role", data.userRole);
                let request = await post(APIs.Register, formData);
                if (request) {
                    dispatch(AuthAction.Signup(request))
                    data.onSuccess(request)
                }
            } catch (error) {
                console.warn(error);
            }
            dispatch(GeneralActions.HideLoading())

        };
    },
    ChangePassword: (data) => {
        return async dispatch => {
            try {
                let formData = new FormData();
                formData.append("old_password", data.old_pass);
                formData.append("new_password", data.password);
                let request = await post(APIs.ChangePassword, formData);
                if (request) {
                    data.onSuccess(true);
                }
                else
                    data.onSuccess(false);
            } catch (error) {
                data.onSuccess(false);
                console.warn(error);
            }
        };
    },
    UpdateProfile: (data) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    if (data.firstname && data.lastname)
                        formData.append("username", data.firstname + " " + data.lastname);
                    if (data.firstname)
                        formData.append("first_name", data.firstname);
                    if (data.lastname)
                        formData.append("last_name", data.lastname);
                    if (data.email)
                        formData.append("email", data.email);
                    if (data.phonenumber)
                        formData.append("phone", data.phonenumber);
                    if (data.address)
                        formData.append("address", data.address);
                    if (data.gender)
                        formData.append("gender", data.gender);
                    if (data.image)
                        formData.append("image", data.image);
                    if (data.device_id)
                        formData.append("device_id", "");
                    if (data.license_name)
                        formData.append("license[name_on_card]", data.license_name);
                    if (data.vehicle_booking)
                        formData.append("vehicle_type", data.vehicle_booking);
                    if (data.license_number)
                        formData.append("license[license_plate_number]", data.license_number);
                    formData.append("license[card_front]", data?.cardFront ? data?.cardFront : null);
                    formData.append("license[card_back]", data?.cardBack ? data?.cardBack : null);
                    if (data.vehicle_brand)
                        formData.append("vehicle[vehicle_brand]", data.vehicle_brand);
                    if (data.vehicle_model)
                        formData.append("vehicle[model]", data.vehicle_model);
                    if (data.vehicle_color)
                        formData.append("vehicle[color]", data.vehicle_color);
                    if (data.vehicle_plate)
                        formData.append("vehicle[license_plate]", data.vehicle_plate);
                    if (data.vehicle_booking)
                        formData.append("vehicle[booking_type]", data.vehicle_booking);
                    if (data.license_expiry)
                        formData.append("license[expiry]", data.license_expiry);
                    if (data.vehicle_year)
                        formData.append("vehicle[year]", data.vehicle_year);

                    if (data?.childrens?.length > 0) {
                        for (const [index, item] of data.childrens.entries()) {
                            if (item?.id)
                                formData.append(`childrens[${index}][id]`, item?.id)
                            if (item?.first_name)
                                formData.append(`childrens[${index}][first_name]`, item?.first_name)
                            if (item?.last_name)
                                formData.append(`childrens[${index}][last_name]`, item?.last_name)
                            if (item?.grade)
                                formData.append(`childrens[${index}][grade]`, item?.grade)
                            if (item?.age)
                                formData.append(`childrens[${index}][age]`, item?.age)
                            if (item?.school_name)
                                formData.append(`childrens[${index}][school_name]`, item?.school_name)
                            if (item?.payment_type)
                                formData.append(`childrens[${index}][payment_type]`, item?.payment_type)
                            if (item?.payment_method)
                                formData.append(`childrens[${index}][user_card_id]`, item?.payment_method?.id)
                        }
                    }
                    if (data.availability) {
                        data.availability.forEach((element, index) => {
                            formData.append(`availability[${index}][day]`, element.day)
                            formData.append(`availability[${index}][start_time]`, element.start_time)
                            formData.append(`availability[${index}][end_time]`, element.end_time)
                        })
                    }
                    let request = await post(APIs.UpdateProfile, formData);

                    if (request) {
                        dispatch(AuthAction.UpdateUserProfile(request, data?.edit ? data?.edit : data.role == "Rider"))
                        resolve(request)
                        data.onSuccess(true);
                    }
                } catch (error) {
                    reject(error)
                    data.onSuccess(false);
                    console.warn(error);
                }

                dispatch(GeneralActions.HideLoading())
            });
        };
    },
    SetOnlineOffline: (data) => {
        return async dispatch => {
            try {
                let request = await get(APIs.OnlineOffline);
                if (request) {
                    data.onSuccess(request);
                }
                else {
                    data.onSuccess(false);
                }
            } catch (error) {
                data.onSuccess(false);
                console.warn(error);
            }
        };
    },
    getUserInfo: (user_id) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('user_id', user_id)
                    let request = await post(APIs.getUserInfo, formData);
                    if (request) {
                        dispatch(AuthAction.getUserInfo(request))
                        resolve(request)
                    } else {
                        reject(request)
                    }
                } catch (error) {
                    reject(error)
                }
                dispatch(GeneralActions.HideLoading())

            });
        };
    },
    deleteChild: (child_id) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('child_id', child_id)
                    let request = await post(APIs.childDelete, formData);
                    if (request) {
                        resolve(request)
                        dispatch(AuthAction.UpdateUserProfile(request, true))
                    } else {
                        reject(request)
                    }
                } catch (error) {
                    reject(error)
                }
                dispatch(GeneralActions.HideLoading())

            });
        };
    },


};
