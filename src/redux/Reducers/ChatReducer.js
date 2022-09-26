
import { ChatTypes } from '../ActionTypes/ChatActionsTypes';

let initialState = {
    chatMessages: [],
    chatPagination: null
};

const ChatReducer = (state = initialState, action) => {
    switch (action.type) {
        case ChatTypes.GET_CHAT:
            let chat_messages_list_copy = [];
            chat_messages_list_copy = [
                ...state.chatMessages,
                ...action.payload.data
            ];
            state = {
                ...state,
                chatPagination: action.payload,
                chatMessages: chat_messages_list_copy,
            };
            break;
        case ChatTypes.UPDATE_CHAT:
            let messagesCopy = [...state.chatMessages];
            messagesCopy.unshift(action.payload);
            state = { ...state, chatMessages: messagesCopy };
            break;

        case ChatTypes.RESET_CHAT:
            state = {
                ...state,
                chatMessages: [],
                chatPagination: null
            }
            break;
        default:
            break;
    }
    return state;
};

export default ChatReducer;
