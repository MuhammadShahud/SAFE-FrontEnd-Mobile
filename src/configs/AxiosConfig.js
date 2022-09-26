import axios from 'axios';
import { base_url } from './APIs';
import { store } from "../redux/store";
import AlertAction from '../redux/Actions/AlertActions';

export const instance = axios.create({
  baseURL: base_url,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers = store.getState().Auth.user?.token
    ? {
      ...config.headers,
      Authorization: 'Bearer ' + store.getState().Auth.user.token,
    }
    : config.headers

  return config;
}, function (error) {
  console.warn(error)
  // Do something with request error
  return Promise.reject(error);
});

export const post = async (url, data, config = {}, message = "") => {
  try {
    let request = await instance.post(url, data, config);
    if (request.data.success == true) {
      if (request.data.data)
        return request.data.data;
      // else
      // store.dispatch(AlertAction.ShowAlert({ title: "Warning", message: request.data.message }))
      // alert(request.data.message);
    } else {
      if (request.data.message)
        store.dispatch(AlertAction.ShowAlert({ title: "Warning", message: request.data.message, status: "error" }))
      else
        store.dispatch(AlertAction.ShowAlert({ title: "Warning", message: message, status: "error" }))

    }
  } catch (error) {
    store.dispatch(AlertAction.ShowAlert({ title: "Error", message: error.message, status: "error" }))
    throw error;
  }
};

export const get = async (url, config = {}) => {
  try {
    let request = await instance.get(url, config);
    if (request.data.success == true) {
      return request.data.data;
    } else {
      store.dispatch(AlertAction.ShowAlert({ title: "Warning", message: request.data.message }))
    }
  } catch (error) {
    store.dispatch(AlertAction.ShowAlert({ title: "Error", message: error.message, status: "error" }));
    throw error;
  }
};
