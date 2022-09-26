import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from '../../../Styles';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import TextComponent from '../../../components/TextComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RideMiddleware } from '../../../redux/Middlewares/RideMiddleware'
import RideActions from '../../../redux/Actions/RideActions';
import { ActivityIndicator } from 'react-native-paper';
import moment from 'moment';
import { GOOGLE_MAPS_APIKEY } from '../../../configs/APIs';
import MapViewDirections from 'react-native-maps-directions';


const UpComing = () => {

  useEffect(() => {
    fetch()
  }, [])


  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [data, setdata] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [loader, setloader] = useState(false)

  const renderUserList = ({ item }) => {
    return (
      <View style={styles.Back__farward}>
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
          <Marker
            coordinate={{
              latitude: parseFloat(item?.ride_locations[item?.ride_locations.length - 1]?.latitude),
              longitude: parseFloat(item?.ride_locations[item?.ride_locations.length - 1]?.longitude)
            }}
            title={'DropOff'}
          // description={'I am /Here'}
          />
        </MapView>
        <View style={{ flexDirection: 'row', padding: 15 }}>
          <View style={styles.direction}>
            <View>
              <TextComponent
                style={styles.name__Heading}
                text={item?.driver.first_name}
              />
              <TextComponent
                style={styles.Date__Heading}
                text={moment(item?.date).format('ddd , MMM D , yyyy')}
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
                text={item?.ride_locations[1].address}
              />
            </View>
          </View>


          <View style={{ width: '30%' }}>
            <View style={{ marginTop: 12 }}>
              <Text style={styles.Blue__txt}>{`$${item?.estimated_price}`}</Text>
              <TextComponent text={moment(item?.date).format('LT')} />
              <Text style={styles.yellow__txt}>Confirmed</Text>
            </View>
          </View>

        </View>
      </View>
    );
  };

  const fetch = () => {
    setloader(false)
    dispatch(RideMiddleware.getRiderLatestRide())
      .then((data) => {
        if (data != null)
          setdata([data])
        dispatch(RideActions.getRideDetails(data))
      })
      .catch()
    setloader(true)
  }

  const onRefresh = () => {
    setRefreshing(true)
    dispatch(RideMiddleware.getRiderLatestRide())
      .then((data) => {
        if (data != null)
          setdata([data])
        dispatch(RideActions.getRideDetails(data))
      })
      .catch()
    setRefreshing(false)
  }

  return (
    <View style={styles.mainContainer}>
      {loader ?
        <FlatList
          data={data}
          keyExtractor={id => id?.id}
          renderItem={renderUserList}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text style={{ color: Colors.LIGHT_GRAY_1 }}>Ride Not Found</Text>
            </View>
          }
        />
        :
        <ActivityIndicator size={'small'} color={Colors.BLACK} />
      }

    </View>
  );
};

export default UpComing;

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
    color: '#37bcb3',
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
