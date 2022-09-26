import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../../Styles';
import Header from '../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import TextComponent from '../../../components/TextComponent';
import Notification from '../../DriverScreens/Booking/Notification';

const RiderNotification = () => {
  const navigation = useNavigation();
  const [NotificationList, setNotificationList] = useState([
    {
      id: '1',
      title: 'Ride(Mini)',
      notification: 'Just 2 minutes away Booking has been confirmed',
      time: '3:30 PM',
      status: true,
    },
    {
      id: '2',
      title: 'Payment sent',
      notification:
        'Amount 40.20 $ to ride (SUV) has been confirmed successfully send',
      time: '2:30 PM',
      status: false,
    },
    {
      id: '3',
      title: 'Ride Cancelled',
      notification: 'Rider alex has been cancelled ride',
      time: '1:30 PM',
      status: true,
    },
    {
      id: '4',
      title: 'Ride(Mini)',
      notification: 'Just 2 minutes away Booking has been confirmed',
      time: '3:30 PM',
      status: true,
    },
    {
      id: '5',
      title: 'Payment sent',
      notification:
        'Amount 40.20 $ to ride (SUV) has been confirmed successfully send',
      time: '2:30 PM',
      status: false,
    },
    {
      id: '6',
      title: 'Ride Cancelled',
      notification: 'Rider alex has been cancelled ride',
      time: '1:30 PM',
      status: true,
    },
  ]);

  const renderNotificationList = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: Colors.WHITE,
          marginVertical: 5,
          width: '90%',
          alignSelf: 'center',
          borderRadius: 10,
          elevation: 2,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            backgroundColor: item?.status ? '#00FF00' : Colors.LIGHT_GRAY_1,
            height: 10,
            width: 10,
            borderRadius: 5,
          }}
        />
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <TextComponent
            text={item?.title}
            style={{ fontWeight: 'bold', fontSize: 18 }}
          />
          <Text style={{ color: Colors.GRAY }}>{item?.notification}</Text>
        </View>
        <Text style={{ color: Colors.GRAY }}>{item?.time}</Text>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Header title={'Notifications'} headerRight={true} headerLeft={true} />
      {/* <FlatList
        data={NotificationList}
        keyExtractor={id => id?.id}
        renderItem={renderNotificationList}
      /> */}
      <Notification />
    </View>
  );
};

export default RiderNotification;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
});
