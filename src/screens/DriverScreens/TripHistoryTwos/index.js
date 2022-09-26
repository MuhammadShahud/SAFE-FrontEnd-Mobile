import { BackHandler, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from '../../../Styles';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import { useNavigation } from '@react-navigation/native';
import ConfirmedRides from './ConfirmedRides';
import PastRides from './PastRides';

const TripsNotification = () => {
  const navigation = useNavigation();
  const [SelectedIndex, setSelectedIndex] = useState(0);
  const [SelectedItem, setSelectedItem] = useState('Confirmed Rides');
  const [hideNotification, sethideNotification] = useState(false);
  const [HeaderList, setHeaderList] = useState([
    'Confirmed Rides',
    'Past Rides',
  ]);

  const getComponent = name => {
    switch (name) {
      case 'Confirmed Rides':
        return <ConfirmedRides />;
      case 'Past Rides':
        return <PastRides />;
      default:
        break;
    }
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", onBackHandler);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackHandler());
    }
  }, [])

  const onBackHandler = () => {
    navigation.navigate("DriverDashBoard");
    return true;
  }

  return (
    <View style={styles.Main_Container}>
      <Header
        headerRight={true}
        headerLeft={true}
        title={'Trip History'}
        isNotificationHide={true}
      //   isNotificationHide={hideNotification}
      />
      <SubHeader
        onPress={(item, ind) => {
          if (item == 'Past Rides') {
            sethideNotification(true);
          } else {
            sethideNotification(false);
          }
          setSelectedItem(item);
          setSelectedIndex(ind);
        }}
        index={SelectedIndex}
        list={HeaderList}
      />
      {getComponent(SelectedItem)}
    </View>
  );
};

const styles = StyleSheet.create({
  Main_Container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
});

export default TripsNotification;
