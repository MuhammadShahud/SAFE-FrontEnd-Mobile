import { AlertTypes } from "../ActionTypes/AlertActions";
import { store } from "../store";


class AlertAction {
    static ShowAlert = payload => {
        return {
            type: AlertTypes.SHOW_ALERT,
            payload: payload,
        };
    };
    static HideAlert = () => {
        return {
            type: AlertTypes.HIDE_ALERT,
        };
    };
}

export default AlertAction;
