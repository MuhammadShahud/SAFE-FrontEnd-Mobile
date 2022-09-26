import { StyleSheet, Text, View, Linking, Platform, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from '../../../Styles';
import Header from '../../../components/Header';
import TextComponent from '../../../components/TextComponent';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TextInput from '../../../components/TextInput';
import SubmitButton from '../../../components/SubmitButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { GeneralMiddleware } from '../../../redux/Middlewares/GeneralMiddleware';

const ContactusRequest = (props) => {


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
  const user = useSelector(state => state.Auth.user);
  const dispatch = useDispatch();
  const StatusList = ['Complaint', 'Feedback'];
  const StatusListRider = ['Query', 'Suggestion', 'Complaint', 'Feedback'];
  const [userRole, setuserRole] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [Status, setStatus] = useState('Complaint');

  const onSubmit = () => {
    const item = props?.route?.params?.item;
    if (!complaintText) {
      alert("Please write mesage to continue");
      return;
    }
    dispatch(GeneralMiddleware.contactUs({
      type: Status,
      message: complaintText,
      ride_id: item?.id
    }))
  }

  return (
    <View style={styles.mainContainer}>
      <Header title={'Contact Us'} headerRight={true} headerLeft={true} />
      <ScrollView>
        <TextComponent style={styles.heading} text={'Request type'} />
        <SelectDropdown
          data={user?.user?.role == 'Driver' ? StatusList : StatusListRider}
          onSelect={(selectedItem, index) => {
            setStatus(selectedItem);
          }}
          defaultValue={'Complaint'}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          buttonStyle={{
            backgroundColor: 'rgba(211,211,211,0.4)',
            borderColor: Colors.BLUE,
            borderRadius: 10,
            alignSelf: 'center',
            marginBottom: 5,
            width: '90%',
            alignSelf: 'center',
            // height: 45,
            marginBottom: 20
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


        <TextComponent
          style={styles.heading}
          text={'Message Box'}
        />
        <View style={styles.Message__box}>
          <TextInput
            height={150}
            multiLine={true}
            placeholder={'Enter Your Message'}
            value={complaintText}
            onChangeText={val => setComplaintText(val)}
          />
        </View>

        <SubmitButton text={'Submit'} onPress={onSubmit} />

        <SubmitButton
          onPress={onPressCall}
          colorChange={true}
          text={'Emergency'}
        />

      </ScrollView>
    </View>
  );
};

export default ContactusRequest;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  wid: {
    width: '80%',
    alignSelf: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 5
  },
  Message__box: {
    backgroundColor: 'rgba(211,211,211,0.4)',
    borderRadius: 10,
    alignSelf: "center",
    paddingHorizontal: 10
  },
  widthee: {
    width: '85%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
  },
  widthee__: {
    width: '85%',
    alignSelf: 'center',
  },
});
