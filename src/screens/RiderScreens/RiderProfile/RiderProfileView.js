import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useEffect } from 'react';
import { Colors } from '../../../Styles';
import Header from '../../../components/Header';
import Curve from '../../../assets/driver/background.png';
import lady from '../../../assets/driver/Person3.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextComponent from '../../../components/TextComponent';
import SubmitButton from '../../../components/SubmitButton';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { img_url } from '../../../configs/APIs';
import AuthActions from '../../../redux/Actions/AuthActions'

const RiderProfileView = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.Auth.user);

  const dispatch = useDispatch()


  return (
    <View style={styles.mainContainer}>
      <Image resizeMode="cover" style={styles.pic} source={Curve} />
      <Header title={'Profile'} headerLeft={true} fontWhite={true} />
      <ScrollView>
        <View style={styles.Avatar__View}>
          <Image style={styles.Avatar} source={user?.user?.image ? { uri: img_url + user?.user?.image } : lady} />
          {/* <TouchableOpacity style={styles.Avatar__camera}>
            <Ionicons name="camera" size={30} />
          </TouchableOpacity> */}
          <TextComponent
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 15,
            }}
            text={user?.user?.first_name + " " + user?.user?.last_name}
          />
        </View>
        <Text style={styles.info_text}>Personal Information</Text>
        <View style={styles.Before_After_Main}>
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

        <Text style={styles.info_text}>Children Information</Text>
        <FlatList
          data={user?.user?.childrens}
          renderItem={({ item }) => {
            return (
              <View style={styles.Before_After_Main}>
                <View style={styles.direction}>
                  <View>
                    <TextComponent style={styles.text__sty} text={'First Name'} />
                    <Text style={styles.gray__style}>{item?.first_name}</Text>
                  </View>
                  <View>
                    <TextComponent style={styles.text__sty} text={'Last Name'} />
                    <Text style={styles.gray__style}>{item?.last_name}</Text>
                  </View>
                </View>
                <View style={styles.direction}>
                  <View>
                    <TextComponent style={styles.text__sty} text={'Grade'} />
                    <Text style={styles.gray__style}>{item?.grade}</Text>
                  </View>
                  <View>
                    <TextComponent style={styles.text__sty} text={'Age           '} />
                    <Text style={styles.gray__style}>{item?.age}</Text>
                  </View>
                </View>
                <View style={{ marginHorizontal: 26, padding: 5 }}>
                  <TextComponent style={styles.text__sty} text={'School Name'} />
                  <Text style={styles.gray__style}>{item?.school_name}</Text>
                </View>
                <View style={{ marginHorizontal: 26, padding: 5 }}>
                  <TextComponent style={styles.text__sty} text={item?.payment_type?.toLowerCase() == 'card' ? 'Card number' : 'Bank account'} />
                  <Text style={styles.gray__style}>{item?.payment_type?.toLowerCase() == 'card' ?
                    "**************" + item?.payment_method?.end_number : item?.payment_method?.number ?
                      item?.payment_method?.number?.toString()?.substr(0, 4) + "**************" : ''
                  }</Text>
                </View>
                <View style={{ marginHorizontal: 26, padding: 5 }}>
                  <TextComponent style={styles.text__sty} text={'Payment Method'} />
                  <Text style={styles.gray__style}>{item?.payment_type}</Text>
                </View>

              </View>
            )
          }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
              <TextComponent text={'No Children Found'} />
            </View>
          }
        />



        <SubmitButton
          onPress={() => navigation.navigate('RiderProfile')}
          text={'Edit Profile'}
        />
      </ScrollView>
    </View>
  );
};

export default RiderProfileView;

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
  Avatar__View: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 240,
    width: '100%',
  },
  Avatar: {
    width: 150,
    height: 150,
    borderRadius: 100
  },
  Avatar__camera: {
    position: 'absolute',
    bottom: 45,
    backgroundColor: Colors.WHITE,
    borderRadius: 18,
    padding: 3,
  },
  Vehicle__: {
    fontSize: 20,
    textAlign: 'center',
    color: Colors.WHITE,
    marginVertical: 12,
    fontWeight: 'bold',
  },
  Before_After_Main_View_Style: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 10,
  },
  Two__inputs: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
  },
  InputUpper_text: {
    fontWeight: 'bold',
    width: '90%',
    alignSelf: 'center',
    color: '#000',
  },
  direction: {
    flexDirection: 'row',
    width: '70%',
    alignSelf: 'center',
  },
  Plus__Image: {
    width: 30,
    height: 30,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  pad: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 3,
  },
  info_text: {
    fontSize: 25,
    color: Colors.BLACK,
    fontWeight: 'bold',
    textAlign: 'center',
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
