import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../../Styles';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Header from '../../../components/Header';
import Car from '../../../assets/driver/Car.png';
import Ladies from '../../../assets/driver/lady.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TextComponent from '../../../components/TextComponent';
import SubmitButton from '../../../components/SubmitButton';
import ThreeDots from '../../../components/ThreeDots';
import { useSelector } from 'react-redux';

const PickUp = () => {
  const [bottom, setBottom] = useState(1);
  return (
    <View style={styles.mainContainer}>
      <View style={styles.subContainer}>
        <Header title={'Pick Up'} headerLeft={true} />
        <MapView
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={true}
          style={{ flex: 1, marginBottom: bottom }}
          region={{
            latitude: 37.7323,
            longitude: -122.4324,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onMapReady={() => setBottom(0)}>
          <Marker coordinate={{ latitude: 37.7323, longitude: -122.4324 }}>
            <View>
              <Image
                source={Car}
                style={{ width: 50, height: 50, resizeMode: 'contain' }}
              />
            </View>
          </Marker>
        </MapView>
      </View>
      <View style={styles.second__Container}>
        <ScrollView>
          <View style={styles.Before_After_Main_View_Style}></View>
          <Text style={styles.Simple}>Waiting for passenger</Text>
          <Text style={styles.heading}>Arrived</Text>
          <View style={styles.Avatar__View}>
            <Image style={styles.Avatar} source={Ladies} />
          </View>
          <Text style={styles.Simple}>Sophia Grace</Text>
          <View style={styles.direction}>
            <Ionicons name="call" color={Colors.BLUE} size={30} />
            <MaterialIcons name="message" color={Colors.BLUE} size={30} />
          </View>
          <View style={styles.Before__View}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="location" color={Colors.BLUE} size={30} />
            </View>
            <TextComponent
              style={styles.txt}
              text={
                'Home\n1629 K St Suite 300, N.W.\nWashington. D.C. 20006, USA'
              }
            />
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <TextComponent style={styles.txt} text={'4:37 PM Pick-Up'} />
            </View>
          </View>

          <ThreeDots />

          <View style={styles.Before__View}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="location" color={Colors.BLUE} size={30} />
            </View>
            <TextComponent
              style={styles.txt}
              text={'School\nAcademic Magnet High\nSchool'}
            />
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <TextComponent style={styles.txt} text={'5:37 PM Drop-off'} />
            </View>
          </View>

          <ThreeDots />

          <View style={styles.Before__View}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="location" color={Colors.BLUE} size={30} />
            </View>
            <TextComponent
              style={styles.txt}
              text={'Home2\nGrand Kenyon, USA'}
            />
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <TextComponent style={styles.txt} text={'5:37 PM Drop-off'} />
            </View>
          </View>
          <SubmitButton text={'Start Ride'} />
        </ScrollView>
      </View>
    </View>
  );
};

export default PickUp;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  second__Container: {
    flex: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  subContainer: {
    flex: 1,
  },
  Before_After_Main_View_Style: {
    width: '30%',
    alignSelf: 'center',
    backgroundColor: Colors.LIGHT_GRAY_1,
    borderRadius: 10,
    elevation: 2,
    height: 10,
    marginVertical: 10,
  },
  Simple: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 4,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  Avatar: {
    width: 150,
    height: 150,
  },
  Avatar__View: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  Before__View: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    padding: 10,
  },
  txt: {
    fontSize: 11,
  },
  dotss: {
    width: '70%',
    alignSelf: 'center',
  },
});
