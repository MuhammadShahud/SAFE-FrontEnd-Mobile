import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Colors } from '../../../Styles';
import Header from '../../../components/Header';
import TextComponent from '../../../components/TextComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import Car from '../../../assets/driver/Car.png';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { DriverMiddleware } from '../../../redux/Middlewares/DriverMiddleware';
import moment from 'moment';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from '../../../configs/APIs';


const Contactus = () => {
  const navigation = useNavigation();
  const [bottom, setBottom] = useState(1);
  const dispatch = useDispatch();
  const lastRide = useSelector(state => state.Driver.lastRide);
  const mapRef = useRef();

  useEffect(() => {
    dispatch(DriverMiddleware.getLastRides());
  }, [])


  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <Header title={'Contact us'} headerRight={true} headerLeft={true} />
        {
          lastRide?.status ?
            <View style={styles.Before_After_Main_View_Style}>
              <View style={{ padding: 15 }}>
                <View style={styles.direction__two}>
                  <View>
                    <TextComponent style={styles.main__Heading} text={'Last Ride'} />
                    <TextComponent
                      style={{ fontWeight: 'bold' }}
                      text={moment(lastRide?.request_time).format("MM-DD-YYYY hh:mm A")}
                    />
                  </View>
                  <View style={{ padding: 10 }}>
                    <Text style={styles.Blue__Color}>${lastRide?.estimated_price}</Text>
                    {/* <Text>12:45 PM</Text> */}
                    <Text style={[styles.red, { color: lastRide?.status == "completed" ? "green" : "red" }]}>{lastRide?.status}</Text>
                  </View>
                </View>
                <View style={styles.direction}>
                  <Ionicons
                    color={Colors.BLUE}
                    name="cloud-circle-outline"
                    size={30}
                  />
                  <TextComponent
                    style={{ fontSize: 12, flex: 1 }}
                    text={lastRide?.ride_locations[0].address}
                  />
                </View>
                <View style={styles.direction}>
                  <Ionicons color={Colors.BLUE} name="location" size={30} />
                  <TextComponent
                    style={{ fontSize: 12, flex: 1 }}
                    text={lastRide?.ride_locations[lastRide?.ride_locations.length - 1].address}
                  />
                </View>
              </View>
            </View>
            : null}
        <View style={{ flex: 1, width: '85%', alignSelf: 'center' }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            showsMyLocationButton={true}
            style={{ height: 200, marginBottom: bottom }}
            ref={mapRef}
            region={{
              latitude: 24.8601147,
              longitude: 67.0639693,
              latitudeDelta: 1.0,
              longitudeDelta: 1.0,
            }}
            onMapReady={() => {
              mapRef.current.fitToElements();
              mapRef.current.animateToRegion({
                latitude: lastRide?.ride_locations[0].latitude,
                longitude: lastRide?.ride_locations[0].longitude,
                latitudeDelta: 1.0,
                longitudeDelta: 1.0,
              })
              console.warn({
                latitude: lastRide?.ride_locations[0].latitude,
                longitude: lastRide?.ride_locations[0].longitude,
              })
              setBottom(0)
            }}>
            {/* <Marker coordinate={{ latitude: 37.7323, longitude: -122.4324 }}>
            <View>
              <Image
                source={Car}
                style={{ width: 50, height: 50, resizeMode: 'contain' }}
              />
            </View>
          </Marker> */}
            {
              lastRide?.ride_locations ?
                lastRide.ride_locations.map((v, index) => {
                  return (
                    <Marker
                      coordinate={{ latitude: parseFloat(v.latitude), longitude: parseFloat(v.longitude) }}
                    />
                  )
                })
                : null
            }

            {
              lastRide?.ride_locations ?
                <MapViewDirections
                  origin={{
                    latitude: parseFloat(lastRide?.ride_locations[0]?.latitude),
                    longitude: parseFloat(lastRide?.ride_locations[0]?.longitude),
                  }}
                  destination={{
                    latitude: parseFloat(lastRide?.ride_locations[lastRide?.ride_locations.length - 1]?.latitude),
                    longitude: parseFloat(lastRide?.ride_locations[lastRide?.ride_locations.length - 1]?.longitude)
                  }}
                  waypoints={lastRide.ride_locations.length > 2 ? lastRide.ride_locations.map(val => { return ({ latitude: parseFloat(val.latitude), longitude: parseFloat(val.longitude) }) }) : []}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={3}
                  strokeColor="black"
                  optimizeWaypoints={true}
                />
                : null
            }

          </MapView>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('TripDetail', { item: lastRide })}
          style={styles.center}>
          <Text style={styles.txt}>Report an issue with this trip</Text>
          <Ionicons color={Colors.BLUE} name="chevron-forward" size={30} />
        </TouchableOpacity>
        <View style={styles.Long__style}>
          <TextComponent
            style={[styles.main__Heading, { marginHorizontal: 25 }]}
            text={'All Topics'}
          />
          <View style={styles.Before_After_Main_View_Style}>
            <TouchableOpacity onPress={() => navigation.navigate('Help')} style={styles.pad}>
              <TextComponent style={styles.txt__gray} text={'Help with a Trip'} />
              <Ionicons color={Colors.BLUE} name="chevron-forward" size={30} />
            </TouchableOpacity>
          </View>

          <View style={styles.Before_After_Main_View_Style}>
            <TouchableOpacity onPress={() => navigation.navigate('CommunityGuide')} style={styles.pad}>
              <TextComponent style={styles.txt} text={'Community Guidelines'} />
              <Ionicons color={Colors.BLUE} name="chevron-forward" size={30} />
            </TouchableOpacity>
          </View>

          <View style={styles.Before_After_Main_View_Style}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ContactusPaymentOption')}
              style={styles.pad}>
              <TextComponent
                style={styles.txt}
                text={'Account and payment option'}
              />
              <Ionicons color={Colors.BLUE} name="chevron-forward" size={30} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Contactus;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  Before_After_Main_View_Style: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 5,
  },
  main__Heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  direction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  direction__two: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Blue__Color: {
    color: Colors.BLUE,
    fontWeight: 'bold',
    fontSize: 20,
  },
  red: {
    color: Colors.RED,
  },
  Long__style: {
    width: '100%',
    alignSelf: 'center',
    padding: 15,
  },
  pad: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txt: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  center: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },
  txt__gray: {
    color: '#C0C0C0',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
