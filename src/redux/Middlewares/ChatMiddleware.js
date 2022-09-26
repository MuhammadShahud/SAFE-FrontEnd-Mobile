import Axios from 'axios';
import { APIs } from '../../configs/APIs';
import { get, post } from '../../configs/AxiosConfig';
import ChatActions from '../../redux/Actions/ChatActions'


export const ChatMiddleware = {
    createChatSession: (user_id) => {
        return async dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append("user_id", user_id);
                    let request = await post(APIs.createChatList, formData);
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
    chatMessages: (data) => {
        return async dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    if (data.url == APIs.chatMessages) {
                        dispatch(ChatActions.resetChat())
                    }
                    let formData = new FormData();
                    formData.append("ride_id", data.chat_list_id);
                    let request = await post(data.url, formData);
                    console.log(request)
                    if (request) {
                        dispatch(ChatActions.getChat(request))
                    } else {
                        reject(request)
                    }
                } catch (error) {
                    reject(error)
                }
            });
        };

    },
    sendMessage: (data) => {
        return async dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append("ride_id", data.ride_id);
                    formData.append("user_id", data.user_id);
                    formData.append("type", data.type);
                    if (data?.type == 'text') {
                        formData.append("message", data.message);
                    } else {
                        formData.append("file", data.file);
                    }

                    let request = await post(APIs.sendMessage, formData);
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
    }

};

