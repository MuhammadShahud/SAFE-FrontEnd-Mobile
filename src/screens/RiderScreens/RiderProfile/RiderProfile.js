import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from '../../../Styles';
import Header from '../../../components/Header';
import Curve from '../../../assets/driver/background.png';
import person1 from '../../../assets/driver/person1.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import lady from '../../../assets/driver/Person3.png';
import TextComponent from '../../../components/TextComponent';
import TextInput from '../../../components/TextInput';
import Plus from '../../../assets/rider/plus.png';
import Dustbin from '../../../assets/driver/dustbin.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import SubmitButton from '../../../components/SubmitButton';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux'
import { img_url } from '../../../configs/APIs';
import AuthAction from '../../../redux/Actions/AuthActions';
import AlertActions from '../../../redux/Actions/AlertActions'
import PaymentActions from '../../../redux/Actions/PaymentActions'
import { AuthMiddleware } from '../../../redux/Middlewares/AuthMiddleware';
import AsyncStorage from '@react-native-async-storage/async-storage';



const RiderProfile = () => {
  const selectedPayment = useSelector((state) => state.Payment.selectedPaymentMethod)

  const user = useSelector((state) => state.Auth.user)
  const Childs = useSelector((state) => state.Auth.childrenData)

  const navigation = useNavigation();
  const [firstname, setFirstName] = useState(user?.user?.first_name);
  const [lastname, setLastName] = useState(user?.user?.last_name);
  const [email, setEmail] = useState(user?.user?.email);
  const [phonenumber, setPhoneNumber] = useState(user?.user?.phone);
  const [address, setAddress] = useState(user?.user?.address);
  const [gender, setgender] = useState(user?.user?.gender)
  const [vehicle, setVehicle] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [clr, setClr] = useState('');
  const [license, setLicense] = useState('');
  const [expiry, setExpiry] = useState('');
  const [nameoncard, setNameOnCard] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');
  const [expiryOne, setExpiryOne] = useState('');
  const [grade, setGrade] = useState('');
  const [age, setAge] = useState('');
  const [schoolName, setschoolName] = useState('');
  const [MultipleAddress, setMultipleAddress] = useState(user?.user?.childrens);
  const StatusList = ['Male', 'Female', 'Other'];
  const [Refresh, setRefresh] = useState(false);
  const [image, setUploadImage] = useState()

  const dispatch = useDispatch()

  useEffect(() => {
    fetch()
  }, [selectedPayment])


  const fetch = () => {
    if (selectedPayment) {
      let addPayment = [...Childs]
      addPayment[selectedPayment.childIndex].payment_method = selectedPayment
      setMultipleAddress(addPayment)
      dispatch(AuthAction.getChilds(addPayment))
    } else {
      dispatch(AuthAction.getChilds(user?.user?.childrens))
    }
  }

  const onPressAddAddress = () => {
    if (MultipleAddress?.length > 0) {
      let index = MultipleAddress.length - 1
      if (
        MultipleAddress[index].first_name &&
        MultipleAddress[index].last_name &&
        MultipleAddress[index].grade &&
        MultipleAddress[index].age &&
        MultipleAddress[index].school_name &&
        MultipleAddress[index].payment_type &&
        MultipleAddress[index].payment_method
      ) {
        let array = [...MultipleAddress]
        array.push({
          id: null,
          first_name: '',
          last_name: '',
          grade: '',
          age: '',
          school_name: '',
          payment_type: '',
          payment_method: null
        });
        setMultipleAddress(array)
        setRefresh(!Refresh);
      } else {
        dispatch(AlertActions.ShowAlert({ title: 'Edit Profile', message: 'All fields are required' }))
      }
    } else {
      let array = [...MultipleAddress]
      array.push({
        id: null,
        first_name: '',
        last_name: '',
        grade: '',
        age: '',
        school_name: '',
        payment_type: '',
        payment_method: null
      });
      setMultipleAddress(array)
    }
  };

  const pickImageProfile = () => {
    Alert.alert("Select Option", "Where do you want to pick image from", [{
      text: "Cancel",
    }, {
      text: "Camera",
      onPress: () => {
        ImagePicker.openCamera({
          compressImageQuality: 0.8,
          mediaType: "photo",
        }).then((image) => {
          let nameArr = image.path.split("/");
          let Pname = nameArr[nameArr.length - 1]
          let name = image.filename ? image.filename : Pname;
          let img = {
            name,
            size: image.size,
            type: image.mime,
            uri: image.path
          }
          setUploadImage(img)
        })
      }
    }, {
      text: "Library",
      onPress: () => {
        ImagePicker.openPicker({
          compressImageQuality: 0.8,
          mediaType: "photo",
        }).then((image) => {
          let nameArr = image.path.split("/");
          let Pname = nameArr[nameArr.length - 1]
          let name = image.filename ? image.filename : Pname;
          let img = {
            name,
            size: image.size,
            type: image.mime,
            uri: image.path
          }
          setUploadImage(img)
        })
      }
    }])
  }

  const PaymentType = (type, index) => {
    let array = [...MultipleAddress]
    array[index].payment_type = type
    dispatch(AuthAction.getChilds(array))
    if (type == 'card') {
      navigation.navigate('PaymentByCard', { isPay: true, index, type: type, isBank: true })
    } else {
      // navigation.navigate('PaymentByBankAccount', { index })
      navigation.navigate('PaymentByCard', { isPay: true, index, type: type, isCard: true })
    }
  }

  const saveProfile = () => {
    if (MultipleAddress?.length > 0) {
      if (selectedPayment == null) {
        dispatch(AlertActions.ShowAlert({ title: 'Edit Profile', message: 'Please select payment method' }))
        return
      }
      let index = MultipleAddress.length - 1
      if (
        !MultipleAddress[index].first_name ||
        !MultipleAddress[index].last_name ||
        !MultipleAddress[index].grade ||
        !MultipleAddress[index].age ||
        !MultipleAddress[index].school_name ||
        !MultipleAddress[index].payment_type ||
        !MultipleAddress[index].payment_method

      ) {
        dispatch(AlertActions.ShowAlert({ title: 'Edit Profile', message: 'All child fields are required' }))
        return
      }
    }
    dispatch(AuthMiddleware.UpdateProfile({
      firstname,
      lastname,
      image,
      email,
      phonenumber,
      address,
      gender,
      childrens: MultipleAddress,
      edit: true,
      onSuccess: () => {
      }
    })).then(async (data) => {
      let userdata = {
        ...user,
        user: data
      }
      await AsyncStorage.setItem('@user', JSON.stringify(userdata))
      dispatch(AlertActions.ShowAlert({ title: 'Edit Profile', message: 'Profile Successfully Updated.' }))
      dispatch(AuthAction.getChilds([]))
      dispatch(PaymentActions.selectedPaymentmethod(null))
      navigation.goBack()
    }).catch()
  }

  const deleteChild = (item, index) => {
    if (item?.id) {
      dispatch(AuthMiddleware.deleteChild(item?.id))
        .then(async (data) => {
          setMultipleAddress(data?.childrens)
          let userdata = {
            ...user,
            user: data
          }
          await AsyncStorage.setItem('@user', JSON.stringify(userdata))
          dispatch(AlertActions.ShowAlert({ title: 'Delete', message: 'Child Deleted Successfully.' }))
        }).catch()

    } else {
      let array = [...MultipleAddress]
      array.splice(index, 1)
      setMultipleAddress(array)
      setRefresh(!Refresh);
    }
  }

  return (
    <View style={styles.mainContainer}>
      <Image resizeMode="cover" style={styles.pic} source={Curve} />
      <Header title={'Edit Profile'} headerLeft={true} fontWhite={true} />
      <ScrollView>
        <View style={styles.Avatar__View}>

          <Image style={styles.Avatar} source={image ? { uri: image.uri } :
            user?.user?.image ? { uri: img_url + user?.user?.image } : person1} />
          <TouchableOpacity style={styles.Avatar__camera} onPress={() => pickImageProfile()}>
            <Ionicons name="camera" size={30} />
          </TouchableOpacity>
        </View>
        <TextComponent style={styles.Vehicle__} text={'Personal Information'} />
        <View style={styles.Before_After_Main_View_Style}>
          <View style={styles.Two__inputs}>
            <View style={{ flex: 1 }}>
              <TextComponent
                style={styles.InputUpper_text}
                text={'First Name'}
              />
              <TextInput
                value={firstname}
                onChangeText={val => setFirstName(val)}
              // placeholder={'Steve'}
              // placeholderTextColor={Colors.GRAY}
              />
            </View>

            <View style={{ flex: 1 }}>
              <TextComponent
                text={'Last Name'}
                style={styles.InputUpper_text}
              />
              <TextInput
                value={lastname}
                onChangeText={val => setLastName(val)}
              // placeholder={'Smith'}
              // placeholderTextColor={Colors.GRAY}
              />
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <TextComponent text={'Email ID'} style={styles.InputUpper_text} />
            <TextInput
              editable={false}
              value={email}
              onChangeText={val => setEmail(val)} />
          </View>

          <View style={{ flex: 1 }}>
            <TextComponent text={'Address'} style={styles.InputUpper_text} />
            <TextInput value={address} onChangeText={val => setAddress(val)} />
          </View>

          <TextComponent text={'Gender'} style={styles.InputUpper_text} />
          <SelectDropdown
            data={StatusList}
            onSelect={(selectedItem, index) => {
              setgender(selectedItem)
            }}
            defaultButtonText={user?.user.gender}
            defaultValueByIndex={user?.user.gender == 'male' ? 0 : user?.user.gender == 'female' ? 1 : 2}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={{
              backgroundColor: 'rgba(236, 240, 241,1.0)',
              borderColor: Colors.BLUE,
              borderRadius: 10,
              alignSelf: 'center',
              marginBottom: 5,
              width: '91%',
              height: 47,
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

          <View style={{ flex: 1, marginBottom: 20 }}>
            <TextComponent
              text={'Contact Number'}
              style={styles.InputUpper_text}
            />
            <TextInput
              value={phonenumber}
              onChangeText={val => setPhoneNumber(val)}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <TextComponent
            style={styles.Vehicle__}
            text={'Add Children Information'}
          />
          {MultipleAddress?.length != 5 ?
            <TouchableOpacity onPress={onPressAddAddress}>
              <Image style={styles.Plus__Image} source={Plus} />
            </TouchableOpacity>
            : null}
        </View>

        {MultipleAddress?.length > 0 && MultipleAddress?.map((item, index) => {
          return (
            <View style={styles.Before_After_Main_View_Style} key={index}>
              <TouchableOpacity
                onPress={() => {
                  deleteChild(item, index)
                }}
                style={{ width: 20, height: 20, marginHorizontal: 10, marginTop: 8, alignSelf: 'flex-end' }}
              >
                <Image style={styles.deleteBtn} source={Dustbin} />
              </TouchableOpacity>
              <View style={styles.Two__inputs}>
                <View style={{ flex: 1 }}>
                  <TextComponent
                    style={styles.InputUpper_text}
                    text={'First Name'}
                  />
                  <TextInput
                    value={item?.first_name}
                    onChangeText={val => {
                      let array = [...MultipleAddress]
                      array[index].first_name = val
                      setMultipleAddress(array)
                    }
                    }
                  // placeholder={'Steve'}
                  // placeholderTextColor={Colors.GRAY}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <TextComponent
                    text={'Last Name'}
                    style={styles.InputUpper_text}
                  />
                  <TextInput
                    value={item?.last_name}
                    onChangeText={val => {
                      let array = [...MultipleAddress]
                      array[index].last_name = val
                      setMultipleAddress(array)
                    }
                    }
                  // placeholder={'Smith'}
                  // placeholderTextColor={Colors.GRAY}
                  />
                </View>
              </View>

              <View style={styles.Two__inputs}>
                <View style={{ flex: 1 }}>
                  <TextComponent
                    text={'Grade'}
                    style={styles.InputUpper_text}
                  />
                  <TextInput
                    value={item?.grade}
                    onChangeText={val => {
                      let array = [...MultipleAddress]
                      array[index].grade = val
                      setMultipleAddress(array)
                    }
                    }
                  // placeholder={'Steve'}
                  // placeholderTextColor={Colors.GRAY}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <TextComponent text={'Age'} style={styles.InputUpper_text} />
                  <TextInput
                    value={`${item?.age}`}
                    onChangeText={val => {
                      let array = [...MultipleAddress]
                      array[index].age = val
                      setMultipleAddress(array)
                    }
                    }
                    keyboardType={'numeric'}
                  // placeholder={'Smith'}
                  // placeholderTextColor={Colors.GRAY}
                  />
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <TextComponent
                  text={'School Name'}
                  style={styles.InputUpper_text}
                />
                <TextInput
                  value={item?.school_name}
                  onChangeText={val => {
                    let array = [...MultipleAddress]
                    array[index].school_name = val
                    setMultipleAddress(array)
                  }}
                />
              </View>

              <View style={{ flex: 1, marginVertical: 5 }}>
                <TextComponent
                  text={'Payment Method'}
                  style={styles.InputUpper_text}
                />
              </View>

              <View>
                <TouchableOpacity
                  onPress={() => { PaymentType("card", index) }}
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 10,
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons
                      name={item?.payment_type?.toLowerCase() == 'card' ? "radiobox-marked" : "radiobox-blank"}
                      color={Colors.BLUE}
                      size={25}
                    />

                    <TextComponent
                      style={{ fontWeight: 'bold', marginHorizontal: 10 }}
                      text={'Card'}
                    />
                  </View>

                  <MaterialCommunityIcons
                    name="chevron-right"
                    color={Colors.BLUE}
                    size={25}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => PaymentType("bank_account", index)}
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 10,
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons
                      name={item?.payment_type?.toLowerCase() == 'bank_account' ? "radiobox-marked" : "radiobox-blank"}
                      color={Colors.BLUE}
                      size={25}
                    />

                    <TextComponent
                      style={{ fontWeight: 'bold', marginHorizontal: 10 }}
                      text={'Bank Account'}
                    />
                  </View>

                  <MaterialCommunityIcons
                    name="chevron-right"
                    color={Colors.BLUE}
                    size={25}
                  />
                </TouchableOpacity>
              </View>

              {/* <TouchableOpacity
            onPress={() => navigation.navigate('PaymentByCard')}
            style={[styles.pad, {width: '117%', alignSelf: 'center'}]}>
            <View style={styles.pad}>
              <MaterialCommunityIcons
                name="radiobox-marked"
                color={Colors.BLUE}
                size={25}
              />
              <TextComponent
                style={{marginLeft: 7, marginTop: 3}}
                text={'Card'}
              />
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              color={Colors.BLUE}
              size={25}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('PaymentByBankAccount')}
            style={styles.pad}>
            <View style={styles.pad}>
              <MaterialCommunityIcons
                name="radiobox-marked"
                color={Colors.LIGHT_GRAY}
                size={25}
              />
              <TextComponent
                style={{marginLeft: 7, marginTop: 3}}
                text={'Bank Account'}
              />
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              color={Colors.BLUE}
              size={25}
            />
          </TouchableOpacity> */}
            </View>
          );
        })}
        <SubmitButton
          onPress={() => saveProfile()}
          text={'Save Profile'}
        />
      </ScrollView>
    </View>
  );
};

export default RiderProfile;

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
    bottom: 25,
    backgroundColor: Colors.WHITE,
    borderRadius: 18,
    padding: 3,
  },
  Vehicle__: {
    fontSize: 20,
    textAlign: 'center',
    color: Colors.BLACK,
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
    width: '85%',
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
    resizeMode: 'contain',
    marginLeft: 5,
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
  deleteBtn: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  }
});
