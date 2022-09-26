import { ChatTypes } from "../ActionTypes/ChatActionsTypes";


class ChatActions {
    static getChat = payload => {
        return {
            type: ChatTypes.GET_CHAT,
            payload: payload,
        };
    };
    static updateChat = payload => {
        return {
            type: ChatTypes.UPDATE_CHAT,
            payload: payload,
        };
    };

    static resetChat = () => {
        return {
            type: ChatTypes.RESET_CHAT,
        };
    };
}

export default ChatActions;
