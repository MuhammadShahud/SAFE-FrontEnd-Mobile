import { PaymentTypes } from "../ActionTypes/PaymentActionTypes";


class PaymentAction {
    static getCards = payload => {
        return {
            type: PaymentTypes.GET_CARDS,
            payload: payload,
        };
    };
    static deleteCards = payload => {
        return {
            type: PaymentTypes.DELETE_CARD,
            payload: payload,
        };
    };

    static updateCard = payload => {
        return {
            type: PaymentTypes.UPDATE_CARD,
            payload: payload,
        };
    };
    static getPaymentHistory = payload => {
        return {
            type: PaymentTypes.GET_PAYMENT_HISTORY,
            payload: payload,
        };
    };
    static addCard = payload => {
        return {
            type: PaymentTypes.ADD_CARD,
            payload: payload,
        };
    };
    static selectedPaymentmethod = payload => {
        return {
            type: PaymentTypes.SELECTED_PAYMENT,
            payload: payload,
        };
    };

}

export default PaymentAction;
