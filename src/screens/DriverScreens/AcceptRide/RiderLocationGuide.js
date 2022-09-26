import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import {Colors} from '../../../Styles';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Car from '../../../assets/driver/Car.png';
import Header from '../../../components/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import person from '../../../assets/driver/Person2.png';
import Ladies from '../../../assets/driver/ladies.png';
import {useNavigation} from '@react-navigation/native';

const RiderLocationGuide = () => {
  const navigation = useNavigation();

  const onPressEmergency = number => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }

    Linking.openURL(phoneNumber);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={{flex: 1}}>
        <MapView
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={true}
          style={{flex: 1}}
          region={{
            latitude: 40.706972,
            longitude: -74.2262037,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}>
          {/* <Marker coordinate={{latitude: 40.705744, longitude: -74.2273627}}>
            <View>
              <Image
                source={person}
                style={{width: 50, height: 50, resizeMode: 'contain'}}
              />
            </View>
          </Marker>
          <Marker coordinate={{latitude: 40.719632, longitude: -74.2273627}}>
            <View>
              <Image
                source={Ladies}
                style={{width: 50, height: 50, resizeMode: 'contain'}}
              />
            </View>
          </Marker> */}
        </MapView>
        <View style={{position: 'absolute', width: '100%'}}>
          <Header headerLeft={true} title={'Pick Up'} />
        </View>

        
      </View>
    </View>
  );
};

export default RiderLocationGuide;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  Online_Text: {
    alignSelf: 'center',
    color: Colors.BLUE,
    fontWeight: 'bold',
    fontSize: 12,
  },
  Emergency__red: {
    backgroundColor: Colors.RED,
    padding: 20,
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  Bottom_Item_Style: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: Colors.WHITE_2,
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    width: '90%',
    padding: 15,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Emergency_Button_View: {
    position: 'absolute',
    bottom: 100,
    height: 100,
    width: 100,
    borderRadius: 50,
    padding: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE_2,
    marginLeft: 15,
  },
});
