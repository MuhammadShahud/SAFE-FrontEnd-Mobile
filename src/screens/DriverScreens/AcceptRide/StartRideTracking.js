import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Linking, BackHandler, Platform } from 'react-native';
import Header from '../../../components/Header';
import { Colors } from '../../../Styles';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, AnimatedRegion } from 'react-native-maps';
import TrackMark from '../../../assets/driver/trackmark.png';
import BottomSheet from 'reanimated-bottom-sheet';
import TextComponent from '../../../components/TextComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SubmitButton from '../../../components/SubmitButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { DriverMiddleware } from '../../../redux/Middlewares/DriverMiddleware';
import { ScrollView } from 'react-native-gesture-handler';
import AuthAction from '../../../redux/Actions/AuthActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DriverActions from '../../../redux/Actions/DriverActions';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from '../../../configs/APIs';
import Home from '../../../assets/rider/group-9.png';
import CompassHeading from 'react-native-compass-heading';
import Car from '../../../assets/driver/Car.png';
import Geolocation from 'react-native-geolocation-service';
import database from '@react-native-firebase/database';


const StartRideTracking = (props) => {


  const navigation = useNavigation();
  const sheetRef = React.useRef(null);
  const [ShowBottomSheet, setShowBottomSheet] = useState(0)
  const user = useSelector(state => state.Auth.user);
  const [Locationlist, setLocationlist] = useState([
    { id: '1', name: 'Steven Herb', locationname: 'Home', address: '1693 k st Suite 300, NW Washington DC 20006, USA', time: '4:17 PM', dropped: true },
    { id: '2', name: 'Peter Boss', locationname: 'School', address: 'Academic Magnet High School', time: '5:00 PM', dropped: false },
    { id: '3', name: 'Peter Boss', locationname: 'Home 2', address: 'Grand Canyon USA', time: '5:20 PM', dropped: false },
  ])
  const latestRide = useSelector(state => state.Driver.latestRide);
  const dispatch = useDispatch();
  const mapRef = useRef(new MapView());
  const markerRef = useRef();
  const [currentLoc, setCurrentLocation] = useState({ latitude: 37.7323, longitude: -122.4324 });
  const [heading, setHeading] = useState(0);
  const watchPos = useRef();
  const location = useRef(new AnimatedRegion({
    latitude: 37.7323,
    longitude: -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }));


  useEffect(() => {
    // Geolocation.getCurrentPosition((position) => {
    //   setCurrentLocation({
    //     longitude: position.coords.longitude,
    //     latitude: position.coords.latitude
    //   })
    //   setHeading(position.coords.heading)
    // })
    //  Geolocation.watchPosition((position) => {
    //   setHeading(position.coords.heading)
    //   markerRef.current.animateMarkerToCoordinate({
    //     latitude: position.coords.latitude,
    //     longitude: position.coords.longitude
    //   })
    //   mapRef.current.animateToRegion({
    //     latitude: position.coords.latitude,
    //     longitude: position.coords.longitude,
    //     latitudeDelta: 0.05,
    //     longitudeDelta: 0.05,
    //   })
    // }, (error) => {
    //   console.warn(error)
    // }, {
    //   distanceFilter: 1000,
    //   interval: 2000
    // })
    BackHandler.addEventListener("hardwareBackPress", onBackHandler);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackHandler);
    }

  }, [])

  useEffect(() => {
    const degree_update_rate = 3;

    CompassHeading.hasCompass().then((val) => console.log(val))

    return () => {
      CompassHeading.stop();
      if (watchPos.current)
        Geolocation.clearWatch(watchPos.current)
    };
  }, []);

  const onBackHandler = () => {
    navigation.navigate("DriverDashBoard");
    return true;
  }


  const onPressEmergency = number => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }

    Linking.openURL(phoneNumber);
  };

  const renderLocationList = ({ item, index }) => {
    return (
      <View style={styles.List_Item_Style}>

        <MaterialCommunityIcons name='map-marker' size={30} color={Colors.BLUE} />

        <View style={{ flex: 1, marginLeft: 5 }}>
          {/* <TextComponent
            text={item?.name}
            style={styles.Text_Style}
          /> */}
          <TextComponent
            text={index == 0 ? "Pick-up" : item?.dropped ? 'Dropped at' : 'Drop-off'}
            style={styles.Text_Style}
          />
        </View>

        <View style={{ flex: 1, marginHorizontal: 5 }}>
          {/* <TextComponent
            text={item?.locationname}
          /> */}
          <TextComponent
            text={item?.address}
          />
        </View>
        <TouchableOpacity
          onPress={() => dispatch(DriverMiddleware.DropLocation({
            rideId: latestRide?.id,
            locationId: item?.id
          }))}
          disabled={item?.status == "completed"}
          style={{ backgroundColor: item?.status == "completed" ? Colors.Greenish : Colors.BLUE, paddingVertical: 5, width: 70, borderRadius: 7, alignItems: 'center' }}>
          <Text style={{ color: Colors.WHITE_2, fontWeight: 'bold' }}>{index == 0 ? "Picked-up" : item?.status == "completed" ? 'Dropped' : 'Drop'}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        height: 480,
      }}
    >

      <View>
        {latestRide?.ride_locations.length > 2 ?
          <FlatList
            data={latestRide?.ride_locations}
            keyExtractor={id => id?.id}
            renderItem={renderLocationList}
            ListFooterComponent={
              <View style={{ paddingBottom: 50 }}>
                <View style={{ ...styles.Stats_Main_View, height: 50, marginTop: 20, alignItems: "flex-start" }}>
                  <View style={styles.Stats_Sub_View}>
                    <TextComponent
                      text={'EST'}
                      style={styles.Text_Style}
                    />
                    <TextComponent
                      text={moment(moment.now() + parseInt(latestRide?.estimated_time) * 1000).format("hh:MM A")}
                      style={styles.Text_Style}
                    />
                  </View>

                  <View style={styles.Stats_Sub_View}>
                    <TextComponent
                      text={'Distance'}
                      style={styles.Text_Style}
                    />
                    <TextComponent
                      text={latestRide?.estimated_distance ? parseFloat(latestRide?.estimated_distance / 1609).toFixed(2) + " m" : ""}
                      style={styles.Text_Style}
                    />
                  </View>

                  <View style={styles.Stats_Sub_View}>
                    <TextComponent
                      text={'Fare'}
                      style={styles.Text_Style}
                    />
                    <TextComponent
                      text={latestRide?.estimated_price + "$"}
                      style={styles.Text_Style}
                    />
                  </View>

                </View>
                <SubmitButton text={'Complete'} onPress={() => {
                  dispatch(DriverMiddleware.CompleteRide({
                    rideId: latestRide?.id,
                    onSuccess: async () => {
                      let userdata = {
                        ...user,
                        user: { ...user?.user, total_rides: parseInt(user?.user?.total_rides) + 1, total_earnings: parseFloat(user?.user?.total_earnings) + latestRide?.estimated_price }
                      }
                      await AsyncStorage.setItem('@user', JSON.stringify(userdata))
                      dispatch(AuthAction.UpdateUser({ ...user?.user, total_rides: parseInt(user?.user?.total_rides) + 1, total_earnings: parseFloat(user?.user?.total_earnings) + latestRide?.estimated_price }))
                      props?.navigation.navigate('TripsNotification')
                      dispatch(DriverActions.GetLatestRide(null))
                    }
                  }));
                }} />
              </View>}
          />
          : <View style={styles.List_Item_Style}>

            <MaterialCommunityIcons name='map-marker' size={30} color={Colors.BLUE} />

            <View style={{ marginHorizontal: 5 }}>
              {/* <TextComponent
              text={item?.name}
              style={styles.Text_Style}
            /> */}
              <TextComponent
                text={'Drop off'}
                style={styles.Text_Style}
              />
            </View>

            <View style={{ flex: 1, marginHorizontal: 5 }}>
              {/* <TextComponent
              text={item?.locationname}
            /> */}
              <TextComponent
                text={latestRide?.ride_locations[latestRide?.ride_locations.length - 1]?.address}
              />
            </View>
          </View>}
      </View>

      <View style={styles.Stats_Main_View}>

        <View style={styles.Stats_Sub_View}>
          <TextComponent
            text={'EST'}
            style={styles.Text_Style}
          />
          <TextComponent
            text={moment(moment.now() + parseInt(latestRide?.estimated_time) * 1000).format("hh:MM A")}
            style={styles.Text_Style}
          />
        </View>

        <View style={styles.Stats_Sub_View}>
          <TextComponent
            text={'Distance'}
            style={styles.Text_Style}
          />
          <TextComponent
            text={latestRide?.estimated_distance ? parseFloat(latestRide?.estimated_distance / 1609).toFixed(2) + " m" : ""}
            style={styles.Text_Style}
          />
        </View>

        <View style={styles.Stats_Sub_View}>
          <TextComponent
            text={'Fare'}
            style={styles.Text_Style}
          />
          <TextComponent
            text={latestRide?.estimated_price + "$"}
            style={styles.Text_Style}
          />
        </View>

      </View>

      <SubmitButton text={'Complete'} onPress={() => {
        dispatch(DriverMiddleware.CompleteRide({
          rideId: latestRide?.id,
          onSuccess: async () => {
            let userdata = {
              ...user,
              user: { ...user?.user, total_rides: parseInt(user?.user?.total_rides) + 1, total_earnings: parseFloat(user?.user?.total_earnings) + latestRide?.estimated_price }
            }
            await AsyncStorage.setItem('@user', JSON.stringify(userdata))
            dispatch(AuthAction.UpdateUser({ ...user?.user, total_rides: parseInt(user?.user?.total_rides) + 1, total_earnings: parseFloat(user?.user?.total_earnings) + latestRide?.estimated_price }))
            props?.navigation.navigate('TripsNotification')
            dispatch(DriverActions.GetLatestRide(null))
          }
        }));
      }} />

    </View>
  );

  const updateLocationOnFirebase = (heading, latitude = 0, longitude = 0) => {
    // if (latitude != null && longitude != null)
    //   database().ref("/drivers/" + user?.user?.id).set({
    //     heading,
    //     latitude,
    //     longitude
    //   }, (error) => console.warn(error))
    // else
    database().ref("/drivers/" + user?.user?.id).update({
      heading
    })
  }

  return (
    <View style={styles.Main_Container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        showsUserLocation={false}
        showsMyLocationButton={true}
        style={{ flex: 1 }}
        ref={mapRef}
        onMapReady={() => {
          Geolocation.getCurrentPosition((position) => {
            // markerRef.current.animateMarkerToCoordinate({
            //   latitude: position.coords.latitude,
            //   longitude: position.coords.longitude
            // })
            location.current.timing(
              {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                duration: 2000
              }
            ).start()
            mapRef.current.animateToRegion({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            })
            setTimeout(() => {
              CompassHeading.start(Platform.OS == "android" ? 5 : 20, ({ heading, accuracy }) => {
                mapRef.current.animateCamera({
                  heading: heading
                })
                setHeading(heading)
                updateLocationOnFirebase(heading)
              });
            }, 1000)
          })
          watchPos.current = Geolocation.watchPosition((position) => {
            // markerRef.current.animateMarkerToCoordinate({
            //   latitude: position.coords.latitude,
            //   longitude: position.coords.longitude
            // })
            location.current.timing(
              {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                duration: 2000
              }
            ).start()
            mapRef.current.animateToRegion({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            })

          }, (error) => { }, {
            interval: 6000,
            fastestInterval: 2000,
            distanceFilter: 10
          })
        }}
        initialRegion={{
          latitude: 37.7323,
          longitude: -122.4324,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* <Marker
          // rotation={}
          anchor={{ x: 0.5, y: 0.4 }}
          flat
          ref={markerRef}
          coordinate={{ latitude: 37.7323, longitude: -122.4324 }}
        >
          <View style={{ transform: [{ rotate: (heading + 40) + "deg" }] }}>
            <Image source={TrackMark} style={styles.Marker_Icon_Style} />
          </View>
        </Marker> */}
        <Marker.Animated
          anchor={{ x: 0.5, y: 0.4 }}
          flat
          ref={markerRef}
          coordinate={location.current}>
          <View style={{ transform: [{ rotate: (heading + 40) + "deg" }] }}>
            <Image
              source={TrackMark}
              style={{ width: 80, height: 80, resizeMode: 'contain' }}
            />
          </View>
        </Marker.Animated>
        {
          latestRide?.ride_locations.map((v, index) => {
            if (index != 0)
              return (
                <Marker
                  coordinate={{ latitude: parseFloat(v.latitude), longitude: parseFloat(v.longitude) }}
                >
                  <View>
                    <Image source={Home} style={styles.Marker_Icon_Style} />
                  </View>
                </Marker>
              )
          })
        }
        {
          latestRide?.ride_locations[0]?.latitude && latestRide?.ride_locations[0]?.longitude ?
            <MapViewDirections
              origin={{
                latitude: parseFloat(latestRide?.ride_locations[0]?.latitude),
                longitude: parseFloat(latestRide?.ride_locations[0]?.longitude),
              }}
              destination={{
                latitude: parseFloat(latestRide?.ride_locations[latestRide?.ride_locations.length - 1]?.latitude),
                longitude: parseFloat(latestRide?.ride_locations[latestRide?.ride_locations.length - 1]?.longitude)
              }}
              waypoints={latestRide.ride_locations.length > 2 ? latestRide.ride_locations.map(val => { return ({ latitude: parseFloat(val.latitude), longitude: parseFloat(val.longitude) }) }) : []}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="black"
              optimizeWaypoints={true}
            />
            : null
        }
      </MapView>
      <View style={{ position: 'absolute', width: '100%' }}>
        <Header
          headerLeft={true}
          title={'Pick Up'}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.Emergency_Button_View}>
          <TouchableOpacity
            onPress={() => onPressEmergency('123456789')}
            style={styles.Emergency__red}>
            <Text style={styles.txt}>Emergency</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => sheetRef.current.snapTo(0)}
          style={styles.Bottom_Item_Style}>
          <MaterialCommunityIcons
            color={Colors.BLUE}
            name="map-marker"
            size={26}
          />
          <Text style={[styles.Online_Text]}>
            {latestRide?.ride_locations[latestRide?.ride_locations.length - 1]?.address}
          </Text>

          <Text style={[styles.Online_Text, { flex: 0 }]}> Drop-Off</Text>
        </TouchableOpacity>

      </View>
      <BottomSheet
        initialSnap={0}
        ref={sheetRef}
        snapPoints={[480, 25, 0]}
        renderHeader={() =>
          <View style={styles.Sheet_Header_Style}>
            <TouchableOpacity
              onPress={() => {
                setShowBottomSheet(!ShowBottomSheet)
                if (ShowBottomSheet == 0) {
                  sheetRef.current.snapTo(1)
                  setShowBottomSheet(1)
                }
                else {
                  sheetRef.current.snapTo(0)
                  setShowBottomSheet(0)
                }
              }}
              style={styles.Sheet_Sub_Header_Style} />
          </View>}
        renderContent={renderContent}
        enabledBottomClamp={true}
        enabledBottomInitialAnimation={true}
        enabledGestureInteraction={true}
        enabledContentGestureInteraction={true}
        enabledHeaderGestureInteraction={true}
        enabledInnerScrolling={true}
      />
    </View >
  )
}

const styles = StyleSheet.create({
  Main_Container: {
    flex: 1,
  },
  Sheet_Header_Style: {
    width: "100%",
    backgroundColor: Colors.WHITE,
    padding: 15,
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  Sheet_Sub_Header_Style: {
    backgroundColor: Colors.GRAY,
    borderRadius: 20,
    width: 100,
    height: 7
  },
  Marker_Icon_Style: {
    width: 50,
    height: 50,
    resizeMode: 'contain'
  },
  List_Item_Style: {
    backgroundColor: Colors.WHITE,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    marginVertical: 5,
    elevation: 5,
    padding: 10
  },
  Stats_Main_View: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  Stats_Sub_View: {
    alignItems: 'center',
    flex: 1
  },
  Text_Style: {
    fontWeight: 'bold'
  },
  Online_Text: {
    alignSelf: 'center',
    color: Colors.BLUE,
    fontWeight: 'bold',
    fontSize: 12,
    flex: 1
  },
  Emergency__red: {
    backgroundColor: Colors.RED,
    padding: 20,
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  Bottom_Item_Style: {
    backgroundColor: Colors.WHITE_2,
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    width: '90%',
    padding: 15,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Emergency_Button_View: {
    marginBottom: 15,
    height: 100,
    width: 100,
    borderRadius: 50,
    padding: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE_2,
    marginLeft: 15,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  }
})
export default StartRideTracking