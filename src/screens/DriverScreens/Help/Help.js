import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import React from 'react';
import Header from '../../../components/Header';
import Helps from '../../../assets/driver/help.png';
import SubmitButton from '../../../components/SubmitButton';
import { Colors } from '../../../Styles';
import { useSelector } from 'react-redux';
import TextComponent from '../../../components/TextComponent';

const Help = () => {
  const onPressCall = phone => {
    // console.log('callNumber ----> ', phone);
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    } else {
      phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  };

  const content = useSelector(state => state.General.content)

  return (
    <View style={styles.mainContainer}>
      <Header title={'Help'} headerLeft={true} />
      <ScrollView style={{marginBottom:100}}>
      <View style={styles.img__View}>
        <Image style={styles.img} source={Helps} />
      </View>
      <View style={styles.None_View}>
        {/* <TextComponent
          style={{color: Colors.WHITE}}
          text={
            'All you need to do is fill up the blank spaces and then you will receive an email with your personalized terms and conditions.'
          }
        /> */}
        <TextComponent
          text={content.help}
        />
      </View>
      </ScrollView>
      <View style={styles.Beep}>
        <SubmitButton
          onPress={onPressCall}
          colorChange={Colors.RED}
          text={'Emergency'}
        />
      </View>
    </View>
  );
};

export default Help;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  img__View: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  img: {
    resizeMode: 'contain',
    height: 300,
    width: 300,
  },
  None_View: {
    width: '80%',
    alignSelf: 'center',
  },
  Beep: {
    position: 'absolute',
    bottom: 0,
    width: '90%',
    alignSelf: 'center',
  },
});
