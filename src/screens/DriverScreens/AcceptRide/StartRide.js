import React, { useRef, useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import Header from '../../../components/Header';
import { Colors } from '../../../Styles';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, AnimatedRegion } from 'react-native-maps';
import Car from '../../../assets/driver/Car.png';
import Home from '../../../assets/rider/group-9.png';
import Person3 from '../../../assets/driver/Person3.png';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import TextComponent from '../../../components/TextComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SubmitButton from '../../../components/SubmitButton';
import ThreeDots from '../../../components/ThreeDots';
import StartRideModal from '../../../components/StartRideModal';
import { useNavigation } from '@react-navigation/native';
import DashedLine from 'react-native-dashed-line'
import { useDispatch, useSelector } from 'react-redux';
import { GOOGLE_MAPS_APIKEY, img_url } from '../../../configs/APIs';
import { RideMiddleware } from '../../../redux/Middlewares/RideMiddleware';
import DriverActions from '../../../redux/Actions/DriverActions';
import Pusher from 'pusher-js/react-native';
import CompleteProfileModal from '../../../components/CompleteProfileModal';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import CompassHeading from 'react-native-compass-heading';
import database from '@react-native-firebase/database';

const StartRide = () => {
  const latestRide = useSelector(state => state.Driver.latestRide);
  const [Price, setPrice] = useState('$20.20');
  const [VehicalType, setVehicalType] = useState('Mini');
  const [ShowBottomSheet, setShowBottomSheet] = useState(0)
  const [count, setCount] = useState(0)
  const sheetRef = React.useRef(null);
  const dispatch = useDispatch();
  const requestedRides = useSelector(state => state.Driver.reqeustedRides);
  const [canceledModal, setCancelModal] = useState(false);
  const mapRef = useRef(new MapView());
  const markerRef = useRef();
  const [currentLoc, setCurrentLocation] = useState({ latitude: 37.7323, longitude: -122.4324 });
  const [heading, setHeading] = useState(0);
  const user = useSelector(state => state.Auth.user);
  const watchPos = useRef();
  const location = useRef(new AnimatedRegion({
    latitude: 37.7323,
    longitude: -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }));


  const onPressEmergency = number => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }

    Linking.openURL(phoneNumber);
  };
  const [Locationlist, setLocationlist] = useState([
    {
      id: '1',
      locationname: 'Home',
      address: '1693 k st Suite 300, NW Washington DC 20006, USA',
      time: '4:17 PM',
      type: 'Pick-Up',
    },
    {
      id: '2',
      locationname: 'School',
      address: 'Academic Magnet High School',
      time: '5:00 PM',
      type: 'Drop-off',
    },
    {
      id: '3',
      locationname: 'Home 2',
      address: 'Grand Canyon USA',
      time: '5:20 PM',
      type: 'Drop-off',
    },
  ]);
  const [ModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const initiatePusher = () => {
    let pusher = new Pusher('ba024c85e694c4822cf6', { cluster: 'ap2' });
    let chatchannel = pusher.subscribe(latestRide?.id + "");
    chatchannel.bind('App\\Events\\Message', data => {
      if (latestRide?.id == data?.ride_id && data?.data?.from != user?.user?.id) {
        setCount(c => parseInt(c + 1))
      }
    });
    let rideChannel = pusher.subscribe("cancel_ride");
    rideChannel.bind("App\\Events\\DriverCancelRide", data => {
      if (data.data) {
        if (data.data.status == "canceled")
          setCancelModal(true)
      }
    });
  }

  useEffect(() => {
    initiatePusher();

    return () => {
      CompassHeading.stop();
      if (watchPos.current)
        Geolocation.clearWatch(watchPos.current)
    };
  }, []);

  const renderLocationList = ({ item, index }) => {
    return (
      <View>
        <View style={styles.List_Item_Style}>
          <MaterialCommunityIcons
            name="map-marker"
            size={30}
            color={Colors.BLUE}
          />

          <View style={{ flex: 1, marginHorizontal: 5 }}>
            {item?.address_name ? <TextComponent text={item?.address_name} /> : null}
            <TextComponent text={item?.address} />
          </View>

          <TextComponent text={index == 0 ? "Pick-up" : "Drop-off"} />
        </View>
        {index < latestRide?.ride_locations.length - 1 ?
          <DashedLine
            dashLength={5}
            dashThickness={5}
            dashStyle={{ borderRadius: 5 }}
            dashGap={5}
            dashColor={Colors.LIGHT_GRAY}
            axis='vertical'
            style={{ width: '80%', height: 30, alignSelf: 'center', marginVertical: 5 }} />
          : null}
      </View>
    );
  };

  const renderContent = () => (
    <ScrollView
      style={{
        backgroundColor: 'white',
      }}>
      <View style={{ width: '90%', alignSelf: 'center', alignItems: 'center' }}>
        <TextComponent
          text={'Waiting for passenger'}
          style={{ fontWeight: 'bold', fontSize: 15 }}
        />
        <TextComponent
          text={'Arrived'}
          style={{ fontWeight: 'bold', fontSize: 25 }}
        />

        <Image
          source={latestRide?.rider?.image ? { uri: img_url + latestRide?.rider?.image } : Person3}
          style={{
            height: 100,
            width: 100,
            borderRadius: 50,
            resizeMode: 'contain',
            marginVertical: 10,
          }}
        />
        <TextComponent
          text={latestRide?.rider?.first_name + " " + latestRide?.rider?.last_name}
          style={{ fontWeight: 'bold', fontSize: 20 }}
        />

        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
          <TouchableOpacity onPress={() => { navigation.navigate('ChatList', { userDetails: latestRide?.rider, chat_list_id: latestRide?.id }), setCount(0) }}>
            <MaterialCommunityIcons
              name="message-text"
              size={30}
              color={Colors.BLUE}
              style={{ marginRight: 10 }}
            />
            {count != 0 ?
              <View style={{ borderRadius: 50, backgroundColor: Colors.RED, justifyContent: "center", alignItems: 'center', height: 20, width: 20, position: "absolute", top: -10, left: -10 }}>
                <TextComponent
                  text={count + ""}
                  style={{ fontSize: 11, color: "#fff" }}
                />
              </View>
              : null}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPressEmergency(latestRide?.rider?.phone)}>
            <MaterialCommunityIcons
              name="phone"
              size={30}
              color={Colors.BLUE}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={latestRide?.ride_locations}
        keyExtractor={id => id?.id}
        renderItem={renderLocationList}
      />

      <View style={styles.Price_Main_Value_Style}>
        <Text style={styles.Price_Text_Style}>Price</Text>
        <Text style={styles.Price_Text_Style}>
          {latestRide?.estimated_price + "$"} ({latestRide?.vehicle_type})
        </Text>
      </View>

      <SubmitButton
        text={'Start Ride'}
        onPress={() => setModalVisible(true)}
        icon={true}
        iconname={'car-sports'}
      />
    </ScrollView>
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
        showsUserLocation={true}
        showsMyLocationButton={true}
        style={{ flex: 1 }}
        ref={mapRef}
        onMapReady={(e) => {
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
                  heading
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
          latitude: currentLoc.latitude,
          longitude: currentLoc.longitude,
          latitudeDelta: 0.30,
          longitudeDelta: 0.30,
        }}>
        <Marker.Animated
          anchor={{ x: 0.5, y: 0.4 }}
          flat
          ref={markerRef}
          coordinate={location.current}>
          <View style={{ transform: [{ rotate: (heading + -90) + "deg" }] }}>
            <Image
              source={Car}
              style={{ width: 50, height: 50, resizeMode: 'contain' }}
            />
          </View>
        </Marker.Animated>
        {/* <Marker anchor={{ x: 0.5, y: 0.4 }}
          flat ref={markerRef} coordinate={{ latitude: 37.7323, longitude: -122.4324 }}>
          <View style={{ transform: [{ rotate: (heading + -90) + "deg" }] }}>
            <Image source={Car} style={styles.Marker_Icon_Style} />
          </View>
        </Marker> */}
        {
          latestRide?.ride_locations[0]?.latitude && latestRide?.ride_locations[0]?.longitude ?
            <Marker
              coordinate={{
                latitude: parseFloat(latestRide?.ride_locations[0]?.latitude),
                longitude: parseFloat(latestRide?.ride_locations[0]?.longitude),
              }}
            >
              <View>
                <Image source={Home} style={styles.Marker_Icon_Style} />
              </View>
            </Marker>
            : null
        }
        {
          currentLoc?.latitude && currentLoc?.longitude && latestRide?.ride_locations[0]?.latitude && latestRide?.ride_locations[0]?.longitude ?
            <MapViewDirections
              origin={{
                latitude: parseFloat(currentLoc?.latitude),
                longitude: parseFloat(currentLoc?.longitude),
              }}
              destination={{
                latitude: parseFloat(latestRide?.ride_locations[0]?.latitude),
                longitude: parseFloat(latestRide?.ride_locations[0]?.longitude)
              }}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="black"
              optimizeWaypoints={true}
            />
            : null
        }

      </MapView>
      <View style={{ position: 'absolute', width: '100%' }}>
        <Header headerLeft={true} title={'Pick Up'} />
      </View>
      <BottomSheet
        initialSnap={0}
        ref={sheetRef}
        snapPoints={[550, 25, 0]}
        renderHeader={() => (
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
          </View>
        )}
        renderContent={renderContent}
        enabledBottomClamp={true}
        enabledBottomInitialAnimation={true}
        enabledGestureInteraction={true}
        enabledContentGestureInteraction={true}
        enabledHeaderGestureInteraction={true}
        enabledInnerScrolling={true}
      />
      <StartRideModal
        visible={ModalVisible}
        buttonOneText={'Yes'}
        buttonTwoText={'No'}
        description={'Are you sure, you want to \n start ride?'}
        notvisible={() => setModalVisible(false)}
        onPressbuttonOne={() => {
          setModalVisible(false);
          dispatch(RideMiddleware.startRide({
            ride_id: latestRide?.id
          })).then((val) => {
            if (val) {
              dispatch(DriverActions.GetLatestRide(val))
              navigation.navigate('StartRideTracking');
            }
          })
        }}
        onPressbuttonTwo={() => {
          setModalVisible(false);
        }}
      />

      <CompleteProfileModal
        visible={canceledModal}
        btnTitle="Go back to home"
        description={'Ride has been canceled by customer'}
        notvisible={() => setCancelModal(false)}
        onPressComplete={() => {
          setCancelModal(false);
          dispatch(DriverActions.GetLatestRide(null));
          navigation.navigate('DriverDashBoard')
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Main_Container: {
    flex: 1,
  },
  Price_Text_Style: {
    color: Colors.BLUE,
    fontSize: 20,
    fontWeight: 'bold',
  },
  Price_Main_Value_Style: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  Sheet_Header_Style: {
    width: '100%',
    backgroundColor: Colors.WHITE,
    padding: 15,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  Sheet_Sub_Header_Style: {
    backgroundColor: Colors.GRAY,
    borderRadius: 20,
    width: 100,
    height: 7,
  },
  Marker_Icon_Style: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
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
    padding: 10,
  },
});
export default StartRide;
