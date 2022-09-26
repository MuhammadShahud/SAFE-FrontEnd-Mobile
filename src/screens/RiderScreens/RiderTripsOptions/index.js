import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors} from '../../../Styles';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import {useNavigation} from '@react-navigation/native';
import SheduledRide from './SheduledRide';
import Past from './Past';
import UpComing from './UpComing';
import Cancelled from './Cancelled';

const RiderTripsOption = () => {
  const navigation = useNavigation();
  const [SelectedIndex, setSelectedIndex] = useState(0);
  const [SelectedItem, setSelectedItem] = useState('Schedule Ride');
  const [hideNotification, sethideNotification] = useState(false);
  const [HeaderList, setHeaderList] = useState([
    'Schedule Ride',
    'Upcoming',
    'Past',
    'Cancelled',
  ]);

  const getComponent = name => {
    switch (name) {
      case 'Schedule Ride':
        return <SheduledRide />;
      case 'Upcoming':
        return <UpComing />;
      case 'Past':
        return <Past />;
      case 'Cancelled':
        return <Cancelled />;
      default:
        break;
    }
  };

  return (
    <View style={styles.Main_Container}>
      <Header
        headerRight={true}
        headerLeft={true}
        title={SelectedItem}
        isNotificationHide={true}
        //   isNotificationHide={hideNotification}
      />
      <SubHeader
        onPress={(item, ind) => {
          if (item == 'Past') {
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

export default RiderTripsOption;
