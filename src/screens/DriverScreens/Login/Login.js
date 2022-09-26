import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import React, { useState, useEffect } from 'react';
import SignupImage from '../../../assets/driver/Signup.png';
import Logo from '../../../assets/driver/logo.png';
import { Colors } from '../../../Styles';
import TextInput from '../../../components/TextInput';
import SubmitButton from '../../../components/SubmitButton';
import Google from '../../../assets/driver/google.png';
import Facebook from '../../../assets/driver/facebook.png';
import ForgetPasswordModal from '../../../components/ForgetPasswordModal';
import VerificationCodeModal from '../../../components/VerificationCodeModal';
import EnterNewPassword from '../../../components/EnterNewPassword';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import SplashScreen from 'react-native-splash-screen';
import TextComponent from '../../../components/TextComponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { AuthMiddleware } from '../../../redux/Middlewares/AuthMiddleware';
import AlertAction from '../../../redux/Actions/AlertActions';
import messaging from '@react-native-firebase/messaging';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Settings } from 'react-native-fbsdk-next';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';


Settings.setAppID('831027081223433');

const Login = () => {

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [ForgetModalVisible, setForgetModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [VerificationModalVisible, setVerificationModalVisible] = useState(false);
  const navigation = useNavigation();
  const [userRole, setuserRole] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [check, setCheck] = useState(false);
  const userRoleList = ['Driver', 'Rider'];
  const dispatch = useDispatch();

  const onSetUserRole = async val => {
    try {
      setuserRole(val);
    } catch (e) {
      // saving error
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '',
    });
  }, [])

  const onPressLogin = async () => {
    try {
      messaging().requestPermission()
      messaging().registerDeviceForRemoteMessages();
      console.warn(messaging().isAutoInitEnabled, messaging().isDeviceRegisteredForRemoteMessages)
      let token = await messaging().getToken();
      if (!email || !password) {
        alert("Please enter your email & password")
        return;
      }
      dispatch(AuthMiddleware.Login({
        email,
        password,
        userRole,
        token
      }
      ))
      await AsyncStorage.setItem('@notify', "true")
      console.warn(token)
    } catch (error) {
      console.warn(error)
    }




    // if (userRole == 'Driver') {
    //   navigation.navigate('AcceptAJob');
    // } else if (userRole == 'Rider') {
    //   navigation.navigate('RiderSkipScreens');
    // }else {
    //   Alert.alert('Note',"Select User Role")
    // }
  };

  const onSocialLogin = async ({ email, username }) => {
    let token = await messaging().getToken();
    dispatch(AuthMiddleware.SocialLogin({
      email,
      username,
      token
    }
    ))
  };

  const googleSignin = async () => {
    GoogleSignin.signIn().then((user) => {
      if (user.user.email)
        onSocialLogin({ email: user.user.email, username: user.user.name });
    }).catch((reason) => {
      console.warn(reason);
    })

  }
  const facebookLogin = async () => {
    let token = await messaging().getToken();
    dispatch(AuthMiddleware.facebookLogin())
      .then((data) => {
        dispatch(AuthMiddleware.SocialLogin({
          email: data.email,
          username: data.name,
          token
        }
        ))
      })
      .catch()
  }

  const appleSignin = async () => {
    let token = await messaging().getToken();
    if (!appleAuth.isSupported) {
      alert("Device is not supported for apple signin")
      return
    }
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    const { email, fullname } = jwt_decode(appleAuthRequestResponse.identityToken)
    // this.props.navigation.navigate("SignUp", { user: { email, name: fullname } })
    let name = fullname ? fullname : appleAuthRequestResponse.fullName.givenName + " " + appleAuthRequestResponse.fullName.familyName
    dispatch(AuthMiddleware.SocialLogin({
      email: email,
      username: name,
      token
    }
    ))
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={{ backgroundColor: Colors.WHITE }}>
        <View style={styles.SignupImage__View}>
          <ImageBackground style={styles.SignupImage} source={SignupImage}>
            <View style={styles.Logo_View}>
              <Image style={styles.Logo__Image} source={Logo} />
            </View>
          </ImageBackground>
        </View>

        <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: Colors.WHITE, bottom: 20 }}>
          <Text style={styles.SignUp__Heading}>Login</Text>
          <Text
            style={{
              fontSize: 15,
              color: Colors.DARK_PURPLE,
              marginBottom: 20,
              width: '80%',
              alignSelf: 'center',
              textAlign: 'center'
            }}>
            Login to your existing account by entering your email and password
          </Text>
        </View>
        <Text style={styles.InputUpper_text}>Email</Text>
        <View style={{ flex: 1 }}>
          <TextInput
            value={email}
            placeholder={'johnDoe@safe.com'}
            placeholderTextColor={Colors.GRAY}
            onChangeText={val => setEmail(val)}
            icon="mail"
          />
        </View>
        <View style={{ marginTop: 10 }}>

          <Text style={styles.InputUpper_text}>Password</Text>
          <View style={{ flex: 1 }}>
            <TextInput
              value={password}
              placeholder={'*********'}
              placeholderTextColor={Colors.GRAY}
              onChangeText={val => setPassword(val)}
              icon="lock-closed"
              eye={true}
              secure={true}
            />
          </View>
        </View>
        {/* <View style={{ width: '90%', alignSelf: 'center' }}>
          <TextComponent
            text={'Select user role'}
            style={styles.InputUpper_text}
          />
          <SelectDropdown
            data={userRoleList}
            onSelect={(selectedItem, index) => {
              onSetUserRole(selectedItem);
            }}
            // defaultValue={'Select User Role'}
            defaultButtonText={'Select User Role'}
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
        </View> */}


        <View style={styles.direction}>
          {/* <TouchableOpacity style={styles.check__touch}>
            <View>
              <Checkbox
                status={check ? 'checked' : 'unchecked'}
                uncheckedColor="gray"
                color={Colors.BLUE}
                onPress={() => setCheck(!check)}
              />
            </View>
            <Text style={styles.underline__two}>Remember me</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => setForgetModalVisible(true)}>
            <Text style={styles.underline}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <SubmitButton
          onPress={onPressLogin}
          text={'LOGIN'}
          icon={true}
          iconname={'login-variant'}
        />
        <View>
          <Text style={styles.Connect__with__text}>OR Connect with</Text>
        </View>
        <View style={styles.fb__google_View}>
          <TouchableOpacity onPress={facebookLogin}>
            <Image style={styles.fb_gl} source={Facebook} />
          </TouchableOpacity>
          <TouchableOpacity onPress={googleSignin}>
            <Image style={styles.fb_gl} source={Google} />
          </TouchableOpacity>
          {
            Platform.OS == "ios" ?
              <TouchableOpacity
                style={{ marginStart: 3, justifyContent: "center", alignItems: 'center', height: 55, alignSelf: 'center', backgroundColor: "#fff", borderRadius: 10, borderWidth: 1.5, borderColor: "#ddd" }} onPress={appleSignin}>
                <Image style={{ width: 60, height: 35, resizeMode: "contain" }} source={require("../../../assets/driver/Apple-logo.png")} />
              </TouchableOpacity>
              : null
          }
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text style={{ textAlign: 'center', marginTop: 10 }}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('DriverSignup')}
            style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView >
      <ForgetPasswordModal
        title={'Forget Password ?'}
        description={'Enter Registered Email Address To \n Reset Password'}
        onPress={(emaill) => {
          dispatch(AuthMiddleware.ForgotPassword({
            email: emaill,
            callback: (user) => {
              setVerificationEmail(emaill)
              setVerificationCode(user.confirmation_code)
              setForgetModalVisible(false);
              setVerificationModalVisible(true);
            }
          }))

        }}
        visible={ForgetModalVisible}
        notvisible={() => setForgetModalVisible(false)}
      />
      <VerificationCodeModal
        title={'Verification Code'}
        description={
          'Please enter verification code sent \n on your registered email address'
        }
        onPress={(code) => {
          if (code == verificationCode) {
            setVerificationModalVisible(false);
            setNewPassword(true);
          }
          else {
            dispatch(AlertAction.ShowAlert({
              title: "Warning",
              message: "Verfication code is incorrect"
            }))
          }
          // navigation.navigate('ChangePassword')
        }}
        visible={VerificationModalVisible}
        notvisible={() => setVerificationModalVisible(false)}
      />
      <EnterNewPassword
        title={'Change Password'}
        description={'Reset your password'}
        onPress={(password, c_password) => {
          if (password != c_password)
            dispatch(AlertAction.ShowAlert({
              title: "Warning",
              message: "Password not match"
            }))
          else {
            dispatch(AuthMiddleware.ResetPassword({
              password,
              email: verificationEmail
            }))
            setNewPassword(false);
          }
        }}
        visible={newPassword}
        notvisible={() => setNewPassword(false)}
      />
    </View >
  );
};


export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
  SignupImage: {
    width: '100%',
    height: 280,
    backgroundColor: 'rgba(165, 55, 250,1)',
  },
  Logo__Image: {
    height: 110,
    width: 110,
  },
  Logo_View: {
    alignItems: 'center',
    marginVertical: 20,
  },
  Two__inputs: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
  },
  InputUpper_text: {
    fontWeight: 'bold',
    width: '90%',
    alignSelf: 'center',
    color: '#000',
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 25
  },
  underline: {
    textDecorationLine: 'underline',
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
  check__touch: {
    flexDirection: 'row',
  },
  underline__two: {
    marginTop: 8,
    textDecorationLine: 'underline',
  },
});

