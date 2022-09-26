import { PaymentTypes } from "../ActionTypes/PaymentActionTypes";

let initialSate = {
    cards: [],
    paymentHistory: null,
    selectedPaymentMethod: null
};

const PaymentReducer = (state = initialSate, action) => {
    switch (action.type) {
        case PaymentTypes.GET_CARDS:
            state = { ...state, cards: action.payload };
            break;
        case PaymentTypes.GET_PAYMENT_HISTORY:
            state = { ...state, paymentHistory: action.payload };
            break;
        case PaymentTypes.ADD_CARD:
            state = { ...state, cards: [...state.cards, action.payload] };
            break;
        case PaymentTypes.DELETE_CARD:
            let cardList = [...state.cards]
            let index = cardList?.findIndex(item => item.id == action.payload)
            cardList.splice(index, 1);
            state = {
                ...state,
                cards: cardList
            };
            break;
        case PaymentTypes.UPDATE_CARD:
            let cardlists = [...state.cards]
            let cindex = cardlists?.findIndex(item => item.id == action.payload.id)
            cardlists.splice(cindex, 1, action.payload);
            state = {
                ...state,
                cards: cardlists
            };
            break;
        case PaymentTypes.SELECTED_PAYMENT:
            state = { ...state, selectedPaymentMethod: action.payload };
            break;
        default:
            break;
    }
    return state;
};

export default PaymentReducer;
