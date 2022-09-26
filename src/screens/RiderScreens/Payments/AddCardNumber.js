import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../../Styles';
import Header from '../../../components/Header';
import TextComponent from '../../../components/TextComponent';
import TextInput from '../../../components/TextInput';
import SubmitButton from '../../../components/SubmitButton';
import AlertAction from '../../../redux/Actions/AlertActions';
import { useDispatch } from 'react-redux'
import { PaymentMiddleware } from '../../../redux/Middlewares/PaymentMiddleware';
import { useNavigation } from '@react-navigation/native';

const AddCardNumber = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setexpiryDate] = useState('');
  const [CVV, setCVV] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [holderName, setHolderName] = useState('');
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const addCard = () => {
    let dateRegex = /^[0-9]{2}[\/][0-9]{4}$/g;

    let currentMonth = new Date().toISOString();
    let currentYear = new Date().getFullYear();
    let split_expiryDate = '';
    if (expiryDate) {
      split_expiryDate = expiryDate.split('/');
    }

    if (cardNumber.length < 16) {
      dispatch(AlertAction.ShowAlert({ title: "Warning", message: 'Card number must be atleast 16 number!', status: "error" }))
      return;
    }
    if (
      currentMonth.slice(5, 7) === split_expiryDate[0] &&
      currentYear === Number(split_expiryDate[1])
    ) {
      dispatch(AlertAction.ShowAlert({ title: "Warning", message: 'Expiry date is invalid', status: "error" }))
      return;
    }

    if (expiryDate && !dateRegex.test(expiryDate)) {
      dispatch(AlertAction.ShowAlert({ title: "Warning", message: 'Expiry date is invalid', status: "error" }))
      return;
    }

    if (CVV.length < 3) {
      dispatch(AlertAction.ShowAlert({ title: "Warning", message: 'Enter a valid cvv', status: "error" }))
      return;
    }

    if (cardNumber && expiryDate && CVV) {
      let data = {
        card_number: cardNumber,
        cvc: CVV,
        exp_date: expiryDate
      }
      dispatch(PaymentMiddleware.AddCard(data))
        .then((data) => navigation.goBack())
        .catch()

    } else {
      dispatch(AlertAction.ShowAlert({ title: "Warning", message: 'All fields are required.', status: "error" }))
    }
  }


  return (
    <View style={styles.mainContainer}>
      <Header title={'Add Card'} headerRight={true} headerLeft={true} />
      <View style={styles.widthee}>
        <TextComponent style={styles.txt__heading} text={'Card Number'} />
        <View style={styles.input__width}>
          <TextInput
            value={cardNumber}
            length={16}
            onChangeText={val => setCardNumber(val)}
            placeholder={'16 Digit Card Number'}
            placeholderTextColor={Colors.GRAY}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.two__inputs}>
          <View style={styles.input__width__one}>
            <TextComponent
              style={[styles.txt__heading, { marginLeft: 15 }]}
              text={'Expiry Date'}
            />
            <TextInput
              value={expiryDate}
              onChangeText={text => setexpiryDate(text.length == 2 ? text + '/' : text)}
              placeholder={'12/2022'}
              length={7}
              placeholderTextColor={Colors.GRAY}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.input__width__twos}>
            <TextComponent style={styles.txt__heading} text={'CVV'} />
            <TextInput
              value={CVV}
              onChangeText={val => setCVV(val)}
              placeholder={'CVV'}
              length={4}
              placeholderTextColor={Colors.GRAY}
              keyboardType="phone-pad"
            />
          </View>
        </View>
        {/* <View style={styles.two__inputs}>
          <View style={styles.width__simple}>
            <TextComponent
              style={[styles.txt__heading, {marginLeft: 15}]}
              text={'City'}
            />
            <TextInput
              value={city}
              onChangeText={val => setCity(val)}
              placeholder={'City'}
              placeholderTextColor={Colors.GRAY}
            />
          </View>
          <View style={styles.width__simple}>
            <TextComponent
              style={[styles.txt__heading, {marginLeft: 15}]}
              text={'State'}
            />
            <TextInput
              value={state}
              onChangeText={val => setState(val)}
              placeholder={'State'}
              placeholderTextColor={Colors.GRAY}
            />
          </View>
          <View style={styles.width__simple}>
            <TextComponent
              style={[styles.txt__heading, {marginLeft: 15}]}
              text={'Zip'}
            />
            <TextInput
              value={zipCode}
              onChangeText={val => setZipCode(val)}
              placeholder={'Zip Code'}
              placeholderTextColor={Colors.GRAY}
            />
          </View>
        </View> */}
        {/* <TextComponent style={styles.txt__heading} text={"Card Holder's Name"} />
        <View style={styles.input__width}>
          <TextInput
            value={holderName}
            onChangeText={val => setHolderName(val)}
            placeholder={'Card Holder Name'}
            placeholderTextColor={Colors.GRAY}
          />
        </View> */}
      </View>
      <SubmitButton text={'Add Card'} onPress={addCard} />
    </View>
  );
};

export default AddCardNumber;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  widthee: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 20,
  },
  txt__heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  input__width: {
    width: '110%',
    alignSelf: 'center',
  },
  two__inputs: {
    flexDirection: 'row',
    width: '105%',
    alignSelf: 'center',
  },
  input__width__one: {
    width: '60%',
    alignSelf: 'center',
  },
  input__width__twos: {
    width: '40%',
    alignSelf: 'center',
  },
  width__simple: {
    width: '32.5%',
    alignSelf: 'center',
  },
});
