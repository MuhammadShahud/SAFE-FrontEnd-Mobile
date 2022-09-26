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
  ActivityIndicator
} from 'react-native';
import Header from '../../../components/Header';
import { Colors } from '../../../Styles';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Car1 from '../../../assets/driver/Car.png';
import Person3 from '../../../assets/driver/Person3.png';
import Animated from 'react-native-reanimated';
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
import { useDispatch, useSelector } from 'react-redux'
import { MapLocationMiddleware } from '../../../redux/Middlewares/MapLocationMiddleware';
import AlertAction from '../../../redux/Actions/AlertActions';

const ChooseYourRide = (props) => {

  const navigation = useNavigation();
  const params = props?.route?.params
  const [ShowBottomSheet, setShowBottomSheet] = useState(0)
  const [totalDistance, settotalDistance] = useState()
  const [totalTime, settotalTime] = useState()
  const [selectedType, setselectedType] = useState()
  const [address, setaddress] = useState()
  const sheetRef = React.useRef(null);

  const dispatch = useDispatch()
  const ridetypes = useSelector((state) => state.Ride.ridestypes)

  useEffect(() => {
    fetchRides();
  }, [])


  const fetchRides = () => {
    let Locations = [...params?.DropOffList]
    Locations.unshift(params.Pickup)
    setaddress(Locations)
    dispatch(MapLocationMiddleware.calculateDistance(Locations))
      .then((data) => {
        if (data) {
          settotalDistance(data.total_distance), settotalTime(data.total_time)
        } else {
          navigation.goBack()
        }
      }
      )
  }


  const renderRideList = ({ item, index }) => {
    return (

      <TouchableOpacity style={styles.Ride_Item_Style} key={index} onPress={() => setselectedType(item)}>

        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Image
            source={
              item?.name?.toLowerCase() == 'car' ?
                Car :
                item?.name.toLowerCase() == 'suv' ? Suv : Van}
            style={{ height: 50, width: 50, resizeMode: 'contain', tintColor: item.name == selectedType?.name ? Colors.ORANGE : Colors.BLUE }}
          />
          <View style={{ flex: 1, marginHorizontal: 10 }}>
            <TextComponent
              text={item?.name}
              style={{ fontWeight: 'bold', fontSize: 20 }}
            />
            {/* <TextComponent
              text={item?.persons}
              style={{ fontWeight: 'bold' }}
            /> */}
          </View>
        </View>

        <Text style={{ color: Colors.BLUE, fontWeight: 'bold', fontSize: 20 }}>{`$${item?.price}`}</Text>
      </TouchableOpacity>

    )
  }

  const renderContent = () => (
    <View style={{ backgroundColor: 'white', height: 450 }}>

      <View style={{ width: '75%', alignSelf: 'center' }}>
        <TextComponent
          text={'Select Your Ride?'}
          style={{ fontWeight: 'bold', fontSize: 20 }}
        />
      </View>

      <View>
        {ridetypes ?
          <FlatList
            data={ridetypes.total_prices}
            keyExtractor={item => item.name}
            renderItem={renderRideList}
          />
          :
          <View style={{ height: 200, justifyContent: 'center' }}>
            <ActivityIndicator size={'large'} color={Colors.BLACK} />
          </View>
        }
      </View>

      <SubmitButton
        text={'Book a ride'}
        onPress={() => selectedType ? navigation.navigate('ConfirmPickUp', { params, address, selectedType, totalDistance, totalTime }) :
          dispatch(AlertAction.ShowAlert({ title: "Select Ride Type", message: "Please Select Ride Type" }))

        }
        icon={true}
        iconname={'car-sports'}
      />

    </View>
  );

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
        <Header headerLeft={true} title={'Choose your ride'} />
      </View>
      <BottomSheet
        initialSnap={0}
        ref={sheetRef}
        snapPoints={[450, 25, 0]}
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
  Ride_Item_Style: {
    backgroundColor: Colors.WHITE,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    elevation: 2,
    marginVertical: 7,
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
export default ChooseYourRide;