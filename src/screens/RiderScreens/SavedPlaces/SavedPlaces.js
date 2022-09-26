import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../../Styles'
import Header from '../../../components/Header'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TextComponent from '../../../components/TextComponent'
import SubmitButton from '../../../components/SubmitButton'
import TextInput from '../../../components/TextInput'
import MapModal from '../../../components/MapModal'
import { useDispatch } from 'react-redux'
import { MapLocationMiddleware } from '../../../redux/Middlewares/MapLocationMiddleware'
import Geocoder from 'react-native-geocoder';
import { GOOGLE_MAPS_APIKEY } from '../../../configs/APIs'


const SavedPlaces = () => {

  const [PlaceName, setPlaceName] = useState()
  const [PlaceAddress, setPlaceAddress] = useState()
  const [SelectedButton, setSelectedButton] = useState('Home')
  const [isMap, setisMap] = useState(false)
  const [region, setregion] = useState()
  Geocoder.fallbackToGoogle(GOOGLE_MAPS_APIKEY);

  const dispatch = useDispatch()

  const getCompleteAddress = async (lat, long) => {
    try {
      let position = {
        lat: lat,
        lng: long
      }
      let res = await Geocoder.geocodePosition(position)
      if (res) {
        let data = {
          latitude: lat,
          longitude: long,
          Address: res[0].formattedAddress
        }
        setregion(data)
        setPlaceAddress(res[0].formattedAddress)

      }

    } catch (error) {

    }
  }

  const clearStates = () => {
    setPlaceAddress('')
    setPlaceName('')
    setregion('')
  }

  const savePlaces = () => {
    if (region, PlaceName, PlaceAddress) {
      let data = {
        name: SelectedButton,
        place_name: PlaceName,
        address: PlaceAddress,
        latitude: region?.latitude,
        longitude: region?.longitude
      }
      dispatch(MapLocationMiddleware.saveLocation(data)).then(() => { clearStates() })
    }
    else {
      alert("All fields are required")
    }
  }


  return (
    <View style={styles.Main_Container}>

      <Header
        headerLeft={true}
        title={'Favorite Places'}
      />

      <View style={styles.Three_Buttons_Main_View}>

        <TouchableOpacity
          onPress={() => setSelectedButton('Home')}
          style={[styles.Buttons_Sub_View, { backgroundColor: SelectedButton == 'Home' ? Colors.BLUE : Colors.WHITE }]}
        >
          <MaterialCommunityIcons name='home' size={35} color={SelectedButton == 'Home' ? Colors.WHITE_2 : Colors.BLUE} />
          <Text style={{ fontWeight: 'bold', color: SelectedButton == 'Home' ? Colors.WHITE_2 : Colors.BLUE }}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedButton('Work')}
          style={[styles.Buttons_Sub_View, { backgroundColor: SelectedButton == 'Work' ? Colors.BLUE : Colors.WHITE }]}
        >
          <MaterialCommunityIcons name='briefcase-variant' size={35} color={SelectedButton == 'Work' ? Colors.WHITE_2 : Colors.BLUE} />
          <Text style={{ fontWeight: 'bold', color: SelectedButton == 'Work' ? Colors.WHITE_2 : Colors.BLUE }}>Work</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedButton('Other')}
          style={[styles.Buttons_Sub_View, { backgroundColor: SelectedButton == 'Other' ? Colors.BLUE : Colors.WHITE }]}
        >
          <MaterialCommunityIcons name='map-marker' size={35} color={Colors.ORANGE} />
          <Text style={{ fontWeight: 'bold', color: SelectedButton == 'Other' ? Colors.WHITE_2 : Colors.BLUE }}>Other</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.Form_Main_View}>
        <TextComponent
          text={'Place Name'}
          style={styles.Heading_Style}
        />
        <TextInput
          value={PlaceName}
          onChangeText={val => setPlaceName(val)}
          placeholder={'Academic Magnet High School'}
          placeholderTextColor={Colors.GRAY}
        />

        <TextComponent
          text={'Place Address'}
          style={[styles.Heading_Style, { marginTop: 20 }]}
        />
        <TextInput
          editable={false}
          value={PlaceAddress}
          onChangeText={val => setPlaceAddress(val)}
          placeholder={'Union Square, New York'}
          placeholderTextColor={Colors.GRAY}
          multiLine={false}
        />

        <TouchableOpacity style={styles.On_Map_Button_Style} onPress={() => setisMap(true)}>
          <Text style={{ color: Colors.WHITE_2, fontWeight: 'bold', paddingHorizontal: 5 }}>Pick on map</Text>
          <MaterialCommunityIcons name='map-marker' size={20} color={Colors.WHITE_2} />
        </TouchableOpacity>

      </View>

      <SubmitButton text={'Save Place'} onPress={() => savePlaces()} icon={true} iconname={'check-circle'} />

      <MapModal visible={isMap} notvisible={(region) => setisMap(false)} getLocation={(location) => getCompleteAddress(location.latitude, location.longitude)} />


    </View>
  )
}

const styles = StyleSheet.create({
  Main_Container: {
    flex: 1,
    backgroundColor: Colors.WHITE
  },
  Three_Buttons_Main_View: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  Buttons_Sub_View: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    elevation: 2,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center'
  },
  Form_Main_View: {
    padding: 20,
    backgroundColor: Colors.WHITE,
    elevation: 2,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 20
  },
  Heading_Style: {
    fontWeight: 'bold',
    marginLeft: 20,
    fontSize: 17
  },
  On_Map_Button_Style: {
    backgroundColor: Colors.BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    width: 150,
    borderRadius: 10,
    marginLeft: 20,
    marginTop: 20,
    justifyContent: 'center'
  }

})

export default SavedPlaces