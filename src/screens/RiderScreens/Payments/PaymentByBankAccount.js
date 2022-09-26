import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { Colors } from '../../../Styles';
import TextComponent from '../../../components/TextComponent';
import TextInput from '../../../components/TextInput';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SubmitButton from '../../../components/SubmitButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import AlertAction from '../../../redux/Actions/AlertActions';
import { PaymentMiddleware } from '../../../redux/Middlewares/PaymentMiddleware';
import AuthAction from '../../../redux/Actions/AuthActions';

const PaymentByBankAccount = (props) => {
  const cardDetail = props?.route?.params?.item;
  const [Status, setStatus] = useState('');
  const [BankName, setBankName] = useState(cardDetail?.brand)
  const [accountTitle, setaccountTitle] = useState(cardDetail?.title);
  const [accountNumber, setaccountNumber] = useState(cardDetail?.number ? `${cardDetail?.number}` : '');
  const [routingNumber, setroutingNumber] = useState(cardDetail?.routing_number ? `${cardDetail?.routing_number}` : '');
  const StatusList = ['ABC Bank', 'XYZ Bank'];
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const user = useSelector(state => state.Auth.user);


  const getUserRole = async () => {
    try {
      const value = await AsyncStorage.getItem('User_Role');
      if (value !== null) {
        setuserRole(value);
      }
    } catch (e) { }
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const SubmitBank = () => {
    if (!BankName && !accountTitle && !accountNumber && !routingNumber) {
      dispatch(AlertAction.ShowAlert({ titile: 'Bank Account', message: 'All fields are required' }))
      return;
    } else {
      dispatch(PaymentMiddleware.addBankAccount({
        id: cardDetail?.id ? cardDetail?.id : '',
        bank_name: BankName,
        account_title: accountTitle,
        account_number: accountNumber,
        routing_number: routingNumber
      })).then(async (data) => {
        let userdata = {
          ...user,
          user: { ...user?.user, user_payment_methods: [data] }
        }
        await AsyncStorage.setItem('@user', JSON.stringify(userdata))
        dispatch(AuthAction.UpdateUser({ ...user?.user, user_payment_methods: [data] }))
        if (cardDetail) {
          dispatch(AlertAction.ShowAlert({ title: "Add Account", message: 'Account Updated Successfully.' }))
        } else {
          dispatch(AlertAction.ShowAlert({ title: "Add Account", message: 'Account Added Successfully.' }))

        }
        navigation.goBack()
      })
        .catch()
    }
  }

  const [userRole, setuserRole] = useState('');
  return (
    <View style={styles.mainContainer}>
      <Header title={'Add Bank Account'} headerRight={true} headerLeft={true} />
      <View style={styles.wid}>
        <TextComponent style={styles.txt__head} text={'Bank Name'} />
        <TextInput
          value={BankName}
          onChangeText={val => setBankName(val)}
          placeholder={'Enter Bank Name'}
          placeholderTextColor={Colors.GRAY}
        />
        {/* <SelectDropdown
          data={StatusList}
          onSelect={(selectedItem, index) => {
            setStatus(selectedItem);
            console.log(selectedItem, index);
          }}
          defaultValue={'Select Bank'}
          defaultButtonText={'Select Bank'}
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
        /> */}
      </View>

      <View style={styles.wid}>
        <TextComponent style={styles.txt__head} text={'Account Title'} />
        <View>
          <TextInput
            value={accountTitle}
            onChangeText={val => setaccountTitle(val)}
            placeholder={'Enter Account Title'}
            placeholderTextColor={Colors.GRAY}
          />
        </View>
      </View>

      <View style={styles.wid}>
        <TextComponent style={styles.txt__head} text={'Account Number'} />
        <View>
          <TextInput
            value={accountNumber}
            onChangeText={val => setaccountNumber(val)}
            placeholder={'1233**** ******** ********'}
            placeholderTextColor={Colors.GRAY}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={styles.wid}>
        <TextComponent style={styles.txt__head} text={'Routing Number'} />
        <View>
          <TextInput
            value={routingNumber}
            onChangeText={val => setroutingNumber(val)}
            placeholder={'1234 6454'}
            length={9}
            placeholderTextColor={Colors.GRAY}
            keyboardType="phone-pad"
          />
        </View>
      </View>
      <View style={{ width: '90%', alignSelf: 'center' }}>
        {
          userRole == 'driver' ? <SubmitButton onPress={() => navigation.navigate('FingerPrint')} text={'Next'} /> : <SubmitButton text={'Save'} onPress={() => SubmitBank()} />
        }

      </View>
    </View>
  );
};

export default PaymentByBankAccount;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  txt__head: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  wid: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
  },
});
