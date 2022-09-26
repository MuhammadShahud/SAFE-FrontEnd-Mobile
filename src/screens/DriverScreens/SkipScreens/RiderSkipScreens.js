import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useRef } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useNavigation } from '@react-navigation/native';
import SubmitButton from '../../../components/SubmitButton';
import { Colors } from '../../../Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RiderSkipScreens = () => {
  const navigation = useNavigation();
  const SliderRef = useRef(null)
  const slides = [
    {
      key: 1,
      title: 'Title 1',
      text: 'Book a rider',
      description:
        'A large network of certified drivers helps you to get a comfortable, safe and cheap ride.',
      image: require('../../../assets/rider/first.png'),
      btnName: 'Next',
    },
    {
      key: 2,
      title: 'Title 2',
      text: 'Confirm your\ndriver',
      description:
        'Huge drivers network helps you find comfortable safe and cheap ride.',
      image: require('../../../assets/driver/carcenter.png'),
      btnName: 'Next',
    },
    {
      key: 3,
      title: 'Rocket guy',
      text: 'Track your ride',
      description:
        'Know your driver in advance and be able to view current location in real time on the map',
      image: require('../../../assets/driver/firstskip.png'),
      btnName: "Let's get started",
    },
  ];

  const _renderItem = ({ item, index }) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ height: 300 }}>
          <Image style={styles.img} source={item.image} />
        </View>
        <View style={{ height: 150, width: '70%', alignSelf: 'center' }}>
          <Text style={styles.text}>{item?.text}</Text>
          <Text
            style={{
              fontSize: 15,
              textAlign: 'center',
              color: '#000',
              //   marginVertical: 6,
            }}>
            {item?.description}
          </Text>
        </View>
        <View style={styles.direction}>
          <TouchableOpacity
            onPress={() => {
              if (item?.key == 3) {
                AsyncStorage.setItem("SAFE-skipped-rider", "true")
                navigation.navigate('RiderDashBoard')
              } else {
                SliderRef.current.goToSlide(index + 1)
              }
            }}
            style={styles.Next__btn_Touch}>
            <Text style={styles.Next__btn}>{item?.btnName}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="chevron-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };

  const _renderDoneButton = () => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('RiderDashBoard')}
        style={styles.buttonCircle}>
        <Icon name="md-checkmark" color="rgba(255, 255, 255, .9)" size={24} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <AppIntroSlider
        ref={SliderRef}
        data={slides}
        renderItem={_renderItem}
        activeDotStyle={{ backgroundColor: Colors.BLUE }}
        bottomButton={false}
        showNextButton={false}
        showDoneButton={false}
      />
    </View>
  );
};

export default RiderSkipScreens;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  img: {
    height: 180,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginVertical: 10,
  },
  direction: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    width: '90%',
  },
  Next__btn: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
  },
  Next__btn_Touch: {
    backgroundColor: '#0b0b43',
    padding: 18,
    borderRadius: 20,
    width: '90%',
  },
});
