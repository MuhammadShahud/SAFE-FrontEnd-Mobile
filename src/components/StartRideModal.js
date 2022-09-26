import React, {useState} from 'react';
import {View, Modal, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Colors} from '../Styles';
import SubmitButton from './SubmitButton';
import Input from './TextInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TextComponent from './TextComponent';
import { useNavigation } from '@react-navigation/native';

const StartRideModal = props => {

  const navigation = useNavigation()
  return (
    <Modal animationType="fade" transparent={true} visible={props?.visible}>
      <View style={styles.Main_Container}>
        <View style={styles.Sub_Container}>
          
          <TouchableOpacity
            onPress={props?.notvisible}
            style={{alignSelf: 'flex-end', right: 20, top: 20}}>
            <MaterialCommunityIcons
              name="close-thick"
              color={Colors.BLUE}
              size={20}
            />
          </TouchableOpacity>

          {props?.title ? <TextComponent
          text={props?.title}
          style={{textAlign: 'center', paddingTop: 20, fontWeight: 'bold', fontSize: 18}}
          /> : null}

          {
          props?.title ? <TextComponent
          text={props?.description}
          style={{textAlign: 'center', paddingBottom : 20 , fontWeight: 'bold', fontSize: 15}}
          />
          : 
          <TextComponent
          text={props?.description}
          style={{textAlign: 'center', paddingVertical: 25 , fontWeight: 'bold', fontSize: 15}}
          />
          }
          
          <View style={styles.direction}>
            <TouchableOpacity
            onPress={props?.onPressbuttonOne}
             style={[styles.Next__btn_Touch_one, {backgroundColor: Colors.BLUE}]}>
              <Text style={{color: Colors.WHITE_2, textAlign: 'center', fontWeight: 'bold'}}>{props?.buttonOneText}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={props?.onPressbuttonTwo}
            style={styles.Next__btn_Touch_one}>
              <Text style={{color: Colors.BLUE, textAlign: 'center', fontWeight: 'bold'}}>{props?.buttonTwoText}</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
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
    paddingBottom: 20,
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

export default StartRideModal;
