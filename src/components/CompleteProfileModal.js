import React, { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors } from '../Styles';
import SubmitButton from './SubmitButton';
import Input from './TextInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TextComponent from './TextComponent';
import { useNavigation } from '@react-navigation/native';

const CompleteProfileModal = props => {
  const navigation = useNavigation();
  return (
    <Modal animationType="fade" transparent={true} visible={props?.visible}>
      <View style={styles.Main_Container}>
        <View style={styles.Sub_Container}>
          <TouchableOpacity
            onPress={props?.notvisible}
            style={{ alignSelf: 'flex-end', right: 20, top: 20 }}>
            <MaterialCommunityIcons
              name="close-thick"
              color={Colors.BLUE}
              size={20}
            />
          </TouchableOpacity>

          <TextComponent
            text={props?.description}
            style={styles.Description_Style}
          />

          <TouchableOpacity
            onPress={props?.onPressComplete}
            style={styles.Button_Style}>
            <Text style={styles.Button_Style_Text}>{props?.btnTitle ? props?.btnTitle : "Complete Profile"}</Text>
            <MaterialCommunityIcons
              name="check-circle"
              color={Colors.WHITE_2}
              size={25}
            />
          </TouchableOpacity>
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
    position: 'absolute',
  },
  Description_Style: {
    textAlign: 'center',
    paddingVertical: 25,
    fontWeight: 'bold',
    fontSize: 20,
  },
  Button_Style: {
    backgroundColor: Colors.BLUE,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  Button_Style_Text: {
    color: Colors.WHITE_2,
    paddingHorizontal: 5,
    fontWeight: 'bold',
  },
});

export default CompleteProfileModal;
