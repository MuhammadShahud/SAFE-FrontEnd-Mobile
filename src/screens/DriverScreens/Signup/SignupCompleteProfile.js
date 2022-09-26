import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert
} from 'react-native';
import React, { useRef, useState } from 'react';
import Header from '../../../components/Header';
import Person from '../../../assets/driver/person1.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../../Styles';
import TextComponent from '../../../components/TextComponent';
import TextInput from '../../../components/TextInput';
import CameraImage from '../../../assets/driver/camera.png';
import Dot1 from '../../../assets/driver/dot1.png';
import Dot2 from '../../../assets/driver/dot2.png';
import Curve from '../../../assets/driver/background.png';
import SubmitButton from '../../../components/SubmitButton';
import { useNavigation } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { AuthMiddleware } from '../../../redux/Middlewares/AuthMiddleware';
import ImagePicker from 'react-native-image-crop-picker';


const SignupCompleteProfile = (props) => {
  const [vehicle, setVehicle] = useState('');
  const [model, setModel] = useState('');

  const [year, setYear] = useState('');
  const [clr, setClr] = useState('');

  const [license, setLicense] = useState('');
  const [booking, setBooking] = useState('');

  const [nameoncard, setNameOnCard] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');
  const [expiry, setExpiry] = useState('');

  const navigation = useNavigation();
  const StatusList = ['Car', 'SUV', 'Mini Van'];
  const [Status, setStatus] = useState('Car');

  const [cardFront, setCardFront] = useState(null);
  const [cardBack, setCardBack] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const backspace = useRef(false);

  const dispatch = useDispatch();


  const onPressDone = () => {
    if (!nameoncard || !drivingLicense || !vehicle || !model || !clr || !license || !Status || !expiry || !year) {
      alert("Please fill all feilds")
      return;
    }
    let role = props.route.params.userRole;
    if (!cardFront || !cardBack) {
      alert("Please add driving license front and back pictures");
      return;
    }
    dispatch(AuthMiddleware.UpdateProfile({
      license_name: nameoncard,
      license_number: drivingLicense,
      vehicle_brand: vehicle,
      vehicle_model: model,
      vehicle_color: clr,
      vehicle_plate: license,
      vehicle_booking: Status.toLocaleLowerCase(),
      license_expiry: expiry,
      vehicle_year: year,
      role,
      cardBack,
      cardFront,
      image: profilePic,
      onSuccess: () => {
        navigation.navigate("FingerPrint")
      }
    }))
  }

  const pickImage = (type) => {
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
          if (type == "front") {
            setCardFront(img)
          }
          else {
            setCardBack(img)
          }
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
          if (type == "front") {
            setCardFront(img)
          }
          else {
            setCardBack(img)
          }
        })
      }
    }])
  }

  const pickImageProfile = (type) => {
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
    <ImageBackground resizeMode="cover" source={Curve}>
      <ScrollView>
        <View style={{ flex: 1 }}>
          <Header
            title={'Complete Profile'}
            headerLeft={true}
            fontWhite={true}
          />
          <View style={styles.Avatar__View}>
            <Image style={styles.Avatar} source={profilePic ? { uri: profilePic.uri } : Person} />
            <TouchableOpacity style={styles.Avatar__camera} onPress={pickImageProfile}>
              <Ionicons name="camera" size={30} />
            </TouchableOpacity>
          </View>

          <View>
            <TextComponent
              style={styles.Vehicle__}
              text={'Vehicle Details'}
            />
            <View style={styles.Before_After_Main_View_Style}>
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

                  <TextInput
                    value={model}
                    onChangeText={val => setModel(val)}
                  />
                </View>
              </View>

              <View style={styles.Two__inputs}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.InputUpper_text}>Year</Text>

                  <TextInput
                    value={year}
                    onChangeText={val => setYear(val)}
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
                      width: '100%',
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
            </View>

            <View>
              <View>
                <TextComponent
                  style={styles.Vehicle__}
                  text={'Driving License'}
                />
              </View>
              <View style={styles.Before_After_Main_View_Style}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.InputUpper_text}>Name on Card</Text>

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
                      value={expiry}
                      onChangeText={val => {
                        if (backspace.current) {
                          setExpiry(val)
                          return;
                        }
                        if (val.length == 4 || val.length == 7)
                          val = val + "-";

                        setExpiry(val)
                      }}
                      length={10}
                      keyboardType="numeric"
                      onKeyPress={(e) => {
                        backspace.current = e.nativeEvent.key == "Backspace"
                      }}
                    />
                  </View>
                </View>


                <View style={styles.Two__inputs}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => pickImage("front")}>
                    <Text style={styles.InputUpper_text}>
                      Upload Card (Front)
                    </Text>
                    <View style={styles.camera__Image}>
                      <View
                        style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={cardFront ? { uri: cardFront?.uri } : CameraImage} style={{ width: "100%", height: "100%" }} />
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={{ flex: 1 }} onPress={() => pickImage("back")}>
                    <Text style={styles.InputUpper_text}>Upload Card (Back)</Text>
                    <View style={styles.camera__Image}>
                      <View
                        style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={cardBack ? { uri: cardBack?.uri } : CameraImage} style={{ width: "100%", height: "100%" }} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <SubmitButton
                onPress={() => onPressDone()}
                text={'Next'}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={[styles.dot, { marginHorizontal: 10 }]}
                  source={Dot1}
                />
                <Image style={styles.dot} source={Dot2} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default SignupCompleteProfile;

const styles = StyleSheet.create({
  Avatar__View: {
    justifyContent: 'center',
    alignItems: 'center',
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
  camera__Image: {
    width: 140,
    height: 130,
    backgroundColor: 'rgba(236, 240, 241,1.0)',
    borderRadius: 10,
    marginLeft: 5,
  },
  dot: {
    width: 15,
    height: 15,
  },
});
