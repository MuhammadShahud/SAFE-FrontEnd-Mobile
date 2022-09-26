import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import React from 'react';
import { Colors } from '../../../Styles';
import { useNavigation } from '@react-navigation/native';
import SimpleHeader from '../../../components/SimpleHeader';
import Curve from '../../../assets/driver/background.png';
import person1 from '../../../assets/driver/person1.png';
import TextComponent from '../../../components/TextComponent';
import SubmitButton from '../../../components/SubmitButton';
import Header from '../../../components/Header';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { img_url } from '../../../configs/APIs';

const Profile = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.Auth.user);
  console.warn(user?.user?.user_payment_methods)

  return (
    <View style={styles.mainContainer}>
      <Image resizeMode="cover" style={styles.pic} source={Curve} />
      <Header title={'Profile'} headerLeft={true} fontWhite={true} />
      <ScrollView>
        <View style={styles.Avatar__View}>
          <Image style={styles.Avatar} source={user?.user.image ? { uri: img_url + user?.user?.image } : person1} />
        </View>
        <Text style={styles.info_text}>Personal Information</Text>
        <View style={styles.Before_After_Main_View_Style}>
          <View style={styles.direction}>
            <View>
              <TextComponent style={styles.text__sty} text={'First Name'} />
              <Text style={styles.gray__style}>{user?.user?.first_name}</Text>
            </View>
            <View>
              <TextComponent style={styles.text__sty} text={'Last Name'} />
              <Text style={styles.gray__style}>{user?.user?.last_name}</Text>
            </View>
          </View>
          <View style={{ marginHorizontal: 26, padding: 5 }}>
            <TextComponent style={styles.text__sty} text={'Email ID'} />
            <Text style={styles.gray__style}>{user?.user?.email}</Text>
          </View>
          <View style={{ marginHorizontal: 26, padding: 5 }}>
            <TextComponent style={styles.text__sty} text={'Contact Number'} />
            <Text style={styles.gray__style}>{user?.user?.phone}</Text>
          </View>
          <View style={{ marginHorizontal: 26, padding: 5 }}>
            <TextComponent style={styles.text__sty} text={'Address'} />
            <Text style={styles.gray__style}>{user?.user?.address}</Text>
          </View>
        </View>
        <Text style={[styles.info_text, { marginVertical: 10 }]}>
          Vehicle Information
        </Text>
        <View style={styles.Before_After_Main_View_Style}>
          <View style={styles.direction}>
            <View>
              <TextComponent style={styles.text__sty} text={'Vehicle Brand'} />
              <Text style={styles.gray__style}>{user?.user?.vehicle?.vehicle_brand}</Text>
            </View>
            <View>
              <TextComponent style={styles.text__sty} text={'Vehicle Model'} />
              <Text style={styles.gray__style}>{user?.user?.vehicle?.model}</Text>
            </View>
          </View>
          <View style={styles.direction}>
            <View style={{}}>
              <TextComponent style={styles.text__sty} text={'Year'} />
              <Text style={styles.gray__style}>{user?.user?.vehicle?.year}</Text>
            </View>
            <View style={{}}>
              <TextComponent style={styles.text__sty} text={'Color'} />
              <Text style={styles.gray__style}>{user?.user?.vehicle?.color}</Text>
            </View>
          </View>
          <View style={styles.direction}>
            <View>
              <TextComponent
                style={styles.text__sty}
                text={'License Plate #'}
              />
              <Text style={styles.gray__style}>{user?.user?.vehicle?.license_plate}</Text>
            </View>
            <View>
              <TextComponent style={styles.text__sty} text={'Booking Type'} />
              <Text style={styles.gray__style}>{user?.user?.vehicle?.booking_type}</Text>
            </View>
          </View>
        </View>
        <Text style={[styles.info_text, { marginVertical: 10 }]}>
          Driving License Details
        </Text>
        <View style={styles.Before_After_Main_View_Style}>
          <View style={{ marginHorizontal: 26, padding: 5 }}>
            <TextComponent style={styles.text__sty} text={'Name on Card'} />
            <Text style={styles.gray__style}>{user?.user?.licence?.name_on_card}</Text>
          </View>
          <View style={styles.direction}>
            <View>
              <TextComponent
                style={styles.text__sty}
                text={'Driving License #'}
              />
              <Text style={styles.gray__style}>{user?.user?.licence?.license_plate_number}</Text>
            </View>
            <View>
              <TextComponent style={styles.text__sty} text={'Expiry'} />
              <Text style={styles.gray__style}>{user?.user?.licence?.expiry}</Text>
            </View>
          </View>
        </View>
        <Text style={[styles.info_text, { marginVertical: 10 }]}>
          Availability
        </Text>
        <View style={styles.Before_After_Main_View_Style}>
          <View style={{ marginHorizontal: 26, padding: 5 }}>
            <TextComponent style={styles.text__sty} text={'Available Days'} />
            {user?.user?.user_availability.map(val => (<Text style={styles.gray__style}>{val.day}</Text>))}
          </View>
          <View style={{ marginHorizontal: 26, padding: 5 }}>
            <TextComponent style={styles.text__sty} text={'Available Time'} />
            {user?.user?.user_availability.map(val => (<Text style={styles.gray__style}>{moment("2022-01-01 " + val.start_time).format("hh:mm A")} to {moment("2022-01-01 " + val.end_time).format("hh:mm A")}</Text>))}
          </View>
        </View>
        {
          user?.user?.user_payment_methods?.length > 0 ?
            <Text style={[styles.info_text, { marginVertical: 10 }]}>
              Bank Account
            </Text>
            : null}
        {
          user?.user?.user_payment_methods?.length > 0 ?
            <View style={styles.Before_After_Main_View_Style}>
              <View style={{ marginHorizontal: 26, padding: 5 }}>
                <TextComponent style={styles.text__sty} text={'Bank'} />
                {user?.user?.user_payment_methods.map(val => (<Text style={styles.gray__style}>{val?.brand}</Text>))}
              </View>
              <View style={{ marginHorizontal: 26, padding: 5 }}>
                <TextComponent style={styles.text__sty} text={'Title'} />
                {user?.user?.user_payment_methods.map(val => (<Text style={styles.gray__style}>{val?.title}</Text>))}
              </View>
              <View style={{ marginHorizontal: 26, padding: 5 }}>
                <TextComponent style={styles.text__sty} text={'Number'} />
                {user?.user?.user_payment_methods.map(val => (<Text style={styles.gray__style}>{val?.number}</Text>))}
              </View>
            </View>
            : null
        }
        <SubmitButton
          onPress={() => navigation.navigate('EditProfile')}
          text={'Edit Profile'}
        />
      </ScrollView>
    </View>
  );
};
export default Profile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  pic: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  Header_Title_Style: {
    fontWeight: 'bold',
    fontSize: 22,
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.WHITE,
  },
  Avatar__View: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 240,
    width: '100%',
  },
  Avatar: {
    width: 150,
    height: 150,
  },
  Avatar__camera: {
    position: 'absolute',
    bottom: -12,
    backgroundColor: Colors.WHITE,
    borderRadius: 18,
    padding: 3,
  },
  info_text: {
    fontSize: 25,
    color: Colors.BLACK,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  Before_After_Main_View_Style: {
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
    // backgroundColor: 'red',
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
});
