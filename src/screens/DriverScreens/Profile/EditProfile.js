import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Button,
  Alert
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import person1 from '../../../assets/driver/person1.png';
import { Colors } from '../../../Styles';
import Curve from '../../../assets/driver/background.png';
import Calender from '../../../assets/driver/calender.png';
import clock from '../../../assets/driver/clock.png';
import SimpleHeader from '../../../components/SimpleHeader';
import TextComponent from '../../../components/TextComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextInput from '../../../components/TextInput';
import SelectDropdown from 'react-native-select-dropdown';
import SubmitButton from '../../../components/SubmitButton';
import DatePicker from 'react-native-date-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../../../components/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import { Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { AuthMiddleware } from '../../../redux/Middlewares/AuthMiddleware';
import moment from 'moment';
import { img_url } from '../../../configs/APIs';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertActions from '../../../redux/Actions/AlertActions'



const EditProfile = () => {
  const StatusListGender = ['male', 'female', 'other'];
  const DAYS = [
    'Select All',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const user = useSelector(state => state.Auth.user);
  const [items, setItems] = useState([
    { label: 'Monday', value: false },
    { label: 'Tuesday', value: false },
    { label: 'Wednesday', value: false },
    { label: 'Thursday', value: false },
    { label: 'Friday', value: false },
    { label: 'Saturday', value: false },
    { label: 'Sunday', value: false }
  ]);
  const [firstname, setFirstName] = useState(user?.user?.first_name);
  const [lastname, setLastName] = useState(user?.user?.last_name);
  const [email, setEmail] = useState('');
  const [phonenumber, setPhoneNumber] = useState(user?.user?.phone);
  const [address, setAddress] = useState(user?.user?.address);
  const [gender, setGender] = useState(user?.user?.gender);

  const [openMultiple, setOpenMultiple] = useState(false);
  const [value, setValue] = useState([value]);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(null);
  const [vehicle, setVehicle] = useState(user?.user?.vehicle?.vehicle_brand);
  const [model, setModel] = useState(user?.user?.vehicle?.model);

  const [year, setYear] = useState(user?.user?.vehicle?.year);
  const [clr, setClr] = useState(user?.user?.vehicle?.color);

  const [license, setLicense] = useState(user?.user?.vehicle?.license_plate);

  const [nameoncard, setNameOnCard] = useState(user?.user?.licence?.name_on_card);
  const [drivingLicense, setDrivingLicense] = useState(user?.user?.licence?.license_plate_number);
  const [expiryOne, setExpiryOne] = useState(user?.user?.licence?.expiry);

  const [availability, setAvailability] = useState(user?.user?.user_availability ? user?.user?.user_availability : []);


  const navigation = useNavigation();
  const StatusList = ['Car', 'SUV', 'Mini Van'];
  const [Status, setStatus] = useState(user?.user?.vehicle?.booking_type?user?.user?.vehicle?.booking_type:"Car");

  const [profilePic, setProfilePic] = useState(null);
  const backspace = useRef(false);



  const toSentenceCase = (str = "") => {
    if (!str)
      return;
    let cap = str.charAt(0).toUpperCase();
    str.slice(0, 1);
    return cap + str;
  }

  useEffect(() => {
    let arr = items.map(v => {
      let itm = user?.user?.user_availability.findIndex(a => v.label.toLocaleLowerCase() == a.day);
      if (itm > -1)
        v.value = true;

      return v;
    })
    setItems(arr)
  }, [])

  const dispatch = useDispatch();


  const onPressDone = () => {
    if (!nameoncard || !drivingLicense || !vehicle || !model || !clr || !license || !Status || !year) {
      alert("Please fill all feilds")
      return;
    }
    let avail = true;
    availability.forEach((av) => {
      if (!av?.start_time || !av?.end_time)
        avail = false
    })
    if (!avail) {
      alert("Please fill all availability feilds")
      return;
    }
    dispatch(AuthMiddleware.UpdateProfile({
      firstname,
      lastname,
      phonenumber,
      address,
      gender,
      license_name: nameoncard,
      license_number: drivingLicense,
      vehicle_brand: vehicle,
      vehicle_model: model,
      vehicle_color: clr,
      vehicle_plate: license,
      vehicle_booking: Status.toLocaleLowerCase(),
      license_expiry: expiryOne,
      vehicle_year: year,
      role: user.role,
      image: profilePic,
      availability,
      edit: true,
      onSuccess: () => {
        navigation.goBack()
      }
    })).then(async (data) => {
      let userdata = {
        ...user,
        user: data
      }
      await AsyncStorage.setItem('@user', JSON.stringify(userdata))
      dispatch(AlertActions.ShowAlert({ title: 'Edit Profile', message: 'Profile Successfully Updated.' }))
    }).catch()
  }

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
          setProfilePic(img)
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
          setProfilePic(img)
        })
      }
    }])
  }

  return (
    <View style={styles.mainContainer}>
      <Image resizeMode="cover" style={styles.pic} source={Curve} />
      <Header title={'Edit Profile'} headerLeft={true} fontWhite={true} />
      <ScrollView>
        <View style={styles.Avatar__View}>
          <Image style={styles.Avatar} source={profilePic?.uri ? { uri: profilePic?.uri } : (user?.user.image ? { uri: img_url + user?.user?.image } : person1)} />
          <TouchableOpacity style={styles.Avatar__camera} onPress={pickImageProfile}>
            <Ionicons name="camera" size={30} />
          </TouchableOpacity>
        </View>
        <TextComponent
          style={styles.Vehicle__}
          text={'Personal Information'}
        />
        <View style={styles.Two__inputs}>
          <View style={{ flex: 1 }}>
            <Text style={styles.InputUpper_text}>First Name</Text>
            <TextInput
              value={firstname}
              onChangeText={val => setFirstName(val)}
              placeholder={'Steve'}
              placeholderTextColor={Colors.GRAY}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.InputUpper_text}>Last Name</Text>

            <TextInput
              value={lastname}
              onChangeText={val => setLastName(val)}
              placeholder={'Smith'}
              placeholderTextColor={Colors.GRAY}
            />
          </View>
        </View>
        {/* <View style={{ marginTop: 10 }}>
          <Text style={styles.InputUpper_text}>Email</Text>
          <View style={{ flex: 1 }}>
            <TextInput
              value={email}
              onChangeText={val => setEmail(val)}
              placeholder={'JohnDoe@safe.com'}
              placeholderTextColor={Colors.GRAY}
            />
          </View>
        </View> */}
        <View style={{ marginTop: 10 }}>
          <Text style={styles.InputUpper_text}>Phone Number</Text>
          <View style={{ flex: 1 }}>
            <TextInput
              value={phonenumber}
              onChangeText={val => setPhoneNumber(val)}
              placeholder={'+123 4567890'}
              placeholderTextColor={Colors.GRAY}
              keyboardType="phone-pad"
            />
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <TextComponent
            text={'Gender'}
            style={styles.InputUpper_text}
          />
          <SelectDropdown
            data={StatusListGender}
            onSelect={(selectedItem, index) => {
              setGender(selectedItem);
              console.log(selectedItem, index);
            }}
            defaultValue={gender}
            defaultButtonText={'Select Gender'}
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
              width: '90%',
              height: 45,
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
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.InputUpper_text}>Address</Text>
          <View style={{ flex: 1 }}>
            <TextInput
              value={address}
              onChangeText={val => setAddress(val)}
              placeholder={'123 Building, XYZ Road, NY'}
              placeholderTextColor={Colors.GRAY}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('PaymentByBankAccount')}
          style={{ width: '85%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 20 }}>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons
              name="radiobox-marked"
              color={Colors.BLUE}
              size={25}
            />

            <TextComponent
              style={{ fontWeight: 'bold', marginHorizontal: 10 }}
              text={'Add Bank Account'}
            />
          </View>

          <MaterialCommunityIcons
            name="chevron-right"
            color={Colors.BLUE}
            size={25}
          />

        </TouchableOpacity>



        <TextComponent
          style={styles.Vehicle__}
          text={'Vehicle Information'}
        />
        <View style={styles.Two__inputs}>
          <View style={{ flex: 1 }}>
            <Text style={styles.InputUpper_text}>Vehicle Brand</Text>

            <TextInput
              value={vehicle}
              onChangeText={val => setVehicle(val)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.InputUpper_text}>Model</Text>

            <TextInput value={model} onChangeText={val => setModel(val)} />
          </View>
        </View>
        <View style={styles.Two__inputs}>
          <View style={{ flex: 1 }}>
            <Text style={styles.InputUpper_text}>Year</Text>

            <TextInput
              value={year}
              onChangeText={val => setYear(val)}
              keyboardType="number-pad"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.InputUpper_text}>Color</Text>

            <TextInput value={clr} onChangeText={val => setClr(val)} />
          </View>
        </View>
        <View style={styles.Two__inputs}>
          <View style={{ flex: 1 }}>
            <Text style={styles.InputUpper_text}>License Plate #</Text>

            <TextInput
              value={license}
              onChangeText={val => setLicense(val)}
              keyboardType="number-pad"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.InputUpper_text}>Booking Type</Text>

            <SelectDropdown
              data={StatusList}
              onSelect={(selectedItem, index) => {
                setStatus(selectedItem);
                console.log(selectedItem, index);
              }}
              defaultValue={'Car'}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              buttonStyle={{
                backgroundColor: 'rgba(211,211,211,0.4)',
                borderColor: Colors.BLUE,
                borderRadius: 10,
                alignSelf: 'center',
                // marginBottom: 5,
                marginVertical: 7,
                width: '90%',
                height: 45,
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
          </View>
        </View>
        <View>
          <TextComponent
            style={styles.Vehicle__}
            text={'Vehicle Information'}
          />
        </View>
        <Text style={styles.InputUpper_text}>Name on Card</Text>
        <View style={{ flex: 1 }}>
          <TextInput
            value={nameoncard}
            onChangeText={val => setNameOnCard(val)}
          />
        </View>

        <View style={styles.Two__inputs}>
          <View style={{ flex: 1 }}>
            <Text style={styles.InputUpper_text}>Driving License #</Text>

            <TextInput
              value={drivingLicense}
              onChangeText={val => setDrivingLicense(val)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.InputUpper_text}>Expiry</Text>

            <TextInput
              placeholder={"2022-01-01"}
              value={expiryOne}
              onChangeText={val => {
                if (backspace.current) {
                  setExpiryOne(val)
                  return;
                }
                if (val.length == 4 || val.length == 7)
                  val = val + "-";

                setExpiryOne(val)
              }}
              length={10}
              keyboardType="numeric"
              onKeyPress={(e) => {
                backspace.current = e.nativeEvent.key == "Backspace"
              }}
            />
          </View>
        </View>
        <View>
          <TextComponent style={styles.Vehicle__} text={'Set Availability'} />
        </View>
        <View style={styles.direction}>
          <Image style={styles.img__calender} source={Calender} />
          <Text style={styles.calender__text}>Select Days</Text>
        </View>
        <View style={{ width: '82%', alignSelf: 'center', height: 160, borderRadius: 10 }}>
          {/* <SelectDropdown
            buttonStyle={{width: 300, borderRadius: 10}}
            data={DAYS}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
          /> */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: "wrap" }}>
            {
              items.map((day, index) => (
                <TouchableOpacity style={styles.check__touch}>
                  <View>
                    <Checkbox
                      status={day.value ? "checked" : "unchecked"}
                      uncheckedColor="gray"
                      color={Colors.BLUE}
                      onPress={() => {
                        let itm = { ...day };
                        itm.value = !itm.value;
                        let arr = [...items];
                        arr.splice(index, 1, itm);
                        setItems(arr);
                        if (itm.value)
                          setAvailability([...availability, { day: itm.label }])
                        else {
                          let index = availability.findIndex(v => v.day == itm.label);
                          availability.splice(index, 1)
                          setAvailability(availability)
                        }

                      }}
                    />
                  </View>
                  <Text style={styles.underline__two}>{day.label}</Text>
                </TouchableOpacity>
              ))
            }
          </View>
        </View>
        <View style={[styles.direction, { marginVertical: 10 }]}>
          <Image style={styles.img__calender} source={clock} />
          <Text style={styles.calender__text}>Set Time</Text>
        </View>
        {
          availability.length > 0 ?
            availability.map((day, index) => (
              <View>
                <TextComponent
                  style={[styles.InputUpper_text, { textAlign: "center" }]}
                  text={day.day}
                />
                <View style={styles.Two__inputs__time}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.InputUpper_text}>Start Time</Text>
                    <TouchableOpacity
                      onPress={() => setOpen({ index, start: true })}
                      style={styles.touch__time}>
                      <Text>{day?.start_time ? moment("2022-01-01 " + day?.start_time).format("hh:mm A") : "Start Time"}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1, marginLeft: 5 }}>
                    <Text style={styles.InputUpper_text}>End Time</Text>

                    <TouchableOpacity
                      onPress={() => setOpen({ index, start: false })}
                      style={styles.touch__time}>
                      <Text>{day?.end_time ? moment("2022-01-01 " + day?.end_time).format("hh:mm A") : "End Time"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
            : null}

        <SubmitButton text={'Save Profile'} onPress={onPressDone} />
      </ScrollView>
      <DatePicker
        title={'Select Time'}
        modal
        open={open}
        date={date}
        onConfirm={date => {
          let itm = availability[open.index];
          if (open.start)
            itm.start_time = date.toLocaleTimeString()
          else
            itm.end_time = date.toLocaleTimeString()

          setAvailability(availability)
          setOpen(null);
        }}
        onCancel={() => {
          setOpen(null);
        }}
        mode="time"
        is24hourSource='device'
      />
    </View>
  );
};

export default EditProfile;

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
    bottom: 25,
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
  calender__text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.BLACK,
  },
  img__calender: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  direction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginHorizontal: 25,
  },
  touch__time: {
    backgroundColor: 'rgba(236, 240, 241,1.0)',
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  check__touch: {
    flexDirection: 'row',
  },
  underline__two: {
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  AlignSelf: {
    width: '90%',
    alignSelf: 'center',
  },
  Two__inputs__time: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    width: '90%',
    alignSelf: 'center',

  }
});
