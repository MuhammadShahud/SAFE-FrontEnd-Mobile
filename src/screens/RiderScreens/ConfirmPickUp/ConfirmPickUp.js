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
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Car1 from '../../../assets/driver/Car.png';
import Person3 from '../../../assets/driver/Person3.png';
import Animated, { log } from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import TextComponent from '../../../components/TextComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SubmitButton from '../../../components/SubmitButton';
import ThreeDots from '../../../components/ThreeDots';
import StartRideModal from '../../../components/StartRideModal';
import { useNavigation } from '@react-navigation/native';
import Car from '../../../assets/rider/Car.png'
import Suv from '../../../assets/rider/Suv.png'
import Van from '../../../assets/rider/Van.png'
import DashedLine from 'react-native-dashed-line'
import SearchRideModal from '../../../components/SearchRideModal'
import { useDispatch, useSelector } from 'react-redux'
import { RideMiddleware } from '../../../redux/Middlewares/RideMiddleware';
import Pusher from 'pusher-js/react-native';
import RideActions from '../../../redux/Actions/RideActions'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ConfirmPickUp = (props) => {
  const [ModalVisible, setModalVisible] = useState(false)

  const navigation = useNavigation();
  const Schedule = useSelector((state) => state.Ride.scheduleRide);
  const params = props?.route?.params;
  const scheduleRide = params?.params?.data
  const data = props?.route.params.params.data
  const sheetRef = useRef(null);
  const [ShowBottomSheet, setShowBottomSheet] = useState(0)
  const [ride_id, setride_id] = useState()
  const chatchannel = useRef(null)

  const dispatch = useDispatch()

  // useEffect(() => {
  //   return () => {
  //     if (chatchannel?.current) {
  //       chatchannel?.current.unsubscribe()
  //     }
  //   }
  // }, [ride_id])


  const initiatePusher = (ride_id) => {
    let pusher = new Pusher('ba024c85e694c4822cf6', { cluster: 'ap2' });
    chatchannel.current = pusher.subscribe(ride_id.toString());
    chatchannel.current.bind('App\\Events\\AcceptRideEvent', data => {
      if (ride_id == data?.data?.id) {
        if (data?.data?.status == "canceled") {
          setModalVisible(false);
          return
        } else if (data?.data?.status == "accepted") {
          dispatch(RideActions.getRideDetails(data?.data))
          navigation.navigate('ConfirmBooking', { params })
          setModalVisible(false)
        } else {
          return
        }
      }
    });
  }

  const renderPickupList = ({ item, index }) => {
    return (
      <View>
        <View style={styles.List_Item_Style}>
          <MaterialCommunityIcons
            name="map-marker"
            size={30}
            color={Colors.BLUE}
          />

          <View style={{ flex: 1, marginHorizontal: 5 }}>
            <TextComponent text={index == 0 ? 'Pickup Location' : 'Drop-Off Location'} style={{ fontWeight: 'bold', paddingBottom: 5 }} />
            <TextComponent text={item?.Address} style={{ color: Colors.BLACK }} numberOfLines={4} />
          </View>

          <View style={{ alignItems: 'center', width: index != 0 ? '40%' : null }}>
            {item?.child_name ? <TextComponent text={item?.child_name} style={{ fontWeight: 'bold', fontSize: 12 }} /> : null}

            {index == 0 ? null : <TouchableOpacity onPress={() => navigation.navigate('Recent', { type: data?.type, header: data?.header })}
              style={{ backgroundColor: Colors.BLUE, padding: 10, borderRadius: 10, marginTop: 5 }}
            >
              <Text style={{ color: Colors.WHITE_2, fontWeight: 'bold' }}>Add or Change</Text>
            </TouchableOpacity>}
          </View>
        </View>
        {index < params?.address.length - 1 ?
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
    )
  }

  const renderContent = () => (
    <View style={{ backgroundColor: 'white', height: 400 }}>

      <View style={{ width: '90%', alignSelf: 'center' }}>
        <TextComponent
          text={'Confirm Your Pick-up Spot'}
          style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}
        />
      </View>

      <View style={{ height: 250 }}>
        <FlatList
          data={params?.address}
          keyExtractor={item => item?.Address}
          renderItem={renderPickupList}
        />
      </View>

      <SubmitButton
        text={'Confirm Pick-up'}
        onPress={() => bookRide()}
        icon={true}
        iconname={'car-sports'}
      />

    </View>
  );

  const bookRide = () => {
    setModalVisible(true)
    let structuredData = {
      Locations: [...params.address],
      type: data.type,
      vehicle_type: params.selectedType.name,
      scheduletype: scheduleRide?.ScheduleType == 'schedule' ? 'schedule' : 'normal',
      total_distance: params.totalDistance,
      total_time: params.totalTime,
      total_price: params.selectedType.price,
      schedule_start_time: scheduleRide?.ScheduleType == 'schedule' ? Schedule?.timestamp : null
    }
    dispatch(RideMiddleware.rideBooking(structuredData))
      .then(async (data) => {
        await AsyncStorage.setItem("@ride", JSON.stringify(data))
        setride_id(data?.ride.id)
        initiatePusher(data?.ride.id)
      })
      .catch(() => setModalVisible(false))
  }

  const cancelRide = () => {
    dispatch(RideMiddleware.cancelRide(ride_id))
      .then((data) => {
        setModalVisible(false);
      }
      )
      .catch(() => setModalVisible(false))
  }

  return (
    <View style={styles.Main_Container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        style={{ flex: 1 }}
        region={{
          latitude: 37.7323,
          longitude: -122.4324,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        <Marker coordinate={{ latitude: 37.7323, longitude: -122.4324 }}>
          <View>
            <Image source={Car1} style={styles.Marker_Icon_Style} />
          </View>
        </Marker>
      </MapView>
      <View style={{ position: 'absolute', width: '100%' }}>
        <Header headerLeft={true} />
      </View>
      <BottomSheet
        initialSnap={0}
        ref={sheetRef}
        snapPoints={[400, 25, 0]}
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

      <SearchRideModal
        visible={ModalVisible}
        // onPress={() => {
        //   setModalVisible(false)
        // }}
        notvisible={() => {
          cancelRide()
        }}
        title={'Searching Ride'}
        description={'Hold on! we are searching for\n nearby driver for you'}
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
    padding: 15,
  },
});
export default ConfirmPickUp;