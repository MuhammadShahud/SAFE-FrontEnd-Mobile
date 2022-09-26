import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../../../Styles';
import Header from '../../../components/Header';

const TripHistoryOne = () => {
  return (
    <View style={styles.mainContainer}>
      <Header title={'Trip History'} headerRight={true} headerLeft={true} />
    </View>
  );
};

export default TripHistoryOne;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
});
