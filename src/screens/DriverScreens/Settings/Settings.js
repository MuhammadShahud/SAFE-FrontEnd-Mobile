import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import SimpleHeader from '../../../components/SimpleHeader';
import Header from '../../../components/Header';
import React, { useState, useEffect } from 'react';
import { Colors } from '../../../Styles';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { GeneralMiddleware } from '../../../redux/Middlewares/GeneralMiddleware';
import GeneralActions from '../../../redux/Actions/GeneralActions';
import AuthAction from '../../../redux/Actions/AuthActions';

const Settings = () => {

  const dispatch = useDispatch();
  const user = useSelector(state => state.Auth.user);
  const doNotify = useSelector(state => state.General.doNotify);
  const navigation = useNavigation();
  const [userRole, setuserRole] = useState(user?.user.role);
  const toggleSwitch = async () => {
    dispatch(GeneralActions.SetNotify(!doNotify))
    await AsyncStorage.setItem('@notify', JSON.stringify(!doNotify))

  }

  useEffect(() => {
    dispatch(GeneralMiddleware.getContent());
    dispatch(GeneralMiddleware.getContentPayment());
  }, [])

  const logout = async () => {
    await AsyncStorage.clear()
    dispatch(AuthAction.Logout(true))
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <Header title={'Settings'} headerRight={true} headerLeft={true} />
        <View style={styles.Before_After_Main_View_Style}>
          <TouchableOpacity
            onPress={() => {
              userRole == 'driver'
                ? navigation.navigate('driverBookingNotification')
                : navigation.navigate('RiderNotification');
            }}
            style={styles.direction}>
            <View style={styles.touch}>
              <Text style={styles.text__style}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: Colors.BLUE }}
              thumbColor={doNotify ? Colors.WHITE : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={doNotify}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              userRole == 'driver'
                ? navigation.navigate('DriverDashBoard')
                : navigation.navigate('RiderDashBoard');
            }}
            style={styles.direction}>
            <View style={styles.touch}>
              <Text style={styles.text__style}>Home</Text>
            </View>
            <Feather
              style={styles.touch}
              name="chevron-right"
              color={Colors.LIGHT_GRAY}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              userRole == 'driver'
                ? navigation.navigate('Profile')
                : navigation.navigate('RiderProfileView');
            }}
            style={styles.direction}>
            <View style={styles.touch}>
              <Text style={styles.text__style}>Profile</Text>
            </View>
            <Feather
              style={styles.touch}
              name="chevron-right"
              color={Colors.LIGHT_GRAY}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('CommunityGuide')}
            style={styles.direction}>
            <View style={styles.touch}>
              <Text style={styles.text__style}>Community Group</Text>
            </View>
            <Feather
              style={styles.touch}
              name="chevron-right"
              color={Colors.LIGHT_GRAY}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              userRole == 'driver'
                ? navigation.navigate('TripsNotification')
                : navigation.navigate('RiderTripsOption');
            }}
            style={styles.direction}>
            <View style={styles.touch}>
              <Text style={styles.text__style}>My trips</Text>
            </View>
            <Feather
              style={styles.touch}
              name="chevron-right"
              color={Colors.LIGHT_GRAY}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              userRole == 'driver'
                ? navigation.navigate('PaymentHistory')
                : navigation.navigate('RiderPaymentHistory');
            }}
            style={styles.direction}>
            <View style={styles.touch}>
              <Text style={styles.text__style}>Payment</Text>
            </View>
            <Feather
              style={styles.touch}
              name="chevron-right"
              color={Colors.LIGHT_GRAY}
              size={30}
            />
          </TouchableOpacity>
          {userRole == 'driver' ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('Ratings')}
              style={styles.direction}>
              <View style={styles.touch}>
                <Text style={styles.text__style}>Rating and Reviews</Text>
              </View>
              <Feather
                style={styles.touch}
                name="chevron-right"
                color={Colors.LIGHT_GRAY}
                size={30}
              />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              userRole == 'driver'
                ? navigation.navigate('Contactus')
                : navigation.navigate('ContactusRequest');
            }}
            style={styles.direction}>
            <View style={styles.touch}>
              <Text style={styles.text__style}>Contact us</Text>
            </View>
            <Feather
              style={styles.touch}
              name="chevron-right"
              color={Colors.LIGHT_GRAY}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Help')}
            style={styles.direction}>
            <View style={styles.touch}>
              <Text style={styles.text__style}>Help</Text>
            </View>
            <Feather
              style={styles.touch}
              name="chevron-right"
              color={Colors.LIGHT_GRAY}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('InviteFriends')}
            style={styles.direction}>
            <View style={styles.touch}>
              <Text style={styles.text__style}>Invite Friends</Text>
            </View>
            <Feather
              style={styles.touch}
              name="chevron-right"
              color={Colors.LIGHT_GRAY}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('PrivacyPolicy')}
            style={styles.direction}>
            <View style={styles.touch}>
              <Text style={styles.text__style}>Privacy Policy</Text>
            </View>
            <Feather
              style={styles.touch}
              name="chevron-right"
              color={Colors.LIGHT_GRAY}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('TermsAndCondtions')}
            style={styles.direction}>
            <View style={styles.touch}>
              <Text style={styles.text__style}>Terms and conditions</Text>
            </View>
            <Feather
              style={styles.touch}
              name="chevron-right"
              color={Colors.LIGHT_GRAY}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => logout()}
            style={styles.direction}>
            <View style={styles.touch}>
              <Text style={styles.text__style}>Logout</Text>
            </View>
            <Feather
              style={styles.touch}
              name="chevron-right"
              color={Colors.LIGHT_GRAY}
              size={30}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  Before_After_Main_View_Style: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 10,
  },
  text__style: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.BLACK,
  },
  touch: {
    marginVertical: 2,
    padding: 10,
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
