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
} from 'react-native';
import Header from '../../../components/Header';
import { Colors } from '../../../Styles';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
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
import { GOOGLE_MAPS_APIKEY, img_url } from '../../../configs/APIs';
import { useDispatch, useSelector } from 'react-redux'
import { RideMiddleware } from '../../../redux/Middlewares/RideMiddleware';
import RideActions from '../../../redux/Actions/RideActions'
import AlertAction from '../../../redux/Actions/AlertActions';
import PaymentActions from '../../../redux/Actions/PaymentActions'
import Pusher from 'pusher-js/react-native';
import MapViewDirections from 'react-native-maps-directions';




const ConfirmBooking = (props) => {
  const rideDetails = useSelector((state) => state.Ride.rideDetails)
  const user = useSelector((state) => state.Auth.user)
  const selectedPayment = useSelector((state) => state.Payment.selectedPaymentMethod)
  const recent = props?.route?.params?.params?.params.data
  const scheduleRide = recent
  const [Price, setPrice] = useState('$20.20');
  const [VehicalType, setVehicalType] = useState('Car');
  const [messageCount, setMessageCount] = useState(0)
  const [ShowBottomSheet, setShowBottomSheet] = useState(0)
  const sheetRef = React.useRef(null);
  const dispatch = useDispatch()

  const chatchannel = useRef(null)

  useEffect(() => {
    initiatePusher()
    return () => {
      // if (chatchannel?.current) {
      //   chatchannel?.current?.unsubscribe()
      // }
      dispatch(PaymentActions.selectedPaymentmethod(null))
    }
  }, [rideDetails?.id])


  const initiatePusher = () => {
    let pusher = new Pusher('ba024c85e694c4822cf6', { cluster: 'ap2' });
    chatchannel.current = pusher.subscribe(rideDetails?.id?.toString());
    chatchannel.current.bind('App\\Events\\Message', data => {
      if (rideDetails?.id == data?.ride_id) {
        if (data?.data?.from_user?.id != user?.user?.id) {
          setMessageCount(count => parseInt(count + 1))
        }
      }
    });
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
  ]);
  const [ModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

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
            <TextComponent text={index == 0 ? 'Pickup Location' : 'Drop-Off Location'} />
            <TextComponent text={item?.address} numberOfLines={4} />
          </View>
          <View style={{ alignItems: 'flex-end', width: '25%' }}>
            {item?.user_children_id ?
              <TextComponent style={{ fontSize: 12 }} text={item?.children?.first_name + " " + item?.children?.last_name} />
              : null}
            <TextComponent style={{ fontSize: 12 }} text={index == 0 ? 'Pickup' : 'Drop-Off'} />
          </View>
        </View>
        {index < Locationlist.length - 1 ? (
          <DashedLine
            dashLength={5}
            dashThickness={5}
            dashStyle={{ borderRadius: 5 }}
            dashGap={5}
            dashColor={Colors.LIGHT_GRAY}
            axis="vertical"
            style={{
              width: '80%',
              height: 30,
              alignSelf: 'center',
              marginVertical: 5,
            }}
          />
        ) : null}
      </View>
    );
  };

  const confirmSchedule = () => {
    dispatch(AlertAction.ShowAlert({ title: "Ride Booking", message: "Your Schedule Has Been Confirmed" }))
    navigation.navigate('RiderDashBoard')
  }

  const renderContent = () => (
    <ScrollView
      style={{
        backgroundColor: 'white',
      }}>
      <View style={{ width: '90%', alignSelf: 'center', alignItems: 'center' }}>
        {/* <TextComponent
          text={'Your ride is arriving in'}
          style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}
        />
        <TextComponent
          text={'5 minutes'}
          style={{ fontWeight: 'bold', fontSize: 25, textAlign: 'center' }}
        /> */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileAndRating', { user_id: rideDetails?.driver_id })}>
          <Image
            source={rideDetails?.driver?.image ? { uri: img_url + rideDetails?.driver?.image } : Person3}
            style={{
              height: 100,
              width: 100,
              borderRadius: 50,
              resizeMode: 'contain',
              marginVertical: 10,
            }}
          />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              height: 15,
              width: 15,
              borderRadius: 7.5,
              backgroundColor: Colors.ORANGE,
            }}
          />
          <TextComponent
            text={rideDetails?.driver?.username}
            style={{ fontWeight: 'bold', fontSize: 20, paddingHorizontal: 5 }}
          />
        </View>
        <TextComponent
          text={`${rideDetails?.driver?.vehicle?.license_plate} | ${rideDetails?.driver?.vehicle?.vehicle_brand} ${rideDetails?.driver?.vehicle?.booking_type}`}
          style={{ fontWeight: 'bold', fontSize: 16 }}
        />

        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
          <TouchableOpacity onPress={() => createChatSessions()}>
            {messageCount != 0 ?
              <View
                style={{
                  height: 22,
                  width: 22,
                  borderRadius: 20,
                  backgroundColor: Colors.ORANGE,
                  position: 'absolute',
                  zIndex: 99,
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: -10,
                  left: -5
                }}
              >
                <Text style={{ color: Colors.WHITE, fontSize: 11 }}>{messageCount}</Text>
              </View>
              : null}
            <MaterialCommunityIcons
              name="message-text"
              size={30}
              color={Colors.BLUE}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPressEmergency(rideDetails?.driver?.phone)}>
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
        data={rideDetails?.ride_locations}
        keyExtractor={item => item?.id}
        renderItem={renderLocationList}
      />

      <View style={styles.Price_Main_Value_Style}>
        <Text style={styles.Price_Text_Style}>Estimated Price</Text>
        <Text style={styles.Price_Text_Style}>
          {`$${rideDetails?.estimated_price}`} ({rideDetails?.driver?.vehicle_type})
        </Text>
      </View>

      <View style={{ top: 15 }}>
        {rideDetails?.ride_for.toString() == 'self' ?
          <SubmitButton
            text={'Payment Method'}
            onPress={() => navigation.navigate('PaymentByCard')}
            icon={true}
            iconname={'chevron-right'}
          />
          : null}
      </View>
      {scheduleRide?.ScheduleType == 'schedule' ?
        <SubmitButton
          text={'Confirm Booking'}
          onPress={() => confirmSchedule()}
          icon={true}
          iconname={'checkbox-marked-circle'}
        /> :
        <SubmitButton
          text={'Confirm Booking'}
          onPress={() => setModalVisible(true)}
          icon={true}
          iconname={'checkbox-marked-circle'}
        />}
    </ScrollView>
  );

  const confirmBooking = (confirm) => {
    if (!selectedPayment && rideDetails.ride_for.toString() == 'self' && confirm == 1) {
      setModalVisible(false)
      dispatch(AlertAction.ShowAlert({ title: 'Add Payment', message: 'Please select payment method' }))
      return;
    }
    let data = {
      ride_id: rideDetails?.id,
      confirm: confirm,
      payment_method_id: selectedPayment ? selectedPayment?.id : null
    }
    dispatch(RideMiddleware.confirmBooking(data))
      .then((data) => {
        setModalVisible(false);
        if (confirm == 1) {
          dispatch(RideActions.getRideDetails(data))
          navigation.navigate('ArriveRider')
        } else {
          navigation.goBack()
          return;
        }
      }
      )
      .catch(() => setModalVisible(false))

  }

  const createChatSessions = () => {
    setMessageCount(0)
    navigation.navigate('ChatList', { chat_list_id: rideDetails?.id, userDetails: rideDetails?.driver })
    // dispatch(ChatMiddleware.createChatSession(rideDetails.driver.id))
    //   .then((data) => navigation.navigate('ChatList', { chat_list_id: data?.id, userDetails: rideDetails?.driver }))
    //   .catch()
  }


  return (
    <View style={styles.Main_Container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        // showsUserLocation={true}
        // showsMyLocationButton={true}
        style={{ flex: 1 }}
        region={{
          latitude: parseFloat(rideDetails?.ride_locations[0]?.latitude),
          longitude: parseFloat(rideDetails?.ride_locations[0]?.longitude),
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}>
        <Marker coordinate={{ latitude: parseFloat(rideDetails?.ride_locations[0]?.latitude), longitude: parseFloat(rideDetails?.ride_locations[0]?.longitude) }} />
        <MapViewDirections
          origin={{
            latitude: parseFloat(rideDetails?.ride_locations[0]?.latitude),
            longitude: parseFloat(rideDetails?.ride_locations[0]?.longitude),
          }}
          waypoints={rideDetails?.ride_locations?.length > 2 ? rideDetails?.ride_locations?.map(val => { return ({ latitude: parseFloat(val.latitude), longitude: parseFloat(val.longitude) }) }) : []}

          destination={{
            latitude: parseFloat(rideDetails?.ride_locations[rideDetails?.ride_locations?.length - 1]?.latitude),
            longitude: parseFloat(rideDetails?.ride_locations[rideDetails?.ride_locations?.length - 1]?.longitude)
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor="black"
          optimizeWaypoints={true}
        />
        <Marker coordinate={{
          latitude: parseFloat(rideDetails?.ride_locations[rideDetails?.ride_locations?.length - 1]?.latitude),
          longitude: parseFloat(rideDetails?.ride_locations[rideDetails?.ride_locations?.length - 1]?.longitude)
        }} />

      </MapView>
      <View style={{ position: 'absolute', width: '100%' }}>
        <Header headerLeft={true} />
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

      <ConfirmedBookingModal
        visible={ModalVisible}
        buttonOneText={'Done'}
        buttonTwoText={'Cancel'}
        title={'Booking Confirmed'}
        description={'Your booking is confirmed, Our\n driver will reach your location \n shortly'}
        notvisible={() => setModalVisible(false)}
        onPressbuttonOne={() => {
          confirmBooking(1)
        }}
        onPressbuttonTwo={() => {
          confirmBooking(0)
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
    top: 10,
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
export default ConfirmBooking;
