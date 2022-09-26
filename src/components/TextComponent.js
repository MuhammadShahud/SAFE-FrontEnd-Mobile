import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../Styles';

const TextComponent = props => {
  return (
    <Text style={[{ color: Colors.BLACK }, props?.style]} numberOfLines={props?.numberOfLines}>{props?.text}</Text>
  );
};

export default TextComponent;
