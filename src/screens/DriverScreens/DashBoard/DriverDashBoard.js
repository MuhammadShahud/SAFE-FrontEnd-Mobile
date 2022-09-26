import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, RefreshControl, Platform, PermissionsAndroid, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps';
import Header from '../../../components/Header';
import { Colors } from '../../../Styles';
import TextComponent from '../../../components/TextComponent';
import Person2 from '../../../assets/driver/Person2.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Car from '../../../assets/driver/Car.png';
import SelectDropdown from 'react-native-select-dropdown';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AuthMiddleware } from '../../../redux/Middlewares/AuthMiddleware';
import AuthAction from '../../../redux/Actions/AuthActions';
import { DriverMiddleware } from '../../../redux/Middlewares/DriverMiddleware';
import { base_url, GOOGLE_MAPS_APIKEY, img_url } from '../../../configs/APIs';
import DriverActions from '../../../redux/Actions/DriverActions';
import Pusher from 'pusher-js/react-native';
import Geolocation from 'react-native-geolocation-service';
import CompleteProfileModal from '../../../components/CompleteProfileModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rideMark from '../../../assets/rider/group-2.png';
import AlertAction from '../../../redux/Actions/AlertActions';
import CompassHeading from 'react-native-compass-heading';
import Home from '../../../assets/rider/group-9.png';
import MapViewDirections from 'react-native-maps-directions';
import database from '@react-native-firebase/database';

const DriverDashBoard = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.Auth.user);
  const requestedRides = useSelector(state => state.Driver.reqeustedRides);
  const latestRide = useSelector(state => state.Driver.latestRide);
  const [bottom, setBottom] = useState(1);
  const [ModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [Status, setStatus] = useState(user?.user?.is_online == 1 ? 'Online' : "Offline");
  const StatusList = ['Online', 'Offline'];
  const dispatch = useDispatch();
  const mapRef = useRef();
  const markerRef = useRef();
  const [heading, setHeading] = useState(0);
  const [alreadyInit, setAlreadyInit] = useState(true);
  const watchPos = useRef();
  const location = useRef(new AnimatedRegion({
    latitude: 37.7323,
    longitude: -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }));


  const setOnline = (item) => {
    let previous = Status;
    setStatus(item);
    dispatch(AuthMiddleware.SetOnlineOffline({
      onSuccess: async (success) => {
        if (success) {
          let userdata = {
            ...user,
            user: success
          }
          await AsyncStorage.setItem('@user', JSON.stringify(userdata))
          dispatch(AuthAction.UpdateUser(success));
        }
        else
          setStatus(previous);
      }
    }))
  }

  const getLatestRide = () => {
    dispatch(DriverMiddleware.getLatestDriver({
      onSuccess: (success) => {
        if (!success)
          getReqeustedRides();
        else
          setRefreshing(false)
      }
    }));
  }

  const getReqeustedRides = () => {
    dispatch(DriverMiddleware.getRequestedRides());
    setRefreshing(false)
  }

  const initiatePusher = () => {
    let pusher = new Pusher('ba024c85e694c4822cf6', { cluster: 'ap2' });
    let chatChannel = pusher.subscribe("safe_app");
    chatChannel.bind('App\\Events\\InitialRideEvent', data => {
      let for_me = data?.data?.users?.findIndex(itm => itm.id == user?.user?.id);
      if (for_me > -1) {
        let requestedRidesNew = [data?.data?.ride, ...requestedRides];
        dispatch(DriverActions.GetRequestedRides(requestedRidesNew));
      }
    });
    pusher.connection.bind("state_change", function (states) {
      console.log("state-------------", states)
    })
    pusher.connection.bind("error", function (err) {
      console.log("-------", err?.error?.data)
    });
    let Rrides = [...requestedRides];
    let rideChannel = pusher.subscribe("cancel_ride");
    rideChannel.bind("App\\Events\\DriverCancelRide", data => {
      if (data.data) {
        getReqeustedRides()
        getLatestRide();
      }
      //{
      //   let index = Rrides.findIndex(v => {
      //     return v.id == data.data.id
      //   });
      //   if (index > -1) {
      //     let rides = [...Rrides];
      //     rides.splice(index, 1);
      //     dispatch(DriverActions.GetRequestedRides(rides))
      //   }
      //   navigation.navigate("DriverDashBoard");
      // }
    })

    // chatChannel.bind("client-App\\Events\\Tracking",(data)=>{})
    // let ws = new WebSocket("ws://192.168.0.110:6001")
    // ws.addEventListener("open", (ev) => {
    //   console.warn("opened")
    //   //ws.send(JSON.stringify({ data: "Hello", event: "client-App\\Events\\Tracking",channel:"private-"+chatChannel.name }));
    // })
    // ws.addEventListener("error", (ev) => {
    //   console.warn(ev)
    // })

  }


  useEffect(() => {
    if (!user?.user?.vehicle?.vehicle_brand && !user?.user?.vehicle?.model) {
      setModalVisible(true)
    }
    initiatePusher();
    getLatestRide();
    const degree_update_rate = 3;

    CompassHeading.hasCompass().then((val) => console.log(val))
    // CompassHeading.start(1, ({ heading, accuracy }) => {
    //   setHeading(heading)
    // });

    let blurEvent = navigation.addListener("blur", () => {
      CompassHeading.stop()
      console.warn("ok")
      setAlreadyInit(false)
    })

    return () => {
      CompassHeading.stop()
      // if (watchPos?.current)
      Geolocation.clearWatch(watchPos.current)
    };
  }, [])

  useFocusEffect(() => {
    if (!alreadyInit) {
      Geolocation.getCurrentPosition((position) => {
        mapRef.current.animateToRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000)
        location.current.timing(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            duration: 2000
          }
        ).start()
        setTimeout(() => {
          CompassHeading.start(Platform.OS == "android" ? 5 : 20, ({ heading, accuracy }) => {
            mapRef.current.animateCamera({
              heading: heading
            })
            setHeading(heading)
            updateLocationOnFirebase(heading, null, null)
          });
        }, 1000)


        dispatch(DriverMiddleware.updateLatLng({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          id: user?.user?.id
        }))
      })
    }

  })


  const getLocation = () => {
    if (Platform.OS == "android") {
      PermissionsAndroid.requestMultiple([
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ]).then((val) => {
        if (val['android.permission.ACCESS_COARSE_LOCATION'] == PermissionsAndroid.RESULTS.GRANTED || val['android.permission.ACCESS_FINE_LOCATION'] == PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition((position) => {
            markerRef.current.animateMarkerToCoordinate({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
            mapRef.current.animateToRegion({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            })
            updateLocationOnFirebase(heading, position.coords.latitude, position.coords.longitude)
            setTimeout(() => {
              CompassHeading.start(5, ({ heading, accuracy }) => {
                mapRef.current.animateCamera({
                  heading: heading
                })
                setHeading(heading)
                updateLocationOnFirebase(heading, null, null)
              });
            }, 1000)
            dispatch(DriverMiddleware.updateLatLng({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              id: user?.user?.id
            }))
          })
          watchPos.current = Geolocation.watchPosition((position) => {
            markerRef.current.animateMarkerToCoordinate({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
            mapRef.current.animateToRegion({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            })
            updateLocationOnFirebase(heading, position.coords.latitude, position.coords.longitude)

          }, (error) => { }, {
            interval: 6000,
            fastestInterval: 2000,
            distanceFilter: 10
          })
        }
      })
    }
    else {
      Geolocation.getCurrentPosition((position) => {
        mapRef.current.animateToRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000)
        location.current.timing(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            duration: 2000
          }
        ).start()
        setTimeout(() => {
          CompassHeading.start(Platform.OS == "android" ? 5 : 20, ({ heading, accuracy }) => {
            mapRef.current.animateCamera({
              heading: heading
            })
            setHeading(heading)
            updateLocationOnFirebase(heading, null, null)
          });
        }, 1000)


        dispatch(DriverMiddleware.updateLatLng({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          id: user?.user?.id
        }))
      })
      watchPos.current = Geolocation.watchPosition((position) => {
        mapRef.current.animateToRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        })
        location.current.timing(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            duration: 2000
          }
        ).start()
        updateLocationOnFirebase(heading, position.coords.latitude, position.coords.longitude)
      }, (error) => { }, {
        interval: 6000,
        fastestInterval: 2000,
        distanceFilter: 10
      })
    }
  }

  const updateLocationOnFirebase = (heading, latitude, longitude) => {
    if (latitude != null && longitude != null)
      database().ref("/drivers/" + user?.user?.id).set({
        heading,
        latitude,
        longitude
      }, (error) => console.warn(error))
    else
      database().ref("/drivers/" + user?.user?.id).update({
        heading
      })
  }

  return (
    <View style={style.Main_Container}>
      <Header
        headerRight={true}
        headerLeft={true}
        title={'Hi! ' + user?.user?.first_name}
        drawer={true}
      />
      <View style={{ flex: 1 }}>
        <View>
          <ScrollView
            refreshControl={<RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                getLatestRide();
              }} />}>
            <View style={{ backgroundColor: Colors.WHITE }}>
              <SelectDropdown
                data={StatusList}
                onSelect={(selectedItem, index) => {
                  setOnline(selectedItem);
                }}
                defaultValue={Status}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={{
                  backgroundColor: Colors.WHITE,
                  borderColor: Colors.BLUE,
                  borderWidth: 2,
                  borderRadius: 10,
                  alignSelf: 'center',
                  marginBottom: 5,
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

              <Text style={style.Online_Text}>You are currently {Status}</Text>

              <View style={style.Stats_View}>
                <TouchableOpacity
                  style={[style.Button_style, { backgroundColor: Colors.BLUE }]}>
                  <Text style={style.Button_Text_Style}>Total Rides</Text>
                  <Text style={[style.Button_Text_Style, { fontSize: 20 }]}>{user?.user.total_rides ? user?.user.total_rides : 0}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[style.Button_style, { backgroundColor: Colors.BLUE }]}>
                  <Text style={style.Button_Text_Style}>Total Earnings</Text>
                  <Text style={[style.Button_Text_Style, { fontSize: 20 }]}>${user?.user.total_earnings ? parseFloat(user?.user.total_earnings).toFixed(3) : 0}</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* </RefreshControl> */}
          </ScrollView>
        </View>
        <View style={{ flex: 1 }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            showsMyLocationButton={true}
            ref={mapRef}
            style={{ flex: 1, marginBottom: bottom }}
            initialRegion={{
              latitude: 37.7323,
              longitude: -122.4324,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onMapReady={() => {
              setBottom(0);
              getLocation();
            }}>
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

            {
              latestRide?.ride_locations && requestedRides.length > 0 ?
                requestedRides.map((ride) => (
                  <Marker
                    coordinate={{
                      latitude: parseFloat(ride?.ride_locations[0]?.latitude),
                      longitude: parseFloat(ride?.ride_locations[0]?.longitude),
                    }}
                  >
                    <View>
                      <Image source={rideMark} style={{
                        width: 30,
                        height: 30,
                        resizeMode: 'contain',
                      }} />
                    </View>
                  </Marker>
                ))
                : null
            }

            {
              latestRide?.ride_locations.map((v, index) => {
                if (index != 0)
                  return (
                    <Marker
                      coordinate={{ latitude: parseFloat(v.latitude), longitude: parseFloat(v.longitude) }}
                    >
                      <View>
                        <Image source={Home} style={{
                          width: 50,
                          height: 50,
                          resizeMode: 'contain'
                        }} />
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
          {
            requestedRides.length > 0 ?
              <Text
                style={[
                  style.Online_Text,
                  {
                    position: 'absolute',
                    top: 10,
                    backgroundColor: Colors.WHITE_2,
                    padding: 10,
                    borderRadius: 10,
                    elevation: 5,
                  },
                ]}>
                You have new pick up request
              </Text>
              : null
          }
        </View>
        {
          latestRide ?
            <TouchableOpacity style={style.Bottom_View} onPress={() => latestRide?.driver_status == "started" ? navigation.navigate("StartRideTracking") : navigation.navigate("StartRide")}>
              {/* <TouchableOpacity style={style.My_Location_Button}>
                <MaterialIcons name="my-location" color={Colors.BLUE} size={25} />
              </TouchableOpacity> */}

              <View style={style.Bottom_Sub_View}>
                <TextComponent text={"$" + latestRide?.estimated_price} style={style.Price_Text} />

                <View style={style.UserInfo_View}>
                  <Image source={latestRide?.rider?.image ? { uri: img_url + latestRide?.rider?.image } : Person2} style={style.Image_Style} />
                  <View style={{ marginHorizontal: 5, flex: 1 }}>
                    <Text style={style.Name_Text}>{latestRide?.rider.first_name + " " + latestRide?.rider.last_name}</Text>
                    <Text style={style.Distance_Text}>{latestRide?.estimated_distance ? parseFloat(latestRide?.estimated_distance / 1609).toFixed(2) + " m" : ""}</Text>
                  </View>
                </View>
                {
                  latestRide?.ride_locations.map((location, index) => {
                    return (
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <MaterialCommunityIcons
                          name={index == 0 ? "circle-slice-8" : "map-marker"}
                          color={Colors.BLUE}
                          size={20}
                        />
                        <TextComponent
                          text={location.address}
                          numberOfLines={3}
                          style={{ paddingHorizontal: 5 }}
                        />
                      </View>
                    )
                  })
                }

                {/* <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <MaterialCommunityIcons
                      name="map-marker"
                      color={Colors.BLUE}
                      size={20}
                    />
                    <TextComponent
                      text={latestRide?.ride_locations[latestRide?.ride_locations?.length - 1]?.address}
                      numberOfLines={3}
                      style={{ paddingHorizontal: 5 }}
                    />
                  </View> */}

                {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(DriverMiddleware.AcceptRide({
                      rideId: latestRide?.id,
                      onSuccess: () => {
                        navigation.navigate('StartRide')
                      }
                    }))
                  }}
                  style={[style.Button_style, { backgroundColor: Colors.BLUE }]}>
                  <Text style={style.Button_Text_Style}>Accept Ride</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    dispatch(DriverMiddleware.CancelRide({
                      rideId: latestRide?.id,
                    }))
                  }}
                  style={style.Button_style}>
                  <Text style={{ color: Colors.BLUE, fontWeight: 'bold' }}>
                    Cancel Ride
                  </Text>
                </TouchableOpacity>
              </View> */}
              </View>
            </TouchableOpacity>
            :
            <FlatList
              style={{ position: "absolute", bottom: 0, left: 0, right: 0, top: "60%", }}
              data={requestedRides}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ width: '90%', marginBottom: "5%", alignSelf: "center" }}>

                    <View style={style.Bottom_Sub_View}>
                      <TextComponent text={item?.estimated_price + "$"} style={style.Price_Text} />

                      <View style={style.UserInfo_View}>
                        <Image source={item?.rider?.image ? { uri: img_url + item?.rider?.image } : Person2} style={style.Image_Style} />
                        <View style={{ marginHorizontal: 5, flex: 1 }}>
                          <Text style={style.Name_Text}>{item?.rider?.first_name + " " + item?.rider?.last_name}</Text>
                          <Text style={style.Distance_Text}>{item.id} {item?.estimated_distance ? parseFloat(item?.estimated_distance / 1609).toFixed(2) + " m" : ""}</Text>
                        </View>
                      </View>
                      {item?.ride_locations.map((location, index) => {
                        return (
                          <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <MaterialCommunityIcons
                              name={index == 0 ? "circle-slice-8" : "map-marker"}
                              color={Colors.BLUE}
                              size={20}
                            />
                            <TextComponent
                              text={item?.ride_locations[item?.ride_locations?.length - 1]?.address}
                              numberOfLines={3}
                              style={{ paddingHorizontal: 5 }}
                            />
                          </View>
                        )
                      })
                      }

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 10,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            dispatch(DriverMiddleware.AcceptRide({
                              rideId: item?.id,
                              onSuccess: () => {
                                if (item.type == "schedule") {
                                  dispatch(AlertAction.ShowAlert({ title: "", message: "Ride has been confirmed and added to your confirmed rides" }))
                                }
                                else {
                                  dispatch(DriverActions.GetRequestedRides([]))
                                  dispatch(DriverActions.GetLatestRide(item))
                                  navigation.navigate('StartRide')
                                }
                              }
                            }))
                          }}
                          style={[style.Button_style, { backgroundColor: Colors.BLUE }]}>
                          <Text style={style.Button_Text_Style}>Accept Ride</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            let RRC = [...requestedRides];
                            RRC.splice(index, 1);
                            dispatch(DriverMiddleware.CancelRide({
                              rideId: item?.id,
                              array: RRC
                            }))
                          }}
                          style={style.Button_style}>
                          <Text style={{ color: Colors.BLUE, fontWeight: 'bold' }}>
                            Cancel Ride
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )
              }}
            />
        }
      </View>
      <CompleteProfileModal
        visible={ModalVisible}
        description={'Please\nComplete Your Profile'}
        notvisible={() => setModalVisible(false)}
        onPressComplete={() => {
          setModalVisible(false);
          navigation.navigate('Profile')
        }}
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
  },
  Bottom_Sub_View: {
    backgroundColor: Colors.WHITE,
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: Colors.BLUE,
    borderWidth: 0.5,
    borderBottomColor: Colors.WHITE,
  },
  Price_Text: {
    fontWeight: 'bold',
    fontSize: 15,
    position: 'absolute',
    right: 15,
    top: 10,
  },
  UserInfo_View: {
    width: '75%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Image_Style: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.BLUE,
    resizeMode: 'contain',
  },
  Name_Text: {
    fontWeight: 'bold',
    color: Colors.BLUE,
    fontSize: 15,
  },
  Distance_Text: {
    fontWeight: 'bold',
    color: Colors.BLUE,
  },
  Button_style: {
    width: '49%',
    borderColor: Colors.BLUE,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  Online_Text: {
    alignSelf: 'center',
    color: Colors.BLUE,
    fontWeight: 'bold',
    fontSize: 17,
  },
  Stats_View: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '85%',
    alignSelf: 'center',
    marginBottom: 5,
  },
  Button_Text_Style: {
    color: Colors.WHITE_2,
    fontWeight: 'bold',
  },
});

export default DriverDashBoard;
