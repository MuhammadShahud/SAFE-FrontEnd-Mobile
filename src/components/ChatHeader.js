import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../Styles';
import TextComponent from './TextComponent';
import person from '../assets/driver/person1.png';
import Info from '../assets/driver/info.png';
import Dial from '../assets/driver/dial.png';

const ChatHeader = props => {
  const navigation = useNavigation();

  const onPressCall = () => {
    // console.log('callNumber ----> ', phone);
    let phoneNumber = props?.phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${props?.phone}`;
    } else {
      phoneNumber = `tel:${props?.phone}`;
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

  return (
    <View style={style.header_style}>
      <View style={style.First_View_Style}>
        <TouchableOpacity
          style={{ left: 10 }}
          onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="chevron-left"
            color={Colors.BLACK}
            size={30}
          />
        </TouchableOpacity>

        <View style={style.User_Info_View_Style}>
          <View>
            <Image source={props?.image} style={style.User_Image_Style} />
            <View style={style.Dot_Style} />
          </View>
          <View>
            <TextComponent text={props?.name} style={style.User_Name_Text_Style} />
            <Text style={style.tst}>Thank you for sharing</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={onPressCall}
        style={{ right: 20, flexDirection: 'row' }}>
        <Image style={style.img} source={Dial} />
        {/* <Image style={style.img} source={Info} /> */}
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  header_style: {
    height: 70,
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  First_View_Style: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  User_Info_View_Style: {
    flexDirection: 'row',
    alignItems: 'center',
    left: 30,
  },
  User_Image_Style: {
    height: 45,
    width: 45,
    resizeMode: 'contain',
    borderRadius: 22,
  },
  Dot_Style: {
    backgroundColor: '#00FF00',
    height: 10,
    width: 10,
    borderRadius: 5,
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  User_Name_Text_Style: {
    paddingLeft: 10,
    fontWeight: 'bold',
    fontSize: 17,
    width: '60%',
  },
  tst: {
    fontSize: 12,
    marginLeft: 8,
  },
  img: {
    width: 33,
    height: 33,
  },
});

export default ChatHeader;
