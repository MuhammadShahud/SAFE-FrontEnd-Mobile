import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../Styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Image1 from '../assets/driver/person.png';

const SimpleHeader = props => {
  const navigation = useNavigation();
  return (
    <View style={styles.header__style}>
      {props?.headerLeft ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            alignSelf: 'flex-start',
            left: 10,
            backgroundColor: Colors.WHITE,
            borderRadius: 10,
          }}>
          <MaterialCommunityIcons
            name="chevron-left"
            color={Colors.BLACK}
            size={30}
          />
        </TouchableOpacity>
      ) : null}
      <Text style={props?.textStyle}>{props?.title}</Text>
      {props?.headerRight ? (
        <View style={styles.header_Right_style}>
          {props?.isNotificationHide ? null : (
            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}
              style={{right: 15}}>
              <MaterialCommunityIcons
                name="bell"
                color={Colors.ORANGE}
                size={25}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate('ContractorProfile')}>
            <Image source={Image1} style={styles.User_Image_style} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default SimpleHeader;

const styles = StyleSheet.create({
  header_style: {
    height: 60,
    justifyContent: 'center',
    padding: 10,
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
