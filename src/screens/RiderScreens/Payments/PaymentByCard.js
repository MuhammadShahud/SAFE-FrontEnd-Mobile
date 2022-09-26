import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../../Styles';
import Header from '../../../components/Header';
import TextComponent from '../../../components/TextComponent';
import Master from '../../../assets/rider/master.png';
import Visa from '../../../assets/rider/visa.png';
import Bank from '../../../assets/rider/bank.png'
import Dustbin from '../../../assets/rider/dustbin.png';
import Pen from '../../../assets/driver/pen.png';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import { PaymentMiddleware } from '../../../redux/Middlewares/PaymentMiddleware';
import PaymentAction from '../../../redux/Actions/PaymentActions';

const PaymentByCard = (props) => {
  useEffect(() => {
    dispatch(PaymentMiddleware.getCards())
      .then(() => setloader(false))
      .catch(() => setloader(false))
  }, [])

  const dispatch = useDispatch()
  const userCards = useSelector((state) => state.Payment.cards)
  const isPay = props?.route?.params?.isPay
  const index = props?.route?.params?.index
  const type = props?.route?.params?.type
  const params = props?.route?.params
  const navigation = useNavigation();
  const [refreshing, setrefreshing] = useState(false)
  const [loader, setloader] = useState(true)
  const [SelectedItem, setSelectedItem] = useState(null)

  const onRefresh = () => {
    setrefreshing(true)
    dispatch(PaymentMiddleware.getCards())
    setrefreshing(false)
  }

  const deleteCard = (item) => {
    dispatch(PaymentMiddleware.DeleteCard(item?.id))
  }

  const SelectedCard = (item, type) => {
    setSelectedItem(item)
    if (isPay) {
      let payment = {
        ...item,
        childIndex: index,
        payment_type: type,
      }
      dispatch(PaymentAction.selectedPaymentmethod(payment))
      navigation.goBack()
    }
  }

  const pay = () => {
    let payment = {
      ...SelectedItem,
      payment_type: SelectedItem?.type?.toLowerCase(),
    }
    dispatch(PaymentAction.selectedPaymentmethod(payment))
    navigation.goBack()
  }

  let cards = []
  if (type) {
    cards = userCards.filter(item => item.type == type)
  } else {
    cards = userCards
  }


  return (
    <View style={styles.mainContainer}>
      <Header title={'Payment'} headerRight={true} headerLeft={true} />
      <View style={{ marginVertical: 20 }}>
        <View style={styles.wid}>
          <TextComponent
            style={styles.Heading}
            text={'Credit and Debit Card'}
          />

          <View style={{ maxHeight: 300, marginVertical: 10 }}>
            {loader ?
              <View style={{ justifyContent: 'center', alignItems: 'center', height: 100 }}>
                <ActivityIndicator size={'large'} color={Colors.BLACK} />
              </View>
              :
              <FlatList
                data={cards}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item?.id}
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity style={styles.direction} onPress={() => { isPay ? SelectedCard(item, item?.type?.toLowerCase()) : setSelectedItem(item) }}>
                      <View style={[styles.grey, { elevation: SelectedItem?.id == item.id ? 2 : 0 }]}>
                        <Image style={styles.img} source={item?.brand?.toLowerCase() == 'visa' ? Visa : item?.brand?.toLowerCase() == 'master' ? Master : Bank} />
                        <View style={styles.center}>
                          {item?.type == 'bank_account' ?
                            <Text style={{ fontSize: 16 }}>{item?.number.toString().substr(0, 4) + "*************"}</Text>
                            : <Text style={{ fontSize: 20 }}>*************</Text>}
                        </View>
                      </View>
                      <View style={[styles.dir, { width: '25%' }]}>
                        {item?.type == 'bank_account' ?
                          <TouchableOpacity onPress={() => { navigation.navigate('PaymentByBankAccount', { item }) }}>
                            <Image style={styles.img__one} source={Pen} />
                          </TouchableOpacity>
                          : null}
                        <TouchableOpacity onPress={() => deleteCard(item)}>
                          <Image style={styles.img__one} source={Dustbin} />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  )
                }}
                ListEmptyComponent={
                  <View style={{ height: 100, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: Colors.LIGHT_GRAY }}>Cards Not Found</Text>
                  </View>
                }
              />
            }

          </View>

        </View>


        <View style={styles.dir}>
          {!params?.isCard ?
            <TouchableOpacity
              onPress={() => navigation.navigate('AddCardNumber')}
              style={styles.Touch__btn}>
              <Text style={styles.txt__btn}>Add New Card</Text>
            </TouchableOpacity>
            : null}
          {!params?.isBank ?
            <TouchableOpacity
              onPress={() => navigation.navigate('PaymentByBankAccount')}
              style={styles.Touch__btn}>
              <Text style={styles.txt__btn}>Add Bank Account</Text>
            </TouchableOpacity>
            : null}
        </View>
        {!isPay ?
          <TouchableOpacity style={styles.Pay__btn} onPress={() => pay()}>
            <Text style={styles.Pay__btn__txt}>Pay now</Text>
          </TouchableOpacity>
          : null}
      </View>
    </View>
  );
};

export default PaymentByCard;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  wid: {
    width: '80%',
    alignSelf: 'center',
    // height: 200,
  },
  Heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  direction: {
    flexDirection: 'row',
    marginVertical: 15,
    width: '100%',
    paddingHorizontal: 2
  },
  grey: {
    width: '75%',
    backgroundColor: Colors.BG_GRAY,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
  },
  img: {
    width: 35,
    height: 30,
    marginVertical: 6,
    marginHorizontal: 6,
  },
  center: {
    justifyContent: 'center',
  },
  dir: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img__one: {
    width: 35,
    height: 35,
  },
  Touch__btn: {
    backgroundColor: Colors.BLUE,
    padding: 13,
    borderRadius: 10,
    marginLeft: 5,
  },
  txt__btn: {
    color: Colors.WHITE,
    fontSize: 15,
  },
  Pay__btn: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.BLUE,
    width: '80%',
    marginVertical: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  Pay__btn__txt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.BLUE,
  },
});
