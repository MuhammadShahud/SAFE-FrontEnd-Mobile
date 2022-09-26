import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '../Styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

export const Input = props => {
  const [Hide, setHide] = useState(props?.secure);

  return (
    <View
      style={{
        backgroundColor: 'rgba(236, 240, 241,1.0)',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        alignSelf: 'center',
        marginVertical: 5,
        paddingHorizontal: 5,
      }}>
      <Ionicons name={props?.icon} color="rgba(218, 223, 225,0.9)" size={30} />
      <TextInput
        editable={props?.editable}
        value={props?.value}
        placeholder={props?.placeholder}
        placeholderTextColor={props?.placeholderTextColor}
        onChangeText={props?.onChangeText}
        style={[style.input, { height: props?.height, textAlignVertical: props?.multiLine ? 'top' : 'center' }]}
        keyboardType={props?.keyboardType ? props?.keyboardType : 'default'}
        secureTextEntry={Hide}
        maxLength={props?.length}
        multiline={props?.multiLine ? props?.multiLine : false}
        onKeyPress={props?.onKeyPress}
      />
      {/* <Ionicons name={props?.icon1} color="rgba(218, 223, 225,0.9)" size={30} /> */}
      {props?.eye ? (
        <TouchableOpacity
          onPress={() => setHide(!Hide)}
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
            right: 30,
            top: 16,
          }}>
          {Hide ? (
            <Feather
              name="eye-off"
              color={Colors.BLACK}
              size={20}
            />
          ) : (
            <Feather name="eye" color={Colors.BLACK} size={20} />
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const style = StyleSheet.create({
  input: {
    color: Colors.BLACK,
    flex: 1,
    minHeight:50
  },
});

export default Input;
