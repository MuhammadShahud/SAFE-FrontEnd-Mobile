import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Colors } from '../Styles';
import Attachment from '../assets/driver/Attachment.png';
import Sent from '../assets/driver/Sent.png';

const ChatTextInput = (props) => {

  return (
    <View style={style.Main_Container}>
      <View style={style.TextInput_Container}>
        <TextInput
          value={props?.value}
          placeholder="Type here..."
          placeholderTextColor={Colors.BLACK_2}
          onChangeText={text => props?.onChangeText ? props?.onChangeText(text) : undefined}
          style={style.TextInput_Style}
        />

        <TouchableOpacity style={{ right: 10 }} onPress={props?.onPressAttachment}>
          <Image source={Attachment} style={style.Image_Style} />
        </TouchableOpacity>
      </View>
      {!props?.isMessage ?
        <TouchableOpacity onPress={props?.onPressSendMessage} disabled={props?.isMessage}>
          <Image source={Sent} style={style.Image_Style} />
        </TouchableOpacity>
        : <ActivityIndicator size={'large'} color={Colors.BLACK} />}
    </View>
  );
};

const style = StyleSheet.create({
  Main_Container: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  TextInput_Container: {
    backgroundColor: Colors.CHATINPUT_GRAY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    width: '85%',
  },
  TextInput_Style: {
    paddingHorizontal: 20,
    width: '85%',
    minHeight: 50,
    color: Colors.BLACK_2,
  },
  Image_Style: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
});

export default ChatTextInput;
