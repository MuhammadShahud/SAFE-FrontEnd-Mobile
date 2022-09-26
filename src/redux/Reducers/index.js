import { combineReducers } from 'redux';

import Auth from './AuthReducer';
import Alert from "./AlertReducers";
import General from "./GeneralReducer";
import Ride from "./RideReducer";
import Location from './LocationReducer'
import Shedule from './SheduleReducers'
import Chat from './ChatReducer'
import Payment from './PaymentReducer'
import Driver from './DriverReducer'

export default combineReducers({
  Auth,
  Alert,
  General,
  Ride,
  Location,
  Shedule,
  Chat,
  Payment,
  Driver
});
