import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import SignupImage from '../../../assets/driver/Signup.png';
import Logo from '../../../assets/driver/logo.png';
import { Colors } from '../../../Styles';
import TextInput from '../../../components/TextInput';
import SubmitButton from '../../../components/SubmitButton';
import TextComponent from '../../../components/TextComponent';
import Google from '../../../assets/driver/google.png';
import Facebook from '../../../assets/driver/facebook.png';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthMiddleware } from '../../../redux/Middlewares/AuthMiddleware';
import { useDispatch } from 'react-redux';
import AuthAction from '../../../redux/Actions/AuthActions';
import AlertAction from '../../../redux/Actions/AlertActions';
import messaging from '@react-native-firebase/messaging';


const DriverSignup = () => {

  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const [userRole, setuserRole] = useState('Driver');
  const userRoleList = ['Driver', 'Rider'];
  const [Status, setStatus] = useState('');
  const StatusList = ['Male', 'Female', 'Other'];
  const dispatch = useDispatch();

  // const [selectedItem, setSelectedItem] = useState('');

  const onSetUserRole = async val => {
    try {
      setuserRole(val);
      await AsyncStorage.setItem('User_Role', val);
    } catch (e) {
      // saving error
    }
  };

  const onPressSignUp = async () => {
    let token = await messaging().getToken();

    if (!firstname || !lastname || !email || !password || !address || !phonenumber || !userRole || !Status) {
      alert("Please fill all fields")
      return;
    }
    if (password != confirmpassword) {
      alert("Password not match")
      return;
    }
    dispatch(AuthMiddleware.SignUp({
      firstname,
      lastname,
      email,
      password,
      address,
      phone: phonenumber,
      userRole,
      gender: Status,
      token,
      onSuccess: (data) => {
        if (userRole == 'Rider') {
          dispatch(AlertAction.ShowAlert({ title: "", message: "Signed up successfully." }));
          // dispatch(AuthAction.Login(data))
          navigation.navigate('Login');
        } else if (userRole == 'Driver') {
          dispatch(AlertAction.ShowAlert({ title: "", message: "Signed up successfully" }));
          navigation.navigate('SignupCompleteProfile', { userRole });
        }
      }
    }
    ))
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView style={{ backgroundColor: Colors.WHITE }}>
          <View style={styles.SignupImage__View}>
            <ImageBackground style={styles.SignupImage} source={SignupImage}>
              <View style={styles.Logo_View}>
                <Image style={styles.Logo__Image} source={Logo} />
              </View>
            </ImageBackground>
          </View>

          <View style={styles.Signup__Content}>

            <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: Colors.WHITE, bottom: 20 }}>
              <View style={{ width: "90%", alignSelf: 'center' }}>
                <Text style={styles.SignUp__Heading}>Sign Up</Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 15,
                    color: Colors.DARK_PURPLE,
                    marginBottom: 20,
                  }}>
                  Signup to create your personal account
                </Text>
              </View>
              <View style={[styles.Two__inputs, { width: '95%', alignSelf: 'center' }]}>
                <View style={{ flex: 1 }}>
                  <TextComponent
                    style={styles.InputUpper_text}
                    text={'First Name'}
                  />

                  <TextInput
                    value={firstname}
                    onChangeText={val => setFirstName(val)}
                    placeholder={'Steve'}
                    placeholderTextColor={Colors.GRAY}
                    icon={'person'}
                  />
                </View>


                <View style={{ flex: 1 }}>
                  <TextComponent
                    text={'Last Name'}
                    style={styles.InputUpper_text}
                  />

                  <TextInput
                    value={lastname}
                    onChangeText={val => setLastName(val)}
                    placeholder={'Smith'}
                    placeholderTextColor={Colors.GRAY}
                    icon={'person'}
                  />
                </View>

              </View>
              <View style={{ flex: 1, marginTop: 10 }}>
                <TextComponent
                  text={'Email'}
                  style={styles.InputUpper_text}
                />

                <TextInput
                  value={email}
                  onChangeText={val => setEmail(val)}
                  placeholder={'johnDoe@safe.com'}
                  placeholderTextColor={Colors.GRAY}
                  icon={'mail'}
                />
              </View>
              <View style={{ flex: 1, marginTop: 10 }}>
                <TextComponent
                  text={'Phone Number'}
                  style={styles.InputUpper_text}
                />

                <TextInput
                  value={phonenumber}
                  onChangeText={val => setPhoneNumber(val)}
                  placeholder={'+123 456789'}
                  placeholderTextColor={Colors.GRAY}
                  keyboardType="phone-pad"
                  icon={'phone-portrait-outline'}
                />
              </View>
              <View style={{ flex: 1, marginTop: 10 }}>
                <TextComponent
                  text={'Address'}
                  style={styles.InputUpper_text}
                />

                <TextInput
                  value={address}
                  onChangeText={val => setAddress(val)}
                  placeholder={'123 Building, XYZ Road, NY'}
                  placeholderTextColor={Colors.GRAY}
                  icon={'md-locate-sharp'}
                />
              </View>

              <View style={{ flex: 1, marginTop: 10 }}>
                <TextComponent
                  text={'Gender'}
                  style={styles.InputUpper_text}
                />

                <SelectDropdown
                  data={StatusList}
                  onSelect={(selectedItem, index) => {
                    setStatus(selectedItem);
                    console.log(selectedItem, index);
                  }}
                  defaultButtonText={'Select Gender'}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  buttonStyle={{
                    backgroundColor: 'rgba(236, 240, 241,1.0)',
                    borderColor: Colors.BLUE,
                    borderRadius: 10,
                    alignSelf: 'center',
                    marginBottom: 5,
                    width: '90%',
                    height: 45,
                  }}
                  renderDropdownIcon={() => {
                    return (
                      <View>
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          color={Colors.BLUE}
                          size={25}
                        />
                      </View>
                    );
                  }}
                />
              </View>

              <View style={{ flex: 1, marginTop: 10 }}>
                <TextComponent
                  text={'Password'}
                  style={styles.InputUpper_text}
                />

                <TextInput
                  value={password}
                  onChangeText={val => setPassword(val)}
                  placeholder={'*************'}
                  placeholderTextColor={Colors.GRAY}
                  icon={'lock-closed'}
                  icon1={'eye'}
                  eye={true}
                  secure={true}
                />
              </View>

              <View style={{ flex: 1, marginTop: 10 }}>
                <TextComponent
                  text={'Confirm Password'}
                  style={styles.InputUpper_text}
                />

                <TextInput
                  value={confirmpassword}
                  onChangeText={val => setConfirmPassword(val)}
                  placeholder={'************'}
                  placeholderTextColor={Colors.GRAY}
                  icon={'lock-closed'}
                  icon1={'eye'}
                  eye={true}
                  secure={true}
                />
              </View>

              {/* <TouchableOpacity
                    onPress={() => navigation.navigate('PaymentByBankAccount')}
                    style={{width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 20}}>
      
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialCommunityIcons
                      name="radiobox-marked"
                      color={Colors.BLUE}
                      size={25}
                    />
      
                    <TextComponent
                    style={{fontWeight: 'bold', marginHorizontal: 10}}
                      text={'Add Bank Account'}
                    />
                    </View>
      
                  <MaterialCommunityIcons
                    name="chevron-right"
                    color={Colors.BLUE}
                    size={25}
                  />
      
                    </TouchableOpacity> */}




              <View style={{ width: '90%', alignSelf: 'center' }}>
                <TextComponent
                  text={'Select user role'}
                  style={styles.InputUpper_text}
                />
                <SelectDropdown
                  data={userRoleList}
                  onSelect={(selectedItem, index) => {
                    setuserRole(selectedItem)
                    onSetUserRole(selectedItem);
                    // setSelectedItem(selectedItem)
                  }}
                  // defaultValue={'Select User Role'}
                  defaultButtonText={userRole ? userRole : 'Select User Role'}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  buttonStyle={{
                    backgroundColor: Colors.WHITE,
                    borderColor: Colors.BLUE,
                    borderWidth: 2,
                    borderRadius: 10,
                    alignSelf: 'center',
                    marginBottom: 5,
                    width: '100%',
                    height: 45,
                  }}
                  renderDropdownIcon={() => {
                    return (
                      <View>
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          color={Colors.BLUE}
                          size={25}
                        />
                      </View>
                    );
                  }}
                />
              </View>

              <SubmitButton
                onPress={onPressSignUp}
                text={'SIGN UP'}
                icon={true}
                iconname={'login-variant'}
              />

              <View>
                <Text style={styles.Connect__with__text}>
                  OR Connect with
                </Text>
              </View>
              <View style={styles.fb__google_View}>
                <Image style={styles.fb_gl} source={Facebook} />
                <Image style={styles.fb_gl} source={Google} />
              </View>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text style={{ textAlign: 'center', marginTop: 10 }}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default DriverSignup;

const styles = StyleSheet.create({
  SignupImage: {
    width: '100%',
    height: 280,
    backgroundColor: 'rgba(165, 55, 250,1)',
  },
  Signup__Content: {
    flex: 1,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  Logo__Image: {
    height: 110,
    width: 110,
  },
  Logo_View: {
    alignItems: 'center',
    marginVertical: 20,
  },
  SignupImage__View: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  SignUp__Heading: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    color: Colors.DARK_PURPLE,
  },
  InputUpper_text: {
    fontWeight: 'bold',
    marginVertical: 1,
    marginLeft: 10,
    width: '90%',
    alignSelf: 'center'
  },
  Two__inputs: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  main__input__twos: {
    height: 40,
    width: 100,
    borderRadius: 20,
  },
  AlignSelf: {
    // width: '90%',
    // alignSelf: 'center',
  },
  Connect__with__text: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fb_gl: {
    width: 60,
    height: 60,
  },
  fb__google_View: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
