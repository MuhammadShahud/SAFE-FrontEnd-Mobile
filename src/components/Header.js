import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../Styles';
import TextComponent from './TextComponent';
import Person1 from '../assets/driver/person1.png';
import Image1 from '../assets/driver/person.png';
import person3 from '../assets/rider/person.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux'
import { img_url } from '../configs/APIs';

const Header = props => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.Auth.user)

  return (
    <View style={style.header_style}>
      {props?.headerLeft ? (
        <TouchableOpacity
          onPress={props?.onPressLeft ? props?.onPressLeft : () => {

            props?.drawer
              ? navigation.navigate('Settings')
              : navigation.goBack();
          }}
          style={{
            alignSelf: 'flex-start',
            left: 10,
            backgroundColor: Colors.WHITE,
            borderRadius: 10,
            elevation: props?.drawer ? 0 : 2,
          }}>
          <MaterialCommunityIcons
            name={props?.drawer ? 'menu' : 'chevron-left'}
            color={Colors.BLUE}
            size={30}
          />
        </TouchableOpacity>
      ) : null}

      {props?.fontWhite ? (
        <Text style={[style.Header_Title_Style, { color: Colors.WHITE }]}>
          {props?.title}
        </Text>
      ) : (
        <Text style={[style.Header_Title_Style, { color: Colors.BLUE }]}>
          {props?.title}
        </Text>
      )}

      {props?.headerRight ? (
        <View style={style.header_Right_style}>
          {props?.isNotificationHide ? null : (
            <TouchableOpacity
              onPress={() => {
                user?.user.role == 'driver' ? navigation.navigate('DriverBookingNotification') : navigation.navigate('RiderNotification')
              }}
              style={{ right: 15 }}>
              <MaterialCommunityIcons
                name="bell-outline"
                color={Colors.BLUE}
                size={25}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => {
            user?.user.role == 'driver' ? navigation.navigate('Profile') : navigation.navigate('RiderProfileView')
          }}>
            {
              <Image source={user?.user?.image ? { uri: img_url + user?.user?.image } : person3} style={style.User_Image_style} />
            }

          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const style = StyleSheet.create({
  header_style: {
    height: 60,
    justifyContent: 'center',
  },
  Header_Title_Style: {
    fontWeight: 'bold',
    fontSize: 22,
    position: 'absolute',
    alignSelf: 'center',
  },
  header_Right_style: {
    height: 60,
    position: 'absolute',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  User_Image_style: {
    height: 30,
    width: 30,
    borderRadius: 15,
    resizeMode: 'contain',
    right: 10,
  },
});

export default Header;
