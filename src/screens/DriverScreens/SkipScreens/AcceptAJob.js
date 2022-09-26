import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React,
{ useRef } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useNavigation } from '@react-navigation/native';
import SubmitButton from '../../../components/SubmitButton';
import { Colors } from '../../../Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AcceptAJob = () => {
  const navigation = useNavigation();
  const SliderRef = useRef(null)
  const slides = [
    {
      key: 1,
      title: 'Title 1',
      text: 'Accept a Job',
      description:
        'Work with your convenience, take\n the job whenever you need it. ',
      image: require('../../../assets/driver/firstskip.png'),
    },
    {
      key: 2,
      title: 'Title 2',
      text: 'Tracking Realtime',
      description:
        'Know where your customer is\n currently located with the real-time\n tracking.',
      image: require('../../../assets/driver/secondskip.png'),
    },
    {
      key: 3,
      title: 'Rocket guy',
      text: 'Earn Money',
      description: 'Take up the number of jobs and\n increase your earnings',
      image: require('../../../assets/driver/thirdskip.png'),
    },
  ];

  const _renderItem = ({ item, index }) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ height: 300 }}>
          <Image style={styles.img} source={item.image} />
        </View>
        <View style={{ height: 150 }}>
          <Text style={styles.text}>{item?.text}</Text>
          <Text style={{ fontSize: 15, textAlign: 'center', color: '#000' }}>
            {item?.description}
          </Text>
        </View>
        <View style={styles.direction}>
          <TouchableOpacity onPress={() => {
            AsyncStorage.setItem("SAFE-skipped-driver", "true")
            navigation.navigate('DriverDashBoard')
          }}>
            <Text style={{ textAlign: 'center', padding: 18 }}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (item?.key == 3) {
                navigation.navigate('DriverDashBoard');
              }
              else {
                SliderRef.current.goToSlide(index + 1)
              }
            }}
            style={styles.Next__btn_Touch}>
            <Text style={styles.Next__btn}>Next</Text>
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
        onPress={() => navigation.navigate('DriverDashBoard')}
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

export default AcceptAJob;

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
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  direction: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    width: '90%',
  },
  Next__btn: {
    color: '#fff',
    textAlign: 'center',
  },
  Next__btn_Touch: {
    backgroundColor: '#0b0b43',
    padding: 18,
    borderRadius: 20,
    width: 120,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    position: 'absolute',
    bottom: 60,
  },
  button: {
    flex: 1,
    paddingVertical: 20,
    marginHorizontal: 8,
    borderRadius: 24,
    backgroundColor: '#1cb278',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});
