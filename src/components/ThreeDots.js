import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import Dot from '../assets/driver/dot2.png';

const ThreeDots = () => {
  return (
    <View style={styles.dotss}>
      <Image style={{height: 8, width: 8, marginVertical: 2}} source={Dot} />
      <Image style={{height: 8, width: 8, marginVertical: 2}} source={Dot} />
      <Image style={{height: 8, width: 8, marginVertical: 2}} source={Dot} />
    </View>
  );
};

export default ThreeDots;

const styles = StyleSheet.create({
  dotss: {
    width: '70%',
    alignSelf: 'center',
  },
});
