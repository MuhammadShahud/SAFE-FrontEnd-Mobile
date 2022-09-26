import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { RideMiddleware } from '../../../redux/Middlewares/RideMiddleware'
import { SheduleMiddleware } from '../../../redux/Middlewares/SheduleMiddleware'
import { APIs, GOOGLE_MAPS_APIKEY } from '../../../configs/APIs'
import { Colors } from '../../../Styles';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import TextComponent from '../../../components/TextComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import RideActions from '../../../redux/Actions/RideActions';
import MapViewDirections from 'react-native-maps-directions';


const SheduledRide = () => {
  const [UserList, setUserList] = useState([
    {
      id: '1',
      name: 'Ebony',
      aTitle: 'Peter Boss',
      accountNumber: '1233**** ******* ********',
      BtnName: 'Paid',
      Date: 'Fri, Sept 3, 2021',
      Dollar: '$20.20',
    },
    {
      id: '2',
      name: 'Ivory',
      aTitle: 'Steven Herb',
      accountNumber: '1233**** ******* ********',
      BtnName: 'Failed',
      Date: 'Wed, Oct 6, 2021',
      Dollar: '$40.20',
    },
    {
      id: '3',
      name: 'Alex',
      aTitle: 'Peter Boss',
      accountNumber: '1233**** ******* ********',
      BtnName: 'Paid',
      Date: 'Thu, Dec 1 6, 2021',
      Dollar: '$50.20',
    },
    {
      id: '4',
      name: 'Ivory',
      aTitle: 'Steven Herb',
      accountNumber: '1233**** ******* ********',
      BtnName: 'Failed',
      Date: 'Thu, Dec 1 6, 2021',
      Dollar: '$50.20',
    },
  ]);

  const dispatch = useDispatch();
  const shedules = useSelector(state => state.Shedule.shedules)
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation()
  const [loader, setloader] = useState(false)

  useEffect(() => {
    setloader(true)
    dispatch(SheduleMiddleware.getShedules({
      next_page_url: APIs.scheduleRides
    })).then(() => setloader(false))
      .catch(() => setloader(false))
  }, [])

  const onEndReached = () => {
    if (shedules?.next_page_url) {
      dispatch(SheduleMiddleware.getShedules({
        next_page_url: shedules?.next_page_url
      }))
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    dispatch(SheduleMiddleware.getShedules({
      next_page_url: APIs.scheduleRides
    }))
    setRefreshing(false)
  }

  const scheduleRide = (item) => {
    dispatch(RideActions.getRideDetails(item))
    navigation.navigate('ConfirmBooking')
  }

  const renderUserList = ({ item }) => {
    return (
      <TouchableOpacity style={styles.Back__farward} onPress={() => scheduleRide(item)}>
        <MapView
          provider={PROVIDER_GOOGLE}
          // showsUserLocation={true}
          // showsMyLocationButton={true}
          style={{ width: '100%', height: 100 }}
          region={{
            latitude: parseFloat(item?.ride_locations[0].latitude),
            longitude: parseFloat(item?.ride_locations[0].longitude),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }} >
          <Marker
            coordinate={{
              latitude: parseFloat(item?.ride_locations[0]?.latitude),
              longitude: parseFloat(item?.ride_locations[0]?.longitude)
            }}
            title={'here'}
            description={'I am /Here'}
          />
          <MapViewDirections
            origin={{
              latitude: parseFloat(item?.ride_locations[0]?.latitude),
              longitude: parseFloat(item?.ride_locations[0]?.longitude),
            }}
            waypoints={item?.ride_locations?.length > 2 ? item?.ride_locations?.map(val => { return ({ latitude: parseFloat(val.latitude), longitude: parseFloat(val.longitude) }) }) : []}
            destination={{
              latitude: parseFloat(item?.ride_locations[item?.ride_locations.length - 1]?.latitude),
              longitude: parseFloat(item?.ride_locations[item?.ride_locations.length - 1]?.longitude)
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="black"
            optimizeWaypoints={true}
          />
        </MapView>

        <View style={{ flexDirection: 'row', padding: 15 }}>
          <View style={styles.direction}>
            <View>
              <TextComponent
                style={styles.name__Heading}
                text={item?.driver?.first_name}
              />
              <TextComponent
                style={styles.Date__Heading}
                text={moment(item?.schedule_start_time).format('ddd , MMM D , yyyy')}
              />
            </View>

            <View style={{ flexDirection: 'row', width: '90%' }}>
              <Ionicons color={Colors.BLUE} name="radio-button-on" size={25} />
              <TextComponent
                numberOfLines={2}
                style={{ fontSize: 12, marginTop: 5 }}
                text={item?.ride_locations[0].address}
              />
            </View>

            <View style={{ flexDirection: 'row', width: '90%' }}>
              <Ionicons color={Colors.BLUE} name="location" size={25} />
              <TextComponent
                numberOfLines={2}
                style={{ fontSize: 12 }}
                text={item?.ride_locations[item?.ride_locations.length - 1].address}
              />
            </View>

          </View>

          <View style={{ width: '30%' }}>
            <View style={{ marginTop: 12 }}>
              <Text style={styles.Blue__txt}>{`$${item?.estimated_price}`}</Text>
              <TextComponent text={moment(item?.schedule_start_time).format('LT')} />
              <Text style={styles.yellow__txt}>Scheduled</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {!loader ?
        <FlatList
          style={{ marginTop: 5 }}
          data={shedules?.data}
          keyExtractor={item => item?.id}
          renderItem={renderUserList}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.2}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text style={{ color: Colors.LIGHT_GRAY_1 }}>Ride Not Found</Text>
            </View>
          }
        />
        :
        <ActivityIndicator size={'small'} color={Colors.BLACK} />}
    </View>
  );
};

export default SheduledRide;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: Colors.WHITE,
    marginVertical: 15,
  },
  Back__farward: {
    backgroundColor: Colors.WHITE,
    width: '90%',
    alignSelf: 'center',
    elevation: 4,
    borderRadius: 10,
    marginVertical: 15,
  },
  direction: {
    width: '70%',
    marginVertical: 5,
  },
  name__Heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  Date__Heading: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  Blue__txt: {
    fontSize: 21,
    fontWeight: 'bold',
    color: Colors.BLUE,
  },
  direction__: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  yellow__txt: {
    color: '#ed9005',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  direction__None: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 10,
  },
});
