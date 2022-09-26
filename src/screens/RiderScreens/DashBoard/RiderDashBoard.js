import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, RefreshControl } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Header from '../../../components/Header';
import { Colors } from '../../../Styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Car from '../../../assets/rider/CarMarker.png';
import Home from '../../../assets/rider/Home.png';
import Arrivals from '../../../assets/rider/Arrivals.png';
import Recent from '../../../assets/rider/Recent.png';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation } from '@react-navigation/native';
import StartRideModal from '../../../components/StartRideModal';
import CompleteProfileModal from '../../../components/CompleteProfileModal';
import BottomSheet from 'reanimated-bottom-sheet'
import SubmitButton from '../../../components/SubmitButton';
import TextComponent from '../../../components/TextComponent';
import CalendarModal from '../../../components/CalendarModal';
import moment from 'moment'
import DatePicker from 'react-native-date-picker'
import { useSelector, useDispatch } from 'react-redux'
import { RideMiddleware } from '../../../redux/Middlewares/RideMiddleware';
import RideActions from '../../../redux/Actions/RideActions';
import { currentLocation } from '../../../configs/getCompleteAddress'
import LocationAction from '../../../redux/Actions/LocationActions';
import AlertAction from '../../../redux/Actions/AlertActions';
import Pusher from 'pusher-js/react-native';
import { base_url } from '../../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'
import { DriverMiddleware } from '../../../redux/Middlewares/DriverMiddleware';


const RiderDashBoard = () => {
  const navigation = useNavigation();
  const [bottom, setBottom] = useState(1);
  const [WhereToSearch, setWhereToSearch] = useState('')
  const [Status, setStatus] = useState('Now');
  const StatusList = ['Now', 'Later'];
  const [ModalVisible, setModalVisible] = useState(true);
  const [CalendarModalVisible, setCalendarModalVisible] = useState(false);
  const [ForWhom, setForWhom] = useState('Self')
  const sheetRef = useRef(null);
  const date = new Date()
  const [DateTimeList, setDateTimeList] = useState([])
  const [showTimePicker, setshowTimePicker] = useState(false);
  const [RideTypeModal, setRideTypeModal] = useState(false)
  const [SeletedDate, setSeletedDate] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const chatchannel = useRef(null)
  const [driverlocations, setdriverlocations] = useState([])

  const user = useSelector(state => state.Auth.user)
  const [locations, setlocations] = useState({
    latitude: 36.778259,
    longitude: -119.417931
  })
  const dispatch = useDispatch()

  const renderDateTimeList = ({ item }) => {
    return (
      <View style={style.Date_Time_List_Item_Style}>
        <View style={style.Dot_Style} />
        <View style={{ width: '100%' }}>
          <TextComponent
            text={moment(item).format('ddd , MMM D , yyyy | hh:mm A')}
            style={{ fontWeight: '500' }}
          />
        </View>
        {/* <View style={style.Vertical_Line_Style} />
        <TextComponent
          text={item?.time}
          style={{ fontWeight: '500' }}
        /> */}
      </View>
    )
  }

  const ScheduleRide = () => {
    if (DateTimeList.length > 0) {
      let data = {
        type: ForWhom,
        ScheduleType: 'schedule',
        timestamp: moment(DateTimeList[0]).format('YYYY-MM-DD HH:mm:ss')
      }
      dispatch(RideActions.getScheduleRide(data))
      sheetRef.current.snapTo(1)
      navigation.navigate('Recent', { type: ForWhom, header: 'Select Address', ScheduleType: 'schedule' })
      setDateTimeList([])
    } else {
      dispatch(AlertAction.ShowAlert({ title: "Warning", message: "Please Select Time", status: "error" }))
    }
  }

  const renderContent = () => (
    <View style={style.Bottom_Sheet_Main_View}>

      <View style={style.Bottom_Sheet_Sub_View}>
        <TextComponent
          text={'Schedule a trip'}
          style={{ fontWeight: 'bold', fontSize: 30 }}
        />

        <TextComponent
          text={'For whom, you want to book a ride?'}
          style={style.Text_Style}
        />

        <View style={{ width: '80%', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
          <TouchableOpacity
            onPress={() => setForWhom('Self')}
            style={[style.Ride_Type_Button_View, { backgroundColor: ForWhom == 'Self' ? Colors.BLUE : Colors.WHITE }]}>
            <Text style={{ color: ForWhom == 'Self' ? Colors.WHITE_2 : Colors.BLUE, fontWeight: 'bold' }}>My Self</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setForWhom('Children')}
            style={[style.Ride_Type_Button_View, { backgroundColor: ForWhom == 'Children' ? Colors.BLUE : Colors.WHITE }]}>
            <Text style={{ color: ForWhom == 'Children' ? Colors.WHITE_2 : Colors.BLUE, fontWeight: 'bold' }}>For Children</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ width: '80%', alignSelf: 'center' }}>
        <TextComponent
          text={'Select Date and Time'}
          style={style.Text_Style}
        />
        <TouchableOpacity
          onPress={() => {
            setCalendarModalVisible(true)
          }}
          style={style.Date_Time_Button_Style}>
          <Ionicons name='calendar' size={25} color={Colors.BLUE} />
          <MaterialCommunityIcons name='clock' size={25} color={Colors.BLUE} />
          <TextComponent
            text={'Select Date and Time'}
            style={style.Text_Style}
          />
          <MaterialCommunityIcons name='chevron-right' size={25} color={Colors.BLACK} />
        </TouchableOpacity>
      </View>

      <View style={{ marginVertical: 7, height: 80 }}>
        <FlatList
          data={DateTimeList}
          keyExtractor={item => item}
          renderItem={renderDateTimeList}
        />
      </View>
      <SubmitButton text={'Schedule'} onPress={() => ScheduleRide()} icon={true} iconname={'check-circle'} />

    </View>
  );

  const latestRide = () => {
    dispatch(RideMiddleware.getRiderLatestRide())
      .then((data) => {
        dispatch(RideActions.getRideDetails(data))
        if (data.status == "accepted") {
          navigation.navigate('ConfirmBooking', { params: { params: { data: { ScheduleType: data.ride_for } } } })
        } else {
          navigation.navigate('ArriveRider', { params: { price: data?.estimated_price }, isCancel: true })
        }
      })
      .catch()
    setRefreshing(false)

  }

  const fetch = () => {
    initiatePusher()
    latestRide()
    currentLocation()
      .then(data => {
        dispatch(LocationAction.currentLocation(data)),
          setlocations({
            latitude: data?.latitude,
            longitude: data?.longitude
          }),
          dispatch(DriverMiddleware.driversLocation({
            latitude: data?.latitude,
            longitude: data?.longitude
          })).then((data) => setdriverlocations(data))
            .catch()
      })
      .catch()
    let newdate = moment(date).format('YYYY-MM-DD')
    setSeletedDate(newdate)

  }

  useEffect(() => {
    fetch()
    if (user?.user?.image) {
      setModalVisible(false)
    }
  }, [])


  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      currentLocation()
        .then(data => {
          dispatch(LocationAction.currentLocation(data)),
            setlocations({
              latitude: data?.latitude,
              longitude: data?.longitude
            }),
            dispatch(DriverMiddleware.driversLocation({
              latitude: data?.latitude,
              longitude: data?.longitude
            })).then((data) => setdriverlocations(data))
              .catch()
        })
        .catch()
    })

    return unsubscribe;
  }, [])

  const addDateTime = (time) => {
    let formatTime = moment(time).format()
    let newtime = formatTime.toString().split("T")
    let newdate = SeletedDate + "T" + newtime[1]
    setDateTimeList([newdate])
  }

  const initiatePusher = async () => {
    let ride = await AsyncStorage.getItem('@ride')
    let data = JSON.parse(ride)
    if (data) {
      let ride_id = data?.ride?.id
      let pusher = new Pusher('ba024c85e694c4822cf6', { cluster: 'ap2' });
      chatchannel.current = pusher.subscribe(ride_id?.toString());
      chatchannel.current.bind('App\\Events\\AcceptRideEvent', data => {
        if (ride_id == data?.data?.id) {
          if (data?.data?.status == "canceled") {
            return
          } else if (data?.data?.status == "accepted") {
            dispatch(RideActions.getRideDetails(data?.data))
            navigation.navigate('ConfirmBooking', { params: { params: { data: { ScheduleType: data.ride_for } } } })
          } else {
            return
          }
        }
      });
    }
  }


  return (
    <View style={style.Main_Container}>
      <Header
        headerRight={true}
        headerLeft={true}
        title={`Hi! ${user?.user?.username}`}
        drawer={true}
      />
      {/* <RefreshControl
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          latestRide();
        }}> */}
      <View>
        <ScrollView refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            latestRide();
          }} />}>
          <View style={{ backgroundColor: Colors.WHITE }}>

            <Text style={style.Online_Text}>Where are you going?</Text>
            <View style={style.Search_Main_View}>

              <View style={style.Search_Sub_View}>
                <MaterialIcons name='search' color={Colors.BLACK} size={30} />
              </View>

              <View style={style.TextInput_Main_View}>
                <TouchableOpacity
                  onPress={() =>
                    Status == 'Now' ?
                      navigation.navigate('Recent', { type: 'Self', header: 'Select Address', ScheduleType: 'normal' })
                      : sheetRef.current.snapTo(0)
                  }
                  style={{ backgroundColor: Colors.LIGHT_GRAY_2, borderRadius: 10, width: '50%', height: 45, justifyContent: 'center' }}
                >
                  <Text style={{ fontSize: 14, color: Colors.BLACK }}>Where to</Text>
                </TouchableOpacity>

                <SelectDropdown
                  data={StatusList}
                  onSelect={(selectedItem, index) => {
                    setStatus(selectedItem);
                    if (selectedItem == 'Now') {
                      navigation.navigate('Recent', { type: 'Self', header: 'Select Address', ScheduleType: 'normal' })
                    } else {
                      sheetRef.current.snapTo(0)
                    }

                  }}
                  defaultValue={'Now'}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  buttonStyle={{
                    backgroundColor: Colors.LIGHT_GRAY_2,
                    borderColor: Colors.BLACK_2,
                    borderWidth: 1.5,
                    borderRadius: 10,
                    width: 120,
                    height: 35,
                  }}
                  renderDropdownIcon={() => {
                    return (
                      <View>
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          color={Colors.BLUE}
                          size={25}
                        />
                      </View>
                    );
                  }}
                />
              </View>

            </View>


          </View>
        </ScrollView>
      </View>
      {/* </RefreshControl> */}
      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={true}
          // loadingEnabled={true}
          style={{ flex: 1, marginBottom: bottom }}
          region={{
            latitude: locations?.latitude,
            longitude: locations?.longitude,
            latitudeDelta: 0.07,
            longitudeDelta: 0.08,
          }}
          onMapReady={() => setBottom(0)}>

          {driverlocations?.length > 0 && driverlocations.map((locations, index) => {
            return (
              <Marker key={index} coordinate={{ latitude: parseFloat(locations?.latitude), longitude: parseFloat(locations?.longitude) }}>
                <View>
                  <Image
                    source={Car}
                    style={{ width: 50, height: 50, resizeMode: 'contain' }}
                  />
                </View>
              </Marker>
            )
          })}
        </MapView>
        <TouchableOpacity style={style.My_Location_Button}>
          <MaterialIcons name="my-location" color={Colors.BLUE} size={25} />
        </TouchableOpacity>
      </View>

      <View style={style.Bottom_View}>

        <View style={style.Select_Service_View}>
          <Text style={style.Select_Service_Text}>Select Services</Text>
        </View>

        <View style={style.Bottom_Sub_View}>

          <TouchableOpacity onPress={() => navigation.navigate('SavedPlaces')} style={style.Bottom_Button_View}>

            <Image
              source={Home}
              style={style.Image_Style}
            />

            <Text style={style.Bottom_Button_Text}>Go Home</Text>
            {/* <Text style={style.Bottom_Button_Text_1}>Manhattan 24, Street</Text> */}

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setRideTypeModal(true)}
            style={style.Bottom_Button_View}>

            <Image
              source={Arrivals}
              style={style.Image_Style}
            />

            <Text style={style.Bottom_Button_Text}>New Arrivals</Text>
            <Text style={style.Bottom_Button_Text_1}>Choose destination</Text>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Recent', { type: 'Recent', header: 'Recent', ScheduleType: 'normal' })}
            style={style.Bottom_Button_View}>

            <Image
              source={Recent}
              style={style.Image_Style}
            />

            <Text style={style.Bottom_Button_Text}>Recent</Text>
            {/* <Text style={style.Bottom_Button_Text_1}>Chelsea</Text> */}

          </TouchableOpacity>

        </View>
      </View>

      <CalendarModal
        visible={CalendarModalVisible}
        notvisible={() => setCalendarModalVisible(false)}
        onPressOk={() => {
          setCalendarModalVisible(false);
          setshowTimePicker(true)
        }}
        onDayPress={(day) => { setSeletedDate(day.dateString) }}
      />

      <DatePicker
        title={'Select Time'}
        modal
        open={showTimePicker}
        is24hourSource={'device'}
        date={SeletedDate ? new Date(SeletedDate) : new Date()}
        onConfirm={time => {
          addDateTime(time)
          setshowTimePicker(false);
        }}
        onCancel={() => {
          setshowTimePicker(false);
        }}
        mode={'time'}
      />

      <CompleteProfileModal
        visible={ModalVisible}
        description={'Please\nComplete Your Profile'}
        notvisible={() => setModalVisible(false)}
        onPressComplete={() => {
          setModalVisible(false);
          navigation.navigate('RiderProfile')
        }}
      />

      <StartRideModal
        visible={RideTypeModal}
        buttonOneText={'My Self'}
        buttonTwoText={'For Children'}
        description={'For whom, you want to \n book a ride?'}
        notvisible={() => setRideTypeModal(false)}
        onPressbuttonOne={() => {
          setRideTypeModal(false);
          navigation.navigate('Recent', { type: 'Self', header: 'Select Address', ScheduleType: 'normal' })
        }}
        onPressbuttonTwo={() => {
          setRideTypeModal(false);
          navigation.navigate('Recent', { type: 'Children', header: 'Select Address', ScheduleType: 'normal' })
        }}
      />

      <BottomSheet
        ref={sheetRef}
        initialSnap={1}
        renderHeader={() =>
          <View style={style.Sheet_Header_Style}>
            <TouchableOpacity
              onPress={() => { sheetRef.current.snapTo(1), setDateTimeList([]) }}
              style={style.Sheet_Sub_Header_Style}>
              <MaterialIcons name='close' color={Colors.BLACK} size={20} />
            </TouchableOpacity>
          </View>}
        snapPoints={[450, 0]}
        borderRadius={10}
        renderContent={renderContent}
      />

    </View>
  );
};

const style = StyleSheet.create({
  Main_Container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  Bottom_View: {
    position: 'absolute',
    bottom: 0,
    width: '90%',
    alignSelf: 'center',
    elevation: 2
  },
  My_Location_Button: {
    backgroundColor: Colors.WHITE,
    height: 35,
    width: 35,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    alignSelf: 'flex-end',
    elevation: 5,
    right: 15,
    position: 'absolute',
    top: 15,
    elevation: 5,
  },
  Bottom_Sub_View: {
    width: '100%',
    marginTop: 10,
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  Online_Text: {
    alignSelf: 'center',
    color: Colors.BLUE,
    fontWeight: 'bold',
    fontSize: 20,
  },
  Search_Main_View: {
    alignSelf: 'center',
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%'
  },
  Search_Sub_View: {
    backgroundColor: Colors.WHITE,
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2
  },
  TextInput_Main_View: {
    backgroundColor: Colors.LIGHT_GRAY_2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 5,
    elevation: 2,
    marginHorizontal: 10
  },
  Select_Service_View: {
    backgroundColor: Colors.WHITE,
    marginVertical: 10,
    borderRadius: 15,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
  },
  Select_Service_Text: {
    color: Colors.BLUE,
    fontWeight: 'bold',
    fontSize: 20
  },
  Bottom_Button_View: {
    backgroundColor: Colors.BLUE,
    alignItems: 'center',
    borderRadius: 20,
    elevation: 2,
    padding: 10,
    width: '32%'
  },
  Bottom_Button_Text: {
    color: Colors.WHITE_2,
    fontWeight: 'bold',
    paddingTop: 5,
    fontSize: 13,
    textAlign: 'center',
  },
  Bottom_Button_Text_1: {
    color: Colors.WHITE_2,
    textAlign: 'center',
    fontSize: 11
  },
  Image_Style: {
    width: 50,
    height: 50,
    resizeMode: 'contain'
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
    backgroundColor: Colors.WHITE,
    height: 25,
    width: 25,
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    alignSelf: 'flex-end'
  },
  Bottom_Sheet_Main_View: {
    backgroundColor: Colors.WHITE,
    minHeight: 450,
  },
  Bottom_Sheet_Sub_View: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center'
  },
  Text_Style: {
    fontWeight: 'bold',
    fontSize: 16
  },
  Ride_Type_Button_View: {
    paddingVertical: 10,
    width: '48%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.BLUE
  },
  Date_Time_Button_Style: {
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 2
  },
  Date_Time_List_Item_Style: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '75%',
    alignSelf: 'center',
    // justifyContent: 'space-around',
    marginBottom: 5
  },
  Dot_Style: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.BLUE,
    marginHorizontal: 10
  },
  Vertical_Line_Style: {
    backgroundColor: Colors.LIGHT_GRAY,
    height: 30,
    width: 1,
    marginHorizontal: 10
  }
});

export default RiderDashBoard;