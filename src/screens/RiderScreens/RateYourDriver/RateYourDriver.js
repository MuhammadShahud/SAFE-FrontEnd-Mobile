import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView,
  FlatList
} from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../../Styles';
import Header from '../../../components/Header';
import mapImage from '../../../assets/driver/map.png';
import YellowLady from '../../../assets/rider/yellowlady.png';
import TextComponent from '../../../components/TextComponent';
import TextInput from '../../../components/TextInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Stars from 'react-native-stars';
import SubmitButton from '../../../components/SubmitButton';
import { useSelector, useDispatch } from 'react-redux'
import { img_url } from '../../../configs/APIs';
import AlertAction from '../../../redux/Actions/AlertActions';
import { RideMiddleware } from '../../../redux/Middlewares/RideMiddleware';
import { useNavigation } from '@react-navigation/native';

const RateYourDriver = () => {
  const [comment, setComment] = useState('');
  const [rating, setrating] = useState(0)

  const rideDetails = useSelector((state) => state.Ride.rideDetails)
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const submitRating = () => {

    if (comment && rating != 0) {
      let data = {
        ride_id: rideDetails?.id,
        user_id: rideDetails?.driver?.id,
        rating: rating,
        review: comment
      }
      dispatch(RideMiddleware.rateDriver(data))
        .then(() => {
          setComment('')
          setrating(0)
          dispatch(AlertAction.ShowAlert({ title: 'Reviews', message: 'Review Submitted Successfully' }))
          navigation.navigate('RiderDashBoard')
        }).catch()

    } else {
      dispatch(AlertAction.ShowAlert({ title: 'Reviews', message: 'All fields are required' }))
    }

  }
  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <ImageBackground style={styles.bg__img} source={mapImage}>
          <Header title={'Rate Driver'} headerLeft={true} />

          <View style={styles.Before_After_Main_View_Style}>
            <View style={styles.display__center}>
              <Image style={{ width: 150, height: 150, borderRadius: 100 }} source={rideDetails?.driver?.image ? { uri: img_url + rideDetails?.driver?.image } : YellowLady} />
              <TextComponent style={styles.ft} text={rideDetails?.driver?.username} />
            </View>
            <View style={styles.widthee}>
              <Text style={styles.blue__txt}>Ride Details</Text>
              <View style={{ height: 80 }}>
                <FlatList
                  data={rideDetails?.ride_locations}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => {
                    return (

                      <View style={styles.direction}>
                        <Ionicons
                          color={Colors.BLUE}
                          name={index == 0 ? "ios-radio-button-on-outline" : "location"}
                          size={20}
                        />
                        <TextComponent
                          style={{ fontSize: 12 }}
                          text={item?.address}
                          numberOfLines={2}
                        />
                      </View>

                    )
                  }}
                />
              </View>

              <TextComponent style={styles.txtHEad} text={'Review'} />
              <View style={styles.starts}>
                <Stars
                  default={rating}
                  count={5}
                  update={(val) => { setrating(val) }}
                  fullStar={
                    <Ionicons
                      name={'star'}
                      style={[styles.myStarStyle]}
                      size={22}
                    />
                  }
                  emptyStar={
                    <Ionicons
                      name={'star-outline'}
                      style={[styles.myStarStyle, styles.myEmptyStarStyle]}
                      size={22}
                    />
                  }
                  halfStar={
                    <Ionicons
                      name={'star-half'}
                      style={[styles.myStarStyle]}
                      size={22}
                    />
                  }
                />
              </View>
              <View style={styles.txt__input}>
                <TextInput
                  value={comment}
                  onChangeText={val => setComment(val)}
                  placeholder={'Additional Comment'}
                  placeholderTextColor={Colors.GRAY}
                  height={150}
                  multiLine={true}
                />
              </View>
            </View>
            <SubmitButton text={'Submit'} onPress={() => submitRating()} />
          </View>

        </ImageBackground>
      </ScrollView>
    </View>
  );
};

export default RateYourDriver;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  bg__img: {
    width: '100%',
    height: '100%',
  },
  Before_After_Main_View_Style: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 10,
  },
  display__center: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  ft: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  widthee: {
    width: '80%',
    alignSelf: 'center',
  },
  blue__txt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.BLUE,
  },
  direction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    width: '90%'
  },
  txtHEad: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
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
  starts: {
    marginRight: 140,
    marginVertical: 10,
  },
  txt__input: {
    width: '102%',
    alignSelf: 'center',
    backgroundColor: 'rgba(236, 240, 241,1.0)',
    borderRadius: 10,
  },
});
