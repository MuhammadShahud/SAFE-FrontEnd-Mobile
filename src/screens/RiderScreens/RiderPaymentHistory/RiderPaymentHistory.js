import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from '../../../Styles';
import Header from '../../../components/Header';
import Master from '../../../assets/rider/master.png';
import Visa from '../../../assets/rider/visa.png';
import Bank from '../../../assets/rider/bank.png'
import TextComponent from '../../../components/TextComponent';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import { PaymentMiddleware } from '../../../redux/Middlewares/PaymentMiddleware';
import moment from 'moment/moment';

const RiderPaymentHistory = () => {
  const [refreshing, setrefreshing] = useState(false)
  const [loader, setloader] = useState(true)
  const navigation = useNavigation();


  const history = useSelector((state) => state.Payment.paymentHistory)
  const dispatch = useDispatch()

  useEffect(() => {
    setloader(true)
    dispatch(PaymentMiddleware.getPaymentHistory())
      .then(() => setloader(false))
      .catch(() => setloader(false))
  }, [])

  const renderUserList = ({ item }) => {
    return (
      <TouchableOpacity disabled
        // onPress={() => navigation.navigate('RateYourDriver')}
        style={styles.Before_After_Main_View_Style}>

        <View style={styles.direction}>
          <Image style={styles.img} source={item?.payment_method?.brand.toString() == 'visa' ? Visa : item?.payment_method?.brand.toString() == 'master' ? Master : Bank
          } />
          <View style={{ justifyContent: 'center' }}>
            <TextComponent
              style={styles.Heading__txt}
              text={item?.rider.first_name + " " + item?.rider.last_name}
            />
            {item?.type == 'card' ?
              <Text>**************{item?.payment_method?.end_number}</Text>
              : null}
          </View>
          <View
            style={[
              styles.Touch__paid,
              {
                borderColor:
                  item?.is_paid == 1 ? '#00FF00' : '#FF0000',
              },
            ]}>
            <Text
              style={{
                color: item?.is_paid == 1 ? '#00FF00' : '#FF0000',
              }}>
              {item?.is_paid == 1 ? "Paid" : "Failed"}
            </Text>
          </View>
        </View>
        {item?.type != 'card' ?
          <View style={styles.direction_two}>
            <View>
              <TextComponent
                style={styles.Heading__acount}
                text={'Account title'}
              />
              <Text style={styles.grey}>{item?.payment_method.title}</Text>
            </View>
            <View>
              <TextComponent
                style={styles.Heading__acount}
                text={'Account Number'}
              />
              <Text style={styles.grey}>{item?.payment_method.number.toString().substr(0, 4) + "**************"}</Text>
            </View>
          </View>
          : null
        }
        <View
          style={[styles.direction_two, { width: '85%', marginVertical: 19 }]}>
          <View>
            <TextComponent style={styles.Heading__acount} text={'Fee'} />
            <Text style={styles.grey}>${item?.total_amount}</Text>
          </View>
          <View>
            <TextComponent style={styles.Heading__acount} text={'Date'} />
            <Text style={styles.grey}>{moment(item?.created_at).format('ll')}</Text>
          </View>
          <View>
            <TextComponent style={styles.Heading__acount} text={'Total'} />
            <Text style={styles.grey}>${item?.total_amount}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const onRefresh = () => {
    setrefreshing(true)
    dispatch(PaymentMiddleware.getPaymentHistory())
    setrefreshing(false)
  }


  return (
    <View style={styles.mainContainer}>
      <Header title={'Payment History'} headerRight={true} headerLeft={true} />
      {!loader ?
        <FlatList
          data={history}
          keyExtractor={id => id?.id}
          renderItem={renderUserList}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text style={{ color: Colors.LIGHT_GRAY }}>Payment not found</Text>
            </View>
          }
        />
        :
        <ActivityIndicator size={'large'} color={Colors.BLACK} />
      }
    </View>
  );
};

export default RiderPaymentHistory;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  Before_After_Main_View_Style: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 10,
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  img: {
    width: 35,
    height: 30,
    marginVertical: 6,
    marginHorizontal: 6,
  },
  Touch__paid: {
    padding: 10,
    borderWidth: 1,
    // borderColor: '#00FF00',
    borderRadius: 10,
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn__txt: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  Heading__txt: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  direction_two: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  Heading__acount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  grey: {
    color: '#808080',
  },
});
