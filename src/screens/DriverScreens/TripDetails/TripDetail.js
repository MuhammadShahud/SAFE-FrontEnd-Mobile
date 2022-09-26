import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { Colors } from '../../../Styles';
import Header from '../../../components/Header';
import SubmitButton from '../../../components/SubmitButton';
import TextComponent from '../../../components/TextComponent';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import mapImage from '../../../assets/driver/map.png';
import start from '../../../assets/rider/startLoc.png';
import end from '../../../assets/rider/endLoc.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Ladies from '../../../assets/driver/ladies.png';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { GOOGLE_MAPS_APIKEY, img_url } from '../../../configs/APIs';
import MapViewDirections from 'react-native-maps-directions';

const TripDetail = (props) => {
  const [bottom, setBottom] = useState(1);
  const navigation = useNavigation();
  const mapRef = useRef();

  const item = props.route.params.item;
  return (
    <View style={styles.mainContainer}>
      <ImageBackground style={{ flex: 1 }} source={mapImage}>
        <ScrollView style={{ flex: 1, }}>
          <Header title={'Trip Details'} headerRight={true} headerLeft={true} />
          <View style={styles.Before_After_Main_View_Style}>
            <View style={{ ...styles.bg__img, alignSelf: 'center' }}>
              <MapView
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsMyLocationButton={true}
                style={{ flex: 1 }}
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
                    latitude: item?.ride_locations[0].latitude,
                    longitude: item?.ride_locations[0].longitude,
                    latitudeDelta: 1.0,
                    longitudeDelta: 1.0,
                  })
                  console.warn({
                    latitude: item?.ride_locations[0].latitude,
                    longitude: item?.ride_locations[0].longitude,
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
                  item?.ride_locations ?
                    item.ride_locations.map((v, index) => {
                      return (
                        <Marker
                          coordinate={{ latitude: parseFloat(v.latitude), longitude: parseFloat(v.longitude) }}
                        >
                          <View>
                            <Image source={index == 0 ? start : end} style={{ width: index == 0 ? 20 : 30, height: index == 0 ? 20 : 30, resizeMode: 'contain', }} />
                          </View>
                        </Marker>
                      )
                    })
                    : null
                }
                {
                  item?.ride_locations ?
                    <MapViewDirections
                      origin={{
                        latitude: parseFloat(item?.ride_locations[0]?.latitude),
                        longitude: parseFloat(item?.ride_locations[0]?.longitude),
                      }}
                      destination={{
                        latitude: parseFloat(item?.ride_locations[item?.ride_locations.length - 1]?.latitude),
                        longitude: parseFloat(item?.ride_locations[item?.ride_locations.length - 1]?.longitude)
                      }}
                      waypoints={item.ride_locations.length > 2 ? item.ride_locations.map(val => { return ({ latitude: parseFloat(val.latitude), longitude: parseFloat(val.longitude) }) }) : []}
                      apikey={GOOGLE_MAPS_APIKEY}
                      strokeWidth={3}
                      strokeColor="black"
                      optimizeWaypoints={true}
                    />
                    : null
                }
              </MapView>
            </View>
            <View style={styles.wid}>
              <Text style={styles.date}>{moment(item.request_time).format("MM-DD-YYYY hh:mm A")}</Text>
              <Text style={styles.dollars}>${item.estimated_price}</Text>
              <Text style={styles.date}>{item.status}</Text>
              <View style={{ marginVertical: 5 }}>
                <View style={styles.direction}>
                  <Ionicons
                    color={Colors.BLUE}
                    name="cloud-circle-outline"
                    size={20}
                  />
                  <TextComponent
                    style={{ fontSize: 12 }}
                    text={item.ride_locations[0].address}
                  />
                </View>
                <View style={styles.direction}>
                  <Ionicons color={Colors.BLUE} name="location" size={20} />
                  <TextComponent
                    style={{ fontSize: 12 }}
                    text={item.ride_locations[item.ride_locations.length - 1].address}
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Image style={styles.logologo} source={item?.rider?.image ? { uri: img_url + item.rider.image } : Ladies} />
                <Text style={styles.txt}>Trip with {item?.rider?.first_name + " " + item?.rider?.last_name}</Text>
              </View>
            </View>
            <SubmitButton
              onPress={() => navigation.navigate('ContactusRequest', { item })}
              text={'Get Trip Help'}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default TripDetail;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  Before_After_Main_View_Style: {
    width: '85%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    elevation: 2,
  },
  bg__img: {
    width: '100%',
    height: 300,
  },
  wid: {
    width: '80%',
    alignSelf: 'center',
    marginVertical: 15,
  },
  date: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.BLUE,
  },
  dollars: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.BLUE,
  },
  direction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.BLUE,
  },
  logologo: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
});
