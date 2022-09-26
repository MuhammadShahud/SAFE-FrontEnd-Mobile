import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '../../../Styles'
import Header from '../../../components/Header'
import Car from '../../../assets/rider/CarMarker.png'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TextComponent from '../../../components/TextComponent'
import WhereToModal from '../../../components/WhereToModal'
import { useNavigation } from '@react-navigation/native'
import SubmitButton from '../../../components/SubmitButton'
import SearchRideModal from '../../../components/SearchRideModal'
import { useDispatch, useSelector } from 'react-redux'
import { MapLocationMiddleware } from '../../../redux/Middlewares/MapLocationMiddleware'

import DashedLine from 'react-native-dashed-line'
import SelectDropdown from 'react-native-select-dropdown'
import GooglePlacesInput from '../../../components/GooglePlacesInput';

import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import { getCompleteAddress, currentLocation } from '../../../configs/getCompleteAddress'
import AlertAction from '../../../redux/Actions/AlertActions';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from '../../../configs/APIs'




const Recent = (props) => {

  const navigation = useNavigation()
  const data = props?.route?.params;
  const [ModalVisible, setModalVisible] = useState(false)
  const dispatch = useDispatch()

  const [refreshing, setrefreshing] = useState(false)
  const [Address, setAddress] = useState()
  const location = useSelector((state) => state.Location.savedLocations)
  const currentlocations = useSelector((state) => state.Location.currentLocation)
  const user = useSelector((state) => state.Auth.user)
  const [DropOffList, setDropOffList] = useState(['1'])
  const [Refresh, setRefresh] = useState(false)
  const StatusList = ['Child Name', 'Peter', 'John'];
  const [isModal, setisModal] = useState(false)
  const [id, setid] = useState()
  const [Address1, setAddress1] = useState()

  const [Child, setChild] = useState(null)
  const [region, setregion] = useState({
    latitude: 36.778259,
    longitude: -119.417931
  })

  useEffect(() => {
    fetch()
  }, [])

  const fetch = () => {
    dispatch(MapLocationMiddleware.getLocation());
    setregion({
      latitude: currentlocations?.latitude,
      longitude: currentlocations?.longitude
    })
    let response = {
      ...currentlocations,
      child_id: Child ? Child.id : null,
      child_name: Child ? `${Child.first_name} ${Child.last_name}` : null
    }
    setAddress1(response)
  }
  const addAddress = (key, data, detail) => {
    let response = {
      id: key,
      lat: detail?.lat,
      lng: detail?.lng,
      Address: data?.description,
      child_id: Child ? Child.id : null,
      child_name: Child ? `${Child.first_name} ${Child.last_name}` : null
    }
    setChild(null)
    if (key != 'Current') {
      let list = [...DropOffList]
      list.splice(key, 1, response)
      setDropOffList(list)
    } else {
      setAddress1(response)
    }

  }
  const addRecentAddress = (item) => {
    if (data?.type == 'Children' && Child == null) {
      dispatch(AlertAction.ShowAlert({ title: "Warning", message: "Please select children first", status: "error" }))
      return
    }
    let address = {
      description: item?.address
    }
    let details = {
      lat: item?.latitude,
      lng: item?.longitude
    }
    addAddress(DropOffList.length - 1, address, details)
  }
  const renderDropOffList = ({ item, index }) => {
    return (
      <View>
        <View style={{ width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name='map-marker' color={(index < DropOffList.length - 1) ? Colors.BLUE : Colors.ORANGE} size={25} />
          <View style={{ flex: 1 }}>

            <TouchableOpacity style={styles.TextInput_Style}
              onPress={() => {
                if (data?.type == 'Children' && Child == null) {
                  dispatch(AlertAction.ShowAlert({ title: "Warning", message: "Please select children first", status: "error" }))
                  return
                }
                setisModal(true), setid(index)
              }}

            >
              <TextComponent numberOfLines={1} style={{ fontSize: 12, width: data?.type == 'Children' ? '85%' : '90%' }} text={item?.Address ? item?.Address : 'Enter Drop-off Location'} />
            </TouchableOpacity>

            {(index < DropOffList.length - 1) ?
              <TouchableOpacity
                onPress={() => {
                  DropOffList.splice(index, 1)
                  setRefresh(!Refresh)
                }}
                style={[styles.TextInput_Style_Button, { borderRadius: 15, top: data?.type == 'Children' ? 10 : 5 }]}>
                <MaterialCommunityIcons name='close' color={Colors.WHITE_2} size={25} />
              </TouchableOpacity>
              :
              <TouchableOpacity
                onPress={() => {
                  DropOffList.push('1')
                  setRefresh(!Refresh)
                }}
                style={[styles.TextInput_Style_Button, { borderRadius: 7, top: data?.type == 'Children' ? 10 : 5 }]}>
                <MaterialCommunityIcons name='plus' color={Colors.WHITE_2} size={25} />
              </TouchableOpacity>
            }
          </View>

          {data?.type == 'Children' && user?.user?.childrens.length > 0 ? <SelectDropdown
            data={user?.user?.childrens}
            onSelect={(selectedItem, index) => {
              setChild(selectedItem)
            }}
            defaultValue={'Child Name'}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.first_name;
            }}
            rowTextForSelection={(item, index) => {
              return item.first_name;
            }}
            buttonStyle={{
              backgroundColor: Colors.LIGHT_GRAY_2,
              borderRadius: 10,
              alignSelf: 'center',
              marginBottom: 5,
              width: 100,
            }}
            buttonTextStyle={{
              fontSize: 8
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
          /> : null}

        </View>

        {index < DropOffList.length - 1 ?
          <DashedLine dashLength={5} dashThickness={5} dashStyle={{ borderRadius: 5 }} dashGap={5} dashColor={Colors.LIGHT_GRAY} axis='vertical' style={{ width: '85%', height: 30, alignSelf: 'center' }} />
          :
          null}

      </View>
    )
  }
  const renderRecentLocationList = ({ item }) => {
    return (
      <TouchableOpacity style={styles.Item_Style} key={item?.id} onPress={() => addRecentAddress(item)}>
        <MaterialCommunityIcons name='clock' size={25} color={Colors.BLUE} />
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <TextComponent numberOfLines={2} style={{ color: Colors.LIGHT_GRAY_1, fontSize: 12 }} text={item?.address} />
        </View>
      </TouchableOpacity>
    )
  }
  const confirmlocation = () => {
    if (DropOffList[0] != 1) {
      navigation.navigate('ChooseYourRide', { data, Pickup: Address1, DropOffList: DropOffList })
    }
    else {
      dispatch(AlertAction.ShowAlert({ title: "Warning", message: "Please add drop-off location", status: "error" }))
    }

  }

  return (
    <View style={styles.Main_Container}>
      <Header
        headerLeft={true}
        title={data?.header}
      />

      <View style={{ flex: 1 }}>

        <MapView
          provider={PROVIDER_GOOGLE}
          // showsUserLocation={true}
          // showsMyLocationButton={true}
          style={{ flex: 1 }}
          region={{
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}>
          <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
            <View>
              <Image
                source={Car}
                style={{ width: 50, height: 50, resizeMode: 'contain' }}
              />
            </View>
          </Marker>

        </MapView>

        <TouchableOpacity style={[styles.My_Location_Button, { bottom: data?.type == 'Recent' ? 20 : 90 }]}>
          <MaterialIcons name="my-location" color={Colors.BLUE} size={25} />
        </TouchableOpacity>

        <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <SubmitButton text={'Confirm Location'} onPress={() => confirmlocation()} icon={false} iconname={'magnify'} />
        </View>

        <View style={styles.Sub_View_Style}>

          <View>
            <View style={{ width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name='map-marker' color={Colors.BLUE} size={25} />
              <TouchableOpacity style={styles.TextInput_Style} onPress={() => { setisModal(true), setid("Current") }}>
                <TextComponent style={{ fontSize: 12 }} text={Address1?.Address} numberOfLines={1} />
              </TouchableOpacity>

            </View>

            <DashedLine dashLength={5} dashThickness={5} dashStyle={{ borderRadius: 5 }} dashGap={5} dashColor={Colors.LIGHT_GRAY} axis='vertical' style={{ width: '85%', height: 30, alignSelf: 'center' }} />
            <View style={{ maxHeight: 200 }}>
              <FlatList
                data={DropOffList}
                showsVerticalScrollIndicator={false}
                renderItem={renderDropOffList}
              />
            </View>

            <GooglePlacesInput
              index={id}
              visible={isModal}
              notvisible={() => setisModal(false)}
              Onpress={(index, data, details) => {
                addAddress(index, data, details)
              }
              }
              placeholder={'Search here'}
            />

          </View>
          {location?.length > 0 ?
            <TouchableOpacity style={styles.Item_Style} onPress={() => addRecentAddress(location[0])}>
              <MaterialCommunityIcons name='home' size={25} color={Colors.BLUE} />
              <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <TextComponent
                  text={location ? location[0]?.name : null}
                  style={{ fontSize: 17, fontWeight: 'bold' }}
                />
                <TextComponent
                  text={location ? location[0]?.address : null}
                  numberOfLines={2}
                  style={{ fontWeight: '500', fontSize: 12 }}
                />
              </View>
            </TouchableOpacity>
            : null}

          <TouchableOpacity
            onPress={() => navigation.navigate('SavedPlaces')}
            style={styles.Item_Style}>
            <MaterialCommunityIcons name='star' size={25} color={Colors.BLUE} />
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <TextComponent
                text={'Saved Places'}
                style={{ fontSize: 17, fontWeight: 'bold' }}
              />
            </View>
            <MaterialCommunityIcons name='chevron-right' size={30} color={Colors.BLUE} />
          </TouchableOpacity>

          <View style={{ height: 150, paddingVertical: 10 }}>

            {location ?

              <FlatList
                showsVerticalScrollIndicator={false}
                style={{ paddingBottom: 10 }}
                data={location}
                keyExtractor={item => item?.id}
                renderItem={renderRecentLocationList}
                ListEmptyComponent={
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: Colors.LIGHT_GRAY_1 }}>No recent location found</Text>
                  </View>
                }
              />
              : <ActivityIndicator size={'large'} color={Colors.BLACK} />}
          </View>
        </View>

      </View>


    </View>
  )
}

const styles = StyleSheet.create({
  Main_Container: {
    flex: 1,
    backgroundColor: Colors.WHITE
  },
  Sub_View_Style: {
    backgroundColor: Colors.WHITE,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 2,
    position: 'absolute',
    width: '100%'
  },
  My_Location_Button: {
    backgroundColor: Colors.WHITE,
    height: 35,
    width: 35,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    elevation: 5,
    right: 25,
    position: 'absolute',
    elevation: 5,
  },
  Item_Style: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5
  },


  TextInput_Style_Button: {
    position: 'absolute',
    alignSelf: 'flex-end',
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    top: 5,
    right: 15,
    backgroundColor: Colors.BLUE,
  },
  TextInput_Style: {
    backgroundColor: Colors.LIGHT_GRAY_2,
    borderRadius: 10,
    paddingHorizontal: 15,
    flex: 1,
    marginHorizontal: 5,
    fontSize: 11,
    height: 40,
    justifyContent: 'center'
  },
})

export default Recent