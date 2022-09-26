import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {Colors} from '../../../Styles';
import Header from '../../../components/Header';
import TextComponent from '../../../components/TextComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import card from '../../../assets/driver/card.png';
import bankaccount from '../../../assets/driver/backaccount.png';
import {useNavigation} from '@react-navigation/native';

const ContactusPaymentOption = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <Header title={'Contact us'} headerRight={true} headerLeft={true} />
      <View style={styles.center_heading}>
        <TextComponent
          style={styles.txt__heading}
          text={'Account & Payment Option'}
        />
      </View>
      <View style={styles.Before_After_Main_View_Style}>
        <TouchableOpacity
          onPress={() => navigation.navigate('PaymentWithCard')}
          style={styles.pad}>
          <View style={{flexDirection: 'row'}}>
            <Image style={styles.logologo} source={bankaccount} />
            <TextComponent style={styles.txt} text={'Payment with Card'} />
          </View>
          <View>
            <Ionicons color={Colors.BLUE} name="chevron-forward" size={30} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.Before_After_Main_View_Style}>
        <TouchableOpacity
          onPress={() => navigation.navigate('PaymentWithBankAccount')}
          style={styles.pad}>
          <View style={{flexDirection: 'row'}}>
            <Image style={styles.logologo} source={card} />
            <TextComponent
              style={styles.txt}
              text={'Payment with Bank Account'}
            />
          </View>
          <View>
            <Ionicons color={Colors.BLUE} name="chevron-forward" size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContactusPaymentOption;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  txt__heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  center_heading: {
    height: 150,
    justifyContent: 'center',
    alingItems: 'center',
  },
  Before_After_Main_View_Style: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 5,
  },
  pad: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txt: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  logologo: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
});
