import { APIs } from '../../configs/APIs'
import PaymentActions from '../Actions/PaymentActions'
import AlertAction from '../Actions/AlertActions'
import { get, post } from '../../configs/AxiosConfig';
import GeneralActions from '../Actions/GeneralActions';


export const PaymentMiddleware = {
    getCards: () => {
        return async dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let response = await get(APIs.userCards)
                    if (response) {
                        dispatch(PaymentActions.getCards(response))
                        resolve(response)
                    }
                } catch (error) {
                    console.log(error)
                    reject(error)
                }
            });
        }
    },

    AddCard: (data) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('card_number', data.card_number)
                    formData.append('exp_date', data.exp_date)
                    formData.append('cvc', data.cvc)
                    let response = await post(APIs.AddCard, formData)
                    if (response) {
                        resolve(response)
                        dispatch(PaymentMiddleware.getCards())
                        dispatch(AlertAction.ShowAlert({ title: "Add Card", message: 'Card Added Successfully.' }))
                    }
                } catch (error) {
                    console.log(error)
                    reject(error)
                }

                dispatch(GeneralActions.HideLoading())
            })
        }
    },

    DeleteCard: (card_id) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading())
            try {
                let formData = new FormData();
                formData.append('card_id', card_id)
                let response = await post(APIs.DeleteCard, formData)
                if (response) {
                    dispatch(PaymentActions.deleteCards(card_id))
                    dispatch(AlertAction.ShowAlert({ title: "Add Card", message: 'Deleted Successfully.' }))
                }
            } catch (error) {
                console.log(error)
            }
            dispatch(GeneralActions.HideLoading())
        }
    },

    getPaymentHistory: () => {
        return async dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let response = await get(APIs.getPaymentHistory)
                    if (response) {
                        dispatch(PaymentActions.getPaymentHistory(response))
                        resolve(response)
                    }
                } catch (error) {
                    console.log(error)
                    reject(error)
                }
            });

        }
    },

    addBankAccount: (data) => {
        return async dispatch => {
            dispatch(GeneralActions.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    if (data?.id)
                        formData.append('id', data.id)
                    formData.append('bank_name', data.bank_name)
                    formData.append('account_title', data.account_title)
                    formData.append('account_number', data.account_number)
                    formData.append('routing_number', data.routing_number)
                    let response = await post(APIs.AddAccount, formData)
                    if (response) {
                        resolve(response)
                        if (data?.id) {
                            dispatch(PaymentActions.updateCard(response))
                        } else {
                            dispatch(PaymentActions.addCard(response))
                        }
                    }
                } catch (error) {
                    console.log(error)
                    reject(error)
                }

                dispatch(GeneralActions.HideLoading())
            })
        }
    },


}