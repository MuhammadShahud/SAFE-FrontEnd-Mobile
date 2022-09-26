import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from '../../../Styles';
import Header from '../../../components/Header';
import YellowLady from '../../../assets/rider/yellowlady.png';
import Stars from 'react-native-stars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextComponent from '../../../components/TextComponent';
import Man from '../../../assets/rider/man.png';
import Person from '../../../assets/rider/person.png';
import Person3 from '../../../assets/driver/Person3.png'
import Person2 from '../../../assets/driver/Person2.png'
import { useDispatch, useSelector } from 'react-redux'
import { AuthMiddleware } from '../../../redux/Middlewares/AuthMiddleware'
import { img_url } from '../../../configs/APIs';

const ProfileAndRating = (props) => {
  const [Loader, setLoader] = useState(false)
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.Auth.otherUserInfo)


  useEffect(() => {
    dispatch(AuthMiddleware.getUserInfo(props?.route?.params?.user_id))
  }, [])


  const [UserList, setUserList] = useState([
    {
      id: '1',
      name: 'Steve Smith',
      aTitle: 'Peter Boss',
      accountNumber: '1233**** ******* ********',
      Image: Man,
      BtnName: 'Paid',
    },
    {
      id: '2',
      name: 'Dave Rock',
      aTitle: 'Steven Herb',
      accountNumber: '1233**** ******* ********',
      Image: Person2,
      BtnName: 'Failed',
    },
    {
      id: '3',
      name: 'Stacy Doe',
      aTitle: 'Peter Boss',
      accountNumber: '1233**** ******* ********',
      Image: YellowLady,
      BtnName: 'Paid',
    },
    {
      id: '4',
      name: 'Ivory',
      aTitle: 'Steven Herb',
      accountNumber: '1233**** ******* ********',
      Image: Person2,
      BtnName: 'Failed',
    },
    {
      id: '5',
      name: 'Rock',
      aTitle: 'Peter Boss',
      accountNumber: '1233**** ******* ********',
      Image: Man,
      BtnName: 'Paid',
    },
  ]);

  const renderUserList = ({ item }) => {
    return (
      <View style={styles.Before_After_Main}>
        <View style={styles.picture__name}>
          <Image style={{ width: 45, height: 45, borderRadius: 50 }} source={item?.from_user?.Image ? { uri: img_url + item?.from_user?.Image } : Person} />
          <View>
            <Text style={styles.blue__txt}>{item?.from_user?.username}</Text>
            <TextComponent
              style={styles.ratings}
              text={item?.review}
            />
          </View>
        </View>
        <View style={{ marginRight: 70, marginBottom: 10 }}>
          <Stars
            default={item?.rating}
            count={5}
            fullStar={
              <Ionicons name={'star'} style={[styles.myStarStyle]} size={25} />
            }
            emptyStar={
              <Ionicons
                name={'star-outline'}
                style={[styles.myStarStyle, styles.myEmptyStarStyle]}
                size={25}
              />
            }
            halfStar={
              <Ionicons
                name={'star-half'}
                style={[styles.myStarStyle]}
                size={25}
              />
            }
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Header title={'Driver Profile'} headerLeft={true} />
      {userInfo ?
        <ScrollView>
          <View style={styles.Avatar__View}>
            <Image style={styles.Avatar} source={userInfo?.image ? { uri: img_url + userInfo?.image } : Person3} />
            <TextComponent style={styles.Sophia} text={userInfo?.first_name + " " + userInfo?.last_name} />
            <View>
              <Stars
                default={userInfo?.average_rating}
                count={5}
                fullStar={
                  <Ionicons
                    name={'star'}
                    style={[styles.myStarStyle]}
                    size={30}
                  />
                }
                emptyStar={
                  <Ionicons
                    name={'star-outline'}
                    style={[styles.myStarStyle, styles.myEmptyStarStyle]}
                    size={30}
                  />
                }
                halfStar={
                  <Ionicons
                    name={'star-half'}
                    style={[styles.myStarStyle]}
                    size={30}
                  />
                }
              />
            </View>
            <TextComponent
              style={styles.Vehicle__}
              text={'Personal Information'}
            />
          </View>
          <View style={styles.Before_After_Main}>
            <View style={styles.direction}>
              <View>
                <TextComponent
                  style={styles.text__sty}
                  text={'Contact Number:'}
                />
                <Text style={styles.gray__style}>{userInfo?.phone}</Text>
              </View>
            </View>
            <View style={{ marginHorizontal: 26, padding: 5 }}>
              <TextComponent style={styles.text__sty} text={'Address:'} />
              <Text style={styles.gray__style}>{userInfo?.address}</Text>
            </View>
          </View>
          <TextComponent style={styles.Vehicle__} text={'Vehicle Information'} />
          <View style={styles.Before_After_Main}>
            <View style={styles.direction}>
              <View>
                <TextComponent style={styles.text__sty} text={'Vehicle Brand'} />
                <Text style={styles.gray__style}>{userInfo?.vehicle?.vehicle_brand}</Text>
              </View>
              <View>
                <TextComponent style={styles.text__sty} text={'Vehicle Model'} />
                <Text style={styles.gray__style}>{userInfo?.vehicle?.model}</Text>
              </View>
            </View>

            <View style={styles.direction}>
              <View>
                <TextComponent style={styles.text__sty} text={'Year'} />
                <Text style={styles.gray__style}>{userInfo?.vehicle?.year}</Text>
              </View>
              <View>
                <TextComponent
                  style={styles.text__sty}
                  text={'Color              '}
                />
                <Text style={styles.gray__style}>{userInfo?.vehicle?.color}</Text>
              </View>
            </View>

            <View style={styles.direction}>
              <View>
                <TextComponent
                  style={styles.text__sty}
                  text={'License Plate #'}
                />
                <Text style={styles.gray__style}>{userInfo?.vehicle?.license_plate}</Text>
              </View>
              <View>
                <TextComponent style={styles.text__sty} text={'Booking Type'} />
                <Text style={styles.gray__style}>{userInfo?.vehicle?.booking_type}</Text>
              </View>
            </View>
          </View>
          <TextComponent style={styles.Vehicle__} text={'Ratings and Reviews'} />
          <FlatList
            data={userInfo?.get_review}
            keyExtractor={item => item?.id}
            renderItem={renderUserList}
            ListEmptyComponent={
              <View style={{ marginBottom: 10, alignItems: 'center' }}>
                <Text style={{ color: Colors.LIGHT_GRAY }}>No Reviews Found</Text>
              </View>
            }
          />
        </ScrollView>
        :
        null
      }
    </View>
  );
};

export default ProfileAndRating;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  Avatar__View: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 280,
    width: '100%',
  },
  Avatar: {
    width: 150,
    height: 150,
    borderRadius: 100
  },
  Avatar__camera: {
    position: 'absolute',
    bottom: 25,
    backgroundColor: Colors.WHITE,
    borderRadius: 18,
    padding: 3,
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
  Vehicle__: {
    fontSize: 20,
    textAlign: 'center',
    color: Colors.WHITE,
    marginVertical: 12,
    fontWeight: 'bold',
  },
  Before_After_Main: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 10,
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
    paddingHorizontal: 30,
  },
  text__sty: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gray__style: {
    color: Colors.GRAY,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  picture__name: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  blue__txt: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  ratings: {
    padding: 5,
  },
  Sophia: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5
  }
});
