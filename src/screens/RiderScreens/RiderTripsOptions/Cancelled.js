import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SheduleMiddleware } from '../../../redux/Middlewares/SheduleMiddleware'
import { APIs } from '../../../configs/APIs'
import { Colors } from '../../../Styles';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import TextComponent from '../../../components/TextComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const Cancelled = () => {


  const dispatch = useDispatch();
  const CancelledRides = useSelector(state => state.Shedule.cancelledRides)
  const [refreshing, setRefreshing] = useState(false);
  const [loader, setloader] = useState(false)


  useEffect(() => {
    setloader(true)
    dispatch(SheduleMiddleware.getCancelledRides({
      next_page_url: APIs.canceledRides
    })).then(() => setloader(false))
      .catch(() => setloader(false))
  }, [])

  const onEndReached = () => {
    if (CancelledRides?.next_page_url) {
      dispatch(SheduleMiddleware.getCancelledRides({
        next_page_url: CancelledRides?.next_page_url
      }))
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    dispatch(SheduleMiddleware.getCancelledRides({
      next_page_url: APIs.canceledRides
    }))
    setRefreshing(false)
  }


  const renderUserList = item => {
    return (
      <View style={styles.Back__farward}>
        {/* <MapView
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={true}
          style={{ width: '100%', height: 100 }}
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
              text={moment(item?.item?.start_time).format('MMMM d, YYYY')}
            />
          </View>
          <View style={{ marginTop: 12 }}>
            <Text style={styles.Blue__txt}>{'$' + item?.item?.Dollar}</Text>
            <TextComponent text={moment(item?.item?.start_time, 'hh:mm a').format('LT')} />
          </View>
        </View>
        <View style={styles.direction__}>
          <View style={{ flexDirection: 'row' }}>
            <Ionicons color={Colors.BLUE} name="radio-button-on" size={25} />
            <TextComponent
              style={{ fontSize: 12, marginTop: 5 }}
              text={item?.item?.ride_locations[0]?.address}
            />
          </View>
          <Text style={styles.yellow__txt}>{item?.item?.status}</Text>
        </View>
        <View style={styles.direction__None}>
          <View style={{ flexDirection: 'row' }}>
            <Ionicons color={Colors.BLUE} name="location" size={25} />
            <TextComponent
              style={{ fontSize: 12 }}
              text={item?.item?.ride_locations.slice(-1)[0]?.address}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* <FlatList
        data={UserList}
        keyExtractor={id => id?.id}
        renderItem={renderUserList}
      /> */}

      {!loader ?
        <FlatList
          style={{ marginTop: 5 }}
          data={CancelledRides?.data}
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
        : <ActivityIndicator size={'small'} color={Colors.BLACK} />}
    </View>
  );
};

export default Cancelled;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: Colors.WHITE,
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
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  direction__None: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 10,
  },
});
