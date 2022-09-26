import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import React, { useEffect } from 'react';
import Header from '../../../components/Header';
import TextComponent from '../../../components/TextComponent';
import { Colors } from '../../../Styles';
import Finger from '../../../assets/driver/finger.png';
import SubmitButton from '../../../components/SubmitButton';
import Dot1 from '../../../assets/driver/dot1.png';
import Curve from '../../../assets/driver/background.png';
import { useNavigation } from '@react-navigation/native';
import ReactNativeBiometrics from 'react-native-biometrics'

const FingerPrint = () => {
  const navigation = useNavigation();

  useEffect(() => {
    SetFaceIdFingerprint();
  }, [])

  const SetFaceIdFingerprint = async () => {
    let sensor = await ReactNativeBiometrics.isSensorAvailable();
    if (sensor.available == true) {
      console.warn(sensor.available)
      let keys = await ReactNativeBiometrics.biometricKeysExist();
      if (!keys.keysExist)
        (await ReactNativeBiometrics.createKeys()).publicKey

      let signature = await ReactNativeBiometrics.createSignature({
        payload: "Set Face/Fingerprint",
        promptMessage: "Set Face/Fingerprint signin for drytime",
      });
      if (signature)
        navigation.navigate("Login")
      // AsyncStorage.setItem("@DT-publicKey", signature);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <ScrollView>
        <Image
          resizeMode="cover"
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          source={Curve}
        />
        <Header title={'Complete Profile'} headerLeft={true} fontWhite={true} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.Heading}>{Platform.OS == "android" ? "Finger Prints Verification" : "Face ID Verification"}</Text>
          <View style={styles.Before_After_Main_View_Style}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image style={styles.Finger__Image} source={Finger} />
            </View>
          </View>
          <View style={{ width: '90%', alignSelf: 'center' }}>
            <TextComponent
              style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}
              text={Platform.OS == "android" ?
                'Please keep your finger on sensor for Finger Prints verification'
                :
                'Please keep your face straight for Face ID verification'
              }
            />
          </View>
          <SubmitButton
            onPress={() => navigation.navigate('Login')}
            text={'Save'}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Image style={[styles.dot, { marginHorizontal: 10 }]} source={Dot1} />
            <Image style={styles.dot} source={Dot1} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FingerPrint;

const styles = StyleSheet.create({
  Before_After_Main_View_Style: {
    width: '90%',
    height: 280,
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 10,
  },
  Finger__Image: {
    width: 200,
    height: 270,
  },
  Heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 160,
  },
  Heading__two: {
    fontSize: 18,
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
  dot: {
    width: 15,
    height: 15,
  },
});
