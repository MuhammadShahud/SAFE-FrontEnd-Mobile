import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '../../../Styles'
import { useNavigation } from '@react-navigation/native'
import Person2 from '../../../assets/driver/Person2.png'
import Person3 from '../../../assets/driver/Person3.png'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import TextComponent from '../../../components/TextComponent'
import { DriverMiddleware } from '../../../redux/Middlewares/DriverMiddleware'
import { useDispatch, useSelector } from 'react-redux'
import DriverActions from '../../../redux/Actions/DriverActions'
import { img_url } from '../../../configs/APIs'

export default function BookingRequest() {

  const navigation = useNavigation();
  const [BookingRequestList, setBookingRequestList] = useState([
    { id: '1', name: 'John Dave', image: Person2, distance: '3.1 Miles', price: '$12.50', location: 'Academic Magnet High School', address: '1629 K St Suite 300, N.W. Washington. D.C 20006, USA' },
    { id: '2', name: 'Stacy Doe', image: Person3, distance: '4.1 Miles', price: '$23.50', location: 'Academic Magnet High School', address: '1629 K St Suite 300, N.W. Washington. D.C 20006, USA' },
    { id: '3', name: 'John Dave', image: Person2, distance: '6.1 Miles', price: '$32.50', location: 'Academic Magnet High School', address: '1629 K St Suite 300, N.W. Washington. D.C 20006, USA' },
    { id: '4', name: 'Stacy Doe', image: Person3, distance: '1.1 Miles', price: '$21.50', location: 'Academic Magnet High School', address: '1629 K St Suite 300, N.W. Washington. D.C 20006, USA' },
  ])
  const dispatch = useDispatch();
  const requestedRides = useSelector(state => state.Driver.reqeustedRides);


  useEffect(() => {
    getReqeustedRides()
  }, [])

  const RenderBookingList = ({ item }) => {

    return (

      <View style={{ width: '100%', marginBottom: "1%", alignSelf: "center" }}>

        <View style={style.Bottom_Sub_View}>
          <TextComponent text={item?.estimated_price + "$"} style={style.Price_Text} />

          <View style={style.UserInfo_View}>
            <Image source={item?.rider?.image ? { uri: img_url + item?.rider?.image } : Person2} style={style.Image_Style} />
            <View style={{ marginHorizontal: 5, flex: 1 }}>
              <Text style={style.Name_Text}>{item?.rider?.first_name + " " + item?.rider?.last_name}</Text>
              <Text style={style.Distance_Text}>{item?.estimated_distance ? parseFloat(item?.estimated_distance / 1609).toFixed(2) + " m" : ""}</Text>
            </View>
          </View>

          <View
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <MaterialCommunityIcons
              name="circle-slice-8"
              color={Colors.BLUE}
              size={20}
            />
            <TextComponent
              text={item?.ride_locations[0]?.address}
              numberOfLines={3}
              style={{ paddingHorizontal: 5 }}
            />
          </View>

          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <MaterialCommunityIcons
              name="map-marker"
              color={Colors.BLUE}
              size={20}
            />
            <TextComponent
              text={item?.ride_locations[item?.ride_locations?.length - 1]?.address}
              numberOfLines={3}
              style={{ paddingHorizontal: 5 }}
            />
          </View>

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
                    dispatch(DriverActions.GetRequestedRides([]))
                    dispatch(DriverActions.GetLatestRide(item))
                    navigation.navigate('StartRide')
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

  }

  const getReqeustedRides = () => {
    dispatch(DriverMiddleware.getRequestedRides());
  }

  return (
    <FlatList
      style={{ marginTop: 5 }}
      data={requestedRides}
      keyExtractor={(item, index) => index.toString()}
      renderItem={RenderBookingList}
    />
  )
}

const style = StyleSheet.create({
  Bottom_Sub_View: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    elevation: 3,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 7
  },
  Price_Text: {
    fontWeight: 'bold',
    fontSize: 15,
    position: 'absolute',
    right: 15,
    top: 10
  },
  UserInfo_View: {
    width: '75%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  Image_Style: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.BLUE,
    resizeMode: 'contain'
  },
  Name_Text: {
    fontWeight: 'bold',
    color: Colors.BLUE,
    fontSize: 15
  },
  Distance_Text: {
    fontWeight: 'bold',
    color: Colors.BLUE
  },
  Button_style: {
    width: '49%',
    borderColor: Colors.BLUE,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10
  },
  Online_Text: {
    alignSelf: 'center',
    color: Colors.BLUE,
    fontWeight: 'bold',
    fontSize: 17
  },
  Stats_View: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '85%',
    alignSelf: 'center',
    marginBottom: 5
  },
  Button_Text_Style: {
    color: Colors.WHITE_2,
    fontWeight: 'bold'
  },
})