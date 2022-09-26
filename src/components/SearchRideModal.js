import React, { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { Colors } from '../Styles';
import SubmitButton from './SubmitButton';
import Input from './TextInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TextComponent from './TextComponent';
import { useNavigation } from '@react-navigation/native';
import SearchRide from '../assets/rider/SearchRide.png'
import * as Progress from 'react-native-progress'

const SearchRideModal = props => {

  const navigation = useNavigation()
  return (
    <Modal animationType="fade" transparent={true} visible={props?.visible}>
      <TouchableOpacity
        disabled
        onPress={props?.onPress}
        style={styles.Main_Container}>
        <View style={styles.Sub_Container}>

          <Image
            source={SearchRide}
            style={{ height: 200, width: 200, resizeMode: 'contain', marginTop: 25 }}
          />

          <TextComponent
            text={props?.title}
            style={{ fontWeight: 'bold', fontSize: 17, marginTop: 5 }}
          />

          <Text style={{ textAlign: 'center' }}>{props?.description}</Text>

          <Progress.Bar indeterminate={true} width={150} style={{ marginTop: 10 }} color={Colors.BLUE} />

          <SubmitButton text={'Cancel Ride'} onPress={props?.notvisible} />

        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  Main_Container: {
    flex: 1,
    backgroundColor: Colors.RGBA_BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Sub_Container: {
    backgroundColor: Colors.WHITE,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    paddingBottom: 10,
    bottom: 80,
    position: 'absolute'
  },
  InputView: {
    color: '#000',
    width: '100%',
    marginBottom: 15,
  },
  TextInputHeader: {
    width: '90%',
    paddingLeft: 20,
    fontWeight: 'bold',
    paddingBottom: 5,
    paddingTop: 10,
  },
  direction: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  Next__btn_Touch_one: {
    padding: 5,
    borderRadius: 7,
    width: 120,
    borderWidth: 1,
    borderColor: '#0b0b43',
  },
});

export default SearchRideModal;
