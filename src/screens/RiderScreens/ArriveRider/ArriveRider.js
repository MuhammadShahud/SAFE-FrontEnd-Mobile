import React, { useRef, useState, useEffect } from 'react';
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
  BackHandler
} from 'react-native';
import Header from '../../../components/Header';
import { Colors } from '../../../Styles';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps';
import Car from '../../../assets/driver/Car.png';
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
import ConfirmedBookingModal from '../../../components/ConfirmedBookingModal';
import CarSide from '../../../assets/rider/CarSide.png'
import CarMarker from '../../../assets/rider/CarMarker.png';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from '../../../configs/APIs';
import { useSelector, useDispatch } from 'react-redux'
import { RideMiddleware } from '../../../redux/Middlewares/RideMiddleware'
import moment from 'moment';
import Pusher from 'pusher-js/react-native';
import RideActions from '../../../redux/Actions/RideActions';
import database from '@react-native-firebase/database';



const ArriveRider = (props) => {
  const rideDetails = useSelector((state) => state.Ride.rideDetails)
  const Locations = rideDetails?.ride_locations;
  const sheetRef = React.useRef(null);
  const [ShowBottomSheet, setShowBottomSheet] = useState(0)
  const [ModalVisible, setModalVisible] = useState(false);
  const [isCancel, setisCancel] = useState(false)
  const [heading, setheading] = useState(0)
  const navigation = useNavigation();
  const dispatch = useDispatch()

  const chatchannel = useRef(null)
  const cancelRideChannel = useRef(null)
  const markerRef = useRef();
  const mapRef = useRef();
  const location = useRef(new AnimatedRegion({
    latitude: 37.7323,
    longitude: -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }));


  useEffect(() => {
    initiatePusher()
    return () => {
      // if (chatchannel?.current) {
      //   chatchannel?.current?.unsubscribe()
      // }
      database().ref("/drivers/" + rideDetails?.driver?.id).off()

    }
  }, [rideDetails?.id])


  const initiatePusher = () => {
    let pusher = new Pusher('ba024c85e694c4822cf6', { cluster: 'ap2' });
    chatchannel.current = pusher.subscribe(rideDetails?.id?.toString());
    chatchannel.current.bind('App\\Events\\CompleteRideEvent', data => {
      if (rideDetails?.id == data?.data?.id) {
        if (data?.data?.status == 'completed') {
          dispatch(RideActions.getRideDetails(data?.data))
          navigation.navigate('RateYourDriver')
        }
      }
    });
    chatchannel.current.bind('App\\Events\\StartRideEvent', data => {
      if (rideDetails?.id == data?.data?.id) {
        if (data?.data?.driver_status == 'started') {
          dispatch(RideActions.getRideDetails(data?.data))
          setisCancel(true)
        }
      }
    });

  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", BackPress)
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", BackPress)
    }
  }, [])

  const BackPress = () => {
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

  const cancelRide = () => {
    dispatch(RideMiddleware.cancelRide(rideDetails.id))
      .then((data) => {
        navigation.navigate('RiderDashBoard')
        setModalVisible(false);
      }
      )
      .catch((error) => setModalVisible(false))
  }

  const renderLocationList = ({ item, index }) => {
    return (
      <View style={styles.Location_Item_Style}>

        <View>
          <MaterialCommunityIcons
            name={item?.pickup ? 'circle-slice-8' : 'map-marker'}
            color={Colors.BLUE}
            size={30}
          />
          {index < Locations.length - 1 ?
            <DashedLine
              dashLength={5}
              dashThickness={5}
              dashStyle={{ borderRadius: 5 }}
              dashGap={5}
              dashColor={Colors.LIGHT_GRAY}
              axis='vertical'
              style={{ height: 30, alignSelf: 'center', top: 12 }} />
            :
            null}
        </View>

        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <TextComponent
            text={index == 0 ? 'Pickup Location' : 'Drop-Off Location'}
            style={{ fontWeight: 'bold', fontSize: 16 }}
          />
          <TextComponent style={{ color: Colors.LIGHT_GRAY }} numberOfLines={4} text={item?.address} />
        </View>
        <View style={{ width: '25%', alignItems: 'center' }}>
          {item?.user_children_id ?
            <TextComponent style={{ fontWeight: 'bold', fontSize: 12 }} text={item?.children?.first_name + " " + item?.children?.last_name} />
            :
            <TextComponent style={{ fontWeight: 'bold', fontSize: 12 }} text={index == 0 ? 'Pickup' : 'Drop-Off'} />
          }
        </View>
      </View>
    )
  }

  const renderContent = () => (
    // <ScrollView showsVerticalScrollIndicator={false}>
    <View
      style={{
        backgroundColor: 'white',
        minHeight: 420,
      }}>
      <View style={{ width: '90%', alignSelf: 'center', alignItems: 'center' }}>

        <TextComponent
          text={rideDetails?.driver_status != "started" ? `Arriving in ${rideDetails?.time_and_distance}` : 'Ride has been started'}
          style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}
        />

        <View style={styles.Bottom_Sheet_Sub_View_Style}>
          <TouchableOpacity
          // onPress={() => navigation.navigate('RateYourDriver')}
          >
            <Image
              source={CarSide}
              style={{ height: 100, width: 100, resizeMode: 'contain' }}
            />
          </TouchableOpacity>

          <Text style={{ color: Colors.BLUE, fontWeight: 'bold', fontSize: 20 }}>{`$${rideDetails?.estimated_price}`}</Text>

        </View>
        <View style={styles.Bottom_Sheet_Sub_View_Style}>

          <TextComponent
            text={`${rideDetails?.driver?.vehicle?.license_plate} | ${rideDetails?.driver?.vehicle?.vehicle_brand} ${rideDetails?.driver?.vehicle?.booking_type}`}
            style={{ fontWeight: 'bold' }}
          />

          <TextComponent
            text={'Approx Fare'}
            style={{ fontWeight: 'bold' }}
          />

        </View>
      </View>

      <View style={{ marginVertical: 10, height: 150 }}>
        <FlatList
          data={Locations}
          keyExtractor={id => id?.id}
          renderItem={renderLocationList}
        />
      </View>

      <View style={styles.Location_Item_Style}>

        <MaterialCommunityIcons
          name='calendar-month'
          color={Colors.BLUE}
          size={30}
        />

        <Text style={{ color: Colors.LIGHT_GRAY, flex: 1, paddingHorizontal: 10, fontSize: 17 }}>{moment().format('llll')}</Text>
        {rideDetails?.driver_status != "started" ?
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{ backgroundColor: Colors.BLUE, borderRadius: 10 }}>
            <Text style={{ color: Colors.WHITE_2, fontWeight: 'bold', paddingVertical: 7, paddingHorizontal: 30 }}>Cancel</Text>
          </TouchableOpacity>
          : null}
      </View>


    </View>
    // </ScrollView>
  );

  return (
    <View style={styles.Main_Container}>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onMapReady={() => {
          database().ref("/drivers/" + rideDetails?.driver?.id).on('value', (data) => {
            let response = data?.toJSON()
            setheading(response?.heading)
            // mapRef.current.animateCamera({ heading: response?.heading })
            //  markerRef.current.animateMarkerToCoordinate({ latitude: response?.latitude, longitude: response?.longitude })
            location.current.timing(
              {
                latitude: response.latitude,
                longitude: response.longitude,
                duration: 2000
              }
            ).start()
          })
        }}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: parseFloat(Locations[0]?.latitude),
          longitude: parseFloat(Locations[0]?.longitude),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* <Marker
          coordinate={{
            latitude: parseFloat(Locations[0]?.latitude),
            longitude: parseFloat(Locations[0]?.longitude)
          }}
          title={'here'}
          description={'I am /Here'}
        /> */}
        <Marker coordinate={{
          latitude: parseFloat(Locations[Locations.length - 1]?.latitude),
          longitude: parseFloat(Locations[Locations.length - 1]?.longitude)
        }}>
          {/* <View>
            <Image source={CarMarker} style={styles.Marker_Icon_Style} />
          </View> */}
        </Marker>

        <MapViewDirections
          origin={{
            latitude: parseFloat(Locations[0]?.latitude),
            longitude: parseFloat(Locations[0]?.longitude),
          }}
          waypoints={Locations?.length > 2 ? Locations?.map(val => { return ({ latitude: parseFloat(val.latitude), longitude: parseFloat(val.longitude) }) }) : []}

          destination={{
            latitude: parseFloat(Locations[Locations.length - 1]?.latitude),
            longitude: parseFloat(Locations[Locations.length - 1]?.longitude)
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor="black"
          optimizeWaypoints={true}
        />
        <Marker.Animated
          anchor={{ x: 0.5, y: 0.4 }}
          flat
          ref={markerRef}
          coordinate={location.current}>
          <View style={{ transform: [{ rotate: (heading + -100) + "deg" }] }}>
            <Image
              source={Car}
              style={{ width: 50, height: 50, resizeMode: 'contain' }}
            />
          </View>
        </Marker.Animated>

        {/* <Marker
          anchor={{ x: 0.5, y: 0.4 }}
          flat
          ref={markerRef}
          coordinate={{ latitude: parseFloat(Locations[0]?.latitude), longitude: parseFloat(Locations[0]?.longitude) }}>
          <View style={{ transform: [{ rotate: (heading + -100) + "deg" }] }}>
            <Image
              source={Car}
              style={{ width: 50, height: 50, resizeMode: 'contain' }}
            />
          </View>
        </Marker> */}
      </MapView>

      <View style={{ position: 'absolute', width: '100%' }}>
        <Header headerLeft={true} onPressLeft={() => navigation.navigate('RiderDashBoard')} />
      </View>

      <View style={styles.Emergency_Button_View}>
        <TouchableOpacity
          onPress={() => onPressEmergency(rideDetails?.driver?.phone)}
          style={styles.Emergency__red}>
          <Text style={styles.txt}>Emergency</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet
        initialSnap={0}
        ref={sheetRef}
        snapPoints={[420, 25, 0]}
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
        description={'Do you want to cancel your ride?'}
        notvisible={() => setModalVisible(false)}
        onPressbuttonOne={() => {
          cancelRide()
        }}
        onPressbuttonTwo={() => {
          setModalVisible(false);
        }}
      />


    </View>
  );
};

const styles = StyleSheet.create({
  Main_Container: {
    flex: 1,
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
  Bottom_Sheet_Sub_View_Style: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  Location_Item_Style: {
    width: '85%',
    alignSelf: 'center',
    marginVertical: 7,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  Emergency_Button_View: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: 10,
    right: 10,
    borderRadius: 50,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE_2,
  },
  Emergency__red: {
    backgroundColor: Colors.RED,
    padding: 20,
    width: 90,
    height: 90,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: 8,
    fontWeight: 'bold',
    color: Colors.WHITE_2,
  },
});
export default ArriveRider;