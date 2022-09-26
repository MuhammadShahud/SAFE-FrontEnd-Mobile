import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Colors} from '../Styles';

const TextButton = props => {
  return (
    <TouchableOpacity onPress={props?.onPress}>
      <Text style={[props?.style, {color: Colors.BLACK}]}>{props?.text}</Text>
    </TouchableOpacity>
  );
};

export default TextButton;

const styles = StyleSheet.create({});
