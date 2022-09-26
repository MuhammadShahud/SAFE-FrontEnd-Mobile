import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { Colors } from '../../../Styles';
import TextComponent from '../../../components/TextComponent';
import { useDispatch, useSelector } from 'react-redux';
import { DriverMiddleware } from '../../../redux/Middlewares/DriverMiddleware';
import { APIs } from '../../../configs/APIs';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const PastRides = () => {

  const dispatch = useDispatch();
  const pastRides = useSelector(state => state.Driver.pastRides);
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(DriverMiddleware.getPastRides({
      next_url: APIs.ScheduleRidesDriver
    }))
  }, [])

  const onEndReached = () => {
    if (pastRides?.next_page_url) {
      dispatch(DriverMiddleware.getPastRides({
        next_url: pastRides?.next_page_url
      }))
    }
  }
  return (
    <FlatList
      // onRefresh={this.onRefresh}
      data={pastRides?.data}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      style={{ flex: 1 }}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity onPress={() => navigation.navigate('TripDetail', { item })} style={styles.Before_After_Main_View_Style}>
            <View style={styles.direction__two}>
              <TextComponent style={styles.name} text={item?.rider?.first_name + " " + item?.rider?.last_name} />
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.WaterGreen}>{item.status}</Text>
              </View>
            </View>
            <View style={styles.direction__two}>
              <View>
                <TextComponent
                  style={styles.heading__small}
                  text={item.ride_payment?.payment_method?.type == "bank_account" ? "Account title" : 'Title'}
                />
                <Text style={styles.heading__small__gray}>{item?.ride_payment?.payment_method?.title}</Text>
              </View>
              <View>
                <TextComponent
                  style={styles.heading__small}
                  text={item.ride_payment?.payment_method?.type == "bank_account" ? 'Account Number' : "Card Number"}
                />
                <Text style={styles.heading__small__gray}>
                  {item?.ride_payment?.payment_method?.number}
                </Text>
              </View>
              <View>
                <TextComponent style={styles.heading__small} text={'Date'} />
                <Text style={styles.heading__small__gray}>{moment(item.request_time).format("MM-DD-YYYY hh:mm A")}</Text>
              </View>
            </View>

            <View style={[styles.direction__two]}>
              <View style={{ flex: 1 }}>
                <TextComponent
                  style={styles.heading__small}
                  text={'Pick Up'}
                />
                <Text style={{ ...styles.heading__small__gray, marginEnd: 10 }} numberOfLines={2}>
                  {item?.ride_locations[0]?.address}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <TextComponent
                  style={styles.heading__small}
                  text={'Drop Off'}
                />
                <Text style={{ ...styles.heading__small__gray, marginEnd: 10 }} numberOfLines={2}>
                  {item?.ride_locations[item.ride_locations.length - 1]?.address}
                </Text>
              </View>
              <View>
                <TextComponent style={styles.heading__small} text={'Total'} />
                <Text style={styles.heading__small__gray}>{item.estimated_price}$</Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      }}

    />
  );
};

export default PastRides;

const styles = StyleSheet.create({
  // mainContainer: {
  //   flex: 1,
  //   backgroundColor: Colors.WHITE,
  // },
  Before_After_Main_View_Style: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 10,
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  WaterGreen: {
    color: '#0CC0AB',
    fontWeight: 'bold',
  },
  heading__small: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  heading__small__gray: {
    fontSize: 9,
    color: '#808080',
  },
  direction__two: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
});


