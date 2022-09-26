import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator, } from '@react-navigation/native-stack';
import DriverSignup from '../screens/DriverScreens/Signup/DriverSignup';
import SignupCompleteProfile from '../screens/DriverScreens/Signup/SignupCompleteProfile';
import FingerPrint from '../screens/DriverScreens/Fingerprint/FingerPrint';
import Login from '../screens/DriverScreens/Login/Login';
import AcceptAJob from '../screens/DriverScreens/SkipScreens/AcceptAJob';
import TermsAndConditions from '../screens/DriverScreens/TermsAndCondtions/TermsAndCondtions';
import DriverDashBoard from '../screens/DriverScreens/DashBoard/DriverDashBoard';
import Settings from '../screens/DriverScreens/Settings/Settings';
import Profile from '../screens/DriverScreens/Profile/Profile';
import EditProfile from '../screens/DriverScreens/Profile/EditProfile';
import Contactus from '../screens/DriverScreens/ContactUs/Contactus';
import ContactusPaymentOption from '../screens/DriverScreens/ContactUs/ContactusPaymentOption';
import PrivacyPolicy from '../screens/DriverScreens/PrivacyPolicy/PrivacyPolicy';
import DriverBookingNotification from '../screens/DriverScreens/Booking';
import StartRide from '../screens/DriverScreens/AcceptRide/StartRide';
import PaymentWithCard from '../screens/DriverScreens/PaymentsScreens/PaymentWithCard';
import PaymentWithBankAccount from '../screens/DriverScreens/PaymentsScreens/PaymentWithBankAccount';
import Ratings from '../screens/DriverScreens/RatingAndReviews/Ratings';
import Help from '../screens/DriverScreens/Help/Help';
import InviteFriends from '../screens/DriverScreens/InviteFriend/InviteFriends';
import CommunityGuide from '../screens/DriverScreens/CommunityGroup/CommunityGuide';
import TripDetail from '../screens/DriverScreens/TripDetails/TripDetail';
import PaymentHistory from '../screens/DriverScreens/Payments/PaymentHistory';
import TripHistoryOne from '../screens/DriverScreens/TripHistory/TripHistoryOne';
import ContactusRequest from '../screens/DriverScreens/ContactUs/ContactusRequest';
import PickUp from '../screens/DriverScreens/PickUp/PickUp';
import ConfirmedRides from '../screens/DriverScreens/TripHistoryTwos/ConfirmedRides';
import PastRides from '../screens/DriverScreens/TripHistoryTwos/PastRides';
import TripsNotification from '../screens/DriverScreens/TripHistoryTwos/index';
import RiderLocationGuide from '../screens/DriverScreens/AcceptRide/RiderLocationGuide';
import StartRideTracking from '../screens/DriverScreens/AcceptRide/StartRideTracking';
import ChatList from '../screens/DriverScreens/Chat/ChatList';
import RiderDashBoard from '../screens/RiderScreens/DashBoard/RiderDashBoard';
import RiderSkipScreens from '../screens/DriverScreens/SkipScreens/RiderSkipScreens';
import RiderProfile from '../screens/RiderScreens/RiderProfile/RiderProfile';
import Recent from '../screens/RiderScreens/Recent/Recent';
import PaymentByCard from '../screens/RiderScreens/Payments/PaymentByCard';
import PaymentByBankAccount from '../screens/RiderScreens/Payments/PaymentByBankAccount';
import RiderPaymentHistory from '../screens/RiderScreens/RiderPaymentHistory/RiderPaymentHistory';
import RiderTripsOptions from '../screens/RiderScreens/RiderTripsOptions/index';
import SheduledRide from '../screens/RiderScreens/RiderTripsOptions/SheduledRide';
import Cancelled from '../screens/RiderScreens/RiderTripsOptions/Cancelled';
import Past from '../screens/RiderScreens/RiderTripsOptions/Past';
import UpComing from '../screens/RiderScreens/RiderTripsOptions/UpComing';
import RiderNotification from '../screens/RiderScreens/RiderNotifications/RiderNotification';
import RiderProfileView from '../screens/RiderScreens/RiderProfile/RiderProfileView';
import SavedPlaces from '../screens/RiderScreens/SavedPlaces/SavedPlaces';
import ChooseYourRide from '../screens/RiderScreens/ChooseYourRide/ChooseYourRide';
import ConfirmPickUp from '../screens/RiderScreens/ConfirmPickUp/ConfirmPickUp';
import ConfirmBooking from '../screens/RiderScreens/ConfirmBooking/ConfirmBooking';
import AddCardNumber from '../screens/RiderScreens/Payments/AddCardNumber';
import ProfileAndRating from '../screens/RiderScreens/DriverProfileAndRatings/ProfileAndRating';
import RateYourDriver from '../screens/RiderScreens/RateYourDriver/RateYourDriver';
import ArriveRider from '../screens/RiderScreens/ArriveRider/ArriveRider';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import { Colors } from '../Styles';
import AlertAction from '../redux/Actions/AlertActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import { useNavigation } from '@react-navigation/native';
import AuthAction from '../redux/Actions/AuthActions';
import messaging from '@react-native-firebase/messaging';
import notifee from "@notifee/react-native";
import GeneralActions from '../redux/Actions/GeneralActions';


const Splash = () => {
  return (
    <View style={{ ...StyleSheet.absoluteFill, justifyContent: "center", alignItems: 'center', backgroundColor: 'rgba(255,255,255,1)' }}>
      <ActivityIndicator
        size={"large"}
        color={Colors.DARK_PURPLE}
      />
    </View>
  )
}

const MyStack = () => {

  const Stack = createNativeStackNavigator();
  const loggedIn = useSelector(state => state.Auth.isLogin);
  const user = useSelector(state => state.Auth.user);
  const loading = useSelector(state => state.General.loading);
  const showAlert = useSelector(state => state.Alert.showAlert);
  const alert = useSelector(state => state.Alert.alertOptions);
  const [loadings, setLoading] = useState(false);
  // const [driverSkip, setDriverSkip] = useState("false");
  // const [initialRouteName, setInitialRouteName] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const createChannel = async () => {
    let channelId = await notifee.createChannel({
      id: 'safe_app',
      name: 'Safe Channel',
      sound: "default",
      vibration: true,
      badge: true,
      importance: 4,
      visibility: 1,
      bypassDnd: true
    });
  }

  async function checkPermission() {
    const enabled = await messaging().hasPermission();
    // If Premission granted proceed towards token fetch
    if (enabled != messaging.AuthorizationStatus.AUTHORIZED) {
      requestPermission();
    }
  }
  async function requestPermission() {
    try {
      await messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }
  async function onMessageReceived(message) {
    let notify = await AsyncStorage.getItem('@notify')
    if (notify == 'true') {
      // Do something
      let channelId = await notifee.createChannel({
        id: 'safe_app',
        name: 'Safe Channel',
        sound: "default",
        vibration: true,
        badge: true,
        importance: 4,
        visibility: 1,
        bypassDnd: true
      });
      // Display a notification
      await notifee.displayNotification({
        title: message.notification.title,
        body: message.notification.body,
        android: {
          channelId: channelId,
          importance: 4,
          sound: "default",
        },
      });
    }
  }

  useEffect(() => {
    isAuth()
    createChannel();
    checkPermission()
    messaging().registerDeviceForRemoteMessages();
    messaging().onMessage(onMessageReceived)
  }, [loggedIn])

  const isAuth = async () => {
    let userdata = await AsyncStorage.getItem('@user')
    let notify = await AsyncStorage.getItem('@notify')
    setTimeout(() => {
      if (userdata != null) {
        const user = JSON.parse(userdata)
        if (notify == 'true') {
          dispatch(GeneralActions.SetNotify(true))
        } else {
          dispatch(GeneralActions.SetNotify(false))
        }
        dispatch(AuthAction.Login(user));
        SplashScreen.hide();
      } else {
        dispatch(AuthAction.Logout(true));
        SplashScreen.hide();
      }
    }, 0);
  }

  useEffect(() => {
    if (user)
      getSkipped();
  }, [loggedIn])

  const getSkipped = async () => {
    let logincount = user?.user?.login_count
    // if (user?.user?.role == "rider" && logincount > 1) {
    //   AsyncStorage.setItem("SAFE-skipped-rider", "true")
    // }
    // else if (user?.user?.role == "driver" && logincount > 1) {
    //   AsyncStorage.setItem("SAFE-skipped-driver", "true")
    // }
    // let rSkip = await AsyncStorage.getItem("SAFE-skipped-rider");
    // let dSkip = await AsyncStorage.getItem("SAFE-skipped-driver");
    let init = user?.user?.role == "driver" ?
      logincount > 1 ?
        "DriverDashBoard" :
        'AcceptAJob' :
      logincount > 1 ?
        "RiderDashBoard" :
        'RiderSkipScreens';
    navigation.reset({
      index: 0,
      routes: [
        { name: init },
      ]
    })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {!loggedIn ?
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="SignupCompleteProfile"
              component={SignupCompleteProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FingerPrint"
              component={FingerPrint}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DriverSignup"
              component={DriverSignup}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
          :
          <Stack.Navigator>
            <Stack.Screen
              name="Splash"
              component={Splash}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AcceptAJob"
              component={AcceptAJob}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TermsAndConditions"
              component={TermsAndConditions}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DriverDashBoard"
              component={DriverDashBoard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Contactus"
              component={Contactus}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicy}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TermsAndCondtions"
              component={TermsAndConditions}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DriverBookingNotification"
              component={DriverBookingNotification}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="StartRide"
              component={StartRide}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ContactusPaymentOption"
              component={ContactusPaymentOption}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PaymentWithCard"
              component={PaymentWithCard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PaymentWithBankAccount"
              component={PaymentWithBankAccount}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Ratings"
              component={Ratings}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Help"
              component={Help}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="InviteFriends"
              component={InviteFriends}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CommunityGuide"
              component={CommunityGuide}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TripDetail"
              component={TripDetail}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PaymentHistory"
              component={PaymentHistory}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TripHistoryOne"
              component={TripHistoryOne}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ContactusRequest"
              component={ContactusRequest}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PickUp"
              component={PickUp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ConfirmedRides"
              component={ConfirmedRides}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PastRides"
              component={PastRides}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TripsNotification"
              component={TripsNotification}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RiderLocationGuide"
              component={RiderLocationGuide}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChatList"
              component={ChatList}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="StartRideTracking"
              component={StartRideTracking}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RiderSkipScreens"
              component={RiderSkipScreens}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RiderProfile"
              component={RiderProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RiderDashBoard"
              component={RiderDashBoard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PaymentByCard"
              component={PaymentByCard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PaymentByBankAccount"
              component={PaymentByBankAccount}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RiderPaymentHistory"
              component={RiderPaymentHistory}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RiderTripsOption"
              component={RiderTripsOptions}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SheduledRide"
              component={SheduledRide}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Cancelled"
              component={Cancelled}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Past"
              component={Past}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="UpComing"
              component={UpComing}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RiderNotification"
              component={RiderNotification}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RiderProfileView"
              component={RiderProfileView}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Recent"
              component={Recent}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SavedPlaces"
              component={SavedPlaces}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddCardNumber"
              component={AddCardNumber}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProfileAndRating"
              component={ProfileAndRating}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RateYourDriver"
              component={RateYourDriver}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='ChooseYourRide'
              component={ChooseYourRide}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='ConfirmPickUp'
              component={ConfirmPickUp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='ConfirmBooking'
              component={ConfirmBooking}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='ArriveRider'
              component={ArriveRider}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        }
      </View>
      <Modal visible={loading} transparent>
        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.4)' }}>
          <ActivityIndicator
            size={"large"}
            color={Colors.DARK_PURPLE}
          />
        </View>
      </Modal>
      <Snackbar
        onDismiss={() => dispatch(AlertAction.HideAlert())}
        duration={4000}
        visible={showAlert}>
        {
          alert?.message
        }
      </Snackbar>
    </SafeAreaView >
  )
};

export default MyStack;


