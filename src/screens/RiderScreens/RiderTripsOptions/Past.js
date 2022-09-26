import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SheduleMiddleware } from '../../../redux/Middlewares/SheduleMiddleware'
import { APIs } from '../../../configs/APIs'
import { Colors } from '../../../Styles';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import TextComponent from '../../../components/TextComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Stars from 'react-native-stars';
import { useNavigation } from '@react-navigation/native';
import { ClipPath } from 'react-native-svg';
import StartRideModal from '../../../components/StartRideModal';
import SearchRideModal from '../../../components/SearchRideModal';
import moment from 'moment';
import Pusher from 'pusher-js/react-native';
import { RideMiddleware } from '../../../redux/Middlewares/RideMiddleware';
import RideActions from '../../../redux/Actions/RideActions';


const Past = () => {
  const navigation = useNavigation();
  const [ModalVisible, setModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [loader, setloader] = useState(false)


  const dispatch = useDispatch();
  const PastRides = useSelector(state => state.Shedule.pastRides)
  const [refreshing, setRefreshing] = useState(false);
  const chatchannel = useRef(null)
  const [ride_id, setride_id] = useState()
  const [ridetype, setridetype] = useState()
  const [rideData, setrideData] = useState(null)
  const [locations, setlocations] = useState([])

  useEffect(() => {
    // return () => {
    //   if (chatchannel?.current) {
    //     chatchannel?.current.unsubscribe()
    //   }
    // }
  }, [ride_id])


  const initiatePusher = (ride_id) => {
    let pusher = new Pusher('ba024c85e694c4822cf6', { cluster: 'ap2' });
    chatchannel.current = pusher.subscribe(ride_id.toString());
    chatchannel.current.bind('App\\Events\\AcceptRideEvent', data => {
      if (ride_id == data?.data?.id) {
        if (data?.data?.status == "canceled") {
          return
        } else if (data?.data?.status == "accepted") {
          dispatch(RideActions.getRideDetails(data?.data))
          navigation.navigate('ConfirmBooking', { params: { params: { data: { ScheduleType: ridetype } } } })
          setSearchModalVisible(false)
        } else {
          return
        }
      }
    });
  }

  useEffect(() => {
    setloader(true)
    dispatch(SheduleMiddleware.getPastRides({
      next_page_url: APIs.pastRides
    })).then(() => setloader(false))
      .catch(() => setloader(false))
  }, [])

  const onEndReached = () => {
    if (PastRides?.next_page_url) {
      dispatch(SheduleMiddleware.getPastRides({
        next_page_url: PastRides?.next_page_url
      }))
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    dispatch(SheduleMiddleware.getPastRides({
      next_page_url: APIs.pastRides
    }))
    setRefreshing(false)
  }

  const renderUserList = item => {
    return (
      <TouchableOpacity
        disabled={item?.item?.review != null ? true : false}
        onPress={() => navigateToRating(item?.item)}
        style={styles.Back__farward}>
        {/* <MapView
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={true}
          style={{width: '100%', height: 100}}
          region={{
            latitude: 37.7323,
            longitude: -122.4324,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}></MapView> */}
        <View style={styles.direction}>
          <View>
            <TextComponent
              style={styles.name__Heading}
              text={item?.item?.rider?.username}
            />
            <TextComponent
              style={styles.Date__Heading}
              // text={item?.item?.end_time}
              text={moment(item?.item?.end_time).format('MMMM d, YYYY')}
            />
          </View>
          <View style={{ marginTop: 12 }}>
            <Text style={styles.Blue__txt}>{'$' + item?.item?.estimated_price}</Text>
            <TextComponent text={moment(item?.item?.end_time, 'hh:mm a').format('LT')} />
          </View>
        </View>
        <View style={styles.direction__}>
          <View style={{ flexDirection: 'row' }}>
            <Ionicons color={Colors.BLUE} name="radio-button-on" size={25} />
            <TextComponent
              style={{ fontSize: 10, marginTop: 5 }}
              // text={'Academic Magnet High School'}
              text={item?.item?.ride_locations[0]?.address}
            />
          </View>
          <Text style={styles.yellow__txt}>{item?.item?.status}</Text>
        </View>
        <View style={styles.direction__None}>
          <View style={{ flexDirection: 'row' }}>
            <Ionicons color={Colors.BLUE} name="location" size={25} />
            <TextComponent
              style={{ fontSize: 10 }}
              // text={'1629 K St Suite 300, N.W. Washington.\n D.C. 20006, USA'}
              text={item?.item?.ride_locations.slice(-1)[0]?.address}
            />
          </View>
          <View>
            <Stars
              default={item?.item?.review?.rating}
              count={5}
              fullStar={
                <Ionicons
                  name={'star'}
                  style={[styles.myStarStyle]}
                  size={11}
                />
              }
              emptyStar={
                <Ionicons
                  name={'star-outline'}
                  style={[styles.myStarStyle, styles.myEmptyStarStyle]}
                  size={11}
                />
              }
              halfStar={
                <Ionicons
                  name={'star-half'}
                  style={[styles.myStarStyle]}
                  size={11}
                />
              }
            />
            <TouchableOpacity
              onPress={() => { setrideData(item?.item), setModalVisible(true) }}
              style={styles.Re__book}>
              <Text style={styles.white}>Re-Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const cancelRide = () => {
    dispatch(RideMiddleware.cancelRide(ride_id))
      .then((data) => {
        setSearchModalVisible(false);
      }
      )
      .catch(() => setSearchModalVisible(false))
  }

  const bookRide = () => {
    setModalVisible(false);
    setSearchModalVisible(true)
    setridetype(rideData?.type)
    let array = []
    for (const [index, item] of rideData?.ride_locations.entries()) {
      let data = {
        lat: item?.latitude,
        lng: item?.longitude,
        Address: item?.address,
        child_id: item?.user_children_id
      }
      array.push(data)
    }
    let structuredData = {
      Locations: [...array],
      type: rideData.ride_for,
      vehicle_type: rideData?.vehicle_type,
      scheduletype: rideData?.type == 'schedule' ? 'schedule' : 'normal',
      total_distance: rideData?.estimated_distance,
      total_time: rideData?.estimated_time,
      total_price: rideData?.estimated_price,
      schedule_start_time: rideData?.type == 'schedule' ? rideData?.schedule_start_time : null
    }
    dispatch(RideMiddleware.rideBooking(structuredData))
      .then((data) => {
        setride_id(data?.ride.id)
        initiatePusher(data?.ride.id)
      })
      .catch(() => setSearchModalVisible(false))
  }

  const navigateToRating = (item) => {
    dispatch(RideActions.getRideDetails(item))
    navigation.navigate('RateYourDriver')
  }

  return (
    <View style={styles.mainContainer}>
      {!loader ?

        <FlatList
          style={{ marginTop: 5 }}
          data={PastRides?.data}
          keyExtractor={item => item?.id}
          renderItem={renderUserList}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.2}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text style={{ color: Colors.LIGHT_GRAY_1 }}>Ride Not Found</Text>
            </View>
          }
        />
        :
        <ActivityIndicator size={'small'} color={Colors.BLACK} />}

      <StartRideModal
        visible={ModalVisible}
        buttonOneText={'Yes'}
        buttonTwoText={'No'}
        title={'Rebook Ride!'}
        description={'Do you want to rebook this ride?'}
        notvisible={() => setModalVisible(false)}
        onPressbuttonOne={() => {
          bookRide()
        }}
        onPressbuttonTwo={() => {
          setModalVisible(false);
        }}
      />


      <SearchRideModal
        visible={searchModalVisible}
        // onPress={() => {

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



export default Past;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
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
    flexDirection: 'column',
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
    flexDirection: 'column',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  Re__book: {
    backgroundColor: Colors.BLUE,
    borderRadius: 10,
    padding: 7,
    marginVertical: 3,

  },
  myStarStyle: {
    color: '#f7b82c',
    backgroundColor: 'transparent',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  myEmptyStarStyle: {
    color: 'white',
  },
  white: {
    color: Colors.WHITE,
    fontSize: 11,
  },
});
