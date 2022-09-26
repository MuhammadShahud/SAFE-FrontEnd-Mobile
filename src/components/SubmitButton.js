import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {Colors} from '../Styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const SubmitButton = props => {
  return (
    <TouchableOpacity
      onPress={props?.onPress}
      style={[
        style.SubmitButton_Container,
        {marginTop: props?.colorChange ? null : 15},
      ]}>
      <View
        style={[
          style.button,
          {
            backgroundColor: props?.colorChange ? Colors.RED : '#0b0b43', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
          },
        ]}>
        <Text style={style.SubmitButton_Text}>{props?.text}</Text>

        { props?.icon ? <MaterialCommunityIcons name={props?.iconname} color={Colors.WHITE_2} size={25} style={{marginLeft: 5}}/> : null}

      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  SubmitButton_Container: {
    width: '100%',
    marginBottom: 15,
  },
  SubmitButton_Text: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
    color: Colors.WHITE_2,
  },
  button: {
    width: '90%',
    paddingVertical: 18,
    alignSelf: 'center',
    borderRadius: 12,
  },
});

export default SubmitButton;
